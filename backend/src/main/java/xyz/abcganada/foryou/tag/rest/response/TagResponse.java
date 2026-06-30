package xyz.abcganada.foryou.tag.rest.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import xyz.abcganada.foryou.tag.Tag;

@Getter
@Builder
@AllArgsConstructor
public class TagResponse {

    private Long id;
    private String name;
    private String type;

    public static TagResponse from(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .type(tag.getType().name())
                .build();
    }
}