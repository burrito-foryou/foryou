package xyz.abcganada.foryou.answer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.answer.domain.Answer;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // 특정 질문의 답변 목록 조회 (채택된 답변 상단 고정, 나머지는 작성일 오름차순)
    // @EntityGraph로 question, member를 JOIN하여 N+1 방지
    @EntityGraph(attributePaths = {"question", "member"})
    List<Answer> findByQuestionIdOrderByAcceptedDescCreatedAtAsc(Long questionId);

    // 특정 질문의 답변 수 조회 (질문 상태 변경 시 사용)
    long countByQuestionId(Long questionId);

    // 내가 작성한 답변 목록 조회 (페이징)
    @EntityGraph(attributePaths = {"question", "member"})
    Page<Answer> findByMemberId(Long memberId, Pageable pageable);
}
