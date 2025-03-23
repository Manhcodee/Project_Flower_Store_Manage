package com.example.backend.Flower.controller.product;

import com.example.backend.Flower.dto.product.CategoryDTO;
import com.example.backend.Flower.entity.enums.FlowerCategoryType;
import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import com.example.backend.Flower.service.product.FlowerCategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {

    private final FlowerCategoryService categoryService;

    // Lấy danh sách tất cả danh mục
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories().stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    // Lấy danh sách các danh mục đang hoạt động
    @GetMapping("/active")
    public ResponseEntity<List<CategoryDTO>> getActiveCategories() {
        List<CategoryDTO> categories = categoryService.getActiveCategories().stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    // Lấy chi tiết danh mục
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        FlowerCategory category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(new CategoryDTO(category));
    }

    // Lấy danh mục cùng với số lượng sản phẩm
    @GetMapping("/with-product-count")
    public ResponseEntity<List<CategoryDTO.CategoryWithProductCountDTO>> getCategoriesWithProductCount() {
        List<CategoryDTO.CategoryWithProductCountDTO> categories = categoryService.getCategoriesWithProductCount();
        return ResponseEntity.ok(categories);
    }

    // Thêm danh mục mới
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO) {
        FlowerCategory category = categoryDTO.toEntity();
        FlowerCategory savedCategory = categoryService.saveCategory(category);
        return ResponseEntity.ok(new CategoryDTO(savedCategory));
    }

    // Cập nhật danh mục
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        FlowerCategory category = categoryDTO.toEntity();
        category.setId(id);
        FlowerCategory updatedCategory = categoryService.saveCategory(category);
        return ResponseEntity.ok(new CategoryDTO(updatedCategory));
    }

    // Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Cập nhật trạng thái danh mục
    @PutMapping("/{id}/status")
    public ResponseEntity<CategoryDTO> updateCategoryStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        FlowerCategory category = categoryService.updateCategoryStatus(id, isActive);
        return ResponseEntity.ok(new CategoryDTO(category));
    }

    @GetMapping("/type/{categoryType}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByType(@PathVariable String categoryType) {
        try {
            FlowerCategoryType type = FlowerCategoryType.valueOf(categoryType.toUpperCase());
            List<CategoryDTO> categories = categoryService.getCategoriesByType(type).stream()
                    .map(CategoryDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(categories);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}