export default function CardInboxPage() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Cards</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">
            All
          </button>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">
            Ready
          </button>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition">
            Added
          </button>
        </div>
      </div>

      {/* Empty state */}
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg mb-2">No cards yet</p>
        <p className="text-sm">
          Enter a Japanese word to generate your first card.
        </p>
      </div>
    </section>
  );
}
