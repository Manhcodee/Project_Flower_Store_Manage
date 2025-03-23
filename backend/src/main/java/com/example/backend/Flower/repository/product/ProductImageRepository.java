package com.example.backend.Flower.repository.product;

import com.example.backend.Flower.entity.model.Product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    // Lấy tất cả hình ảnh của một sản phẩm, sắp xếp theo thứ tự hiển thị
    List<ProductImage> findByProductIdOrderByDisplayOrderAsc(Long productId);

    // Lấy hình ảnh chính của sản phẩm
    Optional<ProductImage> findByProductIdAndIsMainTrue(Long productId);

    // Đếm số lượng hình ảnh của một sản phẩm
    Long countByProductId(Long productId);

    // Xóa tất cả hình ảnh của một sản phẩm
    void deleteByProductId(Long productId);

    // Cập nhật trạng thái hình ảnh chính
    @Query("UPDATE ProductImage pi SET pi.isMain = false WHERE pi.product.id = :productId AND pi.id <> :imageId")
    void unsetMainForOtherImages(@Param("productId") Long productId, @Param("imageId") Long imageId);
}
