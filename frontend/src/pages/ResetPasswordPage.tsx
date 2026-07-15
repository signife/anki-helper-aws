import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, PasswordInput, Button } from "../components/ui";
import { resetPassword, confirmResetPassword } from "../lib/auth/auth-service";

type Step = "request" | "confirm";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setStep("confirm");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmResetPassword(email, code, newPassword);
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[360px] mx-auto py-16">
      <h1 className="text-[28px] font-semibold text-center mb-1">Reset password</h1>
      <p className="text-[14px] text-ink-muted dark:text-on-dark-muted text-center mb-8">
        {step === "request"
          ? "Enter your email to receive a reset code."
          : "Enter the code and your new password."}
      </p>

      {error && (
        <div className="mb-5 p-4 rounded-md bg-error/8 border border-error/20 text-[14px] text-error">
          {error}
        </div>
      )}

      {step === "request" ? (
        <form className="space-y-4" onSubmit={handleRequestCode}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <Button type="submit" loading={loading} className="w-full">
            Send reset code
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleConfirmReset}>
          <Input
            label="Reset code"
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
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8+ characters"
            required
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Reset password
          </Button>
        </form>
      )}

      <p className="mt-6 text-[14px] text-ink-muted dark:text-on-dark-muted text-center">
        <Link to="/login" className="text-accent dark:text-accent-dark hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
