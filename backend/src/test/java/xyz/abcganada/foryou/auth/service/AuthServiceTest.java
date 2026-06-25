package xyz.abcganada.foryou.auth.service;

import fixture.AuthFixture;
import fixture.MemberFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.springframework.dao.DataIntegrityViolationException;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;
import xyz.abcganada.foryou.common.ServiceTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.domain.Role;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class AuthServiceTest extends ServiceTest {

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("회원가입에 성공하면 비밀번호를 암호화하고 회원 정보를 반환한다")
    void signup() {
        // given
        SignupRequest request = AuthFixture.signupRequest();

        given(memberRepository.existsByEmail(request.email()))
            .willReturn(false);
        given(memberRepository.existsByNickname(request.nickname()))
            .willReturn(false);
        given(passwordEncoder.encode(request.password()))
            .willReturn(MemberFixture.ENCODED_PASSWORD);
        given(memberRepository.saveAndFlush(any(Member.class)))
            .willReturn(MemberFixture.member());

        // when
        SignupResponse response = authService.signup(request);

        // then
        assertThat(response.memberId()).isEqualTo(MemberFixture.MEMBER_ID);
        assertThat(response.email()).isEqualTo(request.email());
        assertThat(response.nickname()).isEqualTo(request.nickname());

        ArgumentCaptor<Member> memberCaptor = ArgumentCaptor.forClass(Member.class);
        verify(memberRepository).saveAndFlush(memberCaptor.capture());
        Member savedMember = memberCaptor.getValue();

        assertThat(savedMember.getPassword()).isEqualTo(MemberFixture.ENCODED_PASSWORD);
        assertThat(savedMember.getRole()).isEqualTo(Role.USER);
        assertThat(savedMember.getProvider()).isEqualTo(AuthProvider.FORYOU);
    }

    @Test
    @DisplayName("이미 사용 중인 이메일이면 회원가입에 실패한다")
    void signupWithDuplicateEmail() {
        // given
        SignupRequest request = AuthFixture.signupRequest();

        given(memberRepository.existsByEmail(request.email()))
            .willReturn(true);

        // when & then
        assertThatThrownBy(() -> authService.signup(request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_EMAIL)
            );

        verify(memberRepository, never()).existsByNickname(any());
        verify(passwordEncoder, never()).encode(any());
        verify(memberRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("이미 사용 중인 닉네임이면 회원가입에 실패한다")
    void signupWithDuplicateNickname() {
        // given
        SignupRequest request = AuthFixture.signupRequest();

        given(memberRepository.existsByEmail(request.email()))
            .willReturn(false);
        given(memberRepository.existsByNickname(request.nickname()))
            .willReturn(true);

        // when & then
        assertThatThrownBy(() -> authService.signup(request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_NICKNAME)
            );

        verify(passwordEncoder, never()).encode(any());
        verify(memberRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("저장 중 고유 제약 조건을 위반하면 중복 회원 예외로 변환한다")
    void signupWithDataIntegrityViolation() {
        // given
        SignupRequest request = AuthFixture.signupRequest();

        given(memberRepository.existsByEmail(request.email()))
            .willReturn(false);
        given(memberRepository.existsByNickname(request.nickname()))
            .willReturn(false);
        given(passwordEncoder.encode(request.password()))
            .willReturn(MemberFixture.ENCODED_PASSWORD);
        given(memberRepository.saveAndFlush(any(Member.class)))
            .willThrow(new DataIntegrityViolationException("duplicate member"));

        // when & then
        assertThatThrownBy(() -> authService.signup(request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_MEMBER)
            );
    }
}
