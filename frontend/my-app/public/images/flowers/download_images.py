#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script để tải xuống ảnh hoa cho dự án Flower Shop
Sử dụng: python download_images.py
"""

import os
import requests
import shutil
import time
from urllib.parse import urlparse

# Danh sách các loại hoa và URL mẫu (bạn cần thay thế bằng URL thực tế)
FLOWER_TYPES = {
    "rose": [],            # Hoa Hồng
    "lily": [],            # Hoa Ly
    "orchid": [],          # Hoa Lan
    "sunflower": [],       # Hoa Hướng Dương
    "chrysanthemum": [],   # Hoa Cúc
    "carnation": [],       # Hoa Cẩm Chướng
    "tulip": [],           # Hoa Tulip
    "daisy": [],           # Hoa Cúc Họa Mi
    "lotus": [],           # Hoa Sen
    "peony": [],           # Hoa Mẫu Đơn
    "hydrangea": [],       # Hoa Cẩm Tú Cầu
    "baby_breath": [],     # Hoa Baby
    "gerbera": [],         # Hoa Đồng Tiền
    "lavender": [],        # Hoa Oải Hương
    "jasmine": [],         # Hoa Nhài
    "cherry_blossom": [],  # Hoa Anh Đào
    "marigold": [],        # Hoa Cúc Vạn Thọ
    "iris": [],            # Hoa Diên Vĩ
    "daffodil": [],        # Hoa Thủy Tiên
    "statice": [],         # Hoa Limonium
    "aster": [],           # Hoa Thạch Thảo
    "gladiolus": [],       # Hoa Lay Ơn
    "snapdragon": [],      # Hoa Mõm Chó
    "dahlia": [],          # Hoa Thược Dược
    "calla_lily": [],      # Hoa Rum
    "sweet_pea": [],       # Hoa Đậu Thơm
}

# Danh sách các kiểu cắm hoa
ARRANGEMENT_TYPES = {
    "bouquet": [],         # Bó Hoa
    "basket": [],          # Giỏ Hoa
    "box": [],             # Hộp Hoa
    "vase": [],            # Lọ Hoa
    "wedding": [],         # Hoa Cưới
    "congratulation": [],  # Hoa Chúc Mừng
    "sympathy": [],        # Hoa Chia Buồn
    "love": [],            # Hoa Tình Yêu
    "birthday": [],        # Hoa Sinh Nhật
}

def create_directories():
    """Tạo các thư mục cần thiết nếu chưa tồn tại"""
    for flower_type in FLOWER_TYPES:
        path = f"flowers/{flower_type}"
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Đã tạo thư mục: {path}")
    
    for arrangement_type in ARRANGEMENT_TYPES:
        path = f"arrangements/{arrangement_type}"
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Đã tạo thư mục: {path}")

def download_image(url, folder, filename):
    """Tải xuống hình ảnh từ URL và lưu vào thư mục"""
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(os.path.join(folder, filename), 'wb') as f:
                response.raw.decode_content = True
                shutil.copyfileobj(response.raw, f)
            print(f"Đã tải xuống: {filename}")
            return True
        else:
            print(f"Không thể tải xuống {url}: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"Lỗi khi tải xuống {url}: {e}")
        return False

def download_flower_images():
    """Tải xuống ảnh cho tất cả các loại hoa"""
    create_directories()
    
    # Tải ảnh cho từng loại hoa
    for flower_type, urls in FLOWER_TYPES.items():
        folder = f"flowers/{flower_type}"
        for i, url in enumerate(urls):
            if url:  # Kiểm tra URL không trống
                # Lấy phần mở rộng từ URL hoặc sử dụng .jpg mặc định
                parsed_url = urlparse(url)
                file_ext = os.path.splitext(parsed_url.path)[1]
                if not file_ext:
                    file_ext = ".jpg"
                    
                filename = f"{flower_type}_{i+1:02d}{file_ext}"
                download_image(url, folder, filename)
                
                # Tạm dừng để tránh gửi quá nhiều yêu cầu
                time.sleep(1)
    
    # Tải ảnh cho các kiểu cắm hoa
    for arrangement_type, urls in ARRANGEMENT_TYPES.items():
        folder = f"arrangements/{arrangement_type}"
        for i, url in enumerate(urls):
            if url:
                parsed_url = urlparse(url)
                file_ext = os.path.splitext(parsed_url.path)[1]
                if not file_ext:
                    file_ext = ".jpg"
                    
                filename = f"{arrangement_type}_{i+1:02d}{file_ext}"
                download_image(url, folder, filename)
                
                # Tạm dừng để tránh gửi quá nhiều yêu cầu
                time.sleep(1)

def main():
    print("Bắt đầu tải xuống hình ảnh hoa...")
    download_flower_images()
    print("Hoàn thành tải xuống hình ảnh!")

if __name__ == "__main__":
    main() 