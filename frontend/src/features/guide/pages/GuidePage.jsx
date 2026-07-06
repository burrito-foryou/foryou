import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiGift,
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { ROUTES } from "../../../shared/constants/routes";
import useAuthStore from "../../auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";

const STEPS = [
  {
    icon: FiEdit,
    title: "고민을 질문으로 올려요",
    description:
      "받는 사람, 예산, 상황만 골라도 질문이 완성돼요. 사진을 더하면 더 좋아요.",
  },
  {
    icon: FiMessageCircle,
    title: "답변을 받아요",
    description:
      "커뮤니티가 실제 경험을 바탕으로 선물을 추천해줘요. 궁금한 건 댓글로 물어보세요.",
  },
  {
    icon: FiCheckCircle,
    title: "마음에 드는 답변을 채택해요",
    description:
      "가장 도움이 된 답변을 채택하면, 답변해준 사람에게도 고마움이 전해져요.",
  },
];

const TIPS = [
  {
    icon: FiUser,
    title: "받는 사람을 구체적으로",
    description: "나이·성별·취향을 적을수록 더 딱 맞는 선물을 추천받아요.",
  },
  {
    icon: FiDollarSign,
    title: "예산을 알려주세요",
    description: "예산 범위가 있으면 현실적인 선물만 골라 받을 수 있어요.",
  },
  {
    icon: FiClock,
    title: "이미 준 선물도 적기",
    description: "전에 준 선물을 알려주면 겹치지 않는 아이디어를 받아요.",
  },
  {
    icon: FiHeart,
    title: "채택으로 감사 표현",
    description: "도움받은 답변을 채택하면 커뮤니티가 더 활발해져요.",
  },
];

const POPULAR_TAGS = [
  "부모님",
  "여자친구",
  "기념일",
  "20대",
  "취업",
  "3~5만원",
];

const GuidePage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [searchValue, setSearchValue] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSearch = () => {
    const value = searchValue.trim();
    if (!value) return;
    navigate(`${ROUTES.QUESTIONS}?keyword=${encodeURIComponent(value)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTagClick = (tag) => {
    navigate(`${ROUTES.QUESTIONS}?tag=${encodeURIComponent(tag)}`);
  };

  const handleWriteClick = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    navigate(ROUTES.QUESTION_WRITE);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-primary-light/50 via-background to-background">
        <div className="app-container max-w-[900px] px-4 pb-8 pt-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-xs font-extrabold text-text-primary">
            <FiGift size={14} />
            ForU 처음이신가요?
          </span>

          <h1 className="mb-4 mt-6 text-4xl font-black leading-tight text-text sm:text-5xl">
            선물{" "}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              고민
            </span>
            , 이렇게 해결해요
          </h1>

          <p className="text-base text-text-muted sm:text-lg">
            혼자 고민하지 말고 물어보세요. 다양한 사람들의 경험이 가장 좋은
            선물을 찾아줘요.
          </p>
        </div>

        <div className="app-container max-w-[900px] px-4 pb-20 pt-10">
          <h2 className="mb-4 text-xl font-black text-text">3단계로 끝나요</h2>

          <div className="flex flex-col gap-4">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="card flex items-center gap-5 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-white">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="mb-1 text-base font-bold text-text">{title}</p>
                  <p className="text-sm leading-relaxed text-text-muted">
                    {description}
                  </p>
                </div>
                <Icon
                  size={28}
                  className="hidden shrink-0 text-primary/20 sm:block"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="app-container max-w-[900px] px-4 pb-20">
        <h2 className="mb-4 text-xl font-black text-text">
          좋은 답변을 빨리 받는 팁
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TIPS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Icon size={18} />
              </span>
              <p className="mb-1 text-base font-bold text-text">{title}</p>
              <p className="text-sm leading-relaxed text-text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="app-container max-w-[900px] px-4 pb-20">
        <h2 className="mb-2 text-2xl font-black text-text">
          먼저 비슷한 고민을 찾아보세요
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          이미 누군가 같은 고민을 했을지도 몰라요. 검색하거나 인기 태그로
          둘러보세요.
        </p>

        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-white p-2 pl-5">
          <FiSearch className="shrink-0 text-text-muted" size={18} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="예) 부모님 생신 선물, 예산 5만원"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="shrink-0 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            검색
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-text transition-colors hover:border-primary"
            >
              <span className="text-primary">#</span> {tag}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-8 shadow-soft">
          <div>
            <p className="mb-1 text-xl font-black text-white">
              찾는 고민이 없나요?
            </p>
            <p className="text-sm text-white/80">
              직접 질문을 올리면 커뮤니티가 답변을 남겨줘요.
            </p>
          </div>
          <button
            type="button"
            onClick={handleWriteClick}
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-surface"
          >
            질문 작성하기
            <FiArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {showLoginModal && (
        <LikeLoginModal
          onGoLogin={() => navigate(ROUTES.LOGIN)}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
};

export default GuidePage;
