package xyz.abcganada.foryou.my.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;
import xyz.abcganada.foryou.my.service.MyService;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/my")
public class MyController {

    private final MyService myService;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getMyQuestions(@AuthenticationPrincipal AuthMember member) {
        List<QuestionResponse> responses = myService.getMyQuestions(member.memberId());

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 질문 목록이 조회되었습니다."));
    }
}
