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


CREATE TABLE flower_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Cập nhật bảng flower_categories để hỗ trợ đầy đủ các loại hoa từ enum FlowerCategoryType
CREATE TABLE flower_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    category_type ENUM(
        'ROSE', 'LILY', 'ORCHID', 'SUNFLOWER', 'CHRYSANTHEMUM',
        'CARNATION', 'TULIP', 'DAISY', 'LOTUS', 'PEONY',
        'HYDRANGEA', 'BABY_BREATH', 'GERBERA', 'LAVENDER', 'JASMINE',
        'CHERRY_BLOSSOM', 'MARIGOLD', 'IRIS', 'DAFFODIL', 'STATICE',
        'ASTER', 'GLADIOLUS', 'SNAPDRAGON', 'DAHLIA', 'CALLA_LILY',
        'SWEET_PEA', 'BOUQUET', 'BASKET', 'BOX', 'VASE',
        'WEDDING_FLOWERS', 'CONGRATULATION_FLOWERS', 'SYMPATHY_FLOWERS',
        'LOVE_FLOWERS', 'BIRTHDAY_FLOWERS', 'OTHER'
    ) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_category_type (category_type)
);

CREATE TABLE product_categories (
    product_id BIGINT,
    category_id BIGINT,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES flower_products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES flower_categories(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES flower_products(id) ON DELETE CASCADE
);

-- Dữ liệu mẫu cho danh mục hoa (đã cập nhật với đầy đủ loại hoa)
INSERT INTO flower_categories (name, description, category_type, is_active) VALUES
-- Hoa phổ biến
('Hoa Hồng Đỏ', 'Hoa hồng đỏ tượng trưng cho tình yêu mãnh liệt', 'ROSE', TRUE),
('Hoa Hồng Trắng', 'Hoa hồng trắng tượng trưng cho tình yêu thuần khiết', 'ROSE', TRUE),
('Hoa Hồng Hồng', 'Hoa hồng hồng tượng trưng cho sự ngọt ngào', 'ROSE', TRUE),
('Hoa Hướng Dương', 'Hoa hướng dương tượng trưng cho sự lạc quan', 'SUNFLOWER', TRUE),
('Hoa Cúc Đại Đóa', 'Hoa cúc đại đóa màu vàng tươi sáng', 'CHRYSANTHEMUM', TRUE),
('Hoa Cúc Họa Mi', 'Hoa cúc họa mi tượng trưng cho sự trong trắng', 'DAISY', TRUE),
('Hoa Ly Trắng', 'Hoa ly trắng tượng trưng cho sự thuần khiết', 'LILY', TRUE),
('Hoa Lan Hồ Điệp', 'Hoa lan hồ điệp tượng trưng cho sự thanh nhã', 'ORCHID', TRUE),
('Hoa Cẩm Tú Cầu', 'Hoa cẩm tú cầu với nhiều màu sắc khác nhau', 'HYDRANGEA', TRUE),
('Hoa Baby', 'Hoa baby tượng trưng cho tình yêu tinh khiết, vĩnh cửu', 'BABY_BREATH', TRUE),
('Hoa Cẩm Chướng', 'Hoa cẩm chướng tượng trưng cho tình mẫu tử', 'CARNATION', TRUE),
('Hoa Tulip', 'Hoa tulip tượng trưng cho tình yêu hoàn hảo', 'TULIP', TRUE),
('Hoa Sen', 'Hoa sen tượng trưng cho sự thuần khiết và thanh cao', 'LOTUS', TRUE),
('Hoa Mẫu Đơn', 'Hoa mẫu đơn tượng trưng cho sự thịnh vượng và sang trọng', 'PEONY', TRUE),
('Hoa Đồng Tiền', 'Hoa đồng tiền tượng trưng cho niềm vui và sự hạnh phúc', 'GERBERA', TRUE),
('Hoa Oải Hương', 'Hoa oải hương mang hương thơm dịu nhẹ, tượng trưng cho sự thanh tịnh', 'LAVENDER', TRUE),
('Hoa Nhài', 'Hoa nhài với hương thơm ngọt ngào', 'JASMINE', TRUE),
('Hoa Anh Đào', 'Hoa anh đào tượng trưng cho vẻ đẹp mong manh, tạm bợ', 'CHERRY_BLOSSOM', TRUE),
('Hoa Cúc Vạn Thọ', 'Hoa cúc vạn thọ tượng trưng cho sự trường thọ và may mắn', 'MARIGOLD', TRUE),
('Hoa Diên Vĩ', 'Hoa diên vĩ tượng trưng cho niềm tin và hy vọng', 'IRIS', TRUE),
('Hoa Thủy Tiên', 'Hoa thủy tiên tượng trưng cho sự hồi sinh và khởi đầu mới', 'DAFFODIL', TRUE),
('Hoa Limonium', 'Hoa limonium tượng trưng cho sự kỷ niệm và hồi ức', 'STATICE', TRUE),
('Hoa Thạch Thảo', 'Hoa thạch thảo tượng trưng cho sự thanh lịch và tinh tế', 'ASTER', TRUE),
('Hoa Lay Ơn', 'Hoa lay ơn tượng trưng cho sự bất tử và lòng khao khát', 'GLADIOLUS', TRUE),
('Hoa Mõm Chó', 'Hoa mõm chó tượng trưng cho sự giảo hoạt và quyến rũ', 'SNAPDRAGON', TRUE),
('Hoa Thược Dược', 'Hoa thược dược tượng trưng cho sự uy nghiêm và cao quý', 'DAHLIA', TRUE),
('Hoa Rum', 'Hoa rum tượng trưng cho sự thuần khiết và sang trọng', 'CALLA_LILY', TRUE),
('Hoa Đậu Thơm', 'Hoa đậu thơm tượng trưng cho niềm vui và lời tạm biệt', 'SWEET_PEA', TRUE),

-- Cách trình bày hoa
('Bó Hoa Tình Yêu', 'Bó hoa đặc biệt dành cho người yêu', 'BOUQUET', TRUE),
('Giỏ Hoa Chúc Mừng', 'Giỏ hoa chúc mừng khai trương, sinh nhật', 'BASKET', TRUE),
('Hộp Hoa Sang Trọng', 'Hộp hoa được thiết kế sang trọng', 'BOX', TRUE),
('Lọ Hoa Để Bàn', 'Lọ hoa trang trí bàn làm việc hoặc bàn tiếp khách', 'VASE', TRUE),

-- Dịp tặng hoa
('Hoa Cưới Cầm Tay', 'Hoa cầm tay dành cho cô dâu', 'WEDDING_FLOWERS', TRUE),
('Hoa Chúc Mừng Khai Trương', 'Hoa chúc mừng khai trương cửa hàng, công ty', 'CONGRATULATION_FLOWERS', TRUE),
('Hoa Chia Buồn', 'Hoa chia buồn thể hiện sự tôn kính với người đã khuất', 'SYMPATHY_FLOWERS', TRUE),
('Hoa Tình Yêu', 'Hoa dành tặng cho người yêu trong các dịp đặc biệt', 'LOVE_FLOWERS', TRUE),
('Hoa Sinh Nhật', 'Hoa dành tặng trong ngày sinh nhật', 'BIRTHDAY_FLOWERS', TRUE);

-- Dữ liệu mẫu cho sản phẩm hoa
INSERT INTO flower_products (name, description, price, sale_price, stock_quantity, is_featured, is_active) VALUES
('Bó Hoa Hồng Đỏ 20 Bông', 'Bó hoa hồng đỏ 20 bông tượng trưng cho tình yêu mãnh liệt', 550000, 500000, 10, TRUE, TRUE),
('Bó Hoa Hướng Dương', 'Bó hoa hướng dương 10 bông tươi sáng', 450000, NULL, 15, TRUE, TRUE),
('Giỏ Hoa Khai Trương', 'Giỏ hoa khai trương với nhiều loại hoa', 850000, 800000, 5, TRUE, TRUE),
('Hộp Hoa Hồng Mix', 'Hộp hoa hồng nhiều màu sắc', 650000, 600000, 8, TRUE, TRUE),
('Bó Hoa Lan Hồ Điệp', 'Bó hoa lan hồ điệp sang trọng', 950000, 900000, 5, TRUE, TRUE),
('Bó Hoa Cưới Cầm Tay', 'Bó hoa cưới cầm tay cho cô dâu', 750000, NULL, 3, TRUE, TRUE),
('Lẵng Hoa Tulip Mix', 'Lẵng hoa tulip nhiều màu sắc tươi sáng', 850000, 800000, 7, TRUE, TRUE),
('Bó Hoa Sen Tinh Khiết', 'Bó hoa sen trắng tinh khiết', 550000, NULL, 5, FALSE, TRUE),
('Hộp Hoa Baby', 'Hộp hoa baby trắng tinh khôi', 450000, 400000, 10, FALSE, TRUE),
('Giỏ Hoa Cẩm Tú Cầu', 'Giỏ hoa cẩm tú cầu xanh tươi mát', 750000, 700000, 8, TRUE, TRUE),
('Bó Hoa Cẩm Chướng', 'Bó hoa cẩm chướng đỏ thắm', 350000, NULL, 12, FALSE, TRUE),
('Lẵng Hoa Chia Buồn', 'Lẵng hoa chia buồn với tone màu trắng', 950000, NULL, 5, FALSE, TRUE);

-- Dữ liệu mẫu cho mối quan hệ giữa sản phẩm và danh mục
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1), -- Bó Hoa Hồng Đỏ 20 Bông - Hoa Hồng Đỏ
(1, 29), -- Bó Hoa Hồng Đỏ 20 Bông - Bó Hoa Tình Yêu
(1, 34), -- Bó Hoa Hồng Đỏ 20 Bông - Hoa Tình Yêu
(2, 4), -- Bó Hoa Hướng Dương - Hoa Hướng Dương
(2, 29), -- Bó Hoa Hướng Dương - Bó Hoa Tình Yêu
(3, 5), -- Giỏ Hoa Khai Trương - Hoa Cúc Đại Đóa
(3, 30), -- Giỏ Hoa Khai Trương - Giỏ Hoa Chúc Mừng
(3, 33), -- Giỏ Hoa Khai Trương - Hoa Chúc Mừng Khai Trương
(4, 1), -- Hộp Hoa Hồng Mix - Hoa Hồng Đỏ
(4, 2), -- Hộp Hoa Hồng Mix - Hoa Hồng Trắng
(4, 3), -- Hộp Hoa Hồng Mix - Hoa Hồng Hồng
(4, 31), -- Hộp Hoa Hồng Mix - Hộp Hoa Sang Trọng
(5, 8), -- Bó Hoa Lan Hồ Điệp - Hoa Lan Hồ Điệp
(5, 29), -- Bó Hoa Lan Hồ Điệp - Bó Hoa Tình Yêu
(6, 2), -- Bó Hoa Cưới Cầm Tay - Hoa Hồng Trắng
(6, 7), -- Bó Hoa Cưới Cầm Tay - Hoa Ly Trắng
(6, 32), -- Bó Hoa Cưới Cầm Tay - Hoa Cưới Cầm Tay
(7, 12), -- Lẵng Hoa Tulip Mix - Hoa Tulip
(7, 30), -- Lẵng Hoa Tulip Mix - Giỏ Hoa Chúc Mừng
(8, 13), -- Bó Hoa Sen Tinh Khiết - Hoa Sen
(8, 29), -- Bó Hoa Sen Tinh Khiết - Bó Hoa Tình Yêu
(9, 10), -- Hộp Hoa Baby - Hoa Baby
(9, 31), -- Hộp Hoa Baby - Hộp Hoa Sang Trọng
(9, 35), -- Hộp Hoa Baby - Hoa Sinh Nhật
(10, 9), -- Giỏ Hoa Cẩm Tú Cầu - Hoa Cẩm Tú Cầu
(10, 30), -- Giỏ Hoa Cẩm Tú Cầu - Giỏ Hoa Chúc Mừng
(11, 11), -- Bó Hoa Cẩm Chướng - Hoa Cẩm Chướng
(11, 29), -- Bó Hoa Cẩm Chướng - Bó Hoa Tình Yêu
(12, 2), -- Lẵng Hoa Chia Buồn - Hoa Hồng Trắng
(12, 30), -- Lẵng Hoa Chia Buồn - Giỏ Hoa Chúc Mừng
(12, 34); -- Lẵng Hoa Chia Buồn - Hoa Chia Buồn

