-- Tạo database mới
DROP DATABASE IF EXISTS flower_shop;
CREATE DATABASE flower_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flower_shop;

-- Tạo bảng users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo bảng flowers
CREATE TABLE flowers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category ENUM('ROSE', 'LILY', 'ORCHID', 'SUNFLOWER', 'CHRYSANTHEMUM', 
                 'CARNATION', 'TULIP', 'DAISY', 'LOTUS', 'PEONY', 
                 'HYDRANGEA', 'BABY_BREATH') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo bảng warehouses (kho)
CREATE TABLE warehouses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo bảng inventory (tồn kho)
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id BIGINT NOT NULL,
    flower_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
    FOREIGN KEY (flower_id) REFERENCES flowers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_warehouse_flower (warehouse_id, flower_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo bảng orders (đơn hàng)
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(15) NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tạo bảng order_details (chi tiết đơn hàng)
CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    flower_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    sub_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (flower_id) REFERENCES flowers(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu cho users
INSERT INTO users (full_name, email, password, phone, role) VALUES
('Admin System', 'admin@flowershop.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0123456789', 'ADMIN'),
('Nguyễn Văn A', 'nguyenvana@email.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0987654321', 'USER'),
('Trần Thị B', 'tranthib@email.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0912345678', 'USER');

-- Thêm dữ liệu mẫu cho flowers
INSERT INTO flowers (name, description, price, category) VALUES 
('Hoa Hồng Đỏ', 'Hoa hồng đỏ tươi thắm, tượng trưng cho tình yêu nồng cháy', 150000, 'ROSE'),
('Hoa Ly Trắng', 'Hoa ly trắng tinh khôi, thích hợp cho các dịp lễ', 200000, 'LILY'),
('Lan Hồ Điệp', 'Lan hồ điệp sang trọng, thích hợp trang trí và làm quà tặng', 450000, 'ORCHID'),
('Hướng Dương', 'Hoa hướng dương tươi sáng, mang năng lượng tích cực', 180000, 'SUNFLOWER'),
('Cúc Vàng', 'Hoa cúc vàng tươi, thích hợp cho các dịp lễ truyền thống', 120000, 'CHRYSANTHEMUM'),
('Cẩm Chướng Hồng', 'Hoa cẩm chướng màu hồng pastel', 160000, 'CARNATION'),
('Tulip Đỏ', 'Tulip đỏ nhập khẩu, sang trọng và độc đáo', 250000, 'TULIP');

-- Thêm dữ liệu mẫu cho warehouses
INSERT INTO warehouses (name, address, phone) VALUES
('Kho Chính', '123 Đường ABC, Quận 1, TP.HCM', '0123456789'),
('Kho Phụ 1', '456 Đường XYZ, Quận 2, TP.HCM', '0987654321');

-- Thêm dữ liệu mẫu cho inventory
INSERT INTO inventory (warehouse_id, flower_id, quantity) VALUES
(1, 1, 100), -- Hoa Hồng Đỏ tại Kho Chính
(1, 2, 80),  -- Hoa Ly Trắng tại Kho Chính
(1, 3, 50),  -- Lan Hồ Điệp tại Kho Chính
(2, 1, 50),  -- Hoa Hồng Đỏ tại Kho Phụ 1
(2, 2, 40),  -- Hoa Ly Trắng tại Kho Phụ 1
(2, 4, 60);  -- Hướng Dương tại Kho Phụ 1