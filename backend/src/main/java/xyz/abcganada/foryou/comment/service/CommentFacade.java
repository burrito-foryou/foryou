package xyz.abcganada.foryou.comment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.comment.event.CommentCreatedEvent;
import xyz.abcganada.foryou.comment.rest.request.CommentCreateRequest;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;
import xyz.abcganada.foryou.notification.application.NotificationCreator;
import xyz.abcganada.foryou.notification.service.NotificationService;

@Service
@RequiredArgsConstructor
public class CommentFacade {

    private final CommentService commentService;
    private final NotificationCreator notificationCreator;
    private final NotificationService notificationService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public CommentResponse create(Long answerId, Long memberId, CommentCreateRequest request) {
        Comment comment = commentService.create(answerId, memberId, request);

        eventPublisher.publishEvent(new CommentCreatedEvent(comment.getId()));

        return CommentResponse.from(comment);
    }

}
