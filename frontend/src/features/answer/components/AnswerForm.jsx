import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiChevronDown, FiImage, FiX } from "react-icons/fi";
import useAnswerForm from "../hooks/useAnswerForm";
import useAuthStore from "../../auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";
import { ROUTES } from "../../../shared/constants/routes";
import { uploadAnswerImage } from "../../image/api/imageApi";

const PRICE_RANGE_OPTIONS = [
  "1만원 이하",
  "1~3만원",
  "3~5만원",
  "5~10만원",
  "10만원 이상",
];

const AnswerForm = ({ questionId, onSuccess }) => {
  const [pendingImage, setPendingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // 답변 등록 성공 후, 선택해둔 이미지가 있으면 새로 생긴 answerId로 업로드한다.
  const handleAnswerCreated = async (answer) => {
    if (pendingImage) {
      try {
        await uploadAnswerImage(answer.id, pendingImage);
      } catch {
        // 이미지 업로드 실패는 무시하고 답변 등록은 완료된 것으로 처리
      }
      URL.revokeObjectURL(previewUrl);
      setPendingImage(null);
      setPreviewUrl(null);
    }
    onSuccess?.();
  };

  const { form, errors, loading, handleChange, handleSubmit } = useAnswerForm(
    questionId,
    handleAnswerCreated,
  );
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPriceMenu, setShowPriceMenu] = useState(false);
  const priceMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priceMenuRef.current && !priceMenuRef.current.contains(e.target)) {
        setShowPriceMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormSubmit = (e) => {
    if (!token) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    handleSubmit(e);
  };

  const selectPriceRange = (value) => {
    handleChange({ target: { name: "priceRange", value } });
    setShowPriceMenu(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(previewUrl);
    setPendingImage(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <p className="mb-3 text-lg font-black text-text">답변 작성하기</p>

      <div className="card p-7">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-text">
                선물 이름
              </label>
              <input
                type="text"
                name="giftName"
                value={form.giftName}
                onChange={handleChange}
                placeholder="예) 조말론 향수"
                className={`h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition-colors focus:border-primary ${
                  errors.giftName ? "border-red-400" : "border-border"
                }`}
              />
              {errors.giftName && (
                <p className="mt-1 text-xs text-red-500">{errors.giftName}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-text">
                가격대
              </label>
              <div className="relative" ref={priceMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowPriceMenu((v) => !v)}
                  className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-4 text-sm transition-colors focus:border-primary ${
                    errors.priceRange ? "border-red-400" : "border-border"
                  } ${form.priceRange ? "text-text" : "text-text-muted"}`}
                >
                  <span className="truncate">
                    {form.priceRange || "예) 5만원~10만원"}
                  </span>
                  <FiChevronDown
                    size={16}
                    className={`shrink-0 text-text-muted transition-transform ${
                      showPriceMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPriceMenu && (
                  <div className="absolute left-0 top-12 z-10 w-full rounded-2xl border border-border bg-background p-1.5 shadow-soft">
                    {PRICE_RANGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => selectPriceRange(opt)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface ${
                          form.priceRange === opt
                            ? "font-bold text-primary"
                            : "text-text"
                        }`}
                      >
                        {opt}
                        {form.priceRange === opt && <FiCheck size={14} />}
                      </button>
                    ))}
                    <div className="my-1 border-t border-border" />
                    <input
                      type="text"
                      name="priceRange"
                      value={form.priceRange}
                      onChange={handleChange}
                      placeholder="직접 입력"
                      className="w-full rounded-xl px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted"
                    />
                  </div>
                )}
              </div>
              {errors.priceRange && (
                <p className="mt-1 text-xs text-red-500">{errors.priceRange}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-text">
              추천 이유
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="왜 이 선물이 좋은지 알려주세요"
              rows={4}
              className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                errors.content ? "border-red-400" : "border-border"
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content}</p>
            )}
          </div>

          {errors.server && (
            <p className="text-center text-sm text-red-500">{errors.server}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-text-muted transition-colors hover:text-primary"
              >
                <FiImage size={16} />
              </button>

              {previewUrl && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border">
                  <img
                    src={previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "등록 중..." : "답변 등록"}
            </button>
          </div>
        </form>
      </div>

      {showLoginModal && (
        <LikeLoginModal
          onClose={() => setShowLoginModal(false)}
          onGoLogin={() => navigate(ROUTES.LOGIN)}
        />
      )}
    </>
  );
};

export default AnswerForm;
