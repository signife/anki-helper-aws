import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth-store";
import { signOut } from "../lib/auth/auth-service";

export default function Topbar() {
  const { status, user } = useAuthStore();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/10">
      <div className="max-w-[1180px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
            A
          </div>
          <span className="font-semibold tracking-tight text-white">
            ANKI-HELPER
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <NavLink to="/cards">Cards</NavLink>
              <NavLink to="/settings">Settings</NavLink>
              <span className="px-3 py-1.5 text-sm text-gray-500 hidden sm:inline">
                {user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link
                to="/signup"
                className="ml-1 px-3.5 py-1.5 rounded-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
    >
      {children}
    </Link>
  );
}
