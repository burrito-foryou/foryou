import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiEdit2,
  FiTrash2,
  FiBookmark,
} from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import { getQuestionDetail, deleteQuestion } from "../api/questionApi";
import {
  addBookmark,
  removeBookmark,
  getBookmarkStatus,
} from "../api/bookmarkApi";
import useMemberId from "../hooks/useMemberId";
import timeAgo from "../../../shared/utils/timeAgo";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memberId = useMemberId();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 추가

  const fetchedId = useRef(null);
  useEffect(() => {
    if (fetchedId.current === id) return;
    fetchedId.current = id;

    const fetch = async () => {
      try {
        const data = await getQuestionDetail(id);
        setQuestion(data);
        // 북마크 상태 초기화 (로그인 시에만)
        if (memberId) {
          const bookmarked = await getBookmarkStatus(id);
          setIsBookmarked(bookmarked);
        }
      } catch {
        setError("질문을 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // 북마크 토글
  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(id);
      } else {
        await addBookmark(id);
      }
      setIsBookmarked((prev) => !prev);
    } catch {
      alert("북마크 실패");
    }
  };

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
        {question.acceptedAnswerId && (
          <span className="mb-3 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            채택완료
          </span>
        )}

        {/* 제목 + 북마크 버튼 */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-text">{question.title}</h1>
          <button
            onClick={handleBookmark}
            className="shrink-0 text-text-muted hover:text-primary transition-colors mt-1"
          >
            <FiBookmark
              size={20}
              className={isBookmarked ? "fill-primary text-primary" : ""}
            />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-text-muted">
          <span>{question.memberNickname}</span>
          <span>·</span>
          <span>{timeAgo(question.createdAt)}</span>
        </div>

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

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
          {question.content}
        </p>

        {/* 통계 */}
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
