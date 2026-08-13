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
workout logging with rest timers and PRs, per-exercise-type set entry,
custom routines, a weekly planner, water tracking, cross-training activity
log with custom sport names, the Body → Impact map, progress photos saved
to IndexedDB, XP reversal on delete, Ask Kage Q&A, quests/achievements,
theme customization (5 presets), section tours, the PWA install flow, and
JSON backup/restore) — verified with automated browser tests across
mobile, tablet, and desktop viewports on both the single-file and modular
builds independently.

## What changed, round by round

### Round 3 (this build) — the big one

This round took a long, detailed feature request and, per explicit
instruction, built past the literal ask rather than the minimum version of
it. Everything below shipped, verified with Playwright across both builds:

- **Sets can finally be removed**, not just added, mid-workout — a trash
  icon sits next to every logged set.
- **Exercises now know their own shape.** Every exercise in the library is
  tagged `weighted` (kg + reps — most barbell/dumbbell/cable lifts), `reps`
  (bodyweight, reps-only — pull-ups, push-ups, etc.), or `timed` (a duration
  in seconds, no weight field at all). Plank, planks-style holds, and cardio
  machines now correctly ask for a hold time instead of a meaningless kg
  field, and PR detection has a matching time-based / rep-based path so a
  longer plank or higher rep count can actually earn a personal record.
- **Custom exercises are properly customizable**, not just a name prompt —
  you pick how it's tracked (weighted/reps/timed), its category, and its
  primary muscle group (which feeds the body map below).
- **The Activity Log takes a typed sport name.** Picking "Type your own…"
  opens a text field for any sport, and every activity type now has an
  associated MET value so a calorie estimate (based on your logged weight)
  shows live while you log it and gets saved with the entry.
