package xyz.abcganada.foryou.comment.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.comment.rest.request.CommentCreateRequest;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;
import xyz.abcganada.foryou.comment.service.CommentService;
import xyz.abcganada.foryou.global.response.ApiResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // WBS0504: 댓글 조회
    @GetMapping("/api/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable Long answerId) {
        List<CommentResponse> responses = commentService.getComments(answerId);
        return ResponseEntity.ok(ApiResponse.success(responses, "댓글 목록을 조회했습니다."));
    }

    // WBS0503: 댓글 작성
    @PostMapping("/api/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long answerId,
            @RequestParam Long memberId, // Security 구현 후 @AuthenticationPrincipal로 교체 예정
            @RequestBody @Valid CommentCreateRequest request) {
        CommentResponse response = commentService.create(answerId, memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "댓글이 등록되었습니다."));
    }
}
