package xyz.abcganada.foryou.like.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.like.rest.request.LikeRequest;
import xyz.abcganada.foryou.like.rest.response.LikeResponse;
import xyz.abcganada.foryou.like.service.LikeService;

// TODO : 인증 구현 후 @RequestParam Long memberId 교체 필요
@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // 1. 좋아요 등록
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addLike(@RequestParam Long memberId,
                                                     @RequestBody LikeRequest  request) {
        likeService.addLike(memberId, request.targetType(), request.targetId());

        return ResponseEntity
                .status(HttpStatus.CREATED) // 201 Created
                .body(ApiResponse.successWithoutData("좋아요가 등록되었습니다."));

    }

    // 2. 좋아요 취소
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteLike(@RequestParam Long memberId,
                                                        @RequestBody LikeRequest request) {
        likeService.cancelLike(memberId, request.targetType(), request.targetId());

        return ResponseEntity
                .ok(ApiResponse.successWithoutData("좋아요가 취소되었습니다.")); // 200 OK
    }

    // 3. 좋아요 여부 상태 확인
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<LikeResponse>> isLiked(@RequestParam Long memberId,
                                                             @RequestParam TargetType targetType,
                                                             @RequestParam Long targetId) {
        boolean liked = likeService.isLiked(memberId, targetType, targetId);

        return ResponseEntity
                .ok(ApiResponse.success(new LikeResponse(liked)));
    }

}
