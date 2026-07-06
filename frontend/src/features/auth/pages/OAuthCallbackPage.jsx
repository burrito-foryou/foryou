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
        setAuth(data.data.accessToken, data.data.refreshToken);
        navigate(ROUTES.HOME, { replace: true });
      })
      .catch((error) => {
        const message =
          error.response?.data?.code === "MEMBER_001"
            ? "이미 가입된 이메일이에요. 처음 가입했던 방법으로 로그인해주세요."
            : (error.response?.data?.message ??
              "로그인에 실패했어요. 다시 시도해주세요.");

        navigate(ROUTES.LOGIN, {
          replace: true,
          state: { oauthError: message },
        });
      });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
      <p className="text-sm text-text-muted">로그인 처리 중...</p>
    </div>
  );
};

export default OAuthCallbackPage;
