import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSliders, FiEdit3, FiCheck, FiChevronDown } from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import useQuestionList from "../hooks/useQuestionList";
import useAuthStore from "../../../features/auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";
import { SORT_OPTIONS } from "../constants/questionConstants";
import QuestionFilterModal from "../components/QuestionFilterModal";
import QuestionCard from "../components/QuestionCard";

// 현재 페이지 주변 번호 + 처음/끝 페이지 배열 계산 (... 포함)
const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages = new Set([0, total - 1]);
  for (
    let i = Math.max(0, current - 2);
    i <= Math.min(total - 1, current + 2);
    i++
  ) {
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
    acceptedOnly,
    setAcceptedOnly,
    sort,
    setSort,
    keyword,
    page,
    setPage,
    totalPages,
    removeFilter,
    applyFilters,
    loading,
    tagSearch,
  } = useQuestionList();
  const [showFilter, setShowFilter] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef(null);
  const token = useAuthStore((state) => state.token);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFilterCount = Object.keys(filters).length;
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "최신순";

  const handleWriteClick = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    navigate(ROUTES.QUESTION_WRITE);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* 타이틀 + 질문 작성 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text">질문 목록</h1>
          <p className="mt-1 text-sm text-text-muted">
            다양한 선물 고민을 둘러보고 답변을 남겨보세요
          </p>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
        >
          <FiEdit3 size={15} />
          질문 작성
        </button>
      </div>

      {/* 필터 + 정렬 */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-bold text-text transition-colors hover:border-primary hover:text-primary"
        >
          <FiSliders size={14} /> 필터
        </button>

        <div className="relative" ref={sortMenuRef}>
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-bold text-text transition-colors hover:border-primary hover:text-primary"
          >
            <span className="whitespace-nowrap">{currentSortLabel}</span>
            <FiChevronDown
              size={14}
              className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`}
            />
          </button>
          {showSortMenu && (
            <div className="absolute left-0 top-11 z-10 w-36 rounded-2xl border border-border bg-background p-1.5 shadow-soft">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    setSort(o.value);
                    setShowSortMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-bold transition-colors hover:bg-surface ${
                    sort === o.value ? "text-primary" : "text-text"
                  }`}
                >
                  {o.label}
                  {sort === o.value && <FiCheck size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setAcceptedOnly(!acceptedOnly)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            acceptedOnly
              ? "border border-secondary bg-primary-light text-text-primary"
              : "border border-border text-text hover:border-primary"
          }`}
        >
          {acceptedOnly && <FiCheck size={14} />}
          채택된 질문만
        </button>

        {Object.entries(filters).map(([key, value]) => (
          <button
            key={key}
            onClick={() => removeFilter(key)}
            className="flex items-center gap-1 rounded-full border border-secondary bg-primary-light px-3 py-1.5 text-xs font-bold text-primary"
          >
            {value} <span>×</span>
          </button>
        ))}

        {activeFilterCount > 0 && (
          <button
            onClick={() => applyFilters({})}
            className="ml-auto text-xs font-semibold text-text-muted hover:text-text"
          >
            적용된 필터 {activeFilterCount}개 · 초기화
          </button>
        )}
      </div>

      {/* 질문 카드 목록 */}
      {loading ? (
        <p className="py-10 text-center text-sm text-text-muted">
          불러오는 중...
        </p>
      ) : questions.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">
          {tagSearch
            ? `"#${tagSearch}" 태그 검색 결과가 없습니다.`
            : keyword
              ? `"${keyword}" 검색 결과가 없습니다.`
              : "등록된 질문이 없습니다."}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 text-sm text-text-muted"
              >
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
      {showLoginModal && (
        <LikeLoginModal
          onGoLogin={() => navigate(ROUTES.LOGIN)}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default QuestionListPage;
