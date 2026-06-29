package xyz.abcganada.foryou.auth.oauth;

import xyz.abcganada.foryou.member.domain.AuthProvider;

public interface OAuthClient {
    AuthProvider provider();

    OAuthUserInfo getUserInfo(String code);
}
