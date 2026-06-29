package xyz.abcganada.foryou.auth.oauth.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.util.StringUtils;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.member.domain.AuthProvider;

public record KakaoUserResponse(
    Long id,

    @JsonProperty("kakao_account")
    KakaoAccount kakaoAccount
) {
    public boolean isValid() {
        return id != null
            && kakaoAccount != null
            && StringUtils.hasText(kakaoAccount.email())
            && kakaoAccount.profile() != null
            && StringUtils.hasText(kakaoAccount.profile().nickname());
    }

    public OAuthUserInfo toOAuthUserInfo() {
        return new OAuthUserInfo(
            AuthProvider.KAKAO,
            String.valueOf(id),
            kakaoAccount.email(),
            kakaoAccount.profile().nickname()
        );
    }

    public record KakaoAccount(String email, KakaoProfile profile) {
    }

    public record KakaoProfile(String nickname) {
    }
}
