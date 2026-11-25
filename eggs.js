/* ============================================================
   LENS PICKER + EASTER EGGS
   lens (mouse over the character): x-ray
   eggs: electrocution (plug pins on the character), robot (plug into the port seen in x-ray), cord round the neck,
         double-click = sneeze, circle the mouse = dizzy, 25 s idle = sleep,
         konami code, type "sudo" / "hire" / "coffee", 5 fast clicks on the logo, console greeting
============================================================ */
(() => {
  const pick = (a) => a[(Math.random() * a.length) | 0];
  /* lens over the character: x-ray (skeleton + a few things he swallowed) */
  document.querySelectorAll(".pav").forEach((p) => (p.dataset.lens = "xray"));

  /* ---------- toast ---------- */
  let toastEl = null, toastT;
  const toast = (msg, ms = 3200) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "egg-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; clearTimeout(toastT);
    window.gsap ? gsap.fromTo(toastEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)" }) : (toastEl.style.opacity = 1);
    toastT = setTimeout(() => window.gsap ? gsap.to(toastEl, { y: 20, opacity: 0, duration: 0.3 }) : (toastEl.style.opacity = 0), ms);
  };

  /* ---------- electrocution / strangling reactions ---------- */
  let zaps = 0;
  document.addEventListener("tg:zap", () => {
    zaps++;
    toast(["bzzzt. 230 volts. he'll be fine.", "again?! that's a felony in 3 countries.", "achievement unlocked: human conductor", "ok he's medium-rare now."][Math.min(zaps - 1, 3)]);
  });

  /* ---------- character interactions ---------- */
  const av = () => document.getElementById("avatar");
  const flash = (cls, ms) => { const a = av(); if (!a) return; a.classList.remove(cls); void a.offsetWidth; a.classList.add(cls); setTimeout(() => a.classList.remove(cls), ms); };
  const hyper = () => { flash("is-hyper", 6000); document.dispatchEvent(new CustomEvent("tg:coffee")); };
  /* double-click: he sneezes and the solar system gets blown around */
  document.getElementById("avatarWrap")?.addEventListener("dblclick", () => { flash("is-sneeze", 600); toast(pick(["achoo!", "bless you.", "allergic to bugs, sorry."])); document.dispatchEvent(new CustomEvent("tg:sneeze")); });
  /* circle the mouse around his head a couple of times: he gets dizzy */
  let spin = 0, lastA = null, dizzyUntil = 0;
  addEventListener("pointermove", () => {
    const a = av(); if (!a || typeof pointer === "undefined") return;
    const r = a.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.35, d = Math.hypot(pointer.x - cx, pointer.y - cy);
    if (d > r.width * 0.9 || d < 20) { spin *= 0.9; lastA = null; return; }
    const ang = Math.atan2(pointer.y - cy, pointer.x - cx);
    if (lastA !== null) { let da = ang - lastA; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; spin = spin * 0.995 + da; }
    lastA = ang;
    if (Math.abs(spin) > Math.PI * 5 && performance.now() > dizzyUntil) { spin = 0; dizzyUntil = performance.now() + 4000; flash("is-dizzy", 2800); toast("@_@ stop spinning me…"); }
  }, { passive: true });
  /* robot mode: the light plugged into the hidden port in his chest */
  document.addEventListener("tg:robot", (e) => toast(e.detail ? "SYSTEM BOOT: tom.exe → TOM-9000. beep boop." : "rebooting as human… done."));

  /* ---------- mouse interactions on the character (no keyboard needed) ----------
     grab & throw him · long press = charge a shockwave · click his nose = boop · tickle his face · pet his hair · click him too much = angry */
  const wrapEl = document.getElementById("avatarWrap");
  const toImg = (x, y) => { const r = av().getBoundingClientRect(); return { u: ((x - r.left) / r.width) * 647, v: ((y - r.top) / r.height) * 663, r }; };
  const pop = (text, u, v, cls = "") => {
    if (!wrapEl) return; const r = av().getBoundingClientRect(), wr = wrapEl.getBoundingClientRect();
    const e = document.createElement("span"); e.className = `pav-pop ${cls}`; e.textContent = text;
    e.style.left = (r.left - wr.left + (u / 647) * r.width) + "px"; e.style.top = (r.top - wr.top + (v / 663) * r.height) + "px";
    wrapEl.appendChild(e);
    gsap.fromTo(e, { scale: 0.3, opacity: 0, rotation: -15 + Math.random() * 30 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(3)" });
    gsap.to(e, { y: -70 - Math.random() * 40, x: -30 + Math.random() * 60, opacity: 0, duration: 1.2, delay: 0.35, ease: "power1.in", onComplete: () => e.remove() });
  };
  if (wrapEl && window.gsap) {
    let down = null, grabbed = false, charging = false, chargeT = 0, holdTimer, suppress = false, clicks = [];
    const el = () => av();
    wrapEl.addEventListener("click", (e) => { if (suppress) { e.stopImmediatePropagation(); e.preventDefault(); suppress = false; } }, true);
    wrapEl.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".pfx-badge")) return;
      down = { x: e.clientX, y: e.clientY, t: performance.now() }; grabbed = false; charging = false;
      wrapEl.setPointerCapture(e.pointerId);
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => { if (down && !grabbed) { charging = true; chargeT = performance.now(); el().classList.add("is-charging"); toast("charging…"); } }, 520);
    });
    wrapEl.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!grabbed && !charging && Math.hypot(dx, dy) > 12) { grabbed = true; clearTimeout(holdTimer); el().classList.add("is-grabbed"); gsap.killTweensOf(el()); }
      if (grabbed) {
        const rot = Math.max(-28, Math.min(28, MOTION.vx * 0.012));
        gsap.set(el(), { x: dx, y: dy, rotation: rot });
      }
    });
    const release = (e) => {
      if (!down) return; clearTimeout(holdTimer);
      const a = el(), was = down; down = null;
      if (grabbed) {                                   /* thrown or dropped: springs back to his spot */
        suppress = true; grabbed = false;
        const sp = Math.hypot(MOTION.vx, MOTION.vy);
        const tl = gsap.timeline({ onComplete: () => a.classList.remove("is-grabbed") });
        if (sp > 1600) {
          tl.to(a, { x: "+=" + MOTION.vx * 0.18, y: "+=" + MOTION.vy * 0.18, rotation: (MOTION.vx > 0 ? 1 : -1) * 540, duration: 0.45, ease: "power2.out" })
            .to(a, { x: 0, y: 0, rotation: 0, duration: 1.1, ease: "elastic.out(1, 0.45)" });
          setTimeout(() => { flash("is-dizzy", 2400); toast(pick(["wheeeee!", "I'm a sticker, not a frisbee.", "again! …no wait."])); }, 900);
        } else tl.to(a, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
        return;
      }
      if (charging) {                                  /* long press released: shockwave */
        suppress = true; charging = false; a.classList.remove("is-charging");
        const lvl = Math.min(1, (performance.now() - chargeT) / 1800);
        const r = a.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
        const ring = document.createElement("i"); ring.className = "egg-wave"; ring.style.left = cx + "px"; ring.style.top = cy + "px"; document.body.appendChild(ring);
        gsap.fromTo(ring, { scale: 0.1, opacity: 1 }, { scale: 3 + lvl * 9, opacity: 0, duration: 0.9, ease: "power2.out", onComplete: () => ring.remove() });
        document.querySelectorAll(".hero__name .k, .hero__sub, .hero__card, .hero__role").forEach((k) => {
          const kr = k.getBoundingClientRect(), dx = kr.left + kr.width / 2 - cx, dy = kr.top + kr.height / 2 - cy, d = Math.hypot(dx, dy) || 1, f = (60 + 260 * lvl) * Math.min(1, 500 / d);
          gsap.timeline().to(k, { x: (dx / d) * f, y: (dy / d) * f, rotation: (Math.random() - 0.5) * 40 * lvl, duration: 0.25, ease: "power3.out" }).to(k, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: "elastic.out(1, 0.35)" });
        });
        document.dispatchEvent(new CustomEvent("tg:blast", { detail: 0.4 + lvl }));
        document.body.classList.add("is-zap"); setTimeout(() => document.body.classList.remove("is-zap"), 90);
        toast(lvl > 0.95 ? "power level: over 9000!" : "pfff. charge it longer.");
        return;
      }
      /* plain click */
      const { u, v } = toImg(was.x, was.y);
      if (Math.hypot(u - 318, v - 262) < 34) { flash("is-boop", 450); pop("boop!", 330, 250); return; }
      const now = performance.now(); clicks = clicks.filter((t) => now - t < 4000); clicks.push(now);
      if (clicks.length >= 9) { clicks = []; flash("is-angry", 3200); pop("grr", 470, 120, "is-big"); toast("ok. stop clicking me."); }
    };
    wrapEl.addEventListener("pointerup", release);
    wrapEl.addEventListener("pointercancel", release);

    /* tickle: quick back-and-forth over his face · pet: slow strokes over his hair */
    let lastX = null, dir = 0, flips = [], petT = 0, lastPet = performance.now();
    addEventListener("pointermove", (e) => {
      const a = av(); if (!a || down) return;
      const { u, v } = toImg(e.clientX, e.clientY), now = performance.now();
      const onFace = u > 210 && u < 440 && v > 170 && v < 390, onHair = u > 160 && u < 490 && v > 10 && v < 170;
      if (onFace && lastX !== null) {
        const d = e.clientX - lastX;
        if (Math.abs(d) > 2) { const nd = Math.sign(d); if (dir && nd !== dir) flips.push(now); dir = nd; }
        flips = flips.filter((t) => now - t < 1200);
        if (flips.length >= 8 && !a.classList.contains("is-laugh")) { flips = []; flash("is-laugh", 2600); ["haha", "hihi", "HAHA"].forEach((t, i) => setTimeout(() => pop(t, 200 + Math.random() * 250, 120 + Math.random() * 120), i * 280)); }
      }
      lastX = e.clientX;
      const sp = Math.hypot(MOTION.vx, MOTION.vy), dt = Math.min(0.05, (now - lastPet) / 1000); lastPet = now;
      if (onHair && sp > 60 && sp < 900) { petT += dt; if (petT > 1.4) { petT = 0; for (let i = 0; i < 4; i++) setTimeout(() => pop("♥", 200 + Math.random() * 250, 60 + Math.random() * 80, "is-heart"), i * 160); a.classList.add("is-happy"); setTimeout(() => a.classList.remove("is-happy"), 1500); } }
      else petT = Math.max(0, petT - dt * 0.5);
    }, { passive: true });
  }

  /* the keychain under the logo: flick it too much and it falls, the real Tom is not happy */
  document.addEventListener("tg:keydrop", () => {
    toast("hey! that's my keychain.");
    flash("is-angry", 2400);
    if (av()) setTimeout(() => pop("hey!", 470, 110, "is-big"), 250);
  });
  document.addEventListener("tg:keyback", () => { toast(pick(["*sigh*. put it back. don't touch.", "there. leave it alone now.", "third time this week…"])); if (av()) pop("hmpf", 470, 130); });

  /* ---------- konami code → commit-message rain ---------- */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0, typed = "";
  const rain = () => {
    const c = document.createElement("canvas"); c.className = "egg-rain"; document.body.appendChild(c);
    const x = c.getContext("2d"), dpr = Math.min(devicePixelRatio, 2), W = (c.width = innerWidth * dpr), H = (c.height = innerHeight * dpr);
    const fs = 16 * dpr, cols = Math.ceil(W / fs), drops = Array.from({ length: cols }, () => Math.random() * -H / fs);
    const chars = "01{}[]()<>=;:/\\*+-#$&|git push fix wip feat merge".split("");
    const dark = document.body.classList.contains("night"), fg = dark ? "239,238,233" : "11,11,11";
    const t0 = performance.now();
    (function frame(now) {
      const t = (now - t0) / 1000;
      x.fillStyle = dark ? "rgba(18,18,17,.14)" : "rgba(239,238,233,.14)"; x.fillRect(0, 0, W, H);
      x.font = `700 ${fs}px "Courier Prime", monospace`; x.fillStyle = `rgba(${fg},${t > 5 ? Math.max(0, 1 - (t - 5)) : 0.9})`;
      drops.forEach((d, i) => { x.fillText(chars[(Math.random() * chars.length) | 0], i * fs, d * fs); drops[i] = d * fs > H && Math.random() > 0.97 ? 0 : d + 1; });
      if (t < 6) requestAnimationFrame(frame); else c.remove();
    })(t0);
    toast("cheat mode unlocked: commit rain.");
  };

  addEventListener("keydown", (e) => {
    if (e.target.closest?.("input, textarea, [contenteditable]")) return;
    kpos = e.key === KONAMI[kpos] || e.key.toLowerCase() === KONAMI[kpos] ? kpos + 1 : e.key === KONAMI[0] ? 1 : 0;
    if (kpos === KONAMI.length) { kpos = 0; rain(); }
    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-12);
      if (typed.endsWith("sudo")) toast("tom is not in the sudoers file. This incident will be reported.");
      else if (typed.endsWith("hire")) { toast("good call. → ./contact.sh"); const t = document.getElementById("contact"); window.__lenis ? __lenis.scrollTo(t, { duration: 1.8 }) : t?.scrollIntoView({ behavior: "smooth" }); }
      else if (typed.endsWith("coffee")) { toast("coffee injected. 6 s of pure productivity."); hyper(); }
    }
  });

  /* ---------- 5 fast clicks on the logo → the name falls apart ---------- */
  let clicks = [];
  document.querySelector(".logo")?.addEventListener("click", () => {
    const now = performance.now(); clicks = clicks.filter((t) => now - t < 1600); clicks.push(now);
    if (clicks.length < 5 || !window.gsap) return; clicks = [];
    const ks = document.querySelectorAll(".hero__name .k"); if (!ks.length) return;
    toast("oops. you broke my name.");
    gsap.to(ks, { y: () => innerHeight * (0.55 + Math.random() * 0.3), rotation: () => -60 + Math.random() * 120, duration: 1.1, ease: "bounce.out", stagger: 0.04, overwrite: true });
    gsap.to(ks, { y: 0, rotation: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.03, delay: 3.4 });
  });

  /* ---------- console ---------- */
  console.log("%c TG ", "background:#0b0b0b;color:#efeee9;font:700 28px serif;padding:6px 12px;border-radius:6px");
  console.log("%cpeeking at the source? good instinct.\n→ github.com/TomGlv\ntry: the konami code, typing 'sudo', 5 clicks on the logo… or the plug.", "font:13px monospace;line-height:1.6");
})();
