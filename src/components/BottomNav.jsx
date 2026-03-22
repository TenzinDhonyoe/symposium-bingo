const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream border-t border-brown-light/10 z-40">
      <div className="flex items-center justify-center max-w-md mx-auto py-2">
        <div className="flex flex-col items-center gap-0.5 px-4 py-1 text-orange-primary">
          <GridIcon />
          <span className="text-[10px] font-display font-bold tracking-wider uppercase">
            PLAY
          </span>
        </div>
      </div>
    </nav>
  );
}
