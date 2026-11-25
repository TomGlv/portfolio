/* ============================================================
   DEV LAYER — typewriter code, live GitHub records, case files,
   interrogation terminal, git-log reel, handwriting samples.
   Runs after script.js (shares PROJECTS / PHOTO / SKILLS / $ / $$).
============================================================ */
(() => {
  const USER = "TomGlv";
  const TTL = 6 * 3600 * 1000;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const repoOf = (p) => (p.priv ? null : p.url.split("/").pop());
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

  /* snapshot (used until the live API answers, or if it doesn't) */
  const SNAP = {
    "AMD-LA-PEUFRA-TRACKER": { lang: "Python", created: "2026-04-19", pushed: "2026-07-01", size: 9 },
    "AMD-LAGRINTA-TRACKER": { lang: "Python", created: "2026-04-16", pushed: "2026-05-09", size: 26 },
    "archidia-web": { lang: "Astro", created: "2026-04-30", pushed: "2026-11-04", size: 71243 },
    "bot_projet_voltaire": { lang: "C++", created: "2025-01-15", pushed: "2026-11-04", size: 289 },
    "DPM-plus-V2": { lang: "Python", created: "2026-04-10", pushed: "2026-11-22", size: 98 },
    "GestionOrdi": { lang: "Java", created: "2025-11-16", pushed: "2025-11-16", size: 6 },
    "minecraft-house-ai": { lang: "Python", created: "2026-06-24", pushed: "2026-06-24", size: 10337 },
    "SoWeSign": { lang: "Java", created: "2025-12-03", pushed: "2025-12-10", size: 5406 },
    "TaskFlow": { lang: "HTML", created: "2026-06-28", pushed: "2026-07-03", size: 111 },
    "WorldCupStats": { lang: "C#", created: "2026-06-10", pushed: "2026-06-15", size: 70 },
  };

  const BRANCH = { "AMD-LA-PEUFRA-TRACKER": "main", "AMD-LAGRINTA-TRACKER": "main", "archidia-web": "main", "bot_projet_voltaire": "master", "DPM-plus-V2": "master", "GestionOrdi": "master", "minecraft-house-ai": "master", "SoWeSign": "master", "TaskFlow": "master", "WorldCupStats": "Masterclass" };

  /* ============================================================
     TYPEWRITER — uneven ink, carriage returns, syntax colours
  ============================================================ */
  const KW = new Set("def class return if elif else for while in import from as with try except finally raise lambda yield async await pass break continue not and or is None True False self public private protected static void int float double bool boolean string String char long new const let var function this null true false using namespace include auto struct template typename override virtual package extends implements interface final throws throw catch switch case default export".split(" "));
  function tokens(text) {
    const out = [], re = /(\/\/[^\n]*|#(?!include)[^\n]*|<!--[^\n]*|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`\n]*`|\b\d+(?:\.\d+)?\b|#include|\b[A-Za-z_][\w]*\b|\n|\s+|.)/g;
    let m;
    while ((m = re.exec(text))) {
      const t = m[0];
      let c = "";
      if (/^(\/\/|#(?!include)|<!--)/.test(t)) c = "c";
      else if (/^["'`]/.test(t)) c = "s";
      else if (/^\d/.test(t)) c = "n";
      else if (t === "#include" || KW.has(t)) c = "k";
      out.push([t, c]);
    }
    return out;
  }
  const TW = {
    async type(el, text, { speed = 34, code = false, caret = true, job } = {}) {
      el.classList.add("tw");
      const car = document.createElement("span"); car.className = "tw__caret";
      el.appendChild(car);
      const toks = code ? tokens(text) : [[text, ""]];
      const instant = REDUCED;
      for (const [t, c] of toks) {
        for (const ch of t) {
          if (job && job.dead) return;
          if (ch === "\n") { el.insertBefore(document.createElement("br"), car); if (!instant) await sleep(speed * 5); continue; }
          const s = document.createElement("span");
          s.className = "tw__c" + (c ? " t-" + c : "");
          s.textContent = ch;
          s.style.cssText = `--r:${((Math.random() - 0.5) * 2.4).toFixed(2)}deg;--y:${((Math.random() - 0.5) * 1.4).toFixed(2)}px;--o:${(0.72 + Math.random() * 0.28).toFixed(2)}`;
          el.insertBefore(s, car);
          if (!instant) await sleep(ch === " " ? speed * 0.5 : speed * (0.55 + Math.random() * 0.9));
        }
      }
      if (!caret) car.remove();
    },
    set(el, text, code = false) {
      el.innerHTML = (code ? tokens(text) : [[text, ""]]).map(([t, c]) => t === "\n" ? "<br>" : `<span class="tw__c${c ? " t-" + c : ""}">${esc(t)}</span>`).join("");
    },
  };

  /* ============================================================
     GITHUB — cached, rate-limit friendly
  ============================================================ */
  async function cached(key, fn) {
    try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < TTL) return c.v; } catch (e) {}
    const v = await fn();
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch (e) {}
    return v;
  }
  const api = (path) => cached("gh:" + path, async () => {
    const r = await fetch("https://api.github.com" + path, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(r.status);
    return r.json();
  });
  const DATA = { repos: {}, commits: {}, ready: false };
  async function loadRecords() {
    try {
      const list = await api(`/users/${USER}/repos?per_page=100`);
      list.forEach((r) => (DATA.repos[r.name] = { lang: r.language || "—", created: r.created_at, pushed: r.pushed_at, size: r.size, stars: r.stargazers_count, branch: r.default_branch, desc: r.description }));
      const names = PROJECTS.map(repoOf).filter(Boolean);
      await Promise.all(names.map(async (n) => {
        try {
          const c = await api(`/repos/${USER}/${n}/commits?per_page=100`);
          DATA.commits[n] = c.map((x) => ({ sha: x.sha.slice(0, 7), msg: (x.commit.message || "").split("\n")[0], date: x.commit.author && x.commit.author.date }));
        } catch (e) { DATA.commits[n] = []; }
      }));
      DATA.ready = true;
    } catch (e) { DATA.ready = false; }
    return DATA;
  }
  async function snippet(repo, exts) {
    return cached(`snip4:${repo}:${exts}`, async () => {
      // one request: the whole tree, then pick the biggest real source file
      const branch = (DATA.repos[repo] && DATA.repos[repo].branch) || BRANCH[repo] || "main";
      const tree = await api(`/repos/${USER}/${repo}/git/trees/${branch}?recursive=1`);
      const files = (tree.tree || []).filter((f) => f.type === "blob" && exts.some((x) => f.path.toLowerCase().endsWith(x))
        && !/(^|\/)(\.|node_modules|vendor|dist|build|bin|obj|packages|venv|__pycache__)/i.test(f.path)
        && !/test|config|setup|__init__|designer|assemblyinfo|\.min\./i.test(f.path));
      const file = files.sort((a, b) => b.size - a.size)[0];
      if (!file) return null;
      file.download_url = `https://raw.githubusercontent.com/${USER}/${repo}/${branch}/${file.path.split("/").map(encodeURIComponent).join("/")}`;
      file.html_url = `https://github.com/${USER}/${repo}/blob/${branch}/${file.path}`;
      const raw = await (await fetch(file.download_url)).text();
      const lines = raw.replace(/\r/g, "").split("\n");
      // find a real function/method with a body, not separators or imports
      const isNoise = (l) => !l.trim() || /^\s*(\/\/|#(?!include)|\*|\/\*|--|={3,}|-{3,})/.test(l) || /^[\s\/\-=*#]+$/.test(l);
      const isArt = (l) => { const t = l.replace(/\s/g, ""); return t.length > 6 && (t.match(/[^ -~]/g) || []).length / t.length > 0.25; };
      const fnRe = /^\s*(async\s+def|def|class)\s+\w+|^\s*(public|private|protected|internal|static|export|async|function)\b[^;=]*\(|^\s*[\w:<>,*&\[\]\s]+\s+[~\w:]+\s*\([^;]*\)\s*(const\s*)?\{?\s*$/;
      const bad = /^\s*(return|if|else|for|while|switch|case|catch|using|import|#include)\b/;
      let best = 0, bestScore = -1;
      lines.forEach((l, k) => {
        if (!fnRe.test(l) || bad.test(l)) return;
        const win = lines.slice(k, k + 13);
        const score = win.filter((x) => !isNoise(x) && !isArt(x)).length - win.filter(isArt).length * 3;
        if (score > bestScore) { best = k; bestScore = score; }
      });
      let i = best;
      const cut = lines.slice(i, i + 13)
        .map((l) => l.replace(/\t/g, "  ").replace(/\s+$/, ""))
        .map((l) => (/(api[_-]?key|token|secret|password)\s*[=:]/i.test(l) ? l.replace(/([=:]\s*).+$/, "$1<redacted>") : l))
        .map((l) => (l.length > 74 ? l.slice(0, 73) + "…" : l));
      while (cut.length && !cut[cut.length - 1].trim()) cut.pop();
      return { path: file.path, url: file.html_url, code: cut.join("\n") };
    });
  }
  async function readme(repo) {
    return cached(`readme:${repo}`, async () => {
      const r = await fetch(`https://api.github.com/repos/${USER}/${repo}/readme`, { headers: { Accept: "application/vnd.github.raw" } });
      if (!r.ok) return null;
      const md = await r.text();
      const text = md.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, " ")
        .split("\n").map((l) => l.trim()).filter((l) => l && !/^(#|\||-{3}|={3}|>)/.test(l)).join(" ").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
      return text.slice(0, 320) + (text.length > 320 ? "…" : "");
    });
  }

  /* ============================================================
     OPENING CREDITS — a terminal session
  ============================================================ */
  let creditsRan = false;
  async function runCredits() {
    if (creditsRan) return; creditsRan = true;
    const cmds = $$(".cmd"), outs = [$(".credit--2"), $(".credit--4"), $("#skillsLs")];
    for (let i = 0; i < cmds.length; i++) {
      cmds[i].classList.add("is-on");
      cmds[i].innerHTML = `<span class="cmd__ps">tom@paris:~$</span> `;
      const t = document.createElement("span"); cmds[i].appendChild(t);
      await TW.type(t, cmds[i].dataset.cmd, { speed: 55, caret: false });
      await sleep(260);
      if (i < 2) {
        if (window.gsap) gsap.fromTo(outs[i], { opacity: 0, y: 14, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "expo.out" });
        else outs[i].style.opacity = 1;
        await sleep(900);
      } else {
        outs[2].style.opacity = 1;
        await TW.type(outs[2], "python/   csharp/   java/   cpp/   web/   ai/", { speed: 26, caret: true });
      }
    }
  }

  /* ============================================================
     EVIDENCE — live meta + case files
  ============================================================ */
  const exhibits = $$(".exhibit");
  exhibits.forEach((e, i) => {
    const p = PROJECTS[i], body = $(".exhibit__body", e);
    const meta = document.createElement("p"); meta.className = "exhibit__meta typed";
    meta.textContent = p.priv ? "classified · private repository" : "··· pulling records";
    body.appendChild(meta);
    e.addEventListener("click", (ev) => { ev.preventDefault(); openCase(i); });
  });
  function paintEvidence() {
    exhibits.forEach((e, i) => {
      const p = PROJECTS[i], n = repoOf(p); if (!n) return;
      const r = DATA.repos[n] || SNAP[n] || {}, c = DATA.commits[n];
      const count = c ? (c.length >= 100 ? "100+" : c.length) : "?";
      $(".exhibit__meta", e).textContent = `${r.lang || p.lang} · ${count} commits · last push ${fmtDate(r.pushed)}`;
    });
  }

  const dos = $("#dossier");
  let caseJob = null;
  async function openCase(i) {
    const p = PROJECTS[i], n = repoOf(p);
    if (caseJob) caseJob.dead = true;
    const job = (caseJob = { dead: false });
    $("#dosNo").textContent = `Nº ${String(i + 1).padStart(2, "0")}`;
    $("#dosTitle").textContent = p.name;
    const r = (n && (DATA.repos[n] || SNAP[n])) || {}, c = (n && DATA.commits[n]) || [];
    const facts = n ? [
      ["Language", r.lang || p.lang], ["Opened", fmtDate(r.created)], ["Last commit", fmtDate(r.pushed)],
      ["Commits", c.length ? (c.length >= 100 ? "100+" : c.length) : "—"], ["Size", r.size ? `${r.size >= 1024 ? (r.size / 1024).toFixed(1) + " MB" : r.size + " KB"}` : "—"],
    ] : [["Language", p.lang], ["Status", "Classified — private repository"]];
    $("#dosFacts").innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(String(v))}</dd></div>`).join("");
    $("#dosReadme").textContent = p.desc;
    $("#dosLog").innerHTML = c.slice(0, 4).map((x) => `<li><b>${x.sha}</b> ${esc(x.msg)} <i>${fmtDate(x.date)}</i></li>`).join("") || (n ? "<li>commit log sealed — open on GitHub</li>" : "<li>no public record</li>");
    const open = $("#dosOpen");
    open.href = n ? `https://github.com/${USER}/${n}` : `https://github.com/${USER}`;
    open.style.display = n ? "" : "none";
    const code = $("#dosCode"); code.innerHTML = ""; $("#dosPath").textContent = n ? "pulling evidence from the repository…" : "evidence sealed";
    dos.classList.add("is-open"); dos.setAttribute("aria-hidden", "false");
    window.__lenis?.stop();
    if (!n) { await TW.type(code, "// This case is classified.\n// The source lives in a private repository.", { speed: 22, code: true, job }); return; }
    const [sn, rd] = await Promise.all([
      snippet(n, [".py", ".cpp", ".cs", ".java", ".ts", ".tsx", ".js", ".astro", ".html"]).catch(() => null),
      readme(n).catch(() => null),
    ]);
    if (job.dead) return;
    if (rd) { $("#dosReadme").textContent = ""; TW.type($("#dosReadme"), rd, { speed: 9, caret: false, job }); }
    if (sn) { $("#dosPath").innerHTML = `<a href="${sn.url}" target="_blank" rel="noopener">${esc(sn.path)} ↗</a>`; await TW.type(code, sn.code, { speed: 13, code: true, job }); }
    else { $("#dosPath").textContent = "no readable source at the root"; await TW.type(code, "// evidence not found at the scene.\n// see the repository for the full file.", { speed: 18, code: true, job }); }
  }
  function closeCase() {
    if (caseJob) caseJob.dead = true;
    dos.classList.remove("is-open"); dos.setAttribute("aria-hidden", "true");
    window.__lenis?.start();
  }
  $$("[data-close]", dos).forEach((b) => b.addEventListener("click", closeCase));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && dos.classList.contains("is-open")) closeCase(); });

  /* ============================================================
     THE REEL — git log, one frame per repository
  ============================================================ */
  const track = $("#journeyTrack"), endFrame = $(".frame--end", track);
  const reelOrder = PROJECTS.map((p, i) => ({ p, i, n: repoOf(p) })).filter((x) => x.n && SNAP[x.n]).sort((a, b) => SNAP[a.n].created.localeCompare(SNAP[b.n].created));
  reelOrder.forEach(({ p, n }, k) => {
    const f = document.createElement("article");
    f.className = "frame"; f.dataset.repo = n;
    f.innerHTML = `
      <div class="frame__img"><svg class="ic" viewBox="0 0 120 120" aria-hidden="true">${ICONS[p.icon]}</svg><span class="frame__n">${String(k + 1).padStart(2, "0")}</span></div>
      <span class="frame__sha mono">commit <b data-sha>·······</b></span>
      <span class="frame__lang mono">${fmtDate(SNAP[n].created)} · ${SNAP[n].lang}</span>
      <h3>${p.name}</h3>
      <p class="frame__msg" data-msg>${esc(p.desc)}</p>
      <span class="frame__stats mono" data-stats>size ${SNAP[n].size >= 1024 ? (SNAP[n].size / 1024).toFixed(1) + " MB" : SNAP[n].size + " KB"}</span>`;
    track.insertBefore(f, endFrame);
  });
  endFrame.innerHTML = `<p class="duo__serif">${reelOrder.length} repositories later, the verdict is the same:</p><p class="duo__sans">I ship.</p>`;
  function paintReel() {
    $$(".frame[data-repo]").forEach((f) => {
      const n = f.dataset.repo, c = DATA.commits[n] || [];
      if (!c.length) return;
      const first = c[c.length - 1];
      $("[data-sha]", f).textContent = first.sha;
      $("[data-msg]", f).textContent = `“${first.msg}”`;
      $("[data-stats]", f).textContent = `${c.length >= 100 ? "100+" : c.length} commits · latest ${fmtDate(c[0].date)}`;
    });
  }
  function paintContrib() {
    const el = $("#contrib"), legend = $("#contribLegend");
    const days = new Map();
    Object.values(DATA.commits).flat().forEach((x) => { if (!x.date) return; const d = x.date.slice(0, 10); days.set(d, (days.get(d) || 0) + 1); });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today); start.setDate(start.getDate() - 7 * 52 - start.getDay());
    let html = "", total = 0, active = 0;
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const k = d.toISOString().slice(0, 10), v = days.get(k) || 0;
      total += v; if (v) active++;
      html += `<i class="l${v === 0 ? 0 : v < 2 ? 1 : v < 5 ? 2 : 3}" title="${k} · ${v} commit${v === 1 ? "" : "s"}"></i>`;
    }
    el.innerHTML = html;
    legend.textContent = total ? `${total} commits across ${active} days — last 52 weeks (sampled from the public repos)` : "commit history unavailable right now";
  }

  /* ============================================================
     HANDWRITING SAMPLES — real code, typed when seen
  ============================================================ */
  const SAMPLES = [
    { lang: "Python", repo: "DPM-plus-V2", exts: [".py"] },
    { lang: "C++", repo: "bot_projet_voltaire", exts: [".cpp", ".h", ".hpp"] },
    { lang: "C#", repo: "WorldCupStats", exts: [".cs"] },
    { lang: "Java", repo: "SoWeSign", exts: [".java"] },
  ];
  const samplesEl = $("#samples");
  if (samplesEl) SAMPLES.forEach((s, i) => {
    const card = document.createElement("article");
    card.className = "sample";
    card.innerHTML = `<header class="sample__bar"><span class="mono">${s.lang}</span><a class="mono" href="https://github.com/${USER}/${s.repo}" target="_blank" rel="noopener" data-cursor="hover">${s.repo} ↗</a></header><pre class="code sample__code"></pre><span class="sample__no typed">sample Nº ${String(i + 1).padStart(2, "0")}</span>`;
    samplesEl.appendChild(card);
    let done = false;
    new IntersectionObserver(async ([e], io) => {
      if (!e.isIntersecting || done) return;
      done = true; io.disconnect();
      const pre = $(".sample__code", card);
      const sn = await snippet(s.repo, s.exts).catch(() => null);
      if (sn) { $(".sample__bar a", card).href = sn.url; $(".sample__bar a", card).textContent = `${s.repo}/${sn.path} ↗`; await TW.type(pre, sn.code, { speed: 16, code: true }); }
      else await TW.type(pre, "// sample unavailable offline —\n// open the repository instead.", { speed: 18, code: true });
    }, { threshold: 0.35 }).observe(card);
  });

  /* ============================================================
     INTERROGATION ROOM — a small shell
  ============================================================ */
  if ($("#crt")) {
  const out = $("#termOut"), input = $("#termIn"), crt = $("#crt");
  const hist = []; let hi = 0, busy = false;
  crt.addEventListener("click", () => input.focus({ preventScroll: true }));
  async function print(text, { cls = "", speed = 6, code = false } = {}) {
    const line = document.createElement("div"); line.className = "crt__l " + cls;
    out.appendChild(line);
    await TW.type(line, text, { speed, code, caret: false });
    out.scrollTop = out.scrollHeight;
  }
  const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
  const COMMANDS = {
    help: () => print("available commands:\n  whoami        who is the suspect\n  projects      list the evidence\n  open <n>      open case file nº n\n  skills        languages on record\n  log           latest commits\n  stack         tools of the trade\n  contact       how to reach him\n  github        open the GitHub profile\n  clear         wipe the screen"),
    whoami: () => print("Tom Galvan — software engineer.\n3rd-year Bachelor in AI @ ECE Paris.\nBuilds tools, bots, apps and websites.\nLooking for an internship from February 2027."),
    projects: () => print(PROJECTS.map((p, i) => { const n = repoOf(p), c = n && DATA.commits[n]; return `${String(i + 1).padStart(2, "0")}  ${pad(p.name, 24)}${pad(p.lang, 8)}${n ? (c ? (c.length >= 100 ? "100+" : c.length) + " commits" : "") : "private"}`; }).join("\n") + "\n\ntype `open <n>` to read a case file."),
    open: (arg) => { const k = parseInt(arg, 10) - 1; const i = PROJECTS[k] ? k : PROJECTS.findIndex((p) => p.name.toLowerCase().includes((arg || "").toLowerCase()) && arg); if (i < 0) return print("usage: open <n>   (see `projects`)", { cls: "is-err" }); print(`opening case file nº ${String(i + 1).padStart(2, "0")}…`); setTimeout(() => openCase(i), 400); },
    skills: () => { const by = {}; PROJECTS.forEach((p) => (by[p.lang] = (by[p.lang] || 0) + 1)); return print(Object.entries(by).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${pad(l, 8)}${"█".repeat(n * 3)} ${n} case${n > 1 ? "s" : ""}`).join("\n")); },
    log: () => { const all = Object.entries(DATA.commits).flatMap(([n, c]) => c.map((x) => ({ ...x, n }))).filter((x) => x.date).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6); return print(all.length ? all.map((x) => `${x.sha}  ${pad(x.n, 22)}${x.msg.slice(0, 44)}`).join("\n") : "git log: records still loading, try again in a second."); },
    stack: () => print("languages   Python · C++ · C# · Java · TypeScript · HTML/CSS\nai / ocr    Tesseract 5 · Leptonica · Groq & Gemini APIs\nweb         Astro · React · Next.js · Node\ndata        MySQL · MongoDB · REST/JSON\ntools       Git · vcpkg · Visual Studio · Linux shell"),
    contact: () => print("mail     tom.galvan92@gmail.com\ngithub   github.com/TomGlv\n\ntype `mail` to write to him now."),
    mail: () => { print("opening the mail client…"); location.href = "mailto:tom.galvan92@gmail.com"; },
    github: () => { print("opening github.com/TomGlv…"); window.open(`https://github.com/${USER}`, "_blank", "noopener"); },
    date: () => print(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", dateStyle: "full", timeStyle: "medium" }).format(new Date()) + " — Paris"),
    ls: () => COMMANDS.projects(),
    clear: () => { out.innerHTML = ""; },
    exit: () => print("there is no exit. only commits."),
    sudo: (arg) => (/hire/.test(arg || "") ? print("[sudo] permission granted.\nrunning ./hire.sh … ✔\nnext step: tom.galvan92@gmail.com", { cls: "is-red" }) : print("sudo: nice try.", { cls: "is-err" })),
  };
  input.addEventListener("keydown", async (e) => {
    if (e.key === "ArrowUp") { if (hi > 0) input.value = hist[--hi]; e.preventDefault(); return; }
    if (e.key === "ArrowDown") { input.value = hi < hist.length - 1 ? hist[++hi] : ((hi = hist.length), ""); e.preventDefault(); return; }
    if (e.key !== "Enter" || busy) return;
    const raw = input.value.trim(); input.value = "";
    const echo = document.createElement("div"); echo.className = "crt__l crt__echo"; echo.innerHTML = `<span class="crt__ps">guest@tomglv:~$</span> ${esc(raw)}`; out.appendChild(echo);
    if (!raw) return;
    hist.push(raw); hi = hist.length;
    const [cmd, ...rest] = raw.split(/\s+/), fn = COMMANDS[cmd.toLowerCase()];
    busy = true;
    if (fn) await fn(rest.join(" ")); else await print(`command not found: ${cmd} — try \`help\``, { cls: "is-err" });
    busy = false;
    out.scrollTop = out.scrollHeight;
  });
  let booted = false;
  new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || booted) return;
    booted = true;
    await print("TG-1927 interrogation terminal — tty1", { cls: "is-dim", speed: 14 });
    await print("Last login: " + new Date().toUTCString(), { cls: "is-dim", speed: 4 });
    await print("The suspect is cooperating. Type `help`.", { speed: 18 });
  }, { threshold: 0.4 }).observe(crt);

  }

  /* ============================================================
     HEAD ticker + live facts
  ============================================================ */
  function headTicker() {
    const shaEl = $("#headSha"), msgEl = $("#headMsg");
    const all = Object.entries(DATA.commits).flatMap(([n, c]) => c.slice(0, 5).map((x) => ({ ...x, n }))).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    let k = 0;
    const tick = () => {
      if (all.length) { const x = all[k++ % all.length]; shaEl.textContent = x.sha; msgEl.textContent = `${x.n} · ${x.msg.slice(0, 48)}`; }
      else shaEl.textContent = Math.random().toString(16).slice(2, 9);
    };
    tick(); setInterval(tick, 2600);
  }

  /* ============================================================
     BOOT
  ============================================================ */
  window.Dev = { runCredits, openCase, TW };
  loadRecords().then(() => {
    paintEvidence(); paintReel(); paintContrib(); headTicker();
    const total = Object.values(DATA.commits).reduce((a, c) => a + c.length, 0);
    const f = $("#factCommits"); if (f) f.textContent = total ? (Object.values(DATA.commits).some((c) => c.length >= 100) ? total + "+" : total) : "—";
    const nr = Object.keys(DATA.repos).length; const fr = $("#factRepos"); if (fr && nr) { fr.dataset.count = nr; if (fr.textContent !== "0") fr.textContent = nr; }
  });
})();
