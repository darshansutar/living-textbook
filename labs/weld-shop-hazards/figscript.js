// The scene's moving parts, driven by the lesson through FIG.op("kind:a").
(function () {
  "use strict";
  var DATA = window.FIG_DATA;
  var svg = document.querySelector("#stage svg");
  var one = function (sel) { return svg.querySelector(sel); };
  var all = function (sel) { return svg.querySelectorAll(sel); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var readoutKey = "r1";

  function fade(el, show, instant) {
    if (!el) return;
    el.style.transition = instant || reduced ? "none" : "opacity 450ms ease";
    if (show) {
      el.style.display = "";
      if (instant || reduced) el.style.opacity = "1";
      else { el.style.opacity = "0"; void el.getBoundingClientRect(); requestAnimationFrame(function () { el.style.opacity = "1"; }); }
    } else if (instant || reduced) { el.style.opacity = "0"; el.style.display = "none"; }
    else {
      el.style.opacity = "0";
      setTimeout(function () { if (el.style.opacity === "0") el.style.display = "none"; }, 480);
    }
  }
  function part(name) { return one('[data-part="' + name + '"]'); }
  function cancelAnims(el) { if (el && el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }

  // the steel bin: the stubs hop from the floor into the bin and stand in its mouth
  var STUB_D = (function () {
    var a = [6.35, 4.35], b = [9.3, 3.5];
    var S = 44, cx = 0.866 * S, cy = 0.5 * S;
    return [((b[0] - b[1]) - (a[0] - a[1])) * cx, ((b[0] + b[1]) - (a[0] + a[1])) * cy - 1.2 * S + 8];
  })();
  function stubs(inBin, instant) {
    var g = part("stubs");
    cancelAnims(g);
    var end = "translate(" + STUB_D[0].toFixed(1) + "px," + STUB_D[1].toFixed(1) + "px) rotate(-50deg)";
    if (!inBin) { g.style.transform = ""; g.style.transformOrigin = ""; return; }
    g.style.transformBox = "fill-box";
    g.style.transformOrigin = "50% 50%";
    if (instant || reduced) { g.style.transform = end; return; }
    var mid = "translate(" + (STUB_D[0] / 2).toFixed(1) + "px," + (STUB_D[1] / 2 - 90).toFixed(1) + "px) rotate(-120deg)";
    var an = g.animate([{ transform: "translate(0,0) rotate(0deg)" }, { transform: mid }, { transform: end }], { duration: 950, easing: "ease-in-out" });
    an.onfinish = function () { g.style.transform = end; };
  }
  function ext(where, instant) {
    var near = part("ext-near"), store = part("ext-store");
    cancelAnims(near);
    fade(store, where === "store", instant);
    fade(near, where === "near", instant);
    if (where === "near" && !instant && !reduced) near.animate([{ transform: "translateY(-70px)" }, { transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(.3,1.4,.5,1)" });
  }
  function machine(on, instant) {
    part("lamp").querySelector(".lamp-on").style.display = on ? "" : "none";
    part("lamp").querySelector(".lamp-off").style.display = on ? "none" : "";
    part("switch").querySelector(".rock-on").style.display = on ? "" : "none";
    part("switch").querySelector(".rock-off").style.display = on ? "none" : "";
    var n = part("dial").querySelector(".needle");
    n.style.transformBox = "fill-box"; n.style.transformOrigin = "0% 100%";
    n.style.transition = instant || reduced ? "none" : "transform 700ms ease";
    n.style.transform = on ? "" : "rotate(-70deg)";
  }
  function flash(id) {
    all('[data-hit="' + id + '"]').forEach(function (el) {
      el.setAttribute("data-flash", "");
      setTimeout(function () { el.removeAttribute("data-flash"); }, 900);
    });
  }

  function op(text, instant) {
    var p = text.split(":");
    switch (p[0]) {
      case "wet": return fade(part("wet"), p[1] === "on", instant);
      case "waste": return fade(part("waste"), p[1] === "on", instant);
      case "stubs": return stubs(p[1] === "bin", instant);
      case "trainee": return fade(part("trainee"), p[1] === "on", instant);
      case "ext": return ext(p[1], instant);
      case "fire": return fade(one(".fire"), p[1] === "on", instant);
      case "spark": return fade(part("spark"), p[1] === "on", instant);
      case "plate": fade(one(".hotglow"), p[1] === "hot", instant); fade(one(".heat"), p[1] === "hot", instant); return;
      case "mark": return fade(one(".chalk"), p[1] === "on", instant);
      case "machine": return machine(p[1] === "on", instant);
      case "cord": fade(part("cord-on"), p[1] === "on", instant); fade(part("cord-off"), p[1] !== "on", instant); return;
      case "flash": return flash(p[1]);
      case "readout": readoutKey = p[1]; return;
    }
  }
  function reset() {
    op("wet:on", true); op("waste:on", true); op("stubs:floor", true); op("trainee:off", true); op("ext:off", true);
    op("fire:off", true); op("spark:off", true); op("plate:cool", true); op("mark:off", true); op("machine:on", true); op("cord:on", true);
    readoutKey = "r1";
  }
  window.FIG = { svg: svg, views: DATA.views, anchors: DATA.anchors, op: op, reset: reset, readout: function () { return readoutKey; } };
})();
