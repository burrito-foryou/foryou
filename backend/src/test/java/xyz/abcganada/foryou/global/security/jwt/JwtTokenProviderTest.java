package xyz.abcganada.foryou.global.security.jwt;

import fixture.MemberFixture;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import xyz.abcganada.foryou.member.domain.Member;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private static final String SECRET = "test-development-secret-key-for-foryou-jwt-token";
    private static final long ACCESS_TOKEN_EXPIRATION = 3_600_000L;
    private static final long REFRESH_TOKEN_EXPIRATION = 1_209_600_000L;

    private final JwtTokenProvider jwtTokenProvider = new JwtTokenProvider(
        SECRET,
        ACCESS_TOKEN_EXPIRATION,
        REFRESH_TOKEN_EXPIRATION
    );

    @Test
    @DisplayName("회원 정보로 액세스 토큰을 생성한다")
    void generateAccessToken() {
        // given
        Member member = MemberFixture.member();

        // when
        String accessToken = jwtTokenProvider.generateAccessToken(member);

        // then
        Claims claims = parseClaims(accessToken);

        assertThat(claims.getSubject()).isEqualTo(String.valueOf(MemberFixture.MEMBER_ID));
        assertThat(claims.get("email", String.class)).isEqualTo(MemberFixture.EMAIL);
        assertThat(claims.get("nickname", String.class)).isEqualTo(MemberFixture.NICKNAME);
        assertThat(claims.get("role", String.class)).isEqualTo(member.getRole().name());
        assertThat(claims.getIssuedAt()).isNotNull();
        assertThat(claims.getExpiration()).isAfter(claims.getIssuedAt());
    }

    @Test
    @DisplayName("회원 정보로 리프레시 토큰을 생성한다")
    void generateRefreshToken() {
        // given
        Member member = MemberFixture.member();

        // when
        String refreshToken = jwtTokenProvider.generateRefreshToken(member);

        // then
        Claims claims = parseClaims(refreshToken);

        assertThat(claims.getSubject()).isEqualTo(String.valueOf(MemberFixture.MEMBER_ID));
        assertThat(claims.getIssuedAt()).isNotNull();
        assertThat(claims.getExpiration()).isAfter(claims.getIssuedAt());
    }

    @Test
    @DisplayName("유효한 토큰이면 검증에 성공한다")
    void validateToken() {
        String token = jwtTokenProvider.generateAccessToken(MemberFixture.member());

        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("토큰에서 회원 ID를 추출한다")
    void getMemberId() {
        String token = jwtTokenProvider.generateAccessToken(MemberFixture.member());

        assertThat(jwtTokenProvider.getMemberId(token)).isEqualTo(MemberFixture.MEMBER_ID);
    }

    @Test
    @DisplayName("잘못된 토큰이면 검증에 실패한다")
    void validateInvalidToken() {
        assertThat(jwtTokenProvider.validateToken("invalid.token")).isFalse();
    }

    @Test
    @DisplayName("만료된 토큰이면 검증에 실패한다")
    void validateExpiredToken() {
        JwtTokenProvider expiredTokenProvider = new JwtTokenProvider(SECRET, -1_000L, REFRESH_TOKEN_EXPIRATION);
        String expiredToken = expiredTokenProvider.generateAccessToken(MemberFixture.member());

        assertThat(jwtTokenProvider.validateToken(expiredToken)).isFalse();
    }

    @Test
    @DisplayName("다른 서명 키로 생성된 토큰이면 검증에 실패한다")
    void validateTokenWithInvalidSignature() {
        JwtTokenProvider otherTokenProvider = new JwtTokenProvider(
            "other-development-secret-key-for-foryou-jwt-token",
            ACCESS_TOKEN_EXPIRATION,
            REFRESH_TOKEN_EXPIRATION
        );
        String token = otherTokenProvider.generateAccessToken(MemberFixture.member());

        assertThat(jwtTokenProvider.validateToken(token)).isFalse();
    }

    private Claims parseClaims(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
