import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const QuestionWritePage = () => {
  return (
    <div>
      <h1>QuestionWritePage</h1>
      <Link to={ROUTES.QUESTIONS}><button>목록으로</button></Link>
    </div>
  );
};

export default QuestionWritePage;
