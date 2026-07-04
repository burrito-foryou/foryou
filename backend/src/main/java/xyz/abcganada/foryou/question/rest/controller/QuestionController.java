package xyz.abcganada.foryou.question.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.question.rest.request.QuestionCreateRequest;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;
import xyz.abcganada.foryou.question.rest.response.QuestionDetailResponse;
import xyz.abcganada.foryou.question.rest.request.QuestionUpdateRequest;
import xyz.abcganada.foryou.question.service.QuestionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/questions")
@Tag(name = "Question", description = "질문 관련 API")
public class QuestionController {

    private final QuestionService questionService;

    // 질문 등록
    @Operation(summary = "질문 등록", description = "질문을 등록한다.")
    @PostMapping
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(
            @RequestParam Long memberId, // Security 구현 후 @AuthenticationPrincipal로 교체 예정
            @RequestBody @Valid QuestionCreateRequest request
    ) {
        QuestionResponse response = questionService.create(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "질문이 등록되었습니다."));
    }

    // 질문 목록 조회
    @Operation(summary = "질문 목록 조회", description = "조건에 맞는 질문 목록을 페이지 단위로 조회한다.")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getQuestions(
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String target,
            @RequestParam(required = false) String budget,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String situation,
            @RequestParam(required = false) String giftType,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<QuestionResponse> response = questionService.getList(
                memberId, keyword, target, budget, gender, ageGroup, situation, giftType, sort, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 질문 상세 조회
    @Operation(summary = "질문 상세 조회", description = "질문 상세 정보를 조회한다.")
    @GetMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionDetailResponse>> getQuestion(
            @PathVariable Long questionId
    ) {
        QuestionDetailResponse response = questionService.getDetail(questionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 질문 수정
    @Operation(summary = "질문 수정", description = "본인이 작성한 질문을 수정한다.")
    @PatchMapping("/{questionId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable Long questionId,
            @RequestParam Long memberId, // Security 구현 후 @AuthenticationPrincipal로 교체 예정
            @RequestBody @Valid QuestionUpdateRequest request
    ) {
        QuestionResponse response = questionService.update(questionId, memberId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "질문이 수정되었습니다."));
    }

    // 질문 삭제
    @Operation(summary = "질문 삭제", description = "본인이 작성한 질문을 삭제한다.")
    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long questionId,
            @RequestParam Long memberId // Security 구현 후 @AuthenticationPrincipal로 교체 예정
    ) {
        questionService.delete(questionId, memberId);
        return ResponseEntity.noContent().build();
    }
}