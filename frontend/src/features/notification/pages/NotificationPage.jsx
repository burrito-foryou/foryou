import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";

const NotificationPage = () => {
  return (
    <div>
      <h1>NotificationPage</h1>
      <Link to={ROUTES.HOME}><button>홈</button></Link>
    </div>
  );
};

export default NotificationPage;
