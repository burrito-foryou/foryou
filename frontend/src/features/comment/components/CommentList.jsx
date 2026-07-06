import useCommentList from "../hooks/useCommentList";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ answerId }) => {
  const { comments, loading, error, refetch } = useCommentList(answerId);

  return (
    <div className="mt-4 rounded-2xl bg-surface-muted p-4">
      <p className="mb-3 text-sm font-black text-text">
        댓글{" "}
        <span
          className={comments.length > 0 ? "text-primary" : "text-text-muted"}
        >
          {loading ? "-" : comments.length}
        </span>
      </p>

      {loading && (
        <p className="py-2 text-xs text-text-muted">불러오는 중...</p>
      )}
      {error && <p className="py-2 text-xs text-red-500">{error}</p>}
      {!loading &&
        !error &&
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onSuccess={refetch} />
        ))}

      <CommentForm answerId={answerId} onSuccess={refetch} />
    </div>
  );
};

export default CommentList;
