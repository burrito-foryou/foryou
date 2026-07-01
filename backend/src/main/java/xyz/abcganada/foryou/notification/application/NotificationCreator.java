package xyz.abcganada.foryou.notification.application;

import org.springframework.stereotype.Component;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.domain.TargetType;

import java.util.Optional;

// Answer, Comment, Question 등 여러 도메인 조합해서 Notification 생성
@Component
public class NotificationCreator {

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

}
