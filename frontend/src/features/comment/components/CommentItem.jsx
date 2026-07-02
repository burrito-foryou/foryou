import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";

const CommentItem = ({ comment }) => {
  const { id, memberId, content, createdAt } = comment;
  const { ref: highlightRef, isTarget } = useScrollHighlight("COMMENT", id);

  return (
    <div
      ref={highlightRef}
      className={`flex flex-col gap-1 border-t border-border py-3 transition-colors ${
        isTarget ? "rounded-lg bg-primary-light px-2" : ""
      }`}
    >
      <p className="text-sm leading-relaxed text-text">{content}</p>
      <p className="text-xs text-text-muted">
        {memberId} · {new Date(createdAt).toLocaleDateString("ko-KR")}
      </p>
    </div>
  );
};

export default CommentItem;
