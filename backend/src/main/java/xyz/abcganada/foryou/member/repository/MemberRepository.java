package xyz.abcganada.foryou.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.member.domain.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    Optional<Member> findByEmail(String email);
}
