/* ============================================================
   Character kit — bold ink / paper sticker style
   Flat fills, thick ink outline, paper detail lines on dark fills.
   Realistic proportions: viewBox 0 0 200 590, ~7.5 heads.
   Pivots: head 100 90 · shoulders 48/152 116 · hips 75/125 304
============================================================ */
(() => {
  const PAPER = "#efeee9", INK = "#0b0b0b";
  const TONES = {
    light: { bg: PAPER, line: INK, skin: "#fbfaf6", skin2: "#e4ded2", skin3: "#c2b8a6", white: "#ffffff", pale: "#d8d5cd", mid: "#9a978e", dark: "#3b3a37", black: INK },
  };
  const DARK = ["dark", "black"];
  const MIR = (d) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${+(200 - +x).toFixed(1)} ${y}`);

  /* ---------------- GEOMETRY ---------------- */
  const HEAD = {
    face: "M76 46 C76 21 124 21 124 46 L124 58 C124 72 116 84 106 88 C103 89.6 97 89.6 94 88 C84 84 76 72 76 58 Z",
    ear: "M77 51 C69 49 68 64 77 66",
    earIn: "M75 55 C72 56 72 60 75 61",
    neck: "M91.5 80 L91.5 106 L108.5 106 L108.5 80 Z",
    neckShade: "M91.5 88 Q100 97 108.5 88",
    brow: "M83 47.5 Q90 45.5 97 47",
    lid: "M84 55 Q90.5 52 97 55.2",
    lidRound: "M84.5 54 Q90.5 50 96.5 54",
    lower: "M86 58.2 Q90.5 59.6 95 58.4",
    nose: "M100.5 57 C99.5 63 97.6 67 98.2 69 Q100 70.8 103 69.2",
    mouth: "M94.8 77.4 Q100 79.2 105.2 77.4",
    lip: "M97.5 81.4 Q100 82.2 102.5 81.4",
    smile: "M93.5 76 Q100 84 106.5 76 Q100 79 93.5 76 Z",
    wink: "M104 56 Q110 53 116 56",
  };
  const HAIR = {
    part: {
      front: "M73 64 C66 38 72 13 100 9 C128 13 134 38 127 64 C125 57 122.5 52.5 120 50 C118 39 110 30 100 26.5 C90 30 82 39 80 50 C77.5 52.5 75 57 73 64 Z",
      lines: "M100 26.5 C109 31 117 41 120.5 54 M100 26.5 C91 31 83 41 79.5 54 M100 10 C99.5 16 99.5 21 100 26 M88 15 C83 23 80.5 33 79.5 44 M112 15 C117 23 119.5 33 120.5 44 M94 12 C90 20 88 27 87.5 34 M106 12 C110 20 112 27 112.5 34",
    },
    crop: {
      front: "M75 56 C70 27 82 13 100 12 C118 13 130 27 125 56 C123 43 118 35 110 33 C102 36 92 36 86 33 C80 37 77 45 75 56 Z",
      lines: "M84 22 L87 17 M93 19 L95 14 M103 19 L105 14 M113 21 L116 17",
    },
    long: {
      back: "M73 52 C64 102 66 164 72 196 L128 196 C134 164 136 102 127 52 Z",
      backLines: "M80 120 C79 150 80 176 82 192 M120 120 C121 150 120 176 118 192",
      front: "M74 66 C67 34 76 11 100 11 C124 11 133 34 126 66 C123 50 118 40 106 33 C100 38 92 42 85 44 C79 50 76 58 74 66 Z",
      lines: "M106 34 C98 22 90 16 82 18 M110 14 C118 22 122 34 124 50",
    },
    bun: {
      bun: "M89 12 C89 -2 111 -2 111 12 C111 20 89 20 89 12 Z",
      front: "M76 58 C72 29 84 17 100 16 C116 17 128 29 124 58 C120 41 112 33 100 32 C88 33 80 41 76 58 Z",
      lines: "M100 17 L100 31 M90 19 C86 26 82 34 80 44 M110 19 C114 26 118 34 120 44",
    },
    bob: {
      back: "M72 50 C66 82 68 100 73 110 L127 110 C132 100 134 82 128 50 Z",
      front: "M74 72 C67 33 78 13 100 13 C122 13 133 33 126 72 C125 62 124 53 122 46 C108 50 92 50 78 46 C76 53 75 62 74 72 Z",
      lines: "M86 47 L86 18 M100 48 L100 14 M114 47 L114 18",
    },
    curly: { curls: [[78, 50], [76, 34], [84, 20], [97, 13], [111, 15], [121, 24], [125, 38], [123, 52], [90, 28], [104, 26], [114, 34]] },
    cap: {
      front: "M76 48 C76 16 124 16 124 48 Z M72 46 C86 53 114 53 128 46 L129 50 C114 59 86 59 71 50 Z",
      lines: "M100 17 L100 47 M86 22 C84 30 83 38 83 47 M114 22 C116 30 117 38 117 47",
    },
    bald: { front: "", lines: "M90 26 C96 23 104 23 110 26" },
  };

  const TORSO = {
    tee: {
      d: "M87 100 Q100 109 113 100 C131 102 146 106 152 114 C153 160 151 232 151 306 L49 306 C49 232 47 160 48 114 C54 106 69 102 87 100 Z",
      lines: "M87 100 Q100 112.5 113 100 M86 103 Q100 116 114 103 M60 200 C62 240 62 270 60 300 M140 190 C138 230 139 270 141 300",
    },
    hoodie: {
      d: "M84 100 C90 104 110 104 116 100 C134 102 148 106 153 114 C154 160 152 232 152 300 L48 300 C48 232 46 160 47 114 C52 106 66 102 84 100 Z",
      lines: "M80 100 C82 120 118 120 120 100 M94 117 L93 146 M106 117 L107 146 M70 236 L130 236 L137 286 L63 286 Z M48 286 L152 286",
    },
    coat: {
      d: "M88 100 L100 150 L112 100 C130 102 146 106 152 114 C155 200 157 330 160 428 L40 428 C43 330 45 200 48 114 C54 106 70 102 88 100 Z",
      lines: "M90 103 L80 146 L90 150 L100 190 M110 103 L120 146 L110 150 L100 190 M100 190 L100 428 M56 290 L76 290 M124 290 L144 290 M58 246 C60 300 58 360 54 420",
      under: "M88 100 L100 150 L112 100 Z",
    },
    blazer: {
      d: "M88 100 L100 150 L112 100 C130 102 146 106 152 114 C154 180 153 250 154 320 L46 320 C47 250 46 180 48 114 C54 106 70 102 88 100 Z",
      lines: "M90 103 L80 146 L90 150 L100 190 M110 103 L120 146 L110 150 L100 190 M100 190 L100 320 M58 282 L78 282 M122 282 L142 282",
      under: "M88 100 L100 150 L112 100 Z",
      collar: "M89 99 L84 118 L99 128 Z M111 99 L116 118 L101 128 Z",
    },
    shirt: {
      d: "M89 100 L100 112 L111 100 C130 102 146 106 152 114 C153 160 151 232 151 306 L49 306 C49 232 47 160 48 114 C54 106 70 102 89 100 Z",
      lines: "M89 99 L84 113 L99 117 M111 99 L116 113 L101 117 M100 114 L100 306 M103 160 L103 161 M103 190 L103 191 M103 220 L103 221 M103 250 L103 251 M112 144 L130 142 L131 162 L113 163 Z",
    },
    stripes: {
      d: "M87 100 Q100 109 113 100 C131 102 146 106 152 114 C153 160 151 232 151 306 L49 306 C49 232 47 160 48 114 C54 106 69 102 87 100 Z",
      lines: "M49 140 L151 140 M49 162 L151 162 M49 184 L151 184 M49 206 L151 206 M49 228 L151 228 M49 250 L151 250 M49 272 L151 272 M87 100 Q100 112.5 113 100",
    },
    dress: {
      d: "M88 100 Q100 110 112 100 C126 103 138 108 142 118 C144 160 146 200 146 220 C150 300 160 380 164 440 L36 440 C40 380 50 300 54 220 C54 200 56 160 58 118 C62 108 74 103 88 100 Z",
      lines: "M54 222 L146 222 M74 260 L64 430 M100 262 L100 436 M126 260 L136 430",
    },
  };

  const ARM = {
    short: { sleeve: "M48 110 C37 114 33 132 31 176 L57 180 C57 152 58 134 58 120 Z", sleeveLines: "M33 168 L56 171",
      skin: "M34 176 C32 214 33 254 37 298 L53 298 C55 256 56 216 55 178 Z", skinLines: "M38 226 C40 230 46 231 51 228" },
    long: { sleeve: "M48 110 C36 116 32 150 32 200 C32 240 33 272 36 302 L55 302 C56 270 56.5 236 57 200 C58 160 58 134 58 120 Z", sleeveLines: "M36 292 L55 292 M40 226 C44 232 50 232 55 226" },
    hand: "M37 298 C31 311 33 330 41 336 C49 340 55 330 54 314 L53 298 Z",
    handLines: "M50 306 Q55 315 50 322 M41 326 L41 332",
  };

  const LEG = {
    wide: { d: "M50 300 L100 300 L101 332 C100 402 99 478 98 556 L56 556 C54 478 52 402 50 300 Z", lines: "M76 334 C77 410 77 480 77 548 M90 520 C92 534 94 546 96 552" },
    slim: { d: "M53 300 L100 300 L100 330 C98 400 96 480 93 556 L66 556 C63 480 58 400 53 300 Z", lines: "M80 330 C80 410 79 480 79 548" },
    shorts: { d: "M51 300 L100 300 L100 386 L55 386 Z", lines: "M56 376 L99 376" },
    bare: { d: "" },
  };
  const LEG_SKIN = { shorts: "M60 376 L94 376 C93 430 91 500 90 556 L68 556 C67 500 64 430 60 376 Z", bare: "M64 300 L94 300 C93 400 91 480 90 556 L68 556 C67 480 66 400 64 300 Z" };
  const SHOE = { d: "M57 552 L97 552 C101 562 100 574 94 579 L52 579 C46 576 48 562 57 552 Z", lines: "M50 571 L98 571 M66 556 L72 564 M78 556 L84 564" };

  /* ---------------- RENDER ---------------- */
  let lastTone = "";
  function line(T, d, sw = 1.25, ghost = true) {
    if (!d) return "";
    const c = ghost ? T.line : DARK.includes(lastTone) ? PAPER : T.line;
    const w = ghost ? sw * 2.4 : sw * 1.9;
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  function part(T, d, tone, o = {}) {
    if (!d) return "";
    lastTone = tone;
    return `<path d="${d}" fill="${T[tone] || tone || "none"}"/>` + line(T, d, o.sw || 1.7);
  }

  function head(o, T) {
    const H = HAIR[o.hair], hc = o.hairC;
    let s = "";
    if (H.bun) s += part(T, H.bun, hc) + line(T, "M93 8 C97 4 103 4 107 8", 1, false);
    s += part(T, HEAD.ear, o.skin) + part(T, MIR(HEAD.ear), o.skin) + line(T, HEAD.earIn, 1, false) + line(T, MIR(HEAD.earIn), 1, false);
    s += part(T, HEAD.face, o.skin, { sw: 1.8 });
    const L = (d, sw = 1.3) => line(T, d, sw * 0.9, false);
    const lid = o.eyes === "round" ? HEAD.lidRound : HEAD.lid;
    const eye = (m) => `<g class="ch-eye${m ? " ch-eye--r" : ""}">${L(m ? MIR(lid) : lid, 1.7)}<ellipse cx="${m ? 109.5 : 90.5}" cy="56.6" rx="2.7" ry="2.7" fill="${T.line}"/>${o.eyes === "round" ? L(m ? MIR(HEAD.lower) : HEAD.lower, 0.9) : ""}</g>`;
    lastTone = o.skin; let f = "";
    f += [HEAD.brow, MIR(HEAD.brow)].map((d) => `<path class="ch-brow" d="${d}" fill="none" stroke="${T.line}" stroke-width="4.2" stroke-linecap="round"/>`).join("");
    f += eye(false) + eye(true) + `<path class="ch-wink" d="${HEAD.wink}" fill="none" stroke="${T.line}" stroke-width="1.8" stroke-linecap="round"/>`;
    f += L(HEAD.nose, 1.3);
    if (o.beard) f += `<path d="M80 66 C82 82 92 90 100 90 C108 90 118 82 120 66 C116 76 108 78 100 76 C92 78 84 76 80 66 Z" fill="${T[hc]}" opacity=".85"/>` + L("M80 66 C82 82 92 90 100 90 C108 90 118 82 120 66", 1.1);
    f += `<g class="ch-mouth">${L(HEAD.mouth, 1.5)}${L(HEAD.lip, 0.9)}</g>`;
    f += `<path class="ch-mouth-open" d="${HEAD.smile}" fill="${T.line}" stroke="${T.line}" stroke-width="1.2" stroke-linejoin="round"/>`;
    if (o.glasses) f += `<g fill="none" stroke="${T.line}" stroke-width="1.4"><rect x="82" y="50" width="17" height="13" rx="5"/><rect x="101" y="50" width="17" height="13" rx="5"/><path d="M99 55 L101 55 M82 54 L77 52 M118 54 L123 52"/></g>`;
    let hair = "";
    if (H.curls) {
      hair += H.curls.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${T.bg}"/>`).join("");
      hair += H.curls.map(([x, y]) => `<circle cx="${x + 2.5}" cy="${y + 2}" r="10" fill="${T[hc]}"/>`).join("");
      hair += H.curls.map(([x, y]) => `<path d="M${x - 9} ${y + 3} C${x - 11} ${y - 8} ${x + 9} ${y - 12} ${x + 10} ${y + 2}" fill="none" stroke="${T.line}" stroke-width="1.4" stroke-linecap="round"/>`).join("");
    } else if (H.front) hair += part(T, H.front, hc, { sw: 1.8 }) + line(T, H.lines, 1, false);
    else hair += L(H.lines, 1);
    if (o.phones) hair += L("M74 58 C66 2 134 2 126 58", 3.2) + part(T, "M68 50 L78 50 L78 70 L68 70 Z", "black") + part(T, MIR("M68 50 L78 50 L78 70 L68 70 Z"), "black");
    return `<g class="ch-head">${s}<g class="ch-face">${f}</g><g class="ch-hair">${hair}</g></g>`;
  }

  function arm(o, T, side) {
    const A = o.sleeves === "long" ? ARM.long : ARM.short, sk = o.skin;
    let s = "";
    if (A.skin) s += part(T, A.skin, sk) + line(T, A.skinLines, 1, false);
    s += part(T, ARM.hand, sk, { sw: 1.5 }) + line(T, ARM.handLines, 1, false);
    s += part(T, A.sleeve, o.topC) + line(T, A.sleeveLines, 1, false);
    const hold = side === "l" ? o.left : o.right;
    if (hold === "coffee") s += part(T, "M32 300 L58 300 L55 334 L35 334 Z", "white", { sw: 1.4 }) + part(T, "M30 294 L60 294 L60 301 L30 301 Z", "dark", { sw: 1.3 }) + line(T, "M35 314 L56 314", 2.4, false) + part(T, "M48 304 C52 304 56 310 55 318 C54 324 50 326 47 324 Z", sk, { sw: 1.2 });
    if (hold === "phone") s += part(T, "M36 292 L54 292 L54 324 L36 324 Z", "black", { sw: 1.3 }) + part(T, "M48 300 C55 304 56 318 52 324 C48 326 45 320 46 312 Z", sk, { sw: 1.2 });
    if (hold === "bag") s += line(T, "M34 330 C34 316 56 316 56 330", 1.8, false) + part(T, "M24 330 L66 330 L68 376 L22 376 Z", "dark", { sw: 1.5 }) + line(T, "M24 344 L66 344", 1, false) + part(T, ARM.hand, sk, { sw: 1.5 });
    const inner = side === "l" ? s : `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
    return `<g class="ch-arm ch-arm--${side}">${inner}</g>`;
  }

  function leg(o, T, side) {
    const Lg = LEG[o.bottom];
    let s = "";
    if (LEG_SKIN[o.bottom]) s += part(T, LEG_SKIN[o.bottom], o.skin);
    if (Lg.d) s += part(T, Lg.d, o.bottomC) + line(T, Lg.lines, 1, false);
    s += part(T, SHOE.d, o.shoeC || "white", { sw: 1.6 }) + line(T, SHOE.lines, 1, false);
    const inner = side === "l" ? s : `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
    return `<g class="ch-leg ch-leg--${side}">${inner}</g>`;
  }

  function body(o, T) {
    const t = TORSO[o.top];
    let s = part(T, HEAD.neck, o.skin) + line(T, HEAD.neckShade, 1, false);
    if (t.under) s += part(T, t.under, "white");
    s += part(T, t.d, o.topC, { sw: 1.8 }) + line(T, t.lines, 1.05, false);
    if (t.collar) s += part(T, t.collar, "white", { sw: 1.2 });
    if (o.tote) s += line(T, "M138 106 C146 150 152 200 156 236", 2, false) + part(T, "M140 232 L180 232 L184 290 L136 290 Z", o.tote, { sw: 1.5 }) + line(T, "M146 252 L174 252", 1, false);
    if (o.scarf) s += part(T, "M84 100 C92 116 108 116 116 100 L120 114 C108 128 92 128 80 114 Z", o.scarf) + part(T, "M104 120 L110 176 L124 172 L116 118 Z", o.scarf);
    if (o.strap) s += line(T, "M60 110 C70 160 84 210 96 240", 2.4, false);
    return s;
  }

  function svg(o, opts = {}) {
    o = Object.assign({ skin: "skin", hair: "crop", hairC: "black", top: "tee", topC: "white", sleeves: "short", bottom: "wide", bottomC: "black", eyes: "mono" }, o);
    if (["hoodie", "coat", "shirt", "stripes", "blazer"].includes(o.top)) o.sleeves = "long";
    const T = TONES.light;
    const vb = opts.viewBox || "-6 -10 212 600";
    const id = opts.id ? ` id="${opts.id}"` : "";
    const aria = opts.label ? ` role="img" aria-label="${opts.label}"` : ' aria-hidden="true"';
    return `<svg class="ch ${opts.cls || ""}" viewBox="${vb}"${id}${aria}><g>
      ${HAIR[o.hair].back ? `<g class="ch-hairback">${part(T, HAIR[o.hair].back, o.hairC)}${line(T, HAIR[o.hair].backLines, 1, false)}</g>` : ""}<g class="ch-body">${leg(o, T, "l")}${leg(o, T, "r")}${body(o, T)}${arm(o, T, "l")}${arm(o, T, "r")}</g>
      ${head(o, T)}</g></svg>`;
  }

  /* main character: basic, middle part, white oversized tee, wide black pants */
  const TOM = { skin: "skin", hair: "part", hairC: "black", top: "blazer", topC: "black", bottom: "wide", bottomC: "dark", shoeC: "white", eyes: "mono" };

  const CROWD = [
    { hair: "bun", hairC: "dark", skin: "skin", eyes: "round", top: "stripes", topC: "white", bottom: "slim", bottomC: "black", left: "coffee" },
    { hair: "cap", hairC: "black", skin: "skin3", eyes: "round", top: "hoodie", topC: "mid", bottom: "wide", bottomC: "dark" , phones: true },
    { hair: "long", hairC: "black", skin: "skin", top: "coat", topC: "dark", bottom: "slim", bottomC: "black", tote: "pale" },
    { hair: "bald", hairC: "dark", skin: "skin2", eyes: "round", beard: true, glasses: true, top: "shirt", topC: "pale", bottom: "slim", bottomC: "dark", right: "bag", shoeC: "black" },
    { hair: "curly", hairC: "black", skin: "skin3", eyes: "round", top: "tee", topC: "pale", bottom: "shorts", bottomC: "mid", left: "phone" },
    { hair: "bob", hairC: "dark", skin: "skin", top: "dress", topC: "mid", bottom: "bare", shoeC: "black", tote: "dark" },
    { hair: "crop", hairC: "black", skin: "skin2", glasses: true, top: "coat", topC: "pale", bottom: "wide", bottomC: "black", scarf: "dark", left: "coffee", shoeC: "black" },
    { hair: "long", hairC: "dark", skin: "skin2", eyes: "round", top: "hoodie", topC: "white", bottom: "slim", bottomC: "black", phones: true },
    { hair: "crop", hairC: "dark", skin: "skin", top: "tee", topC: "black", bottom: "wide", bottomC: "pale", strap: true, right: "bag" },
  ];

  /* sticker outline used on the black footer */
  const defs = document.createElement("div");
  defs.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="chHalo" x="-12%" y="-6%" width="124%" height="112%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/><feFlood flood-color="${PAPER}"/><feComposite in2="d" operator="in" result="o"/>
    <feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter></svg>`;
  document.body.appendChild(defs.firstChild);

  /* hero bust — redrawn from the reference sticker (image coordinates 1408x768) */
  function bust(opts = {}) {
    const S = (d, w = 7, c = INK) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const F = (d, fill, w = 7) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const body = `<g class="ch-body">
      ${F("M632 400 L632 492 L776 492 L776 396 Z", "#fff", 0)}${S("M632 404 L632 486")}${S("M776 398 L776 480")}
      ${F("M632 466 C600 494 520 524 462 548 C420 566 408 620 404 690 L1004 690 C1000 620 986 566 948 548 C890 524 810 494 776 460 Z", INK, 0)}
      ${F("M630 470 L778 466 L800 690 L612 690 Z", "#fff", 0)}
      ${F("M630 470 L604 507 L548 582 L590 603 L626 690 L404 690 C408 620 420 566 462 548 C520 524 600 494 630 470 Z", INK, 0)}
      ${F("M778 466 L802 506 L858 582 L815 605 L777 690 L1004 690 C1000 620 986 566 948 548 C890 524 810 494 778 466 Z", INK, 0)}
      ${S("M606 508 L548 582 L590 603 L626 688", 4.5, "#fff")}${S("M800 507 L858 582 L815 605 L777 688", 4.5, "#fff")}
      ${S("M632 472 L654 566 L646 590 L700 612 L760 590 L752 566 L774 470")}
      ${S("M640 478 L700 612 L768 476")}${S("M694 614 L694 690")}
      <circle cx="712" cy="655" r="6" fill="#fff" stroke="${INK}" stroke-width="4"/>
      ${S("M688 470 Q694 486 708 490", 5)}
      ${F("M632 466 C600 494 520 524 462 548 C420 566 408 620 404 690 L1004 690 C1000 620 986 566 948 548 C890 524 810 494 776 460", "none")}
    </g>`;
    const head = `<g class="ch-head">
      ${F("M600 286 C580 262 550 268 555 302 C560 332 586 346 606 336", "#fff")}${S("M586 300 C574 304 578 320 591 322", 5)}
      ${F("M806 286 C826 262 856 268 851 302 C846 332 820 346 800 336", "#fff")}${S("M820 300 C832 304 828 320 815 322", 5)}
      ${F("M598 300 L598 200 C598 120 806 120 806 200 L806 298 C805 340 792 378 766 404 C746 426 722 440 705 442 C690 442 672 432 652 416 C622 392 600 352 598 300 Z", "#fff", 0)}${S("M598 230 L598 300 C600 352 622 392 652 416 C672 432 690 442 705 442 C722 440 746 426 766 404 C792 378 805 340 806 298 L806 230")}
      <g class="ch-face">
        <path class="ch-brow" d="M621 249 Q650 235 683 242" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
        <path class="ch-brow" d="M732 242 Q763 235 793 250" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
        <g class="ch-eye">${S("M621 277 Q648 265 675 275", 5.5)}<circle cx="648" cy="284" r="10.5" fill="${INK}"/></g>
        <g class="ch-eye ch-eye--r">${S("M731 275 Q758 265 785 279", 5.5)}<circle cx="757" cy="284" r="10.5" fill="${INK}"/></g>
        <path class="ch-wink" d="M731 286 Q758 272 785 288" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        ${S("M697 268 L690 334 L716 334", 5.5)}
        <g class="ch-mouth">${S("M668 365 Q706 380 745 357", 5.5)}</g>
        <path class="ch-mouth-open" d="M666 360 Q706 404 747 354 Q706 374 666 360 Z" fill="${INK}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      </g>
      <g class="ch-hair">
        ${F("M572 274 C546 230 540 150 584 104 C614 74 664 70 696 94 C730 68 796 72 832 108 C870 150 868 222 846 270 C838 252 826 242 814 238 C802 214 790 188 770 170 C752 154 730 148 708 152 C702 146 700 140 701 132 C695 140 690 147 684 152 C664 154 646 170 637 194 C631 214 627 232 614 241 C598 246 584 256 572 274 Z", INK)}
        <g fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round">
          <path d="M572 196 C580 154 606 128 642 116"/><path d="M588 222 C596 184 622 158 660 142"/><path d="M598 124 C624 102 654 96 682 102"/>
          <path d="M614 234 C624 204 642 182 668 168"/><path d="M846 196 C840 160 816 130 780 118"/><path d="M834 228 C826 192 802 166 768 155"/>
          <path d="M804 102 C782 90 752 88 724 98"/><path d="M822 248 C814 218 796 196 776 182"/><path d="M699 100 C702 114 702 126 700 140"/>
        </g>
      </g>
    </g>`;
    return `<svg class="ch ${opts.cls || ""}" viewBox="${opts.viewBox || "384 52 640 642"}"${opts.id ? ` id="${opts.id}"` : ""} role="img" aria-label="${opts.label || "Illustrated character"}">${body}${head}</svg>`;
  }

  /* pets, side view facing right — legs swing via CSS (.pet-leg--a / --b) */
  const LEGP = (x, top, len, w, fill) => `<path d="M${x - w} ${top} L${x + w} ${top} L${x + w - 1} ${top + len} Q${x + w + 5} ${top + len + 1} ${x + w + 5} ${top + len + 6} L${x - w} ${top + len + 6} Z" fill="${fill}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  const petLeg = (cls, x, top, len, w, fill) => `<g class="pet-leg ${cls}" style="transform-origin:${x}px ${top}px">${LEGP(x, top, len, w, fill)}</g>`;
  function dog() {
    const W = "#fff", G = "#d8d5cd";
    return `<svg class="pet pet--dog" viewBox="20 0 210 150" aria-hidden="true"><g class="pet-bob">
      ${petLeg("pet-leg--b", 76, 84, 44, 7, G)}${petLeg("pet-leg--a", 152, 84, 44, 7, G)}
      <g class="pet-tail" style="transform-origin:54px 58px"><path d="M54 58 C38 48 32 30 40 18" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M54 58 C38 48 32 30 40 18" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round"/></g>
      <path d="M50 62 C50 40 70 36 100 38 L150 40 C172 42 178 58 176 74 C174 92 160 98 140 98 L72 98 C56 98 50 84 50 62 Z" fill="${W}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M92 40 C98 58 124 60 138 41 Z" fill="${INK}"/><path d="M60 70 C70 66 80 74 76 86 C70 92 58 88 60 70 Z" fill="${INK}"/>
      ${petLeg("pet-leg--a", 66, 86, 44, 7, W)}${petLeg("pet-leg--b", 142, 86, 44, 7, W)}
      <path d="M158 50 C152 22 174 6 194 12 C210 16 214 32 207 44 L216 52 C220 58 214 64 206 62 L192 62 C176 64 162 62 158 50 Z" fill="${W}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M170 14 C158 16 154 36 160 50 C170 48 178 34 180 18 Z" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="193" cy="31" r="4.2" fill="${INK}"/><circle cx="212" cy="53" r="5" fill="${INK}"/>
      <path d="M194 63 Q201 69 208 63" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M156 56 C164 66 176 70 186 68" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="178" cy="74" r="4" fill="${W}" stroke="${INK}" stroke-width="3"/>
    </g></svg>`;
  }
  function cat() {
    const W = "#fff";
    return `<svg class="pet pet--cat" viewBox="8 0 196 140" aria-hidden="true"><g class="pet-bob">
      ${petLeg("pet-leg--b", 66, 84, 40, 5, INK)}${petLeg("pet-leg--a", 132, 84, 40, 5, INK)}
      <g class="pet-tail" style="transform-origin:44px 66px"><path d="M44 66 C20 60 14 30 28 14 C32 10 38 12 36 18" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>
      <path d="M40 70 C40 52 60 46 92 48 L128 50 C146 52 152 64 150 78 C148 92 136 96 120 96 L64 96 C48 96 40 86 40 70 Z" fill="${INK}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M70 60 C88 56 108 56 124 60" fill="none" stroke="${W}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
      ${petLeg("pet-leg--a", 56, 86, 40, 5, INK)}${petLeg("pet-leg--b", 124, 86, 40, 5, INK)}
      <path d="M134 34 L138 10 L152 28 Z M160 28 L172 10 L174 36 Z" fill="${INK}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="154" cy="48" r="24" fill="${INK}"/>
      <path d="M140 24 L141 16 M166 22 L169 16" stroke="${W}" stroke-width="2" stroke-linecap="round"/>
      <path d="M152 44 Q158 38 165 44 Q158 50 152 44 Z" fill="${W}"/><circle cx="159" cy="44" r="2.4" fill="${INK}"/>
      <path d="M172 52 L176 52 L174 55 Z" fill="${W}"/>
      <g stroke="${W}" stroke-width="1.8" stroke-linecap="round"><path d="M170 58 L194 54"/><path d="M170 62 L194 64"/></g>
    </g></svg>`;
  }

  /* eagle-man bust, same die-cut sticker look as the PNG crowd (viewBox matches their 248x280) */
  function eagle() {
    const W = "#fff", B = "#d8d2c2";
    return `<svg class="sticker-svg" viewBox="-8 -8 264 296" aria-hidden="true"><g stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <path d="M14 282 C18 230 46 204 94 194 L124 238 L154 194 C202 204 230 230 234 282 Z" fill="${INK}"/>
      <path d="M96 192 L124 252 L152 192 Z" fill="${W}"/>
      <path d="M117 206 L131 206 L135 248 L124 262 L113 248 Z" fill="${INK}" stroke-width="3"/>
      <path d="M100 198 L82 236 L96 242 L116 280 M148 198 L166 236 L152 242 L132 280" fill="none" stroke="${W}" stroke-width="3.5"/>
      <path d="M96 150 L96 198 L152 198 L152 150 Z" fill="${W}"/>
      <path d="M96 192 L105 202 L114 192 L123 202 L132 192 L141 202 L152 192" fill="none" stroke-width="3.5"/>
      <path d="M78 118 C72 66 108 34 150 40 C184 46 202 72 198 100 C196 122 180 136 162 142 L154 172 L98 174 C86 160 80 140 78 118 Z" fill="${W}"/>
      <path d="M90 96 C100 88 110 86 120 88 M86 118 C96 110 108 108 118 110 M94 140 C104 132 116 130 126 132 M118 60 C128 54 140 52 150 54" fill="none" stroke-width="3"/>
      <path d="M170 86 C200 80 222 94 222 118 C222 130 212 136 204 128 C206 118 198 112 186 112 L164 114 Z" fill="${B}"/>
      <path d="M166 106 L196 108" fill="none" stroke-width="3.5"/>
      <path d="M132 74 L178 70 L172 86 C160 84 146 84 134 86 Z" fill="${INK}"/>
      <circle cx="156" cy="92" r="7.5" fill="${INK}" stroke="none"/><circle cx="158.5" cy="89.5" r="2.4" fill="${W}" stroke="none"/>
    </g></svg>`;
  }
  /* rabbit, side view facing right, hops (CSS .pet--rabbit) */
  function rabbit() {
    const W = "#fff";
    return `<svg class="pet pet--rabbit" viewBox="0 0 180 160" aria-hidden="true"><g class="pet-hop"><g stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <path d="M118 52 C108 20 112 2 122 4 C132 6 134 30 128 54 Z" fill="${W}"/>
      <path d="M130 54 C132 20 142 6 150 10 C158 14 150 40 138 58 Z" fill="${W}"/>
      <path d="M122 14 C120 26 121 38 124 48 M146 18 C142 30 138 42 134 52" fill="none" stroke-width="3"/>
      <circle cx="28" cy="100" r="13" fill="${W}"/>
      <path d="M30 112 C26 80 52 62 88 64 C112 66 124 80 124 100 C124 122 106 136 80 136 L44 136 C34 136 30 126 30 112 Z" fill="${W}"/>
      <path d="M54 136 C48 124 56 114 70 116 C84 118 92 130 86 138 Z" fill="${W}"/>
      <path d="M100 132 L100 142 L114 142 M86 134 L86 142 L98 142" fill="none" stroke-width="4"/>
      <path d="M112 76 C108 52 124 40 142 44 C160 48 168 64 162 80 C158 92 144 98 130 96 C120 94 114 88 112 76 Z" fill="${W}"/>
      <circle cx="146" cy="66" r="4.6" fill="${INK}" stroke="none"/><circle cx="147.6" cy="64.4" r="1.4" fill="${W}" stroke="none"/>
      <path d="M161 74 L166 76 L161 79 Z" fill="${INK}" stroke-width="2"/>
      <path d="M162 80 L176 78 M162 84 L176 86" fill="none" stroke-width="2"/>
    </g></g></svg>`;
  }

  const PEOPLE = ["classic", "artist", "tech", "adventurer", "scholar", "musician", "chef", "dreamer", "athlete", "architect"];

  /* main character = the reference sticker itself, with an SVG layer for blink / wink / smile.
     The overlay viewBox is the PNG's crop box in the source image (380,52 → 1027,715). */

  /* ---------- lens reveals (mouse over the character) + electrocution layers. Image coords: 0 0 647 663 ---------- */
  const BONE = "#e2e0d8", SHADE = "rgba(11,11,11,.28)", METAL = "#ffffff";
  const mir = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${650 - +x} ${y}`);   /* mirror a path around the body's axis (x = 325) */
  const xtag = (x, y, t, lx, ly) => `${lx != null ? `<path d="M${lx} ${ly} L${x} ${y - 9}" stroke="${METAL}" stroke-width="2" stroke-dasharray="3 4"/>` : ""}<g transform="translate(${x} ${y})"><rect x="-4" y="-20" width="${t.length * 8.2 + 14}" height="22" rx="3" fill="${INK}" stroke="${METAL}" stroke-width="1.5"/><text x="3" y="-4" font-family="Courier Prime, monospace" font-weight="700" font-size="13" fill="${METAL}">${t}</text></g>`;
  const RIB = (i) => { const y = 508 + i * 24, w = i * 5; return `M312 ${y} C270 ${y - 18} ${200 - w} ${y - 12} ${176 - w} ${y + 22} C${168 - w} ${y + 38} ${172 - w} ${y + 50} ${184 - w} ${y + 56}`; };
  const SKELETON = `<svg viewBox="0 0 647 663" class="pav__bones">
    <defs><pattern id="pavScan" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0.5 H6" stroke="#fff" stroke-width="1" opacity=".07"/></pattern>
      <radialGradient id="pavGlow" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#2d3a3f" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <rect width="647" height="663" fill="url(#pavGlow)"/>
    <g class="pav__bone">
      <path d="M325 30 C432 30 478 110 472 204 C470 240 462 262 450 280 C446 290 440 300 432 306 C424 322 408 330 392 332 L258 332 C242 330 226 322 218 306 C210 300 204 290 200 280 C188 262 180 240 178 204 C172 110 218 30 325 30Z" fill="${BONE}"/>
      <path d="M222 304 C226 352 258 398 306 404 L344 404 C392 398 424 352 428 304 L412 310 C410 336 400 354 384 358 L266 358 C250 354 240 336 238 310 Z" fill="${BONE}"/>
      <circle cx="226" cy="300" r="9" fill="${BONE}" stroke="${SHADE}" stroke-width="3"/><circle cx="424" cy="300" r="9" fill="${BONE}" stroke="${SHADE}" stroke-width="3"/>
      <g fill="none" stroke="${SHADE}" stroke-width="5" stroke-linecap="round">
        <path d="M196 214 C200 160 228 116 270 92"/><path d="${mir("M196 214 C200 160 228 116 270 92")}"/>
        <path d="M212 262 C228 286 250 290 266 280"/><path d="${mir("M212 262 C228 286 250 290 266 280")}"/>
        <path d="M325 32 L320 48 L330 62 L321 78 L329 94" stroke-width="3"/>
      </g>
      <path d="M236 212 C246 194 292 194 302 212 C310 232 300 260 270 262 C240 260 228 234 236 212Z" fill="${INK}"/><path d="${mir("M236 212 C246 194 292 194 302 212 C310 232 300 260 270 262 C240 260 228 234 236 212Z")}" fill="${INK}"/>
      <path d="M325 266 C315 280 307 296 313 304 C317 309 322 306 325 299 C328 306 333 309 337 304 C343 296 335 280 325 266Z" fill="${INK}"/>
      <rect x="270" y="314" width="110" height="44" rx="8" fill="${INK}"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${274 + i * 11.6}" y="314" width="10" height="18" rx="3" fill="${BONE}"/><rect x="${276 + i * 11}" y="338" width="9.5" height="16" rx="3" fill="${BONE}"/>`).join("")}
      ${[412, 430, 448, 466].map((y) => `<rect x="296" y="${y + 4}" width="58" height="6" rx="3" fill="${BONE}" opacity=".75"/><rect x="306" y="${y}" width="38" height="14" rx="5" fill="${BONE}"/>`).join("")}
      ${Array.from({ length: 8 }, (_, i) => `<rect x="310" y="${492 + i * 22}" width="30" height="16" rx="5" fill="${BONE}"/>`).join("")}
      <g fill="none" stroke="${BONE}" stroke-linecap="round">
        <path d="M316 488 C286 478 246 486 206 478 C184 474 164 480 146 494" stroke-width="13"/><path d="${mir("M316 488 C286 478 246 486 206 478 C184 474 164 480 146 494")}" stroke-width="13"/>
        <path d="M134 524 L110 663" stroke-width="26"/><path d="M516 524 L540 663" stroke-width="26"/>
        ${Array.from({ length: 7 }, (_, i) => `<path d="${RIB(i)}" stroke-width="10"/><path d="${mir(RIB(i))}" stroke-width="10"/>`).join("")}
      </g>
      <circle cx="134" cy="510" r="25" fill="${BONE}"/><circle cx="516" cy="510" r="25" fill="${BONE}"/>
      <rect x="306" y="488" width="38" height="22" rx="8" fill="${BONE}"/><rect x="314" y="496" width="22" height="104" rx="9" fill="${BONE}"/>
    </g>
    <g class="pav__obj" fill="${METAL}">
      <rect x="296" y="110" width="58" height="40" rx="5"/><rect x="312" y="120" width="26" height="20" rx="2" fill="${INK}"/>
      <path d="${[302, 311, 320, 329, 338, 347].map((x) => `M${x} 102 V110 M${x} 150 V158`).join(" ")}" stroke="${METAL}" stroke-width="3.5"/>
      <text x="372" y="462" font-family="Georgia, serif" font-weight="700" font-size="64" fill="${METAL}">;</text>
      <g transform="translate(228 604) rotate(24)"><rect x="-30" y="-12" width="52" height="24" rx="5"/><rect x="22" y="-8" width="18" height="16" rx="1.5"/><rect x="27" y="-5" width="4" height="4" fill="${INK}"/><rect x="33" y="-5" width="4" height="4" fill="${INK}"/><circle cx="-20" cy="0" r="4" fill="${INK}"/></g>
      <g transform="translate(410 606)"><path d="M-34 10 C-36 -8 -18 -16 0 -12 C6 -28 30 -30 36 -14 C40 -4 34 4 28 6 C36 10 38 26 24 34 C8 42 -30 40 -34 10Z"/><path d="M37 -17 L54 -12 L37 -7Z"/><circle cx="24" cy="-18" r="3.4" fill="${INK}"/><path d="M-20 14 C-8 22 8 22 16 12" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>
      <g transform="translate(300 646)"><ellipse rx="15" ry="10"/><circle cx="17" cy="0" r="6"/><path d="M-8 -8 L-14 -18 M0 -9 L0 -20 M8 -8 L12 -18 M-8 8 L-14 18 M0 9 L0 20 M8 8 L12 18 M21 -4 L30 -12 M21 4 L30 12" stroke="${METAL}" stroke-width="3" stroke-linecap="round"/></g>
    </g>
    <g class="pav__port">
      <circle cx="325" cy="552" r="44" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 8" class="pav__portring"/>
      <rect x="297" y="532" width="56" height="40" rx="9" fill="#fff"/><rect x="309" y="544" width="7" height="16" rx="2" fill="${INK}"/><rect x="334" y="544" width="7" height="16" rx="2" fill="${INK}"/>
    </g>
    <g class="pav__circuit">
      <path d="M386.6 143.2 L386.6 156.8 L373.8 158.7 L370.8 169.1 L380.5 177.6 L373.2 189.0 L361.4 183.7 L353.2 190.8 L356.8 203.2 L344.4 208.9 L337.4 198.0 L326.6 199.6 L323.0 212.0 L309.5 210.0 L309.5 197.1 L299.6 192.6 L289.8 201.0 L279.5 192.1 L286.5 181.2 L280.6 172.1 L267.8 173.9 L264.0 160.8 L275.7 155.4 L275.7 144.6 L264.0 139.2 L267.8 126.1 L280.6 127.9 L286.5 118.8 L279.5 107.9 L289.8 99.0 L299.6 107.4 L309.5 102.9 L309.5 90.0 L323.0 88.0 L326.6 100.4 L337.4 102.0 L344.4 91.1 L356.8 96.8 L353.2 109.2 L361.4 116.3 L373.2 111.0 L380.5 122.4 L370.8 130.9 L373.8 141.3Z" fill="#fff"/><circle cx="325" cy="150" r="22" fill="${INK}"/><circle cx="325" cy="150" r="9" fill="#fff"/>
      <path d="M269.7 91.5 L269.7 100.5 L263.3 101.7 L260.5 108.4 L264.2 113.8 L257.8 120.2 L252.4 116.5 L245.7 119.3 L244.5 125.7 L235.5 125.7 L234.3 119.3 L227.6 116.5 L222.2 120.2 L215.8 113.8 L219.5 108.4 L216.7 101.7 L210.3 100.5 L210.3 91.5 L216.7 90.3 L219.5 83.6 L215.8 78.2 L222.2 71.8 L227.6 75.5 L234.3 72.7 L235.5 66.3 L244.5 66.3 L245.7 72.7 L252.4 75.5 L257.8 71.8 L264.2 78.2 L260.5 83.6 L263.3 90.3Z" fill="#fff" class="pav__gear2"/><circle cx="240" cy="96" r="10" fill="${INK}"/>
      <circle cx="268" cy="232" r="17" fill="#ffd43b"/><circle cx="382" cy="232" r="17" fill="#ffd43b"/>
      <rect x="276" y="300" width="98" height="30" rx="5" fill="none" stroke="#fff" stroke-width="5"/><path d="M290 300 V330 M304 300 V330 M318 300 V330 M332 300 V330 M346 300 V330 M360 300 V330" stroke="#fff" stroke-width="3"/>
      <g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M310 340 V470 H250 V510"/><path d="M325 340 V520"/><path d="M340 340 V470 H400 V510"/>
        <path d="M250 510 H190 V600"/><path d="M400 510 H460 V600"/><path d="M325 580 V610"/>
        <path d="M200 160 H150 V230"/><path d="M450 160 H500 V230"/>
      </g>
      <g fill="#fff"><circle cx="250" cy="510" r="7"/><circle cx="400" cy="510" r="7"/><circle cx="190" cy="600" r="7"/><circle cx="460" cy="600" r="7"/><circle cx="150" cy="230" r="7"/><circle cx="500" cy="230" r="7"/></g>
      <rect x="250" y="610" width="150" height="46" rx="8" fill="none" stroke="#fff" stroke-width="5"/><rect x="400" y="624" width="10" height="18" rx="2" fill="#fff"/>
      <g fill="#ffd43b"><rect x="260" y="620" width="24" height="26" rx="3"/><rect x="290" y="620" width="24" height="26" rx="3"/><rect x="320" y="620" width="24" height="26" rx="3"/><rect x="350" y="620" width="24" height="26" rx="3" class="pav__batlast"/></g>
    </g>
    <g class="pav__tags">
      ${xtag(372, 126, "chip_v2.ai")}
      ${xtag(404, 444, "missing ;")}
      ${xtag(138, 566, "backup.usb", 206, 596)}
      ${xtag(452, 566, "rubber_duck", 430, 584)}
      ${xtag(338, 628, "bug #404")}
      <g class="pav__porttag">${xtag(372, 528, "power_in ?")}</g>
    </g>
    <rect width="647" height="663" fill="url(#pavScan)"/>
  </svg>`;
  const ROBOT = `<svg viewBox="0 0 647 663" class="pav__robot" aria-hidden="true">
    <path d="M232 170 H418" stroke="${INK}" stroke-width="4" stroke-dasharray="10 7"/>
    <path d="M325 20 V-38" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><circle cx="325" cy="-48" r="13" fill="#ffd43b" stroke="${INK}" stroke-width="5" class="pav__ant"/>
    <g fill="#d9d7cf" stroke="${INK}" stroke-width="6"><circle cx="196" cy="256" r="24"/><circle cx="454" cy="256" r="24"/></g>
    <path d="M186 256 H206 M196 246 V266 M444 256 H464 M454 246 V266" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <rect x="224" y="202" width="202" height="56" rx="28" fill="${INK}" stroke="#fff" stroke-width="6"/>
    <rect x="248" y="219" width="48" height="20" rx="7" fill="#ffd43b" class="pav__eyeled"/><rect x="354" y="219" width="48" height="20" rx="7" fill="#ffd43b" class="pav__eyeled"/>
    <rect x="236" y="225" width="22" height="8" rx="4" fill="#fff" class="pav__scan"/>
    <rect x="283" y="294" width="84" height="32" rx="8" fill="${INK}" stroke="#fff" stroke-width="5"/>
    <path d="M297 300 V320 M309 300 V320 M321 300 V320 M333 300 V320 M345 300 V320 M357 300 V320" stroke="#fff" stroke-width="3" class="pav__grille"/>
    <g fill="${INK}"><circle cx="244" cy="300" r="5.5"/><circle cx="406" cy="300" r="5.5"/><circle cx="262" cy="420" r="9"/><circle cx="388" cy="420" r="9"/></g>
  </svg>`;
  const spiral = (cx, cy) => { let d = ""; for (let t = 0; t < 15; t += 0.3) d += (d ? " L" : "M") + (cx + Math.cos(t) * t * 1.5).toFixed(1) + " " + (cy + Math.sin(t) * t * 1.1).toFixed(1); return d; };
  const DIZZY = `<g class="pav__dizzy">${[648, 757].map((cx) => `<ellipse cx="${cx}" cy="281" rx="27" ry="19" fill="#fff"/><path d="${spiral(cx, 281)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`).join("")}</g>`;
  const BOLT = (x, y, r) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 L26 34 L12 38 L40 80 L4 44 L18 40 Z"/>`;
  const LENS = `<div class="pav__alt" aria-hidden="true">
      <div class="pav__xray"><img src="assets/people/main.png" alt="" draggable="false" class="pav__sil">${SKELETON}</div>
    </div><i class="pav__ring" aria-hidden="true"></i>
    <svg viewBox="0 0 647 663" class="pav__bolts" aria-hidden="true">${BOLT(110, 40, -20)}${BOLT(470, 30, 25)}${BOLT(80, 260, -60)}${BOLT(540, 240, 50)}${BOLT(300, -60, 10)}</svg>
    <span class="pav__smoke" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;

  function photo(opts = {}) {
    const lid = (cx) => `<ellipse cx="${cx}" cy="281" rx="23" ry="15" fill="#fff"/><path d="M${cx - 23} 283 Q${cx} 292 ${cx + 23} 283" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
    return `<div class="pav avatar ${opts.cls || ""}"${opts.id ? ` id="${opts.id}"` : ""} role="img" aria-label="${opts.label || "Illustrated character"}">
      <div class="pav__tilt"><img src="assets/people/main.png" alt="" draggable="false">${ROBOT}
      <svg class="pav__fx" viewBox="380 52 647 663" aria-hidden="true">
        <g class="pav__blink pav__blink--l">${lid(648)}</g><g class="pav__blink pav__blink--r">${lid(757)}</g>
        <g class="pav__smile"><ellipse cx="707" cy="364" rx="46" ry="15" fill="#fff"/><path d="M664 356 Q706 404 750 350 Q706 372 664 356 Z" fill="${INK}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M684 378 Q706 392 728 376" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>
        <g class="pav__sleepy">${[648, 757].map((cx) => `<path d="M${cx - 25} 283 A25 17 0 0 1 ${cx + 25} 283 Z" fill="#fff"/><path d="M${cx - 25} 283 Q${cx} 291 ${cx + 25} 283" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join("")}</g>
        ${DIZZY}
        <g class="pav__laugh">${[648, 757].map((cx) => `<ellipse cx="${cx}" cy="281" rx="27" ry="19" fill="#fff"/><path d="M${cx - 20} 290 Q${cx} 260 ${cx + 20} 290" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`).join("")}<path d="M668 352 Q706 412 748 350 Z" fill="${INK}"/><path d="M688 380 Q706 396 726 380" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>
        <g class="pav__angry"><ellipse cx="707" cy="364" rx="48" ry="17" fill="#fff"/><path d="M612 236 L680 262 M794 236 L726 262" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M680 372 Q706 352 734 372" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></g>
        <g class="pav__choke">
          <ellipse cx="648" cy="281" rx="25" ry="17" fill="#fff"/><ellipse cx="757" cy="281" rx="25" ry="17" fill="#fff"/>
          <path d="M634 268 L662 294 M662 268 L634 294 M743 268 L771 294 M771 268 L743 294" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
          <ellipse cx="707" cy="364" rx="48" ry="17" fill="#fff"/>
          <path d="M668 362 Q680 352 692 362 Q704 372 716 362 Q728 352 744 362" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
          <path d="M700 366 Q700 392 714 392 Q726 390 722 366 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
          <path d="M600 210 C590 196 596 184 606 190 M812 206 C824 192 818 180 808 186" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
        </g>
      </svg>${LENS}</div><span class="pav__zzz" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span></div>`;
  }

  window.Char = { svg, bust, photo, dog, cat, eagle, rabbit, PEOPLE, TOM, CROWD };
})();
