import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { createQuestion } from "../api/questionApi";
import { getTags } from "../api/tagApi";
import { uploadQuestionImage } from "../../image/api/imageApi";
import useMemberId from "../hooks/useMemberId";
import MultiImageUploader from "../../image/components/MultiImageUploader";

// 태그 타입 → 한글 라벨 매핑 (BE TagType enum 기준)
const TAG_TYPE_LABELS = {
    TARGET: "대상",
    GENDER: "성별",
    AGE_GROUP: "나이대",
    BUDGET: "예산",
    SITUATION: "상황",
    GIFT_TYPE: "카테고리",
};

const QuestionWritePage = () => {
    const navigate = useNavigate();
    const memberId = useMemberId(); // JWT sub 클레임에서 추출

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [tagsByType, setTagsByType] = useState({}); // { TARGET: [...], GENDER: [...], ... }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pendingFiles, setPendingFiles] = useState([]);

    // 컴포넌트 마운트 시 태그 목록 조회 후 타입별로 그룹핑
    useEffect(() => {
        getTags().then((tags) => {
            const grouped = tags.reduce((acc, tag) => {
                if (!acc[tag.type]) acc[tag.type] = [];
                acc[tag.type].push(tag);
                return acc;
            }, {});
            setTagsByType(grouped);
        });
    }, []);

    // 태그 선택/해제 토글
    const toggleTag = (tagId) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId],
        );
    };

    // 이미지 선택 시 파일 임시 저장 (질문 등록 후 업로드)
    const handleImageAdd = (file) => {
        setPendingFiles((prev) => [...prev, file]);
    };

// 이미지 삭제 시 임시 목록에서 제거
    const handleImageDelete = (index) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
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
            const question = await createQuestion(memberId, {
                title: title.trim(),
                content: content.trim(),
                tagIds: selectedTagIds,
            });

            // 이미지 업로드 — 실패해도 질문 등록은 완료된 것으로 처리
            if (pendingFiles.length > 0) {
                try {
                    await Promise.all(
                        pendingFiles.map((file) => uploadQuestionImage(question.id, file)),
                    );
                } catch {
                    // 이미지 업로드 실패는 무시하고 상세 페이지로 이동
                    console.warn("이미지 업로드 실패 - 질문은 정상 등록됨");
                }
            }

            // 질문 등록 성공 후 상세 페이지로 이동
            navigate(`/questions/${question.id}`);
        } catch {
            setError("질문 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            {/* 헤더 */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-lg font-bold text-text">질문 작성</h1>
                <button
                    onClick={() => navigate(ROUTES.QUESTIONS)}
                    className="text-sm text-text-muted hover:text-text"
                >
                    목록으로
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 제목 입력 */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                        제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="질문 제목을 입력하세요"
                        maxLength={100}
                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* 내용 입력 */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-text">
                        내용
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="선물 받을 사람에 대해 자세히 설명해주세요"
                        rows={8}
                        className="w-full resize-none rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                </div>

                {/* 태그 선택 — 타입별로 섹션 구분 */}
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

                {/* 이미지 첨부 (최대 5장) */}
                <div>
                    <label className="mb-3 block text-sm font-medium text-text">
                        이미지 첨부 <span className="text-xs font-normal text-text-muted">(선택)</span>
                    </label>
                    <MultiImageUploader
                        onUpload={handleImageAdd}
                        onDelete={handleImageDelete}
                    />
                </div>

                {/* 에러 메시지 */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* 하단 버튼 */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.QUESTIONS)}
                        className="flex-1 rounded-xl border-2 border-border py-3 text-sm font-bold text-text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                    >
                        {loading ? "등록 중..." : "질문 등록"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionWritePage;