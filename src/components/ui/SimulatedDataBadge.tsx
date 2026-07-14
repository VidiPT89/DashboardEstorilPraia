type SimulatedDataBadgeProps = {
  label: string;
  note: string;
};

export function SimulatedDataBadge({ label, note }: SimulatedDataBadgeProps) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4 text-sm"
      style={{
        borderColor: "var(--simulated-border)",
        backgroundColor: "var(--simulated-bg)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="var(--simulated-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div>
        <p className="font-semibold" style={{ color: "var(--simulated-accent)" }}>
          {label}
        </p>
        <p className="mt-0.5 text-[var(--muted)]">{note}</p>
      </div>
    </div>
  );
}
