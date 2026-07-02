package xyz.abcganada.foryou.auth.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.auth.service.AuthService;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;
import xyz.abcganada.foryou.member.domain.AuthProvider;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody SignupRequest request) {
        log.info("[Auth] 회원가입 요청 - email: {}", request.email());
        SignupResponse response = authService.signup(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("[Auth] 로그인 요청 - email: {}", request.email());
        LoginResponse response = authService.login(request);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "로그인이 완료되었습니다."));
    }

    @GetMapping("/login/{provider}")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
        @PathVariable String provider,
        @RequestParam String code
    ) {
        log.info("[Auth] 소셜 로그인 요청 - provider: {}", provider);
        LoginResponse response = authService.socialLogin(AuthProvider.fromSocial(provider), code);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, provider + " 로그인이 완료되었습니다."));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        log.info("[Auth] 로그아웃 요청");
        authService.logout();

        return ResponseEntity.noContent().build();
    }
}
