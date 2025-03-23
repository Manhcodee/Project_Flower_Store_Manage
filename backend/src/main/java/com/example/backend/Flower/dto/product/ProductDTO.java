package com.example.backend.Flower.dto.product;

import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import com.example.backend.Flower.entity.model.Product.FlowerProduct;
import com.example.backend.Flower.entity.model.Product.ProductImage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private List<CategoryDTO> categories = new ArrayList<>();
    private List<ProductImageDTO> images = new ArrayList<>();
    private String mainImage;
    private boolean isFeatured;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor từ entity
    public ProductDTO(FlowerProduct product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.salePrice = product.getSalePrice();
        this.stockQuantity = product.getStockQuantity();
        this.isFeatured = product.isFeatured();
        this.isActive = product.isActive();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();

        // Chuyển đổi danh mục
        if (product.getCategories() != null) {
            this.categories = product.getCategories().stream()
                    .map(category -> new CategoryDTO(category))
                    .collect(Collectors.toList());
        }

        // Chuyển đổi hình ảnh
        if (product.getImages() != null) {
            this.images = product.getImages().stream()
                    .map(image -> new ProductImageDTO(image))
                    .collect(Collectors.toList());

            // Lấy hình ảnh chính
            product.getImages().stream()
                    .filter(ProductImage::isMain)
                    .findFirst()
                    .ifPresent(image -> this.mainImage = image.getImageUrl());
        }
    }

    // Chuyển từ DTO sang entity
    public FlowerProduct toEntity() {
        FlowerProduct product = new FlowerProduct();
        product.setId(this.id);
        product.setName(this.name);
        product.setDescription(this.description);
        product.setPrice(this.price);
        product.setSalePrice(this.salePrice);
        product.setStockQuantity(this.stockQuantity);
        product.setFeatured(this.isFeatured);
        product.setActive(this.isActive);
        return product;
    }

    // Class DTO cho Category
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDTO {
        private Long id;
        private String name;
        private String description;
        private String imageUrl;

        public CategoryDTO(FlowerCategory category) {
            this.id = category.getId();
            this.name = category.getName();
            this.description = category.getDescription();
            this.imageUrl = category.getImageUrl();
        }
    }

    // Class DTO cho ProductImage
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImageDTO {
        private Long id;
        private String imageUrl;
        private boolean isMain;
        private Integer displayOrder;

        public ProductImageDTO(ProductImage image) {
            this.id = image.getId();
            this.imageUrl = image.getImageUrl();
            this.isMain = image.isMain();
            this.displayOrder = image.getDisplayOrder();
        }
    }
}