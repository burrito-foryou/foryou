import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEye, FiHeart, FiMessageSquare, FiEdit2, FiTrash2 } from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import { getQuestionDetail, deleteQuestion } from "../api/questionApi";
import useMemberId from "../hooks/useMemberId";
import timeAgo from "../../../shared/utils/timeAgo";

const QuestionDetailPage = () => {
    const { id } = useParams();           // URL의 :id 추출
    const navigate = useNavigate();
    const memberId = useMemberId();       // 현재 로그인 유저 id

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 질문 상세 조회 (조회 시 viewCount 자동 증가)
    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getQuestionDetail(id);
                setQuestion(data);
            } catch {
                setError("질문을 찾을 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    // 삭제 처리 — 확인 후 API 호출, 목록으로 이동
    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteQuestion(id, memberId);
            navigate(ROUTES.QUESTIONS);
        } catch {
            alert("삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-sm text-text-muted">
                불러오는 중...
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="py-20 text-center text-sm text-text-muted">{error}</div>
        );
    }

    // 현재 로그인 유저가 작성자인지 확인 (수정/삭제 버튼 노출 여부)
    const isAuthor = memberId === question.memberId;

    return (
        <div className="mx-auto max-w-3xl px-4 py-6">
            {/* 상단: 목록으로 + 수정/삭제 버튼 */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(ROUTES.QUESTIONS)}
                    className="text-sm text-text-muted hover:text-text"
                >
                    ← 목록으로
                </button>

                {/* 작성자 본인에게만 수정/삭제 버튼 노출 */}
                {isAuthor && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/questions/${id}/edit`)}
                            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary"
                        >
                            <FiEdit2 size={14} /> 수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-red-400 hover:text-red-500"
                        >
                            <FiTrash2 size={14} /> 삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 질문 본문 */}
            <div className="rounded-2xl border border-border bg-background p-6">
                {/* 채택 뱃지 */}
                {question.acceptedAnswerId && (
                    <span className="mb-3 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            채택완료
          </span>
                )}

                <h1 className="mb-3 text-xl font-bold text-text">{question.title}</h1>

                {/* 작성자 정보 + 날짜 */}
                <div className="mb-4 flex items-center justify-between text-xs text-text-muted">
                    <span>{question.memberNickname}</span>
                    <span>{timeAgo(question.createdAt)}</span>
                </div>

                {/* 태그 목록 */}
                {question.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {question.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-full bg-surface px-2.5 py-1 text-xs text-primary"
                            >
                #{tag.name}
              </span>
                        ))}
                    </div>
                )}

                <hr className="mb-4 border-border" />

                {/* 본문 내용 */}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
                    {question.content}
                </p>

                {/* 통계 (조회수, 좋아요, 답변수) */}
                <div className="mt-6 flex items-center gap-4 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1">
            <FiEye size={14} /> {question.viewCount}
          </span>
                    <span className="flex items-center gap-1">
            <FiHeart size={14} /> {question.likeCount}
          </span>
                    <span className="flex items-center gap-1">
            <FiMessageSquare size={14} /> {question.answerCount}
          </span>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetailPage;