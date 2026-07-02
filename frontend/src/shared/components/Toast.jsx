const Toast = ({ toast }) => {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition-all ${
        isSuccess ? "bg-gray-800" : "bg-error"
      }`}
    >
      <span>{isSuccess ? "✓" : "✕"}</span>
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
