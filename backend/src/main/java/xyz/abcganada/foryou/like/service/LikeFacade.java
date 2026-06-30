package xyz.abcganada.foryou.like.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.service.AnswerService;
import xyz.abcganada.foryou.like.domain.TargetType;

@Service
@RequiredArgsConstructor
public class LikeFacade {

    private final LikeService likeService;
    private final AnswerService answerService;

    @Transactional
    public void addLike(Long memberId, TargetType targetType, Long targetId) {
        likeService.addLike(memberId, targetType, targetId);

        switch (targetType) {
            // TODO 각 Service 통해 like_count 증가
            // case QUESTION -> questionService.incrementLikeCount(targetId);
            case ANSWER -> answerService.incrementLikeCount(targetId);
            //case COMMENT -> commentService.incrementLikeCount(targetId);
        }

        // + TODO 알림 생성 추가
    }

    @Transactional
    public void cancelLike(Long memberId, TargetType targetType, Long targetId) {
        likeService.cancelLike(memberId, targetType, targetId);

        switch (targetType) {
            // TODO 각 Service 통해 like_count 증가
            // case QUESTION ->
            case ANSWER -> answerService.decrementLikeCount(targetId);
            // case COMMENT ->
        }

    }

}
