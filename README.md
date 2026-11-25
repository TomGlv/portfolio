# portfolio

> Source of tomglv.dev — hand-made motion portfolio (vanilla JS, GSAP, Lenis), live GitHub data, interactive sticker avatar.

Live: **https://tomglv.dev**

## Highlights
- Vanilla HTML/CSS/JS, **GSAP + ScrollTrigger**, **Lenis** smooth scroll — no framework
- **Live GitHub data** (`dev.js`): repos and commits from the GitHub REST API, cached in `localStorage`, snapshot fallback
- Interactive avatar: eyes follow the cursor, x-ray lens, grab & throw, plug-in cord simulated as a **verlet rope** colliding with the title letters
- Particle / orbit effects (`fx.js`), hidden easter eggs (`eggs.js`)
- Perf pass: cached rects per frame, throttled canvases, DPR cap → ~98 fps on a throttled mobile profile

## Run locally
```bash
npx http-server -p 5174
```

---
Made by [Tom Galvan](https://tomglv.dev) · Bachelor in AI, ECE Paris
