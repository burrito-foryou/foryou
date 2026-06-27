package xyz.abcganada.foryou.auth.rest.controller;

import fixture.AuthFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.service.AuthService;
import xyz.abcganada.foryou.common.RestControllerTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest extends RestControllerTest {

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        setupController(new AuthController(authService));
    }

    @Test
    @DisplayName("로그인 요청에 성공하면 200 응답을 반환한다")
    void login() throws Exception {
        // given
        LoginRequest request = AuthFixture.loginRequest();

        given(authService.login(any(LoginRequest.class)))
            .willReturn(AuthFixture.loginResponse());

        // when & then
        postRequest("/api/auth/login", request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("로그인이 완료되었습니다."))
            .andExpect(jsonPath("$.data.accessToken").value(AuthFixture.ACCESS_TOKEN))
            .andExpect(jsonPath("$.data.tokenType").value("Bearer"));

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("로그인 중 비즈니스 예외가 발생하면 에러 응답을 반환한다")
    void loginWithBusinessException() throws Exception {
        // given
        LoginRequest request = AuthFixture.loginRequest();

        given(authService.login(any(LoginRequest.class)))
            .willThrow(new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS));

        // when & then
        postRequest("/api/auth/login", request)
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("AUTH_001"))
            .andExpect(jsonPath("$.message").value("이메일 또는 비밀번호가 올바르지 않습니다."));
    }

    @Test
    @DisplayName("로그인 요청값이 유효하지 않으면 잘못된 입력값 응답을 반환한다")
    void loginWithInvalidRequest() throws Exception {
        // given
        LoginRequest request = AuthFixture.invalidLoginRequest();

        // when & then
        postRequest("/api/auth/login", request)
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("COMMON_001"))
            .andExpect(jsonPath("$.message").value("잘못된 입력값입니다."));
    }

    @Test
    @DisplayName("소셜 로그인 요청에 성공하면 200 응답을 반환한다")
    void socialLogin() throws Exception {
        // given
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", AuthFixture.OAUTH_CODE);

        given(authService.socialLogin(eq(AuthProvider.KAKAO), eq(AuthFixture.OAUTH_CODE)))
            .willReturn(AuthFixture.loginResponse());

        // when & then
        getRequest("/api/auth/login/kakao", params)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("kakao 로그인이 완료되었습니다."))
            .andExpect(jsonPath("$.data.accessToken").value(AuthFixture.ACCESS_TOKEN))
            .andExpect(jsonPath("$.data.tokenType").value("Bearer"));

        verify(authService).socialLogin(AuthProvider.KAKAO, AuthFixture.OAUTH_CODE);
    }

    @Test
    @DisplayName("지원하지 않는 소셜 로그인 제공자이면 에러 응답을 반환한다")
    void socialLoginWithUnsupportedProvider() throws Exception {
        // given
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", AuthFixture.OAUTH_CODE);

        // when & then
        getRequest("/api/auth/login/foryou", params)
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("AUTH_002"))
            .andExpect(jsonPath("$.message").value("지원하지 않는 소셜 로그인 제공자입니다."));
    }

    @Test
    @DisplayName("회원가입 요청에 성공하면 201 응답을 반환한다")
    void signup() throws Exception {
        // given
        SignupRequest request = AuthFixture.signupRequest();

        given(authService.signup(any(SignupRequest.class)))
            .willReturn(AuthFixture.signupResponse());

        // when & then
        postRequest("/api/auth/signup", request)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다."))
            .andExpect(jsonPath("$.data.memberId").value(1L))
            .andExpect(jsonPath("$.data.email").value("test@example.com"))
            .andExpect(jsonPath("$.data.nickname").value("tester"));

        verify(authService).signup(any(SignupRequest.class));
    }

    @Test
    @DisplayName("회원가입 중 비즈니스 예외가 발생하면 에러 응답을 반환한다")
    void signupWithBusinessException() throws Exception {
        // given
        SignupRequest request = AuthFixture.signupRequest();

        given(authService.signup(any(SignupRequest.class)))
            .willThrow(new BusinessException(ErrorCode.DUPLICATE_EMAIL));

        // when & then
        postRequest("/api/auth/signup", request)
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("MEMBER_001"))
            .andExpect(jsonPath("$.message").value("이미 사용 중인 이메일입니다."));
    }

    @Test
    @DisplayName("회원가입 요청값이 유효하지 않으면 잘못된 입력값 응답을 반환한다")
    void signupWithInvalidRequest() throws Exception {
        // given
        SignupRequest request = AuthFixture.invalidSignupRequest();

        // when & then
        postRequest("/api/auth/signup", request)
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("COMMON_001"))
            .andExpect(jsonPath("$.message").value("잘못된 입력값입니다."));
    }
}
