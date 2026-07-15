import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="py-12">
      <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 text-sm font-semibold">
        ⚡ AI-powered Japanese vocabulary cards
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
        Save Japanese words
        <br />
        as your personal dictionary cards.
      </h1>

      <p className="mt-5 text-gray-400 text-lg max-w-xl leading-relaxed">
        Enter a Japanese word, get AI-generated card data with readings,
        definitions, examples, and audio — then add it directly to Anki.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-transform"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}
