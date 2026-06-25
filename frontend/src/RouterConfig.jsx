import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./shared/constants/routes";
import AppLayout from "./shared/layouts/AppLayout";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

const HomePage = lazy(() => import("./features/home/pages/HomePage"));
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("./features/auth/pages/SignupPage"));
const MyPage = lazy(() => import("./features/user/pages/MyPage"));
const QuestionListPage = lazy(() => import("./features/question/pages/QuestionListPage"));
const QuestionDetailPage = lazy(() => import("./features/question/pages/QuestionDetailPage"));
const QuestionWritePage = lazy(() => import("./features/question/pages/QuestionWritePage"));
const NotificationPage = lazy(() => import("./features/notification/pages/NotificationPage"));

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
      { path: ROUTES.QUESTIONS, element: <QuestionListPage /> },
      { path: ROUTES.QUESTION_DETAIL, element: <QuestionDetailPage /> },

      // 로그인 필요
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.QUESTION_WRITE, element: <QuestionWritePage /> },
          { path: ROUTES.MY_PAGE, element: <MyPage /> },
          { path: ROUTES.NOTIFICATIONS, element: <NotificationPage /> },
        ],
      },
    ],
  },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.SIGNUP, element: <SignupPage /> },
]);

const RouterConfig = () => {
  return <RouterProvider router={router} />;
}

export default RouterConfig;
