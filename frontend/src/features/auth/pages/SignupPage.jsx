import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const SignupPage = () => {
  return (
    <div>
      <h1>SignupPage</h1>
      <Link to={ROUTES.LOGIN}><button>로그인</button></Link>
    </div>
  );
};

export default SignupPage;
