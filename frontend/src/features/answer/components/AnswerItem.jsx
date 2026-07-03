import useAnswerItem from "../hooks/useAnswerItem";
import CommentList from "../../comment/components/CommentList";
import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";

const EDIT_FIELDS = [
  { label: "선물 이름", name: "giftName", placeholder: "예) 조말론 향수" },
  { label: "가격대", name: "priceRange", placeholder: "예) 5만원~10만원" },
];

const AnswerItem = ({ answer, onSuccess, questionMemberId }) => {
  const { giftName, priceRange, content, accepted, memberId, memberNickname, createdAt, likeCount } = answer;
  const { ref: highlightRef, isTarget } = useScrollHighlight("ANSWER", answer.id);
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

  return (
    <div
      ref={highlightRef}
      className={`rounded-lg border bg-background p-5 transition-colors ${
        isTarget ? "border-primary ring-2 ring-primary" : accepted ? "border-primary" : "border-border"
      }`}
    >
      {accepted && (
        <span className="mb-3 inline-block rounded-full bg-primary-light px-3 py-0.5 text-xs font-bold text-primary">
          ✓ 채택된 답변
        </span>
      )}

      {isEditing ? (
        // WBS0411: 수정 폼
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {EDIT_FIELDS.map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="mb-1 block text-xs text-text-muted">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">내용</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-border px-4 py-1.5 text-sm text-text-muted hover:bg-surface"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      ) : (
        // 일반 보기
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-surface px-3 py-0.5 text-xs text-primary">
              🎁 {giftName}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-0.5 text-xs text-text-muted">
              {priceRange}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-text">{content}</p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {memberNickname} · {new Date(createdAt).toLocaleDateString("ko-KR")}
            </p>
            <div className="flex items-center gap-3">
              <LikeButton
                targetType="ANSWER"
                targetId={answer.id}
                initialLikeCount={likeCount}
              />
              {/* WBS0413: 질문 작성자에게만 채택 버튼 노출 */}
              {isQuestionAuthor && !accepted && (
                <button
                  onClick={handleAccept}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  채택하기
                </button>
              )}
              {/* WBS0411/0412: 작성자에게만 수정/삭제 버튼 노출 */}
              {isAuthor && !accepted && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-text-muted hover:text-primary"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs text-text-muted hover:text-red-500"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* WBS0508: 댓글 목록 + 작성 폼 */}
      <CommentList answerId={answer.id} />
    </div>
  );
};

export default AnswerItem;
