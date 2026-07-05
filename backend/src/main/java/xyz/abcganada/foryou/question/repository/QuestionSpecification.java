package xyz.abcganada.foryou.question.repository;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.tag.Tag;
import xyz.abcganada.foryou.tag.TagType;

import java.util.List;

public class QuestionSpecification {


    public static Specification<Question> fetchMember() {
        return (root, query, cb) -> {
            if (Long.class != query.getResultType()) {
                root.fetch("member", JoinType.LEFT);
            }
            return cb.conjunction();
        };
    }

    // 키워드 검색 - 제목 또는 내용
    public static Specification<Question> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String pattern = "%" + keyword + "%";
            return cb.or(
                    cb.like(root.get("title"), pattern),
                    cb.like(root.get("content"), pattern)
            );
        };
    }

    // 태그 타입별 필터 - 대상, 예산, 성별, 나이대, 상황, 선물 유형
    public static Specification<Question> hasTagOfType(TagType tagType, List<String> tagNames) {
        return (root, query, cb) -> {
            if (tagNames == null || tagNames.isEmpty()) return null;
            query.distinct(true);
            Join<Question, Tag> tags = root.join("tags");
            return cb.and(
                    cb.equal(tags.get("type"), tagType),
                    tags.get("name").in(tagNames)
            );
        };
    }

    // 태그 ID 기반 검색
    public static Specification<Question> hasTagIds(List<Long> tagIds) {
        return (root, query, cb) -> {
            if (tagIds == null || tagIds.isEmpty()) return null;
            query.distinct(true);
            Join<Question, Tag> tags = root.join("tags");
            return tags.get("id").in(tagIds);
        };
    }
    // 태그 이름 부분 검색 — # 검색 시 사용
    public static Specification<Question> containsTagName(String tagName) {
        return (root, query, cb) -> {
            if (tagName == null || tagName.isBlank()) return null;
            query.distinct(true);
            Join<Question, Tag> tags = root.join("tags", JoinType.LEFT);
            return cb.like(tags.get("name"), "%" + tagName + "%");
        };
    }
}
