package xyz.abcganada.foryou.bookmark.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.bookmark.domain.Bookmark;
import xyz.abcganada.foryou.bookmark.repository.BookmarkRepository;
import xyz.abcganada.foryou.bookmark.rest.response.BookmarkResponse;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.question.repository.QuestionRepository;


@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final MemberRepository memberRepository;
    private final QuestionRepository questionRepository;

    // 북마크 추가
    public void addBookmark(Long memberId, Long questionId) {

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        Question question = questionRepository.findById(questionId).orElseThrow(() -> new BusinessException(ErrorCode.QUESTION_NOT_FOUND));

        if (bookmarkRepository.existsByMemberIdAndQuestionId(memberId, questionId)) {
            throw new BusinessException(ErrorCode.BOOKMARK_ALREADY_EXISTS);
        }

        bookmarkRepository.save(Bookmark.builder().member(member).question(question).build());
    }

    // 북마크 취소
    public void removeBookmark(Long memberId, Long questionId) {
        Bookmark bookmark = bookmarkRepository.findByMemberIdAndQuestionId(memberId, questionId).orElseThrow(() -> new BusinessException(ErrorCode.BOOKMARK_NOT_FOUND));
        bookmarkRepository.delete(bookmark);

    }

    // 북마크 여부 확인
    @Transactional(readOnly = true)
    public boolean isBookmarked(Long memberId, Long questionId) {
        return bookmarkRepository.existsByMemberIdAndQuestionId(memberId, questionId);
    }

    // 북마크 목록 조회
    @Transactional(readOnly = true)
    public Page<BookmarkResponse> getBookmarks(Long memberId, Pageable pageable) {
        return bookmarkRepository.findByMemberId(memberId, pageable).map(BookmarkResponse::from);
    }


}
