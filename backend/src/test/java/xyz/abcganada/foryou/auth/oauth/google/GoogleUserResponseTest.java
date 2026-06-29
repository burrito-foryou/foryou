package xyz.abcganada.foryou.auth.oauth.google;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.member.domain.AuthProvider;

import static org.assertj.core.api.Assertions.assertThat;

class GoogleUserResponseTest {

    private static final String SUB = "google-sub-123";
    private static final String EMAIL = "google@example.com";
    private static final String NAME = "google-user";

    @Test
    @DisplayName("필수 사용자 정보가 있으면 유효하다")
    void isValid() {
        GoogleUserResponse response = new GoogleUserResponse(SUB, EMAIL, NAME);

        assertThat(response.isValid()).isTrue();
    }

    @Test
    @DisplayName("구글 subject가 없으면 유효하지 않다")
    void isInvalidWithoutSub() {
        GoogleUserResponse response = new GoogleUserResponse("", EMAIL, NAME);

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("이메일이 없으면 유효하지 않다")
    void isInvalidWithoutEmail() {
        GoogleUserResponse response = new GoogleUserResponse(SUB, "", NAME);

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("이름이 없으면 유효하지 않다")
    void isInvalidWithoutName() {
        GoogleUserResponse response = new GoogleUserResponse(SUB, EMAIL, "");

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("구글 사용자 응답을 OAuth 사용자 정보로 변환한다")
    void toOAuthUserInfo() {
        GoogleUserResponse response = new GoogleUserResponse(SUB, EMAIL, NAME);

        OAuthUserInfo userInfo = response.toOAuthUserInfo();

        assertThat(userInfo.provider()).isEqualTo(AuthProvider.GOOGLE);
        assertThat(userInfo.providerId()).isEqualTo(SUB);
        assertThat(userInfo.email()).isEqualTo(EMAIL);
        assertThat(userInfo.nickname()).isEqualTo(NAME);
    }
}
