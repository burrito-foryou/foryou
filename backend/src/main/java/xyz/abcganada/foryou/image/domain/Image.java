package xyz.abcganada.foryou.image.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "images")
@Getter
@NoArgsConstructor
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) // 숫자로 저장하면 나중에 순서 바뀔 때 문제 생김
    @Column(name = "target_type", nullable = false, length = 20)
    private ImageTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "original_name", nullable = false , length = 255)
    private String originalName;

    @Column(name = "stored_name", nullable = false , length = 255)
    private String storedName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "created_at", nullable = false , updatable = false)
    private LocalDateTime createdAt;

    @Builder // createdAt은 파라미터 없이 생성 시점에 자동으로 now()로 설정됨
    public Image(ImageTargetType targetType,  Long targetId, String imageUrl, String originalName, String storedName, Long fileSize) {
        this.targetType = targetType;
        this.targetId = targetId;
        this.imageUrl = imageUrl;
        this.originalName = originalName;
        this.storedName = storedName;
        this.fileSize = fileSize;
        this.createdAt = LocalDateTime.now();
    }


}
