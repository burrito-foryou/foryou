import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSliders } from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import useQuestionList from "../hooks/useQuestionList";
import { SORT_OPTIONS } from "../constants/questionConstants";
import { DUMMY } from "../constants/questionDummy";
import QuestionFilterModal from "../components/QuestionFilterModal";
import QuestionCard from "../components/QuestionCard";

// 현재 페이지 주변 번호 + 처음/끝 페이지 배열 계산 (... 포함)
const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages = new Set([0, total - 1]);
  for (let i = Math.max(0, current - 2); i <= Math.min(total - 1, current + 2); i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
};

const QuestionListPage = () => {
  const navigate = useNavigate();
  const {
    questions,
    filters,
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
  } = useQuestionList();
  const [showFilter, setShowFilter] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [onlyAccepted, setOnlyAccepted] = useState(false);
  const sortMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFilterEntries = useMemo(() => Object.entries(filters), [filters]);

  const filteredDummy = useMemo(
    () =>
      DUMMY.filter((q) =>
        activeFilterEntries.every(([key, value]) => q[key] === value),
      ),
    [activeFilterEntries],
  );

  const displayList = useMemo(() => {
    const base = questions.filter(
      (q) => !onlyAccepted || !!q.acceptedAnswerId,
    );
    return [...base].sort((a, b) => {
      if (sort === "likes") return b.likeCount - a.likeCount;
      if (sort === "answers") return b.answerCount - a.answerCount;
      if (sort === "views") return b.viewCount - a.viewCount;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [questions, filteredDummy, onlyAccepted, sort]);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "최신순";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* 1행: 타이틀 + 질문 작성 */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-text">질문 목록</h1>
        <button
          onClick={() => navigate(ROUTES.QUESTION_WRITE)}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover transition-colors"
        >
          + 질문 작성
        </button>
      </div>

      {/* 2행: 컨트롤 (항상 오른쪽 고정) */}
      <div className="mb-2 flex items-center justify-end gap-2">
        <button
          onClick={() => setOnlyAccepted((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            onlyAccepted
              ? "border-primary bg-primary-light text-primary"
              : "border-border text-text-muted hover:border-primary hover:text-primary"
          }`}
        >
          채택된 질문
        </button>

      </div>

      {/* 3행: 필터 버튼 + 활성 필터 칩 */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
        >
          <FiSliders size={14} /> 필터
        </button>
        <div className="relative" ref={sortMenuRef}>
          <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
          >
            <span className="whitespace-nowrap">{currentSortLabel}</span>{" "}
            <span>▾</span>
          </button>
          {showSortMenu && (
              <div className="absolute top-9 right-0 z-10 rounded-lg border border-border bg-background shadow-sm">
                {SORT_OPTIONS.map((o) => (
                    <button
                        key={o.value}
                        onClick={() => {
                          setSort(o.value);
                          setShowSortMenu(false);
                        }}
                        className={`block w-full whitespace-nowrap px-4 py-2 text-left text-sm hover:bg-surface ${sort === o.value ? "text-primary font-bold" : "text-text"}`}
                    >
                      {o.label}
                    </button>
                ))}
              </div>
          )}
        </div>
        {activeFilterEntries.map(([key, value]) => (
          <button
            key={key}
            onClick={() => removeFilter(key)}
            className="flex items-center gap-1 rounded-full bg-primary-light px-3 py-1.5 text-xs font-medium text-primary"
          >
            {value} <span>×</span>
          </button>
        ))}
        {activeFilterEntries.length > 0 && (
          <button
            onClick={() => applyFilters({})}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-gray-200 transition-colors"
          >
            모두 삭제 <span>×</span>
          </button>
        )}
      </div>

      <hr className="mb-5 border-border" />

      {/* 질문 카드 목록 */}
      {loading ? (
          <p className="text-center text-sm text-text-muted py-10">불러오는 중...</p>
      ) : displayList.length === 0 ? (
          <p className="text-center text-sm text-text-muted py-10">
            {keyword ? `"${keyword}" 검색 결과가 없습니다.` : "등록된 질문이 없습니다."}
          </p>
      ) : (
          <div className="flex flex-col gap-4">
            {displayList.map((q) => (
                <QuestionCard key={q.id} question={q} />
            ))}
          </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1">
            {/* 이전 버튼 */}
            <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>

            {/* 페이지 번호 */}
            {getPageNumbers(page, totalPages).map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-sm text-text-muted">
          …
        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                p === page
                                    ? "border-primary bg-primary text-white"
                                    : "border-border text-text-muted hover:border-primary hover:text-primary"
                            }`}
                        >
                          {p + 1}
                        </button>
                    ),
            )}

            {/* 다음 버튼 */}
            <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages - 1}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              ›
            </button>
          </div>
      )}

      {showFilter && (
        <QuestionFilterModal
          initialFilters={filters}
          onApply={applyFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
};

export default QuestionListPage;
