/* ============================================================
   Tom Galvan — portfolio · red / black motion edition
   GSAP + ScrollTrigger + Flip + Lenis
============================================================ */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const HOVER = matchMedia("(hover: hover)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ============================================================
   DATA
============================================================ */
const ICONS = {
  chart: `<path class="s" d="M18 102 H104 M18 102 V18"/>
    <rect class="s bar" x="28" y="62" width="12" height="40" rx="2"/><rect class="s bar" x="48" y="46" width="12" height="56" rx="2"/>
    <rect class="s bar" x="68" y="70" width="12" height="32" rx="2"/><rect class="s bar" x="88" y="36" width="12" height="66" rx="2"/>
    <path class="a draw" d="M24 78 L44 56 L64 66 L96 24"/><path class="a" d="M84 24 H96 V36"/>`,
  ocr: `<rect class="s" x="30" y="16" width="60" height="88" rx="8"/>
    <path class="s" d="M42 36 H78 M42 48 H72 M42 60 H78 M42 72 H62 M42 84 H70"/>
    <path class="a" d="M18 28 V18 H28 M92 18 H102 V28 M18 92 V102 H28 M92 102 H102 V92"/>
    <path class="a scan" d="M14 26 H106"/>`,
  house: `<g class="roof"><path class="s" d="M60 16 L102 38 L60 60 L18 38 Z"/><path class="a" d="M60 16 L60 60"/></g>
    <path class="s" d="M18 44 V82 L60 104 V66 M102 44 V82 L60 104"/>
    <path class="s" d="M70 98 V82 L82 76 V92"/><path class="af" d="M30 64 L44 71 V82 L30 75 Z"/>`,
  ball: `<g class="ball"><circle class="s" cx="60" cy="60" r="34"/>
    <path class="cf" d="M60 45 L74 55 L69 71 L51 71 L46 55 Z"/>
    <path class="s" d="M60 45 V26 M74 55 L92 49 M69 71 L80 88 M51 71 L40 88 M46 55 L28 49"/></g>
    <path class="a" d="M4 46 H18 M0 60 H16 M4 74 H18"/>`,
  web: `<rect class="s" x="12" y="18" width="96" height="84" rx="8"/><path class="s" d="M12 34 H108"/>
    <circle class="af" cx="22" cy="26" r="3"/><circle class="cf" cx="32" cy="26" r="3"/><circle class="cf" cx="42" cy="26" r="3"/>
    <circle class="af float" cx="84" cy="54" r="9"/>
    <path class="s" d="M30 94 V62 L52 48 L74 62 V94 M42 94 V80 H62 V94 M40 66 H46 M58 66 H64"/>`,
  sign: `<path class="s" d="M14 94 H106"/><path class="s" d="M16 86 L24 78 M16 78 L24 86"/>
    <path class="a draw" d="M30 84 C38 48 50 46 48 72 C46 92 60 58 68 64 C76 70 72 84 84 70 C90 62 96 66 102 60"/>
    <path class="s" d="M82 18 L100 36 L72 64 L58 68 L62 54 Z M76 24 L94 42"/>`,
  tasks: `<rect class="s" x="16" y="20" width="18" height="18" rx="4"/><rect class="s" x="16" y="51" width="18" height="18" rx="4"/><rect class="s" x="16" y="82" width="18" height="18" rx="4"/>
    <path class="a draw" d="M20 29 L24 34 L31 24"/><path class="a draw" d="M20 60 L24 65 L31 55"/>
    <path class="s" d="M46 29 H102 M46 60 H94 M46 91 H80"/>`,
  radar: `<circle class="s" cx="60" cy="60" r="42"/><circle class="s" cx="60" cy="60" r="27" opacity=".6"/><circle class="s" cx="60" cy="60" r="12" opacity=".4"/>
    <path class="s" d="M60 14 V106 M14 60 H106" opacity=".35"/>
    <path class="sweep af" d="M60 60 L60 18 A42 42 0 0 1 96 39 Z" opacity=".45"/>
    <circle class="af" cx="80" cy="42" r="4"/><circle class="a ping" cx="80" cy="42" r="4"/>
    <circle class="af" cx="42" cy="78" r="3"/>`,
  pc: `<rect class="s" x="12" y="22" width="68" height="50" rx="5"/><path class="s" d="M46 72 V86 M32 88 H60"/>
    <rect class="s" x="88" y="28" width="22" height="60" rx="4"/><path class="s" d="M94 40 H104 M94 48 H104"/>
    <circle class="af blink" cx="99" cy="76" r="3.5"/>
    <path class="a" d="M22 36 L30 42 L22 48"/><path class="s" d="M34 50 H50"/><path class="a draw" d="M22 60 H64"/>`,
  target: `<circle class="s" cx="60" cy="60" r="40"/><circle class="s" cx="60" cy="60" r="25"/>
    <circle class="af" cx="60" cy="60" r="9"/><circle class="a ping" cx="60" cy="60" r="9"/>
    <path class="s" d="M60 10 V26 M60 94 V110 M10 60 H26 M94 60 H110"/>`,
  hook: `<g class="hook"><circle class="s" cx="70" cy="14" r="5"/><path class="s" d="M70 19 V70 C70 94 38 94 38 72 L48 64"/></g>
    <rect class="af" x="16" y="72" width="34" height="30" rx="6"/><path class="a" d="M23 72 V63 C23 51 43 51 43 63 V72"/>
    <circle cx="33" cy="86" r="3.5" fill="#0b0b0b"/>`,
  bot: `<path class="af bubble" d="M74 12 H108 V38 H92 L84 46 V38 H74 Z"/>
    <circle cx="84" cy="25" r="2.5" fill="#0b0b0b"/><circle cx="91" cy="25" r="2.5" fill="#0b0b0b"/><circle cx="98" cy="25" r="2.5" fill="#0b0b0b"/>
    <rect class="s" x="16" y="46" width="66" height="52" rx="14"/><path class="s" d="M49 46 V32"/><circle class="af" cx="49" cy="28" r="5"/>
    <g class="eyes"><circle class="cf" cx="37" cy="68" r="6"/><circle class="cf" cx="61" cy="68" r="6"/></g>
    <path class="s" d="M38 84 H60 M8 66 V78 M90 66 V78"/>`,
};

const PROJECTS = [
  { name: "BuildScan", lang: "Python", icon: "house", desc: "Classifies Minecraft schematics as house / not house: RandomForest (88.6%) vs PyTorch 3D CNN on 32³ voxels (94.4%), FastAPI + Three.js viewer.", tags: ["AI", "Deep learning", "Featured"], url: "https://github.com/TomGlv/minecraft-house-ai" },
  { name: "AI PDF Sorter", lang: "Python", icon: "ocr", desc: "Reads handwritten scanned PDFs with an LLM vision model, extracts fields as validated JSON, human-review queue, cache, CSV audit.", tags: ["AI", "LLM", "Document AI"], url: "https://github.com/TomGlv/ai-pdf-sorter" },
  { name: "Voltaire OCR + LLM", lang: "C++", icon: "ocr", desc: "Screen capture → Tesseract OCR (Leptonica preprocessing) → Groq and Gemini queried in parallel to spot and explain French grammar mistakes.", tags: ["AI", "OCR", "LLM"], url: "https://github.com/TomGlv/voltaire-ocr-llm" },
  { name: "AI Lore Video Generator", lang: "Python", icon: "bot", desc: "End-to-end generative pipeline: Llama 3.3 script (Groq), AI images, AI voice-over, video assembled with OpenCV.", tags: ["AI", "GenAI"], url: "https://github.com/TomGlv/ai-lore-video-generator" },
  { name: "ML with scikit-learn", lang: "Python", icon: "chart", desc: "KNN, decision tree, linear & logistic regression on Iris and an e-learning dataset, auto-generated PDF report.", tags: ["AI", "ML"], url: "https://github.com/TomGlv/ml-scikit-learn-basics" },
  { name: "CineDeck", lang: "Web", icon: "web", desc: "Full-stack movie trading-card game on the TMDB API: auth, auction market with bid escrow, trades, cron jobs. Next.js, Prisma, Postgres.", tags: ["Full-stack"], url: "https://github.com/TomGlv/cinedeck" },
  { name: "archidia-web", lang: "Web", icon: "web", desc: "Client website for the ArchidiA architecture studio: Astro, Sanity CMS, Netlify forms. Lighthouse 99/100.", tags: ["Client", "Front-end"], url: "https://github.com/TomGlv/archidia-web" },
  { name: "Numerical simulation", lang: "Python", icon: "chart", desc: "RC circuit solved by Euler, RK4 and analytically in a CustomTkinter GUI; damped pendulum model.", tags: ["Maths"], url: "https://github.com/TomGlv/numerical-simulation" },
  { name: "LoL Match Notifier", lang: "Python", icon: "radar", desc: "GitHub Actions cron + Riot API: every new game posted to Discord with KDA, kill participation, LP and distance to Master.", tags: ["Bot", "API"], url: "https://github.com/TomGlv/lol-match-notifier" },
  { name: "Tesseract OCR test", lang: "C++", icon: "ocr", desc: "Win32 screen capture → OpenCV EAST text detection → OCR → LLM over REST. Prototype of the Voltaire tool.", tags: ["AI", "OCR"], url: "https://github.com/TomGlv/tesseract-ocr-test" },
  { name: "WorldCupStats", lang: "C#", icon: "ball", desc: "Statistics application crunching World Cup data — teams, matches and numbers, in .NET.", tags: ["Data", ".NET"], url: "https://github.com/TomGlv/WorldCupStats" },
  { name: "Advanced SQL", lang: "Python", icon: "tasks", desc: "MySQL 8 labs: joins, GROUP BY / HAVING, CTEs, views, with Python scripts that run them and build the report.", tags: ["Data", "SQL"], url: "https://github.com/TomGlv/mysql-advanced-sql" },
  { name: "SoWeSign", lang: "Java", icon: "sign", desc: "Team electronic-attendance app in JavaFX + MySQL, with admin, teacher and student sides.", tags: ["OOP"], url: "https://github.com/TomGlv/SoWeSign" },
  { name: "TaskFlow", lang: "Web", icon: "tasks", desc: "A clean web-based task manager. Organise, track and flow through your to-dos.", tags: ["UI"], url: "https://github.com/TomGlv/TaskFlow" },
  { name: "Quoridor", lang: "C", icon: "target", desc: "Quoridor board game in C: solo console version and the ING1 team project with an AI opponent.", tags: ["Game"], url: "https://github.com/TomGlv/quoridor" },
  { name: "ECE Cooked", lang: "C", icon: "pc", desc: "Two-player co-op cooking game with Allegro 4: menu, music, collision map, timer.", tags: ["Game"], url: "https://github.com/TomGlv/ece-cooked" },
  { name: "Computer inventory", lang: "Java", icon: "pc", desc: "Java app to manage an organisation's computer fleet: add, edit, delete and track machines.", tags: ["Desktop"], url: "https://github.com/TomGlv/computer-inventory-java" },
  { name: "Tournament manager", lang: "Python", icon: "ball", desc: "Standings, insertion sort, linear vs binary search with comparison counts, round-robin fixtures.", tags: ["Algorithms"], url: "https://github.com/TomGlv/tournament-manager" },
  { name: "C data structures", lang: "C", icon: "chart", desc: "Queue, stack and max-heap implemented in C on real exercises (ticket office, containers, ski stations).", tags: ["Algorithms"], url: "https://github.com/TomGlv/c-data-structures" },
  { name: "Deezer Discord RPC", lang: "Python", icon: "radar", desc: "Shows the Deezer track you're playing as Discord Rich Presence, through Last.fm now-playing.", tags: ["Tool"], url: "https://github.com/TomGlv/deezer-discord-rpc" },
];
/* evidence photographs (Unsplash, free licence) */
const PHOTO = {
  "DPM-Plus V2": "photo-1572314493295-09c6d5ec3cdf",
  "bot_projet_voltaire": "photo-1528459199957-0ff28496a7f6",
  "minecraft-house-ai": "photo-1587654780291-39c9404d746b",
  "WorldCupStats": "photo-1602472097151-72eeec7a3185",
  "archidia-web": "photo-1527576539890-dfa815648363",
  "SoWeSign": "photo-1455390582262-044cdead277a",
  "TaskFlow": "photo-1484480974693-6ca0a78fb36b",
  "AMD LaGrinta Tracker": "photo-1603481588273-2f908a9a7a1b",
  "GestionOrdi": "photo-1509281373149-e957c6296406",
  "AMD La Peufra Tracker": "photo-1613063022614-dc11527f5ece",
  "PhishCGI": "photo-1714880003292-17685b9999b6",
  "PhishCGI Discord Bot": "photo-1527430253228-e93688616381",
};
const LANG_C = { Python: "#ffd43b", "C#": "#a179ff", Java: "#ff8a3d", "C++": "#ff4d6d", C: "#9aa4b2", Web: "#4cc9f0" };
const SKILLS = [
  { n: "AI / ML", r: "LLMs · OCR · PyTorch · scikit-learn", l: 90 },
  { n: "Python", r: "AI · automation · bots", l: 92 },
  { n: "Git & GitHub", r: "versioning", l: 88 },
  { n: "HTML · CSS · JS", r: "web · UI", l: 84 },
  { n: "Java", r: "OOP · apps", l: 82 },
  { n: "C#", r: ".NET · data", l: 76 },
  { n: "C++", r: "performance · OCR", l: 70 },
  { n: "C", r: "algorithms · games", l: 70 },
];
window.PORTFOLIO = { get PROJECTS() { return PROJECTS; }, get ICONS() { return ICONS; }, get LANG_C() { return LANG_C; } };
const ROLES = ["AI · LLM & OCR pipelines", "Python · ML & automation", "C++ · OCR + LLM tooling", "Web · full-stack builds", "40+ repos · 6 languages"];

/* scattered layout (Lando gallery): col, span, aspect, top offset vh, parallax speed */
const LAYOUT = [
  { c: 2, s: 3, ar: "4/5", mt: 0, sp: -0.15 },
  { c: 7, s: 5, ar: "5/4", mt: 6, sp: 0.1 },
  { c: 1, s: 4, ar: "1/1", mt: 4, sp: 0.2 },
  { c: 6, s: 3, ar: "4/5", mt: -6, sp: -0.1 },
  { c: 10, s: 3, ar: "3/4", mt: 10, sp: 0.25 },
  { c: 3, s: 4, ar: "4/3", mt: 0, sp: -0.2 },
  { c: 8, s: 4, ar: "4/5", mt: -4, sp: 0.12 },
  { c: 1, s: 3, ar: "1/1", mt: 8, sp: 0.18 },
  { c: 5, s: 4, ar: "5/4", mt: 2, sp: -0.12 },
  { c: 10, s: 3, ar: "4/5", mt: -10, sp: 0.2 },
  { c: 3, s: 3, ar: "3/4", mt: 2, sp: -0.18 },
  { c: 8, s: 4, ar: "4/3", mt: 6, sp: 0.1 },
];

/* ============================================================
   RENDER
============================================================ */
const FEATURED = 8;
let workOpen = false;
const scatter = $("#scatter");
PROJECTS.forEach((p, i) => {
  const a = document.createElement("a");
  a.className = "exhibit"; a.href = p.url; a.target = "_blank"; a.rel = "noopener";
  a.dataset.lang = p.lang; a.dataset.tags = p.tags.join(","); a.dataset.cursor = "label"; a.dataset.cursorLabel = "open file";
  a.innerHTML = `
    <div class="exhibit__label">${p.lang}, ${String(i + 1).padStart(2, "0")} <i></i></div>
    <div class="exhibit__card">
      <div class="exhibit__art">
        <svg class="ic" viewBox="0 0 120 120" aria-hidden="true">${ICONS[p.icon]}</svg>
        <span class="exhibit__no">${String(i + 1).padStart(2, "0")}</span>
        <span class="exhibit__lang">${p.lang}</span>
        <span class="exhibit__go">↗</span>
        ${p.priv ? `<span class="exhibit__priv">private repo</span>` : ""}
      </div>
      <div class="exhibit__body"><h3 class="exhibit__name">${p.name}</h3><p class="exhibit__desc">${p.desc}</p></div>
    </div>`;
  if (i >= FEATURED) a.classList.add("is-more");
  scatter.appendChild(a);
});
const moreBtn = document.createElement("button");
moreBtn.className = "more-work mono"; moreBtn.dataset.cursor = "hover";
scatter.after(moreBtn);
const rowsEl = $("#rows");
const LANG_OF = { "AI / ML": "AI", "Python": "Python", "HTML · CSS · JS": "Web", "Java": "Java", "C#": "C#", "C++": "C++", "C": "C" };
const inCat = (p, f) => p.lang === f || p.tags.includes(f);
SKILLS.forEach((s, i) => {
  const li = document.createElement("li");
  li.className = "row";
  const n = LANG_OF[s.n] ? PROJECTS.filter((p) => inCat(p, LANG_OF[s.n])).length : PROJECTS.length;
  li.innerHTML = `<span class="row__i">${String(i + 1).padStart(2, "0")}</span><span class="row__n">${s.n}</span><span class="row__r">${s.r}</span><span class="row__c">${LANG_OF[s.n] ? `${String(n).padStart(2, "0")} project${n > 1 ? "s" : ""}` : "every repo"}</span>`;
  rowsEl.appendChild(li);
});
$("#year").textContent = new Date().getFullYear();

/* ============================================================
   TEXT HELPERS
============================================================ */
function prepStrike(el) {          // split a title into typewriter keys
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.innerHTML = [...text].map((c) => c === " " ? " " : `<span class="k" style="--r:${((Math.random() - 0.5) * 3).toFixed(1)}deg;--y:${((Math.random() - 0.5) * 0.04).toFixed(3)}em">${c}</span>`).join("");
  return $$(".k", el);
}
function strike(keys, speed = 55) { keys.forEach((k, i) => setTimeout(() => k.classList.add("on"), i * speed * (0.7 + Math.random() * 0.6))); }
function splitLines(el) {
  const text = el.textContent.trim().replace(/\s+/g, " ");
  el.setAttribute("aria-label", text);
  el.innerHTML = text.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");
  const lines = []; let top = null;
  $$(".w", el).forEach((w) => { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; } lines[lines.length - 1].push(w.textContent); });
  el.innerHTML = lines.map((l) => `<span class="wl" aria-hidden="true"><span class="wl__t">${l.join(" ")}</span><span class="wl__b"></span></span>`).join("");
  return $$(".wl", el);
}
function splitGlitch(el) {
  const text = el.textContent; el.setAttribute("aria-label", text);
  el.innerHTML = [...text].map((c) => `<span class="gc">${c}</span>`).join("");
  return $$(".gc", el);
}
function drawSig(svg) {
  const paths = $$("path", svg);
  paths.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = `${l} ${l + 40}`; p.style.strokeDashoffset = l + 20; });
  return paths;
}
const type = (el, text, o) => (window.Dev ? window.Dev.TW.type(el, text, o) : Promise.resolve((el.textContent = text)));

