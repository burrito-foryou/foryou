package xyz.abcganada.foryou.comment.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.comment.rest.request.CommentCreateRequest;
import xyz.abcganada.foryou.comment.rest.request.CommentUpdateRequest;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;
import xyz.abcganada.foryou.comment.service.CommentFacade;
import xyz.abcganada.foryou.comment.service.CommentService;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentFacade commentFacade;

    // WBS0504: 댓글 조회
    @GetMapping("/api/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable Long answerId) {
        List<CommentResponse> responses = commentService.getComments(answerId);
        return ResponseEntity.ok(ApiResponse.success(responses, "댓글 목록을 조회했습니다."));
    }

    // WBS0505: 댓글 수정
    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal AuthMember authMember,
            @RequestBody @Valid CommentUpdateRequest request) {
        CommentResponse response = commentService.update(commentId, authMember.memberId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "댓글이 수정되었습니다."));
    }

    // WBS0506: 댓글 삭제
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal AuthMember authMember) {
        commentService.delete(commentId, authMember.memberId());
        return ResponseEntity.noContent().build();
    }

    // WBS0503: 댓글 작성
    @PostMapping("/api/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long answerId,
            @AuthenticationPrincipal AuthMember authMember,
            @RequestBody @Valid CommentCreateRequest request) {
        CommentResponse response = commentFacade.create(answerId, authMember.memberId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "댓글이 등록되었습니다."));
    }
}
