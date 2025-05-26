import { createError, defineEventHandler, readBody } from 'h3';
import type { RowDataPacket } from 'mysql2/promise';
import type { Column, DatabaseNode, Relation } from '../../../types/database';
import { query } from '../../database/db';
import { getConnectionPool } from './pool';

interface ConnectionInfo extends RowDataPacket {
  id: string;
  type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password_encrypted: string;
}

interface TableInfo extends RowDataPacket {
  name: string;
  type: string;
  rowCount: number;
}

interface ColumnInfo extends RowDataPacket {
  name: string;
  type: string;
  nullable: string;
  default_value: string | null;
  key_type: string;
  extra: string;
}

interface RelationInfo extends RowDataPacket {
  name: string;
  source_table: string;
  source_column: string;
  target_table: string;
  target_column: string;
  relation_type: 'incoming' | 'outgoing';
}

interface ViewInfo extends RowDataPacket {
  name: string;
  definition: string;
}

interface IndexInfo extends RowDataPacket {
  name: string;
  table_name: string;
  columns: string;
  type: string;
}

export default defineEventHandler(async (event): Promise<{ success: boolean; structure: DatabaseNode[] }> => {
  try {
    const { connectionId } = await readBody(event);

    // Récupérer les informations de connexion
    const connectionInfo = await query<ConnectionInfo[]>(
      'SELECT * FROM database_info WHERE id = ?',
      [connectionId]
    );

    if (!connectionInfo[0]) {
      throw createError({
        statusCode: 404,
        message: 'Connexion non trouvée'
      });
    }

    const connection = await getConnectionPool({
      id: connectionId,
      type: connectionInfo[0].type,
      host: connectionInfo[0].host,
      port: connectionInfo[0].port,
      database: connectionInfo[0].database_name,
      username: connectionInfo[0].username,
      password: connectionInfo[0].password_encrypted
    });

    if (!connection) {
      throw createError({
        statusCode: 404,
        message: 'Connexion non trouvée'
      });
    }

    console.log('Connexion établie avec succès:', {
      type: connection.type,
      database: connectionInfo[0].database_name
    });

    const structure: DatabaseNode[] = [];
    const dbType = connection.type.toLowerCase();

    try {
      const tables = await query<TableInfo[]>(`
        SELECT 
          table_name as name,
          table_type as type,
          table_rows as rowCount
        FROM information_schema.tables 
        WHERE table_schema = ?
        ORDER BY table_name
      `, [connectionInfo[0].database_name]);

      console.log('Tables récupérées:', tables.length);

      for (const table of tables) {
        console.log('Traitement de la table:', table.name);
        const columns = await query<ColumnInfo[]>(`
          SELECT 
            column_name as name,
            data_type as type,
            is_nullable as nullable,
            column_default as default_value,
            column_key as key_type,
            extra
          FROM information_schema.columns 
          WHERE table_schema = ? AND table_name = ?
          ORDER BY ordinal_position
        `, [connectionInfo[0].database_name, table.name]);

        const relations = await query<RelationInfo[]>(`
          SELECT 
            kcu.constraint_name as name,
            kcu.table_name as source_table,
            kcu.column_name as source_column,
            kcu.referenced_table_name as target_table,
            kcu.referenced_column_name as target_column,
            'outgoing' as relation_type
          FROM information_schema.key_column_usage kcu
          JOIN information_schema.table_constraints tc 
            ON kcu.constraint_name = tc.constraint_name
            AND kcu.table_schema = tc.table_schema
          WHERE kcu.table_schema = ? 
          AND kcu.table_name = ?
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.referenced_table_name IS NOT NULL
          
          UNION ALL
          
          SELECT 
            kcu.constraint_name as name,
            kcu.referenced_table_name as source_table,
            kcu.referenced_column_name as source_column,
            kcu.table_name as target_table,
            kcu.column_name as target_column,
            'incoming' as relation_type
          FROM information_schema.key_column_usage kcu
          JOIN information_schema.table_constraints tc 
            ON kcu.constraint_name = tc.constraint_name
            AND kcu.table_schema = tc.table_schema
          WHERE kcu.table_schema = ? 
          AND kcu.referenced_table_name = ?
          AND tc.constraint_type = 'FOREIGN KEY'
        `, [connectionInfo[0].database_name, table.name, connectionInfo[0].database_name, table.name]);

        const formattedColumns: Column[] = columns.map(col => ({
          name: col.name,
          type: col.type,
          nullable: col.nullable === 'YES',
          default: col.default_value,
          isPrimary: col.key_type === 'PRI',
          index: col.key_type === 'MUL' ? 'INDEX' : undefined
        }));

        const formattedRelations: Relation[] = relations.map(rel => ({
          name: rel.name,
          type: 'foreign',
          description: rel.relation_type === 'outgoing'
            ? `${rel.source_table}.${rel.source_column} → ${rel.target_table}.${rel.target_column}`
            : `${rel.source_table}.${rel.source_column} → ${rel.target_table}.${rel.target_column}`
        }));

        structure.push({
          name: table.name,
          type: 'table',
          rowCount: table.rowCount,
          columns: formattedColumns,
          relations: formattedRelations
        });
      }

      const views = await query<ViewInfo[]>(`
        SELECT 
          table_name as name,
          view_definition as definition
        FROM information_schema.views 
        WHERE table_schema = ?
        ORDER BY table_name
      `, [connectionInfo[0].database_name]);

      for (const view of views) {
        structure.push({
          name: view.name,
          type: 'view',
          definition: view.definition
        });
      }

      const indexes = await query<IndexInfo[]>(`
        SELECT 
          index_name as name,
          table_name as table_name,
          GROUP_CONCAT(column_name ORDER BY seq_in_index) as columns,
          index_type as type
        FROM information_schema.statistics
        WHERE table_schema = ?
        GROUP BY index_name, table_name, index_type
        ORDER BY table_name, index_name
      `, [connectionInfo[0].database_name]);

      for (const index of indexes) {
        structure.push({
          name: index.name,
          type: 'index',
          table: index.table_name,
          columns: index.columns.split(',').map(col => ({
            name: col.trim(),
            type: 'varchar',
            nullable: false,
            default: null,
            isPrimary: index.name === 'PRIMARY'
          }))
        });
      }

      return {
        success: true,
        structure
      };

    } catch (error) {
      console.error('Erreur lors de la récupération de la structure:', error);
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération de la structure de la base de données'
      });
    }

  } catch (error) {
    console.error('Erreur lors de la récupération de la structure:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération de la structure de la base de données'
    });
  }
}); 