package com.example.backend.Flower.service;

import com.example.backend.Flower.dto.GoogleLoginRequest;
import com.example.backend.Flower.entity.User;
import com.example.backend.Flower.repository.UserRepository;
import com.example.backend.Flower.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> handleGoogleLogin(GoogleLoginRequest request) {
        // Kiểm tra xem user đã tồn tại chưa
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    // Tạo user mới nếu chưa tồn tại
                    User newUser = new User();
                    newUser.setEmail(request.getEmail());
                    newUser.setFullName(request.getFullName());
                    newUser.setGoogleId(request.getGoogleId());
                    newUser.setProfilePicture(request.getPicture());
                    // Tạo mật khẩu ngẫu nhiên cho user Google
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    newUser.setRole("ROLE_USER");
                    newUser.setEnabled(true);
                    return userRepository.save(newUser);
                });

        // Tạo JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());

        // Trả về response
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", token);
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());

        return response;
    }
} 