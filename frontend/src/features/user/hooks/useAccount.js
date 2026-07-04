import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyInfo,
  updateNickname,
  updateProfileImage,
  withdrawMember,
} from "../api/memberApi";
import useToast from "../../../shared/hooks/useToast";
import useAuthStore from "../../auth/store/authStore";
import { ROUTES } from "../../../shared/constants/routes";

const useAccount = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast, showToast } = useToast();
  const setNickname = useAuthStore((state) => state.setNickname);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    getMyInfo()
      .then(setMember)
      .finally(() => setLoading(false));
  }, []);

  const handleNicknameEdit = () => {
    setNicknameInput(member.nickname);
    setEditingNickname(true);
  };

  const handleNicknameCancel = () => {
    setEditingNickname(false);
    setNicknameInput("");
    setNicknameError("");
  };

  const handleNicknameSave = async () => {
    const trimmed = nicknameInput.trim();

    if (trimmed === member.nickname) {
      handleNicknameCancel();
      return;
    }

    if (!/^[가-힣a-zA-Z0-9]{2,20}$/.test(trimmed)) {
      setNicknameError("2~20자의 한글, 영문, 숫자만 사용할 수 있습니다.");
      return;
    }

    setNicknameError("");
    setNicknameLoading(true);
    try {
      const updated = await updateNickname(trimmed);
      setMember(updated);
      setNickname(trimmed);
      setEditingNickname(false);
      showToast("닉네임이 변경되었습니다.");
    } catch (err) {
      const message = err.response?.data?.message;
      setNicknameError(message ?? "닉네임 수정에 실패했습니다.");
    } finally {
      setNicknameLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageLoading(true);
    try {
      const result = await updateProfileImage(file);
      setMember((prev) => ({ ...prev, profileImageUrl: result.imageUrl }));
      showToast("프로필 이미지가 변경되었습니다.");
    } catch {
      showToast("이미지 업로드에 실패했습니다.", "error");
    } finally {
      setImageLoading(false);
      e.target.value = "";
    }
  };

  const handleWithdrawOpen = () => setIsWithdrawModalOpen(true);
  const handleWithdrawClose = () => setIsWithdrawModalOpen(false);

  const handleWithdrawConfirm = async () => {
    setWithdrawLoading(true);
    try {
      await withdrawMember();
      clearAuth();
      navigate(ROUTES.HOME);
    } catch {
      showToast("회원 탈퇴에 실패했습니다.", "error");
      setWithdrawLoading(false);
    }
  };

  return {
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
  };
};

export default useAccount;
