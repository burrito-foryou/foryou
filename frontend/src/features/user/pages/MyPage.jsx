import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const MyPage = () => {
  return (
    <div>
      <h1>MyPage</h1>
      <Link to={ROUTES.HOME}><button>홈</button></Link>
    </div>
  );
};

export default MyPage;
