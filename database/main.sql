-- Tạo database mới
DROP DATABASE IF EXISTS flower_shop;
CREATE DATABASE flower_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flower_shop;

-- Tạo bảng users với đầy đủ các trường cần thiết cho đăng nhập Google
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NULL,  -- Đã thay đổi thành NULL vì người dùng Google có thể không có số điện thoại
    address TEXT,
    google_id VARCHAR(255) UNIQUE,  -- ID Google của người dùng
    profile_picture VARCHAR(255),   -- URL ảnh đại diện
    is_enabled BOOLEAN DEFAULT FALSE, -- Trạng thái kích hoạt tài khoản
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu cho users
INSERT INTO users (full_name, email, password, phone, role, is_enabled) VALUES
('Admin System', 'admin@flowershop.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0123456789', 'ADMIN', TRUE),
('Nguyễn Văn A', 'nguyenvana@email.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0987654321', 'USER', TRUE),
('Trần Thị B', 'tranthib@email.com', '$2a$10$aTwSKapbJxROTcqjj1tbHeqKkDJuTJ2Mj49QlP/t0A2uR7PveRCJu', '0912345678', 'USER', TRUE);