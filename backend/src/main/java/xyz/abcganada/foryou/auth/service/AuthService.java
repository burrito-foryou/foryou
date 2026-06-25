package xyz.abcganada.foryou.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.global.security.jwt.JwtTokenProvider;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public SignupResponse signup(SignupRequest request) {
        validateDuplicateEmail(request.email());
        validateDuplicateNickname(request.nickname());

        Member member = createMember(request);
        Member savedMember = saveMember(member);

        return SignupResponse.from(savedMember);
    }

    public LoginResponse login(LoginRequest request) {
        Member member = findMemberByEmail(request.email());

        validateForyouMember(member);
        validatePassword(request.password(), member);

        String accessToken = jwtTokenProvider.generateAccessToken(member);

        return LoginResponse.of(accessToken);
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

        return Member.create(
            request.email(),
            encodedPassword,
            request.nickname(),
            AuthProvider.FORYOU
        );
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
            throw new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS);
        }
    }

    private void validateDuplicateEmail(String email) {
        if (memberRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
    }

    private void validateDuplicateNickname(String nickname) {
        if (memberRepository.existsByNickname(nickname)) {
            throw new BusinessException(ErrorCode.DUPLICATE_NICKNAME);
        }
    }

    private void validateForyouMember(Member member) {
        if (member.getProvider() != AuthProvider.FORYOU) {
            throw new BusinessException(ErrorCode.INVALID_LOGIN_CREDENTIALS);
        }
    }
}