- **Nearly every logged record is now editable, not just deletable** — water
  amounts, body metrics (with the full form re-opened, pre-filled), and past
  workouts (name + every completed set's numbers) all have an edit affordance
  now, alongside the entries that were already editable (sleep, activities).
- **Body → Impact**: a body map scaled to your own logged height and weight
  (heavier/taller shows as a wider/taller figure), colored zone-by-zone by
  how much you've actually trained each muscle group in the last 7 days —
  redder means more recent volume. Tap any zone for its exact set count.
  Weekly estimated calories burned (strength + cardio combined) and a
  goal-aware "suggested next workout" card (tuned to whatever goal you set —
  strength, endurance, six-pack, fat loss, or consistency) sit right below it.
  **Design call, stated plainly:** this is a 2D SVG heatmap, not a rigged 3D
  model. A real 3D body — actually deforming a mesh by BMI, animating per-rep
  — needs a 3D engine and asset pipeline that breaks the "single static
  file, zero build step, free forever" foundation everything else here is
  built on. The 2D version delivers the same actual information (which
  muscles you're training, how hard, and what to do next) without that
  trade-off. Front-facing muscles (chest, shoulders, arms, forearms, abs,
  quads, calves) are pictured directly; back/hamstrings/glutes (not visible
  from the front) get their own progress bars underneath instead of a second
  rendered view.
- **A real weekly planner.** Assign a label — and optionally a linked
  routine, or mark it a rest day — to each day of the week from the Train
  screen. Today's plan surfaces with a one-tap Start button that drops
  straight into that routine.
- **A "?" demo on every exercise.** Tap it for a small looping animated
  pictogram of the movement pattern (squat, press, pull, curl, core brace,
  cardio, stretch) plus a one-line coaching cue, in a lightweight
  hand-built SVG animation — not a hosted video/GIF, so it works offline and
  adds no external dependency.
- **A real PWA install flow.** A custom Install/Dismiss card (not just the
  browser's own mini-infobar) — dismissing only hides it for that page load,
  so it comes back on every refresh until you actually install. Once
  installed, if you're ever back in a plain browser tab instead of the
  installed app, an "Open App" card appears instead of nagging you to
  install again.
- **Help & tours everywhere.** Every section runs a short first-visit tour
  automatically, and a "?" button in the header replays it anytime — or
  replay any section's tour from Settings → Help & Tours.
- **Two new full themes**: **Glass** (Apple iOS-style — translucent frosted
  panels, SF system font stack, blue accent) and **Nothing OS** (near-black
  canvas, dot-matrix mono type, sharp corners, signature red accent) join
  the existing Shadow Monarch / Hidden Village / Daybreak presets — five
  total, all swappable anytime from Settings.
- **New icons added, not a full redraw.** A ground-up icon redesign was
  weighed against the actual complaint (a screenshot artifact that turned
  out to be an unstyled native scrollbar, fixed in round 2) — the existing
  40+ inline-SVG icon set already reads cleanly, so effort went into adding
  the icons the new features actually needed (body map, help, install,
  weekly planner, compass) rather than redrawing icons that weren't broken.

### Round 2

Round 1 shipped working but rough: real layout bugs, a broken "+" button,
and gamification numbers that didn't always add up. Everything below was
found and fixed with automated browser testing (Playwright) across mobile,
tablet, and desktop — not just eyeballed — plus a deliberate design pass
taking cues from Apple's Human Interface Guidelines (clarity, restraint,
generous spacing), Nothing OS (monospaced "instrument panel" numerals,
industrial precision), and OxygenOS (fluid, spring-based motion):

- **XP now reverses when you undo the thing that earned it.** This was the
  sharpest bug reported: log 250ml of water, gain 2 XP, delete that entry,
  and the 2 XP used to just... stay. Every XP-granting action (water,
  workouts, progress photos, body metrics, sleep, cross-training activity)
  now stores exactly how much XP it granted and reverses precisely that
  amount if you delete the entry — including walking back down through
  level thresholds correctly, not just floating-point subtraction. Sleep
  logging also no longer farms XP by hitting Save repeatedly on the same day.
- **The exercise picker no longer cuts off results.** It used a fixed-height
  scroll box nested inside the sheet's own scroll, which made long exercise
  lists feel clipped and fought your scroll gestures. Rewrote it as a single
  scroll region with the search/filter and "add custom" pinned above and
  below — same pattern now used anywhere a sheet needs to show a long list.
- **"Kage's Read" is now genuinely interactive**, not just a static readout.
  There's an "Ask Kage" panel with tap-to-ask questions (*"Am I balanced?"*,
  *"Should I rest today?"*, *"What's my streak?"*) plus a free-text box that
  keyword-matches your own logged data. Still zero network calls and zero
  account — it's pattern-matching against your local data, not a hosted
  model, which is what keeps it free and private.
- **Custom routines are real now.** The "+ New" routine button used to just
  show a tip toast and do nothing. It's now an actual builder — name your
  routine, add days, list exercises per day — and it saves alongside the
  4 built-in templates, with delete support.
- **More layout bugs found and fixed**, the same way as round 1: a quest row
  with a long label could wrap its XP pill onto two lines instead of staying
  put; the floating "+" button could sit on top of the last row of the
  achievements grid or the Coach screen's own ask-box depending on content
  length. Fixed the underlying spacing/z-index causes rather than
  special-casing each screen.
- **One app, still gym-focused — with a lightweight door open to everything
  else.** Rather than trying to become a shallow tracker for every sport
  (which tends to produce a worse version of both), the strength-training
  core stays the deep, opinionated part of the app. A new "Log Activity"
  quick-entry (running, cycling, football, cricket, swimming, basketball,
  yoga, other) captures duration/intensity/distance for anything that isn't
  barbell work, and it feeds the same streak, XP, and quest system — so
  "leg day, then five-a-side Saturday" both count, without the app trying
  to out-Strava Strava.
- **A more premium splash and numeral treatment.** The launch animation now
  has a proper "impact" moment (a light-flash + shockwave ring when the bolt
  lands) and a converging letter-spacing reveal on the wordmark, still
  reduced-motion aware and still under ~2 seconds. Key numbers — level, XP,
  stat chips, ring readouts, the rest timer — now render in a monospaced,
  tabular-figure style instead of the body font, which is a small detail
  that reads as noticeably more "dialed in" rather than generic.
- **The "+" button works and is now consistently reachable.** (Round 1's
  headline fix — it had no click handler at all — held up, and round 2
  closed every remaining spot where it could visually collide with a
  screen's own content instead of adding something new.)

### Round 1

- **Zero emoji, anywhere.** Every icon in the app, including inside the
  canvas-rendered Share Report image, is inline SVG.
- **Real responsive design**, not just a stretched phone layout: a bottom
  tab bar on mobile/tablet, a persistent sidebar on desktop (≥1080px).
- **A splash screen**, an on-device Coach, and a batch of small requested
  features: repeat-last-workout, a plate-loading calculator, a 1-rep-max
  estimator, an "Auto" system-matching theme, a rest-timer completion sound,
  and a cap on stacked toast notifications.
- New typography (Space Grotesk + Inter) in place of default-feeling
  components.

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
routines: PPL, Upper/Lower, GZCLP, Full Body, plus freestyle sessions, plus
your own **custom routines** — name it, add days, list exercises per day),
a **weekly workout planner** (assign a focus or a rest day to each day,
one-tap Start on today's plan), rest timer with an audible chime
(toggleable), automatic PR detection that understands weight, rep-count,
*and* hold-time personal records depending on the exercise type, "Repeat
Last Workout" one-tap restart, water tracking with quick presets and a
7-day history chart, body metrics (weight/measurements) with a trend
sparkline, sleep logging, and a cross-training **Activity Log** for
anything that isn't barbell work (running, cycling, football, cricket,
swimming, basketball, yoga, or **any sport you type in yourself**) —
duration, intensity, optional distance, a live MET-based calorie estimate,
feeding the same streak/XP/quest system. Every logged record — water,
metrics, sleep, activities, and past workouts — can be edited after the
fact, not just deleted.

**Body → Impact:** a 2D body map scaled to your own logged height and
weight, colored zone-by-zone by how much you've trained each muscle group
in the last 7 days (redder = more recent volume), weekly estimated
calories burned, and a goal-aware suggested-next-workout card tuned to
whatever goal you've set (strength, endurance, six-pack, fat loss, or
consistency).

