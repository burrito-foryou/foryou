package xyz.abcganada.foryou.auth.service;

import fixture.AuthFixture;
import fixture.MemberFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.springframework.dao.DataIntegrityViolationException;
import xyz.abcganada.foryou.auth.oauth.OAuthClient;
import xyz.abcganada.foryou.auth.oauth.OAuthUserInfo;
import xyz.abcganada.foryou.auth.rest.request.LoginRequest;
import xyz.abcganada.foryou.auth.rest.request.SignupRequest;
import xyz.abcganada.foryou.auth.rest.response.LoginResponse;
import xyz.abcganada.foryou.auth.rest.response.SignupResponse;
import xyz.abcganada.foryou.common.ServiceTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.domain.Role;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class AuthServiceTest extends ServiceTest {

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("기존 소셜 회원이면 저장하지 않고 액세스 토큰을 반환한다")
    void socialLoginWithExistingMember() {
        // given
        OAuthUserInfo userInfo = AuthFixture.kakaoUserInfo();
        Member member = MemberFixture.socialMember(userInfo);
        OAuthClient oAuthClient = mock(OAuthClient.class);

        given(oAuthClientResolver.resolve(AuthProvider.KAKAO))
            .willReturn(oAuthClient);
        given(oAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .willReturn(userInfo);
        given(memberRepository.findByProviderAndProviderId(AuthProvider.KAKAO, userInfo.providerId()))
            .willReturn(Optional.of(member));
        given(jwtTokenProvider.generateAccessToken(member))
            .willReturn(AuthFixture.ACCESS_TOKEN);

        // when
        LoginResponse response = authService.socialLogin(AuthProvider.KAKAO, AuthFixture.OAUTH_CODE);

        // then
        assertThat(response.accessToken()).isEqualTo(AuthFixture.ACCESS_TOKEN);
        verify(memberRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("신규 소셜 회원이면 회원을 저장하고 액세스 토큰을 반환한다")
    void socialLoginWithNewMember() {
        // given
        OAuthUserInfo userInfo = AuthFixture.googleUserInfo();
        Member savedMember = MemberFixture.socialMember(userInfo);
        OAuthClient oAuthClient = mock(OAuthClient.class);

        given(oAuthClientResolver.resolve(AuthProvider.GOOGLE))
            .willReturn(oAuthClient);
        given(oAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .willReturn(userInfo);
        given(memberRepository.findByProviderAndProviderId(AuthProvider.GOOGLE, userInfo.providerId()))
            .willReturn(Optional.empty());
        given(memberRepository.saveAndFlush(any(Member.class)))
            .willReturn(savedMember);
        given(jwtTokenProvider.generateAccessToken(savedMember))
            .willReturn(AuthFixture.ACCESS_TOKEN);

        // when
        LoginResponse response = authService.socialLogin(AuthProvider.GOOGLE, AuthFixture.OAUTH_CODE);

        // then
        assertThat(response.accessToken()).isEqualTo(AuthFixture.ACCESS_TOKEN);
        assertThat(response.tokenType()).isEqualTo("Bearer");

        ArgumentCaptor<Member> memberCaptor = ArgumentCaptor.forClass(Member.class);
        verify(memberRepository).saveAndFlush(memberCaptor.capture());
        Member newMember = memberCaptor.getValue();

        assertThat(newMember.getEmail()).isEqualTo(userInfo.email());
        assertThat(newMember.getNickname()).isEqualTo(userInfo.nickname());
        assertThat(newMember.getProvider()).isEqualTo(AuthProvider.GOOGLE);
        assertThat(newMember.getProviderId()).isEqualTo(userInfo.providerId());
        assertThat(newMember.getRole()).isEqualTo(Role.USER);
    }

    @Test
    @DisplayName("소셜 사용자 정보 조회에 실패하면 로그인을 실패한다")
    void socialLoginWithOAuthFailure() {
        // given
        OAuthClient oAuthClient = mock(OAuthClient.class);

        given(oAuthClientResolver.resolve(AuthProvider.KAKAO))
            .willReturn(oAuthClient);
        given(oAuthClient.getUserInfo(AuthFixture.OAUTH_CODE))
            .willThrow(new BusinessException(ErrorCode.OAUTH_USER_INFO_REQUEST_FAILED));

        // when & then
        assertThatThrownBy(() -> authService.socialLogin(AuthProvider.KAKAO, AuthFixture.OAUTH_CODE))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.OAUTH_USER_INFO_REQUEST_FAILED)
            );

        verify(memberRepository, never()).findByProviderAndProviderId(any(), any());
        verify(memberRepository, never()).saveAndFlush(any());
        verify(jwtTokenProvider, never()).generateAccessToken(any());
    }

    @Test
    @DisplayName("로그인에 성공하면 액세스 토큰을 반환한다")
    void login() {
        // given
        LoginRequest request = AuthFixture.loginRequest();
        Member member = MemberFixture.member();

        given(memberRepository.findByEmail(request.email()))
            .willReturn(Optional.of(member));
        given(passwordEncoder.matches(request.password(), member.getPassword()))
            .willReturn(true);
        given(jwtTokenProvider.generateAccessToken(member))
            .willReturn(AuthFixture.ACCESS_TOKEN);

        // when
        LoginResponse response = authService.login(request);

        // then
        assertThat(response.accessToken()).isEqualTo(AuthFixture.ACCESS_TOKEN);
        assertThat(response.tokenType()).isEqualTo("Bearer");
    }

    @Test
    @DisplayName("가입되지 않은 이메일이면 로그인에 실패한다")
    void loginWithUnknownEmail() {
        // given
        LoginRequest request = AuthFixture.loginRequest();

        given(memberRepository.findByEmail(request.email()))
            .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_LOGIN_CREDENTIALS)
            );

        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtTokenProvider, never()).generateAccessToken(any());
    }

    @Test
    @DisplayName("비밀번호가 일치하지 않으면 로그인에 실패한다")
    void loginWithInvalidPassword() {
        // given
        LoginRequest request = AuthFixture.loginRequest();
        Member member = MemberFixture.member();

        given(memberRepository.findByEmail(request.email()))
            .willReturn(Optional.of(member));
        given(passwordEncoder.matches(request.password(), member.getPassword()))
            .willReturn(false);

        // when & then
        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_LOGIN_CREDENTIALS)
            );

        verify(jwtTokenProvider, never()).generateAccessToken(any());
    }

    @Test
    @DisplayName("비밀번호가 없는 회원이면 로그인에 실패한다")
    void loginWithPasswordlessMember() {
        // given
        LoginRequest request = AuthFixture.loginRequest();
        Member member = MemberFixture.member(
            MemberFixture.MEMBER_ID,
            MemberFixture.EMAIL,
            null,
            MemberFixture.NICKNAME
        );

        given(memberRepository.findByEmail(request.email()))
            .willReturn(Optional.of(member));

        // when & then
        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.INVALID_LOGIN_CREDENTIALS)
            );

        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtTokenProvider, never()).generateAccessToken(any());
    }

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
