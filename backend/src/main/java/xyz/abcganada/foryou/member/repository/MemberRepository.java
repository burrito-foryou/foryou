package xyz.abcganada.foryou.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import xyz.abcganada.foryou.member.domain.Member;

import java.util.Optional;

// TODO 추후 민기님 파일로 교체
@Repository
public interface MemberRepository extends JpaRepository<Member,Long> {

    Optional<Member> findByEmail(String email);

}
