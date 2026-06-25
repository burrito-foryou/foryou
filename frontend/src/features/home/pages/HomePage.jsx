import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <Link to={ROUTES.QUESTIONS}><button>질문 목록</button></Link>
      <Link to={ROUTES.QUESTION_WRITE}><button>질문 작성 (로그인 필요)</button></Link>
      <Link to={ROUTES.MY_PAGE}><button>마이페이지 (로그인 필요)</button></Link>
      <Link to={ROUTES.NOTIFICATIONS}><button>알림 (로그인 필요)</button></Link>
      <Link to={ROUTES.LOGIN}><button>로그인</button></Link>
      <Link to={ROUTES.SIGNUP}><button>회원가입</button></Link>
    </div>
  );
};

export default HomePage;
