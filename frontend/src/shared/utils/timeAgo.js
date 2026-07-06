const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date) / 1000 / 60);

  if (diff < 1) return "방금 전";
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  if (diff < 10080) return `${Math.floor(diff / 1440)}일 전`;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const isSameYear = date.getFullYear() === new Date().getFullYear();

  return isSameYear ? `${month}.${day}` : `${date.getFullYear()}.${month}.${day}`;
};

export default timeAgo;
