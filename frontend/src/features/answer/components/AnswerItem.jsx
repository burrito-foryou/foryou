const AnswerItem = ({ answer }) => {
  const { giftName, priceRange, content, accepted, memberId, createdAt } = answer;

  return (
    <div
      className={`rounded-lg border bg-background p-5 ${
        accepted ? "border-primary" : "border-border"
      }`}
    >
      {accepted && (
        <span className="mb-3 inline-block rounded-full bg-primary-light px-3 py-0.5 text-xs font-bold text-primary">
          ✓ 채택된 답변
        </span>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-surface px-3 py-0.5 text-xs text-primary">
          🎁 {giftName}
        </span>
        <span className="rounded-full border border-border bg-surface px-3 py-0.5 text-xs text-text-muted">
          {priceRange}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-text">{content}</p>

      <p className="mt-3 text-xs text-text-muted">
        {memberId} · {new Date(createdAt).toLocaleDateString("ko-KR")}
      </p>
    </div>
  );
};

export default AnswerItem;
