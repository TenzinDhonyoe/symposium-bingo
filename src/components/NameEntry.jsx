import { useState } from "react";

export default function NameEntry({ onSubmit, loading }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cream grain-bg">
      <div className="w-full max-w-sm text-center relative z-10">
        <div className="mb-3 text-5xl select-none animate-float text-orange-primary">⁂</div>
        <h1 className="font-display text-4xl font-extrabold text-brown mb-1">
          Symposium Bingo
        </h1>
        <p className="text-brown-medium mb-8 text-base font-body">
          Walk the booths. Take photos. Get bingo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            maxLength={30}
            autoFocus
            className="w-full px-4 py-3.5 text-base rounded-xl border-2 border-brown-light/20
                       focus:border-orange-primary focus:outline-none focus:ring-2
                       focus:ring-orange-primary/20 bg-white font-body text-brown
                       placeholder:text-brown-light/40 transition-all"
          />
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-3.5 px-6 text-base font-display font-bold rounded-xl
                       bg-orange-primary text-white hover:bg-orange-primary/90
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transform active:scale-95 transition-all shadow-button
                       uppercase tracking-wide"
          >
            {loading ? "Setting up..." : "Let's Play"}
          </button>
        </form>

        <p className="mt-10 text-xs text-brown-light/50 font-body">
          Socratica Symposium 2026 · The Tannery
        </p>
      </div>
    </div>
  );
}
