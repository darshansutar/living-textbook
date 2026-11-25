// The board's moving parts, driven by the lesson through FIG.op("kind:a:b").
(function () {
  var DATA = window.FIG_DATA;
  var svg = document.querySelector("#stage svg");
  var one = function (sel) { return svg.querySelector(sel); };
  var all = function (sel) { return svg.querySelectorAll(sel); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = {};

  function fade(el, show, instant) {
    if (!el) return;
    el.style.transition = instant || reduced ? "none" : "opacity 450ms ease";
    if (show) {
      el.style.display = "";
      if (instant) el.style.opacity = "1";
      else requestAnimationFrame(function () { el.style.opacity = "1"; });
    } else {
      el.style.opacity = "0";
    }
  }
  function show(sel, on, instant) { all(sel).forEach(function (el) { fade(el, on, instant); }); }

  // levers: seven prebuilt frames, 0 = on (up), 6 = off (down)
  var leverAt = {};
  function lever(id, on, instant) {
    var g = one('[data-lever="' + id + '"]');
    var frames = g.querySelectorAll("[data-f]");
    var from = leverAt[id] == null ? 0 : leverAt[id];
    var to = on ? 0 : frames.length - 1;
    leverAt[id] = to;
    var paint = function (f) { frames.forEach(function (el, i) { el.style.display = i === f ? "" : "none"; }); };
    if (instant || reduced) return paint(to);
    var f = from;
    var step = function () {
      if (f === to) return;
      f += to > f ? 1 : -1;
      paint(f);
      setTimeout(step, 26);
    };
    step();
  }
  function bulb(id, on) {
    var b = one('[data-bulb="' + id + '"]');
    if (on) b.setAttribute("data-on", ""); else b.removeAttribute("data-on");
    var glowEl = one('[data-glow-for="' + id + '"]');
    if (glowEl) glowEl.style.opacity = on ? "1" : "0";
    state[id] = on;
  }
  var boxNow = "closed";
  function box(name, instant) {
    if (name === boxNow && !instant) return;
    all("[data-box]").forEach(function (g) {
      var mine = g.getAttribute("data-box");
      if (mine === name) {
        g.style.display = "";
        g.style.transition = "none";
        g.style.opacity = instant || reduced ? "1" : "0";
        if (!instant && !reduced) requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transition = "opacity 420ms ease"; g.style.opacity = "1"; }); });
      } else if (mine === boxNow && !instant && !reduced) {
        g.style.transition = "opacity 420ms ease";
        g.style.opacity = "0";
        setTimeout(function () { if (boxNow !== mine) g.style.display = "none"; }, 440);
      } else {
        g.style.display = "none";
      }
    });
    boxNow = name;
  }
  function tester(where, instant) {
    all("[data-tester]").forEach(function (g) {
      var name = g.getAttribute("data-tester");
      var on = (where === "bench" && name === "tester.bench") || name === "tester." + where;
      if (where === "off") on = name === "tester.bench";
      g.style.transition = instant || reduced ? "none" : "opacity 350ms ease";
      g.style.opacity = on ? "1" : "0";
      g.style.pointerEvents = on ? "" : "none";
    });
  }
  function neon(on) {
    all(".neon").forEach(function (n) { if (on) n.setAttribute("data-on", ""); else n.removeAttribute("data-on"); });
  }
  function router(on) {
    var leds = one(".router-leds");
    if (on) leds.setAttribute("data-on", ""); else leds.removeAttribute("data-on");
  }
  function wifi(mode) {
    var led = one(".wifi-led");
    if (!led) return;
    led.removeAttribute("data-on");
    led.removeAttribute("data-blink");
    if (mode === "blink") led.setAttribute("data-blink", "");
    if (mode === "on") led.setAttribute("data-on", "");
  }
  function pad(n, on) {
    var p = one('[data-pad="' + n + '"]');
    if (on) p.setAttribute("data-on", ""); else p.removeAttribute("data-on");
  }

  // the page words for each key live in the lesson (ui.readout)
  var readoutKey = "on";

  // instant: jump straight to the end state, used to set the board up for a chapter
  function op(text, instant) {
    var p = text.split(":");
    switch (p[0]) {
      case "lever": return lever(p[1], p[2] === "on", instant);
      case "bulb": return bulb(p[1], p[2] === "on");
      case "box": return box(p[1], instant);
      case "tag": return show('[data-part="tag"]', p[1] === "on", instant);
      case "newN": return show('[data-part="new-n"]', p[1] === "on", instant);
      case "bench": return show('[data-part="' + (p[1] === "old" ? "old-on-bench" : "smart-on-bench") + '"]', p[2] === "on", instant);
      case "tester": return tester(p[1], instant);
      case "neon": return neon(p[1] === "on");
      case "router": return router(p[1] === "on");
      case "wifi": return wifi(p[1]);
      case "pad": return pad(p[1], p[2] === "on");
      case "readout": readoutKey = p[1]; return;
    }
  }

  function reset() {
    ["main", "lights", "sockets"].forEach(function (id) { lever(id, true, true); });
    bulb("hall", true);
    bulb("balcony", false);
    pad(1, false);
    pad(2, false);
    box("closed", true);
    all('[data-part="tag"],[data-part="new-n"],[data-part="old-on-bench"]').forEach(function (el) { el.style.transition = "none"; el.style.opacity = "0"; });
    var smart = one('[data-part="smart-on-bench"]');
    smart.style.transition = "none";
    smart.style.opacity = "1";
    tester("off", true);
    neon(false);
    router(true);
    wifi("off");
    readoutKey = "on";
  }

  // a warm pool of light on the board behind each lamp
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = '<radialGradient id="lampglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset=".45" stop-color="#ffb84a" stop-opacity=".16"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>';
  svg.insertBefore(defs, svg.firstChild);
  var backLayer = one(".layer-back");
  ["hall", "balcony"].forEach(function (id) {
    var c = DATA.anchors["glow-" + id];
    var e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    e.setAttribute("cx", c[0]);
    e.setAttribute("cy", c[1] + 12);
    e.setAttribute("rx", 120);
    e.setAttribute("ry", 95);
    e.setAttribute("fill", "url(#lampglow)");
    e.setAttribute("class", "lamp-glow");
    e.setAttribute("data-glow-for", id);
    backLayer.parentNode.insertBefore(e, backLayer.nextSibling);
  });

  window.FIG = {
    svg: svg,
    views: DATA.views,
    anchors: DATA.anchors,
    op: op,
    reset: reset,
    readout: function () { return readoutKey; },
  };
})();
