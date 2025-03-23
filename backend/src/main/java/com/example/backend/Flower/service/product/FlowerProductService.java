package com.example.backend.Flower.service.product;

import com.example.backend.Flower.entity.model.Product.FlowerCategory;
import com.example.backend.Flower.entity.model.Product.FlowerProduct;
import com.example.backend.Flower.entity.model.Product.ProductImage;
import com.example.backend.Flower.repository.product.FlowerCategoryRepository;
import com.example.backend.Flower.repository.product.FlowerProductRepository;
import com.example.backend.Flower.repository.product.ProductImageRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlowerProductService {

    private final FlowerProductRepository productRepository;
    private final FlowerCategoryRepository categoryRepository;
    private final ProductImageRepository imageRepository;

    // Lấy danh sách sản phẩm có phân trang
    public Page<FlowerProduct> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    // Lấy chi tiết một sản phẩm
    public FlowerProduct getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
    }

    // Tìm kiếm sản phẩm theo tên
    public Page<FlowerProduct> searchProductsByName(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    // Lấy sản phẩm theo danh mục
    public Page<FlowerProduct> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
    }

    // Lấy sản phẩm nổi bật
    public Page<FlowerProduct> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue(pageable);
    }

    // Lấy sản phẩm mới nhất
    public List<FlowerProduct> getLatestProducts() {
        return productRepository.findTop8ByIsActiveTrueOrderByCreatedAtDesc();
    }

    // Lấy sản phẩm trong khoảng giá
    public Page<FlowerProduct> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice, pageable);
    }

    // Lưu hoặc cập nhật sản phẩm
    @Transactional
    public FlowerProduct saveProduct(FlowerProduct product, Set<Long> categoryIds) {
        // Gán danh mục cho sản phẩm
        if (categoryIds != null && !categoryIds.isEmpty()) {
            Set<FlowerCategory> categories = categoryIds.stream()
                    .map(id -> categoryRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id)))
                    .collect(Collectors.toSet());
            product.getCategories().clear();
            for (FlowerCategory category : categories) {
                product.addCategory(category);
            }
        }

        return productRepository.save(product);
    }

    // Cập nhật hình ảnh sản phẩm
    @Transactional
    public FlowerProduct updateProductImages(Long productId, List<ProductImage> images) {
        FlowerProduct product = getProductById(productId);

        // Xóa các hình ảnh cũ
        product.getImages().clear();

        // Thêm hình ảnh mới
        for (ProductImage image : images) {
            image.setProduct(product);
            product.addImage(image);
        }

        return productRepository.save(product);
    }

    // Xóa sản phẩm
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Cập nhật trạng thái hiển thị sản phẩm
    @Transactional
    public FlowerProduct updateProductStatus(Long id, boolean isActive) {
        FlowerProduct product = getProductById(id);
        product.setActive(isActive);
        return productRepository.save(product);
    }

    // Đánh dấu sản phẩm là nổi bật
    @Transactional
    public FlowerProduct markProductAsFeatured(Long id, boolean isFeatured) {
        FlowerProduct product = getProductById(id);
        product.setFeatured(isFeatured);
        return productRepository.save(product);
    }
}