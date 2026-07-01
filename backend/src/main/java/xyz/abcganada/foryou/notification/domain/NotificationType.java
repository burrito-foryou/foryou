package xyz.abcganada.foryou.notification.domain;

public enum NotificationType {
    QUESTION_ANSWER_CREATED("님이 회원님의 질문에 답변을 달았습니다."), // 질문에 대한 답변
    QUESTION_COMMENT_CREATED("님이 회원님의 질문에 댓글을 달았습니다."), // 질문에 대한 댓글
    ANSWER_COMMENT_CREATED("님이 회원님의 답변에 댓글을 달았습니다."), // 답변에 대한 댓글
    ANSWER_ACCEPTED("님이 회원님의 답변을 채택했습니다."), // 답변 채택
    QUESTION_LIKED("님이 회원님의 질문을 좋아합니다."), // 질문에 좋아요
    ANSWER_LIKED("님이 회원님의 답변을 좋아합니다."), // 답변에 좋아요
    COMMENT_LIKED("님이 회원님의 댓글을 좋아합니다."); // 댓글에 좋아요

    private final String messageTemplate;

    NotificationType(String messageTemplate) {
        this.messageTemplate = messageTemplate;
    }

    public String buildContent(String senderNickname) {
        return senderNickname + messageTemplate;
    }



}
