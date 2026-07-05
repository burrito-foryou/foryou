import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";
import {
  getQuestionDetail,
  updateQuestion,
  getQuestionImages,
} from "../api/questionApi";
import { uploadQuestionImage, deleteImage } from "../../image/api/imageApi";
import { getTags } from "../api/tagApi";
import MultiImageUploader from "../../image/components/MultiImageUploader";
import useMemberId from "../hooks/useMemberId";

// 태그 타입 → 한글 라벨 매핑 (BE TagType enum 기준)
const TAG_TYPE_LABELS = {
  TARGET: "대상",
  GENDER: "성별",
  AGE_GROUP: "나이대",
  BUDGET: "예산",
  SITUATION: "상황",
  GIFT_TYPE: "카테고리",
};

// 화면에 노출할 태그 타입 순서
const TAG_TYPE_ORDER = [
  "TARGET",
  "GENDER",
  "AGE_GROUP",
  "BUDGET",
  "SITUATION",
  "GIFT_TYPE",
];

// 필수는 아니지만 채워두면 더 정확한 답변을 받을 수 있는 태그 타입
const RECOMMENDED_TAG_TYPES = new Set(["TARGET", "BUDGET"]);

const QuestionEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memberId = useMemberId();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagsByType, setTagsByType] = useState({});
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [question, setQuestion] = useState(null);
  // 기존 질문 데이터 + 전체 태그 목록 동시 조회
  useEffect(() => {
    const init = async () => {
      try {
        const [question, tags, images] = await Promise.all([
          getQuestionDetail(id),
          getTags(),
          getQuestionImages(id),
        ]);
        setExistingImages(images ?? []);
        setQuestion(question);
        // 기존 데이터로 폼 초기값 세팅
        setTitle(question.title);
        setContent(question.content);
        setSelectedTagIds(question.tags.map((t) => t.id));

        // 태그 타입별 그룹핑
        const grouped = tags.reduce((acc, tag) => {
          if (!acc[tag.type]) acc[tag.type] = [];
          acc[tag.type].push(tag);
          return acc;
        }, {});
        setTagsByType(grouped);
      } catch {
        setError("질문 정보를 불러오지 못했습니다.");
      } finally {
        setInitLoading(false);
      }
    };
    init();
  }, [id]);

  // 태그 선택/해제 토글
  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((i) => i !== tagId) : [...prev, tagId],
    );
  };
  // 채택된 질문이면 수정 페이지 접근 차단 — 상세 페이지로 리다이렉트
  useEffect(() => {
    if (!initLoading && question?.acceptedAnswerId) {
      navigate(toQuestionDetail(id), { replace: true });
    }
  }, [initLoading, question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateQuestion(id, memberId, {
        title: title.trim(),
        content: content.trim(),
        tagIds: selectedTagIds,
      });
      try {
        await Promise.all([
          ...deletedImageIds.map((imgId) => deleteImage(imgId)),
          ...pendingFiles.map((file) => uploadQuestionImage(id, file)),
        ]);
      } catch {
        console.warn("이미지 처리 실패 - 질문 수정은 완료됨");
      }
      // 수정 완료 후 상세 페이지로 이동
      // `/questions/${id}` => toQuestionDetail(id)
      navigate(toQuestionDetail(id));
    } catch {
      setError("수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="py-20 text-center text-sm text-text-muted">
        불러오는 중...
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="py-20 text-center text-sm text-text-muted">{error}</div>
    );
  }

  const tagTypes = TAG_TYPE_ORDER.filter((type) => tagsByType[type]?.length);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* 헤더 */}
      {/* `/questions/${id}` => toQuestionDetail(id) */}
      <button
        onClick={() => navigate(toQuestionDetail(id))}
        className="mb-6 flex items-center gap-1.5 text-sm font-bold text-text-muted transition-colors hover:text-text"
      >
        <FiArrowLeft size={16} />
        질문으로
      </button>

      <h1 className="mb-2 text-3xl font-black text-text">질문 수정하기</h1>
      <p className="mb-8 text-sm text-text-muted">
        내용을 다듬어 더 정확한 답변을 받아보세요
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 태그 선택 */}
        <div className="card p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-black text-primary">
              1
            </span>
            <h2 className="text-lg font-black text-text">
              누구에게 주는 선물인가요?
            </h2>
          </div>

          <p className="mb-6 text-xs text-text-muted">
            <span className="font-bold text-primary">*</span> 항목을 체크하면 더
            정확한 답변을 받을 수 있어요
          </p>

          <div className="flex flex-col gap-5">
            {tagTypes.map((type, index) => (
              <div key={type}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <p className="w-24 shrink-0 pt-2 text-sm font-bold text-text">
                    {TAG_TYPE_LABELS[type] ?? type}
                    {RECOMMENDED_TAG_TYPES.has(type) && (
                      <span className="text-primary"> *</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tagsByType[type].map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                          selectedTagIds.includes(tag.id)
                            ? "bg-primary text-white"
                            : "border border-border text-text hover:border-primary"
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
                {index < tagTypes.length - 1 && (
                  <div className="mt-5 border-t border-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 제목/내용/이미지 */}
        <div className="card flex flex-col gap-6 p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-black text-primary">
              2
            </span>
            <h2 className="text-lg font-black text-text">고민을 들려주세요</h2>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-bold text-text">
                제목 <span className="text-primary">*</span>
              </label>
              <span className="text-xs text-text-muted">
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 부모님 결혼기념일 선물, 건강 관련으로 뭐가 좋을까요?"
              maxLength={100}
              className="h-12 w-full rounded-2xl border border-border bg-white px-5 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-bold text-text">
                내용 <span className="text-primary">*</span>
              </label>
              <span className="text-xs text-text-muted">
                {content.length}/500
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="받는 분의 취향, 이미 드려본 선물, 피하고 싶은 것 등을 적어주시면 더 좋은 답변을 받을 수 있어요"
              maxLength={500}
              rows={6}
              className="w-full resize-none rounded-2xl border border-border bg-white px-5 py-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold text-text">
              사진 <span className="font-normal text-text-muted">(선택)</span>
            </label>
            <MultiImageUploader
              initialImages={existingImages}
              onUpload={(file) => setPendingFiles((prev) => [...prev, file])}
              onDelete={(index, file, existingId) => {
                if (existingId) {
                  setDeletedImageIds((prev) => [...prev, existingId]);
                  setExistingImages((prev) =>
                    prev.filter((img) => img.id !== existingId),
                  );
                } else {
                  setPendingFiles((prev) => {
                    const newIndex = index - existingImages.length;
                    return prev.filter((_, i) => i !== newIndex);
                  });
                }
              }}
              maxCount={5}
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          {/* `/questions/${id}` => toQuestionDetail(id) */}
          <button
            type="button"
            onClick={() => navigate(toQuestionDetail(id))}
            className="btn btn-secondary"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditPage;
