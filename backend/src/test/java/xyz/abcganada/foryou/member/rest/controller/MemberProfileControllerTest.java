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
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.member.domain.AuthProvider;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;
import xyz.abcganada.foryou.member.service.MemberService;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberProfileController.class)
@AutoConfigureMockMvc(addFilters = false)
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

        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(
                new AuthMember(MemberFixture.MEMBER_ID),
                null,
                Collections.emptyList()
            )
        );

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
}
