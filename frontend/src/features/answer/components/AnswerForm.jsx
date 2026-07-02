import useAnswerForm from "../hooks/useAnswerForm";

const FIELDS = [
  { label: "선물 이름", name: "giftName", placeholder: "예) 조말론 향수" },
  { label: "가격대", name: "priceRange", placeholder: "예) 5만원~10만원" },
];

const AnswerForm = ({ questionId, onSuccess }) => {
  const { form, errors, loading, handleChange, handleSubmit } = useAnswerForm(
    questionId,
    onSuccess,
  );

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="mb-4 text-sm font-bold text-text">답변 작성</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="mb-1 block text-xs text-text-muted">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary ${
                  errors[name] ? "border-red-400" : "border-border"
                }`}
              />
              {errors[name] && (
                <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs text-text-muted">내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="추천 이유를 작성해 주세요"
            rows={4}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary ${
              errors.content ? "border-red-400" : "border-border"
            }`}
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-500">{errors.content}</p>
          )}
        </div>

        {errors.server && (
          <p className="text-center text-sm text-red-500">{errors.server}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
