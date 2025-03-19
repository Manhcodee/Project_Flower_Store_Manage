package com.example.backend.Flower.entity.enums;

public enum FlowerCategory {
    ROSE("Hoa Hồng"),
    LILY("Hoa Ly"),
    ORCHID("Hoa Lan"),
    SUNFLOWER("Hoa Hướng Dương"),
    CHRYSANTHEMUM("Hoa Cúc"),
    CARNATION("Hoa Cẩm Chướng"),
    TULIP("Hoa Tulip"),
    DAISY("Hoa Cúc Họa Mi"),
    LOTUS("Hoa Sen"),
    PEONY("Hoa Mẫu Đơn"),
    HYDRANGEA("Hoa Cẩm Tú Cầu"),
    BABY_BREATH("Hoa Baby");

    private final String vietnameseName;

    FlowerCategory(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }
}
