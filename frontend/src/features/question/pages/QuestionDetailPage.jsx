import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const QuestionDetailPage = () => {
  return (
    <div>
      <h1>QuestionDetailPage</h1>
      <Link to={ROUTES.QUESTIONS}><button>목록으로</button></Link>
      <Link to={ROUTES.QUESTION_WRITE}><button>질문 작성</button></Link>
    </div>
  );
};

export default QuestionDetailPage;
