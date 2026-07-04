package xyz.abcganada.foryou.comment.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Comment", description = "댓글 관련 API")
public class CommentController {

    private final CommentService commentService;
    private final CommentFacade commentFacade;

    // WBS0504: 댓글 조회
    @Operation(summary = "댓글 목록 조회", description = "답변에 달린 댓글 목록을 조회한다.")
    @GetMapping("/api/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable Long answerId) {
        log.debug("[Comment] 댓글 목록 조회 요청 - answerId: {}", answerId);
        List<CommentResponse> responses = commentService.getComments(answerId);
        return ResponseEntity.ok(ApiResponse.success(responses, "댓글 목록을 조회했습니다."));
    }

    // WBS0505: 댓글 수정
    @Operation(summary = "댓글 수정", description = "본인이 작성한 댓글을 수정한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal AuthMember authMember,
            @RequestBody @Valid CommentUpdateRequest request) {
        log.debug("[Comment] 댓글 수정 요청 - commentId: {}, memberId: {}", commentId, authMember.memberId());
        CommentResponse response = commentService.update(commentId, authMember.memberId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "댓글이 수정되었습니다."));
    }

    // WBS0506: 댓글 삭제
    @Operation(summary = "댓글 삭제", description = "본인이 작성한 댓글을 삭제한다.")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal AuthMember authMember) {
        log.debug("[Comment] 댓글 삭제 요청 - commentId: {}, memberId: {}", commentId, authMember.memberId());
        commentService.delete(commentId, authMember.memberId());
        return ResponseEntity.noContent().build();
    }

    // WBS0503: 댓글 작성
    @Operation(summary = "댓글 작성", description = "답변에 댓글을 작성한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/api/answers/{answerId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long answerId,
            @AuthenticationPrincipal AuthMember authMember,
            @RequestBody @Valid CommentCreateRequest request) {
        log.debug("[Comment] 댓글 등록 요청 - answerId: {}, memberId: {}", answerId, authMember.memberId());
        CommentResponse response = commentFacade.create(answerId, authMember.memberId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "댓글이 등록되었습니다."));
    }
}
