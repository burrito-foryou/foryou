import { useState, useEffect, useRef } from "react";
import { FiImage, FiX } from "react-icons/fi";

const MAX_COUNT = 5;

const MultiImageUploader = ({
  onUpload,
  onDelete,
  maxSize = 5,
  maxCount = MAX_COUNT,
  initialImages = [],
}) => {
  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    if (initialImages.length > 0) {
      setPreviews(
        initialImages.map((img) => ({
          url: img.imageUrl,
          name: String(img.id),
          existingId: img.id,
        })),
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
          <div
            key={index}
            className="relative h-24 w-24 overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={item.url}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}

        {previews.length < maxCount && (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border text-text-muted transition-colors hover:border-primary hover:bg-primary-light hover:text-primary cursor-pointer"
          >
            <FiImage size={22} />
            <span className="text-xs font-semibold">
              {previews.length}/{maxCount}
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-text-muted">
        jpg, jpeg, png, webp · 최대 {maxSize}MB · 최대 {maxCount}장
      </p>

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
