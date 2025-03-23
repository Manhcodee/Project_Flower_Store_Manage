package com.example.backend.Flower.dto.product;

import com.example.backend.Flower.entity.enums.FlowerCategoryType;
import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String categoryType;
    private String categoryTypeName;
    private boolean isActive;

    public CategoryDTO(FlowerCategory category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.imageUrl = category.getImageUrl();
        this.isActive = category.isActive();
        if (category.getCategoryType() != null) {
            this.categoryType = category.getCategoryType().name();
            this.categoryTypeName = category.getCategoryType().getVietnameseName();
        }
    }

    public FlowerCategory toEntity() {
        FlowerCategory category = new FlowerCategory();
        category.setId(this.id);
        category.setName(this.name);
        category.setDescription(this.description);
        category.setImageUrl(this.imageUrl);
        category.setActive(this.isActive);
        if (this.categoryType != null && !this.categoryType.isEmpty()) {
            try {
                category.setCategoryType(FlowerCategoryType.valueOf(this.categoryType));
            } catch (IllegalArgumentException e) {
                // Nếu không tìm thấy enum, đặt là OTHER
                category.setCategoryType(FlowerCategoryType.OTHER);
            }
        }
        return category;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryWithProductCountDTO {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;
        private String categoryType;
        private String categoryTypeName;
        private boolean isActive;
        private Long productCount;

        public CategoryWithProductCountDTO(FlowerCategory category, Long productCount) {
            this.id = category.getId();
            this.name = category.getName();
            this.description = category.getDescription();
            this.imageUrl = category.getImageUrl();
            this.isActive = category.isActive();
            if (category.getCategoryType() != null) {
                this.categoryType = category.getCategoryType().name();
                this.categoryTypeName = category.getCategoryType().getVietnameseName();
            }
            this.productCount = productCount;
        }
    }
}