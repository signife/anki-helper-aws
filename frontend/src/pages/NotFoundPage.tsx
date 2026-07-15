import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-600 mb-4">404</h1>
      <p className="text-gray-400 mb-6">Page not found</p>
      <Link
        to="/"
        className="text-indigo-400 hover:underline text-sm"
      >
        Go back home
      </Link>
    </div>
  );
}
