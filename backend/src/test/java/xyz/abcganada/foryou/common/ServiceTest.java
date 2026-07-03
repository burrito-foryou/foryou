package xyz.abcganada.foryou.common;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import xyz.abcganada.foryou.auth.oauth.OAuthClientResolver;
import xyz.abcganada.foryou.global.security.jwt.JwtTokenProvider;
import xyz.abcganada.foryou.global.security.jwt.RefreshTokenRepository;
import xyz.abcganada.foryou.member.repository.MemberRepository;

@ExtendWith(MockitoExtension.class)
public abstract class ServiceTest {
    @Mock
    protected MemberRepository memberRepository;

    @Mock
    protected PasswordEncoder passwordEncoder;

    @Mock
    protected JwtTokenProvider jwtTokenProvider;

    @Mock
    protected OAuthClientResolver oAuthClientResolver;

    @Mock
    protected RefreshTokenRepository refreshTokenRepository;
}
