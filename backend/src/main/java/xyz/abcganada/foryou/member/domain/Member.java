package xyz.abcganada.foryou.member.domain;

import jakarta.persistence.*;
import lombok.*;
import xyz.abcganada.foryou.global.common.BaseEntity;

@Entity
@Getter
@Builder
@Table(name = "members")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AuthProvider provider;

    @Column(name = "provider_id", length = 100)
    private String providerId;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateProfileImageUrl(String profileImageUrl) {
        //TODO 사용자 이미지 변경
    }

    public static Member createLocalMember(String email, String encodedPassword, String nickname) {
        return Member.builder()
            .email(email)
            .password(encodedPassword)
            .nickname(nickname)
            .role(Role.USER)
            .provider(AuthProvider.FORYOU)
            .build();
    }

    public static Member createSocialMember(String email, String nickname, AuthProvider provider, String providerId) {
        return Member.builder()
            .email(email)
            .nickname(nickname)
            .role(Role.USER)
            .provider(provider)
            .providerId(providerId)
            .build();
    }
}
