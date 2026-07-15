import { useParams, Link } from "react-router-dom";

export default function CardDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();

  return (
    <section>
      <Link
        to="/cards"
        className="text-sm text-indigo-400 hover:underline mb-4 inline-block"
      >
        ← Back to cards
      </Link>

      <h1 className="text-2xl font-bold mb-6">Card Detail</h1>

      <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-gray-400 text-sm">Card ID: {cardId}</p>
        <p className="text-gray-500 mt-4">
          Card preview and editing will be implemented here.
        </p>
      </div>
    </section>
  );
}
