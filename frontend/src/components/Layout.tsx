import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Topbar />
      <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-center text-gray-500 text-sm py-6">
        Card data is sent only to AnkiConnect on this computer.
      </footer>
    </div>
  );
}
