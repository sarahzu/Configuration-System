DROP TABLE IF EXISTS configuration;
DROP TABLE IF EXISTS component;
DROP TABLE IF EXISTS parameter;
DROP TABLE IF EXISTS decision_card;

CREATE TABLE configuration (
  config_id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE component (
  component_id INTEGER PRIMARY KEY AUTOINCREMENT,
  config_id INTEGER NOT NULL,
  component_name TEXT UNIQUE NOT NULL,
  description TEXT UNIQUE,
  width INTEGER,
  height INTEGER,
  x INTEGER,
  y INTEGER,
  enabled BOOLEAN NOT NULL,
  toolbox BOOLEAN NOT NULL,
  FOREIGN KEY (config_id) REFERENCES configuration (config_id)
);

CREATE TABLE parameter (
  parameter_id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL,
  parameter_name TEXT UNIQUE NOT NULL,
  parameter_type TEXT NOT NULL,
  parameter_value TEXT NOT NULL,
  FOREIGN KEY (component_id) REFERENCES component (component_id)
);

CREATE TABLE decision_card (
  decision_card_id INTEGER PRIMARY KEY AUTOINCREMENT,
  config_id INTEGER NOT NULL,
  decision_card_name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL,
  FOREIGN KEY (config_id) REFERENCES configuration (config_id)
);

CREATE TABLE general_settings (
    git_repo_address STRING,
    config_id INTEGER NOT NULL,
  FOREIGN KEY (config_id) REFERENCES configuration (config_id)
)