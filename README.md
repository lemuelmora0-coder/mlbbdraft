# MPL Draft AI — Season 17

An AI-powered Mobile Legends: Bang Bang drafting tool built around the **MPL PH Season 17** meta. Get real-time hero suggestions and post-draft analysis powered by Claude.

![MPL Draft AI screenshot](https://i.imgur.com/placeholder.png)

---

## ✨ Features

- 🎯 **Full MLBB draft order** — Phase 1 bans → picks → Phase 2 bans → picks (18 steps total)
- 🤖 **AI Suggestions** — Claude analyzes the current draft state and recommends the best pick or ban based on MPL S17 meta
- 📊 **Draft Analysis** — After the draft completes, get a full breakdown: win conditions, team strengths, key matchups, and draft advantage
- ⚡ **Auto-Draft mode** — AI automatically requests a suggestion after every selection
- 🏅 **S17 Hero stats** — Pick rate, ban rate, and win rate for every hero based on MPL PH Season 17 regular season
- 🔍 **Hero tooltip** — Hover any hero card to see their S17 stats instantly
- 🔎 **Search & filter** — Filter by role or search by name
- ↩ **Undo** — Step back at any point in the draft

---

## 🚀 Quick Start

### Option A: Open directly (no server needed)

> **Note:** Because the app uses ES Modules (`import/export`), you need a local server. Browsers block modules over `file://`.

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code: install "Live Server" extension and click "Go Live"
```

Then open **http://localhost:8080** in your browser.

### Option B: Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source → Deploy from branch → main / root**
3. Visit `https://<your-username>.github.io/<repo-name>/`

---

## 🔑 API Key Setup

1. Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com)
2. When the app loads, click **"⚙ API Key"** in the top-right
3. Paste your key (starts with `sk-ant-api...`)
4. Click **Save & Continue**

> Your API key is stored in `sessionStorage` only — it's never sent anywhere except directly to `api.anthropic.com`.

You can use the app **without an API key** — the draft board still works, you just won't get AI suggestions.

---

## 📁 File Structure

```
mpl-draft-ai/
├── index.html          # App entry point
├── css/
│   └── style.css       # All styles (dark esports theme)
├── js/
│   ├── heroes.js       # Hero data + MPL S17 stats + DRAFT_ORDER
│   ├── draft.js        # Draft state management (pure functions)
│   ├── ai.js           # Anthropic API integration
│   └── app.js          # Main controller / DOM orchestration
└── README.md
```

---

## 🦸 Hero Data

`js/heroes.js` contains:

- **68 heroes** with roles, pick rate, ban rate, win rate, and tier (S/A/B/C)
- **MPL PH S17 Teams**: TLPH, TWPH, APBR, RORA, OMG, TNC, ONPH, FLCP
- **DRAFT_ORDER** — the standard MLBB competitive draft sequence
- **META_CONTEXT** — a text summary of S17 meta fed to the AI for context

Stats are approximated from MPL PH Season 17 regular season records. To update them, edit the values in `heroes.js`.

---

## 🤖 AI Behavior

The AI uses **Claude Sonnet** via the Anthropic API. For each step it receives:

- Current picks and bans for both teams
- All available heroes
- Whether the action is a **ban** (focus on threat assessment) or **pick** (focus on synergy)
- A meta summary of MPL S17 (tier lists, common compositions, win conditions)

The response includes:
- ✅ **Recommended hero**
- 📝 **Reasoning** (2–3 sentences citing MPL S17 meta)
- 🔄 **2 alternatives**
- ⚠️ **Threat level**: LOW / MEDIUM / HIGH / CRITICAL

---

## 🛠 Customization

### Update hero stats
Edit the `HEROES` array in `js/heroes.js`. Each entry has:
```js
{ id, name, role, icon, pickRate, banRate, winRate, tier, color }
```

### Add new heroes
Add an entry to the `HEROES` array. The app will automatically include them.

### Change the AI model
In `js/ai.js`, update the `model` field:
```js
model: 'claude-sonnet-4-20250514'  // change this
```

### Update meta context
Edit the `META_CONTEXT` string in `js/heroes.js` to reflect the current MPL season.

---

## 📜 License

MIT — free to use, modify, and distribute.

---

*Built with MPL PH S17 data and powered by [Claude](https://anthropic.com).*
