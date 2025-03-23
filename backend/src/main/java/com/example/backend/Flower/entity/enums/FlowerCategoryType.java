package com.example.backend.Flower.entity.enums;

/**
 * Enum chứa các loại hoa phổ biến
 */
public enum FlowerCategoryType {
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
    BABY_BREATH("Hoa Baby"),
    GERBERA("Hoa Đồng Tiền"),
    LAVENDER("Hoa Oải Hương"),
    JASMINE("Hoa Nhài"),
    CHERRY_BLOSSOM("Hoa Anh Đào"),
    MARIGOLD("Hoa Cúc Vạn Thọ"),
    IRIS("Hoa Diên Vĩ"),
    DAFFODIL("Hoa Thủy Tiên"),
    STATICE("Hoa Limonium"),
    ASTER("Hoa Thạch Thảo"),
    GLADIOLUS("Hoa Lay Ơn"),
    SNAPDRAGON("Hoa Mõm Chó"),
    DAHLIA("Hoa Thược Dược"),
    CALLA_LILY("Hoa Rum"),
    SWEET_PEA("Hoa Đậu Thơm"),
    BOUQUET("Bó Hoa"),
    BASKET("Giỏ Hoa"),
    BOX("Hộp Hoa"),
    VASE("Lọ Hoa"),
    WEDDING_FLOWERS("Hoa Cưới"),
    CONGRATULATION_FLOWERS("Hoa Chúc Mừng"),
    SYMPATHY_FLOWERS("Hoa Chia Buồn"),
    LOVE_FLOWERS("Hoa Tình Yêu"),
    BIRTHDAY_FLOWERS("Hoa Sinh Nhật"),
    OTHER("Hoa Khác");

    private final String vietnameseName;

    FlowerCategoryType(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }

    /**
     * Lấy enum từ tên tiếng Việt
     */
    public static FlowerCategoryType fromVietnameseName(String vietnameseName) {
        for (FlowerCategoryType type : FlowerCategoryType.values()) {
            if (type.getVietnameseName().equalsIgnoreCase(vietnameseName)) {
                return type;
            }
        }
        return OTHER;
    }
}