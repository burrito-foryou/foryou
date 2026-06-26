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

    @Column(nullable = false, unique = true, length = 50)
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

    public static Member create(String email, String encodedPassword, String nickname, AuthProvider provider) {
        return Member.builder()
            .email(email)
            .password(encodedPassword)
            .nickname(nickname)
            .role(Role.USER)
            .provider(provider)
            .build();
    }
}
