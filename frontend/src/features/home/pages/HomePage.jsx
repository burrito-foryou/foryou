import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const FEATURES = [
  {
    icon: "💬",
    title: "질문하기",
    description: "선물 고민을 올리면 다양한 사람들의 의견을 들을 수 있어요",
  },
  {
    icon: "🎯",
    title: "맞춤 추천",
    description: "상황과 예산에 맞는 선물을 추천받을 수 있어요",
  },
  {
    icon: "⚡",
    title: "빠른 답변",
    description: "활발한 커뮤니티가 빠르게 고민을 해결해 드려요",
  },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-4 py-24 text-center">
        {/* 제목 */}
        <h1 className="mb-4 text-4xl font-bold leading-tight text-text sm:text-5xl">
          고민은 짧게,{" "}
          <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            감동은 길게
          </span>
        </h1>

        {/* 서브텍스트 */}
        <p className="mb-10 text-base text-text-muted sm:text-lg">
          받는 사람이 진심으로 기뻐할 선물을
          <br />
          함께 찾아드려요
        </p>

        {/* 버튼 */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={ROUTES.QUESTIONS}
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary-hover transition-colors"
          >
            질문 둘러보기
          </Link>
          <Link
            to={ROUTES.QUESTION_WRITE}
            className="flex items-center gap-1 rounded-full border border-primary px-8 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            질문 작성하기
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 특징 카드 */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-background p-6 text-center"
            >
              <p className="mb-3 text-3xl">{icon}</p>
              <p className="mb-2 font-bold text-text">{title}</p>
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
