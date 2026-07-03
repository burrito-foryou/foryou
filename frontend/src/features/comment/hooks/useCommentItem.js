import { useState } from "react";
import useAuthStore from "../../auth/store/authStore";
import { updateComment, deleteComment } from "../api/commentApi";

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

const useCommentItem = (comment, onSuccess) => {
  const token = useAuthStore((state) => state.token);
  const memberId = getMemberIdFromToken(token);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isAuthor = String(memberId) === String(comment.memberId);

  const handleChange = (e) => setContent(e.target.value);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await updateComment(comment.id, { content });
      setIsEditing(false);
      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message ?? "댓글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      await deleteComment(comment.id);
      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message ?? "댓글 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    content,
    loading,
    isAuthor,
    handleChange,
    handleUpdate,
    handleDelete,
  };
};

export default useCommentItem;
