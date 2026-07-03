import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

// 알림 클릭으로 이동했을 때 해당 요소로 스크롤 + 하이라이트
const useScrollHighlight = (targetType, targetId) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ref = useRef(null);

  const isTarget =
    searchParams.get("targetType") === targetType &&
    searchParams.get("targetId") === String(targetId);

  useEffect(() => {
    if (isTarget && ref.current) { // ref.current: 실제 DOM 요소 렌더링된 상태
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setSearchParams({}, { replace: true }); // 새로고침 시 재발동 방지
    }
  }, [isTarget]);

  return { ref, isTarget };
};

export default useScrollHighlight;
