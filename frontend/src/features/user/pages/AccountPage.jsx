import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FiEdit2, FiMail } from "react-icons/fi";
import useAccount from "../hooks/useAccount";
import ProfileImageSection from "../components/ProfileImageSection";
import NicknameEditModal from "../components/NicknameEditModal";
import WithdrawConfirmModal from "../components/WithdrawConfirmModal";
import Toast from "../../../shared/components/Toast";

const PROVIDER_META = {
  FORYOU: { label: "Foryou", icon: FiMail },
  KAKAO: { label: "Kakao", icon: RiKakaoTalkFill },
  GOOGLE: { label: "Google", icon: FcGoogle },
};

const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const AccountPage = () => {
  const {
    toast,
    member,
    loading,
    editingNickname,
    nicknameInput,
    nicknameLoading,
    imageLoading,
    fileInputRef,
    setNicknameInput,
    nicknameError,
    handleNicknameEdit,
    handleNicknameCancel,
    handleNicknameSave,
    handleImageClick,
    handleImageChange,
    handleImageReset,
    isWithdrawModalOpen,
    withdrawLoading,
    handleWithdrawOpen,
    handleWithdrawClose,
    handleWithdrawConfirm,
  } = useAccount();

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

  const provider = PROVIDER_META[member.provider] ?? {
    label: member.provider,
    icon: null,
  };
  const ProviderIcon = provider.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-black text-text">계정 정보</h1>

      {/* 프로필 요약 */}
      <div className="card mb-4 p-8">
        <div className="flex items-center gap-5">
          <ProfileImageSection
            member={member}
            imageLoading={imageLoading}
            fileInputRef={fileInputRef}
            onImageClick={handleImageClick}
            onImageChange={handleImageChange}
            onImageReset={handleImageReset}
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-text">
                {member.nickname}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-text-muted">
                {ProviderIcon && <ProviderIcon size={12} />}
                {provider.label} 로그인
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-text">
              {member.email}
            </p>
            <p className="text-xs text-text-muted">
              {formatJoinDate(member.createdAt)} 가입
            </p>
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="card mb-4 divide-y divide-border px-6">
        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-bold text-text">닉네임</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text">
              {member.nickname}
            </span>
            <button
              onClick={handleNicknameEdit}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-text transition-colors hover:border-primary hover:text-primary"
            >
              <FiEdit2 size={12} />
              수정
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-bold text-text">이메일</span>
          <span className="text-sm font-semibold text-text">
            {member.email}
          </span>
        </div>

        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-bold text-text">로그인 방식</span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-text">
            {ProviderIcon && <ProviderIcon size={14} />}
            {provider.label}
          </span>
        </div>

        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-bold text-text">가입일</span>
          <span className="text-sm font-semibold text-text">
            {new Date(member.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      {/* 위험 구역 */}
      <div className="card flex items-center justify-between gap-4 p-6">
        <div>
          <p className="text-sm font-bold text-text">회원 탈퇴</p>
          <p className="mt-1 text-xs text-text-muted">
            탈퇴 시 작성한 질문, 답변, 댓글 등 모든 활동 내역이 삭제되며 복구할
            수 없습니다
          </p>
        </div>
        <button
          onClick={handleWithdrawOpen}
          className="shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:border-error hover:text-error"
        >
          탈퇴하기
        </button>
      </div>

      <Toast toast={toast} />

      {editingNickname && (
        <NicknameEditModal
          value={nicknameInput}
          loading={nicknameLoading}
          error={nicknameError}
          onChange={setNicknameInput}
          onSave={handleNicknameSave}
          onClose={handleNicknameCancel}
        />
      )}

      {isWithdrawModalOpen && (
        <WithdrawConfirmModal
          loading={withdrawLoading}
          onConfirm={handleWithdrawConfirm}
          onClose={handleWithdrawClose}
        />
      )}
    </div>
  );
};

export default AccountPage;
