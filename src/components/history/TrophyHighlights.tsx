type TrophyEntry = {
  id: string;
  year: string;
  title: string;
  description: string;
};

type TrophyHighlightsProps = {
  trophies: TrophyEntry[];
  sectionTitle: string;
};

export function TrophyHighlights({ trophies, sectionTitle }: TrophyHighlightsProps) {
  if (trophies.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="section-title text-base font-semibold">{sectionTitle}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {trophies.map((trophy, index) => (
          <div
            key={trophy.id}
            style={{ "--stagger": index } as React.CSSProperties}
            className="card card-interactive animate-in flex items-start gap-3 border-l-4 border-l-[var(--club-yellow)] p-4"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="var(--club-yellow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
              <path d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
            </svg>
            <div>
              <p className="text-xs font-semibold tabular-nums text-[var(--muted)]">{trophy.year}</p>
              <p className="text-sm font-semibold">{trophy.title}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{trophy.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
