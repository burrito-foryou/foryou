import { useState } from "react";
import { createComment } from "../api/commentApi";

const useCommentForm = (answerId, onSuccess) => {
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

    setLoading(true);
    try {
      await createComment(answerId, { content });
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