/* ============================================================
   TOPOGRAPHIC LINES (Lando) — monochrome
============================================================ */
const Topo = (() => {
  const cv = $("#topo"), ctx = cv.getContext("2d");
  const perm = new Uint8Array(512), pp = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pp[i], pp[j]] = [pp[j], pp[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = pp[i & 255];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10), grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
  const noise = (x, y) => { const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y); const u = fade(x), v = fade(y), a = perm[X] + Y, b = perm[X + 1] + Y; const l1 = grad(perm[a], x, y) + u * (grad(perm[b], x - 1, y) - grad(perm[a], x, y)); const l2 = grad(perm[a + 1], x, y - 1) + u * (grad(perm[b + 1], x - 1, y - 1) - grad(perm[a + 1], x, y - 1)); return l1 + v * (l2 - l1); };
  const MOB = innerWidth < 760;
  let W, H, cols, rows, field, cell = MOB ? 34 : 26, scrollY = 0, lastY = -1, t = 0, color = "rgba(11,11,11,.12)", f = 0, dirty = true;
  const resize = () => { dirty = true; const d = Math.min(devicePixelRatio || 1, MOB ? 1 : 1.5); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1; field = new Float32Array(cols * rows); };
  function draw() {
    const fr = 0.0022, oy = scrollY * 0.3;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) field[j * cols + i] = noise(i * cell * fr + t, (j * cell + oy) * fr) * 0.75 + noise(i * cell * fr * 2.1, (j * cell + oy) * fr * 2.1 - t) * 0.25;
    ctx.clearRect(0, 0, W, H); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath();
    const shift = oy % cell;
    for (let L = -0.5; L <= 0.5; L += 0.09) for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = field[j * cols + i], b = field[j * cols + i + 1], c = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
      const k = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
      if (k === 0 || k === 15) continue;
      const x = i * cell, y = j * cell - shift;
      const T = [x + cell * (L - a) / (b - a), y], R = [x + cell, y + cell * (L - b) / (c - b)], B = [x + cell * (L - d) / (c - d), y + cell], Lf = [x, y + cell * (L - a) / (d - a)];
      const s = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
      switch (k) { case 1: case 14: s(Lf, B); break; case 2: case 13: s(B, R); break; case 3: case 12: s(Lf, R); break; case 4: case 11: s(T, R); break; case 5: s(Lf, T); s(B, R); break; case 6: case 9: s(T, B); break; case 7: case 8: s(Lf, T); break; case 10: s(Lf, B); s(T, R); break; }
    }
    ctx.stroke();
  }
  addEventListener("resize", resize); resize();
  /* redraw every 2nd frame while scrolling, ~8 fps when idle (the drift is slow anyway) */
  (function loop() {
    f++;
    const scrolling = scrollY !== lastY;
    if (scrolling || dirty ? f % 2 === 0 : f % 8 === 0) { if (!REDUCED) t += scrolling ? 0.001 : 0.004; lastY = scrollY; dirty = false; draw(); }
    requestAnimationFrame(loop);
  })();
  return { setScroll(y) { scrollY = y; }, setColor(c) { color = c; dirty = true; } };
})();

