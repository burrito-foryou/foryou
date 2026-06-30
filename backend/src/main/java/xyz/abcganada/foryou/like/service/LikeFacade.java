package xyz.abcganada.foryou.like.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.member.service.MemberService;
import xyz.abcganada.foryou.notification.domain.NotificationType;
import xyz.abcganada.foryou.notification.service.NotificationService;

@Service
@RequiredArgsConstructor
public class LikeFacade {

    private final LikeService likeService;
    private final MemberService memberService;
    private final AnswerService answerService;
    private final NotificationService notificationService;

    @Transactional
    public void addLike(Long memberId, TargetType targetType, Long targetId) {
        Member sender = memberService.getMemberById(memberId);
        // 1. 좋아요 등록 (DB 반영)
        likeService.addLike(sender, targetType, targetId);


        switch (targetType) {
            // TODO 각 Service 통해 like_count 증가
            // case QUESTION -> questionService.incrementLikeCount(targetId);
            case ANSWER -> {
                // 좋아요 수 증가
                answerService.incrementLikeCount(targetId);
                Answer answer = answerService.getAnswer(targetId);

                notificationService.createNotification(
                        answer.getMember(),
                        sender,
                        NotificationType.ANSWER_LIKED,
                        xyz.abcganada.foryou.notification.domain.TargetType.ANSWER,
                        answer.getId(),
                        answer.getQuestion().getId()
                );
            }
            //case COMMENT -> commentService.incrementLikeCount(targetId);
        }

    }

    @Transactional
    public void cancelLike(Long memberId, TargetType targetType, Long targetId) {
        likeService.cancelLike(memberId, targetType, targetId);

        switch (targetType) {
            // TODO 각 Service 통해 like_count 감소
            // case QUESTION ->
            case ANSWER -> answerService.decrementLikeCount(targetId);
            // case COMMENT ->
        }

    }

}
