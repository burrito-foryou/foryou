package xyz.abcganada.foryou.member.domain;

import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;

public enum AuthProvider {
    FORYOU,
    GOOGLE,
    KAKAO;

    public static AuthProvider fromSocial(String provider) {
        AuthProvider authProvider = from(provider);

        if (authProvider == FORYOU) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_OAUTH_PROVIDER);
        }

        return authProvider;
    }

    public static AuthProvider from(String provider) {
        try {
            return AuthProvider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_OAUTH_PROVIDER);
        }
    }
}
