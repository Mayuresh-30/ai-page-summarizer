# AI Page Summarizer

A **Chrome extension** (Manifest V3) that reads the **visible text** of the webpage you are on, sends it to the **Google Gemini API**, and shows a short **AI summary** in the toolbar popup. Built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## What it does

1. You open any normal webpage (where the extension is allowed to run).
2. You click the extension icon and press **Summarize page**.
3. A **content script** collects readable text from headings, paragraphs, lists, tables, blockquotes, and similar blocks—preferring `main` / `article` / `[role="main"]` when present—then caps length for the API.
4. The **background service worker** calls Gemini with that text.
5. The **popup** shows the summary, errors, or a **timeout** if nothing comes back within **8 seconds**.
6. You can **Copy summary** to the clipboard.

---

## How the pieces work together

| Part | Role |
|------|------|
| **Popup** (`index.html` + React) | UI: button, loading animation, summary, copy, error and timeout messages. Talks to the background script with `chrome.runtime.sendMessage`. |
| **Background** (`background.js`) | Listens for `SUMMARIZE_PAGE`, finds the active tab, asks the content script for page text, calls `summarizeWithGemini`, sends success/failure back to the popup. Uses an async pattern so Chrome keeps the message channel open until the response is ready. |
| **Content script** (`content.js`) | On `GET_PAGE_TEXT`, builds structured text from the DOM (not raw HTML), applies a safe max length, and returns it to the background script. |
| **Gemini service** | `POST` to your configured Gemini `generateContent` URL with the page text in the request body. |

Built files land in **`dist/`** after `npm run build`. Chrome loads **`dist/`** as an unpacked extension (`manifest.json`, `index.html`, `background.js`, `content.js`, assets).

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** (multi-entry build: popup, background, content)
- **Tailwind CSS v4**
- **Chrome Extension Manifest V3** (`activeTab`, `scripting`, `tabs`, `<all_urls>` host permission for page access and API calls from the service worker)

---

## Prerequisites on your machine

- **Node.js** 20+ (LTS recommended) and **npm**
- **Google Chrome** (or another Chromium browser that supports MV3 extensions)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/) (or Google Cloud with Generative Language API enabled)

---

## Setup on your system

### 1. Clone or copy the project

```bash
cd path/to/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables (required)

Keys are injected at **build time** via Vite. They must exist in a **`.env`** file in this folder (same level as `package.json`). **Do not commit `.env`**; it is listed in `.gitignore`.

Copy the example file and edit it:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Fill in:

| Variable | Purpose |
|----------|---------|
| `VITE_API_KEY` | Your Gemini API key |
| `VITE_API_URL` | Full `generateContent` endpoint URL for the model you use (no key in the path; the app appends `?key=...`) |

Example shape (model name may differ—use the endpoint from Google’s docs for your model):

```env
VITE_API_KEY=your_key_here
VITE_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

After **any** change to `.env`, run **`npm run build`** again so the service worker bundle picks up new values.

### 4. Build the extension

```bash
npm run build
```

This runs TypeScript checking and outputs everything into **`dist/`**.

### 5. Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the **`dist`** folder inside this project (not the repo root unless that is where your built `manifest.json` lives).

You should see **AI Page Summarizer** in the list. Pin it to the toolbar if you like.

### 6. Use it

1. Open a normal **https** article or page (not `chrome://` internal pages, where content scripts do not run).
2. Click the extension icon.
3. Click **Summarize page** and wait (loading shows animated dots).
4. Read the summary or use **Copy summary**.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Typecheck + production build into `dist/` (use this before loading/updating the extension). |
| `npm run dev` | Vite dev server—handy for quick UI work; for full extension behavior, still use a **build** and **Load unpacked** from `dist/`. |
| `npm run lint` | Run ESLint. |

---

## Project layout (source)

```
frontend/
├── public/
│   └── manifest.json          # Copied to dist/; extension ID and entry points
├── src/
│   ├── App.tsx                # Popup UI, timeout, messaging
│   ├── main.tsx
│   ├── index.css              # Tailwind + loading-dot animation
│   ├── background/
│   │   └── background.ts      # Service worker: tabs + Gemini
│   ├── content/
│   │   └── content.ts         # DOM text extraction
│   ├── components/            # Summary, Footer, LoadingDots
│   ├── services/
│   │   └── gemini.service.ts  # Gemini HTTP call
│   └── utils/
│       ├── extractPageText.ts # Structured page text
│       └── textLimiter.ts     # Max length before API
├── .env.example               # Template for secrets (safe to commit)
├── .gitignore
├── package.json
├── vite.config.ts             # Multi-entry build
└── README.md
```

---

## Behavior notes

- **Empty or non-readable pages** may return an error or hit the **8-second timeout** if no usable response arrives.
- **Restricted pages** (Chrome Web Store, `chrome://`, PDF viewer, some iframes) may block content scripts—summarization will fail on those URLs.
- **API key in the client bundle**: the key is embedded in built JS inside `dist/`. Anyone with the `.crx` or unpacked folder could inspect it. For public store listings, prefer **backend proxying** or other key-protection strategies; for personal use, keep the repo private and rotate keys if leaked.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| “Could not summarize…” / instant failure | Reload the extension after build; confirm `.env` and rebuild; check the active tab is a normal web page. |
| Timeout after 8s | Slow network, API quota, or empty page text. Inspect **service worker** console: `chrome://extensions` → **Service worker** under this extension. |
| Popup stuck (should not happen) | Update to latest code; timeout logic clears loading after 8s. |
| `manifest.json` / file not found | Load **unpacked** from **`dist`**, not from `src/`. |

---

## License

Specify your license here (e.g. MIT) if you publish the repo publicly.
