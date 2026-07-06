package xyz.abcganada.foryou.bookmark.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.bookmark.rest.response.BookmarkResponse;
import xyz.abcganada.foryou.bookmark.service.BookmarkService;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.global.security.auth.AuthMember;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@Tag(name = "Bookmark", description = "북마크 관련 API")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // 북마크 추가
    @Operation(summary = "북마크 추가", description = "질문을 북마크에 추가한다.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> addBookmark(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember member) {
        bookmarkService.addBookmark(member.memberId(), questionId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.successWithoutData("북마크가 추가되었습니다."));
    }

    // 북마크 취소
    @Operation(summary = "북마크 취소", description = "질문 북마크를 취소한다.")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> removeBookmark(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember member) {
        bookmarkService.removeBookmark(member.memberId(), questionId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("북마크가 취소되었습니다."));
    }

    // 북마크 여부 확인
    @Operation(summary = "북마크 여부 확인", description = "로그인한 회원이 해당 질문을 북마크했는지 확인한다.")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{questionId}/status")
    public ResponseEntity<ApiResponse<Boolean>> isBookmarked(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember member) {
        boolean bookmarked = bookmarkService.isBookmarked(member.memberId(), questionId);
        return ResponseEntity.ok(ApiResponse.success(bookmarked));
    }

    // 북마크 목록 조회
    @Operation(summary = "북마크 목록 조회", description = "로그인한 회원의 북마크 목록을 페이지 단위로 조회한다.")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookmarkResponse>>> getBookmarks(
            @AuthenticationPrincipal AuthMember member,
            Pageable pageable) {
        Page<BookmarkResponse> bookmarks = bookmarkService.getBookmarks(member.memberId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(bookmarks));
    }
}