import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiGift, FiImage, FiX } from "react-icons/fi";
import useAnswerItem from "../hooks/useAnswerItem";
import CommentList from "../../comment/components/CommentList";
import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import Avatar from "../../../shared/components/Avatar";
import timeAgo from "../../../shared/utils/timeAgo";
import { getAnswerImages, deleteImage } from "../../image/api/imageApi";

const EDIT_FIELDS = [
  { label: "선물 이름", name: "giftName", placeholder: "예) 조말론 향수" },
  { label: "가격대", name: "priceRange", placeholder: "예) 5만원~10만원" },
];

const AnswerItem = ({
  answer,
  onSuccess,
  questionMemberId,
  hasAcceptedAnswer,
}) => {
  const {
    giftName,
    priceRange,
    content,
    accepted,
    memberNickname,
    memberProfileImageUrl,
    createdAt,
    likeCount,
  } = answer;
  const { ref: highlightRef, isTarget } = useScrollHighlight(
    "ANSWER",
    answer.id,
  );
  const {
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
  } = useAnswerItem(answer, onSuccess, questionMemberId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [images, setImages] = useState([]);
  const [pendingImage, setPendingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getAnswerImages(answer.id)
      .then(setImages)
      .catch(() => setImages([]));
  }, [answer.id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemovePendingImage = () => {
    URL.revokeObjectURL(previewUrl);
    setPendingImage(null);
    setPreviewUrl(null);
  };

  const handleRemoveExistingImage = async (imageId) => {
    try {
      await deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      // 삭제 실패는 무시
    }
  };

  const handleUpdateSubmit = async (e) => {
    await handleUpdate(e, pendingImage);
    setPendingImage(null);
    setPreviewUrl(null);
    getAnswerImages(answer.id)
      .then(setImages)
      .catch(() => {});
  };

  return (
    <>
      <div
        ref={highlightRef}
        className={`card p-7 transition-colors ${
          isTarget
            ? "border-primary ring-2 ring-primary"
            : accepted
              ? "border-primary"
              : ""
        }`}
      >
        {accepted && (
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-black text-white">
              <FiCheckCircle size={12} />
              채택된 답변
            </span>
            <LikeButton
              targetType="ANSWER"
              targetId={answer.id}
              initialLikeCount={likeCount}
            />
          </div>
        )}

        {isEditing ? (
          // WBS0411: 수정 폼
          <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {EDIT_FIELDS.map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="mb-1.5 block text-sm font-bold text-text">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-text">
                추천 이유
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-text">
                사진
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.originalName}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}

                {previewUrl && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
                    <img
                      src={previewUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePendingImage}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}

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
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-muted transition-colors hover:text-primary"
                >
                  <FiImage size={18} />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full px-5 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "수정 중..." : "수정"}
              </button>
            </div>
          </form>
        ) : (
          // 일반 보기
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div
                className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm ${
                  accepted ? "bg-primary-light" : "bg-surface-muted"
                }`}
              >
                <FiGift
                  size={16}
                  className={`shrink-0 -translate-y-px ${
                    accepted ? "text-text-primary" : "text-text-muted"
                  }`}
                />
                <span
                  className={`font-bold ${accepted ? "text-text-primary" : "text-text"}`}
                >
                  {giftName}
                </span>
                <span className="h-3.5 w-px shrink-0 bg-border" />
                <span
                  className={accepted ? "text-text-primary" : "text-text-muted"}
                >
                  {priceRange}
                </span>
              </div>

              {!accepted && (
                <div className="flex shrink-0 items-center gap-3">
                  <LikeButton
                    targetType="ANSWER"
                    targetId={answer.id}
                    initialLikeCount={likeCount}
                  />
                  {/* WBS0413: 질문 작성자에게만 채택 버튼 노출 */}
                  {isQuestionAuthor && !hasAcceptedAnswer && (
                    <button
                      onClick={() => setShowAcceptModal(true)}
                      className="flex items-center gap-1 rounded-full border border-primary px-4 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary-light"
                    >
                      <FiCheckCircle size={14} />
                      채택하기
                    </button>
                  )}
                  {/* WBS0411/0412: 작성자에게만 수정/삭제 버튼 노출 */}
                  {isAuthor && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-bold text-text-muted/60 transition-colors hover:text-primary"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm font-bold text-text-muted/60 transition-colors hover:text-red-500"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-text">{content}</p>

            {images.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {images.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt={img.originalName}
                    className="h-24 w-24 rounded-xl border border-border object-cover"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Avatar
                src={memberProfileImageUrl}
                name={memberNickname}
                size={28}
                textSize="text-xs"
              />
              <p className="text-sm font-bold text-text">{memberNickname}</p>
              <span className="text-xs text-text-muted">
                · {timeAgo(createdAt)}
              </span>
            </div>
          </>
        )}

        {/* WBS0508: 댓글 목록 + 작성 폼 */}
        <CommentList answerId={answer.id} />
      </div>

      {showDeleteModal && (
        <ConfirmModal
          message="답변을 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={() => {
            setShowDeleteModal(false);
            handleDelete();
          }}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {showAcceptModal && (
        <ConfirmModal
          message="이 답변을 채택하시겠습니까? 채택 후에는 변경할 수 없습니다."
          confirmText="채택하기"
          onConfirm={() => {
            setShowAcceptModal(false);
            handleAccept();
          }}
          onClose={() => setShowAcceptModal(false)}
        />
      )}
    </>
  );
};

export default AnswerItem;
