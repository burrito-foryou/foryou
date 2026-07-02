import { useState, useEffect, useCallback } from "react";
import { getComments } from "../api/commentApi";

const useCommentList = (answerId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getComments(answerId);
      setComments(res.data.data);
    } catch {
      setError("댓글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [answerId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
};

export default useCommentList;
