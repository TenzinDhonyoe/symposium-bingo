export const ALL_SQUARES = [
  "Hardware project",
  "Robot move",
  "10K+ on X",
  "First-time demoer",
  "UofT student",
  "Raspberry Pi",
  "Art installation",
  "Live soldering",
  "AI/ML project",
  "Game project",
  "3D print",
  "Custom PCB",
  "3D printer",
  "Bio/health tech",
  "Socratica merch",
  "Music or sound demo",
  "LEDs in a project",
  "Live coding",
  "Photo with demoer",
  "Most creative booth",
  "Different faculty",
  "Mind-blowing demo",
  "Someone from abroad",
  "Great project name",
  "Sustainability project",
  "Demo that failed",
  "Youngest demoer",
  "Got a sticker",
  "Started this week",
  "Flew in for this",
  "Talked to organizer",
  "Team of 3+",
  "Solo builder",
  "Best pitch",
  "Demoer who designs",
];

export function generateBoard() {
  const shuffled = [...ALL_SQUARES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, 24);

  const board = [];
  let idx = 0;
  for (let row = 0; row < 5; row++) {
    const rowArr = [];
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        rowArr.push({ text: "FREE", marked: true, photoUrl: null, isCenter: true });
      } else {
        rowArr.push({ text: selected[idx], marked: false, photoUrl: null, isCenter: false });
        idx++;
      }
    }
    board.push(rowArr);
  }
  return board;
}

export function checkBingo(board) {
  const lines = [];

  // Rows
  for (let r = 0; r < 5; r++) {
    lines.push(board[r].map((_, c) => [r, c]));
  }
  // Columns
  for (let c = 0; c < 5; c++) {
    lines.push(board.map((_, r) => [r, c]));
  }
  // Diagonals
  lines.push([[0,0],[1,1],[2,2],[3,3],[4,4]]);
  lines.push([[0,4],[1,3],[2,2],[3,1],[4,0]]);

  for (const line of lines) {
    if (line.every(([r, c]) => board[r][c].marked)) {
      return line;
    }
  }
  return null;
}

export function generateClaimCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
