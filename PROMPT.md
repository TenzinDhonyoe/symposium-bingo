# Symposium Bingo — Build Spec (v2: In-Person Photo Bingo)

## Concept

In-person attendees at the Socratica Symposium 2026 (March 22, The Tannery, Waterloo) walk around 65+ demo booths, taking photos of demos to mark bingo squares. Photo-verified, Supabase backend, prize for first winner.

## What to Build

A mobile-first React web app with a 5x5 bingo card. Players enter their name, get a board, and mark squares by taking photos at demo booths. Photos upload to Supabase Storage, squares show the photo as background. First person to get 5 in a row wins.

### User Flow

1. **Name entry screen** — first screen asks for your name (no auth/password). Generates a `session_id`, saves to localStorage.
2. **Bingo board** — 5x5 grid. Center = FREE (auto-marked). Other 24 squares have booth-visiting prompts.
3. **Tap a square** → opens native phone camera via `<input type="file" accept="image/*" capture="environment">`.
4. **Photo uploads** → client-side compressed (800px max, 0.7 JPEG quality), uploaded to Supabase Storage.
5. **Square marked** → photo becomes the square's background image.
6. **Bingo detected** → confetti + claim code generated + share to X.
7. **Verification** → winner screenshots board + claim code, organizer checks photos in Supabase dashboard.

### Bingo Squares (in-person booth prompts)

- Found a hardware project
- Saw a robot move
- Talked to a first-time demoer
- Someone explained their project with pure excitement
- Spotted a Raspberry Pi
- Found an art installation
- Saw live soldering
- Project uses AI/ML
- Someone built a game
- Talked to someone about their "why"
- Found a 3D printed object
- Project started as a class assignment
- Bio/health tech project spotted
- Someone's wearing Socratica merch
- Music or sound art demo
- Project involves LEDs
- Saw a live coding demo
- Found an open source project
- Unexpected collaboration between projects
- Took a photo with a demoer
- Found a project that made you feel something
- Heard "we built this in a weekend"
- Project solves a real problem
- Found the most creative booth setup
- Talked to someone from a different faculty
- Saw a demo that blew your mind
- Project has a great name
- Found a sustainability/climate project
- Someone demoed something that didn't work (and recovered)
- Youngest demoer you can find

### Supabase Schema

**Table: `players`**
- `id` (uuid, PK, default gen_random_uuid())
- `session_id` (text, unique) — generated client-side, stored in localStorage
- `name` (text)
- `board` (jsonb) — the 5x5 array of square texts assigned to this player
- `marked` (jsonb) — array of marked square indices
- `created_at` (timestamptz, default now())

**Table: `photos`**
- `id` (uuid, PK, default gen_random_uuid())
- `player_id` (uuid, FK → players.id)
- `square_index` (integer) — 0-24, which square this photo proves
- `photo_url` (text) — Supabase Storage public URL
- `created_at` (timestamptz, default now())

**Table: `wins`**
- `id` (uuid, PK, default gen_random_uuid())
- `player_id` (uuid, FK → players.id)
- `claim_code` (text, unique) — 6-char alphanumeric
- `winning_line` (jsonb) — which squares formed the bingo
- `verified` (boolean, default false)
- `created_at` (timestamptz, default now())

**Storage bucket: `bingo-photos`**
- Public read access
- Path: `{session_id}/{square_index}.jpg`

### Core Features

1. **Name entry screen** — text input + "Let's Play" button. Saves name + session_id to Supabase `players` table.
2. **5x5 Bingo Grid** — each square tappable to open camera. Center = FREE (auto-marked with ⁂).
3. **Photo capture + upload** — compress client-side, upload to Supabase Storage, mark square, show photo as background.
4. **Bingo Detection** — check all rows/cols/diags after every mark. On bingo: confetti + claim code.
5. **Claim code** — 6-char alphanumeric, stored in `wins` table. Winner shows this to organizer.
6. **Share to X** — pre-filled tweet: "BINGO! 🎉 Playing Symposium Bingo at @socraticainfo ⁂"
7. **Session persistence** — localStorage stores session_id + name. On revisit, fetch board + marks from Supabase.
8. **Image compression** — resize to 800px max dimension, JPEG quality 0.7 before upload.
9. **No shuffle** — one board per player for the event.

### Design Direction

- **Mobile-first** — will be used on phones walking around the Tannery
- **Color palette**: Socratica brand — blues (#abe0ff, #9fc1ff), oranges/yellows (#f88944, #ffdb94, #ffc351), purples (#d4c6ff), cream/white backgrounds
- **Typography**: Syne (display) + DM Sans (body) from Google Fonts
- **Vibe**: Playful, bold, zine aesthetic. Slight rotation on squares, rounded corners, playful shadows.
- **The ⁂ symbol** — center FREE square
- **Animations**: Scale bounce on photo capture. Confetti on bingo. Staggered entrance on load.
- **Photo squares**: marked squares show the captured photo as a background with slight overlay for text readability

### Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **Supabase** (Database + Storage)
- **canvas-confetti** (npm)
- **browser-image-compression** or manual canvas resize for image compression
- Deploy to **Vercel**

### File Structure

```
symposium-bingo/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── data/
│   │   └── squares.js
│   ├── components/
│   │   ├── NameEntry.jsx
│   │   ├── BingoCard.jsx
│   │   ├── BingoSquare.jsx
│   │   ├── Header.jsx
│   │   ├── WinScreen.jsx
│   │   └── ShareButton.jsx
│   └── styles/
│       └── index.css
└── public/
    ├── favicon.svg
    └── manifest.json
```

### Implementation Details

- Board state: 5x5 array of `{ text: string, marked: boolean, photoUrl: string | null }`.
- On first visit: generate session_id (crypto.randomUUID()), show name entry.
- On name submit: shuffle 24 of 30 squares, create player in Supabase with board.
- On revisit (session_id in localStorage): fetch player from Supabase, restore board + marks.
- Photo upload path: `{session_id}/{square_index}.jpg` in `bingo-photos` bucket.
- Claim code: 6 random alphanumeric chars (A-Z0-9), check uniqueness before insert.
- Confetti fires from bottom: `origin: { x: 0.5, y: 1.0 }`.
- Share button: twitter intent URL.
- Footer: "built with fomo on a plane ✈️ by @_tenZdhon_"

### What's NOT included

- No auth/password (just name entry)
- No shuffle button (one board per player)
- No sound effects (focus on photo experience)
- No "Almost Bingo" indicator
- No screenshot sharing (the photos ARE the content)
- No dark mode

### Deployment

```bash
npm run build
npx vercel --prod
```

Environment variables needed:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
