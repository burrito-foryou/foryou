package xyz.abcganada.foryou.member.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import xyz.abcganada.foryou.global.common.BaseEntity;

// TODO: 의존성 때문에 만들어 놓은 임시파일 민기님의 파일로 교체 예정
@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    @Column(length = 20)
    private String role;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
}
