package com.example.backend.Flower.controller.auth;

import com.example.backend.Flower.dto.login.GoogleLoginRequest;
import com.example.backend.Flower.service.GoogleAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody GoogleLoginRequest request) throws Exception {
        // Lấy idToken từ request
        String idToken = request.getIdToken();

        // Tạo verifier
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory())
                .setAudience(Collections
                        .singletonList("69558543242-3hmue8rdkl7ij5f26re6e73toojkgaa8.apps.googleusercontent.com"))
                .build();

        // Verify token
        GoogleIdToken googleIdToken = verifier.verify(idToken);
        if (googleIdToken == null) {
            throw new RuntimeException("Invalid ID token");
        }

        GoogleIdToken.Payload payload = googleIdToken.getPayload();

        // Lấy thông tin người dùng
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        String googleId = payload.getSubject();

        // Gọi service
        Map<String, Object> response = googleAuthService.handleGoogleLogin(
                new GoogleLoginRequest(email, name, pictureUrl, googleId));

        return ResponseEntity.ok(response);
    }
}
