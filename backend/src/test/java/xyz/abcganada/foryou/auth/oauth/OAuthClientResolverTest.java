package xyz.abcganada.foryou.auth.oauth;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

class OAuthClientResolverTest {

    @Test
    @DisplayName("요청한 Provider에 맞는 OAuthClient를 반환한다")
    void resolve() {
        // given
        OAuthClient kakaoClient = mock(OAuthClient.class);
        OAuthClient googleClient = mock(OAuthClient.class);

        given(kakaoClient.provider()).willReturn(AuthProvider.KAKAO);
        given(googleClient.provider()).willReturn(AuthProvider.GOOGLE);

        OAuthClientResolver resolver = new OAuthClientResolver(List.of(kakaoClient, googleClient));

        // when & then
        assertThat(resolver.resolve(AuthProvider.KAKAO)).isSameAs(kakaoClient);
        assertThat(resolver.resolve(AuthProvider.GOOGLE)).isSameAs(googleClient);
    }

    @Test
    @DisplayName("지원하지 않는 제공자이면 예외를 던진다")
    void resolveUnsupportedProvider() {
        // given
        OAuthClient kakaoClient = mock(OAuthClient.class);

        given(kakaoClient.provider()).willReturn(AuthProvider.KAKAO);

        OAuthClientResolver resolver = new OAuthClientResolver(List.of(kakaoClient));

        // when & then
        assertThatThrownBy(() -> resolver.resolve(AuthProvider.GOOGLE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.UNSUPPORTED_OAUTH_PROVIDER)
            );
    }
}
