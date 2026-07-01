package xyz.abcganada.foryou.like.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.comment.service.CommentService;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.service.MemberService;
import xyz.abcganada.foryou.notification.application.NotificationCreator;
import xyz.abcganada.foryou.notification.service.NotificationService;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.question.service.QuestionService;

@Service
@RequiredArgsConstructor
public class LikeFacade {

    private final LikeService likeService;
    private final MemberService memberService;
    private final QuestionService questionService;
    private final AnswerService answerService;
    private final CommentService commentService;
    private final NotificationCreator notificationCreator;
    private final NotificationService notificationService;

    @Transactional
    public void addLike(Long memberId, TargetType targetType, Long targetId) {
        Member sender = memberService.getMemberById(memberId);
        // 1. 좋아요 등록 (DB 반영)
        likeService.addLike(sender, targetType, targetId);

        switch (targetType) {
            case QUESTION -> {
                Question question = questionService.getQuestion(targetId);
                questionService.incrementLikeCount(targetId);
                notificationCreator.fromQuestionLiked(question, sender)
                        .ifPresent(notificationService::saveAndSend);
            }
            case ANSWER -> {
                // 도메인 조회 (notification 생성용)
                Answer answer = answerService.getAnswer(targetId);
                // 좋아요 수 증가
                answerService.incrementLikeCount(targetId); // increment 매개변수를 객체로 변경? BUT decrement와 비대칭성 문제
                // notification 생성
                notificationCreator.fromAnswerLiked(answer, sender)
                        .ifPresent(notificationService::saveAndSend);
            }
            case COMMENT -> {
                Comment comment = commentService.getComment(targetId);
                commentService.incrementLikeCount(targetId);
                notificationCreator.fromCommentLiked(comment, sender)
                        .ifPresent(notificationService::saveAndSend);

            }
        }

    }

    @Transactional
    public void cancelLike(Long memberId, TargetType targetType, Long targetId) {
        likeService.cancelLike(memberId, targetType, targetId);

        switch (targetType) {
            case QUESTION -> questionService.decrementLikeCount(targetId);
            case ANSWER -> answerService.decrementLikeCount(targetId);
            case COMMENT -> commentService.decrementLikeCount(targetId);
        }

    }

}
