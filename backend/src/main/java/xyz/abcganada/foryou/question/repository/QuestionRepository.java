package xyz.abcganada.foryou.question.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import xyz.abcganada.foryou.question.domain.Question;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {

    // 회원별 질문 목록 조회
    Page<Question> findByMemberId(Long memberId, Pageable pageable);

    // 질문 상세 조회
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.member LEFT JOIN FETCH q.tags WHERE q.id = :id")
    Optional<Question> findWithDetailsById(@Param("id") Long id);

    // 조회수 증가
    @Modifying
    @Query("UPDATE Question q SET q.viewCount = q.viewCount + 1 WHERE q.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // 키워드 검색 - 제목 + 내용
    @Query("SELECT q FROM Question q WHERE q.title LIKE %:keyword% OR q.content LIKE %:keyword%")
    Page<Question> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 태그 ID 기반 검색
    @Query("SELECT DISTINCT q FROM Question q JOIN q.tags t WHERE t.id IN :tagIds")
    Page<Question> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

    // 태그 이름 기반 검색
    @Query("SELECT DISTINCT q FROM Question q JOIN q.tags t WHERE t.name IN :tagNames")
    Page<Question> findByTagNames(@Param("tagNames") List<String> tagNames, Pageable pageable);

    // AnswerFacade.create
    @Query("""
            select q
                    from Question q 
                    join fetch q.member
                    where q.id = :questionId 
            """)
    Optional<Question> findByIdWithMember(@Param("questionId") Long questionId);

}
