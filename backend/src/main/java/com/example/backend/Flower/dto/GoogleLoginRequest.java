package com.example.backend.Flower.dto;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String email;
    private String fullName;
    private String picture;
    private String googleId;
} 