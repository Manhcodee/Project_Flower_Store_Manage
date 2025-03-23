package com.example.backend.Flower.repository.product;

import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import com.example.backend.Flower.entity.model.Product.FlowerProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FlowerProductRepository extends JpaRepository<FlowerProduct, Long> {

    // Tìm sản phẩm theo tên (sử dụng cho tìm kiếm)
    Page<FlowerProduct> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Lấy sản phẩm nổi bật và còn hoạt động
    Page<FlowerProduct> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);

    // Lọc sản phẩm theo danh mục
    @Query("SELECT p FROM FlowerProduct p JOIN p.categories c WHERE c.id = :categoryId AND p.isActive = true")
    Page<FlowerProduct> findByCategoryIdAndIsActiveTrue(@Param("categoryId") Long categoryId, Pageable pageable);

    // Tìm sản phẩm trong khoảng giá
    Page<FlowerProduct> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Đếm số lượng sản phẩm theo danh mục
    @Query("SELECT COUNT(p) FROM FlowerProduct p JOIN p.categories c WHERE c = :category")
    Long countByCategoriesContains(@Param("category") FlowerCategory category);

    // Lấy sản phẩm mới nhất dựa trên thời gian tạo
    List<FlowerProduct> findTop8ByIsActiveTrueOrderByCreatedAtDesc();

    // Lấy sản phẩm có giảm giá
    @Query("SELECT p FROM FlowerProduct p WHERE p.salePrice IS NOT NULL AND p.isActive = true")
    Page<FlowerProduct> findAllWithSalePriceAndIsActiveTrue(Pageable pageable);

    // Tìm sản phẩm theo loại hoa
    @Query("SELECT p FROM FlowerProduct p JOIN p.categories c WHERE c.categoryType = :categoryType AND p.isActive = true")
    Page<FlowerProduct> findByCategoryTypeAndIsActiveTrue(@Param("categoryType") String categoryType,
            Pageable pageable);
}
