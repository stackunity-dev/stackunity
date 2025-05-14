import { createError, defineEventHandler, readBody } from 'h3';
import { closeConnectionPool, executeQuery, getConnectionPool } from './pool';

/**
 * API pour changer de base de données
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId, database } = body;

    // Vérifier l'authentification
    const user = event.context.user || { id: 'demo-user' }; // Fallback pour démo

    // Validation des entrées
    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database connection ID is required'
      });
    }

    if (!database) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database name is required'
      });
    }

    // Exécuter la commande USE database
    try {
      // Récupérer les informations de connexion
      const connectionInfo = await getConnectionInfo(connectionId, user.id);

      if (!connectionInfo) {
        throw new Error('Connection not found or you do not have access to it');
      }

      // Selon le type de base de données, on change de base différemment
      switch (connectionInfo.type) {
        case 'mysql':
          // Pour MySQL, on peut utiliser la commande USE
          await executeQuery(connectionId, `USE ${database}`);
          break;

        case 'postgres':
          // Pour PostgreSQL, il faut se reconnecter avec la nouvelle base
          // Fermer l'ancienne connexion et en ouvrir une nouvelle
          await closeConnectionPool(connectionId);

          // Créer un nouveau pool avec la nouvelle base de données
          await getConnectionPool({
            id: connectionId,
            type: connectionInfo.type,
            host: connectionInfo.host,
            port: connectionInfo.port,
            database: database,
            username: connectionInfo.username,
            password: '', // Valeur vide car on utilise encryptedPassword à la place
            encryptedPassword: connectionInfo.password
          });
          break;

        case 'mssql':
          // Pour SQL Server, on peut utiliser la commande USE
          await executeQuery(connectionId, `USE ${database}`);
          break;

        case 'sqlite':
          // Pour SQLite, il faut se reconnecter à un nouveau fichier
          throw new Error('Changing database in SQLite requires reconnection. Not implemented yet.');

        default:
          throw new Error(`Unsupported database type: ${connectionInfo.type}`);
      }

      console.log(`Database changed to ${database} for connection ID: ${connectionId}`);

      return {
        success: true,
        message: `Database changed to ${database}`,
        database
      };
    } catch (error: any) {
      console.error('Error changing database:', error);
      return {
        success: false,
        message: `Failed to change database: ${error.message}`
      };
    }
  } catch (error: any) {
    console.error('Error processing use-database request:', error);
    return {
      success: false,
      error: error.message || 'Failed to change database',
      errorCode: error.statusCode || 500
    };
  }
});

/**
 * Récupère les informations de connexion
 * Dans une vraie application, cette fonction récupérerait les données depuis une base de données
 */
async function getConnectionInfo(connectionId: string, userId: string) {
  // Simulation d'une récupération depuis une base de données
  // Dans une vraie application, vous récupéreriez ces informations depuis votre stockage

  // Pour l'exemple, on utilise un stockage local temporaire
  // Normalement, vous feriez une requête à votre base de données ici
  const connections = global.__connections || {};

  // Vérifier si la connexion existe et appartient à l'utilisateur
  if (connections[connectionId] && connections[connectionId].userId === userId) {
    return connections[connectionId];
  }

  // Si la connexion n'existe pas dans notre stockage temporaire,
  // on peut essayer de la récupérer depuis localStorage pour la démo
  // (Dans une vraie application, vous ne feriez pas ça)
  try {
    // Simuler la récupération depuis une API ou une base de données
    // Pour la démo, on retourne une connexion factice si l'ID correspond à un format spécifique
    if (connectionId.startsWith('demo')) {
      return {
        id: connectionId,
        name: connectionId === 'demo1' ? 'MySQL Demo' : 'PostgreSQL Demo',
        type: connectionId === 'demo1' ? 'mysql' : 'postgres',
        host: 'localhost',
        port: connectionId === 'demo1' ? 3306 : 5432,
        database: 'demo_db',
        username: 'demo_user',
        password: 'encrypted:70617373776f7264313233:1644154826000', // Mot de passe chiffré
        userId: userId
      };
    }
  } catch (error) {
    console.error('Error retrieving connection info:', error);
  }

  return null;
} 