package com.example.backend.Flower.service;

import com.example.backend.Flower.dto.login.GoogleLoginRequest;
import com.example.backend.Flower.entity.model.user.User;
import com.example.backend.Flower.repository.user.UserRepository;
import com.example.backend.Flower.security.JwtTokenProvider;
import com.example.backend.Flower.entity.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> handleGoogleLogin(GoogleLoginRequest request) {
        // Kiểm tra xem user đã tồn tại chưa
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        User user;
        if (existingUser.isPresent()) {
            // Cập nhật thông tin user nếu cần
            user = existingUser.get();
            user.setFullName(request.getName());
            user.setProfilePicture(request.getPicture());
            user.setGoogleId(request.getSub());
        } else {
            // Tạo user mới
            user = new User();
            user.setEmail(request.getEmail());
            user.setFullName(request.getName());
            user.setProfilePicture(request.getPicture());
            user.setGoogleId(request.getSub());
            // Tạo mật khẩu ngẫu nhiên
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole(Role.USER);
            user.setEnabled(true);
        }

        user = userRepository.save(user);

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