**The unique stuff:** progress photos captured via camera/file input and
stored *only* in your browser's IndexedDB (never uploaded anywhere,
before/after comparison slider), a real-actions XP/level/rank system
(E → SS "Shadow Monarch") where **XP reverses correctly if you delete the
entry that earned it**, daily quests generated from your actual data, 17
achievements (some secret — try the Konami code), a canvas-generated
"Share Report" card with an animated speedometer-style weekly consistency
gauge you can download or share natively (all vector icons, no emoji, even
inside the exported image), deep theme customization (2 anime-inspired
presets + light mode + an "Auto" mode that follows your system's light/dark
setting, plus any custom accent color), and a JSON export/import so your
data is never locked in.

**Kage's Read — your on-device companion:** a Coach screen that reads only
what you've logged in this app and turns it into plain-language insights —
training consistency, muscle-group balance, hydration trends, sleep
patterns, day-of-week performance, and progress toward your next rank. An
**"Ask Kage" panel** makes it genuinely interactive: tap a ready-made
question ("Am I balanced?", "Should I rest today?", "What's my streak?") or
type your own — the free-text box keyword-matches against the same
insight engine. It is deliberately *not* an AI model or an external API
call: no account, no server round-trip, nothing to pay for. It's pattern
matching against your own local data, which also means it works fully
offline and never has anything of yours to leak.

**Small conveniences people actually ask for:** a "Quick Add" sheet behind
one always-reachable "+" button (start a workout, log water, snap a
progress photo, log a body metric or sleep, log a cross-training activity,
or jump to the Coach — from anywhere in the app), a plate-loading
calculator (tell it a target weight and bar, it works out plates per side),
a 1-rep-max estimator (Epley formula) so you know what to aim for on a new
lift, and a capped toast queue so finishing a workout doesn't bury you in
stacked notifications.

**Under the hood:** a splash-screen intro animation (an SVG "summon circle"
with a light-flash/shockwave "impact" moment and a converging wordmark
reveal, respects reduced-motion preferences and never blocks real usage —
under ~2 seconds even at full motion, and skips almost entirely if the
OS/user has reduced motion on), installable PWA (works offline after first
load), a responsive layout that adapts from phone to tablet to a persistent
desktop sidebar (≥1080px) instead of just stretching a phone layout,
monospaced tabular-figure numerals on the numbers you actually watch
(level, XP, timers, stat chips) for a more precise "instrument panel" feel,
localStorage for app state + IndexedDB for photos, optional Firebase
Firestore sync for cross-device backup of everything *except* photos (your
own free Firebase project — Spark plan, no card required), every icon as
inline SVG (zero emoji anywhere in the app, including toasts and the canvas
share card), and zero build step.

### Why gym-focused, not "one app for every sport"

It would have been easy to bolt on shallow trackers for every sport and
call it "all-in-one," but that's usually how apps end up doing nothing
particularly well — and per the Reddit/Quora research below, "outdated,
bloated interface" is already a top complaint about existing apps. Arise
Kage keeps its depth where the XP/rank system, exercise library, and PR
detection actually add value: strength training. The Activity Log covers
the realistic cross-training case (a run, a match, a cycle) without
pretending to be a dedicated football, cricket, or running app — if you
need play-by-play cricket stats or GPS-mapped running routes, a
sport-specific app will always do that better than a gym tracker with a
bolted-on version of the same thing.

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
    planner.js            weekly workout planner (per-day focus / rest day / linked routine)
    demo.js                looping animated exercise-demo pictograms ("?" icon)
    workout.js           workout logging, rest timer, exercise picker, custom routine builder, history
    water.js             water tracking + 7-day chart
    activity.js           cross-training log (running/cycling/sport/etc., incl. free-text custom sport)
    body.js              progress photos, body metrics, sleep, and the Impact body-map tab
    quick-add.js           the "+" quick-add sheet (start workout / water / photo / metrics / sleep / activity / coach)
    quests-share.js       quests/achievements screen + canvas share-card generator
    companion.js           "Kage's Read" + "Ask Kage" — the on-device insights companion and Q&A layer
    tools.js               plate calculator + 1RM estimator
    settings-sync.js      settings screen, backup export/import, Firebase sync
    bootstrap.js          theming (incl. Auto/system mode + Glass/Nothing OS), tours, PWA install flow, easter eggs, app boot sequence
```

---

Built 2026-08-12, revised 2026-08-13 (round 3). No subscriptions, no ads, no locked features — and none
planned. If something's missing, the JSON export means your data was never
trapped in the first place.
