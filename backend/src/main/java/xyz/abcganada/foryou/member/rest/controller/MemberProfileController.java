package xyz.abcganada.foryou.member.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;
import xyz.abcganada.foryou.member.service.MemberService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members/me")
public class MemberProfileController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<ApiResponse<MemberInfoResponse>> me(
        @AuthenticationPrincipal AuthMember member
    ) {
        MemberInfoResponse response = memberService.getMemberInfo(member.memberId());

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "사용자 정보가 조회되었습니다."));
    }
}
