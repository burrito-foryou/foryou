package xyz.abcganada.foryou.bookmark.rest.response;

import xyz.abcganada.foryou.bookmark.domain.Bookmark;

import java.time.Instant;

public record BookmarkResponse(
        Long bookmarkId,
        Long questionId,
        String questionTitle,
        Instant createdAt
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
