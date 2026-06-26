package xyz.abcganada.foryou.question.repository;

<<<<<<< HEAD
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import xyz.abcganada.foryou.question.domain.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {

    // 1. 회원별 질문 목록 조회 (마이페이지)
    Page<Question> findByMemberId(Long memberId, Pageable pageable);

    // 2. 키워드 검색 - 제목 + 내용 (WBS 7.4)
    @Query("SELECT q FROM Question q WHERE q.title LIKE %:keyword% OR q.content LIKE %:keyword%")
    Page<Question> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 3. 태그 ID 기반 검색 (WBS 7.5)
    @Query("SELECT DISTINCT q FROM Question q JOIN q.tags t WHERE t.id IN :tagIds")
    Page<Question> findByTagIds(@Param("tagIds") List<Long> tagIds, Pageable pageable);

    // 4. 태그 이름 기반 검색 (WBS 7.5)
    @Query("SELECT DISTINCT q FROM Question q JOIN q.tags t WHERE t.name IN :tagNames")
    Page<Question> findByTagNames(@Param("tagNames") List<String> tagNames, Pageable pageable);

}
=======
import org.springframework.data.jpa.repository.JpaRepository;
import xyz.abcganada.foryou.question.domain.Question;

// 임시파일 현민님의 파일로 교체 예정
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
>>>>>>> fdd9ae2262fd7de3b3c4af398dcdd8aff8ef436a
