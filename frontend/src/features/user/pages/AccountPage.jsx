import useAccount from "../hooks/useAccount";
import ProfileImageSection from "../components/ProfileImageSection";
import NicknameEditModal from "../components/NicknameEditModal";
import WithdrawConfirmModal from "../components/WithdrawConfirmModal";
import Toast from "../../../shared/components/Toast";

const PROVIDER_LABEL = {
  FORYOU: "이메일",
  KAKAO: "카카오",
  GOOGLE: "구글",
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-lg font-bold text-text">계정 정보</h1>

      <ProfileImageSection
        member={member}
        imageLoading={imageLoading}
        fileInputRef={fileInputRef}
        onImageClick={handleImageClick}
        onImageChange={handleImageChange}
      />

      {/* 기본 정보 */}
      <div className="rounded-xl border border-gray-200 bg-white px-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-sm text-text-muted">이메일</span>
          <span className="text-sm font-medium text-text">{member.email}</span>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-sm text-text-muted">닉네임</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text">
              {member.nickname}
            </span>
            <button
              onClick={handleNicknameEdit}
              className="text-xs font-medium text-primary hover:underline"
            >
              수정
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-sm text-text-muted">로그인 방식</span>
          <span className="text-sm font-medium text-text">
            {PROVIDER_LABEL[member.provider] ?? member.provider}
          </span>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-text-muted">가입일</span>
          <span className="text-sm font-medium text-text">
            {new Date(member.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      {/* 위험 구역 */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text">회원 탈퇴</p>
            <p className="mt-1 text-xs text-text-muted">
              탈퇴 시 작성한 질문, 답변, 댓글 등 모든 활동 내역이 삭제되며
              복구할 수 없습니다.
            </p>
          </div>
          <button
            onClick={handleWithdrawOpen}
            className="shrink-0 text-xs font-medium text-red-400 hover:text-red-500 hover:underline"
          >
            탈퇴하기
          </button>
        </div>
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
