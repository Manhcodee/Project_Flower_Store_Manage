package com.example.backend.Flower.service;

import com.example.backend.Flower.dto.login.GoogleLoginRequest;
import com.example.backend.Flower.entity.model.user.User;
import com.example.backend.Flower.entity.enums.Role;
import com.example.backend.Flower.repository.user.UserRepository;
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
                    newUser.setRole(Role.USER);
                    newUser.setEnabled(true);
                    // Số điện thoại tạm thời để null vì đăng nhập Google không yêu cầu
                    return userRepository.save(newUser);
                });

        // Cập nhật thông tin Google nếu user đã tồn tại nhưng chưa liên kết với Google
        if (user.getGoogleId() == null) {
            user.setGoogleId(request.getGoogleId());
            user.setProfilePicture(request.getPicture());
            user.setEnabled(true);
            userRepository.save(user);
        }

        // Tạo JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail());

        // Trả về response
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", token);
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole().toString());
        response.put("profilePicture", user.getProfilePicture());

        return response;
    }
}