package xyz.abcganada.foryou.my.rest.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.abcganada.foryou.answer.rest.response.AnswerMyResponse;
import xyz.abcganada.foryou.bookmark.rest.response.BookmarkMyResponse;
import xyz.abcganada.foryou.comment.rest.response.CommentMyResponse;
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
    public ResponseEntity<ApiResponse<Page<AnswerMyResponse>>> getMyAnswers(
            @AuthenticationPrincipal AuthMember member,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.debug("[My] 내 답변 목록 조회 요청 - memberId: {}", member.memberId());
        Page<AnswerMyResponse> responses = myService.getMyAnswers(member.memberId(), page, size);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 답변 목록이 조회되었습니다."));
    }

    @GetMapping("/comments")
    public ResponseEntity<ApiResponse<Page<CommentMyResponse>>> getMyComments(
            @AuthenticationPrincipal AuthMember member,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.debug("[My] 내 댓글 목록 조회 요청 - memberId: {}", member.memberId());
        Page<CommentMyResponse> responses = myService.getMyComments(member.memberId(), page, size);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 댓글 목록이 조회되었습니다."));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<ApiResponse<Page<BookmarkMyResponse>>> getMyBookmarks(
        @AuthenticationPrincipal AuthMember member,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.debug("[My] 내 북마크 목록 조회 요청 - memberId: {}", member.memberId());
        Page<BookmarkMyResponse> responses = myService.getMyBookmarks(member.memberId(), page, size);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(ApiResponse.success(responses, "내 북마크 목록이 조회되었습니다."));
    }
}