-- Dữ liệu mẫu cho hình ảnh sản phẩm
INSERT INTO product_images (product_id, image_url, is_main, display_order) VALUES
(1, '/images/products/bo-hoa-hong-do-1.jpg', TRUE, 1),
(1, '/images/products/bo-hoa-hong-do-2.jpg', FALSE, 2),
(2, '/images/products/bo-hoa-huong-duong-1.jpg', TRUE, 1),
(2, '/images/products/bo-hoa-huong-duong-2.jpg', FALSE, 2),
(3, '/images/products/gio-hoa-khai-truong-1.jpg', TRUE, 1),
(3, '/images/products/gio-hoa-khai-truong-2.jpg', FALSE, 2),
(4, '/images/products/hop-hoa-hong-mix-1.jpg', TRUE, 1),
(4, '/images/products/hop-hoa-hong-mix-2.jpg', FALSE, 2),
(5, '/images/products/bo-hoa-lan-ho-diep-1.jpg', TRUE, 1),
(5, '/images/products/bo-hoa-lan-ho-diep-2.jpg', FALSE, 2),
(6, '/images/products/bo-hoa-cuoi-cam-tay-1.jpg', TRUE, 1),
(6, '/images/products/bo-hoa-cuoi-cam-tay-2.jpg', FALSE, 2),
(7, '/images/products/lang-hoa-tulip-mix-1.jpg', TRUE, 1),
(7, '/images/products/lang-hoa-tulip-mix-2.jpg', FALSE, 2),
(8, '/images/products/bo-hoa-sen-1.jpg', TRUE, 1),
(8, '/images/products/bo-hoa-sen-2.jpg', FALSE, 2),
(9, '/images/products/hop-hoa-baby-1.jpg', TRUE, 1),
(9, '/images/products/hop-hoa-baby-2.jpg', FALSE, 2),
(10, '/images/products/gio-hoa-cam-tu-cau-1.jpg', TRUE, 1),
(10, '/images/products/gio-hoa-cam-tu-cau-2.jpg', FALSE, 2),
(11, '/images/products/bo-hoa-cam-chuong-1.jpg', TRUE, 1),
(11, '/images/products/bo-hoa-cam-chuong-2.jpg', FALSE, 2),
(12, '/images/products/lang-hoa-chia-buon-1.jpg', TRUE, 1),
(12, '/images/products/lang-hoa-chia-buon-2.jpg', FALSE, 2);

