package xyz.abcganada.foryou.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.member.rest.request.MemberUpdateRequest;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public MemberInfoResponse getMemberInfo(Long memberId) {
        log.debug("[Member] 회원 정보 조회 - memberId: {}", memberId);
        Member member = getMemberById(memberId);
        return MemberInfoResponse.from(member);
    }

    public MemberInfoResponse updateMemberNickname(Long memberId, MemberUpdateRequest request) {
        log.info("[Member] 닉네임 수정 - memberId: {}, nickname: {}", memberId, request.nickname());
        Member member = getMemberById(memberId);
        validateNicknameChanged(member, request.nickname());

        member.updateNickname(request.nickname());

        return MemberInfoResponse.from(member);
    }

    public void updateProfileImageUrl(Long memberId, String imageUrl) {
        log.info("[Member] 프로필 이미지 URL 수정 - memberId: {}", memberId);
        Member member = getMemberById(memberId);
        member.updateProfileImageUrl(imageUrl);
    }

    private void validateNicknameChanged(Member member, String nickname) {
        if (member.getNickname().equals(nickname)) {
            throw new BusinessException(ErrorCode.SAME_NICKNAME);
        }
    }

    // 알림 전송 위한 회원 조회 -> MemberInfoResponse
    public Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> {
                    log.warn("[Member] 회원 없음 - memberId: {}", memberId);
                    return new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
                });
    }
}
