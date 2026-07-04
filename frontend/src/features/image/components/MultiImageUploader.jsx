import { useState, useEffect, useRef } from "react";

const MAX_COUNT = 5;

const MultiImageUploader = ({ onUpload, onDelete, maxSize = 5, maxCount = MAX_COUNT, initialImages = [] }) => {
    const [previews, setPreviews] = useState([]);
  useEffect(() => {
    if (initialImages.length > 0) {
      setPreviews(
          initialImages.map((img) => ({
            url: img.imageUrl,
            name: String(img.id),
            existingId: img.id,
          }))
      );
    }
  }, [initialImages]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError(null);

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const remaining = maxCount - previews.length;

    if (files.length > remaining) {
      setError(`최대 ${maxCount}장까지 첨부 가능합니다.`);
      return;
    }

    const invalid = files.find((f) => !allowedTypes.includes(f.type));
    if (invalid) {
      setError("jpg, jpeg, png, webp 파일만 업로드 가능합니다.");
      return;
    }

    const oversize = files.find((f) => f.size > maxSize * 1024 * 1024);
    if (oversize) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    files.forEach((file) => onUpload?.(file));

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = (index) => {
    const target = previews[index];
    if (!target.existingId) URL.revokeObjectURL(target.url);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onDelete?.(index, target.file ?? null, target.existingId ?? null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {previews.map((item, index) => (
          <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {previews.length < maxCount && (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs text-gray-400">{previews.length}/{maxCount}</span>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">jpg, jpeg, png, webp · 최대 {maxSize}MB · 최대 {maxCount}장</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MultiImageUploader;
