import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 알림 클릭 등으로 특정 답변/댓글로 스크롤 이동하는 경우엔
    // useScrollHighlight가 스크롤을 담당하므로 여기서 top으로 리셋하지 않는다.
    const params = new URLSearchParams(search);
    if (params.get("targetType") && params.get("targetId")) return;

    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
