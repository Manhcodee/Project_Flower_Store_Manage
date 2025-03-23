package com.example.backend.Flower.repository.product;

import com.example.backend.Flower.entity.enums.FlowerCategoryType;
import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlowerCategoryRepository extends JpaRepository<FlowerCategory, Long> {

    // Tìm các danh mục đang hoạt động
    List<FlowerCategory> findByIsActiveTrue();

    // Tìm danh mục theo tên
    FlowerCategory findByNameIgnoreCase(String name);

    // Kiểm tra xem danh mục có tồn tại không
    boolean existsByNameIgnoreCase(String name);

    // Tìm danh mục theo loại hoa
    List<FlowerCategory> findByCategoryType(FlowerCategoryType categoryType);

    // Tìm danh mục theo loại hoa và trạng thái
    List<FlowerCategory> findByCategoryTypeAndIsActiveTrue(FlowerCategoryType categoryType);

    // Lấy danh mục cùng với số lượng sản phẩm trong mỗi danh mục
    @Query("SELECT c, COUNT(p) FROM FlowerCategory c LEFT JOIN c.products p GROUP BY c")
    List<Object[]> findCategoriesWithProductCount();
}
