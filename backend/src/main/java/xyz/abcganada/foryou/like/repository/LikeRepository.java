package xyz.abcganada.foryou.like.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import xyz.abcganada.foryou.like.domain.Like;
import xyz.abcganada.foryou.like.domain.TargetType;
import xyz.abcganada.foryou.member.domain.Member;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    // 1. 좋아요 존재 여부 조회 (Member 객체)
    boolean existsByMemberAndTargetTypeAndTargetId(Member member, TargetType targetType, Long targetId);

    // 2. 좋아요 조회 - 좋아요 취소 (물리 삭제) 위함
    Optional<Like> findByMemberAndTargetTypeAndTargetId(Member member, TargetType targetType, Long targetId);

}
