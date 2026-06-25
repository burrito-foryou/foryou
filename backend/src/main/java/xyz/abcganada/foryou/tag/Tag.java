package xyz.abcganada.foryou.tag;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 질문에 붙이는 조건 태그 Entity
 * 태그는 TagType으로 종류를 구분하며, name은 중복 불가
 */
@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 태그 이름 (예: "친구", "생일", "3만원 이하")
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    // 태그 종류 (어떤 조건에 해당하는 태그인지 구분)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TagType type;

    public Tag(String name, TagType type) {
        this.name = name;
        this.type = type;
    }
}