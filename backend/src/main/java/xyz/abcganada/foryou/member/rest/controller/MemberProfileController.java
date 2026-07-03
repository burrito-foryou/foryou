package xyz.abcganada.foryou.member.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.member.rest.request.MemberUpdateRequest;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;
import xyz.abcganada.foryou.member.service.MemberFacade;
import xyz.abcganada.foryou.member.service.MemberService;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members/me")
public class MemberProfileController {

    private final MemberFacade memberFacade;
    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<ApiResponse<MemberInfoResponse>> me(@AuthenticationPrincipal AuthMember member) {
        log.debug("[Member] 회원 정보 조회 요청 - memberId: {}", member.memberId());
        MemberInfoResponse response = memberService.getMemberInfo(member.memberId());

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "사용자 정보가 조회되었습니다."));
    }

    @PatchMapping
    public ResponseEntity<ApiResponse<MemberInfoResponse>> update(
        @AuthenticationPrincipal AuthMember member,
        @Valid @RequestBody MemberUpdateRequest request
    ) {
        log.info("[Member] 닉네임 수정 요청 - memberId: {}", member.memberId());
        MemberInfoResponse response = memberService.updateMemberNickname(member.memberId(), request);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(response, "사용자 정보가 수정되었습니다."));
    }

    @DeleteMapping
    public ResponseEntity<Void> withdraw(@AuthenticationPrincipal AuthMember member) {
        log.info("[Member] 회원 탈퇴 요청 - memberId: {}", member.memberId());
        memberFacade.withdraw(member.memberId());
        return ResponseEntity.noContent().build();
    }
}
