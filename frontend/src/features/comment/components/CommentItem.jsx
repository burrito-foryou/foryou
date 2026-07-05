import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import useCommentItem from "../hooks/useCommentItem";
import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import Avatar from "../../../shared/components/Avatar";
import timeAgo from "../../../shared/utils/timeAgo";

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
        className={`flex flex-col border-t border-border/40 py-2 transition-colors first:border-t-0 ${
          isTarget ? "rounded-lg bg-primary-light px-2" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar
              src={comment.memberProfileImageUrl}
              name={comment.memberNickname}
              size={24}
              textSize="text-[11px]"
            />
            <p className="text-sm font-bold text-text">
              {comment.memberNickname}
            </p>
            <span className="text-xs text-text-muted">
              · {timeAgo(createdAt)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <LikeButton
              targetType="COMMENT"
              targetId={id}
              initialLikeCount={likeCount}
            />
            {/* WBS0509/0510: 작성자에게만 수정/삭제 버튼 노출 */}
            {isAuthor && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-text-muted/60 transition-colors hover:text-primary"
                >
                  수정
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                  className="text-xs font-bold text-text-muted/60 transition-colors hover:text-red-500 disabled:opacity-50"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          // WBS0509: 수정 폼
          <form onSubmit={handleUpdate} className="flex flex-col gap-2">
            <textarea
              value={content}
              onChange={handleChange}
              rows={2}
              maxLength={50}
              className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
            <div className="flex items-center justify-between">
              <span
                className={`text-xs ${content.length >= 50 ? "text-red-500" : "text-text-muted"}`}
              >
                {content.length} / 50
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full px-4 py-1.5 text-xs font-bold text-text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                >
                  {loading ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <p className="pl-8 text-sm leading-relaxed text-text">{content}</p>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmModal
          icon={FiTrash2}
          variant="danger"
          title="댓글을 삭제할까요?"
          message="삭제한 댓글은 복구할 수 없어요."
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
