/* Sample: "Make the welding area safe" in the Starling focus standard.
   A small isometric training bay drawn in SVG (built here in code), a camera that eases between named views,
   a lit / dimmed focus state, and glow reactions. Wording follows script_e1.json (screen 3), trimmed to 4 steps.
   Runs from file://. No audio in this sample. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var NS = 'http://www.w3.org/2000/svg';
  var body = document.body, stage = $('stage'), focusBox = $('focus');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    switch: P(2.25, 2.62, 1.3), machine: P(1.8, 1.5, 2.85), wet: P(3.3, 4.0, .1), cotton: P(6.6, 4.3, .8),
    ext: P(9.3, 6.2, 1.6), spot: P(8.2, 3.8, .1), bin: P(6.2, 6.3, 1.1)
  };
  var EXT_TO = [P(8.2, 3.8, 0)[0] - P(9.3, 6.2, 0)[0], P(8.2, 3.8, 0)[1] - P(9.3, 6.2, 0)[1]];

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
      '<ellipse class="refl on-only" cx="' + f(P(2.4, 3.6, .03)[0]) + '" cy="' + f(P(2.4, 3.6, .03)[1]) + '" rx="95" ry="34" fill="url(#reflRed)"/>' +
      '<ellipse class="refl on-only" cx="' + f(P(4.7, 3.5, .03)[0]) + '" cy="' + f(P(4.7, 3.5, .03)[1]) + '" rx="85" ry="30" fill="url(#reflBlue)"/>' +
      '<g class="streaks" filter="url(#soft1)"><path d="M' + f(P(2.4, 3.9, .03)[0]) + ',' + f(P(2.4, 3.9, .03)[1]) + 'l34,14" /><path d="M' + f(P(3.5, 4.3, .03)[0]) + ',' + f(P(3.5, 4.3, .03)[1]) + 'l46,20"/><path d="M' + f(P(4.1, 3.6, .03)[0]) + ',' + f(P(4.1, 3.6, .03)[1]) + 'l22,9"/></g>' +
      '<g class="ripples"><ellipse class="rip" cx="' + f(P(3.0, 4.1, .03)[0]) + '" cy="' + f(P(3.0, 4.1, .03)[1]) + '" rx="46" ry="19"/><ellipse class="rip r2" cx="' + f(P(3.9, 3.8, .03)[0]) + '" cy="' + f(P(3.9, 3.8, .03)[1]) + '" rx="40" ry="17"/><ellipse class="rip r3" cx="' + f(P(4.35, 3.45, .03)[0]) + '" cy="' + f(P(4.35, 3.45, .03)[1]) + '" rx="26" ry="11"/></g></g>' +
      '<path id="pSpec" class="water-spec" d="' + p0 + '" filter="url(#waterSpec)"/>' +
      '<path id="pRimGlow" class="puddle-rimglow" d="' + p0 + '" filter="url(#soft3)"/><path id="pRim" class="puddle-rim" d="' + p0 + '"/></g>' +
      '<polygon class="pad" points="' + pts(ell(3.4, 4.0, 1.8, 1.1, .05, 20)) + '"/></g>';
    s += '<ellipse class="safeglow floor" cx="' + f(A.wet[0]) + '" cy="' + f(A.wet[1]) + '" rx="150" ry="80"/>';
    s += '<polygon class="spot" points="' + pts(ell(8.2, 3.8, .62, .4, .02, 24)) + '"/>';
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
    // live arc: blue-white bloom + flickering core + a jagged bolt (all JS-driven, ON only); sparks are a particle system in #fx
    var ap = P(6.32, 1.62, 2.05);
    s += '<g class="on-only"><ellipse id="bayGlow" class="bay-glow" cx="' + f(ap[0] + 40) + '" cy="' + f(ap[1] + 20) + '" rx="210" ry="105"/>' +
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
    s += '<g class="obj" data-obj="stubs" data-hit="stubs"><ellipse class="heat-glow" cx="' + f(sc[0]) + '" cy="' + f(sc[1]) + '" rx="50" ry="26"/>' + st +
      '<polygon class="pad" points="' + pts(ell(1.4, 3.8, .9, .6, .08, 14)) + '"/></g>';

    // steel bin, front middle
    s += '<g class="obj" data-obj="bin" data-hit="bin">' + halo(5.65, 5.75, 1.1, 1.1) + cyl(6.2, 6.3, .55, 0, 1.0, 'bin') +
      '<polygon points="' + pts(ring(6.2, 6.3, .44, 1.0, 28)) + '" fill="#0c0d0e" stroke="#686c73" stroke-width=".6" vector-effect="non-scaling-stroke"/></g>';

    // cotton waste: a loose, irregular heap of fibres with oil stains and a soft contact shadow
    var cc = P(6.6, 4.3, .3), R = rng(7), ci, cs = '';
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
    s += '<g class="obj" data-obj="cotton" data-hit="cotton"><g class="cotton" id="cottonGrp" data-dx="' + f(cdx) + '" data-dy="' + f(cdy) + '">' + cs +
      '<polygon class="firerisk" points="' + pts(ell(6.6, 4.3, 1.15, .75, .03, 22)) + '"/>' +
      '<polygon class="pad" points="' + pts(ell(6.6, 4.3, 1.2, .8, .6, 16)) + '"/></g></g>';
    // a few fibres end up over the bin's rim once the waste is in
    var rb = P(6.2, 6.3, 1.0), bf = '';
    for (ci = 0; ci < 6; ci++) { var bx = rb[0] + (R() - .5) * 26, by = rb[1] + 6 + R() * 5; bf += '<path d="M' + f(bx) + ',' + f(by) + 'q' + f((R() - .5) * 14) + ',' + f(-10 - R() * 6) + ' ' + f((R() - .5) * 22) + ',' + f(-4 - R() * 8) + '" stroke="' + pal[ci % 4] + '" stroke-width="1" stroke-opacity=".85" fill="none" stroke-linecap="round"/>'; }
    s += '<g class="binfib" filter="url(#fuzz)">' + bf + '</g>';
    s += '<ellipse class="safeglow cot" cx="' + f(A.bin[0]) + '" cy="' + f(A.bin[1] + 30) + '" rx="90" ry="46"/>';

    // fire extinguisher, far front corner until it is placed by the bench
    var ex0 = '';
    ex0 += halo(8.9, 5.8, .8, .8) + cyl(9.3, 6.2, .3, 0, 1.4, 'redext') + cyl(9.3, 6.2, .11, 1.4, .3, 'steel') + box(9.12, 6.04, 1.7, .36, .16, .1, 'steel-dk') +
      '<path class="iso-line hi" d="M' + f(P(9.5, 6.2, 1.72)[0]) + ',' + f(P(9.5, 6.2, 1.72)[1]) + 'q10,10 4,24"/>';
    s += '<g class="obj ext" data-obj="ext" data-hit="ext" id="extGrp" style="--ext-to:translate(' + f(EXT_TO[0]) + 'px,' + f(EXT_TO[1]) + 'px)">' + ex0 +
      '<polygon class="pad" points="' + pts([P(8.85, 6.6, 0), P(9.75, 6.6, 0), P(9.75, 6.6, 2.1), P(8.85, 6.6, 2.1)]) + '"/></g>';
    s += '<g id="fx" style="mix-blend-mode:screen"></g>';
    return s;
  }

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 640');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('data-machine', 'on'); svg.setAttribute('data-floor', 'wet'); svg.setAttribute('data-cotton', 'near'); svg.setAttribute('data-ext', 'far');
  svg.innerHTML = buildFigure();
  stage.insertBefore(svg, stage.firstChild);

  /* ------------------------------------------------------------------ natural effects: water, cotton, sparks */
  var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var pudIds = ['pBase', 'pRim', 'pRimGlow', 'pSpec', 'pClip'];
  var dryRaf = 0;
  function setPuddle(e) { var d = puddlePath(e); pudIds.forEach(function (id) { $(id).setAttribute('d', d); }); }
  function dryPuddle() {
    var t0 = performance.now(), dur = reduced ? 1 : 2800; cancelAnimationFrame(dryRaf);
    (function tick(now) {
      var t = Math.min(1, (now - t0) / dur), e = ease(t);
      setPuddle(e); $('pudGroup').style.opacity = Math.max(0, 1 - Math.max(0, (t - .6) / .4));
      $('pDamp').style.opacity = String(.1 + .3 * e);
      if (t < 1) dryRaf = requestAnimationFrame(tick); else $('pudGroup').style.display = 'none';
    })(t0);
  }
  function resetWater() { cancelAnimationFrame(dryRaf); setPuddle(0); $('pudGroup').style.display = ''; $('pudGroup').style.opacity = 1; $('pDamp').style.opacity = ''; }
  function pickUpCotton() {
    var g = $('cottonGrp'), dx = +g.dataset.dx, dy = +g.dataset.dy;
    var kf = [
      { transform: 'translate(0px,0px) scale(1) rotate(0deg)', opacity: 1, offset: 0 },
      { transform: 'translate(' + f(dx * .28) + 'px,' + f(dy * .28 - 52) + 'px) scale(1.12) rotate(-6deg)', opacity: 1, offset: .38 },
      { transform: 'translate(' + f(dx * .82) + 'px,' + f(dy * .82 - 30) + 'px) scale(.82) rotate(3deg)', opacity: 1, offset: .76 },
      { transform: 'translate(' + f(dx) + 'px,' + f(dy + 6) + 'px) scale(.42) rotate(0deg)', opacity: 0, offset: 1 }];
    g.animate(kf, { duration: reduced ? 1 : 1400, easing: 'cubic-bezier(.4,0,.25,1)', fill: 'forwards' });
    svg.setAttribute('data-cotton', 'binned');
  }
  function resetCotton() { $('cottonGrp').getAnimations().forEach(function (a) { a.cancel(); }); }

  // sparks: pooled lines, gravity, bounce on the plate, white -> orange -> red -> dark ember
  var ARC = P(6.32, 1.62, 2.05), BEAD_END = P(7.0, 1.6, 2.0), fx = $('fx'), PARTS = [], MAXP = 110, free = [], nextBurst = 0, offAt = -1, lastT = 0;
  (function () {
    for (var i = 0; i < MAXP; i++) {
      var h = document.createElementNS(NS, 'line'), c = document.createElementNS(NS, 'line');
      h.setAttribute('stroke-linecap', 'round'); c.setAttribute('stroke-linecap', 'round'); h.style.display = c.style.display = 'none';
      fx.appendChild(h); fx.appendChild(c); PARTS.push({ h: h, c: c, on: false }); free.push(i);
    }
  })();
  function sparkColor(a) {
    var r, g, b, t;
    if (a < .15) { r = 255; g = 246; b = 220; } else if (a < .5) { t = (a - .15) / .35; r = 255; g = 246 - 70 * t; b = 220 - 140 * t; }
    else if (a < .8) { t = (a - .5) / .3; r = 255 - 31 * t; g = 176 - 104 * t; b = 80 - 56 * t; } else { t = (a - .8) / .2; r = 224 - 164 * t; g = 72 - 50 * t; b = 24 - 14 * t; }
    return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
  }
  function spawn(n, ember) {
    while (n-- > 0 && free.length) {
      var p = PARTS[free.pop()], an = -Math.PI * (.08 + Math.random() * .84), sp = 90 + Math.random() * 240;
      p.on = true; p.age = 0; p.b = 0; p.ember = !!ember; p.life = ember ? 3.5 + Math.random() * 3 : .5 + Math.random() * .95; p.w = .45 + Math.random() * .55;
      if (ember) { var k = Math.random(); p.x = ARC[0] + (BEAD_END[0] - ARC[0]) * k; p.y = ARC[1] + (BEAD_END[1] - ARC[1]) * k + 2; p.vx = p.vy = 0; p.w = 1.1 + Math.random() * .8; }
      else { p.x = ARC[0] + (Math.random() - .5) * 4; p.y = ARC[1] + (Math.random() - .5) * 3; p.vx = Math.cos(an) * sp * (.8 + Math.random() * .5); p.vy = Math.sin(an) * sp; }
      p.py = ARC[1] + 7 + Math.random() * 12; p.h.style.display = p.c.style.display = '';
    }
  }
  function killP(i) { var p = PARTS[i]; p.on = false; p.h.style.display = p.c.style.display = 'none'; free.push(i); }
  function fxOff() { offAt = performance.now(); spawn(8, true); }
  function fxOn() { offAt = -1; }
  var arcCore = $('arcCore'), arcHalo = $('arcHalo'), arcBloom = $('arcBloom'), arcBolt = $('arcBolt'), bayGlow = $('bayGlow'), beadHot = $('beadHot');
  function camSees(x, y) { return x > cam[0] - 60 && x < cam[0] + cam[2] + 60 && y > cam[1] - 60 && y < cam[1] + cam[3] + 60; }
  function fxLoop(now) {
    requestAnimationFrame(fxLoop);
    var dt = Math.min(.04, (now - lastT) / 1000 || .016); lastT = now;
    var on = svg.getAttribute('data-machine') === 'on', seen = camSees(ARC[0], ARC[1]) && body.dataset.screen !== 'x';
    if (on && seen && !reduced) {
      var j = .75 + Math.random() * .5;
      arcCore.setAttribute('r', (2.6 + Math.random() * 1.8).toFixed(1)); arcHalo.setAttribute('r', (30 * j).toFixed(1)); arcBloom.setAttribute('r', (62 * (.85 + Math.random() * .3)).toFixed(1));
      arcBloom.style.opacity = (.35 + Math.random() * .25).toFixed(2); bayGlow.style.opacity = (.8 + Math.random() * .2).toFixed(2);
      var bx = ARC[0], by = ARC[1], d = 'M' + bx.toFixed(1) + ',' + by.toFixed(1), q;
      for (q = 0; q < 3; q++) { bx += (Math.random() - .5) * 9; by -= 2 + Math.random() * 5; d += 'L' + bx.toFixed(1) + ',' + by.toFixed(1); }
      arcBolt.setAttribute('d', d);
      nextBurst -= dt;
      if (nextBurst <= 0) { spawn(2 + (Math.random() * 5 | 0)); nextBurst = .07 + Math.random() * .22; if (Math.random() < .1) spawn(12); }
      beadHot.style.opacity = (.4 + Math.random() * .25).toFixed(2);
    } else if (!on) {
      var cool = offAt < 0 ? 1 : Math.min(1, (now - offAt) / 6000);
      beadHot.style.opacity = (.45 * (1 - cool)).toFixed(2);
    }
    for (var i = 0; i < MAXP; i++) {
      var p = PARTS[i]; if (!p.on) continue;
      p.age += dt; var a = p.age / p.life;
      if (a >= 1) { killP(i); continue; }
      var tx = 0, ty = 0;
      if (!p.ember) {
        p.vy += 760 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.vy > 0 && p.y > p.py && p.b < 3 && Math.abs(p.x - ARC[0]) < 90) { p.y = p.py; p.vy *= -.4; p.vx *= .72; p.b++; }
        var spd = Math.hypot(p.vx, p.vy) || 1, L = Math.min(spd * .035, 16); tx = -p.vx / spd * L; ty = -p.vy / spd * L;
      }
      var col = sparkColor(p.ember ? .3 + a * .65 : a), al = a < .8 ? 1 : 1 - (a - .8) / .2, hide = !seen && !p.ember ? 0 : 1;
      var x1 = p.x.toFixed(1), y1 = p.y.toFixed(1), x0 = (p.x + tx + .01).toFixed(1), y0 = (p.y + ty + .01).toFixed(1);
      p.c.setAttribute('x1', x0); p.c.setAttribute('y1', y0); p.c.setAttribute('x2', x1); p.c.setAttribute('y2', y1); p.c.setAttribute('stroke', col); p.c.setAttribute('stroke-width', (p.w * (1 - a * .5)).toFixed(2)); p.c.setAttribute('stroke-opacity', (al * hide).toFixed(2));
      p.h.setAttribute('x1', x0); p.h.setAttribute('y1', y0); p.h.setAttribute('x2', x1); p.h.setAttribute('y2', y1); p.h.setAttribute('stroke', col); p.h.setAttribute('stroke-width', (p.w * 3.2).toFixed(2)); p.h.setAttribute('stroke-opacity', (al * .16 * hide).toFixed(2));
    }
  }
  requestAnimationFrame(fxLoop);
  function resetFx() { for (var i = 0; i < MAXP; i++) if (PARTS[i].on) killP(i); fxOn(); nextBurst = 0; }

  /* ------------------------------------------------------------------ camera: named views, eased viewBox inside the free area */
  function bbox(list, pad, bottom) {
    var xs = list.map(function (p) { return P(p[0], p[1], p[2]); }), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    xs.forEach(function (q) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); });
    bottom = bottom == null ? 70 : bottom;
    return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + pad + pad * 0 + bottom];
  }
  function C(a, b) { return [[a[0], a[1], a[2]], [b[0], a[1], a[2]], [a[0], b[1], a[2]], [b[0], b[1], a[2]], [a[0], a[1], b[2]], [b[0], a[1], b[2]], [a[0], b[1], b[2]], [b[0], b[1], b[2]]]; }
  var VIEWS = {
    all: bbox(C([0, 0, -.5], [10, 7, 3]), 50),
    machine: bbox(C([.6, .6, 0], [3.0, 2.4, 2.9]).concat(C([5.5, .6, 1.7], [7.4, 2.4, 2.2])), 55),
    floor: bbox(C([1.0, 1.4, 0], [5.6, 5.0, .6]), 60),
    cotton: bbox(C([5.2, 3.4, 0], [7.9, 6.9, 1.3]), 60),
    ext: bbox(C([7.0, 2.4, 0], [9.9, 6.7, 2.0]), 55)
  };
  var cam = VIEWS.all.slice(), camRaf = 0, viewName = 'all';
  function fitAspect(r) {
    var box = stage.getBoundingClientRect(), fo = focusBox.getBoundingClientRect();
    var fw = Math.max(1, fo.width), fh = Math.max(1, fo.height), x = r[0], y = r[1], w = r[2], h = r[3];
    if (w / h < fw / fh) { var nw = h * fw / fh; x -= (nw - w) / 2; w = nw; } else { var nh = w * fh / fw; y -= (nh - h) / 2; h = nh; }
    var unit = w / fw;
    return [x - (fo.left - box.left) * unit, y - (fo.top - box.top) * unit, box.width * unit, box.height * unit];
  }
  function applyCam(r) { cam = r; svg.setAttribute('viewBox', r.map(function (v) { return v.toFixed(1); }).join(' ')); place(); }
  function view(name, instant, dur) {
    viewName = name || viewName;
    var target = fitAspect(VIEWS[viewName] || VIEWS.all);
    cancelAnimationFrame(camRaf);
    if (instant || reduced) { applyCam(target); return; }
    var from = cam.slice(), t0 = performance.now(); dur = (dur || 900) * (window.__camSlow || 1);
    (function tick(now) {
      var t = Math.min(1, (now - t0) / dur), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      applyCam(from.map(function (v, i) { return v + (target[i] - v) * e; }));
      if (t < 1) camRaf = requestAnimationFrame(tick);
    })(t0);
  }
  window.addEventListener('resize', function () { view(viewName, true); });

  /* ------------------------------------------------------------------ chips and the pointing hand */
  var chipLayer = $('chips'), chips = [], pointerAt = null;
  function toScreen(p) {
    var m = svg.getScreenCTM(); if (!m) return null; var host = stage.getBoundingClientRect();
    return [m.a * p[0] + m.c * p[1] + m.e - host.left, m.b * p[0] + m.d * p[1] + m.f - host.top];
  }
  function setChips(list) {
    chipLayer.textContent = '';
    chips = (list || []).map(function (c) { var el = document.createElement('span'); el.className = 'chip-tag' + (c.side ? ' ' + c.side : ''); el.textContent = c.text; chipLayer.appendChild(el); return { el: el, at: c.at, side: c.side }; });
    place();
  }
  function place() {
    var host = stage.getBoundingClientRect(), fo = focusBox.getBoundingClientRect();
    chips.forEach(function (c) {
      var s = toScreen(A[c.at]);
      if (!s || s[0] < fo.left - host.left || s[1] < fo.top - host.top || s[0] > fo.right - host.left || s[1] > fo.bottom - host.top) { c.el.hidden = true; return; }
      c.el.hidden = false; c.el.style.transform = 'translate(' + s[0].toFixed(1) + 'px,' + s[1].toFixed(1) + 'px)';
    });
    if (pointerAt) {
      var a = pointerAt === 'ext' && svg.getAttribute('data-ext') === 'near' ? A.spot : A[pointerAt], sp = a && toScreen(a);
      $('pointer').hidden = !sp; if (sp) $('pointer').style.translate = sp[0].toFixed(0) + 'px ' + sp[1].toFixed(0) + 'px';
    }
  }
  function pointAt(id) { pointerAt = id; $('pointer').hidden = !id; place(); }

  /* ------------------------------------------------------------------ the chapter: four steps, one verb each */
  var STEPS = [
    { id: 'off', title: 'Switch the machine off', view: 'machine', lit: ['machine', 'switch'], target: 'switch', chips: [{ text: 'Welding machine', at: 'machine', side: 'right' }],
      say: 'Mallesh, the machine is still live, and a short arc is burning on the plate. Before anything else, switch it off.',
      hint: "Tap the machine's switch.",
      ok: 'Good. The machine is off, so there is no current in the cable. Now we can check the rest of the bay.',
      miss: { general: "That is not the machine's switch. Look for the red lever on the welding machine.", wet: 'Not yet. The machine is live, and that floor is wet. Switch it off first.' },
      run: function () { svg.setAttribute('data-machine', 'off'); fxOff(); }, status: ['Floor: wet · Machine: OFF', 'on'] },
    { id: 'wet', title: 'The wet patch', view: 'floor', lit: ['wet', 'cable'], target: 'wet', chips: [{ text: 'Wet floor', at: 'wet', side: 'right' }],
      say: 'Mallesh, a wet floor is dangerous while arc welding. Find it and fix it.',
      hint: 'Tap the wet patch by the machine.',
      ok: 'Good. The patch is dried. Never stand on a damp or wet place while arc welding.',
      miss: { general: 'That is not the wet place. Look for the puddle near the welding machine.' },
      run: function () { svg.setAttribute('data-floor', 'dry'); dryPuddle(); }, status: ['Floor: dry · Flammables: near', 'on'] },
    { id: 'cotton', title: 'Cotton waste', view: 'cotton', lit: ['cotton', 'bin'], target: 'cotton', chips: [{ text: 'Cotton waste', at: 'cotton', side: 'right' }],
      say: 'Sparks and hot metal can start a fire. Remove anything that can burn.',
      hint: 'Tap the cotton waste beside the bench.',
      ok: 'Good. Cotton, oil and petrol must be removed from the vicinity of welding.',
      miss: { general: 'That will not burn easily. Find the cotton waste by the bench.' },
      run: function () { pickUpCotton(); }, status: ['Flammables: clear · Extinguisher: not placed', 'on'] },
    { id: 'ext', title: 'Fire extinguisher', view: 'ext', lit: ['ext', 'bench'], choose: true, chips: [{ text: 'Extinguisher', at: 'ext', side: 'left' }],
      say: 'Where should the fire extinguisher stay while welding is on?',
      options: [
        { text: 'Nearby, in working condition', right: true, say: 'Yes. Keep a suitable fire extinguisher nearby at all times, and make sure it works.' },
        { text: 'In the store room, where it is safe', say: 'No. If a fire starts it must be at hand, not in the store.' }],
      ok: 'Yes. Keep a suitable fire extinguisher nearby at all times, and make sure it works.',
      run: function () { svg.setAttribute('data-ext', 'near'); }, status: ['Area safe · Ready to weld', 'off'] }
  ];
  var END = { kind: 'ITI Fitter · Welding · Safety job', head: 'The bay is safe', sub: 'Mallesh can strike an arc now. You made four checks:',
    list: ['Machine switched off before touching anything', 'Wet floor dried: no standing in water while welding', 'Cotton waste removed: nothing that burns near the arc', 'Extinguisher nearby and in working condition'] };

  var stepIndex = -1, current = null, idleTimer = 0, busy = false, fromOverview = false;
  function paintProgress() {
    var ol = $('progress'); ol.textContent = '';
    STEPS.forEach(function (s, i) { var li = document.createElement('li'); li.className = i < stepIndex ? 'done' : i === stepIndex ? 'now' : ''; ol.appendChild(li); });
    $('stepno').textContent = 'Step ' + (stepIndex + 1) + ' of ' + STEPS.length;
  }
  function setReadout(text, state) {
    var r = $('readout'); r.dataset.state = state === 'off' ? 'off' : 'on';
    r.querySelector('use').setAttribute('href', state === 'off' ? '#i-off' : '#i-sign'); r.querySelector('span').textContent = text;
  }
  function glow(id) {
    svg.querySelectorAll('[data-glow]').forEach(function (el) { el.removeAttribute('data-glow'); });
    if (id) svg.querySelectorAll('[data-hit="' + id + '"]').forEach(function (el) { el.setAttribute('data-glow', ''); });
  }
  function lit(ids) {
    svg.querySelectorAll('.obj').forEach(function (el) { el.removeAttribute('data-lit'); });
    if (!ids) { svg.removeAttribute('data-focus'); return; }
    svg.setAttribute('data-focus', '');
    ids.forEach(function (id) { var e = svg.querySelector('.obj[data-obj="' + id + '"]'); if (e) e.setAttribute('data-lit', ''); });
  }
  function feedback(kind, text) {
    var fb = $('feedback'); fb.className = 'feedback' + (kind ? ' ' + kind : ''); fb.querySelector('span').textContent = text || ''; fb.hidden = !text;
    if (kind) { fb.classList.remove('pop'); void fb.offsetWidth; fb.classList.add('pop'); }
  }
  function clearTask() {
    clearTimeout(idleTimer); glow(null); pointAt(null); $('hint').hidden = true; $('choices').textContent = ''; $('choices').hidden = true; $('actions').textContent = ''; feedback(null, '');
  }
  function button(label, onClick) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.innerHTML = '<span></span><svg><use href="#i-arrow"/></svg>';
    b.querySelector('span').textContent = label; b.addEventListener('click', onClick); $('actions').appendChild(b); return b;
  }
  function succeed(st, text) {
    busy = false; glow(null); pointAt(null); $('hint').hidden = true; feedback('good', text || st.ok);
    if (st.status) setReadout(st.status[0], st.status[1]);
    button(stepIndex === STEPS.length - 1 ? 'Finish' : 'Next', function () { if (stepIndex === STEPS.length - 1) showEnd(); else showStep(stepIndex + 1); });
  }
  function showStep(i) {
    stepIndex = i; current = STEPS[i]; busy = false; clearTask(); paintProgress();
    body.dataset.screen = 'work';
    $('steptitle').textContent = current.title; $('bubble').textContent = current.say; $('ravi').hidden = false;
    lit(current.lit); view(current.view, false, i === 0 && fromOverview ? 1150 : 900); fromOverview = false; setChips(current.chips);
    if (current.choose) {
      var box = $('choices'); box.hidden = false;
      current.options.forEach(function (o) {
        var card = document.createElement('div'); card.className = 'choice';
        var pick = document.createElement('button'); pick.type = 'button'; pick.className = 'pick';
        pick.innerHTML = '<span class="words"></span><i class="mark" aria-hidden="true"></i>'; pick.querySelector('.words').textContent = o.text;
        pick.addEventListener('click', function () {
          if (pick.disabled) return;
          if (o.right) { box.querySelectorAll('.pick').forEach(function (x) { x.disabled = true; }); card.classList.add('right'); current.run(); setTimeout(function () { succeed(current, o.say); }, 900); }
          else { card.classList.add('wrong'); pick.disabled = true; feedback('miss', o.say); }
        });
        card.appendChild(pick); box.appendChild(card);
      });
    } else {
      $('hint').hidden = false; $('hintText').textContent = current.hint; glow(current.target);
      idleTimer = setTimeout(function () { pointAt(current.target); }, 6000);
    }
  }
  function showEnd() {
    clearTask(); lit(null); setChips([]); view('all'); body.dataset.screen = 'end';
    $('end_kind').textContent = END.kind; $('end_head').textContent = END.head; $('end_sub').textContent = END.sub;
    var ol = $('end_list'); ol.textContent = ''; END.list.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ol.appendChild(li); });
  }
  function reset() {
    svg.setAttribute('data-machine', 'on'); svg.setAttribute('data-floor', 'wet'); svg.setAttribute('data-cotton', 'near'); svg.setAttribute('data-ext', 'far');
    resetWater(); resetCotton(); resetFx(); setReadout('Floor: wet · Machine: ON', 'on'); showStep(0);
  }

  /* taps on the model: the target succeeds; any other known part gets a kind correction */
  svg.addEventListener('click', function (ev) {
    if (!current || !current.target || busy || body.dataset.screen !== 'work') return;
    var hit = ev.target.closest && ev.target.closest('[data-hit]');
    if (!hit) return;
    var id = hit.getAttribute('data-hit');
    if (id === current.target) { busy = true; current.run(); clearTimeout(idleTimer); setTimeout(function () { succeed(current); }, 1100); return; }
    var msg = (current.miss[id]) || current.miss.general;
    feedback('miss', msg); pointAt(current.target);
    var el = svg.querySelector('.obj[data-obj="' + id + '"]') || hit; el.classList.remove('flash-miss'); void el.getBoundingClientRect(); el.classList.add('flash-miss');
    setTimeout(function () { el.classList.remove('flash-miss'); }, 700);
  });
  $('showme').addEventListener('click', function () { if (current && current.target) { pointAt(current.target); view(current.view); } });
  $('t_start').addEventListener('click', function () { fromOverview = true; reset(); });
  $('end_again').addEventListener('click', function () { fromOverview = false; reset(); });
  $('end_back').addEventListener('click', function () { clearTask(); lit(null); setChips([]); body.dataset.screen = 'title'; view('all', false, 1100); });

  /* title: the whole bay, nothing dimmed */
  setReadout('Floor: wet · Machine: ON', 'on');
  view('all', true);
  window.LAB = { fx: { parts: PARTS, free: free }, cam: function () { return cam; }, STEPS: STEPS, svg: svg, showStep: showStep, view: view, VIEWS: VIEWS };
})();
