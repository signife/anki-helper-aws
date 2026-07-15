import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { configureAmplify } from "./lib/auth/amplify-config";
import { refreshAuthState } from "./lib/auth/auth-service";
import Providers from "./app/providers";
import AppRouter from "./app/router";

// Amplify 초기화 (Cognito 연결)
configureAmplify();

// 기존 세션이 있으면 인증 상태 복원
refreshAuthState();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <AppRouter />
    </Providers>
  </StrictMode>,
);
