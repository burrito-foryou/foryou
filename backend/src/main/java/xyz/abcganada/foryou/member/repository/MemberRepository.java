package xyz.abcganada.foryou.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.member.domain.Member;

// TODO: 의존성 때문에 만들어 놓은 임시파일 민기님의 파일로 교체 예정
public interface MemberRepository extends JpaRepository<Member, Long> {
}
