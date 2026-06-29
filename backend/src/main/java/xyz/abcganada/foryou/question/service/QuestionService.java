package xyz.abcganada.foryou.question.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.question.domain.Question;
import xyz.abcganada.foryou.question.rest.request.QuestionCreateRequest;
import xyz.abcganada.foryou.question.rest.response.QuestionResponse;
import xyz.abcganada.foryou.question.rest.response.QuestionDetailResponse;
import xyz.abcganada.foryou.question.repository.QuestionRepository;
import xyz.abcganada.foryou.question.repository.QuestionSpecification;
import xyz.abcganada.foryou.tag.Tag;
import xyz.abcganada.foryou.tag.TagRepository;
import xyz.abcganada.foryou.tag.TagType;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MemberRepository memberRepository;
    private final TagRepository tagRepository;

    // 질문 등록 (조건 태그 입력 처리 포함)
    @Transactional
    public QuestionResponse create(Long memberId, QuestionCreateRequest request) {
        // 회원 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        // 조건 태그 조회
        List<Tag> tags = new ArrayList<>();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            tags = tagRepository.findAllByIdIn(request.getTagIds());
        }

        // 질문 생성 및 저장
        Question question = Question.builder()
                .member(member)
                .title(request.getTitle())
                .content(request.getContent())
                .tags(tags)
                .build();

        return QuestionResponse.from(questionRepository.save(question));
    }

    // 질문 목록 조회 (검색 + 필터 + 정렬)
    public Page<QuestionResponse> getList(
            String keyword,
            String target,
            String budget,
            String gender,
            String ageGroup,
            String situation,
            String giftType,
            String sort,
            int page,
            int size
    ) {
        // N+1 방지 fetch join 기본 적용
        Specification<Question> spec = Specification.where(QuestionSpecification.fetchMember());

        // 키워드 검색
        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(QuestionSpecification.containsKeyword(keyword));
        }

        // 태그 타입별 필터
        if (target != null && !target.isBlank()) {
            spec = spec.and(QuestionSpecification.hasTagOfType(TagType.TARGET, List.of(target)));
        }
        if (budget != null && !budget.isBlank()) {
            spec = spec.and(QuestionSpecification.hasTagOfType(TagType.BUDGET, List.of(budget)));
        }
        if (gender != null && !gender.isBlank()) {
            spec = spec.and(QuestionSpecification.hasTagOfType(TagType.GENDER, List.of(gender)));
        }
        if (ageGroup != null && !ageGroup.isBlank()) {
            spec = spec.and(QuestionSpecification.hasTagOfType(TagType.AGE_GROUP, List.of(ageGroup)));
        }
        if (situation != null && !situation.isBlank()) {
            spec = spec.and(QuestionSpecification.hasTagOfType(TagType.SITUATION, List.of(situation)));
        }
        if (giftType != null && !giftType.isBlank()) {
            spec = spec.and(QuestionSpecification.hasTagOfType(TagType.GIFT_TYPE, List.of(giftType)));
        }

        // 정렬 + 페이징
        Pageable pageable = PageRequest.of(page, size, toSort(sort));

        return questionRepository.findAll(spec, pageable).map(QuestionResponse::from);
    }

    // 질문 상세 조회 (조회수 증가 포함)
    @Transactional
    public QuestionDetailResponse getDetail(Long questionId) {
        // 질문 조회
        Question question = questionRepository.findWithDetailsById(questionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.QUESTION_NOT_FOUND));

        // 조회수 증가
        question.incrementViewCount();

        return QuestionDetailResponse.from(question);
    }

    // 정렬 기준 변환
    private Sort toSort(String sort) {
        return switch (sort) {
            case "likes"   -> Sort.by("likeCount").descending();    // 좋아요순
            case "answers" -> Sort.by("answerCount").descending();  // 답변 많은 순 (@Formula 활용)
            case "views"   -> Sort.by("viewCount").descending();    // 조회수순
            default        -> Sort.by("createdAt").descending();    // 최신순 (기본값)
        };
    }
}