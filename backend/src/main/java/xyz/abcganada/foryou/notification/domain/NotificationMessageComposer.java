package xyz.abcganada.foryou.notification.domain;

// QUESTION_LIKED만 title 표시
public final class NotificationMessageComposer {

    private static final int TITLE_MAX_LENGTH = 11;
    private static final String QUESTION_LIKED_PREFIX = "님이 ";
    private static final String QUESTION_LIKED_SUFFIX = " 질문을 좋아합니다.";
    private static final String QUESTION_LIKED_FALLBACK = "님이 내 질문을 좋아합니다."; // title 없는 경우

    private NotificationMessageComposer() {
    }

    public record MessageParts(String prefix, String suffix, String questionTitle) {}

    // 알림에 출력할 prefix, suffix, title 반환용
    public static MessageParts buildParts(NotificationType type, String questionTitle) {
        if (type != NotificationType.QUESTION_LIKED) {
            return new MessageParts(type.getMessageTemplate(), "", null);
        }
        if (questionTitle == null || questionTitle.isBlank()) {
            return new MessageParts(QUESTION_LIKED_FALLBACK, "", null);
        }
        return new MessageParts(QUESTION_LIKED_PREFIX, QUESTION_LIKED_SUFFIX, truncateTitle(questionTitle));
    }

    // content 컬럼(평문 저장용)에 쓸 문자열
    public static String buildContent(NotificationType type, String senderNickname, String questionTitle) {
        MessageParts parts = buildParts(type, questionTitle);
        String title = parts.questionTitle() != null ? parts.questionTitle() : "";
        return senderNickname + parts.prefix() + title + parts.suffix();
    }

    public static String truncateTitle(String title) {
        return title.length() > TITLE_MAX_LENGTH ? title.substring(0, TITLE_MAX_LENGTH) + "..." : title;
    }

}