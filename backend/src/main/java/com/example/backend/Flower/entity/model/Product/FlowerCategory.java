package com.example.backend.Flower.entity.model.Product;

import com.example.backend.Flower.entity.enums.FlowerCategoryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "flower_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlowerCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_type")
    private FlowerCategoryType categoryType;

    @ManyToMany(mappedBy = "categories")
    private Set<FlowerProduct> products = new HashSet<>();

    // Getter và setter được tạo bởi Lombok annotation @Data
}
