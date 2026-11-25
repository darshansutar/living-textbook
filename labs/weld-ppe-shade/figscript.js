// The scene's moving parts, driven by the lesson through FIG.op("kind:a:b"). Every change is a CSS transition or keyframe
// on the drawn parts, so the cause shows before the effect (the gear flies from the bench to Mallesh, then settles).
(function () {
  "use strict";
  var DATA = window.FIG_DATA;
  var svg = document.querySelector("#stage svg");
  var one = function (sel) { return svg.querySelector(sel); };
  var all = function (sel) { return Array.prototype.slice.call(svg.querySelectorAll(sel)); };
  var readoutKey = "s1";
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function flag(el, name, on) { if (!el) return; if (on) el.setAttribute(name, ""); else el.removeAttribute(name); }
  // a worn piece of gear flies in from where it lay, the lying copy flies off to Mallesh
  function gear(name, on) {
    flag(one('[data-worn="' + name + '"]'), "data-on", on);
    flag(one('[data-item="' + name + '"]'), "data-gone", on);
  }
  function lens(kind) {
    all(".lens").forEach(function (el) { flag(el, "data-on", el.getAttribute("data-lens") === kind); });
  }
  function pick(id) { all("[data-plate]").forEach(function (el) { flag(el, "data-pick", el.getAttribute("data-plate") === id); }); }
  function amps(a) {
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
  // the helper chips the slag: the hammer swings down twice, the crust breaks into shards that fly off, the bead shows clean
  function chip(on) {
    var h = one('[data-part="hammer"]'), c = one('[data-part="chips"]'), slag = one("[data-slag]");
    if (!on) { svg.classList.remove("chipping"); h.style.opacity = "0"; h.classList.remove("swing"); c.style.opacity = "0"; c.classList.remove("fly"); slag.style.opacity = "1"; return; }
    svg.classList.add("chipping");
    h.style.opacity = "1";
    h.classList.add("swing");
    later(function () { c.style.opacity = "1"; c.classList.add("fly"); slag.style.opacity = "0"; }, 700);
    later(function () { c.style.opacity = "0"; h.style.opacity = "0"; h.classList.remove("swing"); svg.classList.remove("chipping"); }, 2700);
  }

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
      case "mallesh": one("[data-fig]").style.transform = p[1] === "bench" ? "translate(70px,60px)" : "none"; return;
      case "arc": return part("arc", p[1] === "on");
      case "rays": return rays(p[1]);
      case "trainee": return part("trainee", p[1] === "on");
      case "canvas": { var cv = one('[data-part="canvas"]'); cv.style.opacity = p[1] === "on" ? "1" : "0"; cv.style.transform = p[1] === "on" ? "none" : "translateY(-20px)"; return; }
      case "flare": var f = one("[data-flare]"); f.style.opacity = p[1] === "on" ? "1" : "0"; return;
      case "flash": return flash(p[1]);
      case "readout": readoutKey = p[1]; return;
    }
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    ["boots", "cape", "apron", "gloves", "goggles", "helmet", "screen"].forEach(function (n) { gear(n, false); });
    one("[data-helm]").setAttribute("data-helm", "down");
    lens("off");
    pick("off");
    amps(0);
    ["plate", "arc", "trainee"].forEach(function (n) { part(n, false); });
    part("station", true);
    chip(false);
    one("[data-fig]").style.transform = "none";
    rays("off");
    op("canvas:off");
    op("flare:off");
    readoutKey = "s1";
  }
  svg.querySelector("[data-fig]").style.transition = "transform 1s cubic-bezier(.4,0,.2,1)";

  window.FIG = { svg: svg, views: DATA.views, anchors: DATA.anchors, op: op, reset: reset, readout: function () { return readoutKey; } };
})();
