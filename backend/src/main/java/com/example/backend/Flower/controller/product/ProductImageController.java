package com.example.backend.Flower.controller.product;

import com.example.backend.Flower.entity.model.Product.ProductImage;
import com.example.backend.Flower.repository.product.ProductImageRepository;
import com.example.backend.Flower.service.product.FlowerProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageRepository imageRepository;
    private final FlowerProductService productService;

    private final String UPLOAD_DIR = "uploads/products/";

    // Lấy tất cả hình ảnh của một sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImage>> getProductImages(@PathVariable Long productId) {
        List<ProductImage> images = imageRepository.findByProductIdOrderByDisplayOrderAsc(productId);
        return ResponseEntity.ok(images);
    }

    // Lấy hình ảnh chính của sản phẩm
    @GetMapping("/product/{productId}/main")
    public ResponseEntity<ProductImage> getMainProductImage(@PathVariable Long productId) {
        return imageRepository.findByProductIdAndIsMainTrue(productId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Upload hình ảnh cho sản phẩm
    @PostMapping("/upload/{productId}")
    public ResponseEntity<?> uploadProductImages(
            @PathVariable Long productId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "mainImageIndex", defaultValue = "0") int mainImageIndex) {

        try {
            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Lưu hình ảnh và tạo danh sách ProductImage
            List<ProductImage> productImages = new ArrayList<>();
            int displayOrder = 0;

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                // Tạo tên file duy nhất
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String newFilename = UUID.randomUUID().toString() + extension;

                // Lưu file
                Path filePath = uploadPath.resolve(newFilename);
                Files.copy(file.getInputStream(), filePath);

                // Tạo entity ProductImage
                ProductImage image = new ProductImage();
                image.setImageUrl("/uploads/products/" + newFilename);
                image.setMain(displayOrder == mainImageIndex);
                image.setDisplayOrder(displayOrder++);

                productImages.add(image);
            }

            // Cập nhật hình ảnh cho sản phẩm
            productService.updateProductImages(productId, productImages);

            return ResponseEntity.ok(Map.of(
                    "message", "Tải lên hình ảnh thành công",
                    "imageCount", productImages.size()));

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi tải lên hình ảnh: " + e.getMessage()));
        }
    }

    // Đặt hình ảnh chính cho sản phẩm
    @PatchMapping("/{imageId}/set-main")
    @Transactional
    public ResponseEntity<?> setMainImage(@PathVariable Long imageId) {
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hình ảnh với ID: " + imageId));

        // Bỏ đánh dấu các hình ảnh khác là hình ảnh chính
        imageRepository.unsetMainForOtherImages(image.getProduct().getId(), imageId);

        // Đánh dấu hình ảnh hiện tại là hình ảnh chính
        image.setMain(true);
        imageRepository.save(image);

        return ResponseEntity.ok(Map.of("message", "Đã đặt hình ảnh chính thành công"));
    }

    // Xóa hình ảnh
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hình ảnh với ID: " + imageId));

        // Xóa file từ hệ thống nếu cần
        String imagePath = image.getImageUrl().replace("/uploads/products/", UPLOAD_DIR);
        try {
            Files.deleteIfExists(Paths.get(imagePath));
        } catch (IOException e) {
            // Ghi log lỗi nhưng vẫn tiếp tục
            System.err.println("Không thể xóa file: " + imagePath);
        }

        // Xóa từ database
        imageRepository.delete(image);

        return ResponseEntity.ok(Map.of("message", "Đã xóa hình ảnh thành công"));
    }

    // Cập nhật thứ tự hiển thị
    @PatchMapping("/update-order")
    @Transactional
    public ResponseEntity<?> updateDisplayOrder(@RequestBody List<Map<String, Object>> orderData) {
        for (Map<String, Object> item : orderData) {
            Long imageId = Long.valueOf(item.get("imageId").toString());
            Integer displayOrder = Integer.valueOf(item.get("displayOrder").toString());

            ProductImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hình ảnh với ID: " + imageId));

            image.setDisplayOrder(displayOrder);
            imageRepository.save(image);
        }

        return ResponseEntity.ok(Map.of("message", "Đã cập nhật thứ tự hiển thị thành công"));
    }
}