import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES, toQuestionDetail } from "../../../shared/constants/routes";
import { getQuestionDetail, updateQuestion } from "../api/questionApi";
import { getTags } from "../api/tagApi";
import useMemberId from "../hooks/useMemberId";

// 태그 타입 → 한글 라벨 매핑
const TAG_TYPE_LABELS = {
  TARGET: "대상",
  GENDER: "성별",
  AGE_GROUP: "나이대",
  BUDGET: "예산",
  SITUATION: "상황",
  GIFT_TYPE: "카테고리",
};

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

  // 기존 질문 데이터 + 전체 태그 목록 동시 조회
  useEffect(() => {
    const init = async () => {
      try {
        const [question, tags] = await Promise.all([
          getQuestionDetail(id),
          getTags(),
        ]);

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-text">질문 수정</h1>
        {/* `/questions/${id}` => toQuestionDetail(id) */}
        <button
          onClick={() => navigate(toQuestionDetail(id))}
          className="text-sm text-text-muted hover:text-text"
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 제목 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* 태그 선택 — 기존 선택 태그 유지하며 수정 가능 */}
        <div>
          <label className="mb-3 block text-sm font-medium text-text">
            태그 선택
          </label>
          <div className="flex flex-col gap-4">
            {Object.entries(tagsByType).map(([type, tags]) => (
              <div key={type}>
                <p className="mb-2 text-xs text-text-muted">
                  {TAG_TYPE_LABELS[type] ?? type}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        selectedTagIds.includes(tag.id)
                          ? "border-primary bg-primary-light font-medium text-primary"
                          : "border-border text-text-muted hover:border-primary"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          {/* `/questions/${id}` => toQuestionDetail(id) */}
          <button
            type="button"
            onClick={() => navigate(toQuestionDetail(id))}
            className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-bold text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditPage;
