import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import MultiImageUploader from "../components/MultiImageUploader";
import { uploadProfileImage, uploadQuestionImage, deleteImage } from "../api/imageApi";

const TEST_QUESTION_ID = 1;

const ImageTestPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [multiImages, setMultiImages] = useState([]);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiError, setMultiError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadProfileImage(file);
      setUploadedImage(result);
    } catch (e) {
      setError("업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!uploadedImage) return;
    try {
      await deleteImage(uploadedImage.id);
      setUploadedImage(null);
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  const handleMultiUpload = async (file) => {
    setMultiLoading(true);
    setMultiError(null);
    try {
      const result = await uploadQuestionImage(TEST_QUESTION_ID, file);
      setMultiImages((prev) => [...prev, result]);
    } catch (e) {
      setMultiError("업로드에 실패했습니다.");
    } finally {
      setMultiLoading(false);
    }
  };

  const handleMultiDelete = async (index) => {
    const target = multiImages[index];
    if (!target) return;
    try {
      await deleteImage(target.id);
      setMultiImages((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-xl font-bold mb-6">단일 이미지 업로드 (프로필)</h1>
      <ImageUploader onUpload={handleUpload} onDelete={handleDelete} />
      {loading && <p className="text-sm text-blue-500 mt-2">업로드 중...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      {uploadedImage && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <p className="font-medium text-gray-700 mb-1">업로드 결과</p>
          <p className="text-gray-500 break-all">{uploadedImage.imageUrl}</p>
        </div>
      )}

      <hr className="my-6" />

      <h2 className="text-lg font-bold mb-4">다중 이미지 업로드 (질문)</h2>
      <MultiImageUploader onUpload={handleMultiUpload} onDelete={handleMultiDelete} />
      {multiLoading && <p className="text-sm text-blue-500 mt-2">업로드 중...</p>}
      {multiError && <p className="text-sm text-red-500 mt-2">{multiError}</p>}
      {multiImages.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm flex flex-col gap-1">
          <p className="font-medium text-gray-700 mb-1">업로드 결과 ({multiImages.length}장)</p>
          {multiImages.map((img, i) => (
            <p key={i} className="text-gray-500 break-all">{img.imageUrl}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageTestPage;
