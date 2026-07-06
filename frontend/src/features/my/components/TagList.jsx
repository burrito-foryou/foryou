const TagList = ({ tagNames }) => (
  <div className="mb-2 flex flex-wrap gap-1">
    {tagNames.map((tag) => (
      <span key={tag} className="rounded-full bg-surface px-2 py-0.5 text-xs text-primary">
        #{tag}
      </span>
    ))}
  </div>
);

export default TagList;
