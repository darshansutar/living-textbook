/* The PPE station of the welding lab, drawn in code (no pictures, no text or digits inside the drawing): a small isometric
   station on a plinth in the Starling "anatomy" language. Charcoal / steel base, leather as the only warm material, glass
   with a restrained green tint (the shade difference IS the lesson). NO PEOPLE are drawn: the gear that used to be put on a
   figure now travels from the bench to its own place on a KIT MAT, and each place lights soft green when it is filled.
   Gives the workbench player window.FIG_DATA (views and anchors) and window.FIG_SVG (the scene). Same hooks as before:
   data-hit / data-item / data-worn / data-plate / data-lens / data-needle / data-rays / data-slag / data-flare / data-helm
   and the parts arc, canvas, chips, dial, hammer, plate, station, spot (was: trainee), rest, kit. */
(function () {
  "use strict";
  var S = 46, K = 0.866 * S, HH = 0.5 * S, ZZ = S, OX = 400, OY = 70;
  function P(x, y, z) { return [OX + (x - y) * K, OY + (x + y) * HH - (z || 0) * ZZ]; }
  function f(n) { return n.toFixed(1); }
  function pts(a) { return a.map(function (p) { return f(p[0]) + "," + f(p[1]); }).join(" "); }
  function poly(cls, a, extra) { return '<polygon class="' + cls + '" points="' + pts(a) + '"' + (extra || "") + "/>"; }
  function box(x, y, z, w, d, h, mat, attrs) {
    var top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    var left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    var right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
    return '<g class="solid m-' + mat + '"' + (attrs || "") + ">" + poly("f l", left) + poly("f r", right) + poly("f t", top) + "</g>";
  }
  function line(a, cls) { return '<polyline class="iso-line ' + (cls || "") + '" points="' + pts(a) + '" fill="none"/>'; }
  function halo(x, y, w, d) { return '<polygon class="iso-halo" points="' + pts([P(x - .1, y - .1, 0), P(x + w + .2, y - .1, 0), P(x + w + .2, y + d + .2, 0), P(x - .1, y + d + .2, 0)]) + '"/>'; }
  function ell(cx, cy, rx, ry, z, n) { var a = [], i; n = n || 24; for (i = 0; i < n; i++) { var t = i / n * Math.PI * 2; a.push(P(cx + rx * Math.cos(t), cy + ry * Math.sin(t), z)); } return a; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // a flat object lying on a horizontal plane (u, v in units) / hanging on a wall face y = c (x, z in units)
  function onTop(x, y, z) { var o = P(x, y, z); return "matrix(" + f(K) + "," + f(HH) + "," + f(-K) + "," + f(HH) + "," + f(o[0]) + "," + f(o[1]) + ")"; }
  function onWallY(x, y, z) { var o = P(x, y, z); return "matrix(" + f(K) + "," + f(HH) + ",0," + f(-ZZ) + "," + f(o[0]) + "," + f(o[1]) + ")"; }
  function onWallX(x, y, z) { var o = P(x, y, z); return "matrix(" + f(K) + "," + f(-HH) + ",0," + f(-ZZ) + "," + f(o[0]) + "," + f(o[1]) + ")"; }

  /* ---------- where things are (units on the plinth: x runs right-down, y runs left-down, z up) ---------- */
  var PW = 10.8, PD = 5.4;
  var BENCH = { x: 0.5, y: 0.4, w: 4.4, d: 2.0, top: 1.5 };
  var ITEMP = { apron: [1.25, 1.0], cape: [2.5, 1.0], helmet: [3.75, 0.95], gloves: [1.25, 1.8], goggles: [2.5, 1.8], screen: [3.75, 1.8] }, IS = 0.9;   // bench positions (x, y) and the scale of flat items
  var STAND = { x: 6.0, y: 0.4, w: 3.8, d: 0.35, h: 3.8 };
  var TABLE = { x: 6.0, y: 2.8, w: 3.4, d: 1.2, top: 1.1 };
  var ARC = P(6.7, 3.4, 1.28);
  var CANVAS_X = 5.5;
  var BOOTC = P(4.6, 2.95, 0);                                   // the safety boots lie on the floor in front of the bench
  var MAT = { x: 0.6, y: 3.0, w: 3.4, d: 2.2 };                  // the kit mat: one marked place for each piece of gear
  var SL = { apron: [1.3, 3.65], cape: [2.25, 3.65], gloves: [3.2, 3.65], boots: [1.3, 4.6], helmet: [2.25, 4.6], screen: [3.2, 4.6] };
  var GSL = [TABLE.x + 0.95, TABLE.y + 1.07];                     // the goggles' place, at the weld table
  var SPOT = [4.6, 4.5];                                          // the marked standing spot near the arc (step 8)
  var HB = P(TABLE.x + 3.05, TABLE.y + 0.2, TABLE.top);          // electrode-holder stand on the table

  function IP(n) { return P(ITEMP[n][0], ITEMP[n][1], BENCH.top); }
  var A = {
    apron: IP("apron"), cape: IP("cape"), gloves: IP("gloves"),
    goggles: IP("goggles"), helmet: [IP("helmet")[0], IP("helmet")[1] - 10], screen: [IP("screen")[0], IP("screen")[1] - 12],
    boots: [BOOTC[0], BOOTC[1] - 22], dial: P(STAND.x + 1.05, STAND.y + STAND.d, 3.05),
    p9: P(STAND.x + 1.75, STAND.y + STAND.d, 1.45), p11: P(STAND.x + 2.85, STAND.y + STAND.d, 1.45), p13: P(STAND.x + 3.95, STAND.y + STAND.d, 1.45),
    plate: P(7.6, 3.4, 1.25), arc: ARC, canvas: P(CANVAS_X, 3.4, 1.9), spot: P(SPOT[0], SPOT[1], 0)
  };
  // where each piece lies, and where its place is: the worn copy flies the difference
  var LY = { apron: IP("apron"), cape: IP("cape"), gloves: IP("gloves"), goggles: IP("goggles"), helmet: IP("helmet"), screen: IP("screen"), boots: BOOTC };
  var SLP = {
    apron: P(SL.apron[0], SL.apron[1], .03), cape: P(SL.cape[0], SL.cape[1], .03), gloves: P(SL.gloves[0], SL.gloves[1], .03),
    boots: P(SL.boots[0], SL.boots[1], 0), helmet: P(SL.helmet[0], SL.helmet[1], 0), screen: P(SL.screen[0], SL.screen[1], 0),
    goggles: P(GSL[0], GSL[1], TABLE.top + .02)
  };
  function dxy(n) { return [Math.round(LY[n][0] - SLP[n][0]), Math.round(LY[n][1] - SLP[n][1])]; }

  /* views [x, y, w, h] in the 1000 x 640 drawing space; the player fits them into the free part of the screen */
  function V(arr, pad) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    arr.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return [Math.round(x0 - pad), Math.round(y0 - pad), Math.round(x1 - x0 + 2 * pad), Math.round(y1 - y0 + 2 * pad)];
  }
  var HP = SLP.helmet;
  var VIEWS = {
    all: V([P(0, PD, 0), P(PW, 0, 0), P(PW, PD, -.5), P(0, 0, 0), P(STAND.x + 2, 0.4, 4.2)], 40),
    bench: V([P(BENCH.x + .2, BENCH.y + .3, BENCH.top + 1.0), P(BENCH.x + BENCH.w - .2, BENCH.y + BENCH.d, BENCH.top - .2), P(MAT.x + 1.2, MAT.y + .3, 0)], 20),
    benchfloor: V([P(BENCH.x - .2, BENCH.y, 2.6), P(BENCH.x + BENCH.w + .2, 4.4, 0)], 30),
    boots: V([P(MAT.x - .1, MAT.y + MAT.d + .1, 0), P(MAT.x + MAT.w + .1, MAT.y - .1, .9), [BOOTC[0] + 44, BOOTC[1] + 8], [BOOTC[0] - 20, BOOTC[1] - 50]], 18),
    mallesh: V([P(MAT.x - .2, MAT.y + MAT.d + .2, 0), P(MAT.x + MAT.w + .2, MAT.y - .2, 0), P(MAT.x, MAT.y, 1.5)], 14),   // name kept for lesson.js: it frames the kit mat
    shade: V([P(STAND.x - .1, STAND.y, 4.0), P(STAND.x + STAND.w + .1, STAND.y + STAND.d + .5, 0)], 14),
    helm: V([[HP[0] - 40, HP[1] - 66], [HP[0] + 40, HP[1] + 10]], 12),
    plate: V([P(TABLE.x - .2, TABLE.y, TABLE.top + 1.8), P(TABLE.x + TABLE.w + .2, TABLE.y + TABLE.d + .1, 0)], 22),
    arc: V([P(CANVAS_X - 1.8, 2.2, 2.9), P(TABLE.x + TABLE.w + .1, TABLE.y + TABLE.d + .4, 0), P(SPOT[0] - .9, SPOT[1] + .8, 0), P(SPOT[0] + .5, SPOT[1] - .9, 1.2)], 18)
  };
  var ANCH = {};
  Object.keys(A).forEach(function (k) { ANCH[k] = [Math.round(A[k][0] * 10) / 10, Math.round(A[k][1] * 10) / 10]; });
  window.FIG_DATA = { views: VIEWS, anchors: ANCH };

  /* ---------- materials: leather, glass, steel ---------- */
  function lth(d, g, cls) { return '<path class="lth ' + (cls || "") + '" d="' + d + '" fill="url(#' + (g || "lthA") + ')"/><path d="' + d + '" fill="#000" filter="url(#grain)" opacity=".34"/>'; }
  function stitch(d) { return '<path class="stitch" d="' + d + '"/>'; }
  function crease(d) { return '<path class="crease" d="' + d + '"/>'; }
  function sheen(d, w) { return '<path class="sheen" d="' + d + '" style="stroke-width:' + (w || 1.3) + 'px"/>'; }

  /* ---------- standing pieces (drawn in screen space, feet at 0,0) ---------- */
  var G = {};
  G.boots = function () {
    function boot(sg) {
      function X(x) { return (sg * x).toFixed(1); }
      var d = "M" + X(-11.8) + ",-27 Q" + X(-12.6) + ",-18 " + X(-11.6) + ",-12 Q" + X(-14.6) + ",-10 " + X(-16) + ",-5 Q" + X(-17) + ",-1.2 " + X(-13.4) + ",-1.2 L" + X(-2) + ",-1.2 Q" + X(-0.8) + ",-5 " + X(-1.6) + ",-11 Q" + X(-1.8) + ",-19 " + X(-2) + ",-27 Q" + X(-6.9) + ",-28.4 " + X(-11.8) + ",-27Z";
      var cx = -6.9;
      return lth(d, "lthD") +
        '<path class="sole" d="M' + X(-17.4) + ",-1.6 L" + X(-2) + ",-1.6 L" + X(-1.8) + ",1 L" + X(-17.2) + ',1Z"/>' +
        '<path class="toecap" d="M' + X(-16.2) + ",-5.4 Q" + X(-14.6) + ",-10 " + X(-11.6) + ",-11.6 Q" + X(-8) + ",-8 " + X(-8.4) + ",-1.6 L" + X(-13.4) + ",-1.6 Q" + X(-16.6) + ",-1.8 " + X(-16.2) + ',-5.4Z"/>' +
        '<path class="tongue" d="M' + X(-9.5) + ",-27.6 L" + X(-4.5) + ",-27.6 L" + X(-5) + ",-16 L" + X(-9) + ',-16Z"/>' +
        '<path class="lace" d="M' + X(cx - 3.2) + ",-24 L" + X(cx + 3.2) + ",-22.4 M" + X(cx - 3.2) + ",-20 L" + X(cx + 3.2) + ",-18.4 M" + X(cx - 3) + ",-16 L" + X(cx + 3) + ',-14.6"/>' +
        sheen("M" + X(-11) + ",-25 Q" + X(-11.6) + ",-16 " + X(-10.6) + ",-12.6", 1.3) + sheen("M" + X(-15) + ",-6 Q" + X(-13.4) + ",-9 " + X(-11.8) + ",-10", 1.2) + stitch("M" + X(-12) + ",-3.6 Q" + X(-7) + ",-2.4 " + X(-2.4) + ",-3.8");
    }
    return boot(1) + boot(-1);
  };
  // helmet in head-centred coordinates (origin = head centre); the window holds the lens views
  function helmetCore() {
    var shell = "M-13.6,3 Q-15.5,-17 0,-19.5 Q15.5,-17 13.6,3 L12.6,13 Q0,17 -12.6,13Z";
    return '<path class="shell" d="' + shell + '" fill="url(#steelH)"/><path d="' + shell + '" fill="#000" filter="url(#grain)" opacity=".25"/>' +
      '<path class="shellrim" d="M-13,-7 Q0,-13 13,-7"/><path class="shellrim lo" d="M-12.5,10 Q0,14.5 12.5,10"/>' +
      '<path class="shellshine" d="M-11,-12 Q-12.5,-2 -10.5,7"/><path class="shellshine s2" d="M-5,-17 Q-1,-18 3,-17.6"/>' +
      '<rect class="winframe" x="-10" y="-4.4" width="20" height="12" rx="2.4"/>' +
      '<g clip-path="url(#lensclip)"><rect class="lensglass" x="-8.4" y="-3" width="16.8" height="9.2" rx="1.6"/><g data-lens-wrap="">' +
      '<g class="lens" data-lens="ok"><rect x="-8.4" y="-3" width="16.8" height="9.2" fill="#10261a"/><circle cx="0.5" cy="1.8" r="5.6" fill="url(#lensGlowOk)"/><circle cx="0.5" cy="1.8" r="1.1" fill="#f2fff5"/></g>' +
      '<g class="lens" data-lens="dark"><rect x="-8.4" y="-3" width="16.8" height="9.2" fill="#020403"/><circle cx="0.5" cy="1.8" r="1" fill="#2a3b30" opacity=".5"/></g>' +
      '<g class="lens" data-lens="glare"><rect x="-8.4" y="-3" width="16.8" height="9.2" fill="#f4ffe8"/><circle cx="0.5" cy="1.8" r="9" fill="url(#lensGlowHot)"/><circle cx="0.5" cy="1.8" r="2.4" fill="#fff"/></g></g>' +
      '<path class="lensshine" d="M-7,5.6 L-2.4,-3 L0.4,-3 L-4,5.6Z"/></g>' +
      '<circle class="bolt" cx="-13.2" cy="-1.5" r="1.7"/><circle class="bolt" cx="13.2" cy="-1.5" r="1.7"/>';
  }
  function screenCore() {
    return '<path class="paddle" d="M-9.5,-14 L10.5,-14 L12,8 L-11,8Z" fill="url(#fibre)"/>' +
      '<path class="paddle-edge" d="M-9.5,-14 L10.5,-14 L12,8 L-11,8Z"/>' +
      '<g clip-path="url(#scrclip)"><rect class="lensglass" x="-7" y="-10" width="15" height="12"/><path class="lensshine" d="M-5,2 L-0.4,-10 L2.6,-10 L-2,2Z"/></g>' +
      '<rect class="winframe" x="-7.6" y="-10.6" width="16.2" height="13.2" rx="1.4"/>' +
      '<circle class="bolt" cx="-9" cy="6" r="1.1"/><circle class="bolt" cx="10" cy="6" r="1.1"/>';
  }

  /* ---------- items lying on the bench (flat, in the bench plane) and on the floor ---------- */
  function pad(cx, cy, rx, ry) { return '<ellipse class="pad" cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function item(id, inner, padc) {
    return '<g class="obj item" data-obj="item-' + id + '" data-item="' + id + '" data-hit="' + id + '">' + inner + pad(padc[0], padc[1], padc[2], padc[3]) + "</g>";
  }
  // the four flat pieces: p = [x, y, z] of where they lie, sc = scale
  function apronFlat(p, sc) {
    return '<g transform="' + onTop(p[0], p[1], p[2]) + ' scale(' + (sc || IS) + ')' + '">' +
      '<path class="strap" d="M-.12,-.46 Q-.16,-.62 -.1,-.7 M.12,-.46 Q.16,-.62 .1,-.7"/>' +
      lth("M-.3,-.46 L.3,-.46 Q.33,-.1 .37,.1 L.34,.46 Q0,.5 -.34,.46 L-.37,.1 Q-.33,-.1 -.3,-.46Z", "lthA") +
      crease("M-.12,-.3 Q-.08,-.12 -.1,.02 M.14,-.34 Q.1,-.14 .12,0 M-.16,.22 Q0,.28 .16,.22") + stitch("M-.26,-.42 Q-.3,-.1 -.33,.1 L-.3,.42 M.26,-.42 Q.3,-.1 .33,.1 L.3,.42") +
      '<rect class="pocket" x="-.17" y=".05" width=".34" height=".24" rx=".02"/>' + sheen("M-.22,-.4 Q-.27,-.1 -.28,.2", 1.4) + "</g>";
  }
  function capeFlat(p, sc) {
    return '<g transform="' + onTop(p[0], p[1], p[2]) + ' scale(' + (sc || IS) + ')' + '">' +
      lth("M-.46,-.12 L-.66,.42 L-.5,.47 L-.3,.02Z", "lthB") + lth("M.46,-.12 L.66,.42 L.5,.47 L.3,.02Z", "lthB") +
      lth("M-.46,-.12 L-.28,-.34 Q0,-.42 .28,-.34 L.46,-.12 Q.4,.02 0,-.02 Q-.4,.02 -.46,-.12Z", "lthA") +
      stitch("M-.4,-.1 Q0,-.12 .4,-.1") + crease("M-.56,.12 L-.5,.3 M.56,.12 L.5,.3") + sheen("M-.3,-.3 Q-.1,-.36 .12,-.35", 1.4) + "</g>";
  }
  function glovesFlat(p, sc) {
    function gl(v, s) {
      var g = "";
      [-.075, -.025, .025, .075].forEach(function (u, i) { var len = [.17, .2, .19, .15][i]; g += lth("M" + (u - .021) + ",-.07 L" + (u - .021) + "," + (-.07 - len) + " Q" + u + "," + (-.1 - len) + " " + (u + .021) + "," + (-.07 - len) + " L" + (u + .021) + ",-.07Z", "lthC"); });
      return '<g transform="translate(' + v + ',0) scale(' + s + ',1)">' + g + lth("M-.1,-.09 L.1,-.09 L.1,.1 Q0,.14 -.1,.1Z", "lthC") + lth("M.09,.02 L.2,-.08 Q.23,-.05 .2,0 L.09,.1Z", "lthC") + lth("M-.11,.1 L.11,.1 L.12,.27 L-.12,.27Z", "lthB") +
        stitch("M-.06,-.07 L-.06,.07") + "</g>";
    }
    return '<g transform="' + onTop(p[0], p[1], p[2]) + ' scale(' + (sc || IS) + ')' + '">' + gl(-.2, 1) + gl(.2, -1) + "</g>";
  }
  function gogglesFlat(p, sc) {
    return '<g transform="' + onTop(p[0], p[1], p[2]) + ' scale(' + (sc || IS) + ')' + '"><path class="gstrap" d="M-.2,-.04 Q-.5,-.22 -.46,.14 Q-.4,.4 -.2,.2 M.2,-.04 Q.5,-.22 .46,.14 Q.4,.4 .2,.2" style="stroke-width:1.6px"/>' +
      '<circle cx="-.13" cy="0" r=".1" class="gframe"/><circle cx=".13" cy="0" r=".1" class="gframe"/><circle cx="-.13" cy="0" r=".075" class="gclear"/><circle cx=".13" cy="0" r=".075" class="gclear"/><path class="gbridge" d="M-.04,0 Q0,-.03 .04,0"/></g>';
  }
  function standing(o, inner, sc, rot) { return '<g transform="translate(' + f(o[0]) + "," + f(o[1]) + ") rotate(" + (rot || 0) + ") scale(" + sc + ')">' + inner + "</g>"; }
  var shadowE = function (o, rx) { return '<ellipse class="contact" cx="' + f(o[0]) + '" cy="' + f(o[1] + 1) + '" rx="' + rx + '" ry="' + f(rx * .45) + '"/>'; };
  var HANDLE_SCREEN = function () { return '<path class="handle" d="M2,11 L4,30"/>' + screenCore(); };

  function benchGroup() {
    var b = BENCH, s = "";
    s += halo(b.x, b.y, b.w, b.d + .3);
    // legs, lower shelf, top
    [[b.x + .12, b.y + .12], [b.x + b.w - .27, b.y + .12], [b.x + .12, b.y + b.d - .27], [b.x + b.w - .27, b.y + b.d - .27]].forEach(function (p) { s += box(p[0], p[1], 0, .15, .15, b.top - .15, "steel-dk"); });
    s += box(b.x + .1, b.y + .1, .35, b.w - .2, b.d - .2, .07, "steel-dk");
    s += box(b.x, b.y, b.top - .15, b.w, b.d, .15, "steel");
    return '<g class="obj bench" data-obj="bench">' + s + "</g>";
  }
  function items() {
    var s = "", o, h = IP("helmet"), sc = IP("screen"), bz = BENCH.top;
    o = A.apron; s += item("apron", apronFlat([ITEMP.apron[0], ITEMP.apron[1], bz]), [o[0], o[1] - 2, 38, 22]);
    o = A.cape; s += item("cape", capeFlat([ITEMP.cape[0], ITEMP.cape[1], bz]), [o[0], o[1] - 2, 42, 22]);
    s += item("helmet", shadowE(h, 18) + standing([h[0], h[1] - 15], helmetCore(), 1.05), [h[0], h[1] - 14, 24, 28]);
    o = A.gloves; s += item("gloves", glovesFlat([ITEMP.gloves[0], ITEMP.gloves[1], bz]), [o[0], o[1] - 2, 36, 20]);
    o = A.goggles; s += item("goggles", gogglesFlat([ITEMP.goggles[0], ITEMP.goggles[1], bz]), [o[0], o[1] - 2, 32, 18]);
    s += item("screen", shadowE(sc, 14) + standing([sc[0], sc[1] - 16], '<path class="handle" d="M2,11 L4,30"/>' + screenCore(), 1.0, -6), [sc[0], sc[1] - 14, 22, 28]);
    return s;
  }

  function bootsGroup() {
    return '<g class="obj item" data-obj="boots" data-item="boots" data-hit="boots">' +
      halo(4.0, 2.55, 1.2, .8) + '<ellipse class="contact" cx="' + f(BOOTC[0]) + '" cy="' + f(BOOTC[1] + 1) + '" rx="30" ry="9"/>' +
      standing(BOOTC, G.boots(), 1.45) + pad(BOOTC[0], BOOTC[1] - 20, 40, 30) + "</g>";
  }

  /* ---------- the kit mat: a marked place for each piece; the worn copy flies in from where the piece lay ---------- */
  function slotShape(n) {
    var gg = n === "goggles";
    var p = gg ? [GSL[0], GSL[1], TABLE.top + .015] : [SL[n][0], SL[n][1], .02];
    var flat = n === "apron" || n === "cape" || n === "gloves" || gg;
    var sh = flat
      ? '<rect class="sl-line" x="' + (gg ? -.3 : -.4) + '" y="' + (gg ? -.16 : -.36) + '" width="' + (gg ? .6 : .8) + '" height="' + (gg ? .32 : .72) + '" rx=".08"/>'
      : '<ellipse class="sl-line" cx="0" cy="0" rx=".44" ry=".36"/>';
    var c = P(p[0], p[1], p[2]);
    return '<g class="slot" data-slot="' + n + '"><g transform="' + onTop(p[0], p[1], p[2]) + '">' + sh + '</g><ellipse class="sl-glow" cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" rx="' + (gg ? 34 : 52) + '" ry="' + (gg ? 16 : 26) + '" fill="url(#slotGlow)"/></g>';
  }
  function W(n, inner) { var d = dxy(n); return '<g class="gear" data-worn="' + n + '" style="--dx:' + d[0] + "px;--dy:" + d[1] + 'px">' + inner + "</g>"; }
  function wornCopy(n) {
    var p = SLP[n];
    switch (n) {
      case "apron": return W(n, apronFlat([SL.apron[0], SL.apron[1], .03]));
      case "cape": return W(n, capeFlat([SL.cape[0], SL.cape[1], .03]));
      case "gloves": return W(n, glovesFlat([SL.gloves[0], SL.gloves[1], .03]));
      case "goggles": return W(n, gogglesFlat([GSL[0], GSL[1], TABLE.top + .03], .55));
      case "boots": return W(n, shadowE(p, 24) + standing(p, G.boots(), 1.1));
      case "helmet": return '<g data-helm="down">' + W(n, shadowE(p, 22) + standing([p[0], p[1] - 20], helmetCore(), 1.2)) + "</g>";
      case "screen": return W(n, shadowE(p, 20) + standing([p[0], p[1] - 22], HANDLE_SCREEN(), 1.15, -6));
    }
    return "";
  }
  function kit() {
    var m = MAT, q = [P(m.x, m.y, .01), P(m.x + m.w, m.y, .01), P(m.x + m.w, m.y + m.d, .01), P(m.x, m.y + m.d, .01)];
    var s = halo(m.x, m.y, m.w, m.d) + poly("mat", q) + line([q[0], q[1], q[2], q[3], q[0]], "mat-edge");
    ["apron", "cape", "gloves", "boots", "helmet", "screen"].forEach(function (n) { s += slotShape(n); });
    ["boots", "cape", "apron", "gloves", "helmet", "screen"].forEach(function (n) { s += wornCopy(n); });
    return '<g class="obj kit" data-obj="kit" data-part="kit">' + s + "</g>";
  }
  function tableGoggles() {   // the goggles' place and the worn goggles, on the weld table by the plate
    return '<g class="obj tgoggles" data-obj="tgoggles">' + slotShape("goggles") + wornCopy("goggles") + "</g>";
  }
  function rest() {          // the dark welding glass on a little foot: what step 7's wrong answer puts at the work
    var o = P(TABLE.x + 2.55, TABLE.y + 1.0, TABLE.top);
    return '<g class="obj rest" data-obj="rest" data-part="rest" style="opacity:0;transform:translateY(-10px)">' + shadowE(o, 14) +
      '<g transform="translate(' + f(o[0]) + "," + f(o[1]) + ')"><rect class="pframe" x="-13" y="-42" width="26" height="38" rx="2.4"/><rect class="pglass" x="-11" y="-40" width="22" height="34" rx="1.4" fill="url(#p13Fill)"/>' +
      '<path class="pshine" d="M-9,-8 L-3,-40 L1,-40 L-5,-8Z"/><rect class="pedge" x="-11" y="-40" width="22" height="34" rx="1.4"/></g></g>';
  }
  function spot() {          // the marked standing spot near the arc: a ring on the floor, glowing hot when the rays reach it
    var c = P(SPOT[0], SPOT[1], .02);
    return '<g class="obj spot" data-obj="spot" data-part="spot" style="opacity:0">' + halo(SPOT[0] - .6, SPOT[1] - .6, 1.2, 1.2) +
      '<g transform="' + onTop(SPOT[0], SPOT[1], .02) + '"><circle class="spot-ring" r=".58"/><circle class="spot-ring in" r=".34"/><path class="spot-x" d="M-.12,-.12 L.12,.12 M.12,-.12 L-.12,.12"/></g>' +
      '<ellipse data-flare="" class="flare" cx="' + f(c[0]) + '" cy="' + f(c[1] - 6) + '" rx="62" ry="34" fill="url(#flareGrad)" style="opacity:0"/></g>';
  }

  /* ---------- the shade stand: current dial and three filter glasses ---------- */
  function stand() {
    var s = STAND, wy = s.y + s.d, o = "";
    o += halo(s.x, s.y, s.w, s.d + .5);
    o += box(s.x, s.y, 0, s.w, s.d, s.h, "steel-dk");
    // ledge the glasses stand on
    o += box(s.x + .2, s.y + s.d, .78, s.w - .4, .5, .1, "steel");
    // dial: a round gauge on the board face
    var dial = onWallY(STAND.x + 1.05, wy, 3.05);
    o += '<g transform="' + dial + '"><circle class="dial-rim" cx="0" cy="0" r=".66"/><circle class="dial-face" cx="0" cy="0" r=".56"/>';
    for (var i = 0; i <= 12; i++) { var a = (-120 + 240 * i / 12) * Math.PI / 180, r0 = .46, r1 = i % 3 === 0 ? .36 : .41; o += '<path class="tick" d="M' + (Math.sin(a) * r0).toFixed(3) + "," + (-Math.cos(a) * r0).toFixed(3) + " L" + (Math.sin(a) * r1).toFixed(3) + "," + (-Math.cos(a) * r1).toFixed(3) + '"/>'; }
    o += '<path class="dial-arc" d="M-.4,.23 A.46,.46 0 1 1 .4,.23"/>' +
      '<g data-part="dial" class="needlewrap"><g data-needle="" class="needle"><path d="M0,.07 L0,-.44" class="needle-l"/><path d="M-.03,.06 L0,-.43 L.03,.06Z" class="needle-h"/></g></g><circle class="hub" cx="0" cy="0" r=".06"/></g>';
    // three filter glasses
    [["p9", STAND.x + 1.3], ["p11", STAND.x + 2.4], ["p13", STAND.x + 3.5]].forEach(function (g) {
      o += '<g class="plate" data-plate="' + g[0] + '"><g transform="' + onWallY(g[1], wy + .02, .88) + '">' +
        '<rect class="pframe" x="-.04" y="-.04" width=".98" height="1.24" rx=".06"/>' +
        '<rect class="pglass" x=".03" y=".03" width=".84" height="1.1" rx=".03" fill="url(#' + g[0] + 'Fill)"/>' +
        '<path class="pshine" d="M.08,1.1 L.4,.06 L.55,.06 L.2,1.1Z"/><path class="pshine s2" d="M.52,1.1 L.72,.4 L.78,.4 L.6,1.1Z"/>' +
        '<rect class="pedge" x=".03" y=".03" width=".84" height="1.1" rx=".03"/></g></g>';
    });
    return '<g class="obj stand" data-obj="stand">' + o + "</g>";
  }

  /* ---------- the weld table with the plate, slag, hammer, arc, canvas screen ---------- */
  function table() {
    var t = TABLE, o = "";
    o += halo(t.x, t.y, t.w, t.d + .3);
    [[t.x + .1, t.y + .1], [t.x + t.w - .24, t.y + .1], [t.x + .1, t.y + t.d - .24], [t.x + t.w - .24, t.y + t.d - .24]].forEach(function (p) { o += box(p[0], p[1], 0, .14, .14, t.top - .12, "steel-dk"); });
    o += box(t.x, t.y, t.top - .12, t.w, t.d, .12, "steel");
    return '<g class="obj table" data-obj="table">' + o + "</g>";
  }
  function weldPlate() {
    var z = TABLE.top, o = "";
    var pl = box(TABLE.x + .35, TABLE.y + .28, z, 2.7, .66, .1, "plate");
    var bx0 = TABLE.x + .55, bx1 = TABLE.x + 2.85, by = TABLE.y + .61, zb = z + .1;
    // the bead: clean metal ripples, covered by a crust of slag until the helper chips it off
    var cl = [], sl = [], sl2 = [], i, R = rng(5);
    for (i = 0; i <= 14; i++) { var u = i / 14, p = P(bx0 + (bx1 - bx0) * u, by, zb); cl.push(p); sl.push([p[0], p[1] - 3.4 - R() * 2.2]); sl2.push([p[0], p[1] + 1.6 + R() * 2]); }
    var clean = cl.map(function (p, k) { return (k ? "L" : "M") + f(p[0]) + "," + f(p[1]); }).join("");
    var crust = "M" + sl.map(function (p) { return f(p[0]) + "," + f(p[1]); }).join(" L") + " L" + sl2.slice().reverse().map(function (p) { return f(p[0]) + "," + f(p[1]); }).join(" L") + "Z";
    var ripples = "";
    for (i = 1; i < 14; i++) { var q = cl[i]; ripples += "M" + f(q[0] - 1.5) + "," + f(q[1] - 2.2) + " Q" + f(q[0] + .6) + "," + f(q[1] + .2) + " " + f(q[0] - 1.5) + "," + f(q[1] + 2.4); }
    o += pl + '<path class="bead" d="' + clean + '"/><path class="bead-r" d="' + ripples + '"/>' +
      '<path data-slag="" class="slag" d="' + crust + '"/><path data-slag="" class="slag-hi" d="M' + f(sl[2][0]) + "," + f(sl[2][1] + 1) + " L" + f(sl[10][0]) + "," + f(sl[10][1] + 1) + '"/>';
    // hammer and flying chips
    var hc = P(TABLE.x + 1.8, TABLE.y + .6, zb);
    o += '<g data-part="hammer" style="opacity:0"><g transform="translate(' + f(hc[0] + 6) + "," + f(hc[1] - 38) + ')"><path class="hh" d="M0,0 L16,-22"/><path class="hhead" d="M-7,-4 L5,2 L1,10 L-11,4Z"/></g></g>';
    var chips = "", cc = [[-8, -30, -14], [10, -34, 8], [-2, -26, 20], [22, -28, -4], [-18, -18, 6], [14, -20, 24], [4, -36, -22]];
    cc.forEach(function (c, k) { chips += '<g transform="translate(' + f(hc[0] + (k - 3) * 6) + "," + f(hc[1] - 4) + ')"><polygon data-chip="" class="chip" points="0,0 4,-1 3,3 -1,3" style="--cx:' + c[0] * 1.6 + "px;--cy:" + (c[1] + 14) * 1.6 + 'px"/></g>'; });
    o += '<g data-part="chips" style="opacity:0">' + chips + "</g>";
    return '<g class="obj platepart" data-obj="plate" data-part="plate" style="opacity:0">' + o + "</g>";
  }
  function arcPart() {
    var a = ARC, o = "";
    var HT = [HB[0], HB[1] - 80], HE = [a[0] + 46, a[1] - 54];   // holder post top, electrode clamp
    var bolt = "M" + f(a[0]) + "," + f(a[1]) + " l-3,-4 l4,-2 l-3,-5 l4,-3";
    o += '<g data-part="arc" style="opacity:0">' +
      '<ellipse class="contact" cx="' + f(HB[0]) + '" cy="' + f(HB[1] + 1) + '" rx="13" ry="6"/>' +
      '<path class="hold-post" d="M' + f(HB[0]) + "," + f(HB[1]) + " L" + f(HT[0]) + "," + f(HT[1]) + '"/><path class="hold-arm" d="M' + f(HT[0]) + "," + f(HT[1]) + " L" + f(HE[0] + 12) + "," + f(HE[1] - 2) + '"/>' +
      '<path class="hold-clamp" d="M' + f(HE[0] + 12) + "," + f(HE[1] - 2) + " L" + f(HE[0]) + "," + f(HE[1]) + '"/>' +
      '<path class="electrode" d="M' + f(HE[0]) + "," + f(HE[1]) + " L" + f(a[0] + 1) + "," + f(a[1] - 4) + '"/><path class="flux" d="M' + f((HE[0] * 2 + a[0]) / 3) + "," + f((HE[1] * 2 + a[1]) / 3) + " L" + f(a[0] + 1) + "," + f(a[1] - 4) + '"/>' +
      '<g class="arcpulse"><ellipse class="arc-halo" cx="' + f(a[0]) + '" cy="' + f(a[1] - 4) + '" rx="58" ry="40"/><ellipse class="arc-halo2" cx="' + f(a[0]) + '" cy="' + f(a[1] - 4) + '" rx="18" ry="13"/>' +
      '<path class="arc-bolt" d="' + bolt + '"/><circle class="arc-core" cx="' + f(a[0]) + '" cy="' + f(a[1] - 4) + '" r="2.4"/></g>' +
      '<g class="sparks-layer"></g></g>';
    return o;
  }
  function rays() {
    var a = ARC, to0 = P(SPOT[0], SPOT[1], .5), cv = P(CANVAS_X, 3.4, 1.7);
    function ray(to, kind) { return '<g data-rays="' + kind + '" style="opacity:0"><path class="ray" d="M' + f(a[0] - 4) + "," + f(a[1] - 6) + " L" + f(to[0]) + "," + f(to[1]) + '"/></g>'; }
    return ray(to0, "reach") + ray(cv, "blocked");
  }
  function canvasScreen() {
    var x = CANVAS_X, y0 = 2.7, y1 = 4.4, h = 2.55, c = "";
    var pole = function (y) { return box(x - .05, y - .05, 0, .1, .1, h + .1, "steel-dk"); };
    var quad = [P(x, y0, .35), P(x, y1, .35), P(x, y1, h), P(x, y0, h)];
    c += halo(x - .3, y0 - .1, .6, y1 - y0 + .2) + pole(y1) + poly("canvas-cloth", quad) + '<polygon class="canvas-weave" points="' + pts(quad) + '"/>' +
      line([P(x, y0, 1.4), P(x, y1, 1.4)], "faint") + line([P(x, y0, 2.0), P(x, y1, 2.0)], "faint") + pole(y0);
    c += '<ellipse class="canvas-absorb" cx="' + f(P(x, 3.55, 1.7)[0]) + '" cy="' + f(P(x, 3.55, 1.7)[1]) + '" rx="38" ry="30"/>';
    return '<g class="obj canvasg" data-obj="canvas" data-part="canvas" style="opacity:0;transform:translateY(-20px)">' + c + "</g>";
  }

  /* ---------- assemble ---------- */
  function build() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" class="weld-svg" viewBox="0 0 1000 640" role="img" aria-label="A small welding safety station on a plinth: a bench with a leather apron, cape, gloves, goggles, helmet and hand screen, safety boots on the floor, a kit mat with a marked place for each piece of gear, a stand with a current dial and three filter glasses, and a weld table.">';
    s += "<defs>" +
      '<linearGradient id="lthA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#85715a"/><stop offset=".5" stop-color="#5e4e3d"/><stop offset="1" stop-color="#3b3127"/></linearGradient>' +
      '<linearGradient id="lthB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#76644f"/><stop offset=".55" stop-color="#53443a"/><stop offset="1" stop-color="#33291f"/></linearGradient>' +
      '<linearGradient id="lthC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a8468"/><stop offset=".55" stop-color="#6f5d47"/><stop offset="1" stop-color="#45392b"/></linearGradient>' +
      '<linearGradient id="lthD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b4037"/><stop offset=".5" stop-color="#312a24"/><stop offset="1" stop-color="#1c1815"/></linearGradient>' +
      '<linearGradient id="steelH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#565a62"/><stop offset=".45" stop-color="#363a40"/><stop offset="1" stop-color="#1f2125"/></linearGradient>' +
      '<linearGradient id="fibre" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a423a"/><stop offset="1" stop-color="#2b2622"/></linearGradient>' +
      '<linearGradient id="p9Fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8d6c0" stop-opacity=".85"/><stop offset="1" stop-color="#7ea58a" stop-opacity=".78"/></linearGradient>' +
      '<linearGradient id="p11Fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f9d7c" stop-opacity=".92"/><stop offset="1" stop-color="#427357" stop-opacity=".92"/></linearGradient>' +
      '<linearGradient id="p13Fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d4a38"/><stop offset="1" stop-color="#0d1912"/></linearGradient>' +
      '<radialGradient id="lensGlowOk"><stop offset="0" stop-color="#d6ffe4" stop-opacity=".95"/><stop offset=".4" stop-color="#6fcf93" stop-opacity=".5"/><stop offset="1" stop-color="#2a8a55" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lensGlowHot"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".5" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="arcglow"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#bcd8ff" stop-opacity=".62"/><stop offset="1" stop-color="#5a8dff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="arcglow2"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#dfeaff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="flareGrad"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd9c8" stop-opacity=".55"/><stop offset="1" stop-color="#ff4a32" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="slotGlow"><stop offset="0" stop-color="#7ee8ae" stop-opacity=".75"/><stop offset=".55" stop-color="#4fd18c" stop-opacity=".28"/><stop offset="1" stop-color="#4fd18c" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="plinthPool"><stop offset="0" stop-color="#fff2dc" stop-opacity=".16"/><stop offset="1" stop-color="#fff2dc" stop-opacity="0"/></radialGradient>' +
      '<filter id="soft1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/></filter>' +
      '<filter id="soft3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>' +
      '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -.55" result="a"/><feComposite in="a" in2="SourceAlpha" operator="in"/></filter>' +
      '<clipPath id="lensclip"><rect x="-8.4" y="-3" width="16.8" height="9.2" rx="1.6"/></clipPath>' +
      '<clipPath id="scrclip"><rect x="-7" y="-10" width="15" height="12"/></clipPath>' +
      "</defs>";
    // plinth with a faint floor grid and a soft pool of light
    var g = "", i;
    for (i = 1; i < PW; i++) g += line([P(i, 0, 0), P(i, PD, 0)], "faint");
    for (i = 1; i < PD; i++) g += line([P(0, i, 0), P(PW, i, 0)], "faint");
    s += '<g class="obj plinth" data-obj="plinth">' + box(0, 0, -.5, PW, PD, .5, "plinth") + '<g class="grid">' + g + '</g><ellipse class="pool" cx="' + f(P(PW / 2, PD / 2, 0)[0]) + '" cy="' + f(P(PW / 2, PD / 2, 0)[1]) + '" rx="440" ry="220"/></g>';
    // the station: bench, gear lying on it, boots, stand (one group so it can step back during steps 7 and 8)
    s += '<g data-part="station">' + benchGroup() + stand() + items() + bootsGroup() + "</g>";
    s += kit();
    s += table() + weldPlate();
    s += tableGoggles() + rest();
    s += canvasScreen();
    s += spot();
    s += rays() + arcPart();
    return s + "</svg>";
  }
  window.FIG_SVG = build();
  window.FIG_GEOM = { arc: ARC, hammer: P(TABLE.x + 1.8, TABLE.y + .6, TABLE.top + .1) };
})();
