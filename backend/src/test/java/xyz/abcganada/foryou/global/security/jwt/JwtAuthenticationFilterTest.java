package xyz.abcganada.foryou.global.security.jwt;

import fixture.MemberFixture;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import xyz.abcganada.foryou.global.security.auth.AuthMember;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class JwtAuthenticationFilterTest {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String ACCESS_TOKEN = "access-token";

    private JwtTokenProvider jwtTokenProvider;
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private FilterChain filterChain;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = mock(JwtTokenProvider.class);
        jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtTokenProvider);
        filterChain = mock(FilterChain.class);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Authorization 헤더가 없으면 인증을 설정하지 않고 다음 필터로 진행한다")
    void doFilterWithoutAuthorizationHeader() throws Exception {
        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        // then
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtTokenProvider, never()).validateToken(ACCESS_TOKEN);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("유효한 Bearer 토큰이면 인증 정보를 SecurityContext에 저장한다")
    void doFilterWithValidToken() throws Exception {
        // given
        request.addHeader(AUTHORIZATION_HEADER, "Bearer " + ACCESS_TOKEN);
        given(jwtTokenProvider.validateToken(ACCESS_TOKEN)).willReturn(true);
        given(jwtTokenProvider.getMemberId(ACCESS_TOKEN)).willReturn(MemberFixture.MEMBER_ID);

        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        // then
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.isAuthenticated()).isTrue();
        assertThat(authentication.getPrincipal())
            .isEqualTo(new AuthMember(MemberFixture.MEMBER_ID));
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("유효하지 않은 Bearer 토큰이면 인증을 설정하지 않고 다음 필터로 진행한다")
    void doFilterWithInvalidToken() throws Exception {
        // given
        request.addHeader(AUTHORIZATION_HEADER, "Bearer " + ACCESS_TOKEN);
        given(jwtTokenProvider.validateToken(ACCESS_TOKEN)).willReturn(false);

        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        // then
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtTokenProvider, never()).getMemberId(ACCESS_TOKEN);
        verify(filterChain).doFilter(request, response);
    }
}
