import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";

const CommentItem = ({ comment }) => {
  const { id, memberId, content, createdAt, likeCount } = comment;
  const { ref: highlightRef, isTarget } = useScrollHighlight("COMMENT", id);

  return (
    <div
      ref={highlightRef}
      className={`flex flex-col gap-1 border-t border-border py-3 transition-colors ${
        isTarget ? "rounded-lg bg-primary-light px-2" : ""
      }`}
    >
      <p className="text-sm leading-relaxed text-text">{content}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {memberId} · {new Date(createdAt).toLocaleDateString("ko-KR")}
        </p>
        <LikeButton targetType="COMMENT" targetId={id} initialLikeCount={likeCount} />
      </div>
    </div>
  );
};

export default CommentItem;
