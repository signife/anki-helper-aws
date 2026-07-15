import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, PasswordInput, Button } from "../components/ui";
import { signUp } from "../lib/auth/auth-service";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const policies = [
    { key: "length", label: "8 characters minimum", met: password.length >= 8 },
    { key: "upper", label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { key: "lower", label: "One lowercase letter", met: /[a-z]/.test(password) },
    { key: "number", label: "One number", met: /\d/.test(password) },
  ];

  const allPoliciesMet = policies.every((p) => p.met);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!allPoliciesMet) {
      setError("Password does not meet all requirements.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password);
      if (result.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        navigate("/verify-email", { state: { email } });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[360px] mx-auto py-16">
      <h1 className="text-[28px] font-semibold text-center mb-1">Create account</h1>
      <p className="text-[14px] text-ink-muted dark:text-on-dark-muted text-center mb-8">
        Sign up with your email to start creating cards.
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
          placeholder="8+ characters"
          required
          autoComplete="new-password"
        />

        {/* Password policy */}
        {password.length > 0 && (
          <div className="p-3 rounded-md border border-hairline dark:border-hairline-dark bg-canvas-alt dark:bg-dark-surface space-y-1.5">
            {policies.map((p) => (
              <div key={p.key} className="flex items-center gap-2 text-[13px]">
                <span className={p.met ? "text-success" : "text-ink-faint dark:text-on-dark-muted"}>
                  {p.met ? "✓" : "○"}
                </span>
                <span className={p.met ? "text-ink dark:text-on-dark" : "text-ink-faint dark:text-on-dark-muted"}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} disabled={!allPoliciesMet || !email} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-[14px] text-ink-muted dark:text-on-dark-muted text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-accent dark:text-accent-dark hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
