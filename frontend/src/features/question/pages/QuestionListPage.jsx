import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const QuestionListPage = () => {
  return (
    <div>
      <h1>QuestionListPage</h1>
      <Link to={ROUTES.HOME}><button>홈</button></Link>
      <Link to="/questions/1"><button>질문 상세</button></Link>
      <Link to={ROUTES.QUESTION_WRITE}><button>질문 작성</button></Link>
    </div>
  );
};

export default QuestionListPage;
