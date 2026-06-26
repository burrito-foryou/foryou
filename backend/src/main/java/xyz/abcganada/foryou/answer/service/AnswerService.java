package xyz.abcganada.foryou.answer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.repository.AnswerRepository;
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.question.repository.QuestionRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;

    // WBS0403: 답변 등록
    @Transactional
    public AnswerResponse create(Long questionId, Long memberId, AnswerCreateRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        Answer answer = Answer.builder()
                .question(question)
                .member(member)
                .giftName(request.getGiftName())
                .priceRange(request.getPriceRange())
                .content(request.getContent())
                .likeCount(0L)
                .accepted(false)
                .build();

        return AnswerResponse.from(answerRepository.save(answer));
    }
}
