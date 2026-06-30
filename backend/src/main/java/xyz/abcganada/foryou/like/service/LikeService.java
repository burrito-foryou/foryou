package xyz.abcganada.foryou.like.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.like.domain.Like;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.like.repository.LikeRepository;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final MemberRepository memberRepository;

    // 1. 좋아요 등록
    public void addLike(Long memberId, TargetType targetType, Long targetId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        // 중복 좋아요 여부 확인
        if (likeRepository.existsByMemberAndTargetTypeAndTargetId(member, targetType, targetId)) {
            throw new BusinessException(ErrorCode.LIKE_ALREADY_EXISTS);
        }

        likeRepository.save(Like.builder()
                .member(member)
                .targetType(targetType)
                .targetId(targetId)
                .build());
    }

    // 2. 좋아요 취소
    public void cancelLike(Long memberId, TargetType targetType, Long targetId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Like like = likeRepository.findByMemberAndTargetTypeAndTargetId(member, targetType, targetId)
                .orElseThrow(() -> new BusinessException(ErrorCode.LIKE_NOT_FOUND));

        likeRepository.delete(like);
    }

    // 3. 좋아요 여부 - 표시
    @Transactional(readOnly = true)
    public boolean isLiked(Long memberId, TargetType targetType, Long targetId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
        return likeRepository.existsByMemberAndTargetTypeAndTargetId(member, targetType, targetId);
    }

}
