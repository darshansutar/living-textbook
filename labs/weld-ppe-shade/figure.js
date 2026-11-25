/* The bench scene of the PPE lab, drawn in code (no pictures). Style follows the painted lessons: dark ink outlines,
   leather brown, steel grey, mustard and navy for Mallesh. No text in the drawing: labels are HTML chips.
   Gives the workbench player window.FIG_DATA (views and anchors) and window.FIG_SVG (the scene). */
(function () {
  "use strict";
  var OUT = "#17110c";
  var C = {
    leather: "#9a6230", leatherD: "#6e431f", leatherL: "#b98445", stitch: "#d9b27a",
    glove: "#b4b0a6", gloveD: "#8c887e", boot: "#2b2622", bootL: "#463e37",
    steel: "#3a3f45", steelL: "#5b646c", win: "#241d33", winG: "#7060a0",
    skin: "#bb7a4c", skinD: "#9a5f39", hair: "#1a1412",
    shirt: "#d4a22a", shirtD: "#a67e18", pants: "#27304a", pantsD: "#1b2236",
    canvas: "#8d8a62", canvasD: "#6b6945", wall: "#1f2421", wallB: "#29302b", floor: "#2c2824"
  };
  function t(tag, a, inner) {
    var s = "<" + tag;
    for (var k in a) if (a[k] !== null && a[k] !== undefined) s += " " + k + '="' + a[k] + '"';
    return s + (inner === undefined ? "/>" : ">" + inner + "</" + tag + ">");
  }
  function g(a, inner) { return t("g", a, inner); }
  function path(d, fill, extra) { return t("path", Object.assign({ d: d, fill: fill, stroke: OUT, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, extra || {})); }
  function rect(x, y, w, h, fill, rx, extra) { return t("rect", Object.assign({ x: x, y: y, width: w, height: h, rx: rx || 0, fill: fill, stroke: OUT, "stroke-width": 2 }, extra || {})); }
  function circ(cx, cy, r, fill, extra) { return t("circle", Object.assign({ cx: cx, cy: cy, r: r, fill: fill, stroke: OUT, "stroke-width": 2 }, extra || {})); }
  function ell(cx, cy, rx, ry, fill, extra) { return t("ellipse", Object.assign({ cx: cx, cy: cy, rx: rx, ry: ry, fill: fill }, extra || {})); }
  function line(x1, y1, x2, y2, stroke, w, extra) { return t("line", Object.assign({ x1: x1, y1: y1, x2: x2, y2: y2, stroke: stroke, "stroke-width": w, "stroke-linecap": "round" }, extra || {})); }
  function stitch(d) { return t("path", { d: d, fill: "none", stroke: C.stitch, "stroke-width": 1.4, "stroke-dasharray": "4 3", opacity: ".8" }); }

  /* ---------- shapes reused on the bench and on Mallesh ---------- */
  // leather apron: origin at the top of its neck loop
  var apron = g({ id: "sh-apron" },
    path("M-14 4C-14 -24 14 -24 14 4", "none", { "stroke-width": 9 }) + path("M-14 4C-14 -24 14 -24 14 4", "none", { stroke: C.leatherL, "stroke-width": 5 }) +
    path("M-14 2L14 2L22 40L50 54L46 130Q0 140 -46 130L-50 54L-22 40Z", C.leather) +
    path("M-14 2L14 2L22 40L-22 40Z", C.leatherL) +
    rect(-36, 88, 30, 28, C.leatherD, 3) + rect(6, 88, 30, 28, C.leatherD, 3) +
    stitch("M-40 60L-42 124") + stitch("M40 60L42 124") + stitch("M-36 88h30M6 88h30"));
  // short leather cape with sleeves and a stand-up collar: origin at the base of the neck
  var cape = g({ id: "sh-cape" },
    line(-50, 24, -68, 122, OUT, 36) + line(50, 24, 68, 122, OUT, 36) +
    line(-50, 24, -68, 122, C.leather, 32) + line(50, 24, 68, 122, C.leather, 32) +
    path("M-26 0Q-70 4 -72 36Q-72 56 -50 60L50 60Q72 56 72 36Q70 4 26 0Z", C.leatherL) +
    line(-48, 56, 48, 56, C.leatherD, 3) + line(0, 4, 0, 56, OUT, 2) +
    rect(-24, -18, 48, 24, C.leatherL, 8) + line(-24, -6, 24, -6, C.leatherD, 2) + circ(10, -6, 3.6, C.stitch) + circ(10, 38, 3.6, C.stitch) +
    stitch("M-60 40L-68 112") + stitch("M60 40L68 112"));
  // grey leather gauntlet glove, origin at the wrist centre, fingers down
  var glove = g({ id: "sh-glove" },
    path("M-17 -40L17 -40L19 -8Q24 18 0 30Q-24 18 -19 -8Z", C.glove) +
    path("M-18 -40L18 -40L19 -22L-19 -22Z", C.gloveD) +
    line(-7, 12, -8, 24, C.gloveD, 1.6) + line(0, 14, 0, 27, C.gloveD, 1.6) + line(7, 12, 8, 24, C.gloveD, 1.6));
  // lace-up safety boot, front view, origin at the sole centre
  var boot = g({ id: "sh-boot" },
    path("M-17 -56L17 -56L20 -10Q27 -2 25 10L-25 10Q-27 -2 -20 -10Z", C.boot) +
    rect(-27, 6, 54, 10, "#15110e", 4) + path("M-22 -8Q0 -22 22 -8Q26 0 24 6L-24 6Q-26 0 -22 -8Z", C.bootL) +
    line(-9, -44, 9, -38, C.stitch, 1.6) + line(9, -44, -9, -38, C.stitch, 1.6) + line(-9, -30, 9, -24, C.stitch, 1.6) + line(9, -30, -9, -24, C.stitch, 1.6) +
    rect(-17, -58, 34, 8, C.bootL, 3));
  // steel welding helmet, origin at the centre of the face window
  var helmet = g({ id: "sh-helmet" },
    path("M-48 40Q-54 -56 0 -62Q54 -56 48 40Q40 56 0 58Q-40 56 -48 40Z", C.steel) +
    path("M-40 -30Q0 -66 40 -30Q10 -48 -40 -30Z", C.steelL, { stroke: "none", opacity: ".8" }) +
    rect(-36, -18, 72, 44, "#20242a", 6) + rect(-30, -13, 60, 34, C.win, 4) +
    t("path", { d: "M-26 -9L-8 -9L-20 17L-26 17Z", fill: "#ffffff", opacity: ".12" }) +
    circ(-44, 6, 4, C.steelL) + circ(44, 6, 4, C.steelL) + path("M-30 40Q0 50 30 40", "none", { stroke: C.steelL, "stroke-width": 2 }));
  // hand screen with a wooden handle, origin at the middle of the window
  var screen = g({ id: "sh-screen" },
    rect(-30, 14, 12, 48, "#a8763a", 5) + rect(-30, 14, 12, 18, "#7c5426", 3) +
    path("M-38 -58Q-38 -66 -30 -66L30 -66Q38 -66 38 -58L38 10Q38 18 30 18L-30 18Q-38 18 -38 10Z", C.steel) +
    rect(-26, -50, 52, 36, "#20242a", 5) + rect(-21, -46, 42, 28, C.win, 3) +
    t("path", { d: "M-18 -44L-4 -44L-14 -22L-18 -22Z", fill: "#ffffff", opacity: ".12" }));
  // plain chipping goggles with a strap, origin at the middle of the lenses
  var goggles = g({ id: "sh-goggles" },
    path("M-34 -6Q-34 -16 -22 -16L22 -16Q34 -16 34 -6L34 6Q34 14 22 14L-22 14Q-34 14 -34 6Z", "#cfe6ee", { opacity: ".55" }) +
    path("M-34 -6Q-34 -16 -22 -16L22 -16Q34 -16 34 -6L34 6Q34 14 22 14L-22 14Q-34 14 -34 6Z", "none", { stroke: "#2c3338", "stroke-width": 3 }) +
    line(-34, -2, -50, -2, "#2c3338", 5) + line(34, -2, 50, -2, "#2c3338", 5) + line(-3, -6, 3, -6, "#2c3338", 3));
  var defs = "<defs>" + apron + cape + glove + boot + helmet + screen + goggles +
    '<radialGradient id="arcglow"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#fff2a6" stop-opacity=".95"/><stop offset=".6" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="floorlight"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".16"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>' +
    '<clipPath id="winclip"><rect x="-30" y="-13" width="60" height="34" rx="4"/></clipPath></defs>';

  /* ---------- room ---------- */
  var room =
    rect(-700, -400, 2400, 860, C.wall, 0, { stroke: "none" }) +
    rect(-700, 262, 2400, 198, C.wallB, 0, { stroke: "none" }) +
    line(-700, 262, 1700, 262, "#171b18", 3) +
    // wall panels
    [-440, -240, -40, 160, 360, 560, 760, 960, 1160, 1360].map(function (x) { return line(x, -400, x, 262, "#1a1f1c", 3); }).join("") +
    rect(-700, 440, 2400, 500, C.floor, 0, { stroke: "none" }) + line(-700, 440, 1700, 440, "#141210", 3) +
    ell(500, 560, 520, 90, "url(#floorlight)") +
    [[80, 520, 60], [330, 600, 80], [610, 590, 90], [900, 540, 70]].map(function (p) { return ell(p[0], p[1], p[2], 6, "#241f1c"); }).join("");

  /* ---------- dial and filter-glass rack (the shade station) ---------- */
  function arcPath(r, a0, a1) {
    function pt(a) { var rad = (a - 90) * Math.PI / 180; return (r * Math.cos(rad)).toFixed(1) + " " + (r * Math.sin(rad)).toFixed(1); }
    return "M" + pt(a0) + "A" + r + " " + r + " 0 " + (a1 - a0 > 180 ? 1 : 0) + " 1 " + pt(a1);
  }
  // 0..400 A sweeps -120..+120 degrees; green to 100 A, amber to 300 A, red above
  function ang(a) { return -120 + 240 * a / 400; }
  var dial = g({ "data-part": "dial", transform: "translate(380 150)" },
    circ(0, 0, 62, "#171a18", { "stroke-width": 3 }) + circ(0, 0, 54, "#0f1110") +
    t("path", { d: arcPath(44, ang(0), ang(100)), fill: "none", stroke: "#58c58a", "stroke-width": 9, "stroke-linecap": "butt" }) +
    t("path", { d: arcPath(44, ang(100), ang(300)), fill: "none", stroke: "#e0a93a", "stroke-width": 9, "stroke-linecap": "butt" }) +
    t("path", { d: arcPath(44, ang(300), ang(400)), fill: "none", stroke: "#e2644f", "stroke-width": 9, "stroke-linecap": "butt" }) +
    [0, 100, 200, 300, 400].map(function (a) { var r = ang(a) * Math.PI / 180; return line((Math.sin(r) * 52).toFixed(1), (-Math.cos(r) * 52).toFixed(1), (Math.sin(r) * 60).toFixed(1), (-Math.cos(r) * 60).toFixed(1), "#d8d2c4", 3); }).join("") +
    g({ "data-needle": "", style: "transform:rotate(" + ang(0) + "deg);transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)" },
      path("M-3 8L0 -46L3 8Z", "#f3ecd8", { "stroke-width": 1.2 }) + circ(0, 0, 6, "#d8d2c4", { "stroke-width": 1.5 })));
  var rackPlates = [["p9", 500, "#9c8bc4", .5], ["p11", 560, "#5f4f8c", .72], ["p13", 620, "#241a3c", .96]].map(function (p) {
    return g({ "data-plate": p[0], class: "plate", style: "transform-origin:" + p[1] + "px 226px" },
      rect(p[1] - 22, 156, 44, 70, "#20242a", 5) + rect(p[1] - 17, 162, 34, 58, p[2], 3) +
      t("path", { d: "M" + (p[1] - 14) + " 164L" + (p[1] - 2) + " 164L" + (p[1] - 12) + " 190L" + (p[1] - 14) + " 190Z", fill: "#fff", opacity: ".18" }));
  }).join("");
  var rack = rect(474, 226, 168, 12, "#4d4034", 3) + rect(482, 238, 8, 26, "#3a3028", 2) + rect(626, 238, 8, 26, "#3a3028", 2) + rackPlates;

  /* ---------- hooks, bench and the gear lying on it ---------- */
  var hooks = rect(620, 92, 220, 9, "#5b5246", 3) + circ(660, 99, 6, "#8a7b66") + circ(790, 99, 6, "#8a7b66");
  function item(id, inner, from, ringAt) {
    return g({ "data-hit": id, class: "item", "data-item": id, style: "--dx:" + from[0] + "px;--dy:" + from[1] + "px" }, inner) +
      t("ellipse", { class: "ring", cx: ringAt[0], cy: ringAt[1], rx: ringAt[2], ry: ringAt[3] });
  }
  var apronOnWall = item("apron", t("use", { href: "#sh-apron", transform: "translate(660 112)" }), [-430, 150], [660, 272, 56, 12]);
  var capeOnWall = item("cape", line(790, 100, 790, 136, OUT, 7) + line(790, 100, 790, 136, C.leatherL, 4) + t("use", { href: "#sh-cape", transform: "translate(790 150) scale(.92)" }), [-560, 110], [790, 272, 60, 12]);
  var glovesOnBench = item("gloves", g({}, t("use", { href: "#sh-glove", transform: "translate(646 308) rotate(-8) scale(1 -1)" }) + t("use", { href: "#sh-glove", transform: "translate(692 308) rotate(8) scale(-1 -1)" })), [-450, 100], [668, 345, 50, 8]);
  var gogglesOnBench = item("goggles", t("use", { href: "#sh-goggles", transform: "translate(756 324) scale(.9)" }), [-540, -10], [756, 345, 40, 7]);
  var helmetOnBench = item("helmet", t("use", { href: "#sh-helmet", transform: "translate(826 298) scale(.78)" }), [-606, -70], [826, 346, 50, 8]);
  var screenOnBench = item("screen", g({ transform: "translate(912 268) rotate(8)" }, t("use", { href: "#sh-screen", transform: "scale(.82)" })), [-690, -40], [912, 346, 34, 7]);
  var bootsOnFloor = item("boots", t("use", { href: "#sh-boot", transform: "translate(660 560) scale(.95)" }) + t("use", { href: "#sh-boot", transform: "translate(722 560) scale(.95)" }), [-450, 24], [691, 574, 74, 10]);
  var bench =
    ell(780, 524, 210, 18, "#14110f", { opacity: ".7" }) +
    rect(610, 386, 340, 18, "#3b4046", 3) + rect(620, 404, 22, 116, "#2f3338", 2) + rect(918, 404, 22, 116, "#2f3338", 2) + rect(642, 470, 276, 10, "#2f3338", 2) +
    rect(596, 340, 368, 26, "#6c6458", 4) + rect(596, 340, 368, 7, "#8a8274", 3, { stroke: "none" }) + rect(606, 366, 348, 20, "#4c473f", 2);
  var plate = g({ "data-part": "plate", style: "opacity:0;transition:opacity .5s" },
    path("M668 340L772 340L782 352L658 352Z", "#7f8892", { "stroke-width": 2 }) +
    path("M690 346Q720 340 750 346Q720 352 690 346Z", "#d1a35a", { "stroke-width": 1.5 }) +
    g({ "data-slag": "" }, path("M692 345Q720 339 748 345Q720 349 692 345Z", "#5a4838", { stroke: "none" })));
  var hammer = g({ "data-part": "hammer", style: "opacity:0;transition:opacity .4s" },
    g({ transform: "translate(724 296) rotate(-16)" }, rect(-4, -4, 9, 62, "#8a5a2c", 3) + rect(-24, -22, 48, 18, "#59606a", 3) + rect(-24, -22, 12, 18, "#79828c", 3)));
  var chips = g({ "data-part": "chips", style: "opacity:0" },
    [[700, 332, -26, -50], [716, 330, 4, -64], [734, 332, 34, -44], [708, 334, -8, -38], [726, 334, 14, -30]].map(function (p) { return rect(p[0] - 7, p[1] - 5, 26, 17, "#e3b45e", 1, { "data-chip": "", style: "--cx:" + Math.round(p[2] * 1.7) + "px;--cy:" + Math.round(p[3] * 1.5) + "px", "stroke-width": 2 }); }).join(""));

  /* ---------- Mallesh ---------- */
  function limb(x1, y1, x2, y2, w, col) { return line(x1, y1, x2, y2, OUT, w + 4) + line(x1, y1, x2, y2, col, w); }
  var mallesh = g({ "data-fig": "mallesh", style: "transition:transform 1s cubic-bezier(.4,0,.2,1)" },
    ell(220, 584, 78, 10, "#14110f", { opacity: ".7" }) +
    // legs and plain slippers
    path("M184 424L224 424L220 568L190 568Z", C.pants) + path("M222 424L262 424L252 568L224 568Z", C.pants) +
    line(222, 430, 222, 566, C.pantsD, 2) +
    g({ "data-base": "feet" }, path("M180 568L222 568L226 584L178 584Z", "#7a5a3a") + path("M228 568L258 568L270 584L226 584Z", "#7a5a3a")) +
    // boots (worn)
    g({ "data-worn": "boots", class: "gear", style: "--dx:470px;--dy:-30px" }, t("use", { href: "#sh-boot", transform: "translate(205 578)" }) + t("use", { href: "#sh-boot", transform: "translate(240 578)" })) +
    // arms (short mustard sleeves, bare forearms), hands
    limb(172, 298, 150, 410, 24, C.skin) + limb(268, 298, 290, 410, 24, C.skin) +
    limb(172, 298, 163, 348, 30, C.shirt) + limb(268, 298, 277, 348, 30, C.shirt) +
    circ(150, 418, 14, C.skin) + circ(290, 418, 14, C.skin) +
    // torso and shirt
    path("M164 296Q176 282 202 278L238 278Q264 282 276 296L266 436L174 436Z", C.shirt) +
    path("M202 278L220 300L238 278Z", C.shirtD) + line(220, 300, 220, 436, C.shirtD, 2) +
    rect(172, 424, 96, 14, "#3a2a1a", 3) + rect(256, 424, 24, 28, "#9a8f6a", 3) +
    // neck and head
    rect(208, 258, 24, 26, C.skinD) +
    ell(220, 226, 33, 38, C.skin, { stroke: OUT, "stroke-width": 2 }) + ell(187, 230, 6, 10, C.skin, { stroke: OUT, "stroke-width": 2 }) + ell(253, 230, 6, 10, C.skin, { stroke: OUT, "stroke-width": 2 }) +
    path("M188 218Q184 190 206 186Q214 176 226 184Q246 178 254 200Q258 214 252 220Q246 202 232 204Q214 198 196 206Z", C.hair) +
    [[196, 192], [210, 184], [226, 183], [242, 190], [252, 204], [190, 206]].map(function (p) { return circ(p[0], p[1], 9, C.hair, { stroke: "none" }); }).join("") +
    g({ "data-face": "" }, circ(209, 228, 2.6, OUT, { stroke: "none" }) + circ(231, 228, 2.6, OUT, { stroke: "none" }) +
      line(203, 220, 214, 219, OUT, 2) + line(226, 219, 237, 220, OUT, 2) + path("M212 246Q220 252 228 246", "none", { "stroke-width": 2 })) +
    // cape over the shoulders and sleeves, apron over the cape
    g({ "data-worn": "cape", class: "gear", style: "--dx:570px;--dy:-100px" }, t("use", { href: "#sh-cape", transform: "translate(220 280)" })) +
    g({ "data-worn": "apron", class: "gear", style: "--dx:440px;--dy:-120px" }, t("use", { href: "#sh-apron", transform: "translate(220 276) scale(1.02 1.1)" })) +
    g({ "data-worn": "gloves", class: "gear", style: "--dx:460px;--dy:-100px" }, t("use", { href: "#sh-glove", transform: "translate(150 410) rotate(7)" }) + t("use", { href: "#sh-glove", transform: "translate(290 410) rotate(-7) scale(-1 1)" })) +
    // plain goggles
    g({ "data-worn": "goggles", class: "gear", style: "--dx:540px;--dy:90px" }, t("use", { href: "#sh-goggles", transform: "translate(220 227) scale(.96)" })) +
    // helmet: down over the face, or lifted up on the head
    g({ "data-worn": "helmet", class: "gear", style: "--dx:600px;--dy:70px" },
      g({ "data-helm": "down", style: "transition:transform .5s cubic-bezier(.3,1.2,.5,1)" },
        t("use", { href: "#sh-helmet", transform: "translate(220 228) scale(.92)" }) +
        g({ "data-lens-wrap": "", transform: "translate(220 228) scale(.92)" },
          g({ "clip-path": "url(#winclip)" },
            rect(-30, -13, 60, 34, "#14101f", 0, { stroke: "none" }) +
            g({ "data-lens": "ok", class: "lens" }, circ(0, 4, 22, "url(#arcglow)", { stroke: "none", opacity: ".85" }) + circ(0, 4, 4.5, "#fffbe0", { stroke: "none" }) + line(-12, 12, -5, 7, "#ffcf6a", 1.4) + line(12, 10, 6, 6, "#ffcf6a", 1.4) + line(0, -8, 0, -1, "#ffcf6a", 1.4) + rect(-14, 14, 28, 3, "#3a3350", 1, { stroke: "none" })) +
            g({ "data-lens": "dark", class: "lens" }, rect(-30, -13, 60, 34, "#05040a", 0, { stroke: "none" }) + circ(0, 4, 2, "#2a2538", { stroke: "none" })) +
            g({ "data-lens": "glare", class: "lens" }, rect(-30, -13, 60, 34, "#fff7d6", 0, { stroke: "none" }) + circ(0, 4, 40, "url(#arcglow)", { stroke: "none" }) + [0, 30, 60, 90, 120, 150].map(function (a) { return line(-44, 4, 44, 4, "#ff9a4a", 1.6, { transform: "rotate(" + a + " 0 4)", opacity: ".55" }); }).join("") + circ(0, 4, 9, "#ffffff", { stroke: "none" })))))) +
    // hand screen held in one hand in front of the face
    g({ "data-worn": "screen", class: "gear", style: "--dx:690px;--dy:60px" }, g({ transform: "translate(292 300) rotate(-8)" }, t("use", { href: "#sh-screen" }) + circ(-24, 52, 12, C.skin))));

  /* ---------- the trainee (steps 7-8): a plain figure, no one from the story ---------- */
  var trainee = g({ "data-part": "trainee", style: "opacity:0;transition:opacity .6s" },
    ell(900, 548, 56, 8, "#14110f", { opacity: ".7" }) +
    path("M878 372L896 372L894 540L880 540Z", "#3d3a37") + path("M898 372L916 372L920 540L900 540Z", "#3d3a37") +
    path("M868 276Q880 262 898 258L912 258Q928 262 938 276L930 384L876 384Z", "#5f7f9a") +
    limb(874, 288, 866, 366, 20, "#5f7f9a") + limb(932, 288, 940, 366, 20, "#5f7f9a") + circ(866, 372, 11, C.skin) + circ(940, 372, 11, C.skin) +
    rect(895, 238, 18, 26, C.skinD) + ell(904, 214, 26, 30, "#b4724a", { stroke: OUT, "stroke-width": 2 }) +
    path("M878 206Q878 182 904 180Q930 182 930 206Q918 192 904 194Q890 192 878 206Z", "#241b16") +
    g({ "data-trainee-eyes": "", class: "squint" }, circ(895, 214, 2.4, OUT, { stroke: "none" }) + circ(913, 214, 2.4, OUT, { stroke: "none" })) +
    path("M896 230Q904 234 912 230", "none", { "stroke-width": 2 }) +
    g({ "data-flare": "", style: "opacity:0;transition:opacity .3s" }, ell(895, 214, 9, 6, "#ff5a4a", { opacity: ".55", stroke: "none" }) + ell(913, 214, 9, 6, "#ff5a4a", { opacity: ".55", stroke: "none" })));

  /* ---------- the arc, its rays and the canvas screen ---------- */
  var arc = g({ "data-part": "arc", style: "opacity:0;transition:opacity .35s" },
    circ(718, 332, 54, "url(#arcglow)", { stroke: "none", class: "arcpulse" }) + circ(718, 332, 6, "#ffffff", { stroke: "none" }));
  function rays(set, ends) {
    return g({ "data-rays": set, style: "opacity:0;transition:opacity .4s" }, ends.map(function (e, i) {
      return t("line", { x1: 722, y1: 330, x2: e[0], y2: e[1], stroke: "#ffd35a", "stroke-width": 3, "stroke-linecap": "round", "stroke-dasharray": "10 8", class: "ray", style: "animation-delay:" + (i * 120) + "ms" });
    }).join(""));
  }
  var raysReach = rays("reach", [[884, 214], [890, 250], [884, 290], [876, 330]]);
  var raysBlocked = rays("blocked", [[820, 250], [822, 290], [820, 330], [818, 220]]);
  var canvasScreen = g({ "data-part": "canvas", style: "opacity:0;transition:opacity .6s, transform .6s;transform:translateY(-20px)" },
    rect(808, 220, 8, 280, "#2a2420", 2) + rect(858, 220, 8, 280, "#2a2420", 2) + rect(786, 492, 100, 12, "#2a2420", 3) +
    rect(816, 224, 42, 230, C.canvas, 3) + line(837, 228, 837, 450, C.canvasD, 2) + line(816, 300, 858, 300, C.canvasD, 1.5) + line(816, 380, 858, 380, C.canvasD, 1.5));

  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" class="weld-svg" viewBox="0 0 1000 640" role="img" aria-label="A welding bench with a leather apron, cape, gloves, helmet, hand screen and goggles, safety boots on the floor, a current dial and three filter glasses, and Mallesh, who puts the gear on.">' +
    defs + g({ class: "layer-room" }, room) + g({ "data-part": "station", style: "transition:opacity .5s" }, dial + rack) + hooks +
    mallesh +
    g({ class: "layer-bench" }, bench + apronOnWall + capeOnWall + glovesOnBench + gogglesOnBench + helmetOnBench + screenOnBench + plate + hammer + chips + bootsOnFloor) +
    canvasScreen + trainee + raysReach + raysBlocked + arc + "</svg>";

  window.FIG_DATA = {
    views: {
      all: [0, 40, 1000, 600], bench: [560, 60, 440, 390], benchfloor: [540, 70, 460, 540], boots: [540, 240, 380, 360], mallesh: [60, 140, 340, 480],
      shade: [120, 60, 540, 300], helm: [140, 100, 420, 260], plate: [430, 120, 460, 360], arc: [440, 110, 560, 440],
    },
    anchors: {
      apron: [660, 96], cape: [790, 96], gloves: [668, 326], goggles: [756, 322], helmet: [826, 296], screen: [912, 270], boots: [691, 540],
      dial: [380, 150], p9: [500, 226], p11: [560, 226], p13: [620, 226], plate: [720, 336], arc: [718, 332], trainee: [904, 214], canvas: [837, 330],
    },
  };
  window.FIG_SVG = svg;
})();
