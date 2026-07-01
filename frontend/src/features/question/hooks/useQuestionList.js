import { useState, useEffect } from "react";
import { getQuestions } from "../api/questionApi";

const useQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { ...filters, sort, page: 0, size: 10 };
        const data = await getQuestions(params);
        // 백엔드 응답: Page<QuestionResponse> → data.content가 질문 배열
        setQuestions(data.content ?? []);
      } catch (e) {
        setError("질문 목록을 불러오지 못했습니다.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters, sort]);

  const removeFilter = (key) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const applyFilters = (newFilters) => setFilters(newFilters);

  return {
    questions,
    filters,
    sort,
    setSort,
    removeFilter,
    applyFilters,
    loading,
    error,
  };
};

export default useQuestionList;
