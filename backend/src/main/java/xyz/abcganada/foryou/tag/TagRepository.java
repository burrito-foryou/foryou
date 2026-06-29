package xyz.abcganada.foryou.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // 태그 ID 목록으로 태그 조회
    List<Tag> findAllByIdIn(List<Long> ids);
}