import { useEffect, useState } from "react";
import { getLikeStatus } from "../api/likeApi";

// WBS6.10: 좋아요 상태 표시 - mount 시 서버에서 liked 여부 조회
const useLike = (targetType, targetId) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    getLikeStatus(targetType, targetId).then((data) => setLiked(data.liked));
  }, [targetType, targetId]);

  return { liked, setLiked };
};

export default useLike;