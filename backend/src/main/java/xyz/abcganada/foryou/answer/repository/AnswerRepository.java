package xyz.abcganada.foryou.answer.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.abcganada.foryou.answer.domain.Answer;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // 특정 질문의 답변 목록 조회 (채택된 답변 상단 고정, 나머지는 작성일 오름차순)
    // @EntityGraph로 question, member를 JOIN하여 N+1 방지
    @EntityGraph(attributePaths = {"question", "member"})
    List<Answer> findByQuestionIdOrderByAcceptedDescCreatedAtAsc(Long questionId);

    // 특정 질문의 답변 수 조회 (질문 상태 변경 시 사용)
    long countByQuestionId(Long questionId);

    @Query("""
            select a 
                    from Answer a
                    join fetch a.question q
                    join fetch q.member
                    join fetch a.member
                    where a.id = :answerId
        """)
    Optional<Answer> findByIdWithQuestionAndMembers(@Param("answerId") Long answerId);
}
