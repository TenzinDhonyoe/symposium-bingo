import BingoSquare from "./BingoSquare";

export default function BingoCard({ board, onCapture, disabled }) {
  return (
    <div className="px-3 py-2">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-md mx-auto">
        {board.flat().map((square, index) => (
          <BingoSquare
            key={index}
            square={square}
            index={index}
            onCapture={onCapture}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
