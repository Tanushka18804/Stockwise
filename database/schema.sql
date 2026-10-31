CREATE DATABASE IF NOT EXISTS stockwise_db;
USE stockwise_db;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    sku VARCHAR(60) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO products (name, sku, category, price, quantity, reorder_level) VALUES
('Wireless Mouse', 'ELEC-001', 'Electronics', 799.00, 25, 5),
('Mechanical Keyboard', 'ELEC-002', 'Electronics', 2499.00, 8, 5),
('Office Chair', 'FURN-001', 'Furniture', 5499.00, 3, 5),
('Notebook Pack', 'STAT-001', 'Stationery', 199.00, 40, 10);
