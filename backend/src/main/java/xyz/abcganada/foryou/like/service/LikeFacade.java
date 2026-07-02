package xyz.abcganada.foryou.like.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.comment.service.CommentService;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.like.event.LikeAddedEvent;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.service.MemberService;
import xyz.abcganada.foryou.question.service.QuestionService;

@Service
@RequiredArgsConstructor
public class LikeFacade {

    private final LikeService likeService;
    private final MemberService memberService;
    private final QuestionService questionService;
    private final AnswerService answerService;
    private final CommentService commentService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void addLike(Long memberId, TargetType targetType, Long targetId) {
        Member sender = memberService.getMemberById(memberId);
        // 1. 좋아요 등록 (DB 반영)
        likeService.addLike(sender, targetType, targetId);

        switch (targetType) {
            case QUESTION -> questionService.incrementLikeCount(targetId);
            case ANSWER -> answerService.incrementLikeCount(targetId);
            case COMMENT -> commentService.incrementLikeCount(targetId);
        }
        eventPublisher.publishEvent(new LikeAddedEvent(targetType, targetId, memberId));
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
