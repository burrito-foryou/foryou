import useCommentForm from "../hooks/useCommentForm";

const CommentForm = ({ answerId, onSuccess }) => {
  const { content, error, loading, handleChange, handleSubmit } = useCommentForm(
    answerId,
    onSuccess,
  );

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="댓글을 입력하세요."
        rows={2}
        className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
