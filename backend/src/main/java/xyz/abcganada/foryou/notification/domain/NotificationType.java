package xyz.abcganada.foryou.notification.domain;

public enum NotificationType {
    QUESTION_ANSWER_CREATED, // 질문에 대한 답변
    QUESTION_COMMENT_CREATED, // 질문에 대한 댓글
    ANSWER_COMMENT_CREATED, // 답변에 대한 댓글
    ANSWER_ACCEPTED, // 답변 채택
    QUESTION_LIKED, // 질문에 좋아요
    ANSWER_LIKED, // 답변에 좋아요
    COMMENT_LIKED // 댓글에 좋아요
}
