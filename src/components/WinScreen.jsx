import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function WinScreen({ claimCode, playerName, onDismiss }) {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors: ["#e8723a", "#f5a664", "#7c5cc4", "#fde4c8", "#5a7a3a"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors: ["#e8723a", "#f5a664", "#7c5cc4", "#fde4c8", "#5a7a3a"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const tweetText = encodeURIComponent(
    `BINGO! 🎉 I just won Symposium Bingo at @socraticainfo ⁂\n\nClaim code: ${claimCode}`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const dmText = encodeURIComponent(
    `Hey! I got BINGO at Symposium Bingo! 🎉\n\nName: ${playerName}\nClaim code: ${claimCode}\n\nCheck my photos to verify!`
  );
  const dmUrl = `https://twitter.com/messages/compose?recipient_id=_tenZdhon_&text=${dmText}`;

  return (
    <div className="fixed inset-0 bg-brown/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-3xl max-w-sm w-full text-center shadow-2xl animate-bounce-in grain-bg overflow-hidden">

        {/* Torn paper / craft banner */}
        <div className="relative bg-orange-primary/90 mx-6 mt-8 mb-4 py-8 px-4 rounded-lg"
          style={{
            transform: "rotate(-2deg)",
            boxShadow: "4px 6px 12px rgba(61, 44, 30, 0.3)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-2 text-3xl select-none" style={{ transform: "rotate(-15deg)" }}>⭐</div>
          <div className="absolute -top-3 right-4 text-xl select-none" style={{ transform: "rotate(20deg)" }}>✦</div>
          <div className="absolute -bottom-3 -left-1 text-2xl select-none" style={{ transform: "rotate(10deg)" }}>✕</div>
          <div className="absolute -bottom-4 right-6 text-lg select-none">😊</div>
          <div className="absolute top-2 -right-2 bg-purple w-10 h-6 rounded-sm select-none" style={{ transform: "rotate(25deg)" }} />

          <h2 className="font-display text-5xl font-extrabold text-white uppercase tracking-tight drop-shadow-md"
            style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}
          >
            BINGO!
          </h2>
          <p className="font-display text-lg font-bold text-white/90 mt-1 uppercase tracking-wide">
            You killed it!
          </p>
        </div>

        <div className="px-6 pb-8">
          {/* Claim code */}
          <div className="bg-orange-pale/50 rounded-xl p-4 mb-4 border border-orange-light/20">
            <p className="text-[10px] text-brown-medium font-body uppercase tracking-widest mb-1">
              Your claim code
            </p>
            <p className="font-display text-3xl font-bold tracking-[0.2em] text-orange-primary">
              {claimCode}
            </p>
          </div>

          {/* DM instructions */}
          <div className="bg-cream-dark rounded-xl p-4 mb-5 border border-brown-light/10">
            <p className="text-sm text-brown font-body font-semibold mb-1">
              🏆 To claim your prize:
            </p>
            <p className="text-xs text-brown-medium font-body leading-relaxed">
              DM <span className="font-semibold text-brown">@_tenZdhon_</span> on X with your name and claim code. I'll verify your photos!
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2.5">
            <a
              href={dmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6
                         text-sm font-display font-bold rounded-xl
                         bg-orange-primary text-white hover:bg-orange-primary/90
                         active:scale-95 transition-all shadow-button
                         uppercase tracking-widest"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              DM to Claim Prize
            </a>

            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6
                         text-sm font-display font-bold rounded-xl
                         bg-brown text-cream hover:bg-brown-light
                         active:scale-95 transition-all shadow-button
                         uppercase tracking-widest"
              style={{ transform: "rotate(0.5deg)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share to X
            </a>

            <button
              onClick={onDismiss}
              className="block w-full py-3 px-6 text-xs font-display font-semibold rounded-xl
                         text-brown-light/60 hover:text-brown-light
                         transition-all uppercase tracking-widest"
            >
              Back to Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
