package com.example.backend.Flower.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleLoginRequest {
    private String idToken;
    private String email;
    private String name;
    private String picture;
    private String sub;
} 