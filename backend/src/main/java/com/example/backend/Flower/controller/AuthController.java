package com.example.backend.Flower.controller;

import com.example.backend.Flower.dto.GoogleLoginRequest;
import com.example.backend.Flower.service.GoogleAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final GoogleAuthService googleAuthService;

    @PostMapping("/google-login")
    public ResponseEntity<Map<String, Object>> handleGoogleLogin(@RequestBody GoogleLoginRequest request) {
        Map<String, Object> response = googleAuthService.handleGoogleLogin(request);
        return ResponseEntity.ok(response);
    }
} 