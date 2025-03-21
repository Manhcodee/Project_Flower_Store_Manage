package com.example.backend.Flower.controller.auth;

import com.example.backend.Flower.entity.model.user.User;
import com.example.backend.Flower.repository.user.UserRepository;
import com.example.backend.Flower.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FacebookAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String facebookClientId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    private String facebookClientSecret;

    @PostMapping("/facebook-login")
    public ResponseEntity<?> handleFacebookLogin(@RequestBody Map<String, Object> facebookData) {
        try {
            String accessToken = (String) facebookData.get("accessToken");
            
            // Xác thực access token với Facebook
            RestTemplate restTemplate = new RestTemplate();
            String validateTokenUrl = String.format(
                "https://graph.facebook.com/debug_token?input_token=%s&access_token=%s|%s",
                accessToken, facebookClientId, facebookClientSecret
            );
            
            ResponseEntity<Map> tokenInfo = restTemplate.getForEntity(validateTokenUrl, Map.class);
            if (tokenInfo.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Token không hợp lệ");
            }
            
            // Lấy thông tin user từ Facebook
            String facebookGraphApiUrl = String.format(
                "https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=%s",
                accessToken
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            
            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                facebookGraphApiUrl,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
            );
            
            if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Không thể lấy thông tin từ Facebook");
            }
            
            Map<String, Object> userInfo = userInfoResponse.getBody();
            if (userInfo == null || !userInfo.containsKey("email")) {
                throw new RuntimeException("Không thể lấy email từ Facebook");
            }

            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String facebookId = (String) userInfo.get("id");
            
            @SuppressWarnings("unchecked")
            String picture = userInfo.containsKey("picture") ? 
                ((Map<String, Map<String, String>>) userInfo.get("picture"))
                    .get("data")
                    .get("url") : null;

            // Tìm hoặc tạo user
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                // Cập nhật thông tin Facebook
                user.setProfilePicture(picture);
                user.setFacebookId(facebookId);
                userRepository.save(user);
            } else {
                // Tạo user mới
                user = new User();
                user.setEmail(email);
                user.setFullName(name);
                user.setProfilePicture(picture);
                user.setFacebookId(facebookId);
                user.setPassword(""); // Facebook users don't need password
                user.setEnabled(true);
                userRepository.save(user);
            }

            // Tạo JWT token
            String token = jwtTokenProvider.generateToken(user.getEmail());

            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", token);
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole());

            return ResponseEntity.ok()
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000")
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
                .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000")
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
                .body("Đăng nhập Facebook thất bại: " + e.getMessage());
        }
    }
}
