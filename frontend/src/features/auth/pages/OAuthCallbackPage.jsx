import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { socialLogin } from "../api/authApi";
import useAuthStore from "../store/authStore";

const OAuthCallbackPage = () => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    const code = searchParams.get("code");

    if (!code) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    socialLogin({ provider, code })
      .then(({ data }) => {
        setAuth(data.data.accessToken);
        navigate(ROUTES.HOME, { replace: true });
      })
      .catch(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
      <p className="text-sm text-text-muted">로그인 처리 중...</p>
    </div>
  );
};

export default OAuthCallbackPage;
