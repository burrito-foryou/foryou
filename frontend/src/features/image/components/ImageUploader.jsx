import { useState, useRef } from "react";

const ImageUploader = ({ onUpload, onDelete, maxSize = 5 }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("jpg, jpeg, png, webp 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onUpload?.(file);
  };

  const handleDelete = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onDelete?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm text-gray-500">클릭하여 이미지 선택</p>
          <p className="text-xs text-gray-400 mt-1">jpg, jpeg, png, webp · 최대 {maxSize}MB</p>
        </div>
      ) : (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
          <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs px-3 py-1 truncate">
            {fileName}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
