package xyz.abcganada.foryou.auth.oauth;

import xyz.abcganada.foryou.member.domain.AuthProvider;

public record OAuthUserInfo(
    AuthProvider provider,
    String providerId,
    String email,
    String nickname
) {
}
