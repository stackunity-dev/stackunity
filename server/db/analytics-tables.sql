-- Tables pour le système d'analytics
-- Créer les tables si elles n'existent pas

-- Table des sites web suivis
CREATE TABLE IF NOT EXISTS analytics_websites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_id VARCHAR(36) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tracking_id (tracking_id)
);

-- Table des visiteurs
CREATE TABLE IF NOT EXISTS analytics_visitors (
  visitor_id VARCHAR(36) PRIMARY KEY,
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visit_count INT DEFAULT 1,
  INDEX idx_last_activity (last_activity)
);

-- Table des sessions
CREATE TABLE IF NOT EXISTS analytics_sessions (
  session_id VARCHAR(36) PRIMARY KEY,
  website_id INT NOT NULL,
  visitor_id VARCHAR(36) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NULL,
  duration INT NULL,
  device_type VARCHAR(20) NOT NULL,
  browser VARCHAR(100) NOT NULL,
  os VARCHAR(50) NOT NULL,
  referrer VARCHAR(255) NULL,
  landing_page VARCHAR(255) NOT NULL,
  exit_page VARCHAR(255) NULL,
  is_bounce BOOLEAN DEFAULT FALSE,
  is_complete BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_website_id (website_id),
  INDEX idx_visitor_id (visitor_id),
  INDEX idx_start_time (start_time),
  FOREIGN KEY (website_id) REFERENCES analytics_websites(id) ON DELETE CASCADE,
  FOREIGN KEY (visitor_id) REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE
);

-- Table des vues de page
CREATE TABLE IF NOT EXISTS analytics_pageviews (
  pageview_id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  website_id INT NOT NULL,
  page_url VARCHAR(255) NOT NULL,
  page_title VARCHAR(255) NOT NULL,
  enter_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP NULL,
  duration INT NULL,
  scroll_depth INT NULL,
  utm_source VARCHAR(100) NULL,
  utm_medium VARCHAR(100) NULL,
  utm_campaign VARCHAR(100) NULL,
  referrer VARCHAR(255) NULL,
  INDEX idx_session_id (session_id),
  INDEX idx_website_id (website_id),
  INDEX idx_enter_time (enter_time),
  FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES analytics_websites(id) ON DELETE CASCADE
);

-- Table des interactions
CREATE TABLE IF NOT EXISTS analytics_interactions (
  interaction_id VARCHAR(36) PRIMARY KEY,
  pageview_id VARCHAR(36) NOT NULL,
  website_id INT NOT NULL,
  session_id VARCHAR(36) NOT NULL,
  interaction_type VARCHAR(50) NOT NULL,
  element_selector VARCHAR(255) NOT NULL,
  element_text TEXT NULL,
  timestamp TIMESTAMP NOT NULL,
  value_data JSON NULL,
  INDEX idx_pageview_id (pageview_id),
  INDEX idx_website_id (website_id),
  INDEX idx_session_id (session_id),
  INDEX idx_interaction_type (interaction_type),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (pageview_id) REFERENCES analytics_pageviews(pageview_id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES analytics_websites(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE
);

-- Table des erreurs
CREATE TABLE IF NOT EXISTS analytics_errors (
  error_id VARCHAR(36) PRIMARY KEY,
  pageview_id VARCHAR(36) NOT NULL,
  website_id INT NOT NULL,
  session_id VARCHAR(36) NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT NULL,
  timestamp TIMESTAMP NOT NULL,
  browser_info VARCHAR(255) NULL,
  INDEX idx_pageview_id (pageview_id),
  INDEX idx_website_id (website_id),
  INDEX idx_session_id (session_id),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (pageview_id) REFERENCES analytics_pageviews(pageview_id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES analytics_websites(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE
);

-- Table des événements personnalisés
CREATE TABLE IF NOT EXISTS analytics_custom_events (
  event_id VARCHAR(36) PRIMARY KEY,
  pageview_id VARCHAR(36) NOT NULL,
  website_id INT NOT NULL,
  session_id VARCHAR(36) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  properties JSON NULL,
  INDEX idx_pageview_id (pageview_id),
  INDEX idx_website_id (website_id),
  INDEX idx_session_id (session_id),
  INDEX idx_event_name (event_name),
  INDEX idx_event_category (event_category),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (pageview_id) REFERENCES analytics_pageviews(pageview_id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES analytics_websites(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE
); 