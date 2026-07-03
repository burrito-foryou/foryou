package xyz.abcganada.foryou.auth.oauth.kakao;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.member.domain.AuthProvider;

import static org.assertj.core.api.Assertions.assertThat;

class KakaoUserResponseTest {

    private static final Long ID = 12345L;
    private static final String EMAIL = "kakao@example.com";
    private static final String NICKNAME = "kakao-user";

    @Test
    @DisplayName("필수 사용자 정보가 있으면 유효하다")
    void isValid() {
        KakaoUserResponse response = kakaoUserResponse(ID, EMAIL, NICKNAME);

        assertThat(response.isValid()).isTrue();
    }

    @Test
    @DisplayName("카카오 ID가 없으면 유효하지 않다")
    void isInvalidWithoutId() {
        KakaoUserResponse response = kakaoUserResponse(null, EMAIL, NICKNAME);

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("카카오 계정 정보가 없으면 유효하지 않다")
    void isInvalidWithoutKakaoAccount() {
        KakaoUserResponse response = new KakaoUserResponse(ID, null);

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("이메일이 없으면 유효하지 않다")
    void isInvalidWithoutEmail() {
        KakaoUserResponse response = kakaoUserResponse(ID, "", NICKNAME);

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("프로필이 없으면 유효하지 않다")
    void isInvalidWithoutProfile() {
        KakaoUserResponse response = new KakaoUserResponse(
            ID,
            new KakaoUserResponse.KakaoAccount(EMAIL, null)
        );

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("닉네임이 없으면 유효하지 않다")
    void isInvalidWithoutNickname() {
        KakaoUserResponse response = kakaoUserResponse(ID, EMAIL, "");

        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("카카오 사용자 응답을 OAuth 사용자 정보로 변환한다")
    void toOAuthUserInfo() {
        KakaoUserResponse response = kakaoUserResponse(ID, EMAIL, NICKNAME);

        OAuthUserInfo userInfo = response.toOAuthUserInfo();

        assertThat(userInfo.provider()).isEqualTo(AuthProvider.KAKAO);
        assertThat(userInfo.providerId()).isEqualTo(String.valueOf(ID));
        assertThat(userInfo.email()).isEqualTo(EMAIL);
        assertThat(userInfo.nickname()).isEqualTo(NICKNAME);
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
