import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-ink dark:text-on-dark">
      <Topbar />
      <main className="w-full max-w-[980px] mx-auto px-5 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-hairline dark:border-hairline-dark bg-canvas-alt dark:bg-dark-surface">
        <div className="max-w-[980px] mx-auto px-5 py-4 text-[12px] text-ink-faint dark:text-on-dark-muted">
          Card data is sent only to AnkiConnect on this computer. No data is stored on external servers except your personal card collection on AWS.
        </div>
      </footer>
    </div>
  );
}