-- Tạo bảng mới để lưu trữ thông tin về các loại hoa theo mùa
CREATE TABLE flower_seasons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_month INT NOT NULL,
    end_month INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Bảng liên kết giữa hoa và mùa
CREATE TABLE product_seasons (
    product_id BIGINT,
    season_id BIGINT,
    PRIMARY KEY (product_id, season_id),
    FOREIGN KEY (product_id) REFERENCES flower_products(id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES flower_seasons(id) ON DELETE CASCADE
);

-- Dữ liệu mẫu cho các mùa hoa
INSERT INTO flower_seasons (name, start_month, end_month, description, is_active) VALUES
('Mùa Xuân', 1, 3, 'Hoa nở vào dịp Tết và mùa xuân', TRUE),
('Mùa Hè', 4, 6, 'Hoa nở trong mùa nắng nóng', TRUE),
('Mùa Thu', 7, 9, 'Hoa nở vào mùa thu mát mẻ', TRUE),
('Mùa Đông', 10, 12, 'Hoa nở trong thời tiết se lạnh', TRUE),
('Hoa Quanh Năm', 1, 12, 'Hoa có thể trồng và nở quanh năm', TRUE);

-- Liên kết sản phẩm với mùa phù hợp
INSERT INTO product_seasons (product_id, season_id) VALUES
(1, 5), -- Hoa hồng có quanh năm
(2, 2), -- Hoa hướng dương - Mùa hè
(2, 3), -- Hoa hướng dương - Mùa thu
(3, 5), -- Giỏ hoa khai trương - Quanh năm
(4, 5), -- Hộp hoa hồng mix - Quanh năm
(5, 1), -- Hoa lan hồ điệp - Mùa xuân
(5, 2), -- Hoa lan hồ điệp - Mùa hè
(6, 5), -- Hoa cưới - Quanh năm
(7, 1), -- Hoa tulip - Mùa xuân
(8, 3), -- Hoa sen - Mùa thu
(9, 5), -- Hoa baby - Quanh năm
(10, 2), -- Hoa cẩm tú cầu - Mùa hè
(10, 3), -- Hoa cẩm tú cầu - Mùa thu
(11, 5), -- Hoa cẩm chướng - Quanh năm
(12, 5); -- Hoa chia buồn - Quanh năm

-- Tạo bảng để lưu trữ các cơ sở/cửa hàng của hệ thống
CREATE TABLE flower_stores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    opening_hours VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_active BOOLEAN DEFAULT TRUE
);

-- Thêm dữ liệu mẫu cho các cửa hàng
INSERT INTO flower_stores (name, address, phone, email, opening_hours, is_active) VALUES
('FlowerShop Q1', '123 Nguyễn Huệ, Quận 1, TP.HCM', '0901234567', 'q1@flowershop.com', '8:00 - 21:00', TRUE),
('FlowerShop Q3', '456 Võ Văn Tần, Quận 3, TP.HCM', '0901234568', 'q3@flowershop.com', '8:00 - 21:00', TRUE),
('FlowerShop Gò Vấp', '789 Quang Trung, Gò Vấp, TP.HCM', '0901234569', 'govap@flowershop.com', '8:00 - 20:00', TRUE);