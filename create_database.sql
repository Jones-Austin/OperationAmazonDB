DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,1),
    image VARCHAR(255),
    description TEXT,
    stock INT DEFAULT 0
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO users (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com');

INSERT INTO products (name, category, price, rating, image, description, stock) VALUES
('Wireless Headphones', 'Electronics', 99.99, 4.5, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 'Comfortable wireless headphones with clear sound and noise-reducing ear cushions.', 50),
('Running Shoes', 'Fashion', 59.99, 4.2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 'Lightweight running shoes designed for everyday training, walking, and comfort.', 100),
('Coffee Maker', 'Home', 79.99, 4.0, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', 'Easy-to-use coffee maker for quick brewing at home, in dorms, or in small offices.', 30),
('Smartphone', 'Electronics', 699.99, 4.7, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', 'Modern smartphone with a large display, fast performance, and a clean design.', 20),
('Jacket', 'Fashion', 89.99, 4.3, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80', 'Stylish everyday jacket that works well for casual outfits and cooler weather.', 45),
('Blender', 'Home', 49.99, 4.1, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80', 'Compact blender for smoothies, shakes, and simple kitchen preparation.', 60);

INSERT INTO orders (user_id, order_date, total_amount) VALUES
(1, '2026-03-30 10:00:00', 299.97),
(2, '2026-03-31 14:30:00', 699.99);

INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES
(1, 1, 3, 99.99),
(2, 4, 1, 699.99);