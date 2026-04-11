-- -----------------------------------------------------
-- Tabla: dev_profile
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS dev_profile (
  profile_id INT PRIMARY KEY AUTO_INCREMENT,
  password VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NULL,
  presentation TEXT NULL,
  github_link VARCHAR(500) NULL,
  linkedin VARCHAR(500) NULL,
  gmail VARCHAR(500) NULL,
  instagram VARCHAR(500) NULL,
  x VARCHAR(500) NULL,
  fiverr VARCHAR(500) NULL,
  phone VARCHAR(50) NULL,
  cv VARCHAR(500) NULL,
  tags VARCHAR(1000) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabla: projects
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  project_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  github VARCHAR(500) NULL,
  github_backend VARCHAR(500) NULL,
  github_crud VARCHAR(500) NULL,
  demo VARCHAR(500) NULL,
  featured BOOLEAN DEFAULT FALSE,
  deployed BOOLEAN NULL,
  monorepo VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabla: project_tags
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_tags (
  tag_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  tag VARCHAR(100) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabla: project_images
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS project_images (
  image_id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  alt VARCHAR(255) NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabla: skill_categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  label VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabla: skills
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  display_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabla: contact_messages
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  readed_at DATETIME NULL
);
