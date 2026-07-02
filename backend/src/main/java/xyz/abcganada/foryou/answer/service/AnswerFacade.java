package xyz.abcganada.foryou.answer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.notification.application.NotificationCreator;
import xyz.abcganada.foryou.notification.service.NotificationService;

@Service
@RequiredArgsConstructor
public class AnswerFacade {

    private final AnswerService answerService;
    private final NotificationCreator notificationCreator;
    private final NotificationService notificationService;

    @Transactional
    public AnswerResponse create(Long questionId, Long memberId, AnswerCreateRequest request) {
        Answer answer = answerService.create(questionId, memberId, request);

        notificationCreator.fromQuestionAnswerCreated(answer, answer.getMember())
                .ifPresent(notificationService::saveAndSend);

        return AnswerResponse.from(answer);
    }

    @Transactional
    public void accept(Long answerId, Long memberId) {
        Answer answer = answerService.accept(answerId, memberId);
        // sender = 질문 작성자
        Member sender = answer.getQuestion().getMember();

        notificationCreator.fromAnswerAccepted(answer, sender)
                .ifPresent(notificationService::saveAndSend);
    }

}
