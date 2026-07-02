import { useState } from "react";
import useAuthStore from "../../auth/store/authStore";
import { updateAnswer, deleteAnswer, acceptAnswer } from "../api/answerApi";

const getMemberIdFromToken = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
    );
    return JSON.parse(json).sub;
  } catch {
    return null;
  }
};

const useAnswerItem = (answer, onSuccess, questionMemberId) => {
  const token = useAuthStore((state) => state.token);
  const memberId = getMemberIdFromToken(token);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    giftName: answer.giftName,
    priceRange: answer.priceRange,
    content: answer.content,
  });
  const [loading, setLoading] = useState(false);

  const isAuthor = String(memberId) === String(answer.memberId);
  const isQuestionAuthor = questionMemberId
    ? String(memberId) === String(questionMemberId)
    : false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!memberId) return;
    setLoading(true);
    try {
      await updateAnswer(answer.id, memberId, form);
      setIsEditing(false);
      onSuccess?.();
    } catch {
      // 에러 처리 추가 가능
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("답변을 삭제하시겠습니까?")) return;
    if (!memberId) return;
    try {
      await deleteAnswer(answer.id, memberId);
      onSuccess?.();
    } catch {
      // 에러 처리 추가 가능
    }
  };

  const handleAccept = async () => {
    if (!window.confirm("이 답변을 채택하시겠습니까?")) return;
    if (!memberId) return;
    try {
      await acceptAnswer(answer.id, memberId);
      onSuccess?.();
    } catch {
      // 에러 처리 추가 가능
    }
  };

  return {
    isEditing,
    setIsEditing,
    form,
    loading,
    isAuthor,
    isQuestionAuthor,
    handleChange,
    handleUpdate,
    handleDelete,
    handleAccept,
  };
};

export default useAnswerItem;
