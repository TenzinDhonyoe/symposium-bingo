export default function ShareButton({ onShuffle }) {
  const shareText = encodeURIComponent(
    "Playing Symposium Bingo at @socraticainfo ⁂ symposium.socratica.info"
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <div className="px-6 py-4 max-w-md mx-auto space-y-3">
      {/* Shuffle button — outlined, slight angle */}
      <button
        onClick={onShuffle}
        className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6
                   text-sm font-display font-bold rounded-xl
                   border-2 border-brown-light/25 text-brown bg-white
                   hover:bg-cream-dark active:scale-95
                   transition-all shadow-card uppercase tracking-widest"
        style={{ transform: "rotate(-1deg)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
        Shuffle Board
      </button>

      {/* Share button — filled brown, slight angle */}
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6
                   text-sm font-display font-bold rounded-xl
                   bg-brown-medium text-white hover:bg-brown-light
                   active:scale-95 transition-all shadow-button
                   uppercase tracking-widest"
        style={{ transform: "rotate(1deg)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Share to X
      </a>
    </div>
  );
}
