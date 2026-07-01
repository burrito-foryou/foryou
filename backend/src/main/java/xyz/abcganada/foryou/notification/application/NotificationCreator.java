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

    public Optional<Notification> fromQuestionLiked(Question question, Member sender) {
        return Notification.create(
                question.getMember(),
                sender,
                NotificationType.QUESTION_LIKED,
                TargetType.QUESTION,
                question.getId(),
                question.getId()
        );
    }

    public Optional<Notification> fromAnswerLiked(Answer answer, Member sender) {
        return Notification.create(
                answer.getMember(),
                sender,
                NotificationType.ANSWER_LIKED,
                TargetType.ANSWER,
                answer.getId(),
                answer.getQuestion().getId()
        );
    }

    public Optional<Notification> fromCommentLiked(Comment comment, Member sender) {
        return Notification.create(
                comment.getMember(),
                sender,
                NotificationType.COMMENT_LIKED,
                TargetType.COMMENT,
                comment.getId(),
                comment.getAnswer().getQuestion().getId()
        );
    }

}
