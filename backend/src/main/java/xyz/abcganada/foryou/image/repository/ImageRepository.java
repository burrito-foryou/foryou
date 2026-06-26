package xyz.abcganada.foryou.image.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import xyz.abcganada.foryou.image.domain.Image;
import xyz.abcganada.foryou.image.domain.ImageTargetType;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    // 이미지 조회 (질문/답변/프로필 등 대상별 전체 조회)
    List<Image> findByTargetTypeAndTargetId(ImageTargetType targetType, Long targetId);

    // 이미지 삭제 (연관 이미지 전체 삭제)
    void deleteByTargetTypeAndTargetId(ImageTargetType targetType, Long targetId);

}
