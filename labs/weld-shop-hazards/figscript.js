/* The bay's moving parts, driven by the lesson through FIG.op("kind:a"), plus the focus (lit / dim) state per step and the natural effects:
   water (uneven drying, ripples, reflections), cotton (lifted into the bin), sparks and arc (particles with gravity and bounce),
   fire (layered flames) and smoke. Every op is safe to run twice: the player replays earlier ops when a board is rebuilt. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var G = window.FIG_GEOM, P = G.P, DATA = window.FIG_DATA;
  var svg = document.querySelector("#stage svg");
  var one = function (sel) { return svg.querySelector(sel); };
  var all = function (sel) { return svg.querySelectorAll(sel); };
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n) { return n.toFixed(1); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var readoutKey = "r1";
  var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  function fade(el, show, instant) {
    if (!el) return;
    el.style.transition = instant || reduced ? "none" : "opacity 450ms ease";
    if (show) {
      el.style.display = "";
      if (instant || reduced) el.style.opacity = "1";
      else { el.style.opacity = "0"; void el.getBoundingClientRect(); requestAnimationFrame(function () { el.style.opacity = "1"; }); }
    } else if (instant || reduced) { el.style.opacity = "0"; el.style.display = "none"; }
    else { el.style.opacity = "0"; setTimeout(function () { if (el.style.opacity === "0") el.style.display = "none"; }, 480); }
  }
  function cancelAnims(el) { if (el && el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }

  /* ---------------------------------------------------------------- water: an irregular puddle that dries unevenly */
  var pudIds = ["pBase", "pRim", "pRimGlow", "pSpec", "pClip"], dryRaf = 0;
  function setPuddle(e) { var d = G.puddlePath(e); pudIds.forEach(function (id) { $(id).setAttribute("d", d); }); }
  function dryPuddle(instant) {
    cancelAnimationFrame(dryRaf);
    svg.setAttribute("data-floor", "dry");
    if (instant || reduced) { setPuddle(1); $("pudGroup").style.display = "none"; $("pDamp").style.opacity = ".4"; return; }
    var t0 = performance.now(), dur = 2800;
    (function tick(now) {
      var t = Math.min(1, (now - t0) / dur), e = ease(t);
      setPuddle(e); $("pudGroup").style.opacity = Math.max(0, 1 - Math.max(0, (t - .6) / .4));
      $("pDamp").style.opacity = String(.1 + .3 * e);
      if (t < 1) dryRaf = requestAnimationFrame(tick); else $("pudGroup").style.display = "none";
    })(t0);
  }
  function wetAgain() {
    cancelAnimationFrame(dryRaf); svg.setAttribute("data-floor", "wet"); setPuddle(0);
    $("pudGroup").style.display = ""; $("pudGroup").style.opacity = 1; $("pDamp").style.opacity = "";
  }

  /* ---------------------------------------------------------------- cotton: lifted, carried over the cable and dropped into the bin */
  function cottonAway(instant) {
    var g = $("cottonGrp"), dx = +g.dataset.dx, dy = +g.dataset.dy;
    cancelAnims(g);
    svg.setAttribute("data-cotton", "binned");
    if (instant || reduced) { g.style.opacity = "0"; return; }
    var kf = [
      { transform: "translate(0px,0px) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      { transform: "translate(" + f(dx * .28) + "px," + f(dy * .28 - 56) + "px) scale(1.12) rotate(-6deg)", opacity: 1, offset: .38 },
      { transform: "translate(" + f(dx * .82) + "px," + f(dy * .82 - 34) + "px) scale(.82) rotate(3deg)", opacity: 1, offset: .76 },
      { transform: "translate(" + f(dx) + "px," + f(dy + 6) + "px) scale(.42) rotate(0deg)", opacity: 0, offset: 1 }];
    g.animate(kf, { duration: 1400, easing: "cubic-bezier(.4,0,.25,1)", fill: "forwards" });
  }
  function cottonBack() { var g = $("cottonGrp"); cancelAnims(g); g.style.opacity = ""; svg.setAttribute("data-cotton", "near"); }

  /* ---------------------------------------------------------------- stubs hop from the floor into the steel bin */
  var STUB_D = (function () {
    var a = P(1.4, 3.8, .1), b = P(3.6, 6.1, 1.05);
    return [b[0] - a[0], b[1] - a[1] - 4];
  })();
  function stubs(inBin, instant) {
    var g = one('[data-obj="stubs"]');
    cancelAnims(g);
    var end = "translate(" + f(STUB_D[0]) + "px," + f(STUB_D[1]) + "px) rotate(-50deg)";
    if (!inBin) { g.style.transform = ""; g.style.transformOrigin = ""; g.style.opacity = ""; return; }
    g.style.transformBox = "fill-box"; g.style.transformOrigin = "50% 50%";
    if (instant || reduced) { g.style.transform = end; return; }
    var mid = "translate(" + f(STUB_D[0] / 2) + "px," + f(STUB_D[1] / 2 - 90) + "px) rotate(-120deg)";
    var an = g.animate([{ transform: "translate(0,0) rotate(0deg)" }, { transform: mid }, { transform: end }], { duration: 950, easing: "ease-in-out" });
    an.onfinish = function () { g.style.transform = end; };
  }

  /* ---------------------------------------------------------------- extinguisher: in the locked store, or standing at its marked spot */
  function ext(where, instant) {
    var near = $("extNear"), store = $("extStore");
    cancelAnims(near);
    store.style.display = where === "store" ? "" : "none";
    svg.setAttribute("data-ext", where === "near" ? "near" : where === "store" ? "store" : "off");
    if (where === "near") {
      fade(near, true, instant);
      if (!instant && !reduced) near.animate([{ transform: "translateY(-70px)" }, { transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(.3,1.4,.5,1)" });
    } else fade(near, false, instant);
  }

  /* ---------------------------------------------------------------- soapstone marks the hot plate with a chalk cross */
  function mark(on, instant) {
    var g = $("chalkGrp"), paths = g.querySelectorAll("path"), soap = $("soapGrp");
    cancelAnims(soap);
    paths.forEach(function (p) { cancelAnims(p); });
    if (!on) { g.style.opacity = "0"; paths.forEach(function (p) { p.style.strokeDashoffset = "1"; }); return; }
    g.style.opacity = "1";
    if (instant || reduced) { paths.forEach(function (p) { p.style.strokeDashoffset = "0"; }); return; }
    paths.forEach(function (p, i) {
      p.style.strokeDashoffset = "1";
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 650, delay: 350 + i * 650, easing: "ease-in-out", fill: "forwards" });
    });
    soap.animate([{ transform: "translate(0,0)" }, { transform: "translate(-54px,-22px) rotate(-8deg)", offset: .25 }, { transform: "translate(-110px,-34px) rotate(6deg)", offset: .6 }, { transform: "translate(-54px,-18px)", offset: .85 }, { transform: "translate(0,0)" }], { duration: 1900, easing: "ease-in-out" });
  }

  /* ---------------------------------------------------------------- machine, arc, mains plug */
  function machine(on) {
    svg.setAttribute("data-machine", on ? "on" : "off");
    if (!on) { setArc(false); }
  }
  function setArc(on, quiet) {
    var was = svg.getAttribute("data-arc") === "on";
    svg.setAttribute("data-arc", on ? "on" : "off");
    if (on) { offAt = -1; nextBurst = 0; }
    else if (was && !quiet) { offAt = performance.now(); spawn(8, true); }
  }
  function cord(on, instant) {
    var g = $("plugGrp"), dx = +g.dataset.dx, dy = +g.dataset.dy;
    svg.setAttribute("data-cord", on ? "on" : "off");
    g.style.transition = instant || reduced ? "none" : "transform 900ms cubic-bezier(.3,1.2,.4,1)";
    g.style.transform = on ? "" : "translate(" + f(dx) + "px," + f(dy) + "px) rotate(-14deg)";
    g.style.transformBox = "fill-box"; g.style.transformOrigin = "50% 50%";
  }
  function flash(id) {
    all('[data-hit="' + id + '"]').forEach(function (el) {
      el.classList.remove("flash-miss"); void el.getBoundingClientRect(); el.classList.add("flash-miss");
      setTimeout(function () { el.classList.remove("flash-miss"); }, 900);
    });
  }

  /* ---------------------------------------------------------------- sparks: pooled lines, gravity, bounce on the plate, white -> orange -> red -> ember */
  var ARC = P(6.32, 1.62, 2.05), BEAD_END = P(7.0, 1.6, 2.0), fx = $("fx"), PARTS = [], MAXP = 110, free = [], nextBurst = 0, offAt = -1, lastT = 0, burst = 0;
  (function () {
    for (var i = 0; i < MAXP; i++) {
      var h = document.createElementNS(NS, "line"), c = document.createElementNS(NS, "line");
      h.setAttribute("stroke-linecap", "round"); c.setAttribute("stroke-linecap", "round"); h.style.display = c.style.display = "none";
      fx.appendChild(h); fx.appendChild(c); PARTS.push({ h: h, c: c, on: false }); free.push(i);
    }
  })();
  function sparkColor(a) {
    var r, g, b, t;
    if (a < .15) { r = 255; g = 246; b = 220; } else if (a < .5) { t = (a - .15) / .35; r = 255; g = 246 - 70 * t; b = 220 - 140 * t; }
    else if (a < .8) { t = (a - .5) / .3; r = 255 - 31 * t; g = 176 - 104 * t; b = 80 - 56 * t; } else { t = (a - .8) / .2; r = 224 - 164 * t; g = 72 - 50 * t; b = 24 - 14 * t; }
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  }
  function spawn(n, ember) {
    while (n-- > 0 && free.length) {
      var p = PARTS[free.pop()], an = -Math.PI * (.08 + Math.random() * .84), sp = 90 + Math.random() * 240;
      p.on = true; p.age = 0; p.b = 0; p.ember = !!ember; p.life = ember ? 3.5 + Math.random() * 3 : .5 + Math.random() * .95; p.w = .45 + Math.random() * .55;
      if (ember) { var k = Math.random(); p.x = ARC[0] + (BEAD_END[0] - ARC[0]) * k; p.y = ARC[1] + (BEAD_END[1] - ARC[1]) * k + 2; p.vx = p.vy = 0; p.w = 1.1 + Math.random() * .8; }
      else { p.x = ARC[0] + (Math.random() - .5) * 4; p.y = ARC[1] + (Math.random() - .5) * 3; p.vx = Math.cos(an) * sp * (.8 + Math.random() * .5); p.vy = Math.sin(an) * sp; }
      p.py = ARC[1] + 7 + Math.random() * 12; p.h.style.display = p.c.style.display = "";
    }
  }
  function killP(i) { var p = PARTS[i]; p.on = false; p.h.style.display = p.c.style.display = "none"; free.push(i); }
  var arcCore = $("arcCore"), arcHalo = $("arcHalo"), arcBloom = $("arcBloom"), arcBolt = $("arcBolt"), bayGlow = $("bayGlow"), beadHot = $("beadHot");
  function camSees(x, y) {
    var v = (svg.getAttribute("viewBox") || "0 0 1000 640").split(" ").map(Number);
    return x > v[0] - 60 && x < v[0] + v[2] + 60 && y > v[1] - 60 && y < v[1] + v[3] + 60;
  }
  function fxLoop(now) {
    requestAnimationFrame(fxLoop);
    var dt = Math.min(.04, (now - lastT) / 1000 || .016); lastT = now;
    var on = svg.getAttribute("data-arc") === "on", seen = camSees(ARC[0], ARC[1]);
    if (on && seen && !reduced) {
      var j = .75 + Math.random() * .5;
      arcCore.setAttribute("r", (2.6 + Math.random() * 1.8).toFixed(1)); arcHalo.setAttribute("r", (30 * j).toFixed(1)); arcBloom.setAttribute("r", (62 * (.85 + Math.random() * .3)).toFixed(1));
      arcBloom.style.opacity = (.35 + Math.random() * .25).toFixed(2); bayGlow.style.opacity = (.8 + Math.random() * .2).toFixed(2);
      var bx = ARC[0], by = ARC[1], d = "M" + bx.toFixed(1) + "," + by.toFixed(1), q;
      for (q = 0; q < 3; q++) { bx += (Math.random() - .5) * 9; by -= 2 + Math.random() * 5; d += "L" + bx.toFixed(1) + "," + by.toFixed(1); }
      arcBolt.setAttribute("d", d);
      nextBurst -= dt;
      if (nextBurst <= 0) { spawn(2 + (Math.random() * 5 | 0)); nextBurst = .07 + Math.random() * .22; if (Math.random() < .1) spawn(12); }
      beadHot.style.opacity = (.4 + Math.random() * .25).toFixed(2);
    } else if (!on) {
      var cool = offAt < 0 ? 1 : Math.min(1, (now - offAt) / 6000);
      beadHot.style.opacity = svg.getAttribute("data-plate") === "hot" ? ".55" : (.45 * (1 - cool)).toFixed(2);
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
      p.c.setAttribute("x1", x0); p.c.setAttribute("y1", y0); p.c.setAttribute("x2", x1); p.c.setAttribute("y2", y1); p.c.setAttribute("stroke", col); p.c.setAttribute("stroke-width", (p.w * (1 - a * .5)).toFixed(2)); p.c.style.opacity = (al * hide).toFixed(2);
      p.h.setAttribute("x1", x0); p.h.setAttribute("y1", y0); p.h.setAttribute("x2", x1); p.h.setAttribute("y2", y1); p.h.setAttribute("stroke", col); p.h.setAttribute("stroke-width", (p.w * 3.2).toFixed(2)); p.h.style.opacity = (al * .22 * hide).toFixed(2);
    }
  }
  requestAnimationFrame(fxLoop);
  function resetFx() { for (var i = 0; i < MAXP; i++) if (PARTS[i].on) killP(i); offAt = -1; nextBurst = 0; }

  /* ---------------------------------------------------------------- focus: what is lit in each step; everything else steps back */
  var LIT = {
    s1: ["wet", "cable", "machine"], s2: ["waste", "bin"], s3: ["stubs", "bin"], s4: ["machine", "switch", "trainee"],
    s5: ["ext", "cab", "bench"], s6: ["bench"], s7: ["bench", "soap"], s8: ["machine", "switch", "socket"]
  };
  var ARC_ON = { s1: 1, s2: 1 };   // someone is welding while the wet floor and the cotton are looked at; the arc rests from step 3 on
  function lit(ids) {
    all(".obj").forEach(function (el) { el.removeAttribute("data-lit"); });
    if (!ids) { svg.removeAttribute("data-focus"); return; }
    svg.setAttribute("data-focus", "");
    ids.forEach(function (id) { all('.obj[data-obj="' + id + '"]').forEach(function (e) { e.setAttribute("data-lit", ""); }); });
  }
  var stepViews = { s1: "wet", s2: "cotton", s3: "stubs", s4: "machine", s5: "ext", s6: "plate", s7: "plate", s8: "machine" };
  function step(id) {
    if (!id) { lit(null); return; }
    lit(LIT[id]);
    if (svg.getAttribute("data-machine") === "on") setArc(!!ARC_ON[id], true);
  }

  /* ---------------------------------------------------------------- the lesson's ops */
  function op(text, instant) {
    var p = text.split(":");
    switch (p[0]) {
      case "wet": return p[1] === "on" ? wetAgain() : dryPuddle(instant);
      case "waste": return p[1] === "on" ? cottonBack() : cottonAway(instant);
      case "stubs": return stubs(p[1] === "bin", instant);
      case "trainee": return fade($("traineeGrp"), p[1] === "on", instant);
      case "ext": return ext(p[1], instant);
      case "fire": return fade($("fireGrp"), p[1] === "on", instant);
      case "spark": if (p[1] === "on") { svg.setAttribute("data-spark", "on"); setArc(true); } else { svg.removeAttribute("data-spark"); setArc(false); } return;
      case "plate": svg.setAttribute("data-plate", p[1] === "hot" ? "hot" : "cool"); return;
      case "mark": return mark(p[1] === "on", instant);
      case "machine": return machine(p[1] === "on");
      case "cord": return cord(p[1] === "on", instant);
      case "flash": return flash(p[1]);
      case "readout":
        readoutKey = p[1];
        var tg = $("traineeGrp");   // the answer to step 4 (the lesson moves on to r5) lights the lock plate green: only the authorised person has the key
        if (tg) { if (p[1] === "r5") tg.setAttribute("data-ok", ""); else tg.removeAttribute("data-ok"); }
        return;
    }
  }
  function reset() {
    op("wet:on", true); op("waste:on", true); op("stubs:floor", true); op("trainee:off", true); op("ext:off", true);
    op("fire:off", true); svg.removeAttribute("data-spark"); op("plate:cool", true); op("mark:off", true); op("cord:on", true);
    svg.setAttribute("data-machine", "on"); svg.setAttribute("data-arc", "on"); resetFx(); lit(null);
    readoutKey = "r1";
  }
  var CHIP_OBJ = { machine: "machine", dial: "machine", switch: "machine", bench: "bench", plate: "bench", soap: "soap", bin: "bin", stubs: "stubs", wet: "wet", waste: "waste", trainee: "trainee", plug: "socket", ext: "ext", cab: "cab" };
  function chipOk(at) {   // a label stays only on a part that is lit in this step
    if (!svg.hasAttribute("data-focus")) return true;
    var o = CHIP_OBJ[at]; var el = o && svg.querySelector('.obj[data-obj="' + o + '"]');
    return !el || el.hasAttribute("data-lit");
  }
  window.FIG = {
    svg: svg, views: DATA.views, anchors: DATA.anchors, op: op, reset: reset, readout: function () { return readoutKey; },
    step: step, stepViews: stepViews, chipOk: chipOk, quiet: function () { setArc(false, true); }
  };
  Object.keys(stepViews).forEach(function (k) { /* every step view must exist */ if (!DATA.views[stepViews[k]]) throw new Error("missing view " + stepViews[k]); });
  reset();
})();
