package xyz.abcganada.foryou.bookmark.rest.response;

import xyz.abcganada.foryou.bookmark.domain.Bookmark;

import java.time.LocalDateTime;

public record BookmarkResponse(
        Long bookmarkId,
        Long questionId,
        String questionTitle,
        LocalDateTime createdAt
) {
    public static BookmarkResponse from(Bookmark bookmark) {
        return new BookmarkResponse(
                bookmark.getId(),
                bookmark.getQuestion().getId(),
                bookmark.getQuestion().getTitle(),
                bookmark.getCreatedAt()
        );
    }

}
