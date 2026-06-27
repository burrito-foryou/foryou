package xyz.abcganada.foryou.auth.oauth.google;

import org.springframework.util.StringUtils;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.member.domain.AuthProvider;

public record GoogleUserResponse(
    String sub,
    String email,
    String name
) {
    public boolean isValid() {
        return StringUtils.hasText(sub)
            && StringUtils.hasText(email)
            && StringUtils.hasText(name);
    }

    public OAuthUserInfo toOAuthUserInfo() {
        return new OAuthUserInfo(AuthProvider.GOOGLE, sub, email, name);
    }
}
