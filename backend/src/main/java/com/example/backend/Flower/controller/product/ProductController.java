package com.example.backend.Flower.controller.product;

import com.example.backend.Flower.entity.model.Product.FlowerProduct;
import com.example.backend.Flower.service.product.FlowerProductService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final FlowerProductService productService;

    // Lấy danh sách sản phẩm có phân trang và sắp xếp
    @GetMapping
    public ResponseEntity<Page<FlowerProduct>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<FlowerProduct> products = productService.getAllProducts(pageable);

        return ResponseEntity.ok(products);
    }

    // Lấy thông tin chi tiết sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<FlowerProduct> getProductById(@PathVariable Long id) {
        FlowerProduct product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // Tìm kiếm sản phẩm theo tên
    @GetMapping("/search")
    public ResponseEntity<Page<FlowerProduct>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<FlowerProduct> products = productService.searchProductsByName(keyword, pageable);

        return ResponseEntity.ok(products);
    }

    // Lấy sản phẩm theo danh mục
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<FlowerProduct>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<FlowerProduct> products = productService.getProductsByCategory(categoryId, pageable);

        return ResponseEntity.ok(products);
    }

    // Lấy sản phẩm nổi bật
    @GetMapping("/featured")
    public ResponseEntity<Page<FlowerProduct>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<FlowerProduct> featuredProducts = productService.getFeaturedProducts(pageable);

        return ResponseEntity.ok(featuredProducts);
    }

    // Lấy sản phẩm mới nhất
    @GetMapping("/latest")
    public ResponseEntity<List<FlowerProduct>> getLatestProducts() {
        List<FlowerProduct> latestProducts = productService.getLatestProducts();
        return ResponseEntity.ok(latestProducts);
    }

    // Lấy sản phẩm trong khoảng giá
    @GetMapping("/price-range")
    public ResponseEntity<Page<FlowerProduct>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<FlowerProduct> products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);

        return ResponseEntity.ok(products);
    }

    // Thêm hoặc cập nhật sản phẩm
    @PostMapping
    public ResponseEntity<FlowerProduct> createProduct(
            @Valid @RequestBody FlowerProduct product,
            @RequestParam Set<Long> categoryIds) {

        FlowerProduct savedProduct = productService.saveProduct(product, categoryIds);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<FlowerProduct> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody FlowerProduct product,
            @RequestParam Set<Long> categoryIds) {

        product.setId(id);
        FlowerProduct updatedProduct = productService.saveProduct(product, categoryIds);

        return ResponseEntity.ok(updatedProduct);
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Đánh dấu sản phẩm là nổi bật
    @PatchMapping("/{id}/featured")
    public ResponseEntity<FlowerProduct> setProductFeatured(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {

        boolean isFeatured = payload.getOrDefault("featured", false);
        FlowerProduct product = productService.markProductAsFeatured(id, isFeatured);

        return ResponseEntity.ok(product);
    }

    // Cập nhật trạng thái hiển thị sản phẩm
    @PatchMapping("/{id}/status")
    public ResponseEntity<FlowerProduct> updateProductStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {

        boolean isActive = payload.getOrDefault("active", true);
        FlowerProduct product = productService.updateProductStatus(id, isActive);

        return ResponseEntity.ok(product);
    }
}
