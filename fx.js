/* one getBoundingClientRect per element per frame: every animation loop reads positions through rectOf(),
   so the browser lays the page out once per frame instead of once per read */
const FRAME = { n: 0 };
if (window.gsap) gsap.ticker.add(() => FRAME.n++, false, true);
function rectOf(el) { if (el._rf !== FRAME.n) { el._r = el.getBoundingClientRect(); el._rf = FRAME.n; } return el._r; }

/* ============================================================
   CHARACTER FX — particles & things that appear around the hero character.
   Four proposals, switchable live (top-left pill, ?pfx=code|bubbles|orbit|doodles|none):
   A · code     — code glyphs rise from his head like thoughts, trail the cursor, burst on click
   B · bulles   — comic speech bubbles, typed out, reacting to hover / click / the plug
   C · orbite   — his stack as badges orbiting around him in 3D (behind / in front)
   D · doodles  — marker doodles drawn live around him (stars, sparkles, arrows, bolts…)
   Uses globals from script.js at runtime: gsap, pointer, MOTION, NIGHT.
============================================================ */
(() => {
  const LIST = { none: "aucun", code: "A · code", bubbles: "B · bulles", orbit: "C · orbite", doodles: "D · doodles" };
  const rand = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const NS = "http://www.w3.org/2000/svg";
  const LOWFX = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;   /* phones / weak CPUs: no comet trails */
  let wrap, back, front, svg, mode = null, cur = null;

  /* geometry of the character inside its wrapper (px, local) */
  const G = () => {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    return { W, H, hx: W * 0.5, hy: H * 0.37, hr: W * 0.25 };
  };
  const visible = () => { const r = rectOf(wrap); return r.bottom > 0 && r.top < innerHeight && !document.hidden; };
  const local = () => { const r = rectOf(wrap); return { x: pointer.x - r.left, y: pointer.y - r.top }; };
  const mk = (cls, parent, html = "") => { const e = document.createElement("div"); e.className = cls; e.innerHTML = html; parent.appendChild(e); return e; };

  /* ---------------- A · CODE GLYPHS ---------------- */
  const GLYPHS = ["{", "}", "</>", "()", "=>", ";", "01", "#", "&&", "[ ]", "λ", "fn", "::", "!=", "++", "//", "$_", "*", "<>", "0x", "if", "def", "git", "∑"];
  function codeMode() {
    let iv, lastTrail = 0;
    const glyph = (x, y, { dx = rand(-70, 70), dy = rand(-260, -140), dur = rand(2.2, 3.4), size = rand(12, 26), layer = Math.random() < 0.55 ? back : front, text } = {}) => {
      if (back.childElementCount + front.childElementCount > 90) return;
      const e = mk("pfx-glyph", layer); e.textContent = text || (NIGHT ? pick(["z", "Z", "z", "☾"]) : pick(GLYPHS));
      e.style.left = x + "px"; e.style.top = y + "px"; e.style.fontSize = size + "px";
      if (Math.random() < 0.18) e.classList.add("is-box");
      const o = layer === back ? rand(0.35, 0.7) : rand(0.6, 1);
      gsap.timeline({ onComplete: () => e.remove() })
        .fromTo(e, { opacity: 0, scale: 0.4, rotation: rand(-30, 30) }, { opacity: o, scale: 1, duration: 0.35, ease: "back.out(2)" })
        .to(e, { x: dx, y: dy, rotation: rand(-25, 25), duration: dur, ease: "power1.out" }, 0)
        .to(e, { opacity: 0, scale: 0.7, duration: 0.6 }, dur - 0.6);
    };
    return {
      start() {
        iv = setInterval(() => {
          if (!visible()) return;
          const g = G(); const a = rand(-Math.PI * 0.95, -Math.PI * 0.05);
          glyph(g.hx + Math.cos(a) * g.hr * rand(0.6, 1.1), g.hy + Math.sin(a) * g.hr * rand(0.7, 1.1));
        }, NIGHT ? 420 : 170);
      },
      stop() { clearInterval(iv); },
      move() {
        const now = performance.now(); if (now - lastTrail < 45) return; lastTrail = now;
        const p = local(), g = G();
        if (Math.hypot(p.x - g.hx, p.y - g.hy) > g.W * 0.9) return;
        glyph(p.x, p.y, { dx: rand(-40, 40), dy: rand(-90, -40), dur: rand(0.9, 1.4), size: rand(10, 18), layer: front });
      },
      hover() { const g = G(); "hello, world".split("").forEach((c, i) => c !== " " && glyph(g.hx - 90 + i * 16, g.hy - g.hr * 1.1, { text: c, dx: 0, dy: -120, dur: 1.8, size: 22, layer: front })); },
      click() {
        const p = local();
        for (let i = 0; i < 22; i++) { const a = (i / 22) * Math.PI * 2, d = rand(140, 280); glyph(p.x, p.y, { dx: Math.cos(a) * d, dy: Math.sin(a) * d, dur: rand(0.9, 1.4), size: rand(14, 30), layer: front }); }
      },
      night(v) { this.stop(); this.start(); if (!v) this.click(); },
    };
  }

  /* ---------------- B · SPEECH BUBBLES ---------------- */
  const LINES = ["it works on my machine.", 'git commit -m "fix"', "one more feature…", "TODO: sleep", "internship? feb. 2027 👀", "console.log('here')", "who wrote this? …oh. me.", "404: coffee not found", "segfault. again.", "rm -rf node_modules", "ctrl+s ctrl+s ctrl+s", "it compiled. first try!", "tabs > spaces. fight me.", "brb, reading the docs"];
  function bubbleMode() {
    let iv, b = null, side = 1, typing = 0, hideT;
    const say = (text, { hold = 2.6, think = false } = {}) => {
      if (!visible()) return;
      clearTimeout(hideT); cancelAnimationFrame(typing);
      if (b) { const old = b; gsap.to(old, { scale: 0, opacity: 0, duration: 0.18, onComplete: () => old.remove() }); }
      side = -side; const g = G();
      b = mk(`pfx-bubble ${side > 0 ? "is-r" : "is-l"}${think ? " is-think" : ""}`, front, `<span></span><i class="pfx-caret"></i>`);
      b.style.left = (g.hx + side * g.hr * 0.95) + "px"; b.style.top = (g.hy - g.hr * 1.05) + "px";
      gsap.fromTo(b, { scale: 0, rotation: side * -8 }, { scale: 1, rotation: side * 2, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      const span = b.querySelector("span"); let i = 0, t0 = performance.now();
      if (think) span.textContent = "…";
      else (function step() { const n = Math.min(text.length, ((performance.now() - t0) / 34) | 0); if (n !== i) { i = n; span.textContent = text.slice(0, i); } if (i < text.length) typing = requestAnimationFrame(step); })();
      const me = b;
      hideT = setTimeout(() => { gsap.to(me, { scale: 0, opacity: 0, duration: 0.25, ease: "back.in(2)", onComplete: () => { me.remove(); if (b === me) b = null; } }); }, (hold + text.length * 0.034) * 1000);
    };
    return {
      start() {
        setTimeout(() => say(NIGHT ? "zzz…" : "hi, I'm Tom."), 600);
        iv = setInterval(() => { if (NIGHT) say(pick(["zzz…", "z z z", "…five more minutes"])); else if (Math.random() < 0.3) { say("", { think: true, hold: 0.9 }); setTimeout(() => say(pick(LINES)), 1100); } else say(pick(LINES)); }, 5200);
      },
      stop() { clearInterval(iv); clearTimeout(hideT); cancelAnimationFrame(typing); b = null; },
      hover() { say(NIGHT ? "huh? …is it morning?" : pick(["oh, hi!", "hey, you!", "need a dev?", "looking for an intern?"])); },
      click() { say(pick(["ouch.", "that tickles.", "stop poking me, I'm compiling!", "hey! 😤", "sudo stop"])); },
      night(v) { say(v ? "who turned off the lights?" : "aaah, my eyes!"); },
    };
  }

  /* ---------------- C · ORBITING STACK ---------------- */
  /* ---------------- C · ORBITING STACK (one dotted ring, comet trails, clickable badges) ----------------
     The ORBIT switch on the power strip cuts the power: the badges fall and bounce on the floor. */
  const STACK = [
    { t: "py", name: "Python", f: "Python" }, { t: "c++", name: "C++", f: "C++" }, { t: "c#", name: "C# / .NET", f: "C#" }, { t: "java", name: "Java", f: "Java" },
    { t: "ts", name: "TypeScript / web", f: "Web" }, { t: "git", name: "git · every repo", f: "all" }, { t: ">_", name: "shell & bots", f: "all" }, { t: "sql", name: "SQL", f: "all" }, { t: "ai", name: "AI · LLM · OCR", f: "AI" },
  ];
  function orbitMode() {
    let tick, ang = 0, spd = 0.55, kick = { x: 0, v: 0 }, hover = 0, tilt = 0, held = null, dotT = 0, boost = 1, boostT = 0;
    let power = localStorage.getItem("tg-orbit") !== "0", ringO = power ? 1 : 0;
    const st = STACK.map(() => ({ x: null, y: 0, vx: 0, vy: 0, r: 0, rec: 0 }));
    const els = STACK.map((b) => {
      const e = mk("pfx-badge mono", back, b.t); e.dataset.name = b.name + " →"; e.dataset.cursor = "hover";
      e.addEventListener("pointerenter", () => (held = e));
      e.addEventListener("pointerleave", () => { if (held === e) held = null; });
      e.addEventListener("click", (ev) => {      /* jump to the projects, filtered on that language */
        ev.stopPropagation();
        const work = document.getElementById("work"), btn = document.querySelector(`.filter[data-f="${b.f}"]`);
        window.__lenis ? window.__lenis.scrollTo(work, { duration: 1.6 }) : work.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => btn?.click(), 900);
      });
      return e;
    });
    const ringB = document.createElementNS(NS, "svg"), pathB = document.createElementNS(NS, "path"), pathF = document.createElementNS(NS, "path");
    ringB.setAttribute("class", "pfx-svg pfx-orbit"); ringB.appendChild(pathB); back.prepend(ringB);
    const ringF = document.createElementNS(NS, "svg"); ringF.setAttribute("class", "pfx-svg pfx-orbit"); ringF.appendChild(pathF); front.prepend(ringF);
    const trail = (x, y, parent, s) => {
      const d = mk("pfx-dot", parent); d.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      gsap.fromTo(d, { opacity: 0.5 * s, scale: s }, { opacity: 0, scale: 0.2, duration: 0.7, ease: "power1.out", onComplete: () => d.remove() });
    };
    return {
      start() {
        gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.06 });
        let last = performance.now();
        tick = () => {
          const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now;
          if (!visible()) return;
          const g = G(), p = local();
          hover += ((wrap.matches(":hover") ? 1 : 0) - hover) * 0.06;
          tilt += (Math.max(-1, Math.min(1, (p.y - g.hy) / g.H)) - tilt) * 0.05;
          kick.v += (-kick.x * 60) * dt; kick.v *= Math.exp(-4 * dt); kick.x += kick.v * dt;
          if (boostT > 0) { boostT -= dt; if (boostT <= 0) boost = 1; }
          if (power) ang += (held ? 0 : (NIGHT ? 0.2 : spd + hover * 0.9) * boost) * dt;
          ringO += ((power ? 1 : 0) - ringO) * 0.1; ringB.style.opacity = ringF.style.opacity = ringO.toFixed(2);
          const rx = g.W * (0.6 + hover * 0.08 + kick.x), ry = g.W * (0.13 + kick.x * 0.3), cy = g.hy + g.hr * 0.55;
          const at = (a) => ({ x: g.hx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry + Math.cos(a) * tilt * ry * 1.4 });
          let dB = "", dF = "";
          for (let k = 0; k <= 32; k++) { const a1 = Math.PI + (k / 32) * Math.PI, a2 = (k / 32) * Math.PI, q1 = at(a1), q2 = at(a2); dB += (k ? "L" : "M") + q1.x.toFixed(1) + " " + q1.y.toFixed(1); dF += (k ? "L" : "M") + q2.x.toFixed(1) + " " + q2.y.toFixed(1); }
          pathB.setAttribute("d", dB); pathF.setAttribute("d", dF);
          dotT -= dt; const spawn = !LOWFX && power && dotT <= 0 && !held; if (spawn) dotT = 0.09;
          els.forEach((e, i) => {
            const a = ang + (i / els.length) * Math.PI * 2, q = at(a), b = st[i];
            let s = Math.sin(a);
            if (b.x === null) { b.x = q.x; b.y = q.y; }
            if (power) {
              if (b.rec > 0) { b.rec -= dt; b.x = lerp(b.x, q.x, 0.12); b.y = lerp(b.y, q.y, 0.12); b.r = lerp(b.r, 0, 0.12); }
              else { b.x = q.x; b.y = q.y; b.r = 0; }
            } else {
              const floor = g.H - 26 + (i % 3) * 7;
              b.vy += 2600 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= Math.exp(-2.5 * dt);
              if (b.y > floor) { b.y = floor; b.vy *= -0.32; b.vx *= 0.7; if (Math.abs(b.vy) < 40) b.vy = 0; }
              b.x = Math.max(-g.W * 0.35, Math.min(g.W * 1.35, b.x)); b.r += b.vx * dt * 0.6; s = 1;
            }
            const parent = s > 0 ? front : back; if (e.parentNode !== parent) parent.appendChild(e);
            const sc = (0.72 + 0.38 * (s + 1) / 2) * (held === e ? 1.25 : 1);
            e.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${b.r.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
            e.style.opacity = NIGHT ? 0.35 + 0.3 * (s + 1) / 2 : 0.55 + 0.45 * (s + 1) / 2;
            e.style.zIndex = s > 0 ? 2 : 0;
            if (spawn && b.rec <= 0 && (i + Math.round(now / 50)) % 3 === 0) trail(q.x, q.y, parent, 0.5 + 0.5 * (s + 1) / 2);
          });
        };
        gsap.ticker.add(tick);
      },
      stop() { gsap.ticker.remove(tick); },
      click() { kick.v += 3.2; ang += 0.6; },
      move() { if (Math.hypot(MOTION.vx, MOTION.vy) > 2200) kick.v += 0.15; },
      night(v) { kick.v += v ? -1 : 2.5; },
      sneeze() { kick.v += 7; st.forEach((b) => { b.rec = 0.8; b.x += (Math.random() - 0.5) * 140; b.y += (Math.random() - 0.5) * 90; }); },
      coffee() { boost = 4; boostT = 6; kick.v += 2; },
      blast(f = 1) { kick.v += 9 * f; st.forEach((b) => { b.rec = 1.1; b.x += (Math.random() - 0.5) * 260 * f; b.y += (Math.random() - 0.5) * 160 * f; }); },
      power(v) {
        if (v === power) return; power = v;
        st.forEach((b) => { if (v) b.rec = 0.9; else { b.vx = (Math.random() - 0.5) * 520; b.vy = -260 - Math.random() * 300; } });
      },
    };
  }

  /* ---------------- D · MARKER DOODLES ---------------- */
  const star = () => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 9 : 22; d += (i ? "L" : "M") + (Math.cos(a) * r).toFixed(1) + " " + (Math.sin(a) * r).toFixed(1); } return d + "Z"; };
  const spiral = () => { let d = "M0 0"; for (let t = 0; t < 14; t += 0.35) d += ` L${(Math.cos(t) * t * 1.7).toFixed(1)} ${(Math.sin(t) * t * 1.7).toFixed(1)}`; return d; };
  const SHAPES = {
    star, spiral,
    sparkle: () => "M0 -22 Q2 -2 22 0 Q2 2 0 22 Q-2 2 -22 0 Q-2 -2 0 -22Z",
    bolt: () => "M5 -24 L-9 2 H2 L-5 24 L11 -4 H0 Z",
    excl: () => "M0 -22 V6 M0 17 V18",
    quest: () => "M-10 -12 C-10 -26 12 -26 12 -12 C12 -2 0 -2 0 8 M0 18 V19",
    squiggle: () => "M-30 0 q7.5 -12 15 0 t15 0 t15 0 t15 0",
    heart: () => "M0 14 C-22 0 -18 -20 -4 -16 L0 -10 L4 -16 C18 -20 22 0 0 14Z",
    brace: () => "M-6 -22 C-14 -22 -10 -6 -16 0 C-10 6 -14 22 -6 22 M6 -22 C14 -22 10 -6 16 0 C10 6 14 22 6 22",
    moon: () => "M6 -20 A20 20 0 1 0 6 20 A15 15 0 1 1 6 -20Z",
    bulb: () => "M-11 2 A14 14 0 1 1 11 2 C7 7 6 10 6 14 H-6 C-6 10 -7 7 -11 2Z M-5 19 H5 M-3 24 H3 M0 -34 V-30 M-22 -24 L-19 -21 M22 -24 L19 -21",
    zz: () => "M-14 -12 H0 L-14 2 H0 M4 4 H14 L4 14 H14",
  };
  function doodleMode() {
    let iv, lastLines = 0;
    const draw = (name, x, y, { s = rand(0.8, 1.25), r = rand(-25, 25), hold = rand(1.2, 2), label } = {}) => {
      if (svg.childElementCount > 14) return;
      const g = document.createElementNS(NS, "g");
      g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${s.toFixed(2)})`);
      const p = document.createElementNS(NS, "path"); p.setAttribute("d", SHAPES[name]()); g.appendChild(p);
      if (label) { const t = document.createElementNS(NS, "text"); t.textContent = label; t.setAttribute("x", 26); t.setAttribute("y", -8); g.appendChild(t); }
      svg.appendChild(g);
      const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      const tl = gsap.timeline({ onComplete: () => g.remove() })
        .to(p, { strokeDashoffset: 0, duration: Math.min(0.9, 0.25 + len / 450), ease: "power2.inOut" })
        .to(p, { strokeDashoffset: -len, duration: 0.45, ease: "power2.in" }, `+=${hold}`);
      const t = g.querySelector("text");
      if (t) tl.from(t, { opacity: 0, duration: 0.3 }, 0.3).to(t, { opacity: 0, duration: 0.3 }, `-=0.45`);
    };
    const around = (kmin = 1.3, kmax = 1.85) => {
      const g = G(), a = pick([rand(-Math.PI * 0.95, -Math.PI * 0.6), rand(-Math.PI * 0.4, -Math.PI * 0.05), rand(-Math.PI * 1.15, -Math.PI * 0.98), rand(-0.05, Math.PI * 0.15)]);
      const k = rand(kmin, kmax); return { x: g.hx + Math.cos(a) * g.hr * k, y: g.hy + Math.sin(a) * g.hr * k };
    };
    const arrowMe = () => {
      const g = G(), sd = Math.random() < 0.5 ? -1 : 1, x0 = g.hx + sd * g.hr * 2.2, y0 = g.hy - g.hr * 1.2, x1 = g.hx + sd * g.hr * 1.2, y1 = g.hy - g.hr * 0.5;
      SHAPES.arrow = () => `M${x0 - x1} ${y0 - y1} Q${(x0 - x1) * 0.2} ${(y0 - y1) * 1.1} 0 0 M0 0 L${sd * 14} -4 M0 0 L${sd * 2} -15`;
      draw("arrow", x1, y1, { s: 1, r: 0, hold: 2, label: "" });
      const t = document.createElementNS(NS, "text"); t.textContent = pick(["me!", "that's me", "hi :)", "dev"]); t.setAttribute("x", x0 + sd * 8); t.setAttribute("y", y0 - 6); t.setAttribute("text-anchor", sd > 0 ? "start" : "end");
      svg.appendChild(t); gsap.timeline({ onComplete: () => t.remove() }).from(t, { opacity: 0, duration: 0.3, delay: 0.4 }).to(t, { opacity: 0, duration: 0.3 }, "+=2.2");
    };
    return {
      start() {
        iv = setInterval(() => {
          if (!visible()) return;
          if (NIGHT) { const p = around(); draw(pick(["zz", "zz", "moon", "sparkle", "star"]), p.x, p.y, { s: rand(0.6, 1) }); return; }
          if (Math.random() < 0.14) return arrowMe();
          const p = around(); draw(pick(["star", "sparkle", "sparkle", "spiral", "bolt", "excl", "squiggle", "heart", "brace", "quest"]), p.x, p.y);
        }, NIGHT ? 1500 : 900);
      },
      stop() { clearInterval(iv); },
      hover() { const g = G(); draw("bulb", g.hx, g.hy - g.hr * 1.45, { s: 1.1, r: 0, hold: 1.2 }); for (let i = 0; i < 3; i++) { const p = around(1.15, 1.5); setTimeout(() => draw("sparkle", p.x, p.y, { s: rand(0.4, 0.7), hold: 0.5 }), i * 120); } },
      click() {
        const p = local();
        SHAPES.burst = () => { let d = ""; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; d += `M${(Math.cos(a) * 22).toFixed(1)} ${(Math.sin(a) * 22).toFixed(1)} L${(Math.cos(a) * 44).toFixed(1)} ${(Math.sin(a) * 44).toFixed(1)} `; } return d; };
        draw("burst", p.x, p.y, { s: 1, r: rand(0, 36), hold: 0.25 }); draw("excl", p.x + 50, p.y - 40, { s: 1.2, r: 12, hold: 0.6 });
      },
      move() {
        const now = performance.now(), sp = Math.hypot(MOTION.vx, MOTION.vy); if (sp < 2400 || now - lastLines < 350) return;
        const p = local(), g = G(); if (Math.hypot(p.x - g.hx, p.y - g.hy) > g.W) return; lastLines = now;
        const a = Math.atan2(MOTION.vy, MOTION.vx) * 180 / Math.PI;
        SHAPES.speed = () => "M-30 -12 H10 M-40 0 H20 M-30 12 H10";
        draw("speed", p.x, p.y, { s: 1, r: a, hold: 0.15 });
      },
      night(v) { const g = G(); draw(v ? "moon" : "bulb", g.hx + g.hr * 1.4, g.hy - g.hr * 1.2, { s: 1.2, r: 0, hold: 1.4 }); },
    };
  }

  const MODES = { none: () => ({ start() {}, stop() {} }), code: codeMode, bubbles: bubbleMode, orbit: orbitMode, doodles: doodleMode };
  function set(m) {
    cur?.stop(); gsap.killTweensOf([...back.querySelectorAll("*"), ...front.querySelectorAll("*")]);
    back.innerHTML = ""; front.innerHTML = ""; svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "pfx-svg"); front.appendChild(svg);
    mode = m; cur = MODES[m](); cur.start();
  }
  window.PFX = {
    init(w) {
      if (!w || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      wrap = w; back = mk("pfx pfx--back", wrap); front = mk("pfx pfx--front", wrap);
      let m = new URLSearchParams(location.search).get("pfx") || "orbit";   /* chosen: orbit (other modes kept for ?pfx= tests) */
      if (!(m in MODES)) m = "orbit";
      set(m);
      wrap.addEventListener("pointerenter", () => cur.hover?.());
      wrap.addEventListener("click", () => cur.click?.());
      addEventListener("pointermove", () => cur.move?.(), { passive: true });
      document.addEventListener("tg:night", (e) => cur.night?.(e.detail));
      document.addEventListener("tg:zap", () => cur.click?.());
      document.addEventListener("tg:orbit", (e) => cur.power?.(e.detail));
      document.addEventListener("tg:sneeze", () => cur.sneeze?.());
      document.addEventListener("tg:coffee", () => cur.coffee?.());
      document.addEventListener("tg:blast", (e) => cur.blast?.(e.detail || 1));
    },
  };
})();
