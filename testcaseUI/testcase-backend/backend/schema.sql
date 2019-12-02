DROP TABLE IF EXISTS configuration;
DROP TABLE IF EXISTS component;
DROP TABLE IF EXISTS parameter;
DROP TABLE IF EXISTS decision_card;
DROP TABLE IF EXISTS private_vehicles;
DROP TABLE IF EXISTS model;
DROP TABLE IF EXISTS general_settings;

CREATE TABLE configuration (
  config_id INTEGER PRIMARY KEY AUTOINCREMENT
);

INSERT INTO configuration (config_id) VALUES (1);

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
    is_active BOOLEAN NOT NULL,
    output_json STRING,
    FOREIGN KEY (config_id) REFERENCES configuration (config_id)
);

CREATE TABLE model (
    model_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    config_id INTEGER NOT NULL,
    model_name TEXT UNIQUE NOT NULL,
    FOREIGN KEY (config_id) REFERENCES configuration (config_id)
);

CREATE TABLE private_vehicles (
  model_id INTEGER,
  model_name TEXT NOT NULL,
  name TEXT UNIQUE NOT NULL,
  first_unit_name TEXT,
  second_unit_name TEXT,
  first_unit_value TEXT,
  second_unit_value TEXT,
  FOREIGN KEY (model_id) REFERENCES model (model_id)
);

INSERT INTO private_vehicles (
model_id, model_name, name, first_unit_name, second_unit_name, first_unit_value, second_unit_value)
VALUES (1, 'Private Vehicles', 'Stock', 'Number of Vehicles', 'Tons of Materials', '1000', '22000');

INSERT INTO model (config_id, model_name) VALUES (1, 'Private Vehicles');
INSERT INTO model (config_id, model_name) VALUES (1, 'Public Vehicles');
INSERT INTO model (config_id, model_name) VALUES (1, 'Residential Buildings');
INSERT INTO model (config_id, model_name) VALUES (1, 'Other Buildings');
INSERT INTO model (config_id, model_name) VALUES (1, 'Infrastructure');
INSERT INTO model (config_id, model_name) VALUES (1, 'End of Life Mgmt.');
INSERT INTO model (config_id, model_name) VALUES (1, 'Industry');
INSERT INTO model (config_id, model_name) VALUES (1, 'Energy');









