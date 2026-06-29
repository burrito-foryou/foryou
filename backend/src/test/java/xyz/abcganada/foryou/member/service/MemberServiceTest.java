package xyz.abcganada.foryou.member.service;

import fixture.MemberFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import xyz.abcganada.foryou.common.ServiceTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

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
}
