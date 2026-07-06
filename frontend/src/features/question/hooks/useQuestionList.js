import { useState, useEffect } from "react";
import { getQuestions } from "../api/questionApi";
import { useSearchParams } from "react-router-dom";
import useMemberId from "./useMemberId";

const FILTER_KEYS = ["target", "gender", "ageGroup", "budget", "situation", "giftType"];

const readFiltersFromParams = (params) => {
  const result = {};
  FILTER_KEYS.forEach((key) => {
    const val = params.get(key);
    if (val) result[key] = val;
  });
  return result;
};

const useQuestionList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const memberId = useMemberId();
  const [questions, setQuestions] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [tagSearch, setTagSearch] = useState(searchParams.get("tag") ?? "");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [debouncedTagSearch, setDebouncedTagSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const sort = searchParams.get("sort") ?? "latest";
  const acceptedOnly = searchParams.get("acceptedOnly") === "true";
  const filters = readFiltersFromParams(searchParams);

  const updateParams = (updates, resetPage = false) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === undefined) p.delete(k);
        else p.set(k, String(v));
      });
      if (resetPage) p.set("page", "0");
      return p;
    }, { replace: true });
  };

  const setPage = (value) => {
    const next = typeof value === "function" ? value(page) : value;
    updateParams({ page: next });
  };

  const setSort = (value) => updateParams({ sort: value }, true);

  const setAcceptedOnly = (value) =>
    updateParams({ acceptedOnly: value ? "true" : null }, true);

  const applyFilters = (newFilters) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      FILTER_KEYS.forEach((key) => p.delete(key));
      Object.entries(newFilters).forEach(([k, v]) => p.set(k, v));
      p.set("page", "0");
      return p;
    }, { replace: true });
  };

  const removeFilter = (key) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete(key);
      p.set("page", "0");
      return p;
    }, { replace: true });
  };

  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
    setTagSearch(searchParams.get("tag") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setDebouncedTagSearch(tagSearch);
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
          ...(debouncedKeyword && { keyword: debouncedKeyword }),
          ...(debouncedTagSearch && { tagName: debouncedTagSearch }),
          ...(memberId && { memberId }),
          ...(acceptedOnly && { acceptedOnly: true }),
        };
        const data = await getQuestions(params);
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
  }, [
    JSON.stringify(filters),
    acceptedOnly,
    sort,
    page,
    debouncedKeyword,
    debouncedTagSearch,
    memberId,
  ]);

  return {
    questions,
    filters,
    acceptedOnly,
    setAcceptedOnly,
    sort,
    setSort,
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
