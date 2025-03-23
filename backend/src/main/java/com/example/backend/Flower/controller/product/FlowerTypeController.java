package com.example.backend.Flower.controller.product;

import com.example.backend.Flower.entity.enums.FlowerCategoryType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/flower-types")
public class FlowerTypeController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllFlowerTypes() {
        List<Map<String, String>> flowerTypes = Arrays.stream(FlowerCategoryType.values())
                .map(type -> {
                    Map<String, String> flowerType = new HashMap<>();
                    flowerType.put("code", type.name());
                    flowerType.put("name", type.getVietnameseName());
                    return flowerType;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(flowerTypes);
    }

    @GetMapping("/grouped")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getGroupedFlowerTypes() {
        // Nhóm các loại hoa
        Map<String, List<Map<String, String>>> groupedFlowerTypes = new HashMap<>();

        // Nhóm hoa thực
        List<Map<String, String>> actualFlowers = Arrays.stream(FlowerCategoryType.values())
                .filter(type -> !type.name().contains("_FLOWERS")
                        && !type.name().equals("BOUQUET")
                        && !type.name().equals("BASKET")
                        && !type.name().equals("BOX")
                        && !type.name().equals("VASE")
                        && !type.name().equals("OTHER"))
                .map(type -> {
                    Map<String, String> flowerType = new HashMap<>();
                    flowerType.put("code", type.name());
                    flowerType.put("name", type.getVietnameseName());
                    return flowerType;
                })
                .collect(Collectors.toList());
        groupedFlowerTypes.put("Các loại hoa", actualFlowers);

        // Nhóm kiểu bó/giỏ hoa
        List<Map<String, String>> arrangementTypes = Arrays.stream(FlowerCategoryType.values())
                .filter(type -> type.name().equals("BOUQUET")
                        || type.name().equals("BASKET")
                        || type.name().equals("BOX")
                        || type.name().equals("VASE"))
                .map(type -> {
                    Map<String, String> flowerType = new HashMap<>();
                    flowerType.put("code", type.name());
                    flowerType.put("name", type.getVietnameseName());
                    return flowerType;
                })
                .collect(Collectors.toList());
        groupedFlowerTypes.put("Kiểu bó/giỏ hoa", arrangementTypes);

        // Nhóm theo dịp
        List<Map<String, String>> occasionTypes = Arrays.stream(FlowerCategoryType.values())
                .filter(type -> type.name().contains("_FLOWERS"))
                .map(type -> {
                    Map<String, String> flowerType = new HashMap<>();
                    flowerType.put("code", type.name());
                    flowerType.put("name", type.getVietnameseName());
                    return flowerType;
                })
                .collect(Collectors.toList());
        groupedFlowerTypes.put("Dịp tặng hoa", occasionTypes);

        return ResponseEntity.ok(groupedFlowerTypes);
    }
}