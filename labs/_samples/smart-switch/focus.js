/* SAMPLE focus system for the smart-switch lab (2026-11-25). Loaded after figscript.js (which makes window.FIG) and before wb.js.
   1. tight named views per step;
   2. "lit target dims the rest": every board item whose box lies outside the step's focus rectangle is darkened, the target is never dimmed;
   3. light that behaves: lamp strike (flicker + warm wash), Wi-Fi halo and signal rings when the switch pairs / goes online. */
(function () {
  "use strict";
  var FIG = window.FIG, svg = FIG.svg, NS = "http://www.w3.org/2000/svg";
  var one = function (s) { return svg.querySelector(s); };
  var all = function (s) { return svg.querySelectorAll(s); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. views: each frames only what the step is about (svg units: x, y, w, h) ---- */
  Object.assign(FIG.views, {
    terminals: [432, 262, 118, 140],   // the four wires and the terminal strip
    mcb: [212, 126, 116, 84],          // the three breakers
    plate: [402, 236, 186, 168],       // the fitted switch plate with its Wi-Fi light
    lamps: [412, 128, 262, 246],       // both lamps and the switch plate under them
  });
  var FOCUS = {   // focus rectangles, a little wider than the view so the edge of the frame stays lit
    terminals: [420, 250, 142, 164], mcb: [204, 118, 132, 100], plate: [394, 228, 202, 184], lamps: [404, 120, 250, 262],
  };

  /* ---- 2. dim the rest ---- */
  var items = Array.prototype.slice.call(all(".layer-back > *, .layer-front > *, .layer-over > *, .layer-box > *"));
  var cache = new WeakMap();
  function box(el) {
    var b = cache.get(el);
    if (b) return b;
    try { var r = el.getBBox(); if (r.width > 0 || r.height > 0) { b = { x: r.x, y: r.y, w: r.width, h: r.height }; cache.set(el, b); } } catch (e) { /* not rendered yet */ }
    return b || null;
  }
  var focusRect = null, target = [];
  function applyFocus() {
    if (!focusRect) { items.forEach(function (el) { el.classList.remove("fdim"); }); return; }
    var f = focusRect, fa = f[2] * f[3];
    items.forEach(function (el) {
      var b = box(el);
      if (!b) return;
      var inter = !(b.x > f[0] + f[2] || b.x + b.w < f[0] || b.y > f[1] + f[3] || b.y + b.h < f[1]);
      var big = b.w * b.h > fa * 3.5;   // long conduits and the backboard: judged by their middle, not their reach
      var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      var inside = big ? (cx > f[0] && cx < f[0] + f[2] && cy > f[1] && cy < f[1] + f[3]) : inter;
      var holdsTarget = target.some(function (t) { return el.contains(t); });
      var pipe = !!el.querySelector(".conduit");   // conduits are infrastructure: never the point of a step
      el.classList.toggle("fdim", (!inside || pipe) && !holdsTarget);
    });
    // the other breakers are look-alikes of the target: step them back a little (still readable, still tappable)
    all("[data-soft]").forEach(function (el) { el.removeAttribute("data-soft"); });
    if (target.length && target.some(function (t) { return t.getAttribute("data-hit") === "lights"; })) {
      ["main", "sockets"].forEach(function (id) { all('[data-hit="' + id + '"]').forEach(function (el) { el.setAttribute("data-soft", ""); }); });
    }
  }
  var later = 0;
  function schedule(ms) { clearTimeout(later); later = setTimeout(applyFocus, ms); }
  FIG.onView = function (name, instant) { focusRect = FOCUS[name] || null; if (instant) applyFocus(); else schedule(30); schedule(500); };
  var aim = document.createElementNS(NS, "g"); aim.setAttribute("pointer-events", "none"); svg.appendChild(aim);
  FIG.onGlow = function (ids) {
    aim.textContent = "";
    ids.forEach(function (id) {   // a terminal is where the wire is going: ring it
      if (id.indexOf("t-") !== 0 || !FIG.anchors[id]) return;
      var c = document.createElementNS(NS, "circle"), a = FIG.anchors[id];
      c.setAttribute("cx", a[0]); c.setAttribute("cy", a[1] - 1.5); c.setAttribute("r", 5.2); c.setAttribute("class", "aim-ring");
      aim.appendChild(c);
    });
    target = [];
    ids.forEach(function (id) { all('[data-hit="' + id + '"]').forEach(function (el) { target.push(el); }); });
    applyFocus();
  };

  /* ---- 3. light that behaves ---- */
  var defs = svg.querySelector("defs");
  var g = document.createElementNS(NS, "defs");
  g.innerHTML =
    '<radialGradient id="lampwash"><stop offset="0" stop-color="#ffc766" stop-opacity=".34"/><stop offset=".55" stop-color="#ffb347" stop-opacity=".10"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="wifihalo"><stop offset="0" stop-color="#7cc4ff" stop-opacity=".85"/><stop offset=".4" stop-color="#4a9bff" stop-opacity=".22"/><stop offset="1" stop-color="#4a9bff" stop-opacity="0"/></radialGradient>';
  svg.insertBefore(g, svg.firstChild);

  // a wide warm wash behind each lamp, on top of the figure's own warm pool
  var wash = {};
  ["hall", "balcony"].forEach(function (id) {
    var c = FIG.anchors["glow-" + id], pool = one('[data-glow-for="' + id + '"]');
    var e = document.createElementNS(NS, "ellipse");
    e.setAttribute("cx", c[0]); e.setAttribute("cy", c[1] + 30); e.setAttribute("rx", 230); e.setAttribute("ry", 175);
    e.setAttribute("fill", "url(#lampwash)"); e.setAttribute("class", "lamp-glow lamp-wash");
    e.style.opacity = "0";
    pool.parentNode.insertBefore(e, pool.nextSibling);
    wash[id] = e;
  });
  function strike(id, on) {
    var pool = one('[data-glow-for="' + id + '"]'), w = wash[id];
    if (!pool) return;
    pool.classList.remove("strike"); void pool.getBoundingClientRect();
    if (on && !reduced) pool.classList.add("strike");   // a lamp does not come on like a switch: it flickers, then settles warm
    w.style.transition = on ? "opacity 1.1s ease .25s" : "opacity .5s ease";
    w.style.opacity = on ? "1" : "0";
  }

  // Wi-Fi: a blue halo on the switch's light and rings that travel out; blue is only ever the Wi-Fi and the app
  var sig = document.createElementNS(NS, "g");
  sig.setAttribute("class", "wifi-sig"); sig.setAttribute("pointer-events", "none");
  svg.appendChild(sig);
  var sigAt = null;
  function ledCentre() {
    var led = one(".wifi-led");
    if (!led) return null;
    try { var b = led.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2]; } catch (e) { return null; }
  }
  function wifiSignal(mode) {
    sig.textContent = "";
    if (mode === "off") return;
    var p = ledCentre();
    if (!p || (p[0] === 0 && p[1] === 0)) { p = FIG.anchors["t-L2"] ? [FIG.anchors["t-L2"][0] - 5, FIG.anchors["t-L2"][1] - 100] : [490, 290]; }
    var halo = document.createElementNS(NS, "circle");
    halo.setAttribute("cx", p[0]); halo.setAttribute("cy", p[1]); halo.setAttribute("r", 40); halo.setAttribute("fill", "url(#wifihalo)");
    halo.setAttribute("class", "wifi-halo" + (mode === "blink" ? " blink" : ""));
    sig.appendChild(halo);
    for (var i = 0; i < 3; i++) {
      var r = document.createElementNS(NS, "circle");
      r.setAttribute("cx", p[0]); r.setAttribute("cy", p[1]); r.setAttribute("r", 9);
      r.setAttribute("class", "wifi-ring"); r.style.animationDelay = (i * 0.8) + "s";
      r.style.animationDuration = mode === "blink" ? "2.4s" : "3.2s";
      sig.appendChild(r);
    }
  }

  var baseOp = FIG.op, baseReset = FIG.reset;
  FIG.op = function (text, instant) {
    var p = text.split(":"), out = baseOp(text, instant);
    if (p[0] === "bulb") strike(p[1], p[2] === "on");
    if (p[0] === "wifi") wifiSignal(p[1]);
    if (p[0] === "box" || p[0] === "bench" || p[0] === "tag" || p[0] === "newN") schedule(520);
    return out;
  };
  // the board always starts as the earlier steps of the job leave it, title screen included
  FIG.reset = function () {
    baseReset(); strike("hall", false); strike("balcony", false); wifiSignal("off");
    ((window.WORKBENCH && window.WORKBENCH.en && window.WORKBENCH.en.prelude) || []).forEach(function (o) { FIG.op(o, true); });
  };
  FIG.reset();
})();
