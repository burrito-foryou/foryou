package xyz.abcganada.foryou.answer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.event.AnswerAcceptedEvent;
import xyz.abcganada.foryou.answer.event.AnswerCreatedEvent;
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;

@Service
@RequiredArgsConstructor
public class AnswerFacade {

    private final AnswerService answerService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public AnswerResponse create(Long questionId, Long memberId, AnswerCreateRequest request) {
        Answer answer = answerService.create(questionId, memberId, request);

        eventPublisher.publishEvent(new AnswerCreatedEvent(answer.getId()));

        return AnswerResponse.from(answer);
    }

    @Transactional
    public void accept(Long answerId, Long memberId) {
        answerService.accept(answerId, memberId);

        eventPublisher.publishEvent(new AnswerAcceptedEvent(answerId));

    }

}
