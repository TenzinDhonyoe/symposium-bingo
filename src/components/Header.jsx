export default function Header({ name, markedCount }) {
  const percentage = (markedCount / 25) * 100;

  return (
    <header className="px-4 pt-4 pb-2">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-xl font-bold text-brown flex items-center gap-1.5">
          Symposium Bingo <span className="text-orange-primary">⁂</span>
        </h1>
        <span className="text-brown-light text-sm">⁂</span>
      </div>

      {/* Active session badge + counter */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-block bg-green-badge-bg text-green-badge text-xs font-bold font-body px-3 py-1 rounded-full uppercase tracking-wide">
          Active Session
        </span>
        <span className="font-display text-2xl font-bold text-brown">
          {markedCount}/25 <span className="text-base font-semibold text-brown-light">Marked</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Motivational text */}
      <p className="text-brown-medium text-sm font-body text-center italic">
        You're making history, one square at a time.
      </p>
    </header>
  );
}
