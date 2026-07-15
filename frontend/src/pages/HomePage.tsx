import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="py-16 text-center max-w-[680px] mx-auto">
      <h1 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-[1.07] text-ink dark:text-on-dark">
        Save Japanese words
        <br />
        as personal dictionary cards.
      </h1>

      <p className="mt-5 text-[21px] font-normal leading-[1.38] text-ink-muted dark:text-on-dark-muted max-w-[520px] mx-auto">
        Enter a word, get AI-generated readings, definitions, examples, and audio — then add directly to Anki.
      </p>

      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        <Link
          to="/cards"
          className="h-[44px] px-6 inline-flex items-center rounded-pill text-[17px] font-normal text-white bg-accent hover:bg-accent-hover dark:bg-accent-dark active:scale-[0.97] transition-all"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="h-[44px] px-6 inline-flex items-center rounded-pill text-[17px] font-normal text-accent dark:text-accent-dark border border-accent/30 dark:border-accent-dark/30 hover:bg-accent/5 dark:hover:bg-accent-dark/5 active:scale-[0.97] transition-all"
        >
          Sign in
        </Link>
      </div>

      {/* Feature grid */}
      <div className="mt-20 grid sm:grid-cols-3 gap-6 text-left">
        <FeatureCard
          emoji="🤖"
          title="AI card generation"
          description="Bedrock generates readings, definitions, expressions, examples, synonyms, and kanji data."
        />
        <FeatureCard
          emoji="🔊"
          title="Japanese audio"
          description="Amazon Polly synthesizes natural word and sentence audio from hiragana readings."
        />
        <FeatureCard
          emoji="📇"
          title="Direct Anki import"
          description="AnkiConnect adds cards with 18 fields, templates, and media to your local Anki."
        />
      </div>
    </section>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-5 rounded-lg border border-hairline dark:border-hairline-dark bg-canvas dark:bg-dark-surface">
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className="text-[14px] font-semibold mb-1">{title}</h3>
      <p className="text-[14px] text-ink-muted dark:text-on-dark-muted leading-[1.43]">{description}</p>
    </div>
  );
}
