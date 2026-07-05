package xyz.abcganada.foryou.notification.application;

import org.springframework.stereotype.Component;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.domain.TargetType;
import xyz.abcganada.foryou.question.domain.Question;

import java.util.Optional;

// Answer, Comment, Question 등 여러 도메인 조합해서 Notification 생성
@Component
public class NotificationCreator {

    // 질문에 답변
    public Optional<Notification> fromQuestionAnswerCreated(Answer answer, Member sender) {
        return Notification.create(
                answer.getQuestion().getMember(),
                sender,
                NotificationType.QUESTION_ANSWER_CREATED,
                TargetType.ANSWER,
                answer.getId(),
                answer.getQuestion().getId(),
                answer.getQuestion().getTitle()
        );
    }

    // 질문에 댓글
    public Optional<Notification> fromQuestionCommentCreated(Comment comment, Member sender) {
        return Notification.create(
                comment.getAnswer().getQuestion().getMember(),
                sender,
                NotificationType.QUESTION_COMMENT_CREATED,
                TargetType.COMMENT,
                comment.getId(),
                comment.getAnswer().getQuestion().getId(),
                comment.getAnswer().getQuestion().getTitle()
        );
    }

    // 답변에 댓글
    public Optional<Notification> fromAnswerCommentCreated(Comment comment, Member sender) {
        return Notification.create(
                comment.getAnswer().getMember(),
                sender,
                NotificationType.ANSWER_COMMENT_CREATED,
                TargetType.COMMENT,
                comment.getId(),
                comment.getAnswer().getQuestion().getId(),
                comment.getAnswer().getQuestion().getTitle()
        );
    }

    // 답변 채택
    public Optional<Notification> fromAnswerAccepted(Answer answer, Member sender) {
        return Notification.create(
                answer.getMember(),
                sender,
                NotificationType.ANSWER_ACCEPTED,
                TargetType.ANSWER,
                answer.getId(),
                answer.getQuestion().getId(),
                answer.getQuestion().getTitle()
        );
    }

    public Optional<Notification> fromQuestionLiked(Question question, Member sender) {
        return Notification.create(
                question.getMember(),
                sender,
                NotificationType.QUESTION_LIKED,
                TargetType.QUESTION,
                question.getId(),
                question.getId(),
                question.getTitle()
        );
    }

    public Optional<Notification> fromAnswerLiked(Answer answer, Member sender) {
        return Notification.create(
                answer.getMember(),
                sender,
                NotificationType.ANSWER_LIKED,
                TargetType.ANSWER,
                answer.getId(),
                answer.getQuestion().getId(),
                answer.getQuestion().getTitle()
        );
    }

    public Optional<Notification> fromCommentLiked(Comment comment, Member sender) {
        return Notification.create(
                comment.getMember(),
                sender,
                NotificationType.COMMENT_LIKED,
                TargetType.COMMENT,
                comment.getId(),
                comment.getAnswer().getQuestion().getId(),
                comment.getAnswer().getQuestion().getTitle()
        );
    }

}
