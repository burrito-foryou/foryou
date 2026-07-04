import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiMessageSquare,
  FiEdit2,
  FiTrash2,
  FiBookmark,
} from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import { getQuestionDetail, deleteQuestion, getQuestionImages } from "../api/questionApi";
import { getBookmarkStatus } from "../api/bookmarkApi";
import useMemberId from "../hooks/useMemberId";
import useBookmark from "../hooks/useBookmark";
import useToast from "../../../shared/hooks/useToast";
import Toast from "../../../shared/components/Toast";
import LikeLoginModal from "../../like/components/LikeLoginModal";
import timeAgo from "../../../shared/utils/timeAgo";
import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";
import AnswerList from "../../answer/components/AnswerList";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memberId = useMemberId();

  const { toast, showToast } = useToast();
  const { isBookmarked, setIsBookmarked, toggle: toggleBookmark, loading: bookmarkLoading } = useBookmark(false, showToast);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  const fetchedId = useRef(null);
  useEffect(() => {
    if (fetchedId.current === id) return;
    fetchedId.current = id;

    const fetch = async () => {
      try {
        const [data, imgs] = await Promise.all([
          getQuestionDetail(id),
          getQuestionImages(id),
        ]);
        setQuestion(data);
        setImages(imgs);
        // 북마크 상태 초기화 (로그인 시에만)
        if (memberId) {
          const bookmarked = await getBookmarkStatus(id);
          setIsBookmarked(bookmarked); // useBookmark 초기 상태 동기화
        }
      } catch {
        setError("질문을 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const { ref: highlightRef, isTarget } = useScrollHighlight("QUESTION", question?.id);

  const handleBookmark = () => {
    if (!memberId) {
      setShowLoginModal(true);
      return;
    }
    toggleBookmark(id);
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(id, memberId);
      navigate(ROUTES.QUESTIONS);
    } catch {
      showToast("삭제에 실패했습니다. 다시 시도해주세요.");
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
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-red-400 hover:text-red-500"
            >
              <FiTrash2 size={14} /> 삭제
            </button>
          </div>
        )}
      </div>

      {/* 질문 본문 */}
      <div
        ref={highlightRef}
        className={`rounded-2xl border bg-background p-6 transition-colors ${
          isTarget ? "border-primary ring-2 ring-primary" : "border-border"
        }`}
      >
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
            disabled={bookmarkLoading}
            className="shrink-0 text-text-muted hover:text-primary transition-colors mt-1 disabled:opacity-50"
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

        {/* 첨부 이미지 */}
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={img.originalName}
                className="h-48 w-auto rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        )}

        {/* 통계 */}
        <div className="mt-6 flex items-center gap-4 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1">
            <FiEye size={14} /> {question.viewCount}
          </span>
          <LikeButton
            targetType="QUESTION"
            targetId={question.id}
            initialLikeCount={question.likeCount}
          />
          <span className="flex items-center gap-1">
            <FiMessageSquare size={14} /> {question.answerCount}
          </span>
        </div>
      </div>

      {/* 답변 목록 */}
      <div className="mt-6">
        <AnswerList questionId={id} questionMemberId={question.memberId} />
      </div>

      <Toast toast={toast} />
      {showLoginModal && (
        <LikeLoginModal
          onGoLogin={() => navigate(ROUTES.LOGIN)}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-lg border border-border bg-background p-8 text-center shadow-lg">
              <p className="mb-2 text-base font-bold text-text">질문을 삭제할까요?</p>
              <p className="mb-6 text-sm text-text-muted">삭제한 질문은 복구할 수 없습니다.</p>
              <div className="flex gap-3">
                <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 rounded-md border border-border py-2 text-sm text-text hover:bg-surface"
                >
                  취소
                </button>
                <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      handleDelete();
                    }}
                    className="flex-1 rounded-md bg-red-500 py-2 text-sm font-bold text-white hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
