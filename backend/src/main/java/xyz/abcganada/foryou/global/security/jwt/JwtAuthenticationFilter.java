package xyz.abcganada.foryou.global.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.global.security.auth.AuthMember;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String JWT_ERROR_CODE_ATTRIBUTE = "jwtErrorCode";

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String token = resolveToken(request);

        if (token != null) {
            try {
                Long memberId = jwtTokenProvider.getMemberId(token);
                String role = jwtTokenProvider.getRole(token);
                setAuthentication(memberId, role);
            } catch (ExpiredJwtException e) {
                request.setAttribute(JWT_ERROR_CODE_ATTRIBUTE, ErrorCode.EXPIRED_TOKEN);
            } catch (JwtException | IllegalArgumentException e) {
                request.setAttribute(JWT_ERROR_CODE_ATTRIBUTE, ErrorCode.UNAUTHORIZED);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {

        // SSE는 query token 먼저 확인
        if (request.getRequestURI().startsWith("/api/notifications/subscribe")) {
            String token = request.getParameter("token");
            if (token != null) {
                return token;
            }
        }

        String authorization = request.getHeader(AUTHORIZATION_HEADER);

        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)) {
            return null;
        }

        return authorization.substring(BEARER_PREFIX.length());
    }

    private void setAuthentication(Long memberId, String role) {
        AuthMember authMember = new AuthMember(memberId);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            authMember,
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
