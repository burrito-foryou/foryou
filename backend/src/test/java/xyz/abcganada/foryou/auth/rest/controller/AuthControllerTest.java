package xyz.abcganada.foryou.auth.rest.controller;

import fixture.AuthFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.service.AuthService;
import xyz.abcganada.foryou.common.RestControllerTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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
