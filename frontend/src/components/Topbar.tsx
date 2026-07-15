import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../stores/auth-store";
import { signOut } from "../lib/auth/auth-service";
import HelpModal from "./HelpModal";

export default function Topbar() {
  const { t, i18n } = useTranslation();
  const { status, user } = useAuthStore();
  const isAuthenticated = status === "authenticated";

  const [theme, setTheme] = useState(() =>
    localStorage.getItem("anki-helper-theme") || "dark"
  );
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("anki-helper-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem("anki-helper-language", lang);
  }

  return (
    <header className="sticky top-0 z-50 h-[52px] border-b border-hairline dark:border-hairline-dark bg-canvas/80 dark:bg-dark-canvas/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-[980px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-[21px] font-semibold tracking-tight text-ink dark:text-on-dark">
            ANKI-HELPER
          </span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-0.5">
          {/* Nav links */}
          {isAuthenticated ? (
            <>
              <NavLink to="/cards">{t("cards")}</NavLink>
              <NavLink to="/settings">{t("settings")}</NavLink>
            </>
          ) : (
            <NavLink to="/cards">{t("cards")}</NavLink>
          )}

          <NavButton onClick={() => setHelpOpen(true)}>How to use</NavButton>

          {/* Separator */}
          <div className="w-px h-4 mx-2 bg-hairline dark:bg-hairline-dark" />

          {/* Language */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="h-7 px-2 rounded-xs bg-transparent text-[12px] text-ink-muted dark:text-on-dark-muted border-none outline-none cursor-pointer hover:text-ink dark:hover:text-on-dark transition-colors"
          >
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
          </select>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 rounded-xs grid place-items-center text-ink-muted dark:text-on-dark-muted hover:text-ink dark:hover:text-on-dark transition-colors"
            aria-label="Toggle theme"
          >
            <span className="text-[14px]">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>

          {/* Separator */}
          <div className="w-px h-4 mx-2 bg-hairline dark:bg-hairline-dark" />

          {/* Auth */}
          {isAuthenticated ? (
            <>
              <span className="text-[12px] text-ink-muted dark:text-on-dark-muted hidden sm:inline max-w-[120px] truncate">
                {user?.email}
              </span>
              <NavButton onClick={() => signOut()}>{t("signOut")}</NavButton>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[12px] text-accent dark:text-accent-dark hover:underline px-2 py-1"
              >
                {t("signIn")}
              </Link>
              <Link
                to="/signup"
                className="h-7 px-3 inline-flex items-center rounded-pill text-[12px] font-normal text-white bg-accent hover:bg-accent-hover dark:bg-accent-dark transition-colors"
              >
                {t("signUp")}
              </Link>
            </>
          )}
        </nav>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-2.5 py-1 text-[12px] text-ink-muted dark:text-on-dark-muted hover:text-ink dark:hover:text-on-dark transition-colors"
    >
      {children}
    </Link>
  );
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-[12px] text-ink-muted dark:text-on-dark-muted hover:text-ink dark:hover:text-on-dark transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
