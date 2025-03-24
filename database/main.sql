-- Tạo database mới
DROP DATABASE IF EXISTS flower_shop;
CREATE DATABASE flower_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flower_shop;

-- Tạo bảng users với đầy đủ các trường cho cả Google và Facebook
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),  -- Có thể NULL cho social login
    phone VARCHAR(15) NULL,
    address TEXT,
    google_id VARCHAR(255) UNIQUE,
    facebook_id VARCHAR(255) UNIQUE,  -- ID Facebook của người dùng
    profile_picture VARCHAR(255),
    is_enabled BOOLEAN DEFAULT TRUE,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    auth_provider ENUM('LOCAL', 'GOOGLE', 'FACEBOOK') DEFAULT 'LOCAL',  -- Phương thức đăng nhập
    access_token TEXT,  -- Token từ social provider
    refresh_token TEXT,  -- Refresh token nếu có
    token_expiry DATETIME,  -- Thời gian hết hạn của token
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME,  -- Thời gian đăng nhập gần nhất
    INDEX idx_email (email),
    INDEX idx_facebook_id (facebook_id),
    INDEX idx_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu cho users
INSERT INTO users (full_name, email, password, phone, role, is_enabled, auth_provider) VALUES
('Admin System', 'admin@flowershop.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0123456789', 'ADMIN', TRUE, 'LOCAL'),
('Nguyễn Văn A', 'nguyenvana@email.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0987654321', 'USER', TRUE, 'LOCAL'),
('Trần Thị B', 'tranthib@email.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0912345678', 'USER', TRUE, 'LOCAL');