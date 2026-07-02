package xyz.abcganada.foryou.bookmark.rest.controller;

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
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // 북마크 추가
    @PostMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> addBookmark(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember member) {
        bookmarkService.addBookmark(member.memberId(), questionId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.successWithoutData("북마크가 추가되었습니다."));
    }

    // 북마크 취소
    @DeleteMapping("/{questionId}")
    public ResponseEntity<ApiResponse<Void>> removeBookmark(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember member) {
        bookmarkService.removeBookmark(member.memberId(), questionId);
        return ResponseEntity.ok(ApiResponse.successWithoutData("북마크가 취소되었습니다."));
    }

    // 북마크 여부 확인
    @GetMapping("/{questionId}/status")
    public ResponseEntity<ApiResponse<Boolean>> isBookmarked(
            @PathVariable Long questionId,
            @AuthenticationPrincipal AuthMember member) {
        boolean bookmarked = bookmarkService.isBookmarked(member.memberId(), questionId);
        return ResponseEntity.ok(ApiResponse.success(bookmarked));
    }

    // 북마크 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookmarkResponse>>> getBookmarks(
            @AuthenticationPrincipal AuthMember member,
            Pageable pageable) {
        Page<BookmarkResponse> bookmarks = bookmarkService.getBookmarks(member.memberId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(bookmarks));
    }
}