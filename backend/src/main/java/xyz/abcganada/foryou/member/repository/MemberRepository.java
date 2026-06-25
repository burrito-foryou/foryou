package xyz.abcganada.foryou.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.member.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
}
