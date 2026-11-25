/* The PPE station of the welding lab, drawn in code (no pictures, no text or digits inside the drawing): a small isometric
   station on a plinth in the Starling "anatomy" language. Charcoal / steel base, leather as the only warm material, glass
   with a restrained green tint (the shade difference IS the lesson). Gives the workbench player window.FIG_DATA (views and
   anchors) and window.FIG_SVG (the scene). Same hooks as the previous figure: data-hit / data-item / data-worn / data-plate /
   data-lens / data-needle / data-rays / data-slag / data-flare / data-helm / data-fig and the parts arc, canvas, chips, dial,
   hammer, plate, station, trainee. */
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
  var M0 = P(3.4, 3.9, 0), M1 = P(7.2, 4.9, 0);               // Mallesh: in front of the bench, then at the weld table
  var BOOTC = P(1.1, 3.9, 0);
  var STAND = { x: 6.0, y: 0.4, w: 3.8, d: 0.35, h: 3.8 };
  var TABLE = { x: 6.0, y: 2.8, w: 3.4, d: 1.2, top: 1.1 };
  var ARC = P(6.7, 3.4, 1.28);
  var TRN = P(4.5, 3.9, 0);
  var CANVAS_X = 5.5;
  var FIGS = 1.1;                                              // the figure is drawn 118 px tall, then scaled
  function fig(m, lx, ly) { return [m[0] + lx * FIGS, m[1] + ly * FIGS]; }

  function IP(n) { return P(ITEMP[n][0], ITEMP[n][1], BENCH.top); }
  var A = {
    apron: IP("apron"), cape: IP("cape"), gloves: IP("gloves"),
    goggles: IP("goggles"), helmet: fig(IP("helmet"), 0, -10), screen: fig(IP("screen"), 0, -12),
    boots: [BOOTC[0], BOOTC[1] - 22], dial: P(STAND.x + 1.05, STAND.y + STAND.d, 3.05),
    p9: P(STAND.x + 1.75, STAND.y + STAND.d, 1.45), p11: P(STAND.x + 2.85, STAND.y + STAND.d, 1.45), p13: P(STAND.x + 3.95, STAND.y + STAND.d, 1.45),
    plate: P(7.6, 3.4, 1.25), arc: ARC, trainee: [TRN[0], TRN[1] - 80], canvas: P(CANVAS_X, 3.4, 1.9)
  };

  /* views [x, y, w, h] in the 1000 x 640 drawing space; the player fits them into the free part of the screen */
  function V(arr, pad) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    arr.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return [Math.round(x0 - pad), Math.round(y0 - pad), Math.round(x1 - x0 + 2 * pad), Math.round(y1 - y0 + 2 * pad)];
  }
  var VIEWS = {
    all: V([P(0, PD, 0), P(PW, 0, 0), P(PW, PD, -.5), P(0, 0, 0), P(STAND.x + 2, 0.4, 4.2), fig(M0, 0, -130)], 40),
    bench: V([P(BENCH.x + .2, BENCH.y + .3, BENCH.top + 1.0), P(BENCH.x + BENCH.w - .2, BENCH.y + BENCH.d, BENCH.top - .2), fig(M0, 0, -70)], 20),
    benchfloor: V([P(BENCH.x - .2, BENCH.y, 2.6), P(BENCH.x + BENCH.w + .2, 4.4, 0)], 30),
    boots: V([[BOOTC[0] - 40, BOOTC[1] + 6], [BOOTC[0] + 40, BOOTC[1] - 44], fig(M0, -26, 4), fig(M0, 26, -52)], 20),
    mallesh: V([fig(M0, -34, -134), fig(M0, 34, 6)], 16),
    shade: V([P(STAND.x - .1, STAND.y, 4.0), P(STAND.x + STAND.w + .1, STAND.y + STAND.d + .5, 0)], 14),
    helm: V([fig(M0, -22, -128), fig(M0, 22, -86)], 12),
    plate: V([P(TABLE.x - .2, TABLE.y, TABLE.top + 1.8), P(TABLE.x + TABLE.w + .2, TABLE.y + TABLE.d, 0), fig(M1, -30, -134), fig(M1, 30, 8)], 22),
    arc: V([P(CANVAS_X - 1.8, 2.2, 2.9), P(TABLE.x + TABLE.w + .1, TABLE.y + TABLE.d + .4, 0), fig(M1, -30, -130), fig(M1, 30, 6), [TRN[0] - 28, TRN[1] - 134]], 18)
  };
  var ANCH = {};
  Object.keys(A).forEach(function (k) { ANCH[k] = [Math.round(A[k][0] * 10) / 10, Math.round(A[k][1] * 10) / 10]; });
  window.FIG_DATA = { views: VIEWS, anchors: ANCH };

  /* ---------- materials: leather, glass, steel ---------- */
  function lth(d, g, cls) { return '<path class="lth ' + (cls || "") + '" d="' + d + '" fill="url(#' + (g || "lthA") + ')"/><path d="' + d + '" fill="#000" filter="url(#grain)" opacity=".34"/>'; }
  function stitch(d) { return '<path class="stitch" d="' + d + '"/>'; }
  function crease(d) { return '<path class="crease" d="' + d + '"/>'; }
  function sheen(d, w) { return '<path class="sheen" d="' + d + '" style="stroke-width:' + (w || 1.3) + 'px"/>'; }

  /* ---------- Mallesh and the trainee (front view, feet at 0,0, 118 tall) ---------- */
  function hand(x, sk) {
    var sg = x < 0 ? -1 : 1;
    return '<path class="hand" fill="' + sk + '" d="M' + (x - 3.6) + ',-49 Q' + (x - 4.8) + ',-42 ' + (x - 2.8) + ',-39.5 Q' + x + ',-37.6 ' + (x + 2.8) + ',-39.5 Q' + (x + 4.8) + ',-42 ' + (x + 3.6) + ',-49Z"/>' +
      '<path class="hand" fill="' + sk + '" d="M' + (x + sg * 3.4) + ',-47 Q' + (x + sg * 6.6) + ',-44.5 ' + (x + sg * 5.2) + ',-41.5 Q' + (x + sg * 4) + ',-41 ' + (x + sg * 2.8) + ',-43Z"/>';
  }
  function body(tone) {
    var sk = tone === "t" ? "url(#skinT)" : "url(#skinM)", sh = tone === "t" ? "url(#shirtT)" : "url(#shirtM)", sc = tone === "t" ? "#33363b" : "#3b3e44";
    return '<g class="bodyg">' +
      '<path class="trs" d="M-12.5,-52 L-13,-7 L-2,-7 L-1,-52Z" fill="url(#trsG)"/><path class="trs" d="M12.5,-52 L13,-7 L2,-7 L1,-52Z" fill="url(#trsG)"/>' +
      '<path class="shoe" d="M-14,-7 L-2,-7 L-1,-1 L-16,-1Z"/><path class="shoe" d="M14,-7 L2,-7 L1,-1 L16,-1Z"/>' +
      '<path class="shirt" fill="' + sh + '" d="M-16.5,-91 Q0,-96 16.5,-91 L14.5,-50 Q0,-47 -14.5,-50Z"/>' +
      '<path class="arm" style="stroke:' + sc + '" d="M-16,-88 Q-22,-70 -20.5,-49"/><path class="arm" style="stroke:' + sc + '" d="M16,-88 Q22,-70 20.5,-49"/>' +
      hand(-20.5, sk) + hand(20.5, sk) +
      '<path class="collar" d="M-6,-95 L0,-88.5 L6,-95"/>' +
      '<rect class="neck" fill="' + sk + '" x="-3.6" y="-98" width="7.2" height="9" rx="2"/>' +
      '<ellipse class="ear" fill="' + sk + '" cx="-8.7" cy="-104" rx="1.7" ry="2.6"/><ellipse class="ear" fill="' + sk + '" cx="8.7" cy="-104" rx="1.7" ry="2.6"/>' +
      '<ellipse class="head" fill="' + sk + '" cx="0" cy="-105" rx="8.6" ry="10.4"/>' +
      '<path class="hair" d="M-9,-104 Q-10,-117.5 0,-117 Q10,-117.5 9,-104 Q8.6,-109 5,-111 Q0,-112.5 -5,-111 Q-8.6,-109 -9,-104Z"/>' +
      '<path class="brow" d="M-5.6,-106.4 L-2,-106.8 M2,-106.8 L5.6,-106.4"/>' +
      '<path class="jaw" d="M-6.5,-98 Q0,-94.4 6.5,-98"/>' +
      '<path class="rimlight" d="M-8.6,-108 Q-9,-100 -6,-95" /></g>';
  }

  /* worn gear, in the same frame */
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
  G.cape = function () {
    var yoke = "M-19.5,-91 Q0,-98 19.5,-91 L23,-77 Q0,-83 -23,-77Z";
    var sl = "M-18.5,-89 Q-28.5,-68 -25,-43 L-15.5,-43 Q-17.5,-66 -12.5,-85Z", sr = "M18.5,-89 Q28.5,-68 25,-43 L15.5,-43 Q17.5,-66 12.5,-85Z";
    return lth(sl, "lthB") + lth(sr, "lthB") + lth(yoke, "lthA") +
      crease("M-22,-70 Q-21,-62 -21.5,-54 M22,-70 Q21,-62 21.5,-54") + stitch("M-23,-78 Q0,-84 23,-78") +
      '<path class="cuff" d="M-25,-46 L-15.5,-46 M25,-46 L15.5,-46"/>' + sheen("M-17,-91 Q-3,-95 6,-94", 1.4);
  };
  G.apron = function () {
    var d = "M-12.5,-87 L12.5,-87 Q14.5,-70 15.5,-58 L16.5,-31 Q0,-26.5 -16.5,-31 L-15.5,-58 Q-14.5,-70 -12.5,-87Z";
    return '<path class="strap" d="M-9,-87 Q-7,-95 -5.5,-98 M9,-87 Q7,-95 5.5,-98"/>' + lth(d, "lthA") +
      '<path class="strap tie" d="M-15.5,-58 L15.5,-58"/>' + crease("M-6,-80 Q-4,-70 -5,-62 M7,-82 Q5,-72 6,-64 M-8,-46 Q0,-43 8,-46") +
      stitch("M-11.5,-85 Q-13,-70 -14,-58 L-15,-33 M11.5,-85 Q13,-70 14,-58 L15,-33 M-14.5,-31.5 Q0,-28 14.5,-31.5") +
      '<path class="pocket" d="M-8,-52 L8,-52 L8,-40 L-8,-40Z"/>' + sheen("M-9,-84 Q-12,-66 -12.5,-46", 1.6) +
      '<circle class="rivet" cx="-13" cy="-58" r="1"/><circle class="rivet" cx="13" cy="-58" r="1"/>';
  };
  G.gloves = function () {
    function gl(sg) {
      var x = sg * 20.5;
      var d = "M" + (x - 5.8) + ",-58 L" + (x + 5.8) + ",-58 L" + (x + 5.4) + ",-46 Q" + (x + 6) + ",-38.5 " + x + ",-37.5 Q" + (x - 6) + ",-38.5 " + (x - 5.4) + ",-46Z";
      return lth(d, "lthC") + '<path class="cuff" d="M' + (x - 6.2) + ",-55 L" + (x + 6.2) + ',-55"/><path class="cuff" d="M' + (x - 5) + ",-42 Q" + x + ",-40.4 " + (x + 5) + ',-42"/>' +
        stitch("M" + (x - 4.4) + ",-56 L" + (x - 4.2) + ",-44") + sheen("M" + (x - 3) + ",-56 Q" + (x - 4) + ",-48 " + (x - 2.4) + ",-41", 1.2);
    }
    return gl(-1) + gl(1);
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
  G.helmet = function () { return '<g transform="translate(0,-105)">' + helmetCore() + "</g>"; };
  function screenCore() {
    return '<path class="paddle" d="M-9.5,-14 L10.5,-14 L12,8 L-11,8Z" fill="url(#fibre)"/>' +
      '<path class="paddle-edge" d="M-9.5,-14 L10.5,-14 L12,8 L-11,8Z"/>' +
      '<g clip-path="url(#scrclip)"><rect class="lensglass" x="-7" y="-10" width="15" height="12"/><path class="lensshine" d="M-5,2 L-0.4,-10 L2.6,-10 L-2,2Z"/></g>' +
      '<rect class="winframe" x="-7.6" y="-10.6" width="16.2" height="13.2" rx="1.4"/>' +
      '<circle class="bolt" cx="-9" cy="6" r="1.1"/><circle class="bolt" cx="10" cy="6" r="1.1"/>';
  }
  G.screen = function () {
    return '<g transform="translate(9,-98)"><path class="handle" d="M2.5,12 L10,50"/>' + screenCore() + "</g>";
  };
  G.goggles = function () {
    return '<g transform="translate(0,-105)"><path class="gstrap" d="M-8.8,0.4 Q0,-3 8.8,0.4"/>' +
      '<g class="gog"><ellipse cx="-4.3" cy="0.6" rx="3.5" ry="3" class="gframe"/><ellipse cx="4.3" cy="0.6" rx="3.5" ry="3" class="gframe"/>' +
      '<ellipse cx="-4.3" cy="0.6" rx="2.6" ry="2.2" class="gclear"/><ellipse cx="4.3" cy="0.6" rx="2.6" ry="2.2" class="gclear"/>' +
      '<path class="gbridge" d="M-1,0.4 Q0,-.6 1,0.4"/><path class="lensshine" d="M-5.6,-0.4 L-4.4,-1.2 M2.9,-0.4 L4.1,-1.2" style="stroke-width:.7px"/></g></g>';
  };

  /* ---------- the figure: body, then the gear in the order it goes on ---------- */
  function mallesh() {
    var o = '<g data-fig="mallesh" class="obj" data-obj="mallesh" style="transform:translate(' + f(M0[0]) + "px," + f(M0[1]) + 'px)"><g transform="scale(' + FIGS + ')">' + body("m");
    var order = ["boots", "cape", "apron", "gloves", "goggles", "helmet", "screen"];
    order.forEach(function (n) {
      var cls = "gear" + (n === "helmet" ? "" : "");
      var attrs = ' class="gear" data-worn="' + n + '" style="--dx:' + dxy(n)[0] + "px;--dy:" + dxy(n)[1] + 'px"';
      if (n === "helmet") o += '<g data-helm="down"><g' + attrs + ">" + G[n]() + "</g></g>";
      else o += "<g" + attrs + ">" + G[n]() + "</g>";
    });
    return o + "</g></g>";
  }
  // each lying item flies from where it lies to where it is worn (in the drawing's own units)
  function dxy(n) {
    var from = { apron: A.apron, cape: A.cape, gloves: A.gloves, goggles: A.goggles, helmet: A.helmet, screen: A.screen, boots: A.boots }[n];
    var to = { apron: fig(M0, 0, -62), cape: fig(M0, 0, -70), gloves: fig(M0, 0, -48), goggles: fig(M0, 0, -105), helmet: fig(M0, 0, -105), screen: fig(M0, 8, -98), boots: fig(M0, 0, -10) }[n];
    return [Math.round((from[0] - to[0]) / FIGS), Math.round((from[1] - to[1]) / FIGS)];
  }
  function trainee() {
    return '<g data-part="trainee" class="obj" data-obj="trainee" style="opacity:0"><g transform="translate(' + f(TRN[0]) + "," + f(TRN[1]) + ') scale(1.04)">' + body("t") +
      '<g data-trainee-eyes=""><circle class="eye" cx="-3.2" cy="-106" r="1.1"/><circle class="eye" cx="3.2" cy="-106" r="1.1"/></g></g>' +
      '<ellipse data-flare="" class="flare" cx="' + f(TRN[0]) + '" cy="' + f(TRN[1] - 108) + '" rx="46" ry="38" fill="url(#flareGrad)" style="opacity:0"/></g>';
  }

  /* ---------- items lying on the bench (flat, in the bench plane) and on the floor ---------- */
  function pad(cx, cy, rx, ry) { return '<ellipse class="pad" cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function item(id, inner, padc, extra) {
    var d = dxy(id);
    return '<g class="obj item" data-obj="item-' + id + '" data-item="' + id + '" data-hit="' + id + '" style="--dx:' + d[0] * FIGS + "px;--dy:" + d[1] * FIGS + 'px">' + inner + pad(padc[0], padc[1], padc[2], padc[3]) + "</g>";
  }
  function apronFlat() {
    var o = A.apron;
    return '<g transform="' + onTop(ITEMP.apron[0], ITEMP.apron[1], BENCH.top) + ' scale(' + IS + ')' + '">' +
      '<path class="strap" d="M-.12,-.46 Q-.16,-.62 -.1,-.7 M.12,-.46 Q.16,-.62 .1,-.7"/>' +
      lth("M-.3,-.46 L.3,-.46 Q.33,-.1 .37,.1 L.34,.46 Q0,.5 -.34,.46 L-.37,.1 Q-.33,-.1 -.3,-.46Z", "lthA") +
      crease("M-.12,-.3 Q-.08,-.12 -.1,.02 M.14,-.34 Q.1,-.14 .12,0 M-.16,.22 Q0,.28 .16,.22") + stitch("M-.26,-.42 Q-.3,-.1 -.33,.1 L-.3,.42 M.26,-.42 Q.3,-.1 .33,.1 L.3,.42") +
      '<rect class="pocket" x="-.17" y=".05" width=".34" height=".24" rx=".02"/>' + sheen("M-.22,-.4 Q-.27,-.1 -.28,.2", 1.4) + "</g>";
  }
  function capeFlat() {
    return '<g transform="' + onTop(ITEMP.cape[0], ITEMP.cape[1], BENCH.top) + ' scale(' + IS + ')' + '">' +
      lth("M-.46,-.12 L-.66,.42 L-.5,.47 L-.3,.02Z", "lthB") + lth("M.46,-.12 L.66,.42 L.5,.47 L.3,.02Z", "lthB") +
      lth("M-.46,-.12 L-.28,-.34 Q0,-.42 .28,-.34 L.46,-.12 Q.4,.02 0,-.02 Q-.4,.02 -.46,-.12Z", "lthA") +
      stitch("M-.4,-.1 Q0,-.12 .4,-.1") + crease("M-.56,.12 L-.5,.3 M.56,.12 L.5,.3") + sheen("M-.3,-.3 Q-.1,-.36 .12,-.35", 1.4) + "</g>";
  }
  function glovesFlat() {
    function gl(v, s) {
      var g = "";
      [-.075, -.025, .025, .075].forEach(function (u, i) { var len = [.17, .2, .19, .15][i]; g += lth("M" + (u - .021) + ",-.07 L" + (u - .021) + "," + (-.07 - len) + " Q" + u + "," + (-.1 - len) + " " + (u + .021) + "," + (-.07 - len) + " L" + (u + .021) + ",-.07Z", "lthC"); });
      return '<g transform="translate(' + v + ',0) scale(' + s + ',1)">' + g + lth("M-.1,-.09 L.1,-.09 L.1,.1 Q0,.14 -.1,.1Z", "lthC") + lth("M.09,.02 L.2,-.08 Q.23,-.05 .2,0 L.09,.1Z", "lthC") + lth("M-.11,.1 L.11,.1 L.12,.27 L-.12,.27Z", "lthB") +
        stitch("M-.06,-.07 L-.06,.07") + "</g>";
    }
    return '<g transform="' + onTop(ITEMP.gloves[0], ITEMP.gloves[1], BENCH.top) + ' scale(' + IS + ')' + '">' + gl(-.2, 1) + gl(.2, -1) + "</g>";
  }
  function gogglesFlat() {
    return '<g transform="' + onTop(ITEMP.goggles[0], ITEMP.goggles[1], BENCH.top) + ' scale(' + IS + ')' + '"><path class="gstrap" d="M-.2,-.04 Q-.5,-.22 -.46,.14 Q-.4,.4 -.2,.2 M.2,-.04 Q.5,-.22 .46,.14 Q.4,.4 .2,.2" style="stroke-width:1.6px"/>' +
      '<circle cx="-.13" cy="0" r=".1" class="gframe"/><circle cx=".13" cy="0" r=".1" class="gframe"/><circle cx="-.13" cy="0" r=".075" class="gclear"/><circle cx=".13" cy="0" r=".075" class="gclear"/><path class="gbridge" d="M-.04,0 Q0,-.03 .04,0"/></g>';
  }
  function standing(o, inner, sc, rot) { return '<g transform="translate(' + f(o[0]) + "," + f(o[1]) + ") rotate(" + (rot || 0) + ") scale(" + sc + ')">' + inner + "</g>"; }
  var shadowE = function (o, rx) { return '<ellipse class="contact" cx="' + f(o[0]) + '" cy="' + f(o[1] + 1) + '" rx="' + rx + '" ry="' + f(rx * .45) + '"/>'; };

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
    var s = "", o, h = IP("helmet"), sc = IP("screen");
    o = A.apron; s += item("apron", apronFlat(), [o[0], o[1] - 2, 38, 22]);
    o = A.cape; s += item("cape", capeFlat(), [o[0], o[1] - 2, 42, 22]);
    s += item("helmet", shadowE(h, 18) + standing([h[0], h[1] - 15], helmetCore(), 1.05), [h[0], h[1] - 14, 24, 28]);
    o = A.gloves; s += item("gloves", glovesFlat(), [o[0], o[1] - 2, 36, 20]);
    o = A.goggles; s += item("goggles", gogglesFlat(), [o[0], o[1] - 2, 32, 18]);
    s += item("screen", shadowE(sc, 14) + standing([sc[0], sc[1] - 16], '<path class="handle" d="M2,11 L4,30"/>' + screenCore(), 1.0, -6), [sc[0], sc[1] - 14, 22, 28]);
    return s;
  }

  function bootsGroup() {
    var d = dxy("boots");
    return '<g class="obj item" data-obj="boots" data-item="boots" data-hit="boots" style="--dx:' + d[0] * FIGS + "px;--dy:" + d[1] * FIGS + 'px">' +
      halo(1.2, 3.1, 1.2, .8) + '<ellipse class="contact" cx="' + f(BOOTC[0]) + '" cy="' + f(BOOTC[1] + 1) + '" rx="30" ry="9"/>' +
      standing(BOOTC, G.boots(), 1.45) + pad(BOOTC[0], BOOTC[1] - 20, 40, 30) + "</g>";
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
    var h = fig(M1, 21, -50), a = ARC, b = a, o = "";
    var bolt = "M" + f(a[0]) + "," + f(a[1]) + " l-3,-4 l4,-2 l-3,-5 l4,-3";
    o += '<g data-part="arc" style="opacity:0">' +
      '<path class="electrode" d="M' + f(h[0]) + "," + f(h[1]) + " L" + f(a[0] + 1) + "," + f(a[1] - 4) + '"/><path class="flux" d="M' + f((h[0] * 2 + a[0]) / 3) + "," + f((h[1] * 2 + a[1]) / 3) + " L" + f(a[0] + 1) + "," + f(a[1] - 4) + '"/>' +
      '<g class="arcpulse"><ellipse class="arc-halo" cx="' + f(a[0]) + '" cy="' + f(a[1] - 4) + '" rx="58" ry="40"/><ellipse class="arc-halo2" cx="' + f(a[0]) + '" cy="' + f(a[1] - 4) + '" rx="18" ry="13"/>' +
      '<path class="arc-bolt" d="' + bolt + '"/><circle class="arc-core" cx="' + f(a[0]) + '" cy="' + f(a[1] - 4) + '" r="2.4"/></g>' +
      '<g class="sparks-layer"></g></g>';
    return o;
  }
  function rays() {
    var a = ARC, head = [TRN[0], TRN[1] - 108], cv = P(CANVAS_X, 3.4, 1.7);
    function ray(to, kind) { return '<g data-rays="' + kind + '" style="opacity:0"><path class="ray" d="M' + f(a[0] - 4) + "," + f(a[1] - 6) + " L" + f(to[0]) + "," + f(to[1]) + '"/></g>'; }
    return ray(head, "reach") + ray(cv, "blocked");
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
    var s = '<svg xmlns="http://www.w3.org/2000/svg" class="weld-svg" viewBox="0 0 1000 640" role="img" aria-label="A small welding safety station on a plinth: a bench with a leather apron, cape, gloves, goggles, helmet and hand screen, safety boots, a stand with a current dial and three filter glasses, a weld table, and Mallesh, who puts the gear on.">';
    s += "<defs>" +
      '<radialGradient id="skinM" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#8a8d94"/><stop offset="1" stop-color="#5a5d64"/></radialGradient>' +
      '<radialGradient id="skinT" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#777a81"/><stop offset="1" stop-color="#4c4f55"/></radialGradient>' +
      '<linearGradient id="shirtM" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#454850"/><stop offset=".6" stop-color="#363940"/><stop offset="1" stop-color="#2a2c32"/></linearGradient>' +
      '<linearGradient id="shirtT" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3d43"/><stop offset="1" stop-color="#25272c"/></linearGradient>' +
      '<linearGradient id="trsG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2d2f34"/><stop offset="1" stop-color="#1c1d20"/></linearGradient>' +
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
    s += table() + weldPlate();
    s += canvasScreen();
    s += mallesh();
    s += trainee();
    s += rays() + arcPart();
    return s + "</svg>";
  }
  window.FIG_SVG = build();
  window.FIG_GEOM = { arc: ARC, m0: M0, m1: M1, trn: TRN, hammer: P(TABLE.x + 1.8, TABLE.y + .6, TABLE.top + .1) };
})();
