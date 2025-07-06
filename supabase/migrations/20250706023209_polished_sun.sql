-- Database Schema for Admin Panel
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS admin_panel;
USE admin_panel;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'moderator') DEFAULT 'user',
    status ENUM('active', 'inactive') DEFAULT 'active',
    avatar VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    items_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items table (for detailed order tracking)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password, role, status, last_login) VALUES
('John Doe', 'john@example.com', '$2b$10$hash1', 'admin', 'active', '2024-01-20 10:30:00'),
('Jane Smith', 'jane@example.com', '$2b$10$hash2', 'user', 'active', '2024-01-19 15:45:00'),
('Mike Johnson', 'mike@example.com', '$2b$10$hash3', 'moderator', 'inactive', '2024-01-18 09:15:00'),
('Sarah Wilson', 'sarah@example.com', '$2b$10$hash4', 'user', 'active', '2024-01-20 14:20:00');

INSERT INTO products (name, category, price, stock, status, description) VALUES
('Wireless Headphones', 'Electronics', 99.99, 45, 'active', 'High-quality wireless headphones with noise cancellation'),
('Smart Watch', 'Electronics', 299.99, 23, 'active', 'Advanced smartwatch with health monitoring features'),
('Coffee Maker', 'Appliances', 149.99, 0, 'inactive', 'Automatic coffee maker with programmable settings'),
('Bluetooth Speaker', 'Electronics', 79.99, 67, 'active', 'Portable Bluetooth speaker with excellent sound quality'),
('Laptop Stand', 'Accessories', 49.99, 34, 'active', 'Adjustable laptop stand for ergonomic working');

INSERT INTO orders (id, customer_name, customer_email, amount, status, items_count) VALUES
('ORD-001', 'John Doe', 'john@example.com', 299.99, 'completed', 2),
('ORD-002', 'Jane Smith', 'jane@example.com', 149.99, 'processing', 1),
('ORD-003', 'Mike Johnson', 'mike@example.com', 99.99, 'pending', 1),
('ORD-004', 'Sarah Wilson', 'sarah@example.com', 179.98, 'completed', 2),
('ORD-005', 'David Brown', 'david@example.com', 79.99, 'processing', 1);

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('ORD-001', 2, 1, 299.99),
('ORD-002', 3, 1, 149.99),
('ORD-003', 1, 1, 99.99),
('ORD-004', 1, 1, 99.99),
('ORD-004', 4, 1, 79.99),
('ORD-005', 4, 1, 79.99);