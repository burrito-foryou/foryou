package xyz.abcganada.foryou.comment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.answer.domain.Answer;
import xyz.abcganada.foryou.answer.repository.AnswerRepository;
import xyz.abcganada.foryou.comment.domain.Comment;
import xyz.abcganada.foryou.comment.repository.CommentRepository;
import xyz.abcganada.foryou.comment.rest.request.CommentCreateRequest;
import xyz.abcganada.foryou.comment.rest.request.CommentUpdateRequest;
import xyz.abcganada.foryou.comment.rest.response.CommentResponse;

import java.util.List;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final AnswerRepository answerRepository;
    private final MemberRepository memberRepository;

    // WBS0504: 댓글 조회
    public List<CommentResponse> getComments(Long answerId) {
        log.debug("[Comment] 댓글 목록 조회 - answerId: {}", answerId);
        if (!answerRepository.existsById(answerId)) {
            throw new BusinessException(ErrorCode.ANSWER_NOT_FOUND);
        }
        List<CommentResponse> responses = commentRepository.findByAnswerIdOrderByCreatedAtAsc(answerId)
                .stream()
                .map(CommentResponse::from)
                .toList();
        log.debug("[Comment] 댓글 목록 조회 완료 - answerId: {}, count: {}", answerId, responses.size());
        return responses;
    }

    // WBS0505: 댓글 수정
    @Transactional
    public CommentResponse update(Long commentId, Long memberId, CommentUpdateRequest request) {
        log.debug("[Comment] 댓글 수정 - commentId: {}, memberId: {}", commentId, memberId);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getMember().getId().equals(memberId)) {
            log.warn("[Comment] 댓글 수정 권한 없음 - commentId: {}, memberId: {}", commentId, memberId);
            throw new BusinessException(ErrorCode.COMMENT_FORBIDDEN);
        }

        comment.update(request.getContent());
        log.info("[Comment] 댓글 수정 완료 - commentId: {}, memberId: {}", commentId, memberId);
        return CommentResponse.from(comment);
    }

    // WBS0506: 댓글 삭제
    @Transactional
    public void delete(Long commentId, Long memberId) {
        log.debug("[Comment] 댓글 삭제 - commentId: {}, memberId: {}", commentId, memberId);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getMember().getId().equals(memberId)) {
            log.warn("[Comment] 댓글 삭제 권한 없음 - commentId: {}, memberId: {}", commentId, memberId);
            throw new BusinessException(ErrorCode.COMMENT_FORBIDDEN);
        }

        commentRepository.delete(comment);
        log.info("[Comment] 댓글 삭제 완료 - commentId: {}, memberId: {}", commentId, memberId);
    }

    // WBS0503: 댓글 작성
    @Transactional
    public Comment create(Long answerId, Long memberId, CommentCreateRequest request) {
        log.debug("[Comment] 댓글 등록 - answerId: {}, memberId: {}", answerId, memberId);
        Answer answer = answerRepository.findByIdWithQuestionAndMembers(answerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANSWER_NOT_FOUND));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Comment comment = Comment.builder()
                .answer(answer)
                .member(member)
                .content(request.getContent())
                .likeCount(0L)
                .build();

        Comment saved = commentRepository.save(comment);
        log.info("[Comment] 댓글 등록 완료 - commentId: {}, answerId: {}, memberId: {}", saved.getId(), answerId, memberId);
        return saved;
    }

    // WBS0608: Like 증가
    @Transactional
    public Long incrementLikeCount(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        comment.incrementLikeCount();
        log.debug("[Comment] 좋아요 증가 - commentId: {}, likeCount: {}", commentId, comment.getLikeCount());
        return comment.getLikeCount();
    }

    // WBS0608: Like 감소
    @Transactional
    public Long decrementLikeCount(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        comment.decrementLikeCount();
        log.debug("[Comment] 좋아요 감소 - commentId: {}, likeCount: {}", commentId, comment.getLikeCount());
        return comment.getLikeCount();
    }

    // 댓글 조회 - 알림 생성 위한 단순 조회
    public Comment getComment(Long commentId) {
        return commentRepository.findByIdWithAnswerAndQuestionAndMember(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
    }

}
