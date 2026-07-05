import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import useAuthStore from "../../auth/store/authStore";
import LikeLoginModal from "../../like/components/LikeLoginModal";

const STEPS = [
  {
    number: 1,
    title: "고민을 질문으로 올려요",
    description:
      "받는 사람, 상황, 예산을 적으면 더 정확한 답변을 받을 수 있어요. 태그를 달면 비슷한 고민을 겪은 사람들에게 잘 노출돼요.",
    tags: ["#받는사람", "#예산", "#상황"],
  },
  {
    number: 2,
    title: "커뮤니티가 답변을 남겨요",
    description:
      "비슷한 선물을 해본 사람들이 직접 경험을 바탕으로 답변해요. 여러 의견을 비교하며 고민을 좁혀갈 수 있어요.",
  },
  {
    number: 3,
    title: "채택하고 마무리해요",
    description:
      "가장 도움이 된 답변을 채택하면 질문이 해결됨으로 표시돼요. 나중에 같은 고민을 하는 사람들에게도 참고가 돼요.",
  },
];

const FAQS = [
  {
    question: "질문은 무료로 올릴 수 있나요?",
    answer: "네, ForU의 질문 작성과 답변은 모두 무료예요. 로그인만 하면 바로 이용할 수 있어요.",
  },
  {
    question: "답변은 보통 얼마나 걸리나요?",
    answer: "활발한 카테고리는 10분 내로 첫 답변이 달려요. 태그를 구체적으로 달수록 더 빨리 답변을 받을 수 있어요.",
  },
  {
    question: "누가 답변할 수 있나요?",
    answer: "가입한 누구나 답변을 남길 수 있어요. 실제 경험을 바탕으로 한 답변일수록 더 많은 공감을 받아요.",
  },
];

const GuidePage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-background px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* 상단 배지 + 타이틀 */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-500">
            이용 가이드
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900">
            선물 고민, <span className="text-pink-500">질문 한 번</span>으로 해결하세요
          </h1>

          <p className="mt-4 text-base text-gray-500">
            ForU는 선물 고민을 올리면 커뮤니티가 답을 찾아주는 Q&A 게시판이에요. 아래 순서대로 이용해 보세요.
          </p>
        </div>

        {/* 단계 카드 */}
        <div className="mt-14 flex flex-col gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-lg font-bold text-white">
                {step.number}
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">{step.title}</h2>
              <p className="mt-2 leading-relaxed text-gray-500">{step.description}</p>

              {step.tags && (
                <div className="mt-4 flex gap-2">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900">자주 묻는 질문</h2>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {FAQS.map((faq, idx) => (
              <div
                key={faq.question}
                className={`px-8 py-7 ${idx !== FAQS.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <h3 className="font-bold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900">지금 고민 중인 선물이 있나요?</h3>
            <p className="mt-1 text-gray-500">질문을 올리고 커뮤니티의 답변을 받아보세요.</p>
          </div>

          <button
            onClick={() => {
              if (!token) {
                setShowLoginModal(true);
                return;
              }
              navigate(ROUTES.QUESTION_WRITE);
            }}
            className="flex shrink-0 items-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 font-bold text-white transition-colors hover:bg-pink-600"
          >
            질문 작성하기
            <span>→</span>
          </button>
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

export default GuidePage;