import { useRef, useState } from "react";

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 sm:w-6 sm:h-6 text-orange-primary"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CameraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-brown-light/40"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export default function BingoSquare({ square, index, onCapture, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    if (square.isCenter || square.marked || disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onCapture(index, file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const row = Math.floor(index / 5);
  const col = index % 5;
  const rotation = ((row * 5 + col) % 7 - 3) * 0.8;

  return (
    <button
      onClick={handleClick}
      disabled={square.isCenter || square.marked || disabled}
      className={`
        relative aspect-square rounded-lg overflow-hidden
        transition-all duration-200 ease-out
        font-body text-[9px] sm:text-[11px] leading-tight
        flex flex-col items-center justify-center p-1 text-center
        ${square.isCenter
          ? "square-free cursor-default"
          : square.marked
            ? "square-marked shadow-marked cursor-default"
            : "square-paper hover:shadow-card-hover active:scale-95 cursor-pointer"
        }
        ${uploading ? "animate-pulse" : ""}
      `}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Photo background for marked squares */}
      {square.marked && square.photoUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${square.photoUrl})` }}
        >
          <div className="absolute inset-0 bg-orange-pale/70" />
        </div>
      )}

      {/* Center FREE square */}
      {square.isCenter && (
        <span className="relative z-10 text-white font-display font-bold text-sm sm:text-base select-none">
          FREE
        </span>
      )}

      {/* Unmarked square content */}
      {!square.isCenter && !square.marked && (
        <>
          <span className="relative z-10 text-brown font-semibold select-none mb-0.5 line-clamp-3">
            {square.text}
          </span>
          <CameraIcon />
        </>
      )}

      {/* Marked square content */}
      {!square.isCenter && square.marked && (
        <>
          <div className="relative z-10 mb-0.5 animate-pop-in">
            <CheckIcon />
          </div>
          <span className="relative z-10 text-brown font-semibold select-none text-[8px] sm:text-[10px] line-clamp-2 opacity-80">
            {square.text}
          </span>
        </>
      )}

      {/* Upload spinner */}
      {uploading && (
        <div className="absolute inset-0 bg-cream/80 flex items-center justify-center z-20 rounded-lg">
          <div className="w-5 h-5 border-2 border-orange-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* File input */}
      {!square.isCenter && !square.marked && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </button>
  );
}
