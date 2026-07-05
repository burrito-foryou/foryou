import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./shared/constants/routes";
import AppLayout from "./shared/layouts/AppLayout";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

const HomePage = lazy(() => import("./features/home/pages/HomePage"));
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("./features/auth/pages/SignupPage"));
const MyPage = lazy(() => import("./features/my/pages/MyPage"));
const AccountPage = lazy(() => import("./features/user/pages/AccountPage"));
const QuestionListPage = lazy(() => import("./features/question/pages/QuestionListPage"));
const QuestionDetailPage = lazy(() => import("./features/question/pages/QuestionDetailPage"));
const QuestionWritePage = lazy(() => import("./features/question/pages/QuestionWritePage"));
const QuestionEditPage = lazy(() => import("./features/question/pages/QuestionEditPage"));
const NotificationPage = lazy(() => import("./features/notification/pages/NotificationPage"));
const OAuthCallbackPage = lazy(() => import("./features/auth/pages/OAuthCallbackPage"));
const ImageTestPage = lazy(() => import("./features/image/pages/ImageTestPage"));
const GuidePage = lazy(() => import("./features/guide/page/GuidePage"));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={null}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      // 비로그인 접근 가능
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.OAUTH_CALLBACK, element: <OAuthCallbackPage /> },
      { path: ROUTES.QUESTIONS, element: <QuestionListPage /> },
      { path: ROUTES.QUESTION_DETAIL, element: <QuestionDetailPage /> },
      { path: "/image-test", element: <ImageTestPage /> },
      { path: ROUTES.GUIDE, element: <GuidePage /> },

      // 로그인 필요
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.QUESTION_WRITE, element: <QuestionWritePage /> },
          { path: ROUTES.QUESTION_EDIT, element: <QuestionEditPage /> },
          { path: ROUTES.MY_PAGE, element: <MyPage /> },
          { path: ROUTES.MY_ACCOUNT, element: <AccountPage /> },
          { path: ROUTES.NOTIFICATIONS, element: <NotificationPage /> },
        ],
      },
    ],
  },
]);

const RouterConfig = () => {
  return <RouterProvider router={router} />;
};

export default RouterConfig;
