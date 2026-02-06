# Casino-328

We are here to gamble and make money

## Two Dice Roller (Web)

Open `index.html` in a browser to run a simple two-dice roller.


To serve locally (optional):

```
python3 -m http.server 8000

# then open http://localhost:8000 in your browser
```

Game rules added in UI:

Game payouts and extra win chances:

- `Double sixes` → Jackpot of $50.
- Any `doubles` (1+1, 2+2, ...) → $5 bonus.
- `Sum == 7` (Lucky 7) → $7 bonus.
- `Sum >= 10` → $10 (original rule).
- Two consecutive `low` rolls (sum <= 4) → lose $5.

- Balance persists in your browser via `localStorage`.
