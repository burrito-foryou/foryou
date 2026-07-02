import { useState } from "react";
import useAuthStore from "../../auth/store/authStore";
import { createComment } from "../api/commentApi";

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

const useCommentForm = (answerId, onSuccess) => {
  const token = useAuthStore((state) => state.token);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    const memberId = getMemberIdFromToken(token);
    if (!memberId) return;

    setLoading(true);
    try {
      await createComment(answerId, memberId, { content });
      setContent("");
      setError("");
      onSuccess?.();
    } catch (err) {
      const message = err.response?.data?.message ?? "댓글 등록에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { content, error, loading, handleChange, handleSubmit };
};

export default useCommentForm;
