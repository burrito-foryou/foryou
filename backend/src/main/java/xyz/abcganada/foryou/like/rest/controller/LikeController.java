package xyz.abcganada.foryou.like.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.like.rest.request.LikeRequest;
import xyz.abcganada.foryou.like.rest.response.LikeResponse;
import xyz.abcganada.foryou.like.rest.response.LikeStatusResponse;
import xyz.abcganada.foryou.like.service.LikeFacade;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Tag(name = "Like", description = "좋아요 관련 API")
public class LikeController {

    private final LikeFacade likeFacade;

    // 1. 좋아요 등록
    @Operation(summary = "좋아요 등록", description = "질문/답변에 좋아요를 등록한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ApiResponse<LikeResponse>> addLike(@AuthenticationPrincipal AuthMember member,
                                                     @RequestBody LikeRequest request) {
        LikeResponse response = likeFacade.addLike(member.memberId(), request.targetType(), request.targetId());

        return ResponseEntity
                .status(HttpStatus.CREATED) // 201 Created
                .body(ApiResponse.success(response, "좋아요가 등록되었습니다."));

    }

    // 2. 좋아요 취소
    @Operation(summary = "좋아요 취소", description = "등록했던 좋아요를 취소한다.")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping
    public ResponseEntity<ApiResponse<LikeResponse>> deleteLike(@AuthenticationPrincipal AuthMember member,
                                                        @RequestBody LikeRequest request) {
        LikeResponse response = likeFacade.cancelLike(member.memberId(), request.targetType(), request.targetId());

        return ResponseEntity
                .ok(ApiResponse.success(response, "좋아요가 취소되었습니다.")); // 200 OK
    }

    // 3. 좋아요 여부 상태 확인
    @Operation(summary = "좋아요 여부 확인", description = "로그인한 회원이 해당 대상에 좋아요를 눌렀는지 확인한다.")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<LikeStatusResponse>> isLiked(@AuthenticationPrincipal AuthMember member,
                                                             @RequestParam TargetType targetType,
                                                             @RequestParam Long targetId) {
        boolean liked = likeFacade.isLiked(member.memberId(), targetType, targetId);

        return ResponseEntity
                .ok(ApiResponse.success(new LikeStatusResponse(liked)));
    }


}
