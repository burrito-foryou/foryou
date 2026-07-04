package xyz.abcganada.foryou.member.service;

import fixture.MemberFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import xyz.abcganada.foryou.common.ServiceTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.rest.request.MemberUpdateRequest;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

class MemberServiceTest extends ServiceTest {

    @InjectMocks
    private MemberService memberService;

    @Test
    @DisplayName("회원 ID로 내 정보를 조회한다")
    void getMemberInfo() {
        // given
        Member member = MemberFixture.member();

        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.of(member));

        // when
        MemberInfoResponse response = memberService.getMemberInfo(MemberFixture.MEMBER_ID);

        // then
        assertThat(response.memberId()).isEqualTo(member.getId());
        assertThat(response.nickname()).isEqualTo(member.getNickname());
        assertThat(response.email()).isEqualTo(member.getEmail());
        assertThat(response.profileImageUrl()).isEqualTo(member.getProfileImageUrl());
        assertThat(response.provider()).isEqualTo(member.getProvider());
        assertThat(response.createdAt()).isEqualTo(member.getCreatedAt());
    }

    @Test
    @DisplayName("회원 ID에 해당하는 회원이 없으면 내 정보 조회에 실패한다")
    void getMemberInfoWithUnknownMember() {
        // given
        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> memberService.getMemberInfo(MemberFixture.MEMBER_ID))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND)
            );
    }

    @Test
    @DisplayName("현재 닉네임과 다른 닉네임으로 변경한다")
    void updateMemberNickname() {
        // given
        Member member = MemberFixture.member();
        MemberUpdateRequest request = new MemberUpdateRequest("newTester");

        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.of(member));

        // when
        MemberInfoResponse response = memberService.updateMemberNickname(MemberFixture.MEMBER_ID, request);

        // then
        assertThat(member.getNickname()).isEqualTo(request.nickname());
        assertThat(response.nickname()).isEqualTo(request.nickname());
        assertThat(response.memberId()).isEqualTo(member.getId());
        assertThat(response.email()).isEqualTo(member.getEmail());
    }

    @Test
    @DisplayName("현재 닉네임과 동일한 닉네임이면 변경에 실패한다")
    void updateMemberNicknameWithSameNickname() {
        // given
        Member member = MemberFixture.member();
        MemberUpdateRequest request = new MemberUpdateRequest(MemberFixture.NICKNAME);

        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.of(member));

        // when & then
        assertThatThrownBy(() -> memberService.updateMemberNickname(MemberFixture.MEMBER_ID, request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.SAME_NICKNAME)
            );
        assertThat(member.getNickname()).isEqualTo(MemberFixture.NICKNAME);
    }

    @Test
    @DisplayName("회원 ID에 해당하는 회원이 없으면 닉네임 변경에 실패한다")
    void updateMemberNicknameWithUnknownMember() {
        // given
        MemberUpdateRequest request = new MemberUpdateRequest("newTester");

        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> memberService.updateMemberNickname(MemberFixture.MEMBER_ID, request))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND)
            );
    }

    @Test
    @DisplayName("회원 ID로 회원을 탈퇴 처리한다")
    void withdraw() {
        // given
        Member member = MemberFixture.member();

        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.of(member));

        // when
        memberService.withdraw(MemberFixture.MEMBER_ID);

        // then
        then(memberRepository).should().delete(member);
    }

    @Test
    @DisplayName("회원 ID에 해당하는 회원이 없으면 탈퇴에 실패한다")
    void withdrawWithUnknownMember() {
        // given
        given(memberRepository.findById(MemberFixture.MEMBER_ID))
            .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> memberService.withdraw(MemberFixture.MEMBER_ID))
            .isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND)
            );
    }
}
