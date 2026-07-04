package xyz.abcganada.foryou.auth.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.request.ReissueRequest;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.auth.service.AuthService;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.member.domain.AuthProvider;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입", description = "이메일/비밀번호로 회원가입한다.")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody SignupRequest request) {
        log.info("[Auth] 회원가입 요청 - email: {}", request.email());
        SignupResponse response = authService.signup(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "회원가입이 완료되었습니다."));
    }

    @Operation(summary = "로그인", description = "이메일/비밀번호로 로그인한다.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("[Auth] 로그인 요청 - email: {}", request.email());
        LoginResponse response = authService.login(request);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "로그인이 완료되었습니다."));
    }

    @Operation(summary = "소셜 로그인", description = "OAuth2 provider의 인가 코드로 로그인한다.")
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

    @Operation(summary = "토큰 재발급", description = "리프레시 토큰으로 액세스/리프레시 토큰을 재발급한다.")
    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<LoginResponse>> reissue(@Valid @RequestBody ReissueRequest request) {
        log.info("[Auth] 토큰 재발급 요청");
        LoginResponse response = authService.reissue(request.refreshToken());

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "토큰이 재발급되었습니다."));
    }

    @Operation(summary = "로그아웃", description = "로그아웃 처리하고 리프레시 토큰을 무효화한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal AuthMember member) {
        log.info("[Auth] 로그아웃 요청 - memberId: {}", member.memberId());
        authService.logout(member.memberId());

        return ResponseEntity.noContent().build();
    }
}
