import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const prevPathnameRef = useRef(pathname); // 직전 렌더의 pathname
  const prevHadTargetRef = useRef(false); // 직전 렌더에 target 쿼리 존재 여부

  useEffect(() => {
    // 알림 클릭 등으로 특정 답변/댓글로 스크롤 이동하는 경우엔
    // useScrollHighlight가 스크롤을 담당하므로 여기서 top으로 리셋하지 않는다.
    const params = new URLSearchParams(search);
    const hasTarget = Boolean(
      params.get("targetType") && params.get("targetId"),
    );
    
    const isSamePathname = prevPathnameRef.current === pathname; // pathname 직전과 동일
    // useScrollHighlight가 쿼리 지운 렌더만 스킵 대상
    const isTargetClearedRender =
      isSamePathname && !hasTarget && prevHadTargetRef.current; // 지금 target X, 직전엔 target O
    
    prevPathnameRef.current = pathname;
    prevHadTargetRef.current = hasTarget;

    if (hasTarget || isTargetClearedRender) return;

    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
