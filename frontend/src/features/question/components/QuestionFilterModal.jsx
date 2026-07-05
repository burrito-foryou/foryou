import { useState } from "react";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { FILTER_OPTIONS, FILTER_LABELS } from "../constants/questionConstants";

const QuestionFilterModal = ({ initialFilters, onApply, onClose }) => {
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const toggleTempFilter = (key, value) => {
    setTempFilters((prev) =>
      prev[key] === value
        ? (() => {
            const next = { ...prev };
            delete next[key];
            return next;
          })()
        : { ...prev, [key]: value },
    );
  };

  const reset = () => setTempFilters({});

  const apply = () => {
    onApply(tempFilters);
    onClose();
  };

  const filterCount = Object.keys(tempFilters).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-background shadow-soft">
        {/* 헤더 (고정) */}
        <div className="flex items-center justify-between p-7 pb-6">
          <p className="text-2xl font-black text-text">필터</p>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-text-muted transition-colors hover:text-text"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* 필터 섹션 (스크롤) */}
        <div className="flex-1 overflow-y-auto px-7">
          <div className="flex flex-col gap-6">
            {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
              <div key={key}>
                <p className="mb-3 text-sm font-bold text-text/75">
                  {FILTER_LABELS[key]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleTempFilter(key, opt)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                        tempFilters[key] === opt
                          ? "bg-primary text-white"
                          : "border border-border bg-white text-text/75 hover:border-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 (고정) */}
        <div className="flex gap-3 border-t border-border p-7 pt-6">
          <button
            onClick={reset}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <FiRefreshCw size={14} />
            초기화
          </button>
          <button onClick={apply} className="btn btn-primary flex-1">
            {filterCount > 0
              ? `${filterCount}개 필터 적용하기`
              : "필터 적용하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilterModal;
