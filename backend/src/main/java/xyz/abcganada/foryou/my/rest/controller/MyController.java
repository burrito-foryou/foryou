package xyz.abcganada.foryou.my.rest.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.my.service.MyService;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/my")
public class MyController {

    private final MyService myService;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getMyQuestions(
            @AuthenticationPrincipal AuthMember member,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.debug("[My] 내 질문 목록 조회 요청 - memberId: {}", member.memberId());
        Page<QuestionResponse> responses = myService.getMyQuestions(member.memberId(), page, size);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 질문 목록이 조회되었습니다."));
    }

    @GetMapping("/answers")
    public ResponseEntity<ApiResponse<Page<AnswerResponse>>> getMyAnswers(
            @AuthenticationPrincipal AuthMember member,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.debug("[My] 내 답변 목록 조회 요청 - memberId: {}", member.memberId());
        Page<AnswerResponse> responses = myService.getMyAnswers(member.memberId(), page, size);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 답변 목록이 조회되었습니다."));
    }

    @GetMapping("/comments")
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getMyComments(
            @AuthenticationPrincipal AuthMember member,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.debug("[My] 내 댓글 목록 조회 요청 - memberId: {}", member.memberId());
        Page<CommentResponse> responses = myService.getMyComments(member.memberId(), page, size);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 댓글 목록이 조회되었습니다."));
    }
}
