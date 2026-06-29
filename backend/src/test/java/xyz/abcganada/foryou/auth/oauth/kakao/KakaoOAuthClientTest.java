package xyz.abcganada.foryou.auth.oauth.kakao;

import fixture.AuthFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestOperations;
import xyz.abcganada.foryou.auth.oauth.OAuthClientSupport;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class KakaoOAuthClientTest {

    private static final String TOKEN_URI = "https://kauth.kakao.com/oauth/token";
    private static final String USER_INFO_URI = "https://kapi.kakao.com/v2/user/me";
    private static final String KAKAO_ACCESS_TOKEN = "kakao-access-token";
    private static final Long KAKAO_ID = 12345L;
    private static final String KAKAO_EMAIL = "kakao@example.com";
    private static final String KAKAO_NICKNAME = "kakao-user";

    @Mock
    private RestOperations restOperations;

    @Mock
    private OAuthClientSupport oAuthClientSupport;

    @InjectMocks
    private KakaoOAuthClient kakaoOAuthClient;

    @Test
    @DisplayName("인가 코드로 카카오 사용자 정보를 조회한다")
    void getUserInfo() {
        // given
        ClientRegistration registration = clientRegistration();
        KakaoUserResponse userResponse = kakaoUserResponse(KAKAO_ID, KAKAO_EMAIL, KAKAO_NICKNAME);

        given(oAuthClientSupport.getRegistration("kakao"))
            .willReturn(registration);
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(KakaoTokenResponse.class)))
            .willReturn(new KakaoTokenResponse(KAKAO_ACCESS_TOKEN));
        given(restOperations.exchange(eq(USER_INFO_URI), eq(HttpMethod.GET), any(), eq(KakaoUserResponse.class)))
            .willReturn(ResponseEntity.ok(userResponse));

        // when
        OAuthUserInfo userInfo = kakaoOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE);

        // then
        assertThat(userInfo.provider()).isEqualTo(AuthProvider.KAKAO);
        assertThat(userInfo.providerId()).isEqualTo(String.valueOf(KAKAO_ID));
        assertThat(userInfo.email()).isEqualTo(KAKAO_EMAIL);
        assertThat(userInfo.nickname()).isEqualTo(KAKAO_NICKNAME);
    }

    @Test
    @DisplayName("카카오 토큰 요청에 실패하면 예외를 던진다")
    void getUserInfoWithTokenRequestFailure() {
        // given
        given(oAuthClientSupport.getRegistration("kakao"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(KakaoTokenResponse.class)))
            .willThrow(new RestClientException("token request failed"));

        // when & then
        assertThatThrownBy(() -> kakaoOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_TOKEN_REQUEST_FAILED)
            );
    }

    @Test
    @DisplayName("카카오 토큰 응답에 액세스 토큰이 없으면 예외를 던진다")
    void getUserInfoWithEmptyAccessToken() {
        // given
        given(oAuthClientSupport.getRegistration("kakao"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(KakaoTokenResponse.class)))
            .willReturn(new KakaoTokenResponse(""));

        // when & then
        assertThatThrownBy(() -> kakaoOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_TOKEN_REQUEST_FAILED)
            );
    }

    @Test
    @DisplayName("카카오 사용자 정보 요청에 실패하면 예외를 던진다")
    void getUserInfoWithUserInfoRequestFailure() {
        // given
        given(oAuthClientSupport.getRegistration("kakao"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(KakaoTokenResponse.class)))
            .willReturn(new KakaoTokenResponse(KAKAO_ACCESS_TOKEN));
        given(restOperations.exchange(eq(USER_INFO_URI), eq(HttpMethod.GET), any(), eq(KakaoUserResponse.class)))
            .willThrow(new RestClientException("user info request failed"));

        // when & then
        assertThatThrownBy(() -> kakaoOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_USER_INFO_REQUEST_FAILED)
            );
    }

    @Test
    @DisplayName("카카오 사용자 정보가 올바르지 않으면 예외를 던진다")
    void getUserInfoWithInvalidUserInfo() {
        // given
        KakaoUserResponse invalidResponse = kakaoUserResponse(KAKAO_ID, "", KAKAO_NICKNAME);

        given(oAuthClientSupport.getRegistration("kakao"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(KakaoTokenResponse.class)))
            .willReturn(new KakaoTokenResponse(KAKAO_ACCESS_TOKEN));
        given(restOperations.exchange(eq(USER_INFO_URI), eq(HttpMethod.GET), any(), eq(KakaoUserResponse.class)))
            .willReturn(ResponseEntity.ok(invalidResponse));

        // when & then
        assertThatThrownBy(() -> kakaoOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_USER_INFO_INVALID)
            );
    }

    private ClientRegistration clientRegistration() {
        return ClientRegistration.withRegistrationId("kakao")
            .clientId("kakao-client-id")
            .clientSecret("kakao-client-secret")
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .redirectUri("http://localhost:8080/api/auth/login/kakao")
            .authorizationUri("https://kauth.kakao.com/oauth/authorize")
            .tokenUri(TOKEN_URI)
            .userInfoUri(USER_INFO_URI)
            .userNameAttributeName("id")
            .build();
    }

    private KakaoUserResponse kakaoUserResponse(Long id, String email, String nickname) {
        return new KakaoUserResponse(
            id,
            new KakaoUserResponse.KakaoAccount(
                email,
                new KakaoUserResponse.KakaoProfile(nickname)
            )
        );
    }
}
