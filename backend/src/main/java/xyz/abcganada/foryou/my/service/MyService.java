package xyz.abcganada.foryou.my.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.question.repository.QuestionRepository;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyService {

    private final QuestionRepository questionRepository;

    public List<QuestionResponse> getMyQuestions(Long memberId) {
        return questionRepository.findByMemberIdOrderByCreatedAtDesc(memberId)
            .stream()
            .map(QuestionResponse::from)
            .toList();
    }
}
