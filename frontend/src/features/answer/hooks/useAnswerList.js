import { useState, useEffect, useCallback } from "react";
import { getAnswers } from "../api/answerApi";

const useAnswerList = (questionId) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnswers = useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    try {
      const { data } = await getAnswers(questionId);
      setAnswers(data.data);
    } catch {
      setError("답변 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  return { answers, loading, error, refetch: fetchAnswers };
};

export default useAnswerList;
