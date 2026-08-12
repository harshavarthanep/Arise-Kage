# Arise Kage — Level Up. For Real.

A premium, offline-first fitness PWA: workout logging, water tracking, progress
photos, body metrics, and a real-actions-only quest/XP system — reskinned around
Solo Leveling's rank-up fantasy and Naruto's "ninja way" persistence. 100% free,
forever. No ads, no subscriptions, no locked features.

This package includes **two versions of the same app**:

- `single-file/` — the entire app in one `index.html` (plus one unavoidable
  `sw.js`, explained below). Good for a quick drop-in, a personal backup copy,
  or hosting anywhere that only wants one file to manage.
- `modular/` — the same app split into a clean multi-file structure
  (`css/`, `js/`, `icons/`, `manifest.json`, `sw.js`). This is what you want
  for a real GitHub Pages deployment you'll keep maintaining.

Both were built from the same design and pass the same test flow (onboarding,
workout logging with rest timers and PRs, water tracking, progress photos
saved to IndexedDB, quests/achievements, theme customization, JSON backup/
restore, and PWA install/offline behavior).

## Why research shaped this build

Before writing code, I looked at what people on Reddit, Quora, and product
write-ups actually complain about in fitness apps, and designed against it
directly:

- **"Too many taps to log a set"** → sets pre-fill with your last weight/reps,
  one tap marks a set done, rest timer starts automatically.
- **Fragmented apps (training / water / sleep / photos all separate)** →
  everything lives in one app with one home dashboard.
- **Paywalled routines / features** → nothing in this app is ever locked.
  There is no premium tier to build, so there's nothing to gate.
- **Hollow gamification (points that don't mean anything)** → XP and quests
  are tied to logged reality (a real set, a real photo, a real water goal
  hit) — not just app opens.
- **Cumbersome onboarding** → 5 short steps, skippable defaults, under a
  minute to your first "Arise."
- **Battery/GPS drain** → no background location tracking; this is a
  lightweight logging app, not a GPS run tracker.

## Features

**Core tracking:** workout logging (built-in exercise library + 4 starter
routines: PPL, Upper/Lower, GZCLP, Full Body, plus freestyle sessions),
rest timer, automatic PR detection, water tracking with quick presets and a
7-day history chart, body metrics (weight/measurements) with a trend
sparkline, sleep logging.

**The unique stuff:** progress photos captured via camera/file input and
stored *only* in your browser's IndexedDB (never uploaded anywhere,
before/after comparison slider), a real-actions XP/level/rank system
(E → SS "Shadow Monarch"), daily quests generated from your actual data,
16 achievements (some secret — try the Konami code), a canvas-generated
"Share Report" card with an animated speedometer-style weekly consistency
gauge you can download or share natively, deep theme customization (2
anime-inspired presets + light mode + any custom accent color), and a JSON
export/import so your data is never locked in.

**Under the hood:** installable PWA (works offline after first load),
localStorage for app state + IndexedDB for photos, optional Firebase
Firestore sync for cross-device backup of everything *except* photos (your
own free Firebase project — Spark plan, no card required), all icons as
inline SVG, zero build step.

## Running it locally

Both versions need to be served over `http://` (not opened as a bare
`file://`) for the service worker and IndexedDB to behave correctly in every
browser. From either folder:

```bash
cd single-file   # or: cd modular
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploying to GitHub Pages

1. Push the contents of `modular/` (recommended) to a repo — either the repo
   root, or a `/docs` folder if you'd rather keep it separate from other code.
2. In the repo's Settings → Pages, set the source to that branch/folder.
3. Wait a minute for the first deploy, then open the `github.io` URL GitHub
   gives you. On phones, use "Add to Home Screen" to install it as an app.

If you'd rather deploy the single-file version, push `single-file/index.html`
and `single-file/sw.js` together — same two files, same steps.

## Connecting Firebase (optional, still 100% free)

Photos never leave your device — this step is only for syncing your
workouts/water/nutrition/metrics across multiple devices.

1. Go to [firebase.google.com](https://firebase.google.com), create a project
   on the **Spark plan** (the free plan — no credit card).
2. In your project, enable **Authentication → Anonymous** sign-in, and create
   a **Firestore database** (start in test mode, then lock it down with rules
   like the ones below).
3. In Project Settings → General, add a **Web app** and copy the
   `firebaseConfig` object it gives you.
4. In Arise Kage, go to **More → Connect Firebase**, paste that config JSON,
   and tap Connect.

Suggested Firestore security rule so each anonymous user can only touch their
own document:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /arisekage_users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

**A note on API keys:** a Firebase web config (`apiKey`, `projectId`, etc.) is
meant to be public-ish (it identifies your project, it doesn't authorize
access on its own — your Firestore rules do that). Still, treat it as
sensitive-by-default: don't paste it into public chat logs or unrelated
repos, and rely on the security rules above to actually protect the data.

## Data & privacy model

- **Photos**: IndexedDB, on-device only. Deleting the app/browser data
  deletes them. They are explicitly excluded from any Firebase sync payload.
- **Everything else** (workouts, water, nutrition, metrics, settings,
  gamification state): localStorage, optionally mirrored to your own
  Firebase project if you connect one.
- **Backup**: More → Export Backup (JSON) downloads everything (including
  photo *metadata*, not the images themselves — those stay local). Import
  restores from that file.
- **Reset**: More → Reset All Data wipes localStorage and IndexedDB on this
  device. This is local and irreversible; there's no server-side copy to
  restore from unless you'd connected Firebase.

## Known constraints (so nothing here overpromises)

- A truly single-file PWA can't register a working service worker — browsers
  require service worker scripts to be a same-origin `http(s)` file, not a
  `blob:`/`data:` URL. So `single-file/` is really "one HTML file that holds
  100% of the app" plus one small `sw.js` needed purely for offline caching;
  without it the app still works, just without offline support.
- There's no calorie/food database or barcode scanner — nutrition tracking is
  a lightweight manual macro logger. Adding a real food database is the
  natural next step and would need a free/open data source (e.g. Open Food
  Facts' API) rather than a paid one, to keep the free-forever promise.
- Firebase sync covers app data; it does not sync photos between devices
  (by design — see privacy model above).

## Project structure (modular build)

```
modular/
  index.html          shell markup + screen containers + script/style includes
  manifest.json        PWA manifest
  sw.js                 service worker (offline cache)
  css/styles.css        entire design system (themes, components, animations)
  icons/                app icon (SVG source + generated PNGs)
  js/
    storage.js          state shape, localStorage load/save, IndexedDB photo store
    gamification.js     XP/level/rank math, quote pack, achievements
    content.js          confetti/FX helpers, exercise library, routine templates, daily quests
    sheet-router.js      bottom-sheet modal + screen router
    onboarding.js        first-run wizard
    ui-home.js           dashboard screen
    workout.js           workout logging, rest timer, exercise picker, history
    water.js             water tracking + 7-day chart
    body.js              progress photos, body metrics, sleep
    quests-share.js       quests/achievements screen + canvas share-card generator
    settings-sync.js      settings screen, backup export/import, Firebase sync
    bootstrap.js          theming, PWA setup, easter eggs, app boot sequence
```

---

Built 2026-08-12. No subscriptions, no ads, no locked features — and none
planned. If something's missing, the JSON export means your data was never
trapped in the first place.
