import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiEdit2,
  FiTrash2,
  FiBookmark,
  FiCheckCircle,
  FiArrowLeft,
  FiShare2,
} from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import {
  getQuestionDetail,
  deleteQuestion,
  getQuestionImages,
  incrementViewCount,
} from "../api/questionApi";
import { getBookmarkStatus } from "../api/bookmarkApi";
import useMemberId from "../hooks/useMemberId";
import useBookmark from "../hooks/useBookmark";
import useToast from "../../../shared/hooks/useToast";
import Toast from "../../../shared/components/Toast";
import LikeLoginModal from "../../like/components/LikeLoginModal";

import useScrollHighlight from "../../../shared/hooks/useScrollHighlight";
import LikeButton from "../../like/components/LikeButton";
import AnswerList from "../../answer/components/AnswerList";
import Avatar from "../../../shared/components/Avatar";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const memberId = useMemberId();

  const { toast, showToast } = useToast();
  const {
    isBookmarked,
    setIsBookmarked,
    toggle: toggleBookmark,
    loading: bookmarkLoading,
  } = useBookmark(false, showToast);
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
        // 세션 내 첫 방문일 때만 조회수 증가
        const sessionKey = `viewed_${id}`;
        if (!sessionStorage.getItem(sessionKey)) {
          await incrementViewCount(id);
          sessionStorage.setItem(sessionKey, "1");
          // 로컬 state 즉시 반영
          setQuestion((prev) => ({ ...prev, viewCount: prev.viewCount + 1 }));
        }
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

  const { ref: highlightRef, isTarget } = useScrollHighlight(
    "QUESTION",
    question?.id,
  );

  const handleBookmark = () => {
    if (!memberId) {
      setShowLoginModal(true);
      return;
    }
    toggleBookmark(id);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("링크가 복사되었습니다.");
    } catch {
      showToast("링크 복사에 실패했습니다.", "error");
    }
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* 상단: 목록으로 */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.QUESTIONS)}
          className="flex items-center gap-1.5 text-sm font-bold text-text-muted transition-colors hover:text-text"
        >
          <FiArrowLeft size={16} />
          목록으로
        </button>
      </div>

      {/* 질문 본문 */}
      <div
        ref={highlightRef}
        className={`card p-8 transition-colors ${
          isTarget ? "border-primary ring-2 ring-primary" : ""
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          {question.acceptedAnswerId ? (
            <span className="flex items-center gap-1 rounded-full bg-primary-light px-3 py-1 text-xs font-black text-text-primary">
              <FiCheckCircle size={12} />
              채택완료
            </span>
          ) : (
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-text-muted">
              채택 대기
            </span>
          )}

          <div className="flex items-center gap-3">
            {isAuthor ? (
              <>
                <button
                  onClick={() => {
                    if (question.acceptedAnswerId) return;
                    navigate(`/questions/${id}/edit`);
                  }}
                  disabled={!!question.acceptedAnswerId}
                  className={`text-sm font-bold transition-colors ${
                    question.acceptedAnswerId
                      ? "cursor-not-allowed text-text-muted/60 opacity-40"
                      : "text-text-muted/60 hover:text-primary"
                  }`}
                  title={
                    question.acceptedAnswerId
                      ? "채택된 질문은 수정할 수 없습니다"
                      : ""
                  }
                >
                  수정
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-sm font-bold text-text-muted/60 transition-colors hover:text-red-500"
                >
                  삭제
                </button>
              </>
            ) : (
              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors disabled:opacity-50"
              >
                <FiBookmark
                  size={16}
                  className={isBookmarked ? "fill-primary" : ""}
                />
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-text-muted transition-colors hover:text-text"
            >
              <FiShare2 size={16} />
            </button>
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-black leading-snug text-text">
          {question.title}
        </h1>

        <div className="mb-5 flex items-center gap-3">
          <Avatar
            src={question.memberProfileImageUrl}
            name={question.memberNickname}
            size={36}
            textSize="text-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-text">
                {question.memberNickname}
              </p>
              {isAuthor && (
                <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-bold text-text-primary">
                  내 질문
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">
              {formatDate(question.createdAt)} · 조회 {question.viewCount}
            </p>
          </div>
        </div>

        {question.tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-muted"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <hr className="mb-6 mt-2 border-border/60" />

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
          {question.content}
        </p>

        {/* 첨부 이미지 */}
        {images.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={img.originalName}
                className="h-48 w-auto rounded-2xl border border-border object-cover"
              />
            ))}
          </div>
        )}

        <hr className="mb-6 mt-6 border-border/60" />

        {/* 통계 */}
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <div className="rounded-full border border-border px-4 py-2">
            <LikeButton
              targetType="QUESTION"
              targetId={question.id}
              initialLikeCount={question.likeCount}
              label="좋아요"
            />
          </div>
          <span className="flex items-center gap-1 rounded-full border border-border px-4 py-2 font-bold">
            <FiMessageSquare size={14} /> 답변 {question.answerCount}
          </span>
        </div>
      </div>

      {/* 답변 목록 */}
      <div className="mt-10">
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
            <p className="mb-2 text-base font-bold text-text">
              질문을 삭제할까요?
            </p>
            <p className="mb-6 text-sm text-text-muted">
              삭제한 질문은 복구할 수 없습니다.
            </p>
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
