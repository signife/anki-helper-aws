import {
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
import { useAuthStore } from "../../stores/auth-store";
import type { AuthUser } from "../../stores/auth-store";

/**
 * 회원가입
 */
export async function signUp(email: string, password: string) {
  const result = await amplifySignUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
    },
  });
  return result;
}

/**
 * 이메일 인증 코드 확인
 */
export async function confirmSignUp(email: string, code: string) {
  const result = await amplifyConfirmSignUp({
    username: email,
    confirmationCode: code,
  });
  return result;
}

/**
 * 로그인
 */
export async function signIn(email: string, password: string) {
  const result = await amplifySignIn({
    username: email,
    password,
  });

  if (result.isSignedIn) {
    await refreshAuthState();
  }

  return result;
}

/**
 * 로그아웃
 */
export async function signOut() {
  await amplifySignOut();
  useAuthStore.getState().setUnauthenticated();
}

/**
 * 비밀번호 재설정 요청 (코드 발송)
 */
export async function resetPassword(email: string) {
  const result = await amplifyResetPassword({ username: email });
  return result;
}

/**
 * 비밀번호 재설정 확인 (코드 + 새 비밀번호)
 */
export async function confirmResetPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  await amplifyConfirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  });
}

/**
 * 현재 인증 상태 확인 및 store 갱신.
 * 앱 초기화 시, 토큰 갱신 시 호출한다.
 */
export async function refreshAuthState() {
  const store = useAuthStore.getState();

  try {
    const cognitoUser = await amplifyGetCurrentUser();
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;

    const user: AuthUser = {
      userId: cognitoUser.userId,
      email:
        (idToken?.payload?.email as string) ??
        cognitoUser.signInDetails?.loginId ??
        "",
    };

    store.setAuthenticated(user);
  } catch {
    store.setUnauthenticated();
  }
}

/**
 * JWT Access Token 가져오기 (API 요청용).
 * 만료 시 자동 갱신 시도. 실패하면 null 반환.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}
