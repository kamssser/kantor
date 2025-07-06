-- =====================================================
-- ADMIN PANEL DATABASE SETUP UNTUK HOSTING
-- Database: karnssset_hfmedia
-- User: karnssset_hfmedia
-- =====================================================

-- GUNAKAN DATABASE YANG SUDAH ADA
USE karnssset_hfmedia;

-- =====================================================
-- BUAT TABEL-TABEL YANG DIPERLUKAN
-- =====================================================

-- 1. Tabel users
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
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role)
);

-- 2. Tabel products
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_price (price)
);

-- 3. Tabel orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    items_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_customer_email (customer_email),
    INDEX idx_created_at (created_at)
);

-- 4. Tabel order_items (untuk detail order)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- 5. Insert sample users
INSERT IGNORE INTO users (name, email, password, role, status, last_login) VALUES
('John Doe', 'john@example.com', '$2b$10$hash1', 'admin', 'active', '2024-01-20 10:30:00'),
('Jane Smith', 'jane@example.com', '$2b$10$hash2', 'user', 'active', '2024-01-19 15:45:00'),
('Mike Johnson', 'mike@example.com', '$2b$10$hash3', 'moderator', 'inactive', '2024-01-18 09:15:00'),
('Sarah Wilson', 'sarah@example.com', '$2b$10$hash4', 'user', 'active', '2024-01-20 14:20:00'),
('David Brown', 'david@example.com', '$2b$10$hash5', 'user', 'active', '2024-01-17 11:10:00'),
('Lisa Garcia', 'lisa@example.com', '$2b$10$hash6', 'moderator', 'active', '2024-01-16 16:25:00'),
('Tom Wilson', 'tom@example.com', '$2b$10$hash7', 'user', 'inactive', '2024-01-15 08:45:00'),
('Emma Davis', 'emma@example.com', '$2b$10$hash8', 'user', 'active', '2024-01-21 13:30:00');

-- 6. Insert sample products
INSERT IGNORE INTO products (name, category, price, stock, status, description) VALUES
('Wireless Headphones', 'Electronics', 99.99, 45, 'active', 'High-quality wireless headphones with noise cancellation and 20-hour battery life'),
('Smart Watch', 'Electronics', 299.99, 23, 'active', 'Advanced smartwatch with health monitoring, GPS, and water resistance'),
('Coffee Maker', 'Appliances', 149.99, 0, 'inactive', 'Automatic coffee maker with programmable settings and thermal carafe'),
('Bluetooth Speaker', 'Electronics', 79.99, 67, 'active', 'Portable Bluetooth speaker with excellent sound quality and 12-hour battery'),
('Laptop Stand', 'Accessories', 49.99, 34, 'active', 'Adjustable laptop stand for ergonomic working, compatible with all laptop sizes'),
('Wireless Mouse', 'Electronics', 29.99, 89, 'active', 'Ergonomic wireless mouse with precision tracking and long battery life'),
('USB-C Hub', 'Accessories', 69.99, 56, 'active', '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader'),
('Phone Case', 'Accessories', 19.99, 120, 'active', 'Protective phone case with shock absorption and wireless charging support'),
('Tablet', 'Electronics', 399.99, 15, 'active', '10-inch tablet with high-resolution display and long battery life'),
('Desk Lamp', 'Furniture', 89.99, 28, 'active', 'LED desk lamp with adjustable brightness and color temperature');

-- 7. Insert sample orders
INSERT IGNORE INTO orders (id, customer_name, customer_email, amount, status, items_count) VALUES
('ORD-001', 'John Doe', 'john@example.com', 299.99, 'completed', 1),
('ORD-002', 'Jane Smith', 'jane@example.com', 149.99, 'processing', 1),
('ORD-003', 'Mike Johnson', 'mike@example.com', 99.99, 'pending', 1),
('ORD-004', 'Sarah Wilson', 'sarah@example.com', 179.98, 'completed', 2),
('ORD-005', 'David Brown', 'david@example.com', 79.99, 'processing', 1),
('ORD-006', 'Lisa Garcia', 'lisa@example.com', 119.98, 'completed', 2),
('ORD-007', 'Emma Davis', 'emma@example.com', 399.99, 'pending', 1),
('ORD-008', 'Tom Wilson', 'tom@example.com', 49.99, 'cancelled', 1),
('ORD-009', 'John Doe', 'john@example.com', 89.99, 'completed', 1),
('ORD-010', 'Jane Smith', 'jane@example.com', 69.99, 'processing', 1);

-- 8. Insert sample order items
INSERT IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES
('ORD-001', 2, 1, 299.99),
('ORD-002', 3, 1, 149.99),
('ORD-003', 1, 1, 99.99),
('ORD-004', 1, 1, 99.99),
('ORD-004', 4, 1, 79.99),
('ORD-005', 4, 1, 79.99),
('ORD-006', 6, 2, 29.99),
('ORD-006', 8, 3, 19.99),
('ORD-007', 9, 1, 399.99),
('ORD-008', 5, 1, 49.99),
('ORD-009', 10, 1, 89.99),
('ORD-010', 7, 1, 69.99);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- 9. Verify data insertion
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as record_count FROM products
UNION ALL
SELECT 'Orders' as table_name, COUNT(*) as record_count FROM orders
UNION ALL
SELECT 'Order Items' as table_name, COUNT(*) as record_count FROM order_items;

-- 10. Show sample data
SELECT 'Sample Users:' as info;
SELECT id, name, email, role, status FROM users LIMIT 5;

SELECT 'Sample Products:' as info;
SELECT id, name, category, price, stock, status FROM products LIMIT 5;

SELECT 'Sample Orders:' as info;
SELECT id, customer_name, amount, status, items_count FROM orders LIMIT 5;

-- =====================================================
-- DASHBOARD STATS QUERY
-- =====================================================

-- 11. Dashboard stats untuk testing
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM products WHERE status = 'active') as active_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'completed') as total_revenue;

-- =====================================================
-- SETUP COMPLETE!
-- Database: karnssset_hfmedia sudah siap digunakan
-- =====================================================