package xyz.abcganada.foryou.my.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.repository.AnswerRepository;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.comment.repository.CommentRepository;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;
import xyz.abcganada.foryou.question.repository.QuestionRepository;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyService {

    private static final Sort CREATED_AT_DESC = Sort.by("createdAt").descending();

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final CommentRepository commentRepository;

    public Page<QuestionResponse> getMyQuestions(Long memberId, int page, int size) {
        log.debug("[My] 내 질문 목록 조회 - memberId: {}, page: {}, size: {}", memberId, page, size);
        Pageable pageable = PageRequest.of(page, size, CREATED_AT_DESC);

        return questionRepository.findByMemberId(memberId, pageable)
            .map(QuestionResponse::from);
    }

    public Page<AnswerResponse> getMyAnswers(Long memberId, int page, int size) {
        log.debug("[My] 내 답변 목록 조회 - memberId: {}, page: {}, size: {}", memberId, page, size);
        Pageable pageable = PageRequest.of(page, size, CREATED_AT_DESC);

        return answerRepository.findByMemberId(memberId, pageable)
            .map(AnswerResponse::from);
    }

    public Page<CommentResponse> getMyComments(Long memberId, int page, int size) {
        log.debug("[My] 내 댓글 목록 조회 - memberId: {}, page: {}, size: {}", memberId, page, size);
        Pageable pageable = PageRequest.of(page, size, CREATED_AT_DESC);

        return commentRepository.findByMemberId(memberId, pageable)
            .map(CommentResponse::from);
    }
}
