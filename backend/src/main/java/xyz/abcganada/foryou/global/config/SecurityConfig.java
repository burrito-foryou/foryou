package xyz.abcganada.foryou.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import xyz.abcganada.foryou.global.security.jwt.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/signup").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/login/*").permitAll()
                .requestMatchers("/api/auth/reissue").permitAll()
                .requestMatchers("/api/auth/logout").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/images/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/images/**").authenticated()
                .requestMatchers("/api/members/me").authenticated()
                .requestMatchers("/api/notifications/subscribe/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/likes/**").authenticated()
                .requestMatchers("/api/my/**").authenticated()
                // 답변: 등록/수정/삭제/채택은 인증 필요, 목록 조회는 공개
                .requestMatchers(HttpMethod.POST, "/api/questions/*/answers").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/answers/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/answers/*").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/answers/*/accept").authenticated()
                // 댓글: 등록/수정/삭제는 인증 필요, 목록 조회는 공개
                .requestMatchers(HttpMethod.POST, "/api/answers/*/comments").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/comments/*").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/comments/*").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
