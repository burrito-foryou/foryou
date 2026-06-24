import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const LoginPage = () => {
  return (
    <div>
      <h1>LoginPage</h1>
      <Link to={ROUTES.HOME}><button>홈</button></Link>
      <Link to={ROUTES.SIGNUP}><button>회원가입</button></Link>
    </div>
  );
};

export default LoginPage;
