# Marc Arboleda — Portfolio

Personal portfolio for internships in data analytics, quality assurance and data management.
Built with **Expo (React Native + React Native Web)**, so the same code runs as a static website (deployed on Vercel) and as an iOS/Android app.

## Highlights

- **Responsive layout** for phones, tablets and desktops (`src/theme.ts` → `useLayout`).
- **Interactive data demo**: a working copy of the Musikalista membership registry, with sheet-style frozen columns, raw vs. cleaned view, the original search-formula logic and live insights.
  The demo uses **fictional records only** (`src/data/registry.ts`). No real member data is in this repository.
- **Three project showcases** (Tabula Rasa, the membership registry, helmet detection) with image galleries, charts built from real results and a "What I did" breakdown.
- **Unit tests** for the registry search, cleaning and validation logic (`tests/`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Expo dev server (press `w` for web, or scan with Expo Go) |
| `npm run build` | Static web export to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run check` | Type-check, lint and unit tests |

Requires Node 22.6 or newer.

## Deploying to Vercel

`vercel.json` is already configured. Import the repo in Vercel and keep the defaults:

- Build command: `npx expo export --platform web`
- Output directory: `dist`

## Structure

```
app/            routes (index page, root layout, HTML shell, 404)
src/components  Hero, Nav, Projects, Charts, RegistryDemo, Content sections, UI primitives
src/data        profile, projects, demo registry rows
src/lib         registry search / cleaning / validation logic
tests/          node:test unit tests
public/         résumé PDF (served at /Marc-Arboleda-Resume.pdf)
resume/         HTML source used to generate the résumé PDF
```
