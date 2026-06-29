package xyz.abcganada.foryou.answer.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.request.AnswerUpdateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.global.response.ApiResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    // WBS0404: 답변 목록 조회
    @GetMapping("/api/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<List<AnswerResponse>>> getAnswers(
            @PathVariable Long questionId) {
        List<AnswerResponse> responses = answerService.getAnswers(questionId);
        return ResponseEntity.ok(ApiResponse.success(responses, "답변 목록을 조회했습니다."));
    }

    // WBS0405: 답변 수정
    @PutMapping("/api/answers/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> updateAnswer(
            @PathVariable Long answerId,
            @RequestParam Long memberId, // Security 구현 후 @AuthenticationPrincipal로 교체 예정
            @RequestBody @Valid AnswerUpdateRequest request) {
        AnswerResponse response = answerService.update(answerId, memberId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "답변이 수정되었습니다."));
    }

    // WBS0407/0408: 답변 채택
    @PatchMapping("/api/answers/{answerId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptAnswer(
            @PathVariable Long answerId,
            @RequestParam Long memberId) { // Security 구현 후 @AuthenticationPrincipal로 교체 예정
        answerService.accept(answerId, memberId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("답변이 채택되었습니다."));
    }

    // WBS0406: 답변 삭제
    @DeleteMapping("/api/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
            @PathVariable Long answerId,
            @RequestParam Long memberId) { // Security 구현 후 @AuthenticationPrincipal로 교체 예정
        answerService.delete(answerId, memberId);
        return ResponseEntity.noContent().build();
    }

    // WBS0403: 답변 등록
    @PostMapping("/api/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<AnswerResponse>> createAnswer(
            @PathVariable Long questionId,
            @RequestParam Long memberId, // Security 구현 후 @AuthenticationPrincipal로 교체 예정
            @RequestBody @Valid AnswerCreateRequest request) {
        AnswerResponse response = answerService.create(questionId, memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "답변이 등록되었습니다."));
    }
}
