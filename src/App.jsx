import { useState, useEffect, useCallback } from "react";
import NameEntry from "./components/NameEntry";
import Header from "./components/Header";
import BingoCard from "./components/BingoCard";
import WinScreen from "./components/WinScreen";
import ShareButton from "./components/ShareButton";
import { generateBoard, checkBingo, generateClaimCode } from "./data/squares";
import { compressImage } from "./lib/compress";
import {
  supabase,
  createPlayer,
  getPlayer,
  updateMarked,
  uploadPhoto,
  savePhoto,
  claimWin,
  getWin,
} from "./lib/supabase";

function rebuildBoard(boardTexts, markedIndices, photoUrls) {
  const board = [];
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      const idx = r * 5 + c;
      const isCenter = r === 2 && c === 2;
      row.push({
        text: boardTexts[r][c],
        marked: isCenter || markedIndices.includes(idx),
        photoUrl: photoUrls[idx] || null,
        isCenter,
      });
    }
    board.push(row);
  }
  return board;
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [name, setName] = useState("");
  const [board, setBoard] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [claimCode, setClaimCode] = useState(null);
  const [showWin, setShowWin] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const storedSessionId = localStorage.getItem("bingo_session_id");
        const storedName = localStorage.getItem("bingo_name");

        if (storedSessionId && storedName) {
          const player = await getPlayer(storedSessionId);
          if (player) {
            setSessionId(storedSessionId);
            setName(storedName);
            setPlayerId(player.id);

            // Fetch photo URLs for marked squares
            const photoUrls = {};
            if (player.marked && player.marked.length > 0) {
              for (const idx of player.marked) {
                const path = `${storedSessionId}/${idx}.jpg`;
                const { data } = supabase.storage
                  .from("bingo-photos")
                  .getPublicUrl(path);
                photoUrls[idx] = data.publicUrl;
              }
            }

            const restoredBoard = rebuildBoard(
              player.board,
              player.marked || [],
              photoUrls
            );
            setBoard(restoredBoard);

            // Check for existing win
            const existingWin = await getWin(player.id);
            if (existingWin) {
              setClaimCode(existingWin.claim_code);
            }

            setScreen("game");
            return;
          }
        }

        setScreen("name");
      } catch (err) {
        console.error("Init error:", err);
        setScreen("name");
      }
    };

    init();
  }, []);

  const handleNameSubmit = async (playerName) => {
    setSetupLoading(true);
    setError(null);

    try {
      const newSessionId = crypto.randomUUID();
      const newBoard = generateBoard();

      const player = await createPlayer(newSessionId, playerName, newBoard);

      localStorage.setItem("bingo_session_id", newSessionId);
      localStorage.setItem("bingo_name", playerName);

      setSessionId(newSessionId);
      setName(playerName);
      setPlayerId(player.id);
      setBoard(newBoard);
      setScreen("game");
    } catch (err) {
      console.error("Setup error:", err);
      setError("Something went wrong. Try again?");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleCapture = useCallback(
    async (flatIndex, file) => {
      if (!playerId || !sessionId) return;

      try {
        const r = Math.floor(flatIndex / 5);
        const c = flatIndex % 5;
        const taskText = board[r][c].text;

        const compressed = await compressImage(file);
        const photoUrl = await uploadPhoto(sessionId, flatIndex, compressed);
        await savePhoto(playerId, flatIndex, photoUrl, taskText);

        let markedIndices;
        let winningLine;

        setBoard((prev) => {
          const next = prev.map((row) => row.map((sq) => ({ ...sq })));
          const r = Math.floor(flatIndex / 5);
          const c = flatIndex % 5;
          next[r][c].marked = true;
          next[r][c].photoUrl = photoUrl;

          markedIndices = [];
          for (let ri = 0; ri < 5; ri++) {
            for (let ci = 0; ci < 5; ci++) {
              if (next[ri][ci].marked && !next[ri][ci].isCenter) {
                markedIndices.push(ri * 5 + ci);
              }
            }
          }

          winningLine = checkBingo(next);
          return next;
        });

        await updateMarked(playerId, markedIndices);

        if (winningLine && !claimCode) {
          const code = generateClaimCode();
          setClaimCode(code);
          setShowWin(true);
          await claimWin(playerId, code, winningLine);
        }
      } catch (err) {
        console.error("Capture error:", err);
        alert("Photo upload failed. Check your connection and try again.");
      }
    },
    [playerId, sessionId, claimCode]
  );

  const handleShuffle = useCallback(async () => {
    if (!playerId) return;

    const newBoard = generateBoard();
    setBoard(newBoard);
    setClaimCode(null);
    setShowWin(false);

    // Update board + clear marks in Supabase
    try {
      await supabase
        .from("players")
        .update({
          board: newBoard.map((row) => row.map((sq) => sq.text)),
          marked: [],
        })
        .eq("id", playerId);
    } catch (err) {
      console.error("Shuffle sync error:", err);
    }
  }, [playerId]);

  const markedCount = board
    ? board.flat().filter((sq) => sq.marked).length
    : 0;

  if (screen === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream grain-bg">
        <div className="text-center relative z-10">
          <div className="text-4xl animate-float select-none mb-4 text-orange-primary">⁂</div>
          <p className="text-brown-light font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (screen === "name") {
    return (
      <>
        <NameEntry onSubmit={handleNameSubmit} loading={setupLoading} />
        {error && (
          <div className="fixed bottom-4 left-4 right-4 bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm font-body z-50">
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cream grain-bg">
      <div className="relative z-10">
        <Header name={name} markedCount={markedCount} />
        <BingoCard board={board} onCapture={handleCapture} disabled={false} />

        {claimCode && !showWin && (
          <div className="text-center py-3">
            <button
              onClick={() => setShowWin(true)}
              className="text-sm text-orange-primary font-display font-bold underline underline-offset-2"
            >
              🎉 BINGO! Code: {claimCode} — Tap to see
            </button>
          </div>
        )}

        <ShareButton onShuffle={handleShuffle} />

        <footer className="text-center pb-4 pt-2">
          <p className="text-xs text-brown-light/40 font-body">
            built with fomo on a plane ✈️ by{" "}
            <a
              href="https://twitter.com/_tenZdhon_"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brown-light"
            >
              @_tenZdhon_
            </a>
          </p>
        </footer>
      </div>

      {showWin && claimCode && (
        <WinScreen
          claimCode={claimCode}
          playerName={name}
          onDismiss={() => setShowWin(false)}
        />
      )}
    </div>
  );
}
