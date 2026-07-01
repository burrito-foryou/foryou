package xyz.abcganada.foryou.notification.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.event.AnswerAcceptedEvent;
import xyz.abcganada.foryou.answer.event.AnswerCreatedEvent;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.comment.event.CommentCreatedEvent;
import xyz.abcganada.foryou.comment.service.CommentService;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.service.MemberService;
import xyz.abcganada.foryou.notification.domain.Notification;
import xyz.abcganada.foryou.notification.service.NotificationService;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final AnswerService answerService;
    private final NotificationCreator notificationCreator;
    private final NotificationService notificationService;
    private final MemberService memberService;
    private final CommentService commentService;

    //@Async("notificationExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAnswerCreated(AnswerCreatedEvent event) {
        try {
            Answer answer = answerService.getAnswer(event.answerId());
            notificationCreator.fromQuestionAnswerCreated(answer, answer.getMember())
                    .ifPresent(notificationService::saveAndSend);
        } catch (Exception e) {
            log.error("답변 등록 알림 실패: answerId={}", event.answerId(), e);
        }
    }

    //@Async("notificationExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAnswerAccepted(AnswerAcceptedEvent event) {
        try {
            Answer answer = answerService.getAnswer(event.answerId());
            Member sender = answer.getQuestion().getMember();
            notificationCreator.fromAnswerAccepted(answer, sender)
                    .ifPresent(notificationService::saveAndSend);
        } catch (Exception e) {
            log.error("답변 채택 알림 실패: answerId={}", event.answerId(), e);
        }
    }

    //@Async("notificationExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCommentCreated(CommentCreatedEvent event) {
        try {
            Comment comment = commentService.getComment(event.commentId());
            notificationCreator.fromQuestionCommentCreated(comment, comment.getMember())
                    .ifPresent(notificationService::saveAndSend);
            notificationCreator.fromAnswerCommentCreated(comment, comment.getMember())
                    .ifPresent(notificationService::saveAndSend);
        } catch (Exception e) {
            log.error("댓글 등록 알림 실패: commentId={}", event.commentId(), e);
        }
    }

}
