import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  resetPassword,
  confirmResetPassword,
} from "../lib/auth/auth-service";

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
      const message =
        err instanceof Error ? err.message : "Failed to send reset code.";
      setError(message);
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
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Password reset failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-bold mb-2">Reset password</h1>
      <p className="text-gray-400 text-sm mb-8">
        {step === "request"
          ? "Enter your email to receive a password reset code."
          : "Enter the code and your new password."}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {step === "request" ? (
        <form className="space-y-4" onSubmit={handleRequestCode}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? "Sending…" : "Send reset code"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleConfirmReset}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Reset code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-center tracking-widest text-lg"
              placeholder="000000"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              placeholder="8+ characters"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-gray-400">
        <Link to="/login" className="text-indigo-400 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
