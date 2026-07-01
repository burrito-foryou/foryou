package xyz.abcganada.foryou.my.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.question.repository.QuestionRepository;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyService {

    private static final Sort CREATED_AT_DESC = Sort.by("createdAt").descending();

    private final QuestionRepository questionRepository;

    public Page<QuestionResponse> getMyQuestions(Long memberId, int page, int size) {
        log.debug("[My] 내 질문 목록 조회 - memberId: {}, page: {}, size: {}", memberId, page, size);
        Pageable pageable = PageRequest.of(page, size, CREATED_AT_DESC);

        return questionRepository.findByMemberId(memberId, pageable)
            .map(QuestionResponse::from);
    }
}
