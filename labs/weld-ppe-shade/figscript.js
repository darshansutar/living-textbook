// The station's moving parts, driven by the lesson through FIG.op("kind:a:b"). Same op names as before, so lesson.js and the
// audio keys are untouched. Every op is safe to run twice. New here: the lit / dimmed focus (set from the step's readout key),
// the arc's spark particles, and a verdict colour on the picked filter glass.
(function () {
  "use strict";
  var DATA = window.FIG_DATA, GEO = window.FIG_GEOM;
  var svg = document.querySelector("#stage svg");
  var one = function (sel) { return svg.querySelector(sel); };
  var all = function (sel) { return Array.prototype.slice.call(svg.querySelectorAll(sel)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var readoutKey = "s1", timers = [], curAmps = 0, atBench = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function flag(el, name, on) { if (!el) return; if (on) el.setAttribute(name, ""); else el.removeAttribute(name); }

  /* ---------- focus: the parts of this step are lit, the rest step back ---------- */
  var FOCUS = {
    s1: ["mallesh", "item-apron", "item-cape"],
    s2: ["mallesh", "item-gloves"],
    s3: ["mallesh", "boots"],
    s4: ["mallesh", "item-helmet", "item-screen"],
    s5: ["stand", "mallesh"],
    s6: ["stand", "mallesh"],
    s7: ["mallesh", "table", "plate", "item-goggles"],
    s8: ["mallesh", "table", "plate", "trainee", "canvas"]
  };
  function focus(list) {
    all(".obj").forEach(function (el) { el.removeAttribute("data-lit"); });
    if (!list) { svg.removeAttribute("data-focus"); return; }
    svg.setAttribute("data-focus", "");
    list.forEach(function (id) { var e = one('.obj[data-obj="' + id + '"]'); if (e) e.setAttribute("data-lit", ""); });
  }

  /* ---------- gear: the lying piece flies to Mallesh, the worn piece settles on him ---------- */
  var WEAR_AT = { apron: [0, -62], cape: [0, -70], gloves: [0, -48], goggles: [0, -105], helmet: [0, -105], screen: [8, -98], boots: [0, -10] };
  function flyFrom(name) {   // where the worn piece starts, relative to where it is worn
    var el = one('[data-worn="' + name + '"]'), it = one('[data-item="' + name + '"]');
    if (!el || !it) return;
    var m = atBench ? GEO.m1 : GEO.m0, w = WEAR_AT[name];
    var cs = it.style, dx = parseFloat(cs.getPropertyValue("--dx")) || 0, dy = parseFloat(cs.getPropertyValue("--dy")) || 0;
    if (atBench) {   // the item's offset was measured for the first spot; shift by the way Mallesh walked
      dx += (GEO.m0[0] - GEO.m1[0]); dy += (GEO.m0[1] - GEO.m1[1]);
    }
    el.style.setProperty("--dx", (dx / 1.1).toFixed(0) + "px");
    el.style.setProperty("--dy", (dy / 1.1).toFixed(0) + "px");
  }
  function gear(name, on) {
    if (on) flyFrom(name);
    flag(one('[data-worn="' + name + '"]'), "data-on", on);
    flag(one('[data-item="' + name + '"]'), "data-gone", on);
  }
  function lens(kind) { all(".lens").forEach(function (el) { flag(el, "data-on", el.getAttribute("data-lens") === kind); }); }
  function pick(id) {
    var right = curAmps >= 200 ? "p13" : "p9";
    all("[data-plate]").forEach(function (el) {
      var on = el.getAttribute("data-plate") === id;
      flag(el, "data-pick", on);
      if (on) el.setAttribute("data-verdict", id === right ? "ok" : "bad"); else el.removeAttribute("data-verdict");
    });
  }
  function amps(a) {
    curAmps = a;
    var deg = -120 + 240 * Math.max(0, Math.min(400, a)) / 400;
    one("[data-needle]").style.transform = "rotate(" + deg + "deg)";
  }
  function part(name, on) { var el = one('[data-part="' + name + '"]'); if (el) el.style.opacity = on ? "1" : (name === "station" ? ".22" : "0"); }
  function rays(kind) { all("[data-rays]").forEach(function (el) { el.style.opacity = el.getAttribute("data-rays") === kind ? "1" : "0"; }); }
  function flash(id) {
    var els = all('[data-hit="' + id + '"]');
    els.forEach(function (el) { flag(el, "data-flash", true); });
    later(function () { els.forEach(function (el) { flag(el, "data-flash", false); }); }, 1000);
  }
  function moveMallesh(bench) {
    atBench = !!bench;
    var m = bench ? GEO.m1 : GEO.m0;
    one("[data-fig]").style.transform = "translate(" + m[0].toFixed(1) + "px," + m[1].toFixed(1) + "px)";
  }
  // the helper chips the slag: the hammer swings down three times, the crust breaks into shards that fly off, the bead shows clean
  function chip(on) {
    var h = one('[data-part="hammer"]'), c = one('[data-part="chips"]'), slags = all("[data-slag]");
    if (!on) { svg.classList.remove("chipping"); h.style.opacity = "0"; h.classList.remove("swing"); c.style.opacity = "0"; c.classList.remove("fly"); slags.forEach(function (s) { s.style.opacity = "1"; }); return; }
    svg.classList.add("chipping");
    h.style.opacity = "1"; h.classList.add("swing");
    later(function () { c.style.opacity = "1"; c.classList.add("fly"); slags.forEach(function (s) { s.style.opacity = "0"; }); }, 700);
    later(function () { c.style.opacity = "0"; h.style.opacity = "0"; h.classList.remove("swing"); svg.classList.remove("chipping"); }, 2700);
  }

  /* ---------- sparks: pooled lines with gravity, a bounce on the plate, white -> orange -> red -> dark ember ---------- */
  var layer = one(".sparks-layer"), MAXP = 34, PARTS = [], free = [], arcOn = false, raf = 0, last = 0, nextBurst = 0, NS = "http://www.w3.org/2000/svg";
  for (var i = 0; i < MAXP; i++) { var ln = document.createElementNS(NS, "line"); ln.setAttribute("class", "spark"); ln.style.display = "none"; layer.appendChild(ln); PARTS.push({ el: ln, on: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1 }); free.push(i); }
  function sparkColor(a) { return a < .22 ? "#ffffff" : a < .5 ? "#ffd27a" : a < .8 ? "#ff8a3a" : "#7a2a1a"; }
  function spawn(n) {
    for (var k = 0; k < n && free.length; k++) {
      var p = PARTS[free.pop()], ang = -Math.PI * (.15 + Math.random() * .7), sp = 70 + Math.random() * 150;
      p.on = true; p.x = GEO.arc[0] + (Math.random() - .5) * 3; p.y = GEO.arc[1] - 4; p.vx = Math.cos(ang) * sp * (Math.random() < .5 ? -1 : 1); p.vy = Math.sin(ang) * sp; p.age = 0; p.life = .6 + Math.random() * .6; p.el.style.display = "";
    }
  }
  function camSees() {
    var v = (svg.getAttribute("viewBox") || "0 0 1000 640").split(" ").map(Number);
    return GEO.arc[0] > v[0] - 40 && GEO.arc[0] < v[0] + v[2] + 40 && GEO.arc[1] > v[1] - 40 && GEO.arc[1] < v[1] + v[3] + 40;
  }
  function sparkLoop(now) {
    raf = 0;
    var dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
    var see = camSees();
    if (arcOn && see) {
      nextBurst -= dt;
      if (nextBurst <= 0) { spawn(2 + Math.floor(Math.random() * 4)); nextBurst = .12 + Math.random() * .3; }
    }
    var alive = 0, floorY = GEO.arc[1] + 9;
    PARTS.forEach(function (p, idx) {
      if (!p.on) return;
      p.age += dt; var a = p.age / p.life;
      if (a >= 1) { p.on = false; p.el.style.display = "none"; free.push(idx); return; }
      p.vy += 300 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y > floorY && p.vy > 0) { p.y = floorY; p.vy *= -.35; p.vx *= .7; }
      var col = sparkColor(a);
      p.el.setAttribute("x1", p.x.toFixed(1)); p.el.setAttribute("y1", p.y.toFixed(1));
      p.el.setAttribute("x2", (p.x - p.vx * .035).toFixed(1)); p.el.setAttribute("y2", (p.y - p.vy * .035).toFixed(1));
      p.el.setAttribute("stroke", col); p.el.style.opacity = (1 - a * .55).toFixed(2); alive++;
    });
    if ((arcOn && see) || alive) raf = requestAnimationFrame(sparkLoop);
  }
  function startSparks() { if (!raf && !reduced) { last = performance.now(); raf = requestAnimationFrame(sparkLoop); } }
  function arc(on) { arcOn = on; part("arc", on); if (on) { startSparks(); svg.setAttribute("data-arc", ""); } else svg.removeAttribute("data-arc"); }
  // the viewBox moves while the camera flies: keep the loop alive when the arc is on
  new MutationObserver(function () { if (arcOn) startSparks(); }).observe(svg, { attributes: true, attributeFilter: ["viewBox"] });

  function op(text, instant) {
    if (instant) { svg.classList.add("instant"); requestAnimationFrame(function () { requestAnimationFrame(function () { svg.classList.remove("instant"); }); }); }
    var p = text.split(":");
    switch (p[0]) {
      case "gear": return gear(p[1], p[2] === "on");
      case "helmet": if (p[1] === "on" || p[1] === "off") return gear("helmet", p[1] === "on"); return one("[data-helm]").setAttribute("data-helm", p[1]);
      case "screen":
        if (p[1] === "hold") return gear("screen", true);
        if (p[1] === "drop") return gear("screen", false);
        if (p[1] === "away") { flag(one('[data-item="screen"]'), "data-gone", true); return; }
        return;
      case "lens": return lens(p[1]);
      case "pick": return pick(p[1]);
      case "amps": return amps(Number(p[1]));
      case "plate": return part("plate", p[1] === "on");
      case "station": return part("station", p[1] === "on");
      case "chip": return chip(p[1] === "go");
      case "mallesh": return moveMallesh(p[1] === "bench");
      case "arc": return arc(p[1] === "on");
      case "rays": return rays(p[1]);
      case "trainee": return part("trainee", p[1] === "on");
      case "canvas": { var cv = one('[data-part="canvas"]'); cv.style.opacity = p[1] === "on" ? "1" : "0"; cv.style.transform = p[1] === "on" ? "none" : "translateY(-20px)"; return; }
      case "flare": { var f = one("[data-flare]"); f.style.opacity = p[1] === "on" ? "1" : "0"; flag(svg, "data-dazzled", p[1] === "on"); return; }
      case "flash": return flash(p[1]);
      case "readout": readoutKey = p[1]; return focus(FOCUS[p[1]] || null);
    }
  }

  function reset() {
    timers.forEach(clearTimeout); timers = [];
    ["boots", "cape", "apron", "gloves", "goggles", "helmet", "screen"].forEach(function (n) { gear(n, false); });
    one("[data-helm]").setAttribute("data-helm", "down");
    lens("off"); pick("off"); amps(0);
    ["plate", "arc", "trainee"].forEach(function (n) { part(n, false); });
    arcOn = false; svg.removeAttribute("data-arc");
    PARTS.forEach(function (p, idx) { if (p.on) { p.on = false; p.el.style.display = "none"; free.push(idx); } });
    part("station", true);
    chip(false);
    moveMallesh(false);
    rays("off");
    op("canvas:off"); op("flare:off");
    readoutKey = "s1";
    focus(null);
  }
  one("[data-fig]").style.transition = "transform 1.1s cubic-bezier(.4,0,.2,1)";

  window.FIG = { svg: svg, views: DATA.views, anchors: DATA.anchors, op: op, reset: reset, readout: function () { return readoutKey; } };
})();
