package xyz.abcganada.foryou.like.rest.controller;

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
public class LikeController {

    private final LikeFacade likeFacade;

    // 1. 좋아요 등록
    @PostMapping
    public ResponseEntity<ApiResponse<LikeResponse>> addLike(@AuthenticationPrincipal AuthMember member,
                                                     @RequestBody LikeRequest request) {
        LikeResponse response = likeFacade.addLike(member.memberId(), request.targetType(), request.targetId());

        return ResponseEntity
                .status(HttpStatus.CREATED) // 201 Created
                .body(ApiResponse.success(response, "좋아요가 등록되었습니다."));

    }

    // 2. 좋아요 취소
    @DeleteMapping
    public ResponseEntity<ApiResponse<LikeResponse>> deleteLike(@AuthenticationPrincipal AuthMember member,
                                                        @RequestBody LikeRequest request) {
        LikeResponse response = likeFacade.cancelLike(member.memberId(), request.targetType(), request.targetId());

        return ResponseEntity
                .ok(ApiResponse.success(response, "좋아요가 취소되었습니다.")); // 200 OK
    }

    // 3. 좋아요 여부 상태 확인
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<LikeStatusResponse>> isLiked(@AuthenticationPrincipal AuthMember member,
                                                             @RequestParam TargetType targetType,
                                                             @RequestParam Long targetId) {
        boolean liked = likeFacade.isLiked(member.memberId(), targetType, targetId);

        return ResponseEntity
                .ok(ApiResponse.success(new LikeStatusResponse(liked)));
    }


}
