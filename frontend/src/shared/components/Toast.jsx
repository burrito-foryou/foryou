import { useEffect, useState } from "react";

const Toast = ({ toast }) => {
  const [visible, setVisible] = useState(false);

  // toast가 생기면 visible을 true, 사라지면 false => opacity 트랜지션이 이걸 보고 fade 처리
  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
        isSuccess ? "bg-gray-800" : "bg-error"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <span>{isSuccess ? "✓" : "✕"}</span>
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
