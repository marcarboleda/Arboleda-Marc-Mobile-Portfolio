# Marc Arboleda — Portfolio

Personal portfolio for internships in UI design, data analytics, quality assurance and data management.

Plain **HTML + CSS + a little JavaScript**. No framework and no build step — deployed as static files on Vercel.

## Structure

```
public/
  index.html                  all content (edit text here)
  styles.css                  design: colors in :root / [data-theme="dark"]
  main.js                     theme toggle, scroll index, gallery, reveal
  Marc-Arboleda-Resume.pdf    served by the Résumé buttons
  assets/
    images/                   portrait, favicon
    media/                    project screenshots and videos
    fonts/                    Bricolage Grotesque + Figtree (self-hosted)
resume/
  resume.html                 source of the one-page résumé PDF
```

## Run locally

```bash
npx serve public
```

or open `public/index.html` with the VS Code *Live Server* extension.

## Update the résumé

Edit `resume/resume.html`, export it to PDF, and replace `public/Marc-Arboleda-Resume.pdf` (same file name).

## Privacy

The Membership Database project is shown with fictional members only. No real member data is published.
