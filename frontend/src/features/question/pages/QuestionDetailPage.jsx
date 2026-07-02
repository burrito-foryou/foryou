import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import AnswerList from "../../answer/components/AnswerList";

const QuestionDetailPage = () => {
  const { id: questionId } = useParams();
  return (
    <div>
      <h1>QuestionDetailPage</h1>
      <Link to={ROUTES.QUESTIONS}><button>목록으로</button></Link>
      <Link to={ROUTES.QUESTION_WRITE}><button>질문 작성</button></Link>
      <AnswerList questionId={questionId} />
    </div>
  );
};

export default QuestionDetailPage;
