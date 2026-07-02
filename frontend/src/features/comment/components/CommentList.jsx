import useCommentList from "../hooks/useCommentList";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ answerId }) => {
  const { comments, loading, error, refetch } = useCommentList(answerId);

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-bold text-text-muted">
        댓글 <span className="text-primary">{loading ? "-" : comments.length}</span>
      </p>

      {loading && (
        <p className="py-2 text-xs text-text-muted">불러오는 중...</p>
      )}
      {error && (
        <p className="py-2 text-xs text-red-500">{error}</p>
      )}
      {!loading && !error && comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      <CommentForm answerId={answerId} onSuccess={refetch} />
    </div>
  );
};

export default CommentList;
