package xyz.abcganada.foryou.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import xyz.abcganada.foryou.global.exception.BusinessException;
import xyz.abcganada.foryou.global.exception.ErrorCode;
import xyz.abcganada.foryou.member.domain.Member;
import xyz.abcganada.foryou.member.repository.MemberRepository;
import xyz.abcganada.foryou.member.rest.request.MemberUpdateRequest;
import xyz.abcganada.foryou.member.rest.response.MemberInfoResponse;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public MemberInfoResponse getMemberInfo(Long memberId) {
        Member member = getMemberById(memberId);
        return MemberInfoResponse.from(member);
    }

    public MemberInfoResponse updateMemberNickname(Long memberId, MemberUpdateRequest request) {
        Member member = getMemberById(memberId);
        validateNicknameChanged(member, request.nickname());

        member.updateNickname(request.nickname());

        return MemberInfoResponse.from(member);
    }

    private void validateNicknameChanged(Member member, String nickname) {
        if (member.getNickname().equals(nickname)) {
            throw new BusinessException(ErrorCode.SAME_NICKNAME);
        }
    }

    // 알림 전송 위한 회원 조회 -> MemberInfoResponse
    public Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }
}
