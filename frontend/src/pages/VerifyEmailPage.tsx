import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp } from "../lib/auth/auth-service";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email ?? "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmSignUp(email, code);
      navigate("/login", {
        replace: true,
        state: { verified: true },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
      <p className="text-gray-400 text-sm mb-8">
        We sent a verification code to{" "}
        {email ? (
          <span className="text-white font-medium">{email}</span>
        ) : (
          "your email"
        )}
        . Enter it below.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!emailFromState && (
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
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Verification code
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        Didn't receive the code?{" "}
        <button className="text-indigo-400 hover:underline">Resend</button>
      </p>
    </div>
  );
}