/* ============================================================
   HERO — the page and its source
============================================================ */
/* ---------- character motion proposals (switcher top-left, ?fx=0|a|b|c) ----------
   0 = current tilt · A = jelly spring · B = taped sticker that swings · C = alive (idles, flinches, sleeps at night) */
let FX = "c";   /* motion base kept: alive (idle look-around, flinch, sleeps at night). Effects = particles, see fx.js */
const RIGS = [];
const MOTION = { sv: 0, vx: 0, vy: 0, lastMove: performance.now(), on: false };
function motionTracker() {
  if (MOTION.on) return; MOTION.on = true;
  let sy = scrollY, px = pointer.x, py = pointer.y, last = performance.now();
  gsap.ticker.add(() => {
    const now = performance.now(), dt = Math.max((now - last) / 1000, 1 / 240); last = now;
    MOTION.sv = lerp(MOTION.sv, (scrollY - sy) / dt, 0.2); sy = scrollY;
    const vx = (pointer.x - px) / dt, vy = (pointer.y - py) / dt; px = pointer.x; py = pointer.y;
    MOTION.vx = lerp(MOTION.vx, vx, 0.35); MOTION.vy = lerp(MOTION.vy, vy, 0.35);
    if (Math.abs(vx) + Math.abs(vy) > 1 || Math.abs(MOTION.sv) > 5) MOTION.lastMove = now;
  });
}
const spring = (s, target, k, damp, dt, acc = 0) => { s.v += ((target - s.x) * k + acc) * dt; s.v *= Math.exp(-damp * dt); s.x += s.v * dt; };

