import { useState } from "react";
import useAuthStore from "../../auth/store/authStore";
import { createAnswer } from "../api/answerApi";

const INITIAL_FORM = { giftName: "", priceRange: "", content: "" };

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

const useAnswerForm = (questionId, onSuccess) => {
  const token = useAuthStore((state) => state.token);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.giftName.trim()) newErrors.giftName = "선물 이름은 필수입니다.";
    if (!form.priceRange.trim()) newErrors.priceRange = "가격대는 필수입니다.";
    if (!form.content.trim()) newErrors.content = "내용은 필수입니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const memberId = getMemberIdFromToken(token);
    if (!memberId) return;

    setLoading(true);
    try {
      await createAnswer(questionId, memberId, form);
      setForm(INITIAL_FORM);
      setErrors({});
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message ?? "답변 등록에 실패했습니다.";
      setErrors((prev) => ({ ...prev, server: message }));
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, handleChange, handleSubmit };
};

export default useAnswerForm;
