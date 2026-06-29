package xyz.abcganada.foryou.auth.oauth.google;

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
class GoogleOAuthClientTest {

    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String USER_INFO_URI = "https://www.googleapis.com/oauth2/v3/userinfo";
    private static final String GOOGLE_ACCESS_TOKEN = "google-access-token";
    private static final String GOOGLE_SUB = "google-sub-123";
    private static final String GOOGLE_EMAIL = "google@example.com";
    private static final String GOOGLE_NAME = "google-user";

    @Mock
    private RestOperations restOperations;

    @Mock
    private OAuthClientSupport oAuthClientSupport;

    @InjectMocks
    private GoogleOAuthClient googleOAuthClient;

    @Test
    @DisplayName("인가 코드로 구글 사용자 정보를 조회한다")
    void getUserInfo() {
        // given
        ClientRegistration registration = clientRegistration();
        GoogleUserResponse userResponse = new GoogleUserResponse(GOOGLE_SUB, GOOGLE_EMAIL, GOOGLE_NAME);

        given(oAuthClientSupport.getRegistration("google"))
            .willReturn(registration);
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(GoogleTokenResponse.class)))
            .willReturn(new GoogleTokenResponse(GOOGLE_ACCESS_TOKEN));
        given(restOperations.exchange(eq(USER_INFO_URI), eq(HttpMethod.GET), any(), eq(GoogleUserResponse.class)))
            .willReturn(ResponseEntity.ok(userResponse));

        // when
        OAuthUserInfo userInfo = googleOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE);

        // then
        assertThat(userInfo.provider()).isEqualTo(AuthProvider.GOOGLE);
        assertThat(userInfo.providerId()).isEqualTo(GOOGLE_SUB);
        assertThat(userInfo.email()).isEqualTo(GOOGLE_EMAIL);
        assertThat(userInfo.nickname()).isEqualTo(GOOGLE_NAME);
    }

    @Test
    @DisplayName("구글 토큰 요청에 실패하면 예외를 던진다")
    void getUserInfoWithTokenRequestFailure() {
        // given
        given(oAuthClientSupport.getRegistration("google"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(GoogleTokenResponse.class)))
            .willThrow(new RestClientException("token request failed"));

        // when & then
        assertThatThrownBy(() -> googleOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_TOKEN_REQUEST_FAILED)
            );
    }

    @Test
    @DisplayName("구글 토큰 응답에 액세스 토큰이 없으면 예외를 던진다")
    void getUserInfoWithEmptyAccessToken() {
        // given
        given(oAuthClientSupport.getRegistration("google"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(GoogleTokenResponse.class)))
            .willReturn(new GoogleTokenResponse(""));

        // when & then
        assertThatThrownBy(() -> googleOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_TOKEN_REQUEST_FAILED)
            );
    }

    @Test
    @DisplayName("구글 사용자 정보 요청에 실패하면 예외를 던진다")
    void getUserInfoWithUserInfoRequestFailure() {
        // given
        given(oAuthClientSupport.getRegistration("google"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(GoogleTokenResponse.class)))
            .willReturn(new GoogleTokenResponse(GOOGLE_ACCESS_TOKEN));
        given(restOperations.exchange(eq(USER_INFO_URI), eq(HttpMethod.GET), any(), eq(GoogleUserResponse.class)))
            .willThrow(new RestClientException("user info request failed"));

        // when & then
        assertThatThrownBy(() -> googleOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_USER_INFO_REQUEST_FAILED)
            );
    }

    @Test
    @DisplayName("구글 사용자 정보가 올바르지 않으면 예외를 던진다")
    void getUserInfoWithInvalidUserInfo() {
        // given
        GoogleUserResponse invalidResponse = new GoogleUserResponse(GOOGLE_SUB, "", GOOGLE_NAME);

        given(oAuthClientSupport.getRegistration("google"))
            .willReturn(clientRegistration());
        given(restOperations.postForObject(eq(TOKEN_URI), any(), eq(GoogleTokenResponse.class)))
            .willReturn(new GoogleTokenResponse(GOOGLE_ACCESS_TOKEN));
        given(restOperations.exchange(eq(USER_INFO_URI), eq(HttpMethod.GET), any(), eq(GoogleUserResponse.class)))
            .willReturn(ResponseEntity.ok(invalidResponse));

        // when & then
        assertThatThrownBy(() -> googleOAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_USER_INFO_INVALID)
            );
    }

    private ClientRegistration clientRegistration() {
        return ClientRegistration.withRegistrationId("google")
            .clientId("google-client-id")
            .clientSecret("google-client-secret")
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .redirectUri("http://localhost:8080/api/auth/login/google")
            .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
            .tokenUri(TOKEN_URI)
            .userInfoUri(USER_INFO_URI)
            .userNameAttributeName("sub")
            .build();
    }
}
