import { useState, useEffect } from "react";
import { getQuestions } from "../api/questionApi";

const useQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(0);         // 현재 페이지 (0-indexed)
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { ...filters, sort, page, size: 10 };
        const data = await getQuestions(params);
        // 백엔드 응답: Page<QuestionResponse> → content가 질문 배열
        setQuestions(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (e) {
        setError("질문 목록을 불러오지 못했습니다.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters, sort, page]);

  // 필터/정렬 변경 시 항상 첫 페이지로 초기화
  const removeFilter = (key) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPage(0);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleSetSort = (newSort) => {
    setSort(newSort);
    setPage(0);
  };

  return {
    questions,
    filters,
    sort,
    setSort: handleSetSort,
    page,
    setPage,
    totalPages,
    removeFilter,
    applyFilters,
    loading,
    error,
  };
};

export default useQuestionList;