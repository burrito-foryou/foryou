import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiGift,
  FiHeart,
  FiMessageCircle,
  FiMessageSquare,
  FiZap,
} from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import useAuthStore from "../../../features/auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";
import Avatar from "../../../shared/components/Avatar";
import { getQuestions } from "../../question/api/questionApi";
import timeAgo from "../../../shared/utils/timeAgo";

const FEATURES = [
  {
    icon: FiMessageSquare,
    title: "질문하기",
    description: "선물 고민을 올리면 다양한 사람들의 의견을 들을 수 있어요",
  },
  {
    icon: FiGift,
    title: "맞춤 추천",
    description: "상황과 예산에 맞는 선물을 추천받을 수 있어요",
  },
  {
    icon: FiZap,
    title: "빠른 답변",
    description: "활발한 커뮤니티가 빠르게 고민을 해결해 드려요",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    getQuestions({ page: 0, size: 5, sort: "likes" })
      .then((res) => {
        const list = res.content ?? [];
        if (list.length > 0) setQuestions(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (questions.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % questions.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [questions]);

  const activeQuestion = questions[activeIndex];

  return (
    <div>
      <div className="py-20">
        <div className="app-container max-w-[1040px] px-4 grid items-start gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-4xl font-black leading-tight text-text sm:text-5xl">
              고민은 짧게,
              <br />
              감동은{" "}
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                길게
              </span>
            </h1>

            <p className="mb-10 text-base text-text-muted sm:text-lg">
              받는 사람이 진심으로 기뻐할 선물, 혼자 고민하지 마세요.
              <br />
              커뮤니티가 함께 찾아드려요.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  if (!token) {
                    setShowLoginModal(true);
                    return;
                  }
                  navigate(ROUTES.QUESTION_WRITE);
                }}
                className="btn btn-primary text-base"
              >
                질문 작성하기
                <FiArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="shrink-0 -translate-y-[1px]"
                  aria-hidden
                />
              </button>
              <Link to={ROUTES.QUESTIONS} className="btn btn-secondary text-base">
                질문 둘러보기
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            {activeQuestion && (
              <div className="relative">
                <Link
                  to={`/questions/${activeQuestion.id}`}
                  className="card block p-7 transition-colors hover:border-primary/40"
                  style={{ boxShadow: "8px 8px 0px rgba(236,79,130,0.1)" }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar name={activeQuestion.memberNickname} size={44} textSize="text-lg" />
                    <div>
                      <p className="font-bold text-text">{activeQuestion.memberNickname}</p>
                      <p className="text-xs text-text-muted">{timeAgo(activeQuestion.createdAt)}</p>
                    </div>
                  </div>

                  <p className="mb-5 text-lg font-bold leading-snug text-text">
                    {activeQuestion.title}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {activeQuestion.tagNames?.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                    {activeQuestion.tagNames?.length > 4 && (
                      <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted">
                        +{activeQuestion.tagNames.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 border-t border-border pt-4 text-sm font-bold text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <FiEye size={16} />
                      조회 {activeQuestion.viewCount}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiHeart size={16} />
                      좋아요 {activeQuestion.likeCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-primary">
                      <FiMessageCircle size={16} />
                      답변 {activeQuestion.answerCount}
                    </span>
                  </div>
                </Link>

                {questions.length > 1 && (
                  <div className="mt-3 flex justify-center gap-1.5">
                    {questions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-border"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="app-container max-w-[1040px] px-4 py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-7">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Icon size={22} />
              </span>
              <p className="mb-2 text-lg font-bold text-text">{title}</p>
              <p className="text-sm leading-relaxed text-text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {showLoginModal && (
        <LikeLoginModal
          onGoLogin={() => navigate(ROUTES.LOGIN)}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
