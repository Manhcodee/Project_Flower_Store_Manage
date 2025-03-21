package com.example.backend.Flower.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;

import com.example.backend.Flower.dto.auth.ForgotPasswordRequest;
import com.example.backend.Flower.dto.auth.RegisterRequest;
import com.example.backend.Flower.dto.auth.ResetPasswordRequest;
import com.example.backend.Flower.dto.auth.VerifyCodeRequest;
import com.example.backend.Flower.service.AuthService;
import com.example.backend.Flower.service.PasswordResetService;
import com.example.backend.Flower.dto.login.JwtAuthResponse;
import com.example.backend.Flower.dto.login.LoginDto;
import com.example.backend.Flower.entity.model.user.User;
import com.example.backend.Flower.entity.enums.Role;
import com.example.backend.Flower.repository.user.UserRepository;
import com.example.backend.Flower.security.JwtTokenProvider;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().body(Map.of("message", "Đăng ký thành công"));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto) {
        JwtAuthResponse response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendVerificationCode(request.getEmail());
            return ResponseEntity.ok().body(Map.of("message", "Mã xác nhận đã được gửi đến email của bạn"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        try {
            boolean isValid = passwordResetService.verifyCode(request.getEmail(), request.getCode());
            return ResponseEntity.ok().body(Map.of("valid", isValid, "message", "Mã xác nhận hợp lệ"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
            return ResponseEntity.ok().body(Map.of("message", "Mật khẩu đã được đặt lại thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/google-login")
    public ResponseEntity<?> handleGoogleLogin(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            String picture = request.get("picture");
            String googleId = request.get("sub");

            // Tìm user theo email hoặc googleId
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> userRepository.findByGoogleId(googleId)
                    .orElseGet(() -> {
                        // Tạo user mới nếu chưa tồn tại
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setFullName(name);
                        newUser.setGoogleId(googleId);
                        newUser.setProfilePicture(picture);
                        newUser.setPassword("GOOGLE_" + System.currentTimeMillis()); // Mật khẩu ngẫu nhiên
                        newUser.setRole(Role.USER);
                        newUser.setEnabled(true);
                        return userRepository.save(newUser);
                    }));

            // Cập nhật thông tin nếu cần
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user.setProfilePicture(picture);
                userRepository.save(user);
            }

            // Tạo JWT token
            String token = jwtTokenProvider.generateToken(user.getEmail());

            // Trả về response
            return ResponseEntity.ok(Map.of(
                "accessToken", token,
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Đăng nhập Google thất bại: " + e.getMessage()));
        }
    }
    
    // Endpoint kiểm tra kết nối
    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok().body(Map.of("status", "online", "message", "Kết nối đến máy chủ thành công"));
    }
} 