package xyz.abcganada.foryou.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.auth.oauth.OAuthClientResolver;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.global.security.jwt.JwtTokenProvider;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OAuthClientResolver oAuthClientResolver;

    public SignupResponse signup(SignupRequest request) {
        log.info("[Auth] 회원가입 처리 시작 - email: {}", request.email());
        validateDuplicateEmail(request.email());

        Member member = createMember(request);
        Member savedMember = saveMember(member);

        log.info("[Auth] 회원가입 완료 - memberId: {}", savedMember.getId());
        return SignupResponse.from(savedMember);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        log.info("[Auth] 로그인 처리 시작 - email: {}", request.email());
        Member member = findMemberByEmail(request.email());

        validateForyouMember(member);
        validatePassword(request.password(), member);

        log.info("[Auth] 로그인 완료 - memberId: {}", member.getId());
        String accessToken = jwtTokenProvider.generateAccessToken(member);

        return LoginResponse.of(accessToken);
    }

    public LoginResponse socialLogin(AuthProvider provider, String code) {
        log.info("[Auth] 소셜 로그인 처리 시작 - provider: {}", provider);
        OAuthUserInfo userInfo = oAuthClientResolver.resolve(provider).getUserInfo(code);
        log.debug("[Auth] OAuth 유저 정보 조회 완료 - email: {}", userInfo.email());

        Member member = memberRepository
            .findByProviderAndProviderId(provider, userInfo.providerId())
            .orElseGet(() -> {
                log.info("[Auth] 신규 소셜 회원 생성 - provider: {}, email: {}", provider, userInfo.email());
                validateDuplicateEmail(userInfo.email());
                return createSocialMember(userInfo);
            });

        log.info("[Auth] 소셜 로그인 완료 - memberId: {}", member.getId());
        String accessToken = jwtTokenProvider.generateAccessToken(member);

        return LoginResponse.of(accessToken);
    }

    public void logout() {
        // TODO refresh token 도입
        // Stateless JWT 방식에서는 서버에서 별도 처리하지 않음.
    }

    private Member findMemberByEmail(String email) {
        return memberRepository.findByEmail(email)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS));
    }

    private boolean isInvalidPassword(String password, Member member) {
        return member.getPassword() == null
            || !passwordEncoder.matches(password, member.getPassword());
    }

    private Member createMember(SignupRequest request) {
        String encodedPassword = passwordEncoder.encode(request.password());

        return Member.createLocalMember(
            request.email(),
            encodedPassword,
            request.nickname()
        );
    }

    private Member createSocialMember(OAuthUserInfo userInfo) {
        Member member = Member.createSocialMember(
            userInfo.email(),
            userInfo.nickname(),
            userInfo.provider(),
            userInfo.providerId()
        );

        return saveMember(member);
    }

    private Member saveMember(Member member) {
        try {
            return memberRepository.saveAndFlush(member);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_MEMBER);
        }
    }

    private void validatePassword(String password, Member member) {
        if (isInvalidPassword(password, member)) {
            log.warn("[Auth] 비밀번호 불일치 - memberId: {}", member.getId());
            throw new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS);
        }
    }

    private void validateDuplicateEmail(String email) {
        if (memberRepository.existsByEmail(email)) {
            log.warn("[Auth] 이메일 중복 - email: {}", email);
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
    }

    private void validateForyouMember(Member member) {
        if (member.getProvider() != AuthProvider.FORYOU) {
            log.warn("[Auth] 소셜 회원의 일반 로그인 시도 - memberId: {}, provider: {}", member.getId(), member.getProvider());
            throw new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS);
        }
    }
}
