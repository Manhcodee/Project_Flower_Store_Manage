package com.example.backend.Flower.service.product;

import com.example.backend.Flower.dto.product.CategoryDTO;
import com.example.backend.Flower.entity.enums.FlowerCategoryType;
import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import com.example.backend.Flower.repository.product.FlowerCategoryRepository;
import com.example.backend.Flower.repository.product.FlowerProductRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlowerCategoryService {

    private final FlowerCategoryRepository categoryRepository;
    private final FlowerProductRepository productRepository;

    // Lấy tất cả danh mục
    public List<FlowerCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy danh mục theo loại hoa
    public List<FlowerCategory> getCategoriesByType(FlowerCategoryType categoryType) {
        return categoryRepository.findByCategoryType(categoryType);
    }

    // Lấy danh mục đang hoạt động
    public List<FlowerCategory> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    // Lấy chi tiết danh mục
    public FlowerCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));
    }

    // Lấy danh mục cùng với số lượng sản phẩm
    public List<CategoryDTO.CategoryWithProductCountDTO> getCategoriesWithProductCount() {
        List<FlowerCategory> categories = categoryRepository.findAll();
        List<CategoryDTO.CategoryWithProductCountDTO> result = new ArrayList<>();

        for (FlowerCategory category : categories) {
            Long productCount = productRepository.countByCategoriesContains(category);
            result.add(new CategoryDTO.CategoryWithProductCountDTO(category, productCount));
        }

        return result;
    }

    // Tạo mới hoặc cập nhật danh mục
    @Transactional
    public FlowerCategory saveCategory(FlowerCategory category) {
        return categoryRepository.save(category);
    }

    // Xóa danh mục
    @Transactional
    public void deleteCategory(Long id) {
        // Kiểm tra xem danh mục có sản phẩm không
        FlowerCategory category = getCategoryById(id);
        Long productCount = productRepository.countByCategoriesContains(category);
        if (productCount > 0) {
            throw new IllegalStateException("Không thể xóa danh mục còn chứa sản phẩm");
        }
        categoryRepository.deleteById(id);
    }

    // Cập nhật trạng thái hoạt động
    @Transactional
    public FlowerCategory updateCategoryStatus(Long id, boolean isActive) {
        FlowerCategory category = getCategoryById(id);
        category.setActive(isActive);
        return categoryRepository.save(category);
    }

    // Kiểm tra tên danh mục đã tồn tại chưa
    public boolean existsByName(String name) {
        return categoryRepository.existsByNameIgnoreCase(name);
    }
}