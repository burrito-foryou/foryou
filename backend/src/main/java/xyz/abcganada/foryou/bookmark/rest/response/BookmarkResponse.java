package xyz.abcganada.foryou.bookmark.rest.response;

import xyz.abcganada.foryou.bookmark.domain.Bookmark;

public record BookmarkResponse() {
    public static BookmarkResponse from(Bookmark bookmark) {
        return new BookmarkResponse();
    }
}
