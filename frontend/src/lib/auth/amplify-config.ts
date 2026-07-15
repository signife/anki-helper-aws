import { Amplify } from "aws-amplify";

/**
 * Cognito 설정 초기화.
 * 환경변수는 Vite의 import.meta.env에서 가져온다.
 * 실제 값은 .env 파일 또는 CI 환경에서 주입된다.
 */
export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "",
      },
    },
  });
}
