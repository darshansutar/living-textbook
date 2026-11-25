/* Weld-shop hazards: the figure (generated from the isometric builder in this file; edit here, not in the SVG string).
   A small training bay on a plinth, drawn in code in the Starling "anatomy" look: charcoal base, colour only for meaning
   (amber = tap target, red = danger, green = made safe, blue-white = arc, orange = hot). No text in the drawing.
   Sets window.FIG_DATA (camera views and part anchors) and window.FIG_SVG (the picture). Parts: machine + switch, mains socket and plug,
   wet patch, bench + plate + soapstone, cotton waste, hot electrode stubs, steel bin, store cabinet, extinguisher (store / near), visitor, fire. */
(function () {
  "use strict";
  var NS = 'http://www.w3.org/2000/svg';
  /* ------------------------------------------------------------------ isometric helpers */
  var S = 44, K = 0.866 * S, HH = 0.5 * S, ZZ = S, OX = 430, OY = 110;
  function P(x, y, z) { return [OX + (x - y) * K, OY + (x + y) * HH - z * ZZ]; }
  function f(n) { return n.toFixed(1); }
  function pts(a) { return a.map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' '); }
  function poly(cls, a, extra) { return '<polygon class="' + cls + '" points="' + pts(a) + '"' + (extra || '') + '/>'; }
  // a box: top, the face on its +y side (left on screen) and the face on its +x side (right)
  function box(x, y, z, w, d, h, mat, attrs) {
    var top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    var left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    var right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
    return '<g class="solid m-' + mat + '"' + (attrs || '') + '>' + poly('f l', left) + poly('f r', right) + poly('f t', top) + '</g>';
  }
  function ring(cx, cy, r, z, n) {   // a circle lying on the floor (or at height z), as a polygon
    var a = [], i; n = n || 30;
    for (i = 0; i < n; i++) { var t = i / n * Math.PI * 2; a.push(P(cx + r * Math.cos(t), cy + r * Math.sin(t), z)); }
    return a;
  }
  function ell(cx, cy, rx, ry, z, n) {
    var a = [], i; n = n || 30;
    for (i = 0; i < n; i++) { var t = i / n * Math.PI * 2; a.push(P(cx + rx * Math.cos(t), cy + ry * Math.sin(t), z)); }
    return a;
  }
  function planeY(a, b, c, r, n) {   // circle on a face where y = c, centred at x=a, z=b
    var o = [], i; n = n || 26;
    for (i = 0; i < n; i++) { var t = i / n * Math.PI * 2; o.push(P(a + r * Math.cos(t), c, b + r * Math.sin(t))); }
    return o;
  }
  function line(a, cls) { return '<polyline class="iso-line ' + (cls || '') + '" points="' + pts(a) + '" fill="none"/>'; }
  function halo(x, y, w, d) { return '<polygon class="iso-halo" points="' + pts([P(x - .1, y - .1, 0), P(x + w + .2, y - .1, 0), P(x + w + .2, y + d + .2, 0), P(x - .1, y + d + .2, 0)]) + '"/>'; }
  function smooth(a) {   // Catmull-Rom through screen points -> cubic path
    var d = 'M' + f(a[0][0]) + ',' + f(a[0][1]), i;
    for (i = 0; i < a.length - 1; i++) {
      var p0 = a[Math.max(0, i - 1)], p1 = a[i], p2 = a[i + 1], p3 = a[Math.min(a.length - 1, i + 2)];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ',' + f(p2[1]);
    }
    return d;
  }
  function smoothClosed(a) {
    var n = a.length, d = 'M' + f(a[0][0]) + ',' + f(a[0][1]), i;
    for (i = 0; i < n; i++) {
      var p0 = a[(i - 1 + n) % n], p1 = a[i], p2 = a[(i + 1) % n], p3 = a[(i + 2) % n];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ',' + f(p2[1]);
    }
    return d + 'Z';
  }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // an irregular puddle: radius per vertex from a few sine lobes plus noise; `sc[i]` shrinks each vertex (drying)
  var PUD = { cx: 3.4, cy: 4.0, rx: 1.55, ry: .9, n: 24, r: [], lag: [] };
  (function () { var R = rng(11), i, p1 = R() * 6, p2 = R() * 6, p3 = R() * 6; for (i = 0; i < PUD.n; i++) { var t = i / PUD.n * Math.PI * 2; PUD.r.push(1 + .15 * Math.sin(2 * t + p1) + .11 * Math.sin(3 * t + p2) + .07 * Math.sin(5 * t + p3) + (R() - .5) * .07); PUD.lag.push(.45 + R() * .5); } })();
  function puddlePath(e, grow) {   // e: 0 = full puddle, 1 = fully dried; grow widens the damp stain
    var a = [], i, drift = e * .25;
    for (i = 0; i < PUD.n; i++) {
      var t = i / PUD.n * Math.PI * 2, k = (1 - Math.min(1, e * (.55 + PUD.lag[i] * .55)) * (.92)) * (grow || 1);
      a.push(P(PUD.cx - drift + PUD.rx * PUD.r[i] * k * Math.cos(t), PUD.cy + drift * .4 + PUD.ry * PUD.r[i] * k * Math.sin(t), .02));
    }
    return smoothClosed(a);
  }
  // a vertical cylinder: two shaded halves and a top ellipse
  function cyl(cx, cy, r, z, h, mat, attrs) {
    var c0 = P(cx, cy, z), c1 = P(cx, cy, z + h), rx = 0, ry = 0, i;
    for (i = 0; i < 36; i++) { var t = i / 36 * Math.PI * 2, q = P(cx + r * Math.cos(t), cy + r * Math.sin(t), z); rx = Math.max(rx, Math.abs(q[0] - c0[0])); ry = Math.max(ry, Math.abs(q[1] - c0[1])); }
    var L = c0[0] - rx, R = c0[0] + rx, yb = c0[1], yt = c1[1];
    return '<g class="solid m-' + mat + '"' + (attrs || '') + '>' +
      '<path class="f l" d="M' + f(L) + ',' + f(yt) + 'L' + f(L) + ',' + f(yb) + 'A' + f(rx) + ',' + f(ry) + ' 0 0 0 ' + f(c0[0]) + ',' + f(yb + ry) + 'L' + f(c0[0]) + ',' + f(yt + ry) + 'Z"/>' +
      '<path class="f r" d="M' + f(R) + ',' + f(yt) + 'L' + f(R) + ',' + f(yb) + 'A' + f(rx) + ',' + f(ry) + ' 0 0 1 ' + f(c0[0]) + ',' + f(yb + ry) + 'L' + f(c0[0]) + ',' + f(yt + ry) + 'Z"/>' +
      '<ellipse class="f t" cx="' + f(c1[0]) + '" cy="' + f(yt) + '" rx="' + f(rx) + '" ry="' + f(ry) + '"/></g>';
  }

  /* ------------------------------------------------------------------ the bay (about nine things on a plinth) */
  var A = {   // anchors in the scene, for chips and the pointing hand
    switch: P(2.25, 2.62, 1.3), machine: P(1.8, 1.5, 2.85), wet: P(3.3, 4.0, .1), waste: P(6.1, 4.4, .8),
    ext: P(8.9, 3.3, 1.6), spot: P(8.9, 3.3, .1), bin: P(3.6, 6.1, 1.1), stubs: P(1.4, 3.8, .15),
    soap: P(8.8, 2.35, 2.1), trainee: P(1.28, 3.5, 2.55), plug: P(3.88, .38, .72), dial: P(1.2, 2.4, 1.25),
    bench: P(7.4, 2.8, 1.9), plate: P(7.4, 1.6, 2.05), cab: P(9.3, 6.3, 1.5)
  };

  function buildFigure() {
    var s = '';
    s += '<defs>' +
      '<radialGradient id="arcglow"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#bcd8ff" stop-opacity=".7"/><stop offset="1" stop-color="#5a8dff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="bayglow"><stop offset="0" stop-color="#9cc4ff" stop-opacity=".42"/><stop offset="1" stop-color="#4a74d0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="liveglow"><stop offset="0" stop-color="#ff5a46" stop-opacity=".42"/><stop offset="1" stop-color="#ff3a26" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="heatglow"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".75"/><stop offset="1" stop-color="#ff7a1c" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="safeglow"><stop offset="0" stop-color="#5fd39a" stop-opacity=".5"/><stop offset="1" stop-color="#3fb37a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="pudFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1a21"/><stop offset=".55" stop-color="#1b2e3a"/><stop offset="1" stop-color="#112028"/></linearGradient>' +
      '<radialGradient id="reflRed"><stop offset="0" stop-color="#ff6a52" stop-opacity=".4"/><stop offset="1" stop-color="#ff4a32" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="reflBlue"><stop offset="0" stop-color="#bcd8ff" stop-opacity=".38"/><stop offset="1" stop-color="#6a9aff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="cotMass"><stop offset="0" stop-color="#d2ccbc"/><stop offset=".7" stop-color="#9a958a"/><stop offset="1" stop-color="#5d594f"/></radialGradient>' +
      '<radialGradient id="plinthPool"><stop offset="0" stop-color="#fff2dc" stop-opacity=".16"/><stop offset="1" stop-color="#fff2dc" stop-opacity="0"/></radialGradient>' +
      '<filter id="soft1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/></filter>' +
      '<filter id="soft3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>' +
      '<filter id="fuzz" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="1" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".45"/></filter>' +
      '<filter id="dampBlur" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="5"/></filter>' +
      '<filter id="waterSpec" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".014 .03" numOctaves="2" seed="4" result="n"><animate attributeName="baseFrequency" dur="14s" values=".014 .03;.02 .024;.014 .03" repeatCount="indefinite"/></feTurbulence>' +
      '<feSpecularLighting in="n" surfaceScale="4" specularConstant="1.1" specularExponent="22" lighting-color="#bfe0f5" result="sp"><feDistantLight azimuth="225" elevation="42"/></feSpecularLighting>' +
      '<feComposite in="sp" in2="SourceAlpha" operator="in" result="sc"/><feColorMatrix in="sc" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .5 0"/></filter>' +
      '<radialGradient id="hotglow"><stop offset="0" stop-color="#ff8a3a" stop-opacity=".55"/><stop offset="1" stop-color="#ff6a1c" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="flameglow"><stop offset="0" stop-color="#ffb347" stop-opacity=".8"/><stop offset=".5" stop-color="#ff7a1c" stop-opacity=".3"/><stop offset="1" stop-color="#ff5a14" stop-opacity="0"/></radialGradient>' +
      '<filter id="flameWarp" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".05 .09" numOctaves="2" seed="5" result="n"><animate attributeName="baseFrequency" dur="1.3s" values=".05 .09;.06 .12;.05 .09" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      '<filter id="shimWarp" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="2" seed="2" result="n"><animate attributeName="baseFrequency" dur="3.5s" values=".02 .06;.03 .09;.02 .06" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".8"/></filter>' +
      '</defs>';

    // plinth with a faint floor grid
    s += '<g class="obj" data-obj="plinth">' + box(0, 0, -.5, 10, 7, .5, 'plinth');
    var g = '', i;
    for (i = 1; i < 10; i++) g += line([P(i, 0, 0), P(i, 7, 0)], 'faint');
    for (i = 1; i < 7; i++) g += line([P(0, i, 0), P(10, i, 0)], 'faint');
    s += '<g class="grid">' + g + '</g><ellipse class="pool" cx="' + f(P(5, 3.5, 0)[0]) + '" cy="' + f(P(5, 3.5, 0)[1]) + '" rx="400" ry="200"/></g>';

    // floor marks: the wet patch (organic edge, sheen, reflections, ripples), the damp stain it leaves, the extinguisher's marked spot
    var p0 = puddlePath(0), st0 = puddlePath(0, 1.04);
    s += '<g class="obj wet" data-obj="wet" data-hit="wet">' +
      '<path id="pDamp" class="damp" d="' + st0 + '" filter="url(#dampBlur)"/>' +
      '<clipPath id="pudClip"><path id="pClip" d="' + p0 + '"/></clipPath>' +
      '<g id="pudGroup"><path id="pBase" class="puddle-base" d="' + p0 + '"/>' +
      '<g clip-path="url(#pudClip)">' +
      '<ellipse class="refl m-only" cx="' + f(P(2.4, 3.6, .03)[0]) + '" cy="' + f(P(2.4, 3.6, .03)[1]) + '" rx="95" ry="34" fill="url(#reflRed)"/>' +
      '<ellipse class="refl a-only" cx="' + f(P(4.7, 3.5, .03)[0]) + '" cy="' + f(P(4.7, 3.5, .03)[1]) + '" rx="85" ry="30" fill="url(#reflBlue)"/>' +
      '<g class="streaks" filter="url(#soft1)"><path d="M' + f(P(2.4, 3.9, .03)[0]) + ',' + f(P(2.4, 3.9, .03)[1]) + 'l34,14" /><path d="M' + f(P(3.5, 4.3, .03)[0]) + ',' + f(P(3.5, 4.3, .03)[1]) + 'l46,20"/><path d="M' + f(P(4.1, 3.6, .03)[0]) + ',' + f(P(4.1, 3.6, .03)[1]) + 'l22,9"/></g>' +
      '<g class="ripples"><ellipse class="rip" cx="' + f(P(3.0, 4.1, .03)[0]) + '" cy="' + f(P(3.0, 4.1, .03)[1]) + '" rx="46" ry="19"/><ellipse class="rip r2" cx="' + f(P(3.9, 3.8, .03)[0]) + '" cy="' + f(P(3.9, 3.8, .03)[1]) + '" rx="40" ry="17"/><ellipse class="rip r3" cx="' + f(P(4.35, 3.45, .03)[0]) + '" cy="' + f(P(4.35, 3.45, .03)[1]) + '" rx="26" ry="11"/></g></g>' +
      '<path id="pSpec" class="water-spec" d="' + p0 + '" filter="url(#waterSpec)"/>' +
      '<path id="pRimGlow" class="puddle-rimglow" d="' + p0 + '" filter="url(#soft3)"/><path id="pRim" class="puddle-rim" d="' + p0 + '"/></g>' +
      '<polygon class="pad" points="' + pts(ell(3.4, 4.0, 1.8, 1.1, .05, 20)) + '"/></g>';
    s += '<ellipse class="safeglow floor" cx="' + f(A.wet[0]) + '" cy="' + f(A.wet[1]) + '" rx="150" ry="80"/>';
    s += '<polygon class="spot" points="' + pts(ell(8.9, 3.3, .62, .4, .02, 24)) + '"/>';
    s += '<ellipse class="safeglow ext" cx="' + f(A.spot[0]) + '" cy="' + f(A.spot[1]) + '" rx="80" ry="40"/>';

    // welding machine, back left: controls on its left face, vents on its right face
    var mx = .6, my = .6, mw = 2.4, md = 1.8, mh = 2.6, fy = my + md;
    var vents = '', vz;
    for (vz = .4; vz <= 2.0; vz += .3) vents += line([P(mx + mw, my + .3, vz), P(mx + mw, my + md - .3, vz)], 'hi');
    var ticks = '', ang;
    for (ang = -150; ang <= 150; ang += 30) {
      var t = ang * Math.PI / 180;
      ticks += line([P(1.2 + .5 * Math.sin(t), fy, 1.25 + .5 * Math.cos(t)), P(1.2 + .6 * Math.sin(t), fy, 1.25 + .6 * Math.cos(t))], 'hi');
    }
    s += '<ellipse class="live-glow on-only" cx="' + f(P(1.8, 1.9, .3)[0]) + '" cy="' + f(P(1.8, 1.9, .3)[1]) + '" rx="230" ry="120"/>';
    s += '<g class="obj" data-obj="machine" data-hit="machine">' + halo(mx, my, mw, md) +
      box(mx, my, 0, mw, md, mh, 'steel-dk') +
      box(1.25, 1.2, mh, 1.0, .14, .16, 'steel') +                           // carry handle
      '<polygon class="dark-glass" points="' + pts([P(.9, fy, 2.0), P(1.6, fy, 2.0), P(1.6, fy, 2.35), P(.9, fy, 2.35)]) + '"/>' +   // amp window
      '<polygon class="knob" points="' + pts(planeY(1.2, 1.25, fy, .38)) + '"/>' +
      '<polygon class="knob" points="' + pts(planeY(1.2, 1.25, fy, .2)) + '"/>' + ticks +
      line([P(1.2, fy, 1.25), P(1.34, fy, 1.45)], 'hi') +
      '<polygon class="lamp" points="' + pts(planeY(2.55, 2.1, fy, .11)) + '"/>' + vents +
      '<polygon class="pad" points="' + pts([P(mx, fy, 0), P(mx + mw, fy, 0), P(mx + mw, fy, mh + .2), P(mx, fy, mh + .2)]) + '"/>' +
      '</g>';
    // the switch, drawn over the machine so a tap lands on it first; lever up = ON
    s += '<g class="obj" data-obj="switch" data-hit="switch">' +
      box(2.0, fy, .85, .55, .14, .85, 'rubber') +
      '<g class="lever-on">' + box(2.16, fy + .14, 1.3, .22, .12, .5, 'lever') + '</g>' +
      '<g class="lever-off">' + box(2.16, fy + .14, .9, .22, .12, .36, 'lever') + '</g>' +
      '<polygon class="pad" points="' + pts([P(1.8, fy + .3, .65), P(2.75, fy + .3, .65), P(2.75, fy + .3, 2.0), P(1.8, fy + .3, 2.0)]) + '"/></g>';

    // bench, back right, with the plate and the electrode holder
    var legs = box(5.5, .7, 0, .2, .2, 1.7, 'steel-dk') + box(9.1, .7, 0, .2, .2, 1.7, 'steel-dk') + box(5.5, 2.5, 0, .2, .2, 1.7, 'steel-dk') + box(9.1, 2.5, 0, .2, .2, 1.7, 'steel-dk');
    s += '<g class="obj" data-obj="bench" data-hit="bench">' + halo(5.4, .6, 4.0, 2.2) + legs +
      box(5.4, .6, 1.7, 4.0, 2.2, .18, 'steel') +
      box(6.1, 1.0, 1.88, 2.6, 1.2, .12, 'plate') +
      line([P(6.3, 1.6, 2.0), P(8.5, 1.6, 2.0)], 'hi') +
      box(5.75, 2.02, 1.88, .95, .17, .14, 'rubber') +                        // electrode holder, lying beside the plate
      line([P(6.7, 2.1, 2.02), P(6.32, 1.62, 2.02)], 'hi') +                  // its electrode, touching the plate
      '<path class="bead" d="M' + f(P(6.3, 1.6, 2.0)[0]) + ',' + f(P(6.3, 1.6, 2.0)[1]) + 'L' + f(P(7.0, 1.6, 2.0)[0]) + ',' + f(P(7.0, 1.6, 2.0)[1]) + '"/>' +
      '<path id="beadHot" class="bead-hot" d="M' + f(P(6.3, 1.6, 2.0)[0]) + ',' + f(P(6.3, 1.6, 2.0)[1]) + 'L' + f(P(7.0, 1.6, 2.0)[0]) + ',' + f(P(7.0, 1.6, 2.0)[1]) + '"/>' +
      '<g class="smoke"><path class="wisp" d="M' + f(P(6.7, 1.6, 2.1)[0]) + ',' + f(P(6.7, 1.6, 2.1)[1]) + 'q-8,-18 4,-34t-2,-30"/><path class="wisp w2" d="M' + f(P(6.55, 1.62, 2.1)[0]) + ',' + f(P(6.55, 1.62, 2.1)[1]) + 'q9,-16 -3,-32t5,-28"/><path class="wisp w3" d="M' + f(P(6.9, 1.58, 2.1)[0]) + ',' + f(P(6.9, 1.58, 2.1)[1]) + 'q-6,-14 5,-26t-3,-24"/></g>' +
      '<polygon class="pad" points="' + pts([P(5.4, 2.8, 1.7), P(9.4, 2.8, 1.7), P(9.4, .6, 2.0), P(5.4, .6, 2.0)]) + '"/></g>';
    // soapstone on the bench; the chalk cross it draws; the hot plate's glow and heat shimmer
    s += '<g class="obj" data-obj="soap" data-hit="soap"><g id="soapGrp">' + box(8.55, 2.2, 1.88, .5, .3, .16, 'soap') +
      '<polygon class="pad" points="' + pts(ell(8.8, 2.35, .6, .42, 2.1, 14)) + '"/></g></g>';
    var cx1 = [P(6.5, 1.18, 2.0), P(8.3, 2.02, 2.0)], cx2 = [P(6.5, 2.02, 2.0), P(8.3, 1.18, 2.0)];
    s += '<g id="chalkGrp" class="chalk" filter="url(#fuzz)" fill="none" stroke-linecap="round"><path pathLength="1" d="M' + f(cx1[0][0]) + ',' + f(cx1[0][1]) + 'L' + f(cx1[1][0]) + ',' + f(cx1[1][1]) + '"/><path pathLength="1" d="M' + f(cx2[0][0]) + ',' + f(cx2[0][1]) + 'L' + f(cx2[1][0]) + ',' + f(cx2[1][1]) + '"/></g>';
    var pc = P(7.4, 1.6, 2.0), sh = '';
    for (var si = 0; si < 4; si++) { var sx = P(6.5 + si * .6, 1.7, 2.1); sh += '<path class="shim s' + si + '" d="M' + f(sx[0]) + ',' + f(sx[1]) + 'q-7,-12 0,-24t0,-24t0,-22"/>'; }
    s += '<g class="hotplate"><polygon class="hot-tint" points="' + pts([P(6.1, 1.0, 2.0), P(8.7, 1.0, 2.0), P(8.7, 2.2, 2.0), P(6.1, 2.2, 2.0)]) + '"/>' +
      '<ellipse class="heat-glow2" cx="' + f(pc[0]) + '" cy="' + f(pc[1]) + '" rx="150" ry="62"/><g filter="url(#shimWarp)">' + sh + '</g></g>';

    // the machine's mains lead runs to a wall socket at the back; "disconnect" pulls the plug out
    var leadOn = smooth([P(3.0, .9, .45), P(3.3, .85, .16), P(3.65, .7, .2), P(3.9, .62, .66)]);
    var leadOff = smooth([P(3.0, .9, .45), P(3.2, 1.0, .12), P(3.35, 1.5, .06), P(3.45, 1.75, .08)]);
    s += '<g class="obj" data-obj="socket" data-hit="plug">' + box(3.55, .06, 0, .62, .32, 1.1, 'rubber') +
      '<polygon class="sock-face" points="' + pts([P(3.62, .38, .58), P(4.1, .38, .58), P(4.1, .38, .98), P(3.62, .38, .98)]) + '"/>' +
      '<circle class="pwr-led" cx="' + f(P(3.85, .38, 1.02)[0]) + '" cy="' + f(P(3.85, .38, 1.02)[1]) + '" r="2.4"/>' +
      '<path class="lead-d lead-on" d="' + leadOn + '"/><path class="lead-m lead-on" d="' + leadOn + '"/>' +
      '<path class="lead-d lead-off" d="' + leadOff + '"/><path class="lead-m lead-off" d="' + leadOff + '"/>' +
      '<g id="plugGrp" data-dx="' + f(P(3.45, 1.75, .08)[0] - P(3.9, .62, .66)[0]) + '" data-dy="' + f(P(3.45, 1.75, .08)[1] - P(3.9, .62, .66)[1]) + '">' + box(3.74, .4, .58, .34, .24, .3, 'plugm') + '</g>' +
      '<polygon class="pad" points="' + pts([P(3.5, .0, 0), P(4.2, .0, 0), P(4.2, .7, 1.2), P(3.5, .7, 1.2)]) + '"/></g>';

    // live arc: blue-white bloom + flickering core + a jagged bolt (all JS-driven, ON only); sparks are a particle system in #fx
    var ap = P(6.32, 1.62, 2.05);
    s += '<g class="arc-only"><ellipse id="bayGlow" class="bay-glow" cx="' + f(ap[0] + 40) + '" cy="' + f(ap[1] + 20) + '" rx="210" ry="105"/>' +
      '<circle id="arcBloom" class="arc-halo" cx="' + f(ap[0]) + '" cy="' + f(ap[1]) + '" r="62" style="opacity:.5"/>' +
      '<circle id="arcHalo" class="arc-halo" cx="' + f(ap[0]) + '" cy="' + f(ap[1]) + '" r="30"/>' +
      '<path id="arcBolt" class="arc-bolt" d=""/><circle id="arcCore" class="arc-core" cx="' + f(ap[0]) + '" cy="' + f(ap[1]) + '" r="3.2"/></g>';

    // the machine's cable runs across the edge of the wet patch to the bench
    var cab = smooth([P(3.0, 1.4, .55), P(3.55, 1.75, .12), P(3.75, 2.7, .08), P(4.2, 3.4, .05), P(4.9, 3.3, .06), P(5.4, 2.8, .5), P(5.62, 2.45, 1.75), P(5.9, 2.15, 1.92)]);
    s += '<g class="obj" data-obj="cable" data-hit="cable"><path class="cable-d" d="' + cab + '"/><path class="cable-m" d="' + cab + '"/><path class="cable-h" d="' + cab + '"/>' +
      '<path d="' + cab + '" fill="none" stroke="transparent" stroke-width="22" pointer-events="stroke"/></g>';

    // electrode stubs on the floor, still hot (orange is the only colour here)
    var st = '', k, sp = [[1.0, 3.45], [1.45, 3.8], [1.15, 4.15]];
    for (k = 0; k < 3; k++) {
      var a0 = P(sp[k][0], sp[k][1], .06), a1 = P(sp[k][0] + .45, sp[k][1] - .08, .06);
      st += '<line class="stub" x1="' + f(a0[0]) + '" y1="' + f(a0[1]) + '" x2="' + f(a1[0]) + '" y2="' + f(a1[1]) + '"/><circle class="stubtip" cx="' + f(a1[0]) + '" cy="' + f(a1[1]) + '" r="2.6"/>';
    }
    var sc = P(1.4, 3.8, .1);
    s += '<g class="obj" data-obj="stubs" data-hit="stubs"><g class="stub-smoke"><path class="wisp" d="M' + f(P(1.9, 3.7, .12)[0]) + ',' + f(P(1.9, 3.7, .12)[1]) + 'q-6,-12 3,-22t-3,-20"/><path class="wisp w2" d="M' + f(P(1.8, 4.05, .12)[0]) + ',' + f(P(1.8, 4.05, .12)[1]) + 'q7,-10 -2,-20t4,-18"/></g><ellipse class="heat-glow" cx="' + f(sc[0]) + '" cy="' + f(sc[1]) + '" rx="50" ry="26"/>' + st +
      '<polygon class="pad" points="' + pts(ell(1.4, 3.8, .9, .6, .08, 14)) + '"/></g>';

    // steel bin, front middle
    s += '<g class="obj" data-obj="bin" data-hit="bin">' + halo(3.05, 5.55, 1.1, 1.1) + cyl(3.6, 6.1, .55, 0, 1.0, 'bin') +
      '<polygon points="' + pts(ring(3.6, 6.1, .44, 1.0, 28)) + '" fill="#0c0d0e" stroke="#686c73" stroke-width=".6" vector-effect="non-scaling-stroke"/></g>';

    // cotton waste: a loose, irregular heap of fibres with oil stains and a soft contact shadow
    var cc = P(6.1, 4.4, .3), R = rng(7), ci, cs = '';
    var bin = A.bin, cdx = bin[0] - cc[0], cdy = bin[1] - cc[1] - 8;
    cs += '<ellipse class="cshadow" cx="' + f(cc[0] + 4) + '" cy="' + f(cc[1] + 15) + '" rx="52" ry="15" filter="url(#soft3)"/>';
    cs += '<g filter="url(#soft1)">';
    for (ci = 0; ci < 11; ci++) { var ca = R() * 6.283, cr = Math.sqrt(R()); cs += '<ellipse cx="' + f(cc[0] + Math.cos(ca) * cr * 27) + '" cy="' + f(cc[1] + Math.sin(ca) * cr * 12 - 3) + '" rx="' + f(11 + R() * 9) + '" ry="' + f(7 + R() * 6) + '" fill="url(#cotMass)"/>'; }
    cs += '</g>';
    for (ci = 0; ci < 3; ci++) cs += '<ellipse class="oil" cx="' + f(cc[0] + (R() - .5) * 38) + '" cy="' + f(cc[1] + (R() - .5) * 12 - 2) + '" rx="' + f(6 + R() * 6) + '" ry="' + f(3 + R() * 3) + '" filter="url(#soft1)"/>';
    var pal = ['#ded8c8', '#c4bfae', '#a8a395', '#8d8878', '#ece7da', '#4d4639'];
    cs += '<g class="fibres" filter="url(#fuzz)" fill="none" stroke-linecap="round">';
    for (ci = 0; ci < 95; ci++) {
      var fa = R() * 6.283, fr = Math.sqrt(R()), fx = cc[0] + Math.cos(fa) * fr * 30, fy = cc[1] + Math.sin(fa) * fr * 13 - 4,
        ang = R() * 6.283, len = 14 + R() * 30, wob = (R() - .5) * len * .7, ca2 = Math.cos(ang), sa2 = Math.sin(ang * .5);
      var col = pal[ci % 7 === 6 ? 5 : Math.floor(R() * 5)];
      cs += '<path d="M' + f(fx) + ',' + f(fy) + 'c' + f(ca2 * len * .3 - sa2 * wob) + ',' + f(sa2 * len * .3 + ca2 * wob) + ' ' + f(ca2 * len * .7 + sa2 * wob) + ',' + f(sa2 * len * .7 - ca2 * wob) + ' ' + f(ca2 * len) + ',' + f(sa2 * len) + '" stroke="' + col + '" stroke-opacity="' + f(.45 + R() * .5) + '" stroke-width="' + f(.5 + R() * .9) + '"/>';
    }
    for (ci = 0; ci < 13; ci++) {   // loose strands lifting off the top
      var lx = cc[0] + (R() - .5) * 46, ly = cc[1] - 5 - R() * 6, lh = 7 + R() * 11, ld = (R() - .5) * 24;
      cs += '<path d="M' + f(lx) + ',' + f(ly) + 'q' + f(ld * .3) + ',' + f(-lh * .6) + ' ' + f(ld) + ',' + f(-lh) + '" stroke="#e9e4d6" stroke-opacity=".8" stroke-width=".7"/>';
    }
    cs += '</g>';
    s += '<g class="obj" data-obj="waste" data-hit="waste"><g class="cotton" id="cottonGrp" data-dx="' + f(cdx) + '" data-dy="' + f(cdy) + '">' + cs +
      '<polygon class="firerisk" points="' + pts(ell(6.1, 4.4, 1.15, .75, .03, 22)) + '"/>' +
      '<polygon class="pad" points="' + pts(ell(6.1, 4.4, 1.2, .8, .6, 16)) + '"/></g></g>';
    // a few fibres end up over the bin's rim once the waste is in
    var rb = P(3.6, 6.1, 1.0), bf = '';
    for (ci = 0; ci < 6; ci++) { var bx = rb[0] + (R() - .5) * 26, by = rb[1] + 6 + R() * 5; bf += '<path d="M' + f(bx) + ',' + f(by) + 'q' + f((R() - .5) * 14) + ',' + f(-10 - R() * 6) + ' ' + f((R() - .5) * 22) + ',' + f(-4 - R() * 8) + '" stroke="' + pal[ci % 4] + '" stroke-width="1" stroke-opacity=".85" fill="none" stroke-linecap="round"/>'; }
    s += '<g class="binfib" filter="url(#fuzz)">' + bf + '</g>';
    s += '<ellipse class="safeglow cot" cx="' + f(A.bin[0]) + '" cy="' + f(A.bin[1] + 30) + '" rx="90" ry="46"/>';

    // the store: a locked steel cabinet with a mesh door; the extinguisher is inside it until it is moved
    var cabCorner = [8.7, 5.3], cw = 1.1, cd = 1.0, ch = 2.1, cdy = cabCorner[1] + cd, door = '', di;
    for (di = 0; di <= 5; di++) door += line([P(cabCorner[0] + .12 + di * .2, cdy, .18), P(cabCorner[0] + .12 + di * .2, cdy, ch - .2)], 'faint') + line([P(cabCorner[0] + .12, cdy, .3 + di * .32), P(cabCorner[0] + cw - .12, cdy, .3 + di * .32)], 'faint');
    var exIn = cyl(9.0, 6.05, .2, 0, 1.0, 'redext') + cyl(9.0, 6.05, .08, 1.0, .2, 'steel');
    s += '<g class="obj" data-obj="cab" data-hit="cab">' + halo(cabCorner[0] - .1, cabCorner[1] - .1, cw, cd) + box(cabCorner[0], cabCorner[1], 0, cw, cd, ch, 'steel-dk') +
      '<polygon class="dark-glass" points="' + pts([P(cabCorner[0] + .1, cdy, .15), P(cabCorner[0] + cw - .1, cdy, .15), P(cabCorner[0] + cw - .1, cdy, ch - .15), P(cabCorner[0] + .1, cdy, ch - .15)]) + '"/>' +
      '<g id="extStore" class="ext-store">' + exIn + '</g>' + door +
      '<polygon class="knob" points="' + pts(planeY(cabCorner[0] + cw - .22, 1.05, cdy, .07)) + '"/>' +
      '<polygon class="pad" points="' + pts([P(8.7, 6.3, 0), P(9.8, 6.3, 0), P(9.8, 6.3, 2.1), P(8.7, 6.3, 2.1)]) + '"/></g>';

    // the extinguisher at its marked spot beside the bench (it drops in when the class puts it there)
    var exN = halo(8.6, 3.0, .8, .8) + cyl(8.9, 3.3, .3, 0, 1.4, 'redext') + cyl(8.9, 3.3, .11, 1.4, .3, 'steel') + box(8.72, 3.14, 1.7, .36, .16, .1, 'steel-dk') +
      '<path class="iso-line hi" d="M' + f(P(9.1, 3.3, 1.72)[0]) + ',' + f(P(9.1, 3.3, 1.72)[1]) + 'q10,10 4,24"/>';
    s += '<g class="obj ext-near" data-obj="ext" data-hit="ext" id="extNear" style="opacity:0;display:none">' + exN +
      '<polygon class="pad" points="' + pts([P(8.5, 3.7, 0), P(9.4, 3.7, 0), P(9.4, 3.7, 2.1), P(8.5, 3.7, 2.1)]) + '"/></g>';

    // a passing trainee, drawn plainly (a helmet is the one light shape)
    var tx = .9, ty = 3.3;
    s += '<g class="obj" data-obj="trainee" data-hit="trainee" id="traineeGrp" style="opacity:0;display:none">' +
      '<ellipse class="cshadow" cx="' + f(P(tx + .4, ty + .2, 0)[0]) + '" cy="' + f(P(tx + .4, ty + .2, 0)[1]) + '" rx="46" ry="16" filter="url(#soft3)"/>' +
      box(tx + .02, ty, 0, .22, .22, .95, 'trousers') + box(tx + .5, ty, 0, .22, .22, .95, 'trousers') +
      box(tx - .1, ty - .08, .95, .95, .4, 1.0, 'shirt') + box(tx - .3, ty, 1.05, .2, .2, .8, 'shirt') + box(tx + .85, ty, 1.05, .2, .2, .8, 'shirt');
    var hd = P(tx + .38, ty + .2, 2.3);
    s += '<ellipse class="skin" cx="' + f(hd[0]) + '" cy="' + f(hd[1]) + '" rx="13" ry="15"/>' +
      '<path class="helmet" d="M' + f(hd[0] - 17) + ',' + f(hd[1] - 4) + 'q17,-26 34,0z"/><path class="helmet-b" d="M' + f(hd[0] - 21) + ',' + f(hd[1] - 3) + 'h42"/>' +
      '<polygon class="pad" points="' + pts([P(tx - .3, ty + .5, 0), P(tx + 1.1, ty + .5, 0), P(tx + 1.1, ty + .5, 2.6), P(tx - .3, ty + .5, 2.6)]) + '"/></g>';

    // fire: soft layered flames, a glow and smoke (only when the extinguisher was left in the store)
    var fc = P(5.95, 2.1, 1.9);
    s += '<g id="fireGrp" class="fire" style="opacity:0;display:none"><ellipse class="flame-glow" cx="' + f(fc[0]) + '" cy="' + f(fc[1] - 20) + '" rx="120" ry="70"/><g filter="url(#flameWarp)" transform="translate(' + f(fc[0]) + ',' + f(fc[1]) + ') scale(.7) translate(' + f(-fc[0]) + ',' + f(-fc[1]) + ')">' +
      '<path class="fl fl1" d="M' + f(fc[0] - 22) + ',' + f(fc[1]) + 'q-8,-34 10,-58q4,22 14,10q12,-26 4,-52q28,38 22,100z"/>' +
      '<path class="fl fl2" d="M' + f(fc[0] - 12) + ',' + f(fc[1]) + 'q-2,-26 8,-44q6,16 10,6q8,-18 4,-34q20,30 14,72z"/>' +
      '<path class="fl fl3" d="M' + f(fc[0] - 3) + ',' + f(fc[1]) + 'q0,-16 6,-28q4,10 8,4q2,-10 0,-20q10,18 6,44z"/></g>' +
      '<g class="smoke2"><path class="wisp" d="M' + f(fc[0]) + ',' + f(fc[1] - 60) + 'q-10,-20 6,-38t-4,-34"/><path class="wisp w2" d="M' + f(fc[0] + 8) + ',' + f(fc[1] - 64) + 'q12,-18 -4,-36t6,-32"/></g></g>';
    s += '<g id="fx" style="mix-blend-mode:screen"></g>';
    return s;
  }

  /* camera views: framing boxes around the parts of each step (the player fits them into the free area beside the card) */
  function bbox(list, pad, bottom) {
    var xs = list.map(function (p) { return P(p[0], p[1], p[2]); }), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    xs.forEach(function (q) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    bottom = bottom == null ? 70 : bottom;
    return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + pad + bottom];
  }
  function C(a, b) { return [[a[0], a[1], a[2]], [b[0], a[1], a[2]], [a[0], b[1], a[2]], [b[0], b[1], a[2]], [a[0], a[1], b[2]], [b[0], a[1], b[2]], [a[0], b[1], b[2]], [b[0], b[1], b[2]]]; }
  var V = {
    all: bbox(C([0, 0, -.5], [10, 7, 3]), 50),
    wet: bbox(C([.6, 1.2, 0], [5.4, 5.1, 2.6]), 55),
    cotton: bbox(C([2.6, 2.4, 0], [7.2, 6.9, 1.3]), 55),
    stubs: bbox(C([.6, 3.0, 0], [4.6, 6.9, 1.2]), 60),
    machine: bbox(C([.6, .0, 0], [4.3, 3.9, 2.9]).concat(C([5.5, .6, 1.7], [7.4, 2.4, 2.4])), 55),
    ext: bbox(C([6.8, 2.4, 0], [9.8, 6.8, 2.2]), 55),
    plate: bbox(C([5.5, .6, 1.7], [9.4, 3.0, 2.5]), 60)
  };
  V.bench = V.plate;
  var anchors = {};
  Object.keys(A).forEach(function (k) { anchors[k] = [+A[k][0].toFixed(1), +A[k][1].toFixed(1)]; });
  window.FIG_GEOM = { P: P, puddlePath: puddlePath, A: A };
  window.FIG_DATA = { views: V, anchors: anchors };
  window.FIG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg weld-svg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" ' +
    'data-machine="on" data-arc="on" data-floor="wet" data-cotton="near" data-ext="off" data-plate="cool" role="img" ' +
    'aria-label="A welding bay: an arc welding machine with its mains socket, a bench with a steel plate and soapstone, a wet patch, cotton waste, hot electrode stubs, a steel bin and a store cabinet.">' +
    buildFigure() + '</svg>';
})();
