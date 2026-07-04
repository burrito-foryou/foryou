package xyz.abcganada.foryou.tag.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.abcganada.foryou.global.response.ApiResponse;
import xyz.abcganada.foryou.tag.TagType;
import xyz.abcganada.foryou.tag.rest.response.TagResponse;
import xyz.abcganada.foryou.tag.service.TagService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tags")
@Tag(name = "Tag", description = "태그 관련 API")
public class TagController {

    private final TagService tagService;

    // WBS0710: 태그 목록 조회 (전체 or 타입별)
    @Operation(summary = "태그 목록 조회", description = "전체 태그 또는 타입별 태그 목록을 조회한다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponse>>> getTags(
            @RequestParam(required = false) TagType type
    ) {
        List<TagResponse> response = (type != null)
                ? tagService.getByType(type)
                : tagService.getAll();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}