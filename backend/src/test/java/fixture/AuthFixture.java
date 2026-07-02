package fixture;

import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;
import xyz.abcganada.foryou.member.domain.AuthProvider;

public class AuthFixture {

    public static final String EMAIL = "test@example.com";
    public static final String PASSWORD = "password123!";
    public static final String NICKNAME = "tester";
    public static final String ACCESS_TOKEN = "access-token";
    public static final String REFRESH_TOKEN = "refresh-token";

    public static final String OAUTH_CODE = "authorization-code";
    public static final String KAKAO_PROVIDER_ID = "kakao-provider-id";
    public static final String GOOGLE_PROVIDER_ID = "google-provider-id";

    public static LoginRequest loginRequest() {
        return new LoginRequest(EMAIL, PASSWORD);
    }

    public static LoginRequest loginRequest(String email, String password) {
        return new LoginRequest(email, password);
    }

    public static LoginRequest invalidLoginRequest() {
        return new LoginRequest("invalid-email", "");
    }

    public static LoginResponse loginResponse() {
        return LoginResponse.of(ACCESS_TOKEN, REFRESH_TOKEN);
    }

    public static SignupRequest signupRequest() {
        return new SignupRequest(EMAIL, PASSWORD, NICKNAME);
    }

    public static SignupRequest signupRequest(String email, String password, String nickname) {
        return new SignupRequest(email, password, nickname);
    }

    public static SignupRequest invalidSignupRequest() {
        return new SignupRequest("invalid-email", "short", "");
    }

    public static SignupResponse signupResponse() {
        return new SignupResponse(MemberFixture.MEMBER_ID, EMAIL, NICKNAME);
    }

    public static OAuthUserInfo kakaoUserInfo() {
        return new OAuthUserInfo(
            AuthProvider.KAKAO,
            KAKAO_PROVIDER_ID,
            "kakao@example.com",
            "kakao-user"
        );
    }

    public static OAuthUserInfo googleUserInfo() {
        return new OAuthUserInfo(
            AuthProvider.GOOGLE,
            GOOGLE_PROVIDER_ID,
            "google@example.com",
            "google-user"
        );
    }
}
