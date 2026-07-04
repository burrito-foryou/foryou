import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { toQuestionDetail } from "../../../shared/constants/routes";

// 답변/댓글 카드 상단에 붙는 "Q. 원본 질문" 링크 헤더
const QuestionRefHeader = ({ questionId, questionTitle }) => (
  <Link
    to={toQuestionDetail(questionId)}
    className="mb-2 flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-primary"
  >
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-black text-primary">
      Q
    </span>
    <span className="line-clamp-1 font-black">{questionTitle}</span>
    <FiChevronRight size={12} className="shrink-0" />
  </Link>
);

export default QuestionRefHeader;
