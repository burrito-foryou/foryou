package xyz.abcganada.foryou.comment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.repository.AnswerRepository;
import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.comment.repository.CommentRepository;
import xyz.abcganada.foryou.comment.rest.request.CommentCreateRequest;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;

import java.util.List;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final AnswerRepository answerRepository;
    private final MemberRepository memberRepository;

    // WBS0504: 댓글 조회
    public List<CommentResponse> getComments(Long answerId) {
        if (!answerRepository.existsById(answerId)) {
            throw new BusinessException(ErrorCode.ANSWER_NOT_FOUND);
        }
        return commentRepository.findByAnswerIdOrderByCreatedAtAsc(answerId)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    // WBS0503: 댓글 작성
    @Transactional
    public CommentResponse create(Long answerId, Long memberId, CommentCreateRequest request) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Comment comment = Comment.builder()
                .answer(answer)
                .member(member)
                .content(request.getContent())
                .likeCount(0L)
                .build();

        return CommentResponse.from(commentRepository.save(comment));
    }
}
