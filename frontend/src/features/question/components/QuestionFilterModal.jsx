import { useState } from "react";
import { FILTER_OPTIONS, FILTER_LABELS } from "../constants/questionConstants";

const QuestionFilterModal = ({ initialFilters, onApply, onClose }) => {
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const toggleTempFilter = (key, value) => {
    setTempFilters((prev) =>
      prev[key] === value
        ? (() => { const next = { ...prev }; delete next[key]; return next; })()
        : { ...prev, [key]: value }
    );
  };

  const reset = () => setTempFilters({});

  const apply = () => {
    onApply(tempFilters);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-background p-5 mx-4 max-h-[85vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-bold text-text">필터</p>
          <button onClick={onClose} className="text-text-muted">✕</button>
        </div>

        {/* 선택된 칩 */}
        {Object.entries(tempFilters).length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 border-b border-border pb-4">
            {Object.entries(tempFilters).map(([key, value]) => (
              <button
                key={key}
                onClick={() => toggleTempFilter(key, value)}
                className="flex items-center gap-1.5 rounded-full bg-primary-light px-4 py-1.5 text-sm font-medium text-primary"
              >
                {value} ×
              </button>
            ))}
          </div>
        )}

        {/* 필터 섹션 */}
        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-4">
          {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
            <div key={key}>
              <p className="mb-2 text-xs text-text-muted">{FILTER_LABELS[key]}</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleTempFilter(key, opt)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      tempFilters[key] === opt
                        ? "border-primary bg-primary-light text-primary font-medium"
                        : "border-border text-text-muted hover:border-primary"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-4 flex gap-3 border-t border-border pt-4">
          <button
            onClick={reset}
            className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-bold text-text-muted hover:border-primary hover:text-primary transition-colors"
          >
            초기화
          </button>
          <button
            onClick={apply}
            className="flex-[2] rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-hover"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilterModal;
