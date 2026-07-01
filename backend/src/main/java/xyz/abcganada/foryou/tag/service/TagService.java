package xyz.abcganada.foryou.tag.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.tag.TagRepository;
import xyz.abcganada.foryou.tag.TagType;
import xyz.abcganada.foryou.tag.rest.response.TagResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;

    // WBS0710: 전체 태그 목록 조회
    public List<TagResponse> getAll() {
        return tagRepository.findAll()
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    // WBS0710: 타입별 태그 목록 조회
    public List<TagResponse> getByType(TagType type) {
        return tagRepository.findAllByType(type)
                .stream()
                .map(TagResponse::from)
                .toList();
    }
}