function avatarRig(el, wrap) {
  motionTracker();
  el.dataset.fx = FX;
  const tilt = $(".pav__tilt", el), lids = $$(".pav__blink", el);
  let cx = 0, cy = 0, hover = false, hop = 0, blinkT = 2 + Math.random() * 3, last = performance.now();
  const rz = { x: 0, v: 0 }, sq = { x: 0, v: 0 }, J = { y: 0, sx: 1, sy: 1 };
  const lens = { r: 0, x: 0, y: 0 };   /* headset reveal: a circle that follows the mouse over the character */
  let look = 0, lookT = 0, flinchT = 0, startle = 0;
  const blink = (which = lids) => { gsap.set(which, { opacity: 1 }); gsap.set(which, { opacity: 0, delay: 0.12 }); };
  const jump = (h = 46) => gsap.timeline({ overwrite: true })
    .to(J, { sy: 0.84, sx: 1.1, y: 0, duration: 0.09, ease: "power2.out" })
    .to(J, { y: -h, sy: 1.1, sx: 0.93, duration: 0.24, ease: "power2.out" })
    .to(J, { y: 0, sy: 1, sx: 1, duration: 0.2, ease: "power2.in" })
    .to(J, { sy: 0.9, sx: 1.06, duration: 0.07, ease: "power1.out" })
    .to(J, { sy: 1, sx: 1, duration: 0.6, ease: "elastic.out(1, 0.35)" });
  const rig = {
    el,
    reset() { rz.x = rz.v = sq.x = sq.v = 0; gsap.killTweensOf(J); Object.assign(J, { y: 0, sx: 1, sy: 1 }); el.classList.remove("is-sleep"); },
    enter() {
      if (FX === "a") jump(60);
      else if (FX === "b") { rz.v = 220; gsap.fromTo(J, { y: -80, sx: 1.08, sy: 1.08 }, { y: 0, sx: 1, sy: 1, duration: 0.5, ease: "power3.in" }); }
      else if (FX === "c") blink();
    },
  };
  RIGS.push(rig);
  if (wrap) {
    wrap.addEventListener("pointerenter", () => {
      hover = true; el.classList.add("is-happy");
      if (FX === "0") gsap.fromTo(el, { y: 0 }, { y: -14, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
      else if (FX === "a") sq.v -= 2.2;
      else if (FX === "b") rz.v += (MOTION.vx > 0 ? 1 : -1) * 90;
      else if (FX === "c" && el.classList.contains("is-sleep")) { startle = 1; blink(); }
    });
    wrap.addEventListener("pointerleave", () => { hover = false; el.classList.remove("is-happy"); });
    wrap.addEventListener("click", () => {
      gsap.set(lids[1], { opacity: 1 }); gsap.set(lids[1], { opacity: 0, delay: 0.6 });
      if (FX === "0") gsap.fromTo(el, { rotation: 0 }, { keyframes: { rotation: [-5, 4, -2, 0] }, duration: 0.6, ease: "power1.inOut" });
      else if (FX === "a") jump(70);
      else if (FX === "b") { sq.v -= 3; rz.v += (Math.random() < 0.5 ? -1 : 1) * 260; }
      else if (FX === "c") rz.v += 90;
    });
  }
  document.addEventListener("tg:night", (e) => {
    if (FX === "c") { if (!e.detail) { startle = 1; blink(); rz.v += 140; } else { sq.v -= 1.5; } }
    else if (FX === "a") sq.v -= 3;
    else if (FX === "b") rz.v += 200;
  });
  gsap.ticker.add(() => {
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now;
    const r = rectOf(el);
    if (r.bottom < 0 || r.top > innerHeight) return;
    const hx = r.left + r.width * 0.5, hy = r.top + r.height * 0.35;
    let px = pointer.x, py = pointer.y;
    if (!HOVER) { px = hx + Math.cos(now / 1500) * r.width; py = hy + Math.sin(now / 1100) * r.height * 0.4; }
    let tx = clamp((px - hx) / (innerWidth * 0.5), -1, 1), ty = clamp((py - hy) / (innerHeight * 0.5), -1, 1);
    const sleep = FX === "c" && (NIGHT || now - MOTION.lastMove > 25000) && !hover && startle <= 0 && !el.classList.contains("is-robot");   /* night, or nobody moved for 25 s */
    el.classList.toggle("is-sleep", sleep);
    startle = Math.max(0, startle - dt * 0.5);
    const near = px > r.left - 60 && px < r.right + 60 && py > r.top - 60 && py < r.bottom + 60;
    let rzT = 0, sqT = 0, rzAcc = 0, k = 120, d = 9, sk = 140, sd = 9;

    if (FX === "a") {                               /* jelly: everything lags and wobbles */
      rzT = tx * 5 + clamp(MOTION.vx * 0.004, -9, 9);
      sqT = clamp(MOTION.sv * 0.00007, -0.14, 0.14);
      k = 150; d = 5; sk = 220; sd = 5;
    } else if (FX === "b") {                        /* hanging sticker: pendulum pushed by the cursor and the scroll */
      rzAcc = (near ? MOTION.vx * 0.55 : 0) + MOTION.sv * 0.05 * Math.sin(now / 300);
      sqT = clamp(Math.abs(MOTION.sv) * -0.00003, -0.06, 0);
      k = 38; d = 1.5; sk = 160; sd = 7;
      tx *= 0.5; ty *= 0.5;
    } else if (FX === "c") {                        /* alive: idles, flinches, holds on when you scroll, sleeps at night */
      if (sleep) { tx = 0; ty = 0.55; rzT = -7 + Math.sin(now / 1800) * 2; }
      else if (now - MOTION.lastMove > 2600) {
        lookT -= dt;
        if (lookT <= 0) { look = [-0.85, 0.8, 0, -0.45, 0.6, 0.15][(Math.random() * 6) | 0]; lookT = 1 + Math.random() * 1.8; if (Math.random() < 0.4) blink(); }
        tx = look; ty = -0.1; rzT = look * 4;
      } else rzT = tx * 3;
      const sp = Math.hypot(MOTION.vx, MOTION.vy);
      flinchT -= dt;
      if (!sleep && near && sp > 2600 && flinchT <= 0) { flinchT = 0.8; rz.v += (MOTION.vx > 0 ? -1 : 1) * 260; sq.v -= 2.5; blink(); }
      sqT = sleep ? 0 : clamp(-Math.abs(MOTION.sv) * 0.00005, -0.1, 0);
      rzT += clamp(-MOTION.sv * 0.003, -6, 6);
      k = 110; d = 7;
    }
    if (FX !== "0") { spring(rz, rzT, k, d, dt, rzAcc); spring(sq, sqT, sk, sd, dt); rz.x = clamp(rz.x, -28, 28); sq.x = clamp(sq.x, -0.25, 0.25); }

    cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08); hop = lerp(hop, hover ? 1 : 0, 0.12);
    const breathe = sleep ? Math.sin(now / 1700) * 2.2 : Math.sin(now / 1100);
    const base = 1 + breathe * 0.008 + hop * 0.03;
    tilt.style.transform = `translate3d(${(cx * 8).toFixed(1)}px, ${(cy * 5 + breathe * 2 + J.y).toFixed(1)}px, 0) rotateY(${(cx * 16).toFixed(2)}deg) rotateX(${(-cy * 10).toFixed(2)}deg) rotate(${rz.x.toFixed(2)}deg) scale(${(base * J.sx * (1 - sq.x * 0.6)).toFixed(4)}, ${(base * J.sy * (1 + sq.x)).toFixed(4)})`;
    if (HOVER && wrap) {
      const lx = pointer.x - r.left, ly = pointer.y - r.top, inside = pointer.moved && lx > -30 && lx < r.width + 30 && ly > -30 && ly < r.height + 30;
      lens.r = lerp(lens.r, inside ? r.width * 0.3 : 0, 0.14); lens.x = lerp(lens.x, lx, 0.35); lens.y = lerp(lens.y, ly, 0.35);
      tilt.classList.toggle("lens-on", lens.r > r.width * 0.12);
      const vis = lens.r > 0.5;
      if (vis !== lens.on) { lens.on = vis; tilt.classList.toggle("lens-vis", vis); }
      if (vis && (Math.abs(lens.r - (lens.pr || 0)) > 0.3 || Math.abs(lens.x - (lens.px || 0)) > 0.3 || Math.abs(lens.y - (lens.py || 0)) > 0.3)) {
        lens.pr = lens.r; lens.px = lens.x; lens.py = lens.y;
        tilt.style.setProperty("--mr", lens.r.toFixed(1) + "px"); tilt.style.setProperty("--mx", lens.x.toFixed(1) + "px"); tilt.style.setProperty("--my", lens.y.toFixed(1) + "px");
      }
    }
    if (!sleep) { blinkT -= dt; if (blinkT <= 0) { blink(); if (Math.random() < 0.25) setTimeout(blink, 260); blinkT = 2.2 + Math.random() * 3.5; } }
  });
}
function hero() {
  const wrap = $("#avatarWrap");
  wrap.insertAdjacentHTML("beforeend", Char.photo({ id: "avatar", label: "Illustrated character" }));
  avatarRig($("#avatar"), wrap);
}

/* ============================================================
   FOOTER STREET — Tom on the crossing, pedestrians pass by
============================================================ */
function street() {
  const st = $("#street"); if (!st) return;
  $("#streetMe").innerHTML = Char.photo({ cls: "avatar--street" });
  avatarRig($(".avatar--street"), $("#streetMe"));
  const mobile = innerWidth < 760;
  const crowd = Char.PEOPLE.filter((n) => n !== "classic").sort(() => Math.random() - 0.5).slice(0, mobile ? 6 : 9)
    .map((n) => ({ html: `<img src="assets/people/${n}.png" alt="" draggable="false">`, kind: "bust" }));
  crowd.splice(2, 0, { html: Char.dog(), kind: "pet pet-dog", say: ["woof!", "WOOF", "*sniff sniff*"] });
  crowd.splice(7, 0, { html: Char.cat(), kind: "pet pet-cat", say: ["meow.", "…", "prrrr"] });
  crowd.splice(4, 0, { html: Char.eagle(), kind: "bust", say: ["SKREEE", "nice view from up here"] });
  crowd.splice(10, 0, { html: Char.rabbit(), kind: "pet pet-rabbit", say: ["*hop*", "carrot?"] });
  const HELLO = ["hi!", "hey!", "yo", "salut !", "hey Tom!", "nice portfolio", "hiring?", "good morning", "oh, hello", "ciao"];
  const OOPS = ["oops!", "whoa—", "who left that here?!", "ouch"];
  /* things people drop when you bother them (B&W line icons) */
  const ITEMS = [
    `<svg viewBox="0 0 40 40"><path d="M9 12 H29 L27 34 H11 Z" fill="#fff"/><path d="M29 16 C36 16 36 26 28 26" fill="none"/><path d="M14 6 C12 9 16 9 14 12 M20 5 C18 8 22 8 20 11" fill="none"/></svg>`,
    `<svg viewBox="0 0 40 40"><rect x="12" y="4" width="16" height="32" rx="3" fill="#fff"/><path d="M18 31 H22"/></svg>`,
    `<svg viewBox="0 0 40 40"><circle cx="13" cy="20" r="7" fill="#fff"/><path d="M20 20 H35 M30 20 V25 M34 20 V24"/></svg>`,
    `<svg viewBox="0 0 40 40"><path d="M6 10 C12 7 17 8 20 11 C23 8 28 7 34 10 V32 C28 29 23 30 20 33 C17 30 12 29 6 32 Z" fill="#fff"/><path d="M20 11 V33"/></svg>`,
    `<svg viewBox="0 0 40 40"><path d="M5 26 C5 14 14 9 20 9 C26 9 35 14 35 26 C28 30 12 30 5 26 Z" fill="#fff"/><path d="M13 14 C15 20 14 25 13 28 M20 10 V29 M27 14 C25 20 26 25 27 28" fill="none"/></svg>`,
    `<svg viewBox="0 0 40 40"><rect x="7" y="8" width="26" height="26" rx="2" fill="#fff"/><path d="M12 15 H28 M12 20 H28 M12 25 H22"/></svg>`,
  ];
  let G;
  const geo = () => {
    const w = st.clientWidth, h = st.clientHeight;
    G = { x0: w * 0.07, x1: w * 0.93, yF: h * 0.03, yB: h * 0.36, depth: Math.max(140, w * 0.12) };
    G.W = G.x1 - G.x0; G.L = 2 * G.W + 2 * G.depth;
  };
  geo(); addEventListener("resize", geo);
  const posAt = (s) => {
    const { x0, x1, W, depth } = G;
    if (s < W) return { x: x0 + s, d: 0 };
    if (s < W + depth) return { x: x1, d: (s - W) / depth };
    if (s < 2 * W + depth) return { x: x1 - (s - W - depth), d: 1 };
    return { x: x0, d: 1 - (s - 2 * W - depth) / depth };
  };
  const yOf = (d) => G.yF + (G.yB - G.yF) * d;
  const items = [];
  const bubble = (p, text) => {
    const a = posAt(p.s), sc = 1 - 0.32 * a.d, b = document.createElement("div");
    b.className = "street-bubble mono"; b.textContent = text;
    b.style.transform = `translate3d(${a.x.toFixed(1)}px, ${(-yOf(a.d) - p.el.offsetHeight * sc - 6).toFixed(1)}px, 0)`;
    st.appendChild(b);
    gsap.fromTo(b, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" });
    gsap.to(b, { opacity: 0, y: -14, duration: 0.4, delay: 1.7, onComplete: () => b.remove() });
  };
  const drop = (p) => {
    const a = posAt(p.s), sc = 1 - 0.32 * a.d, e = document.createElement("div");
    e.className = "street-item"; e.innerHTML = pick(ITEMS); e.style.zIndex = a.d < 0.5 ? 4 : 2; st.appendChild(e);
    const it = { e, x: a.x, d: a.d, y: yOf(a.d) + p.el.offsetHeight * sc * 0.45, vy: 0, vx: (Math.random() - 0.5) * 60, r: 0, vr: (Math.random() - 0.5) * 500, sc, life: 14 };
    items.push(it);
    e.addEventListener("click", () => { it.vy = 520; it.vx = (Math.random() - 0.5) * 220; it.vr = (Math.random() - 0.5) * 900; });   /* kick it */
  };
  const people = crowd.map((c, i) => {
    const el = document.createElement("div");
    el.className = `walker walker--${c.kind}`;
    el.innerHTML = c.html;
    st.appendChild(el);
    const pet = c.kind !== "bust", dir = i % 3 === 1 ? -1 : 1;
    el.style.setProperty("--spd", (pet ? 0.42 : 0.5 + Math.random() * 0.2).toFixed(2) + "s");
    el.style.setProperty("--ph", (-Math.random() * 2).toFixed(2) + "s");
    const p = { el, pet, dir, face: dir, say: c.say, s: (i / crowd.length) * G.L, v: (pet ? 105 : 62 + Math.random() * 22) * (mobile ? 0.6 : 1), w: 0, z: -1, b: -1, pause: 0, slow: 1, trip: 0 };
    /* click a passer-by: they stop, say hi, sometimes drop what they carry */
    el.addEventListener("click", () => {
      if (p.pause > 0.3) return;
      p.pause = 2.2; el.classList.remove("is-wave"); void el.offsetWidth; el.classList.add("is-wave");
      bubble(p, pick(p.say || HELLO));
      if (!pet && Math.random() < 0.55) setTimeout(() => drop(p), 250);
    });
    el.addEventListener("pointerenter", () => (p.slow = 0.25));
    el.addEventListener("pointerleave", () => (p.slow = 1));
    return p;
  });
  /* click Tom in the middle: everybody stops and waves back */
  $("#streetMe").addEventListener("click", () => people.forEach((p, i) => setTimeout(() => { p.pause = 1.8; p.el.classList.remove("is-wave"); void p.el.offsetWidth; p.el.classList.add("is-wave"); if (i % 2 === 0) bubble(p, p.say ? pick(p.say) : pick(["hi Tom!", "hey Tom!", "o/", "salut Tom"])); }, i * 90)));
  let on = false, last = performance.now();
  new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(st);
  const tick = (dt) => {
    people.forEach((p) => {
      if (p.pause > 0) p.pause -= dt;
      else p.s = (p.s + p.v * p.slow * p.dir * dt + G.L) % G.L;
      const a = posAt(p.s), b = posAt((p.s + p.dir * 2 + G.L) % G.L);
      if (Math.abs(b.x - a.x) > 0.5) p.face = b.x > a.x ? 1 : -1;
      if (!p.w) p.w = p.el.offsetWidth;
      const sc = 1 - 0.32 * a.d, y = yOf(a.d);
      p.el.style.transform = `translate3d(${(a.x - p.w / 2).toFixed(1)}px, ${(-y).toFixed(1)}px, 0) scale(${(sc * (p.pet ? p.face : 1)).toFixed(3)}, ${sc.toFixed(3)})`;
      const z = a.d < 0.5 ? 4 : 2; if (z !== p.z) { p.z = z; p.el.style.zIndex = z; }
      const br = Math.round((1 - 0.38 * a.d) * 20) / 20; if (br !== p.b) { p.b = br; p.el.style.filter = br < 1 ? `brightness(${br})` : ""; }
      /* walking over something on the ground: trip and kick it */
      if (p.pause <= 0) for (const it of items) {
        if (it.vy !== 0 || Math.abs(it.d - a.d) > 0.12 || Math.abs(it.x - a.x) > 16) continue;
        p.pause = 0.7; p.el.classList.remove("is-trip"); void p.el.offsetWidth; p.el.classList.add("is-trip");
        bubble(p, p.pet ? "?!" : pick(OOPS));
        it.vy = 300; it.vx = p.face * (160 + Math.random() * 120); it.vr = p.face * 700; break;
      }
    });
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i], ground = yOf(it.d);
      it.vy -= 1500 * dt; it.y += it.vy * dt; it.x += it.vx * dt; it.r += it.vr * dt;
      if (it.y <= ground) { it.y = ground; it.vy = Math.abs(it.vy) > 80 ? -it.vy * 0.35 : 0; it.vx *= 0.6; it.vr *= 0.5; if (it.vy === 0) { it.vx *= 0.85; it.vr = 0; } }
      it.x = clamp(it.x, 10, st.clientWidth - 10);
      it.life -= dt;
      it.e.style.transform = `translate3d(${it.x.toFixed(1)}px, ${(-it.y).toFixed(1)}px, 0) translate(-50%, 0) rotate(${it.r.toFixed(0)}deg) scale(${(1 - 0.32 * it.d).toFixed(3)})`;
      it.e.style.opacity = Math.min(1, it.life);
      if (it.life <= 0) { it.e.remove(); items.splice(i, 1); }
    }
  };
  tick(0);
  gsap.ticker.add(() => {
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!on || REDUCED) return;
    tick(dt);
  });
}
const pick = (a) => a[(Math.random() * a.length) | 0];

