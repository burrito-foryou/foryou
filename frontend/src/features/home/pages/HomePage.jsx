import { Link } from "react-router-dom";
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

const SAMPLE_QUESTION = {
  nickname: "burrito",
  createdAt: "10분 전",
  title: "여자친구 100일 선물, 향수 vs 목걸이 뭐가 나을까요?",
  tags: ["#기념일", "#20대", "#여자친구", "#5~10만원"],
  viewCount: 234,
  likeCount: 18,
  answerCount: 12,
};

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <div className="px-4 py-20">
        <div className="app-container max-w-[1040px] grid items-center gap-12 md:grid-cols-2">
          <div className="mt-6">
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
              <Link
                to={ROUTES.QUESTION_WRITE}
                className="btn btn-primary text-base"
              >
                질문 작성하기
                <FiArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="shrink-0 -translate-y-[1px]"
                  aria-hidden
                />
              </Link>
              <Link
                to={ROUTES.QUESTIONS}
                className="btn btn-secondary text-base"
              >
                질문 둘러보기
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="card p-7 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-black text-primary">
                  {SAMPLE_QUESTION.nickname.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-bold text-text">
                    {SAMPLE_QUESTION.nickname}
                  </p>
                  <p className="text-xs text-text-muted">
                    {SAMPLE_QUESTION.createdAt}
                  </p>
                </div>
              </div>

              <p className="mb-5 text-lg font-bold leading-snug text-text">
                {SAMPLE_QUESTION.title}
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {SAMPLE_QUESTION.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-border pt-4 text-sm font-bold text-text-muted">
                <span className="flex items-center gap-1.5">
                  <FiEye size={16} />
                  조회 {SAMPLE_QUESTION.viewCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiHeart size={16} />
                  좋아요 {SAMPLE_QUESTION.likeCount}
                </span>
                <span className="flex items-center gap-1.5 text-primary">
                  <FiMessageCircle size={16} />
                  답변 {SAMPLE_QUESTION.answerCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 특징 카드 */}
      <div className="app-container max-w-[1040px] px-4 py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-7">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Icon size={22} />
              </span>
              <p className="mb-2 text-lg font-bold text-text">{title}</p>
              <p className="text-sm leading-relaxed text-text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
