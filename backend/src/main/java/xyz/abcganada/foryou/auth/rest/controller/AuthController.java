package xyz.abcganada.foryou.auth.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.auth.service.AuthService;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse response = authService.signup(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "로그인이 완료되었습니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();

        return ResponseEntity.noContent().build();
    }
}
