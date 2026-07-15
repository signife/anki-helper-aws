import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button } from "../components/ui";
import { confirmSignUp } from "../lib/auth/auth-service";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email ?? "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmSignUp(email, code);
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-[360px] mx-auto py-16 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-success/10 grid place-items-center">
          <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-[28px] font-semibold mb-2">Verified</h1>
        <p className="text-[14px] text-ink-muted dark:text-on-dark-muted mb-8">
          Your account has been verified. You can now sign in.
        </p>
        <Button onClick={() => navigate("/login", { replace: true })} className="w-full">
          Go to Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[360px] mx-auto py-16">
      <h1 className="text-[28px] font-semibold text-center mb-1">Verify your email</h1>
      <p className="text-[14px] text-ink-muted dark:text-on-dark-muted text-center mb-8">
        We sent a code to{" "}
        {email ? <span className="text-ink dark:text-on-dark font-medium">{email}</span> : "your email"}.
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
        {!emailFromState && (
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        )}

        <Input
          label="Verification code"
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          required
          autoComplete="one-time-code"
          className="text-center tracking-[0.3em] text-[20px]"
        />

        <Button type="submit" loading={loading} disabled={!code || !email} className="w-full">
          Verify
        </Button>
      </form>

      <p className="mt-6 text-[14px] text-ink-muted dark:text-on-dark-muted text-center">
        Didn't receive the code?{" "}
        <button className="text-accent dark:text-accent-dark hover:underline">Resend</button>
      </p>
    </div>
  );
}
