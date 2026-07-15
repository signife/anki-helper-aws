import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, PasswordInput, Button } from "../components/ui";
import { signIn } from "../lib/auth/auth-service";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        navigate("/verify-email", { state: { email } });
        return;
      }

      if (result.isSignedIn) {
        navigate("/cards", { replace: true });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[360px] mx-auto py-16">
      <h1 className="text-[28px] font-semibold text-center mb-1">Sign in</h1>
      <p className="text-[14px] text-ink-muted dark:text-on-dark-muted text-center mb-8">
        Enter your email and password to continue.
      </p>

      {error && (
        <div className="mb-5 p-4 rounded-md bg-error/8 border border-error/20 text-[14px] text-error">
          <p>{error}</p>
          <p className="mt-2 text-ink-faint dark:text-on-dark-muted text-[13px]">
            Need help?{" "}
            <a href="mailto:gusals0908@gmail.com" className="text-accent dark:text-accent-dark hover:underline">
              gusals0908@gmail.com
            </a>
          </p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-[14px] text-center space-y-2">
        <p>
          <Link to="/reset-password" className="text-accent dark:text-accent-dark hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-ink-muted dark:text-on-dark-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent dark:text-accent-dark hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
