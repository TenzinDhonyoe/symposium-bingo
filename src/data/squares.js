export const ALL_SQUARES = [
  "Found a hardware project",
  "Saw a robot move",
  "Met someone with 10K+ on X",
  "Talked to a first-time demoer",
  "Met someone who goes to UofT",
  "Spotted a Raspberry Pi",
  "Found an art installation",
  "Saw live soldering",
  "Project uses AI/ML",
  "Someone built a game",
  "Found a 3D printed object",
  "Custom PCB",
  "Found a 3D printer",
  "Bio/health tech project spotted",
  "Someone's wearing Socratica merch",
  "Music or sound art demo",
  "Project involves LEDs",
  "Saw a live coding demo",
  "Took a photo with a demoer",
  "Found the most creative booth setup",
  "Talked to someone from a different faculty",
  "Saw a demo that blew your mind",
  "Met someone outside from Canada",
  "Project has a great name",
  "Found a sustainability/climate project",
  "Someone demoed something that didn't work",
  "Youngest demoer you can find",
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
