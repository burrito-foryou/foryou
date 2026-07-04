package xyz.abcganada.foryou.answer.rest.controller;

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
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.request.AnswerUpdateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.answer.service.AnswerFacade;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Answer", description = "답변 관련 API")
public class AnswerController {

    private final AnswerService answerService;
    private final AnswerFacade answerFacade;

    // WBS0404: 답변 목록 조회
    @Operation(summary = "답변 목록 조회", description = "질문에 달린 답변 목록을 조회한다.")
    @GetMapping("/api/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<List<AnswerResponse>>> getAnswers(
            @PathVariable Long questionId) {
        log.debug("[Answer] 답변 목록 조회 요청 - questionId: {}", questionId);
        List<AnswerResponse> responses = answerService.getAnswers(questionId);
        return ResponseEntity.ok(ApiResponse.success(responses, "답변 목록을 조회했습니다."));
    }

    // WBS0405: 답변 수정
    @Operation(summary = "답변 수정", description = "본인이 작성한 답변을 수정한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/api/answers/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> updateAnswer(
            @PathVariable Long answerId,
            @AuthenticationPrincipal AuthMember authMember,
            @RequestBody @Valid AnswerUpdateRequest request) {
        log.debug("[Answer] 답변 수정 요청 - answerId: {}, memberId: {}", answerId, authMember.memberId());
        AnswerResponse response = answerService.update(answerId, authMember.memberId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "답변이 수정되었습니다."));
    }

    // WBS0407/0408: 답변 채택
    @Operation(summary = "답변 채택", description = "질문 작성자가 답변을 채택 처리한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/api/answers/{answerId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptAnswer(
            @PathVariable Long answerId,
            @AuthenticationPrincipal AuthMember authMember) {
        log.debug("[Answer] 답변 채택 요청 - answerId: {}, memberId: {}", answerId, authMember.memberId());
        answerFacade.accept(answerId, authMember.memberId());
        return ResponseEntity.ok(ApiResponse.successWithoutData("답변이 채택되었습니다."));
    }

    // WBS0406: 답변 삭제
    @Operation(summary = "답변 삭제", description = "본인이 작성한 답변을 삭제한다.")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/api/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
            @PathVariable Long answerId,
            @AuthenticationPrincipal AuthMember authMember) {
        log.debug("[Answer] 답변 삭제 요청 - answerId: {}, memberId: {}", answerId, authMember.memberId());
        answerService.delete(answerId, authMember.memberId());
        return ResponseEntity.noContent().build();
    }

    // WBS0403: 답변 등록
    @Operation(summary = "답변 등록", description = "질문에 답변을 등록한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/api/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<AnswerResponse>> createAnswer(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember authMember,
            @RequestBody @Valid AnswerCreateRequest request) {
        log.debug("[Answer] 답변 등록 요청 - questionId: {}, memberId: {}", questionId, authMember.memberId());
        AnswerResponse response = answerFacade.create(questionId, authMember.memberId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "답변이 등록되었습니다."));
    }
}
