const CommentItem = ({ comment }) => {
  const { memberId, content, createdAt } = comment;

  return (
    <div className="flex flex-col gap-1 border-t border-border py-3">
      <p className="text-sm leading-relaxed text-text">{content}</p>
      <p className="text-xs text-text-muted">
        {memberId} · {new Date(createdAt).toLocaleDateString("ko-KR")}
      </p>
    </div>
  );
};

export default CommentItem;
