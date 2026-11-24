# Marc Arboleda — Portfolio

Personal portfolio for internships in data analytics, quality assurance and data management.
Built with **Expo (React Native + React Native Web)**, so the same code runs as a static website (deployed on Vercel) and as an iOS/Android app.

## Highlights

- **Soft, calm theme** (Fraunces + Plus Jakarta Sans on warm cream) with restrained motion: scroll reveals, drifting background color, floating hero details, hover lifts. Motion is turned off when the device asks for reduced motion.
- **Three case studies:** Tabula Rasa (looping study video), a dairy farm management UI (auto-rotating screens) and the Musikalista membership database (walkthrough GIF). Cards expand into a full case view.
- **Responsive** for phone, tablet and desktop, and static-exported for Vercel.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Expo dev server (press `w` for web, or scan with Expo Go) |
| `npm run build` | Static web export to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run check` | Type-check and lint |

Requires Node 22.6 or newer.

## Deploying to Vercel

`vercel.json` is already configured. Import the repo in Vercel and keep the defaults:

- Build command: `npx expo export --platform web`
- Output directory: `dist`

## Structure

```
app/            routes (index page, root layout, HTML shell, 404)
src/components  Hero, Nav, Work (bento + case study), Media, Sections, motion
src/data        profile, projects, demo registry rows
assets/media    project video, GIF and screens
public/         résumé PDF (served at /Marc-Arboleda-Resume.pdf)
resume/         HTML source used to generate the résumé PDF
```