/* ============================================================
   MINI ME — hangs from the logo, swings when you scroll
============================================================ */
function miniMe() {
  const logo = $(".logo"), sans = $(".logo__sans"); if (!logo || !sans) return;
  /* car air-freshener keychain hanging from the L of GALVAN: the key ring loops round the L's foot. Back half + chain + card sit under the header, the front half of the ring sits above it. */
  const m = document.createElement("div");
  m.className = "mini"; m.setAttribute("aria-hidden", "true");
  m.innerHTML = `<div class="mini__swing">
      <svg class="mini__ring" viewBox="0 0 40 60"><g class="mini__ringback"></g><g class="mini__beads"></g></svg>
      <div class="mini__card">
        <div class="mini__face mini__face--front"><i class="mini__tab"><b></b></i><img src="assets/people/main.png" alt="" draggable="false"><span class="mini__scent">code smell</span></div>
        <div class="mini__face mini__face--back"><i class="mini__tab"><b></b></i><img src="assets/people/main.png" alt="" draggable="false"><span class="mini__scent">eau de dev</span></div>
      </div>
    </div>`;
  const f = document.createElement("div");
  f.className = "mini mini--front"; f.setAttribute("aria-hidden", "true");
  f.innerHTML = `<div class="mini__swing"><svg class="mini__ring" viewBox="0 0 40 60"><g class="mini__ringfront"></g></svg></div>`;
  document.body.append(m, f);
  const swing = $(".mini__swing", m), swingF = $(".mini__swing", f), card = $(".mini__card", m);
  const ringBack = $(".mini__ringback", m), ringFront = $(".mini__ringfront", f), beads = $(".mini__beads", m);
  const letterL = () => {
    const w = document.createTreeWalker(sans, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const i = n.textContent.indexOf("L"); if (i >= 0) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1); return r.getBoundingClientRect(); } }
    return sans.getBoundingClientRect();
  };
  /* find the A's crossbar and hole by drawing the glyph and scanning its middle column */
  const measureA = (cs) => {
    const fs = parseFloat(cs.fontSize), S = 8, c = document.createElement("canvas"), x = c.getContext("2d", { willReadFrequently: true });
    c.width = fs * S * 1.4; c.height = fs * S * 1.6;
    const font = `${cs.fontWeight} ${fs * S}px ${cs.fontFamily}`;
    x.font = font; if ("fontStretch" in x) x.fontStretch = "semi-condensed";
    const mt = x.measureText("A"), base = fs * S * 1.3;
    x.fillStyle = "#000"; x.textBaseline = "alphabetic"; x.fillText("L", fs * S * 0.2, base);
    /* a column through the L's foot, right of its stem */
    const cx = Math.round(fs * S * 0.2 - mt.actualBoundingBoxLeft + (mt.actualBoundingBoxRight + mt.actualBoundingBoxLeft) * 0.6);
    const col = x.getImageData(cx, 0, 1, c.height).data, ink = (y) => col[y * 4 + 3] > 128;
    let y = c.height - 1;
    while (y > 0 && !ink(y)) y--; const barBot = y;           /* bottom of the foot */
    while (y > 0 && ink(y)) y--; const barTop = y;            /* top of the foot */
    const up = (v) => (base - v) / S;                          /* px above the baseline */
    return { barBot: up(barBot), barTop: up(barTop), ascent: mt.fontBoundingBoxAscent / S, cx: (cx - fs * S * 0.2) / S };
  };
  let pivot = 8;
  const place = () => {
    const A = letterL(), cs = getComputedStyle(sans), g = measureA(cs);
    const baseline = A.top + g.ascent;
    const top = g.barTop + 3.4, bottom = g.barBot - 3.4;            /* the ring loops round the foot of the L */
    const ry = (top - bottom) / 2, rx = 1.35, cy = 1.2 + ry;          /* ring seen almost edge-on, thinner than the hole */
    pivot = cy;
    const arc = (sweep) => `M20 ${(cy - ry).toFixed(2)} A${rx} ${ry.toFixed(2)} 0 0 ${sweep} 20 ${(cy + ry).toFixed(2)}`;
    const ring = `${arc(1)} ${arc(0).replace("M", "M")}`;
    /* behind the letter: the whole ring (only seen through the hole and between the legs) */
    ringBack.innerHTML = `<path d="${arc(1)}" class="mini__ringo"/><path d="${arc(0)}" class="mini__ringo"/><path d="${arc(1)}" class="mini__ringm"/><path d="${arc(0)}" class="mini__ringm"/>`;
    /* in front of the letter: only the part of the front arc that crosses the foot of the L */
    const yb1 = top + 1.2 - g.barTop - 0.6, yb2 = top + 1.2 - g.barBot + 0.6;
    ringFront.innerHTML = `<defs><clipPath id="miniBar"><rect x="0" y="${yb1.toFixed(2)}" width="40" height="${(yb2 - yb1).toFixed(2)}"/></clipPath></defs><g clip-path="url(#miniBar)"><path d="${arc(0)}" class="mini__ringo"/><path d="${arc(0)}" class="mini__ringm"/></g>`;
    const y0 = cy + ry + 2.2; beads.innerHTML = Array.from({ length: 6 }, (_, i) => `<circle cx="20" cy="${(y0 + i * 2.5).toFixed(2)}" r="1"/>`).join("");
    card.style.top = (y0 + 5 * 2.5 + 1.6) + "px";
    [swing, swingF].forEach((e) => (e.style.transformOrigin = `50% ${cy.toFixed(2)}px`));
    const x = A.left + g.cx - 20, y = baseline - top - 1.2;
    [m, f].forEach((e) => { e.style.left = x.toFixed(2) + "px"; e.style.top = y.toFixed(2) + "px"; });
  };
  place(); addEventListener("resize", place); document.fonts?.ready.then(place); setTimeout(place, 1500);
  const th = { x: 0, v: 0 }, spin = { a: 0, v: 0 };
  let last = performance.now();
  /* flick it: it twirls. Flick it too much: the ring opens, it falls, the real Tom gets angry and puts it back */
  let taps = [], fallen = false;
  const fall = () => {
    fallen = true; taps = [];
    f.style.opacity = 0;
    const dir = Math.random() < 0.5 ? -1 : 1;
    gsap.timeline()
      .to(m, { x: dir * (40 + Math.random() * 80), duration: 1.2, ease: "power1.out" }, 0)
      .to(m, { y: innerHeight + 160, duration: 1.2, ease: "power2.in" }, 0)
      .to(m, { rotation: dir * (300 + Math.random() * 300), duration: 1.2, ease: "power1.in" }, 0);
    document.dispatchEvent(new CustomEvent("tg:keydrop"));
    setTimeout(putBack, 2600);
  };
  const putBack = () => {
    const r = m.getBoundingClientRect(), mx = parseFloat(m.style.left), my = parseFloat(m.style.top);
    const av = $("#avatar"), ar = av?.getBoundingClientRect();
    const from = ar && ar.bottom > 0 && ar.top < innerHeight ? { x: ar.left + ar.width / 2, y: ar.top + ar.height * 0.7 } : { x: innerWidth / 2, y: innerHeight + 60 };
    gsap.set(m, { x: from.x - mx - 20, y: from.y - my, rotation: -160, scale: 0.6 });
    gsap.timeline({ onComplete: () => { fallen = false; f.style.opacity = 1; th.v += 160; spin.v += 500; document.dispatchEvent(new CustomEvent("tg:keyback")); } })
      .to(m, { x: 0, duration: 0.95, ease: "power1.inOut" }, 0)
      .to(m, { y: -60, duration: 0.55, ease: "power2.out" }, 0)
      .to(m, { y: 0, duration: 0.4, ease: "power2.in" }, 0.55)
      .to(m, { rotation: 0, scale: 1, duration: 0.95, ease: "power2.out" }, 0);
  };
  m.addEventListener("click", () => {
    if (fallen) return;
    spin.v += 900; th.v += 120;
    const now = performance.now(); taps = taps.filter((t) => now - t < 4500); taps.push(now);
    if (taps.length >= 10) fall();
  });
  gsap.ticker.add(() => {
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now;
    const sv = MOTION.sv;
    th.v += (-th.x * 32 - sv * 0.1) * dt; th.v *= Math.exp(-2 * dt); th.x = clamp(th.x + th.v * dt, -60, 60);
    spin.v += (Math.abs(sv) * 0.25 - spin.v * 1.6) * dt + Math.sin(now / 1300) * 60 * dt;
    spin.a += spin.v * dt;
    if (Math.abs(spin.v) < 40) spin.a += (Math.round(spin.a / 360) * 360 - spin.a) * 0.03 + Math.sin(now / 900) * 0.25;
    swing.style.transform = swingF.style.transform = `rotate(${th.x.toFixed(2)}deg)`;
    card.style.transform = `rotateY(${spin.a.toFixed(1)}deg)`;
  });
}

