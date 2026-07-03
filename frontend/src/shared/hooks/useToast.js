import { useState, useCallback, useRef } from "react";

const useToast = () => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current); // showToast가 다시 호출될 때 이전에 저장해둔 타이머 ID로 clearTimeout호출해서 취소
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 2500);
  }, []);

  return { toast, showToast };
};

export default useToast;
