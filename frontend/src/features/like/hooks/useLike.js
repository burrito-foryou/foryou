import { useEffect, useState } from "react";
import { addLike, cancelLike, getLikeStatus } from "../api/likeApi";
import useAuthStore from "../../auth/store/authStore";

const useLike = (targetType, targetId, initialLikeCount) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return; // 비로그인 시 좋아요 불가
    getLikeStatus(targetType, targetId).then((data) => setLiked(data.liked));
  }, [targetType, targetId, token]);

  // 좋아요 등록/취소 낙관적 업데이트
  const toggleLike = async () => {
    const prevLiked = liked; // 롤백할 수 있게 이전 값 저장
    const prevCount = likeCount; 
    setLiked(!prevLiked); // 서버 응답 오기 전 화면 변경 (즉시 반응)
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const response = prevLiked
        ? await cancelLike(targetType, targetId)
        : await addLike(targetType, targetId);
      setLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (error) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      console.error(error);
    }
  };

  return { liked, likeCount, toggleLike };
};

export default useLike;