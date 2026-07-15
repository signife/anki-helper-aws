import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";

/**
 * 인증된 사용자만 접근 가능한 라우트를 감싸는 컴포넌트.
 * - loading: 스피너 표시
 * - unauthenticated: /login으로 리다이렉트 (원래 경로 보존)
 * - authenticated: 자식 라우트 렌더링
 */
export default function ProtectedRoute() {
  const { status } = useAuthStore();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
