import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiBell,
  FiUser,
  FiMessageSquare,
  FiBookmark,
  FiHeart,
} from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import { getMyInfo, getMyQuestions } from "../api/myApi";
import timeAgo from "../../../shared/utils/timeAgo";

// ── 더미 데이터 (API 미연동 탭 레이아웃 확인용) ──────────────────────────
const DUMMY_ANSWERS = [
  {
    id: 1,
    questionId: 5,
    questionTitle: "20대 여자친구 크리스마스 선물 뭐가 좋을까요",
    content:
      "향수 어떨까요? 조말론이나 딥티크 같은 브랜드 미니 세트도 부담 없고 좋아요.",
    isAccepted: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    questionId: 8,
    questionTitle: "친구 취업 축하 선물로 뭐가 적당할까요",
    content:
      "명함 지갑이나 가죽 카드 케이스 추천드려요. 실용적이고 의미 있어서 좋아했어요.",
    isAccepted: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DUMMY_COMMENTS = [
  {
    id: 1,
    questionId: 12,
    questionTitle: "30대 직장 선배 선물로 뭐가 무난할까요",
    content: "저도 이거 고민했는데 좋은 답변 감사해요!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    questionId: 15,
    questionTitle: "고등학교 친구 생일 선물 부담 없는 거 추천",
    content: "디퓨저 세트도 좋을 것 같아요. 인테리어 관심 있는 친구면 특히요.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DUMMY_BOOKMARKS = [
  {
    id: 3,
    questionId: 3,
    title: "여자친구 100일 선물 예산 5만원 추천해주세요",
    tagNames: ["연인", "기념일"],
    answerCount: 12,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    questionId: 9,
    title: "할머니 칠순 선물 뭐가 좋을까요",
    tagNames: ["가족", "어르신", "칠순"],
    answerCount: 5,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
// ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "question", label: "질문" },
  { key: "answer", label: "답변" },
  { key: "comment", label: "댓글" },
  { key: "bookmark", label: "북마크" },
];

// ── 탭별 아이템 컴포넌트 ───────────────────────────────────────────────

const QuestionItem = ({ item }) => (
  <Link
    to={`/questions/${item.id}`}
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary transition-colors"
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      <p className="text-sm font-semibold text-text leading-snug">
        {item.title}
      </p>
      {item.acceptedAnswerId && (
        <span className="shrink-0 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
          채택완료
        </span>
      )}
    </div>
    <div className="mb-2 flex flex-wrap gap-1">
      {item.tagNames.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-surface px-2 py-0.5 text-xs text-primary"
        >
          #{tag}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between text-xs text-text-muted">
      <span>{timeAgo(item.createdAt)}</span>
      <span className="flex items-center gap-1">
        <FiMessageSquare size={12} /> {item.answerCount}
      </span>
    </div>
  </Link>
);

const AnswerItem = ({ item }) => (
  <Link
    to={`/questions/${item.questionId}`}
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary transition-colors"
  >
    <p className="mb-1.5 text-xs text-text-muted line-clamp-1">
      Q. {item.questionTitle}
    </p>
    <p className="mb-2 text-sm text-text line-clamp-2">{item.content}</p>
    <div className="flex items-center justify-between text-xs text-text-muted">
      <span>{timeAgo(item.createdAt)}</span>
      {item.isAccepted && (
        <span className="flex items-center gap-1 text-primary font-semibold">
          <FiHeart size={12} /> 채택됨
        </span>
      )}
    </div>
  </Link>
);

const CommentItem = ({ item }) => (
  <Link
    to={`/questions/${item.questionId}`}
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary transition-colors"
  >
    <p className="mb-1.5 text-xs text-text-muted line-clamp-1">
      Q. {item.questionTitle}
    </p>
    <p className="mb-2 text-sm text-text line-clamp-2">{item.content}</p>
    <span className="text-xs text-text-muted">{timeAgo(item.createdAt)}</span>
  </Link>
);

const BookmarkItem = ({ item }) => (
  <Link
    to={`/questions/${item.questionId}`}
    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-primary transition-colors"
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      <p className="text-sm font-semibold text-text leading-snug">
        {item.title}
      </p>
      <FiBookmark size={14} className="shrink-0 text-primary mt-0.5" />
    </div>
    <div className="mb-2 flex flex-wrap gap-1">
      {item.tagNames.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-surface px-2 py-0.5 text-xs text-primary"
        >
          #{tag}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between text-xs text-text-muted">
      <span>{timeAgo(item.createdAt)}</span>
      <span className="flex items-center gap-1">
        <FiMessageSquare size={12} /> {item.answerCount}
      </span>
    </div>
  </Link>
);

const EMPTY_MESSAGES = {
  question: "아직 작성한 질문이 없어요.",
  answer: "아직 작성한 답변이 없어요.",
  comment: "아직 작성한 댓글이 없어요.",
  bookmark: "저장한 질문이 없어요.",
};

// ──────────────────────────────────────────────────────────────────────

const MyPage = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("question");

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  useEffect(() => {
    getMyInfo()
      .then(setMember)
      .finally(() => setLoading(false));

    getMyQuestions()
      .then(setQuestions)
      .finally(() => setQuestionsLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-text-muted">
        불러오는 중...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-text-muted">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const tabItems = {
    question: questions,
    answer: DUMMY_ANSWERS,
    comment: DUMMY_COMMENTS,
    bookmark: DUMMY_BOOKMARKS,
  };

  const isTabLoading = activeTab === "question" && questionsLoading;

  const renderItem = (item) => {
    if (activeTab === "question")
      return <QuestionItem key={item.id} item={item} />;
    if (activeTab === "answer") return <AnswerItem key={item.id} item={item} />;
    if (activeTab === "comment")
      return <CommentItem key={item.id} item={item} />;
    if (activeTab === "bookmark")
      return <BookmarkItem key={item.id} item={item} />;
  };

  const items = tabItems[activeTab];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      {/* 프로필 요약 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 flex items-center gap-4">
        {member.profileImageUrl ? (
          <img
            src={member.profileImageUrl}
            alt="프로필 이미지"
            className="h-16 w-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
            {member.nickname.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-base font-bold text-text truncate">
            {member.nickname}
          </p>
          <p className="mt-0.5 text-sm text-text-muted truncate">
            {member.email}
          </p>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <Link
          to={ROUTES.MY_ACCOUNT}
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FiUser size={18} className="text-text-muted" />
            <span className="text-sm font-medium text-text">계정 정보</span>
          </div>
          <FiChevronRight size={18} className="text-text-muted" />
        </Link>
        <div className="border-t border-gray-100">
          <Link
            to={ROUTES.NOTIFICATIONS}
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiBell size={18} className="text-text-muted" />
              <span className="text-sm font-medium text-text">알림</span>
            </div>
            <FiChevronRight size={18} className="text-text-muted" />
          </Link>
        </div>
      </div>

      {/* 활동 탭 */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-4">
          {isTabLoading ? (
            <p className="py-8 text-center text-sm text-text-muted">
              불러오는 중...
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              {EMPTY_MESSAGES[activeTab]}
            </p>
          ) : (
            <div className="flex flex-col gap-3">{items.map(renderItem)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
