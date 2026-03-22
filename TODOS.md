# TODOS

## P2

### Reusable Event Bingo Template
Extract squares, colors, branding into a config file so anyone can fork this for their own event (hackathons, conferences, watch parties). Turn `squares.js` into a template, make theme colors configurable.
- **Why:** Broader utility, open-source potential. The architecture already supports this via `squares.js` data file.
- **Effort:** M (human ~1 week / CC ~30min)
- **Depends on:** v1 shipped and validated

## P3

### Analytics
Add Plausible or Umami analytics to track how many people played, how many got bingo, popular squares.
- **Why:** Know if anyone actually used it. Inform whether the template TODO is worth pursuing.
- **Effort:** S (human ~30min / CC ~5min)
- **Depends on:** Deployed to production

### Dark Mode Toggle
Add a dark/light mode toggle. The Socratica palette works well in both modes.
- **Why:** Nice for evening viewing of the livestream.
- **Effort:** S (human ~2hrs / CC ~5min)
- **Depends on:** Nothing

## Deferred from CEO Review

### Live Multiplayer Sync
Real-time board sync so everyone sees the same game state. Needs a backend (WebSocket or Firebase).
- **Why:** The 10x version — communal game, not solo.
- **Effort:** L (human ~2 weeks / CC ~2hrs)

### Live Player Counter
Show how many people are currently playing. Needs analytics backend.
- **Effort:** M (human ~1 week / CC ~30min)

### "How to Play" Modal
Tooltip or modal explaining the rules for confused visitors.
- **Effort:** S (human ~1hr / CC ~5min)
