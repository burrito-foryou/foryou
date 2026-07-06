import { useState, useEffect } from "react";
import { getQuestions } from "../api/questionApi";
import { useSearchParams } from "react-router-dom";
import useMemberId from "./useMemberId";

const useQuestionList = () => {
  const [searchParams] = useSearchParams();
  const memberId = useMemberId();
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({});
  const [acceptedOnly, setAcceptedOnlyState] = useState(false);
  const [sort, setSort] = useState("latest");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [tagSearch, setTagSearch] = useState(searchParams.get("tag") ?? "");
  const [debouncedTagSearch, setDebouncedTagSearch] = useState(""); // 태그 검색 API 호출용
  const [debouncedKeyword, setDebouncedKeyword] = useState(""); // 실제 API 호출용
  const [page, setPage] = useState(0); // 현재 페이지 (0-indexed)
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // questions 페이지에 있을 때도 검색 동작
  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
    setTagSearch(searchParams.get("tag") ?? "");
  }, [searchParams]);

  // 검색어 입력 후 300ms 뒤 API 호출 (입력할 때마다 호출 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setDebouncedTagSearch(tagSearch); // tagSearch도 debounce 적용
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, tagSearch]);

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
          ...(debouncedTagSearch && { tagName: debouncedTagSearch }),
          ...(memberId && { memberId }), // 로그인 시 북마크 상태 포함
          ...(acceptedOnly && { acceptedOnly: true }),
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
    // debouncedTagSearch 추가 — 태그 검색어 변경 시 재호출
  }, [
    filters,
    acceptedOnly,
    sort,
    page,
    debouncedKeyword,
    debouncedTagSearch,
    memberId,
  ]);

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

  const setAcceptedOnly = (value) => {
    setAcceptedOnlyState(value);
    setPage(0);
  };

  return {
    questions,
    filters,
    acceptedOnly,
    setAcceptedOnly,
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
    tagSearch,
  };
};

export default useQuestionList;
