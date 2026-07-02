package xyz.abcganada.foryou.comment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.comment.domain.Comment;
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

    @Transactional
    public CommentResponse create(Long answerId, Long memberId, CommentCreateRequest request) {
        Comment comment = commentService.create(answerId, memberId, request);

        notificationCreator.fromQuestionCommentCreated(comment, comment.getMember())
                .ifPresent(notificationService::saveAndSend);
        notificationCreator.fromAnswerCommentCreated(comment, comment.getMember())
                .ifPresent(notificationService::saveAndSend);
        return CommentResponse.from(comment);
    }

}
