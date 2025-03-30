interface SQLTemplate {
  name: string;
  description: string;
  tables: Table[];
}

interface Table {
  name: string;
  columns: Column[];
  primaryKey?: string;
  foreignKeys?: ForeignKey[];
  indices?: Index[];
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  unique?: boolean;
  autoIncrement?: boolean;
}

interface ForeignKey {
  columns: string[];
  referenceTable: string;
  referenceColumns: string[];
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

interface Index {
  name: string;
  columns: string[];
  unique?: boolean;
}

const sqlTemplates: Record<string, SQLTemplate> = {
  blog: {
    name: 'Blog System',
    description: 'A template for a basic blog with users, posts, categories, and comments',
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'username', type: 'VARCHAR(50)', nullable: false, unique: true },
          { name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true },
          { name: 'password', type: 'VARCHAR(255)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: true }
        ],
        primaryKey: 'id',
        indices: [
          { name: 'idx_users_email', columns: ['email'], unique: true }
        ]
      },
      {
        name: 'categories',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'name', type: 'VARCHAR(50)', nullable: false },
          { name: 'slug', type: 'VARCHAR(50)', nullable: false, unique: true },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' }
        ],
        primaryKey: 'id'
      },
      {
        name: 'posts',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'user_id', type: 'INT', nullable: false },
          { name: 'category_id', type: 'INT', nullable: false },
          { name: 'title', type: 'VARCHAR(100)', nullable: false },
          { name: 'slug', type: 'VARCHAR(100)', nullable: false, unique: true },
          { name: 'content', type: 'TEXT', nullable: false },
          { name: 'status', type: 'ENUM("draft", "published")', nullable: false, default: '"draft"' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: true }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['user_id'],
            referenceTable: 'users',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          },
          {
            columns: ['category_id'],
            referenceTable: 'categories',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          }
        ],
        indices: [
          { name: 'idx_posts_slug', columns: ['slug'], unique: true }
        ]
      },
      {
        name: 'comments',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'post_id', type: 'INT', nullable: false },
          { name: 'user_id', type: 'INT', nullable: false },
          { name: 'content', type: 'TEXT', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['post_id'],
            referenceTable: 'posts',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          },
          {
            columns: ['user_id'],
            referenceTable: 'users',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      }
    ]
  },
  ecommerce: {
    name: 'E-commerce Store',
    description: 'A template for an online store with products, categories, orders, and customers',
    tables: [
      {
        name: 'customers',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true },
          { name: 'password', type: 'VARCHAR(255)', nullable: false },
          { name: 'first_name', type: 'VARCHAR(50)', nullable: false },
          { name: 'last_name', type: 'VARCHAR(50)', nullable: false },
          { name: 'phone', type: 'VARCHAR(20)', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' }
        ],
        primaryKey: 'id'
      },
      {
        name: 'categories',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'name', type: 'VARCHAR(50)', nullable: false },
          { name: 'slug', type: 'VARCHAR(50)', nullable: false, unique: true },
          { name: 'parent_id', type: 'INT', nullable: true }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['parent_id'],
            referenceTable: 'categories',
            referenceColumns: ['id'],
            onDelete: 'SET NULL'
          }
        ]
      },
      {
        name: 'products',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'category_id', type: 'INT', nullable: false },
          { name: 'name', type: 'VARCHAR(100)', nullable: false },
          { name: 'slug', type: 'VARCHAR(100)', nullable: false, unique: true },
          { name: 'description', type: 'TEXT', nullable: true },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'stock', type: 'INT', nullable: false, default: '0' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: true }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['category_id'],
            referenceTable: 'categories',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'customer_id', type: 'INT', nullable: false },
          { name: 'status', type: 'ENUM("pending", "processing", "shipped", "delivered", "cancelled")', nullable: false, default: '"pending"' },
          { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: true }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['customer_id'],
            referenceTable: 'customers',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      },
      {
        name: 'order_items',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'order_id', type: 'INT', nullable: false },
          { name: 'product_id', type: 'INT', nullable: false },
          { name: 'quantity', type: 'INT', nullable: false },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['order_id'],
            referenceTable: 'orders',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          },
          {
            columns: ['product_id'],
            referenceTable: 'products',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      }
    ]
  },
  project_management: {
    name: 'Project Management',
    description: 'A template for managing projects, tasks, and team members',
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'username', type: 'VARCHAR(50)', nullable: false, unique: true },
          { name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true },
          { name: 'password', type: 'VARCHAR(255)', nullable: false },
          { name: 'name', type: 'VARCHAR(100)', nullable: false },
          { name: 'role', type: 'ENUM("admin", "manager", "member")', nullable: false, default: '"member"' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' }
        ],
        primaryKey: 'id'
      },
      {
        name: 'projects',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'name', type: 'VARCHAR(100)', nullable: false },
          { name: 'description', type: 'TEXT', nullable: true },
          { name: 'start_date', type: 'DATE', nullable: false },
          { name: 'end_date', type: 'DATE', nullable: true },
          { name: 'status', type: 'ENUM("planning", "active", "completed", "on_hold")', nullable: false, default: '"planning"' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: true }
        ],
        primaryKey: 'id'
      },
      {
        name: 'project_members',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'project_id', type: 'INT', nullable: false },
          { name: 'user_id', type: 'INT', nullable: false },
          { name: 'role', type: 'ENUM("owner", "member")', nullable: false, default: '"member"' },
          { name: 'joined_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['project_id'],
            referenceTable: 'projects',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          },
          {
            columns: ['user_id'],
            referenceTable: 'users',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          }
        ],
        indices: [
          { name: 'idx_project_members_unique', columns: ['project_id', 'user_id'], unique: true }
        ]
      },
      {
        name: 'tasks',
        columns: [
          { name: 'id', type: 'INT', nullable: false, autoIncrement: true },
          { name: 'project_id', type: 'INT', nullable: false },
          { name: 'assigned_to', type: 'INT', nullable: true },
          { name: 'title', type: 'VARCHAR(100)', nullable: false },
          { name: 'description', type: 'TEXT', nullable: true },
          { name: 'priority', type: 'ENUM("low", "medium", "high", "urgent")', nullable: false, default: '"medium"' },
          { name: 'status', type: 'ENUM("todo", "in_progress", "review", "done")', nullable: false, default: '"todo"' },
          { name: 'due_date', type: 'DATE', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: true }
        ],
        primaryKey: 'id',
        foreignKeys: [
          {
            columns: ['project_id'],
            referenceTable: 'projects',
            referenceColumns: ['id'],
            onDelete: 'CASCADE'
          },
          {
            columns: ['assigned_to'],
            referenceTable: 'users',
            referenceColumns: ['id'],
            onDelete: 'SET NULL'
          }
        ]
      }
    ]
  }
};

export function getSQLTemplate(templateName: string): SQLTemplate | null {
  return sqlTemplates[templateName] || null;
}

export function getSQLTemplateNames(): { value: string; title: string, description: string }[] {
  return Object.entries(sqlTemplates).map(([key, template]) => ({
    value: key,
    title: template.name,
    description: template.description
  }));
}

export default sqlTemplates; 