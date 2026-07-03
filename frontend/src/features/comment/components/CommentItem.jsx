import { useState } from "react";
import useCommentItem from "../hooks/useCommentItem";
import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";
import ConfirmModal from "../../../shared/components/ConfirmModal";

const CommentItem = ({ comment, onSuccess }) => {
  const { id, createdAt, likeCount } = comment;
  const { ref: highlightRef, isTarget } = useScrollHighlight("COMMENT", id);
  const {
    isEditing,
    setIsEditing,
    content,
    loading,
    isAuthor,
    handleChange,
    handleUpdate,
    handleDelete,
  } = useCommentItem(comment, onSuccess);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div
        ref={highlightRef}
        className={`flex flex-col gap-1 border-t border-border py-3 transition-colors ${
          isTarget ? "rounded-lg bg-primary-light px-2" : ""
        }`}
      >
        {isEditing ? (
          // WBS0509: 수정 폼
          <form onSubmit={handleUpdate} className="flex flex-col gap-2">
            <textarea
              value={content}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-border px-3 py-1 text-xs text-text-muted hover:bg-surface"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-white hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        ) : (
          // 일반 보기
          <>
            <p className="text-sm leading-relaxed text-text">{content}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">
                {comment.memberNickname} · {new Date(createdAt).toLocaleDateString("ko-KR")}
              </p>
              <div className="flex items-center gap-3">
                <LikeButton targetType="COMMENT" targetId={id} initialLikeCount={likeCount} />
                {/* WBS0509/0510: 작성자에게만 수정/삭제 버튼 노출 */}
                {isAuthor && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-text-muted hover:text-primary"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={loading}
                      className="text-xs text-text-muted hover:text-red-500 disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmModal
          message="댓글을 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={() => {
            setShowDeleteModal(false);
            handleDelete();
          }}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default CommentItem;