async function heroType() {
  await type($("#heroSub"), "software engineer — I build tools, bots, apps & websites.", { speed: 32, caret: true });
}

/* ============================================================
   CURSOR / ROLE / MENU
============================================================ */
const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.moved = true; }, { passive: true });
function cursor() {
  if (!HOVER) return;
  const c = $("#cursor"), label = $("#cursorLabel");
  let x = pointer.x, y = pointer.y;
  gsap.ticker.add(() => { x = lerp(x, pointer.x, 0.22); y = lerp(y, pointer.y, 0.22); c.style.transform = `translate3d(${x}px,${y}px,0)`; });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-cursor], a, button");
    c.classList.remove("is-hover", "is-label", "is-none");
    if (!t) return;
    if (t.dataset.cursor === "none") { c.classList.add("is-none"); return; }
    if (t.dataset.cursor === "label") { label.textContent = t.dataset.cursorLabel || ""; c.classList.add("is-label"); }
    else c.classList.add("is-hover");
  });
}
function roleRotator() {
  const el = $("#roleText"); if (!el) return;
  const glyphs = "!<>-_\\/[]{}=+*#"; let i = 0;
  const to = (text) => new Promise((res) => { let f = 0; (function step() { let out = ""; for (let k = 0; k < text.length; k++) out += k < f / 2 ? text[k] : text[k] === " " ? " " : glyphs[(Math.random() * glyphs.length) | 0]; el.textContent = out; if (f / 2 < text.length) { f++; requestAnimationFrame(step); } else res(); })(); });
  (async function cycle() { i = (i + 1) % ROLES.length; await to(ROLES[i].toLowerCase()); setTimeout(cycle, 2600); })();
}
function menu(lenis) {
  const btn = $("#menuBtn"), m = $("#menu"), links = $$(".menu__link span", m);
  gsap.set(links, { yPercent: 110 });
  const tl = gsap.timeline({ paused: true }).set(m, { visibility: "visible" })
    .to(m, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
    .to(links, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" }, "-=0.3");
  let open = false;
  const set = (v) => { open = v; document.body.classList.toggle("menu-open", v); btn.setAttribute("aria-expanded", v); m.setAttribute("aria-hidden", !v); if (v) { tl.timeScale(1).play(); lenis?.stop(); } else { tl.timeScale(1.6).reverse(); lenis?.start(); } };
  btn.addEventListener("click", () => set(!open));
  $$("a[href^='#']", m).forEach((a) => a.addEventListener("click", () => set(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && open && set(false));
}

/* ============================================================
   THEME per section (body colour + topo)
============================================================ */
const THEMES = {
  light: { bg: "#efeee9", topo: "rgba(11,11,11,.12)", cls: "light" },
  dark: { bg: "#0b0b0b", topo: "rgba(239,238,233,.07)", cls: "dark" },
  black: { bg: "#000000", topo: "rgba(239,238,233,.05)", cls: "black" },
  night: { bg: "#121211", topo: "rgba(239,238,233,.08)", cls: "dark" },   /* light sections, after dark */
};
let NIGHT = localStorage.getItem("tg-night") === "1", curTheme = "light";
document.body.classList.toggle("night", NIGHT);
function setTheme(name) {
  curTheme = name;
  /* day: every section is light · night: light sections go dark, dark ones stay dark */
  const t = THEMES[!NIGHT ? "light" : name === "light" ? "night" : name];
  document.body.classList.remove("theme-light", "theme-dark", "theme-black");
  document.body.classList.add(`theme-${t.cls}`);
  gsap.to(document.body, { backgroundColor: t.bg, duration: 0.9, ease: "power2.inOut", overwrite: true });
  Topo.setColor(t.topo);
}
function setNight(v) {
  NIGHT = v;
  localStorage.setItem("tg-night", v ? "1" : "0");
  document.body.classList.toggle("night", v);
  $('meta[name="theme-color"]')?.setAttribute("content", v ? "#121211" : "#efeee9");
  if (window.gsap) setTheme(curTheme);
  document.dispatchEvent(new CustomEvent("tg:night", { detail: v }));
}

/* ============================================================
   DAY / NIGHT PLUG — drag the plug into the socket
============================================================ */
function plug() {
  const root = $("#plug"); if (!root) return;
  if (NIGHT) setTheme(curTheme);
  const socketBox = $(".plug__socket", root), strip = $(".plug__strip", root), label = $(".plug__label", root), spark = $(".plug__spark", root);
  const plugEl = $(".plug__plug", root), cable = $(".plug__cbl", root), cableIn = $(".plug__cblin", root), orbitBtn = $(".plug__orbitbtn", root);
  const HC = { x: 30, y: 40 };                /* plug head centre inside its 60x80 box */
  const MOB = innerWidth < 760, N = MOB ? 26 : 34, ITER = MOB ? 7 : 10, MAXLEN = 2400, SOCK_Y = 68;   /* socket centre in the strip's 56x110 viewBox */
  /* a hidden power socket in the character's chest, only visible through the x-ray (image coords 647x663) */
  const BODY = { x: 325, y: 552 };
  let S = { x: 0, y: 0 }, R, A, k = 1, P = { x: 0, y: 0 }, where = null, drag = null;   /* where: null | "strip" | "body" */
  const rot = { a: 0, t: 0 }, face = { v: 0 };   /* face: 0 = side view, 1 = seen from the back (in his chest) */
  const measure = () => {
    const r = strip.getBoundingClientRect(); k = r.height / 110;
    S = { x: r.left + 9 * k - 22, y: r.top + SOCK_Y * k };       /* plug centre once its pins are in */
    R = { x: S.x - 70, y: S.y + 130 };                          /* where it hangs when free */
    A = { x: innerWidth + 14, y: r.bottom + 80 };               /* the cord leaves through the right edge */
  };
  const hero = () => $("#avatar");
  const bodySock = () => {
    const av = hero(); if (!av) return null;
    const r = rectOf(av); if (r.bottom < 0 || r.top > innerHeight) return null;
    return { x: r.left + (BODY.x / 647) * r.width, y: r.top + (BODY.y / 663) * r.height };   /* front-facing port: the plug goes in face on */
  };

  /* ---------- orbit switch on the strip ---------- */
  let orbitOn = localStorage.getItem("tg-orbit") !== "0";
  const setOrbit = (v, fx = true) => {
    orbitOn = v; localStorage.setItem("tg-orbit", v ? "1" : "0");
    root.classList.toggle("is-orbit", v); orbitBtn.setAttribute("aria-pressed", v);
    if (fx) document.dispatchEvent(new CustomEvent("tg:orbit", { detail: v }));
    setLabel();
  };
  orbitBtn.addEventListener("click", () => { setOrbit(!orbitOn); gsap.fromTo(socketBox, { x: 2 }, { x: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" }); });

  const setLabel = () => {
    label.textContent = where === "body" ? "light → tom.exe ?!" : `light ${where === "strip" ? "on" : "off"} · orbit ${orbitOn ? "on" : "off"}`;
    root.classList.toggle("is-on", where === "strip"); root.classList.toggle("is-in", where === "strip"); root.classList.toggle("is-s1", where === "strip");
  };
  const move = () => { plugEl.style.transform = `translate3d(${P.x - HC.x}px, ${P.y - HC.y}px, 0) rotate(${rot.a.toFixed(2)}deg)`; };
  const rotVec = (x, y) => { const a = (rot.a * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return { x: x * c - y * s, y: x * s + y * c }; };
  const end = () => { const v = rotVec(0, 30 * (1 - face.v)); return { x: P.x + v.x, y: P.y + v.y }; };
  const robot = (v) => { const av = hero(); if (!av) return; av.classList.toggle("is-robot", v); document.dispatchEvent(new CustomEvent("tg:robot", { detail: v })); };
  const plugInto = (w, fx = true) => {
    where = w; rot.t = w === "strip" ? 90 : 0;
    root.classList.toggle("is-body", w === "body"); gsap.to(face, { v: w === "body" ? 1 : 0, duration: 0.26, ease: "power2.out", overwrite: true });
    if (w === "strip") { if (NIGHT) setNight(false); }
    else robot(true);
    setLabel();
    if (fx && w === "strip") {
      spark.style.left = (9 * k) + "px"; spark.style.top = (SOCK_Y * k) + "px";
      gsap.fromTo(spark, { scale: 0.4, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(socketBox, { x: 3 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    }
  };
  const unplug = () => { if (!where) return; if (where === "body") { robot(false); root.classList.remove("is-body"); gsap.to(face, { v: 0, duration: 0.2, overwrite: true }); } where = null; if (!NIGHT) setNight(true); setLabel(); };

  measure(); setOrbit(orbitOn, false);
  if (!NIGHT) { plugInto("strip", false); rot.a = 90; P = { ...S }; } else P = { ...R };
  move(); setLabel();
  addEventListener("resize", () => { measure(); if (!drag && where !== "body") { gsap.killTweensOf(P); P = where ? { ...S } : { ...R }; move(); } });

  /* ---------- obstacles for the cord: typed title letters + the characters ---------- */
  let obstacles = [], frame = 0;
  const avatarShapes = (el) => {
    const r = rectOf(el); if (r.bottom < 0 || r.top > innerHeight || !r.width) return [];
    const w = r.width, h = r.height, X = (u) => r.left + u * w, Y = (v) => r.top + v * h;
    return [
      { c: true, x: X(0.5), y: Y(0.33), r: w * 0.25, el },
      { c: true, x: X(0.5), y: Y(0.63), r: w * 0.085, neck: true, el },
      { c: false, l: X(0.06), t: Y(0.74), r: X(0.94), b: r.bottom, el },
    ];
  };
  let letters = [], lettersT = 0;
  const refreshObstacles = () => {
    const o = [], now = performance.now();
    if (now - lettersT > 2000) { letters = $$(".k.on"); lettersT = now; }     /* re-query the typed letters only every 2 s */
    letters.forEach((kk) => {
      const r = rectOf(kk);
      if (r.bottom < -20 || r.top > innerHeight + 20 || r.width < 6) return;
      const ix = r.width * 0.1, iy = r.height * 0.16;
      o.push({ c: false, l: r.left + ix, t: r.top + iy, r: r.right - ix, b: r.bottom - iy * 0.6 });
    });
    $$(".pav").forEach((el) => o.push(...avatarShapes(el)));
    obstacles = o;
  };
  const inside = (o, x, y, m = 0) => o.c ? Math.hypot(x - o.x, y - o.y) < o.r + m : x > o.l - m && x < o.r + m && y > o.t - m && y < o.b + m;
  const collide = (q) => {
    for (const o of obstacles) {
      if (o.c) {
        const dx = q.x - o.x, dy = q.y - o.y, d = Math.hypot(dx, dy), rr = o.r + 3;
        if (d < rr && d > 0.001) { q.x = o.x + (dx / d) * rr; q.y = o.y + (dy / d) * rr; }
      } else if (q.x > o.l - 3 && q.x < o.r + 3 && q.y > o.t - 3 && q.y < o.b + 3) {
        const dl = q.x - (o.l - 3), dr = o.r + 3 - q.x, dt = q.y - (o.t - 3), db = o.b + 3 - q.y, m = Math.min(dl, dr, dt, db);
        if (m === dl) q.x = o.l - 3; else if (m === dr) q.x = o.r + 3; else if (m === dt) q.y = o.t - 3; else q.y = o.b + 3;
      }
    }
  };
  const e0 = end();
  const pts = Array.from({ length: N }, (_, i) => { const t = i / (N - 1); const x = lerp(e0.x, A.x, t), y = lerp(e0.y, A.y, t) + Math.sin(t * Math.PI) * 40; return { x, y, px: x, py: y }; });
  const strangled = () => {
    for (const o of obstacles) {
      if (!o.neck) continue;
      const ang = [];
      for (const q of pts) { const d = Math.hypot(q.x - o.x, q.y - o.y); if (d < o.r * 2.6) ang.push(Math.atan2(q.y - o.y, q.x - o.x)); }
      if (ang.length < 4) continue;
      ang.sort((a, b) => a - b);
      let gap = ang[0] + Math.PI * 2 - ang[ang.length - 1];
      for (let i = 1; i < ang.length; i++) gap = Math.max(gap, ang[i] - ang[i - 1]);
      if (gap < Math.PI * 1.25) return o.el;
    }
    return null;
  };
  let zapCool = 0, contact = 0;
  const zap = (el) => {
    zapCool = 2.6; contact = 0;
    el.classList.remove("is-burnt"); el.classList.add("is-zapped");
    document.body.classList.add("is-zap"); setTimeout(() => document.body.classList.remove("is-zap"), 160);
    setTimeout(() => { el.classList.remove("is-zapped"); el.classList.add("is-burnt"); }, 1300);
    setTimeout(() => el.classList.remove("is-burnt"), 4600);
    document.dispatchEvent(new CustomEvent("tg:zap"));
  };
  const drawCord = () => {
    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < N - 1; i++) { const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; d += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
    d += ` L${pts[N - 1].x.toFixed(1)} ${pts[N - 1].y.toFixed(1)}`;
    cable.setAttribute("d", d); cableIn.setAttribute("d", d);
  };
  let choked = null, lastT = performance.now(), still = 0;
  gsap.ticker.add(() => {
    const now = performance.now(), dt = Math.min((now - lastT) / 1000, 1 / 30); lastT = now;
    if (++frame % 5 === 0) refreshObstacles();
    const bs = bodySock();
    /* plugged into Tom: the plug rides along with him (breathing, scroll) */
    if (where === "body" && !drag) { if (bs) { P.x = bs.x; P.y = bs.y; move(); } }
    /* the plug turns sideways as it reaches a socket */
    if (drag) {
      const dd = Math.hypot(P.x - S.x, P.y - S.y);
      rot.t = 90 * clamp(1 - (dd - 24) / 130, 0, 1);       /* only the strip makes it turn sideways */
      root.classList.toggle("is-near", Math.hypot(P.x - S.x, P.y - S.y) < 36);
      hero()?.classList.toggle("is-portnear", !!bs && Math.hypot(P.x - bs.x, P.y - bs.y) < 90);
    } else rot.t = where === "strip" ? 90 : 0;
    if (Math.abs(rot.t - rot.a) > 0.05) { rot.a = lerp(rot.a, rot.t, 0.2); move(); }
    /* the cord sleeps once it has settled and nothing moves around it */
    const active = drag || where === "body" || Math.abs(MOTION.sv) > 2 || gsap.isTweening(P) || Math.abs(rot.t - rot.a) > 0.05;
    if (active) still = 0;
    if (still < 45) {
    const e = end();
    const rest = clamp(Math.hypot(e.x - A.x, e.y - A.y) * 1.12, 80, MAXLEN) / (N - 1);
    const g = 1600 * dt * dt;
    let motion = 0;
    for (let i = 1; i < N - 1; i++) { const q = pts[i], vx = (q.x - q.px) * 0.98, vy = (q.y - q.py) * 0.98; motion += Math.abs(vx) + Math.abs(vy); q.px = q.x; q.py = q.y; q.x += vx; q.y += vy + g; }
    still = motion < N * 0.03 ? still + 1 : 0;
    for (let it = 0; it < ITER; it++) {
      pts[0].x = e.x; pts[0].y = e.y; pts[N - 1].x = A.x; pts[N - 1].y = A.y;
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.001, diff = (d - rest) / d;
        const wa = i === 0 ? 0 : 0.5, wb = i + 1 === N - 1 ? 0 : 0.5, sum = wa + wb || 1;
        a.x += dx * diff * (wa / sum); a.y += dy * diff * (wa / sum);
        b.x -= dx * diff * (wb / sum); b.y -= dy * diff * (wb / sum);
      }
      if (it % 3 === 2 || it === ITER - 1) for (let i = 1; i < N - 1; i++) collide(pts[i]);   /* collisions every 3rd pass */
    }
    drawCord();
    }
    const c = strangled();
    if (c !== choked) { choked?.classList.remove("is-choked"); c?.classList.add("is-choked"); choked = c; }
    /* electrocuted: the pins of the free plug stay on a character (but not on his hidden power socket) */
    zapCool -= dt;
    if (!where && zapCool <= 0) {
      const tip = rotVec(0, -36), tx = P.x + tip.x, ty = P.y + tip.y;
      const nearPort = bs && Math.hypot(P.x - bs.x, P.y - bs.y) < 90;
      const hit = !nearPort && obstacles.find((o) => o.el && (inside(o, tx, ty, 6) || inside(o, P.x, P.y, 0)));
      contact = hit ? contact + dt : 0;
      if (hit && contact > (drag ? 0.35 : 0)) zap(hit.el);
    }
  });

  /* ---------- drag & plug in ---------- */
  const to = (target, opts = {}) => gsap.to(P, { x: target.x, y: target.y, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true, onUpdate: move, ...opts });
  plugEl.addEventListener("pointerdown", (e) => {
    e.preventDefault(); measure(); gsap.killTweensOf(P);
    drag = { dx: e.clientX - P.x, dy: e.clientY - P.y };
    plugEl.setPointerCapture(e.pointerId); root.classList.add("is-drag");
  });
  plugEl.addEventListener("pointermove", (e) => {
    if (!drag) return;
    let x = e.clientX - drag.dx, y = e.clientY - drag.dy;
    const dx = x - A.x, dy = y - A.y, d = Math.hypot(dx, dy);
    if (d > MAXLEN * 0.86) { x = A.x + (dx / d) * MAXLEN * 0.86; y = A.y + (dy / d) * MAXLEN * 0.86; }
    P.x = x; P.y = y;
    const anchor = where === "strip" ? S : where === "body" ? bodySock() : null;
    if (anchor && Math.hypot(x - anchor.x, y - anchor.y) > 40) unplug();
    move();
  });
  const drop = () => {
    if (!drag) return; drag = null; root.classList.remove("is-drag", "is-near"); hero()?.classList.remove("is-portnear");
    const bs = bodySock();
    if (Math.hypot(P.x - S.x, P.y - S.y) < 36) gsap.to(P, { x: S.x, y: S.y, duration: 0.18, ease: "power3.in", overwrite: true, onUpdate: move, onComplete: () => plugInto("strip") });
    else if (bs && Math.hypot(P.x - bs.x, P.y - bs.y) < 60) gsap.to(P, { x: bs.x, y: bs.y, duration: 0.18, ease: "power3.in", overwrite: true, onUpdate: move, onComplete: () => plugInto("body") });
    else { unplug(); to(R, { duration: 1.1 }); }
  };
  plugEl.addEventListener("pointerup", drop);
  plugEl.addEventListener("pointercancel", drop);
  plugEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); measure();
    if (where) { unplug(); to(R, { duration: 0.5 }); } else to(S, { duration: 0.5, onComplete: () => plugInto("strip") });
  });
}

/* ============================================================
   SCROLL SCENES
============================================================ */
function scenes(lenis) {
  // theme = whatever section sits at 55% of the viewport (robust with pins and horizontal scroll)
  let cur = "light", tf = 0;
  gsap.ticker.add(() => {
    if (++tf % 5) return;
    const hit = document.elementsFromPoint(innerWidth / 2, innerHeight * 0.55).find((el) => el.closest("main [data-theme]"));
    const sec = hit && hit.closest("main [data-theme]");
    if (sec && sec.dataset.theme !== cur) { cur = sec.dataset.theme; setTheme(cur); }
  });

  /* hero sinks */
  gsap.to(".hero__front", { yPercent: 16, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* statement: pinned, rows slide, card opens and types code, signature draws */
  const sig = drawSig($(".statement__sig"));
  let typed = false;
  const st = gsap.timeline({ scrollTrigger: { trigger: ".statement", start: "top top", end: "+=150%", pin: true, scrub: 0.8 } });
  $$(".srow__t").forEach((t, i) => { const dir = i % 2 ? 1 : -1; st.fromTo(t, { xPercent: dir > 0 ? -45 : 0 }, { xPercent: dir > 0 ? 0 : -45, ease: "none", duration: 1 }, 0); });
  let captioned = false;
  st.to(".statement__rows", { opacity: 0.18, ease: "none", duration: 0.15 }, 0.08)
    .to(sig, { strokeDashoffset: 0, ease: "none", duration: 0.12, stagger: 0.09 }, 0.15)
    .add(() => { if (captioned) return; captioned = true; type($("#sigCaption"), "— signed, Tom Galvan · Paris", { speed: 40, caret: false }); }, 0.62);

  /* typewriter titles */
  $$(".strike").forEach((el) => { const keys = prepStrike(el); ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => strike(keys) }); });

  /* block line wipes (Lando) */
  $$(".wipe").forEach((el) => {
    const lines = splitLines(el), texts = lines.map((l) => $(".wl__t", l)), blocks = lines.map((l) => $(".wl__b", l));
    gsap.set(texts, { opacity: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
    lines.forEach((l, i) => {
      gsap.set(blocks[i], { width: texts[i].getBoundingClientRect().width + 8 });
      tl.to(blocks[i], { scaleX: 1, duration: 0.42, ease: "expo.inOut" }, i * 0.08).set(texts[i], { opacity: 1 }, i * 0.08 + 0.42)
        .set(blocks[i], { transformOrigin: "right" }, i * 0.08 + 0.42).to(blocks[i], { scaleX: 0, duration: 0.42, ease: "expo.inOut" }, i * 0.08 + 0.42);
    });
  });
  $$(".tag i, .exhibit__label i").forEach((i) => gsap.from(i, { scaleX: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: i, start: "top 92%" } }));
  $$("[data-count]").forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => { const o = { v: +(el.dataset.from || 0) }; gsap.to(o, { v: +el.dataset.count, duration: 1.8, ease: "expo.out", onUpdate: () => (el.textContent = Math.round(o.v)) }); } });
  });

  /* gallery: staggered reveal, 3D tilt on hover */
  gsap.set(".exhibit", { opacity: 0, y: 70, rotateX: -12 });
  ScrollTrigger.batch(".exhibit", { start: "top 92%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }) });
  if (HOVER) $$(".exhibit").forEach((e) => {
    const card = $(".exhibit__card", e);
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" }), ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
    e.addEventListener("pointermove", (ev) => { const r = e.getBoundingClientRect(); ry(((ev.clientX - r.left) / r.width - 0.5) * 14); rx(-((ev.clientY - r.top) / r.height - 0.5) * 12); });
    e.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });
  /* featured 8 + "more" toggle; a filter always shows every match */
  function applyWork(f) {
    $$(".exhibit").forEach((e) => (e.style.display = (f === "all" ? workOpen || !e.classList.contains("is-more") : e.dataset.lang === f || e.dataset.tags.split(",").includes(f)) ? "" : "none"));
    const extra = PROJECTS.length - FEATURED;
    moreBtn.style.display = f === "all" ? "" : "none";
    moreBtn.innerHTML = workOpen ? "↑ show less" : `+ ${extra} more repos <span>git log --all</span>`;
  }
  applyWork("all");
  moreBtn.addEventListener("click", () => {
    workOpen = !workOpen; applyWork("all");
    const shown = $$(".exhibit.is-more");
    if (workOpen) gsap.fromTo(shown, { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.04, ease: "expo.out" });
    else $("#work").scrollIntoView({ behavior: "smooth" });
    ScrollTrigger.refresh();
  });
  /* language filters */
  $("#filters").addEventListener("click", (ev) => {
    const btn = ev.target.closest(".filter"); if (!btn || btn.classList.contains("is-on")) return;
    $$(".filter").forEach((b) => b.classList.toggle("is-on", b === btn));
    const f = btn.dataset.f, all = $$(".exhibit");
    gsap.to(all, { opacity: 0, y: 20, scale: 0.94, duration: 0.25, stagger: 0.015, ease: "power2.in", onComplete: () => {
      applyWork(f);
      const shown = all.filter((e) => e.style.display !== "none");
      gsap.fromTo(shown, { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.06, ease: "expo.out" });
      ScrollTrigger.refresh();
    } });
  });

  const mm = gsap.matchMedia();

  /* JOURNEY horizontal */
  mm.add("(min-width: 901px)", () => {
    const track = $("#journeyTrack"), dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: ".journey", start: "top top", end: () => "+=" + dist(), pin: ".journey__pin", scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => gsap.set("#journeyBar", { scaleX: s.progress }) } });
    $$(".frame__n").forEach((n) => gsap.from(n, { xPercent: 60, ease: "none", scrollTrigger: { trigger: n.closest(".frame"), containerAnimation: tween, start: "left right", end: "left 30%", scrub: true } }));
    $$(".frame h3").forEach((t) => gsap.from(t, { y: 50, opacity: 0, ease: "expo.out", duration: 1, scrollTrigger: { trigger: t, containerAnimation: tween, start: "left 85%" } }));
  });

  /* rows */
  /* revealed on real visibility, so late layout changes (live GitHub data above) can't leave them stuck */
  const rowIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    rowIO.unobserve(e.target);
    gsap.fromTo($(".row__n", e.target), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
  }), { rootMargin: "0px 0px 10% 0px" });
  $$(".row").forEach((r) => { gsap.set($(".row__n", r), { yPercent: 100, opacity: 0 }); rowIO.observe(r); });

  /* footer signature */
  const fs = drawSig($(".footer__sig"));
  gsap.to(fs, { strokeDashoffset: 0, duration: 0.5, stagger: 0.15, ease: "power2.inOut", scrollTrigger: { trigger: ".footer__bottom", start: "top 95%" } });
}

/* ============================================================
   PRELOADER + INTRO
============================================================ */
function loader() {
  return new Promise((resolve) => {
    const L = $("#loader"), num = $("#loaderNum"), paths = drawSig($(".loader__sig", L)), o = { v: 0 };
    type($("#loaderType"), "$ git clone github.com/TomGlv/portfolio && npm start", { speed: 22, caret: true });
    gsap.timeline({ onComplete: () => { L.remove(); document.body.classList.remove("is-loading"); resolve(); } })
      .to(paths, { strokeDashoffset: 0, duration: 0.55, stagger: 0.18, ease: "power2.inOut" }, 0)
      .to(o, { v: 100, duration: 1.9, ease: "power2.inOut", onUpdate: () => (num.textContent = Math.round(o.v)) }, 0)
      .to(".loader__blocks i", { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "expo.inOut" }, "+=0.1")
      .to([".loader__sig", ".loader__count", ".loader__type"], { opacity: 0, duration: 0.2 }, "<0.3")
      .to(L, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" });
  });
}
function heroIntro() {
  const keysA = prepStrike($(".hero__serif")), keysB = prepStrike($(".hero__sans"));
  strike(keysA, 90); setTimeout(() => strike(keysB, 70), 380);
  gsap.from([".logo", ".header__right > *"], { y: -30, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out", delay: 0.2 });
  gsap.from([".hero__card", ".hero__role"], { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", delay: 0.5 });
  gsap.from(".hero__avatar", { yPercent: 60, opacity: 0, duration: 1.4, ease: "back.out(1.4)", delay: 0.35 });
  setTimeout(heroType, 900);
}

/* ============================================================
   INIT
============================================================ */
(async function init() {
  roleRotator();
  if (!window.gsap) { $("#loader")?.remove(); document.body.classList.remove("is-loading"); return; }
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!REDUCED && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", (e) => { ScrollTrigger.update(); Topo.setScroll(e.scroll); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  } else addEventListener("scroll", () => Topo.setScroll(scrollY), { passive: true });
  window.__lenis = lenis;
  $$("a[href^='#']").forEach((a) => a.addEventListener("click", (e) => { const t = $(a.getAttribute("href")); if (!t) return; e.preventDefault(); lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: "smooth" }); }));
  cursor(); menu(lenis); hero(); street(); miniMe(); plug(); if (window.PFX) PFX.init($("#avatarWrap"));
  await document.fonts?.ready;
  scenes(lenis);
  ScrollTrigger.sort();   /* commit log now comes before the projects: order pins by page position */
  if (REDUCED) { $("#loader").remove(); document.body.classList.remove("is-loading"); $$(".k").forEach((k) => k.classList.add("on")); }
  else await loader();
  heroIntro();
  lenis?.start();
  ScrollTrigger.refresh();
  /* live data (commits, repos) changes the page height after load: re-measure every trigger */
  let rh = document.body.scrollHeight, rt;
  new ResizeObserver(() => {
    const h = document.body.scrollHeight;
    if (Math.abs(h - rh) < 4) return;
    rh = h; clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
})();
