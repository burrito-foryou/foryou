# 인증

## 로그인 방식

- 이메일/비밀번호 로그인(`AuthProvider.FORYOU`)과 Google·Kakao 소셜 로그인을 지원합니다.
- 소셜 로그인은 Spring Security의 기본 OAuth2 로그인 플로우를 쓰지 않고, 프론트엔드가 전달한
  authorization code를 백엔드가 각 provider와 직접 교환하는 방식으로 구현했습니다.

## 토큰 발급/재발급

- 로그인/회원가입/소셜 로그인 시 access token(1시간)과 refresh token(14일)을 함께 발급합니다.
- refresh token은 Redis에 `@RedisHash` + TTL로 저장되고, `/api/auth/reissue`에서 저장값과
  대조해 검증합니다. 로그아웃 시 저장된 refresh token을 삭제합니다.

## 시큐리티 설정

- `SecurityConfig`는 세션을 쓰지 않는 stateless 구조입니다. CSRF/formLogin/httpBasic은
  비활성화하고, `JwtAuthenticationFilter`가 `UsernamePasswordAuthenticationFilter` 앞단에서
  토큰을 검증합니다.
- 공개 엔드포인트: 회원가입/로그인/재발급, 질문·답변·댓글·태그·이미지 목록류 GET, 헬스체크.
  그 외 모든 요청은 인증이 필요합니다.

## 프론트엔드 토큰 관리

- Zustand 스토어에 access/refresh token을 보관하고 localStorage에 영속화합니다.
- axios 인터셉터가 만료 임박 시 선제적으로 재발급하거나, 401 응답을 받으면 한 번
  재발급 후 재요청합니다.
- 동시 다발적인 401 응답에도 재발급 요청이 한 번만 실행되도록 큐잉해, 중복 재발급
  호출을 방지합니다.
