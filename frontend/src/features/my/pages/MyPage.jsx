import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import Avatar from "../../../shared/components/Avatar";
import { ROUTES } from "../../../shared/constants/routes";
import {
  getMyInfo,
  getMyQuestions,
  getMyAnswers,
  getMyComments,
  getMyBookmarks,
} from "../api/myApi";
import BookmarkCard from "../components/BookmarkCard";
import CommentMyCard from "../components/CommentMyCard";
import AnswerMyCard from "../components/AnswerMyCard";
import QuestionMyCard from "../components/QuestionMyCard";

const TABS = [
  { key: "question", label: "질문" },
  { key: "answer", label: "답변" },
  { key: "comment", label: "댓글" },
  { key: "bookmark", label: "북마크" },
];

const SECTION_TITLES = {
  question: "내 질문",
  answer: "내 답변",
  comment: "내 댓글",
  bookmark: "북마크한 질문",
};

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
  const [questionCount, setQuestionCount] = useState(0);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  const [answers, setAnswers] = useState([]);
  const [answerCount, setAnswerCount] = useState(0);
  const [answersLoading, setAnswersLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);

  useEffect(() => {
    getMyInfo()
      .then(setMember)
      .finally(() => setLoading(false));

    getMyQuestions()
      .then((page) => {
        setQuestions(page.content);
        setQuestionCount(page.totalElements);
      })
      .finally(() => setQuestionsLoading(false));

    getMyAnswers()
      .then((page) => {
        setAnswers(page.content);
        setAnswerCount(page.totalElements);
      })
      .finally(() => setAnswersLoading(false));

    getMyComments()
      .then((page) => {
        setComments(page.content);
        setCommentCount(page.totalElements);
      })
      .finally(() => setCommentsLoading(false));

    getMyBookmarks()
      .then((page) => {
        setBookmarks(page.content);
        setBookmarkCount(page.totalElements);
      })
      .finally(() => setBookmarksLoading(false));
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

  const tabCounts = {
    question: questionCount,
    answer: answerCount,
    comment: commentCount,
    bookmark: bookmarkCount,
  };

  const tabItems = {
    question: questions,
    answer: answers,
    comment: comments,
    bookmark: bookmarks,
  };

  const isTabLoading =
    (activeTab === "question" && questionsLoading) ||
    (activeTab === "answer" && answersLoading) ||
    (activeTab === "comment" && commentsLoading) ||
    (activeTab === "bookmark" && bookmarksLoading);

  const renderItem = (item) => {
    if (activeTab === "question")
      return <QuestionMyCard key={item.id} item={item} />;
    if (activeTab === "answer")
      return <AnswerMyCard key={item.id} item={item} />;
    if (activeTab === "comment")
      return <CommentMyCard key={item.id} item={item} />;
    if (activeTab === "bookmark")
      return <BookmarkCard key={item.questionId} item={item} />;
  };

  const items = tabItems[activeTab];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10">
      <h1 className="text-3xl font-black text-text">마이페이지</h1>

      {/* 프로필 요약 */}
      <div className="card flex items-center justify-between gap-4 p-8">
        <div className="flex items-center gap-4">
          <Avatar
            src={member.profileImageUrl}
            name={member.nickname}
            size={64}
            textSize="text-2xl"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-text">
              {member.nickname}
            </p>
            <p className="mt-0.5 truncate text-sm text-text-muted">
              {member.email}
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.MY_ACCOUNT}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-bold text-text transition-colors hover:border-primary hover:text-primary"
        >
          <FiSettings size={15} />
          계정 정보
        </Link>
      </div>

      {/* 활동 통계 = 탭 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`card px-5 py-3 text-left transition-colors ${
                isActive ? "border-transparent bg-primary-light" : ""
              }`}
            >
              <p
                className={`text-2xl font-black ${
                  isActive ? "text-primary" : "text-text"
                }`}
              >
                {tabCounts[tab.key]}
              </p>
              <p
                className={`text-sm font-bold ${
                  isActive ? "text-primary/70" : "text-text-muted"
                }`}
              >
                {tab.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* 활동 목록 */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-black text-text">
          {SECTION_TITLES[activeTab]}{" "}
          <span className="text-primary">{tabCounts[activeTab]}</span>
        </h2>

        {isTabLoading ? (
          <p className="card p-8 text-center text-sm text-text-muted">
            불러오는 중...
          </p>
        ) : items.length === 0 ? (
          <p className="card p-8 text-center text-sm text-text-muted">
            {EMPTY_MESSAGES[activeTab]}
          </p>
        ) : (
          <div className="flex flex-col gap-3">{items.map(renderItem)}</div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
