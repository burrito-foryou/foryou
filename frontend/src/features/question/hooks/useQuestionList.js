import { useState, useEffect } from "react";
import { getQuestions } from "../api/questionApi";
import { useSearchParams } from "react-router-dom";

const useQuestionList = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("latest");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(""); // 실제 API 호출용
  const [page, setPage] = useState(0);         // 현재 페이지 (0-indexed)
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // questions 페이지에 있을 때도 검색 동작
  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
  }, [searchParams]);

  // 검색어 입력 후 300ms 뒤 API 호출 (입력할 때마다 호출 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          ...filters,
          sort,
          page,
          size: 10,
          ...(debouncedKeyword && { keyword: debouncedKeyword }), // 빈 값이면 전송 안 함
        };
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
  }, [filters, sort, page, debouncedKeyword]);

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
    keyword,
    setKeyword,
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