import { useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { getMyInfo } from "../api/memberApi";

const PROVIDER_LABEL = {
  FORYOU: "이메일",
  KAKAO: "카카오",
  GOOGLE: "구글",
};

const InfoRow = ({ label, value, editable }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <span className="text-sm text-text-muted">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-text">{value}</span>
      {editable && (
        <button className="text-xs font-medium text-primary hover:underline">
          수정
        </button>
      )}
    </div>
  </div>
);

const AccountPage = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInfo()
      .then(setMember)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-text-muted">
        불러오는 중...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-text-muted">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-lg font-bold text-text">계정 정보</h1>

      {/* 프로필 이미지 */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center gap-3">
        <button className="group relative">
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt="프로필 이미지"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light text-3xl font-bold text-primary">
              {member.nickname.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <FiImage size={22} className="text-white" />
          </div>
          <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
            <FiImage size={13} className="text-text-muted" />
          </div>
        </button>
        <div className="text-center">
          <p className="text-base font-bold text-text">{member.nickname}</p>
          <p className="mt-1 text-sm text-text-muted">{member.email}</p>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="rounded-xl border border-gray-200 bg-white px-6">
        <InfoRow label="이메일" value={member.email} />
        <InfoRow label="닉네임" value={member.nickname} editable />
        <InfoRow
          label="로그인 방식"
          value={PROVIDER_LABEL[member.provider] ?? member.provider}
        />
        <InfoRow
          label="가입일"
          value={new Date(member.createdAt).toLocaleDateString("ko-KR")}
        />
      </div>
    </div>
  );
};

export default AccountPage;
