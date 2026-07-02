package xyz.abcganada.foryou.answer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.repository.AnswerRepository;
import xyz.abcganada.foryou.answer.rest.request.AnswerCreateRequest;
import xyz.abcganada.foryou.answer.rest.request.AnswerUpdateRequest;
import xyz.abcganada.foryou.answer.rest.response.AnswerResponse;

import java.util.List;
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

    // WBS0404: 답변 목록 조회
    public List<AnswerResponse> getAnswers(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new BusinessException(ErrorCode.QUESTION_NOT_FOUND);
        }
        return answerRepository.findByQuestionIdOrderByAcceptedDescCreatedAtAsc(questionId)
                .stream()
                .map(AnswerResponse::from)
                .toList();
    }

    // WBS0405: 답변 수정
    @Transactional
    public AnswerResponse update(Long answerId, Long memberId, AnswerUpdateRequest request) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));

        if (!answer.getMember().getId().equals(memberId)) {
            throw new BusinessException(ErrorCode.ANSWER_FORBIDDEN);
        }

        answer.update(request.getGiftName(), request.getPriceRange(), request.getContent());
        return AnswerResponse.from(answer);
    }

    // WBS0407/0408: 답변 채택 및 질문 상태 변경
    @Transactional
    public Answer accept(Long answerId, Long memberId) {
        Answer answer = answerRepository.findByIdWithQuestionAndMembers(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));

        Question question = answer.getQuestion();

        // 질문 작성자만 채택 가능
        if (!question.isAuthor(memberId)) {
            throw new BusinessException(ErrorCode.ANSWER_FORBIDDEN);
        }

        // 이미 채택된 질문인지 확인
        if (question.getAcceptedAnswerId() != null) {
            throw new BusinessException(ErrorCode.ANSWER_ALREADY_ACCEPTED);
        }

        // WBS0407: 답변 채택 처리
        answer.accept();

        // WBS0408: 질문 채택 답변 ID 설정
        question.accept(answerId);

        return answer;
    }

    // WBS0406: 답변 삭제
    @Transactional
    public void delete(Long answerId, Long memberId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));

        if (!answer.getMember().getId().equals(memberId)) {
            throw new BusinessException(ErrorCode.ANSWER_FORBIDDEN);
        }

        answerRepository.delete(answer);
    }

    // WBS0403: 답변 등록
    @Transactional
    public Answer create(Long questionId, Long memberId, AnswerCreateRequest request) {
        Question question = questionRepository.findByIdWithMember(questionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUESTION_NOT_FOUND));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Answer answer = Answer.builder()
                .question(question)
                .member(member)
                .giftName(request.getGiftName())
                .priceRange(request.getPriceRange())
                .content(request.getContent())
                .likeCount(0L)
                .accepted(false)
                .build();

        return answerRepository.save(answer);
    }

    // WBS0607: Like 증가
    @Transactional
    public void incrementLikeCount(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));
        answer.incrementLikeCount();
    }

    // WBS0607: Like 감소
    // this로 내부 호출 시 Spring 프록시 우회 문제로 getAnswer 사용 X
    @Transactional
    public void decrementLikeCount(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));
        answer.decrementLikeCount();
    }

    // 답변 조회 - 알림 전송 위한 단순 조회
    @Transactional(readOnly = true)
    public Answer getAnswer(Long answerId) {
        return answerRepository.findByIdWithQuestionAndMembers(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));
    }
}
