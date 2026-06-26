package xyz.abcganada.foryou.answer.rest.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.global.response.ApiResponse;

@RestController
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

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
