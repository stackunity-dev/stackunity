-- Schéma pour la base de données StackUnity

-- Table pour stocker les informations de connexion aux bases de données
CREATE TABLE IF NOT EXISTS database_info (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  host VARCHAR(255) NOT NULL,
  port INT NOT NULL,
  database_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Index pour accélérer les recherches par utilisateur
  INDEX idx_user_id (user_id)
);

-- Table pour stocker les requêtes sauvegardées
CREATE TABLE IF NOT EXISTS saved_queries (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  connection_id VARCHAR(36) NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  query_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  FOREIGN KEY (connection_id) REFERENCES database_info(id) ON DELETE SET NULL
); 