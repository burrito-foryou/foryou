package xyz.abcganada.foryou.member.rest.controller;

import fixture.MemberFixture;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import xyz.abcganada.foryou.common.RestControllerTest;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.rest.request.MemberUpdateRequest;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;
import xyz.abcganada.foryou.member.service.MemberService;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(MemberProfileController.class)
class MemberProfileControllerTest extends RestControllerTest {

    @MockBean
    private MemberService memberService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("인증된 사용자의 내 정보를 조회한다")
    void me() throws Exception {
        // given
        MemberInfoResponse response = new MemberInfoResponse(
            MemberFixture.MEMBER_ID,
            MemberFixture.NICKNAME,
            MemberFixture.EMAIL,
            "https://example.com/profile.png",
            AuthProvider.FORYOU,
            LocalDateTime.of(2026, 6, 30, 12, 0)
        );

        authenticateMember();

        given(memberService.getMemberInfo(MemberFixture.MEMBER_ID))
            .willReturn(response);

        // when & then
        getRequest("/api/members/me")
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("사용자 정보가 조회되었습니다."))
            .andExpect(jsonPath("$.data.memberId").value(MemberFixture.MEMBER_ID))
            .andExpect(jsonPath("$.data.nickname").value(MemberFixture.NICKNAME))
            .andExpect(jsonPath("$.data.email").value(MemberFixture.EMAIL))
            .andExpect(jsonPath("$.data.profileImageUrl").value("https://example.com/profile.png"))
            .andExpect(jsonPath("$.data.provider").value(AuthProvider.FORYOU.name()))
            .andExpect(jsonPath("$.data.createdAt").value("2026-06-30T12:00:00"));

        verify(memberService).getMemberInfo(MemberFixture.MEMBER_ID);
    }

    @Test
    @DisplayName("인증된 사용자의 닉네임을 수정한다")
    void updateNickname() throws Exception {
        // given
        MemberUpdateRequest request = new MemberUpdateRequest("newTester");
        MemberInfoResponse response = new MemberInfoResponse(
            MemberFixture.MEMBER_ID,
            request.nickname(),
            MemberFixture.EMAIL,
            "https://example.com/profile.png",
            AuthProvider.FORYOU,
            LocalDateTime.of(2026, 6, 30, 12, 0)
        );

        authenticateMember();

        given(memberService.updateMemberNickname(MemberFixture.MEMBER_ID, request))
            .willReturn(response);

        // when & then
        patchRequestWithBody("/api/members/me", request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("사용자 정보가 수정되었습니다."))
            .andExpect(jsonPath("$.data.memberId").value(MemberFixture.MEMBER_ID))
            .andExpect(jsonPath("$.data.nickname").value(request.nickname()))
            .andExpect(jsonPath("$.data.email").value(MemberFixture.EMAIL))
            .andExpect(jsonPath("$.data.profileImageUrl").value("https://example.com/profile.png"))
            .andExpect(jsonPath("$.data.provider").value(AuthProvider.FORYOU.name()))
            .andExpect(jsonPath("$.data.createdAt").value("2026-06-30T12:00:00"));

        verify(memberService).updateMemberNickname(MemberFixture.MEMBER_ID, request);
    }

    @Test
    @DisplayName("닉네임 형식이 올바르지 않으면 수정에 실패한다")
    void updateNicknameWithInvalidNickname() throws Exception {
        // given
        MemberUpdateRequest request = new MemberUpdateRequest("a");

        authenticateMember();

        // when & then
        patchRequestWithBody("/api/members/me", request)
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("COMMON_001"))
            .andExpect(jsonPath("$.message").value("잘못된 입력값입니다."));

        verify(memberService, never()).updateMemberNickname(any(), any());
    }

    @Test
    @DisplayName("현재 닉네임과 동일한 닉네임이면 수정에 실패한다")
    void updateNicknameWithSameNickname() throws Exception {
        // given
        MemberUpdateRequest request = new MemberUpdateRequest(MemberFixture.NICKNAME);

        authenticateMember();

        given(memberService.updateMemberNickname(MemberFixture.MEMBER_ID, request))
            .willThrow(new BusinessException(ErrorCode.SAME_NICKNAME));

        // when & then
        patchRequestWithBody("/api/members/me", request)
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("MEMBER_002"))
            .andExpect(jsonPath("$.message").value("현재 닉네임과 동일한 닉네임입니다."));

        verify(memberService).updateMemberNickname(MemberFixture.MEMBER_ID, request);
    }

    private void authenticateMember() {
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(
                new AuthMember(MemberFixture.MEMBER_ID),
                null,
                Collections.emptyList()
            )
        );
    }
}
