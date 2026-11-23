/* Copied from the en2 Starling workbench player (2026-11-17) with three Living Textbook hooks (LAB_DIRECT, LAB_ON_DONE, window.WB).
   Workbench player: a hands-on workshop on a working model, in chapters.
   load.js supplies window.WORKBENCH ({lang: lesson}), window.WORKBENCH_LANGS,
   window.STORY_FILES (signed links to the voice files) and the figure, whose
   script sets window.FIG (views, anchors and op(name) for every change the
   lesson asks for). Progress lives for one visit only. */
(function () {
  "use strict";
  var LESSONS = window.WORKBENCH;
  var LANGS = window.WORKBENCH_LANGS || [{ code: "en", name: "English" }];
  var FIG = window.FIG;
  var FILES = window.STORY_FILES.files;
  var L, UI;
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body;
  var svg = FIG.svg;
  var stage = $("stage"), focus = $("focus");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- voice ---------- */
  var audio = new Audio();
  // "Hear again" lights up while Ravi speaks, so a tap on it shows a result
  ["playing", "pause", "ended", "emptied", "error"].forEach(function (type) {
    audio.addEventListener(type, function () { $("replay").classList.toggle("speaking", type === "playing"); });
  });
  audio.preload = "auto";
  var muted = false;
  // file name: FNV-1a of the line, the same function the voice script uses
  function hashOf(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }
  function voiceOf(text) { return FILES["say/" + hashOf(text) + ".mp3"]; }
  var voiceToken = 0;
  // speak(text, then): `then` runs when the line ends, never when it is cut off or muted
  function speak(text, then) {
    voiceToken++;
    var token = voiceToken;
    audio.pause();
    audio.onended = null;
    if (!text || muted) return;
    audio.src = voiceOf(text);
    audio.onended = function () { if (token === voiceToken && then) then(); };
    audio.play().catch(function () {});
  }
  function speakAll(texts, each, then) {
    if (!texts.length) { if (then) then(); return; }
    if (each) each(0);
    speak(texts[0], function () {
      speakAll(texts.slice(1), each && function (i) { each(i + 1); }, then);
    });
  }
  // what "Hear again" plays: the current line, or the question with its answers
  var replay = function () {};
  function say(text) {
    replay = function () { speak(text); };
    speak(text);
  }
  // a short rising chime for a finished chapter, made here so it costs no download
  function chime() {
    if (muted || !window.AudioContext) return;
    var ctx = new AudioContext();
    [523.25, 659.25, 783.99].forEach(function (f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.14;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.65);
    });
    setTimeout(function () { ctx.close(); }, 1500);
  }
  function setMuted(on) {
    muted = on;
    if (on) { voiceToken++; audio.pause(); }
    ["mute", "m_mute"].forEach(function (id) {
      var b = $(id);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.querySelector("use").setAttribute("href", on ? "#i-muted" : "#i-sound");
      b.querySelector("span").textContent = on ? UI.sound : UI.mute;
    });
  }
  // prefetch a chapter's lines so a slow connection does not leave Ravi silent mid-job
  function prefetch(chapter) {
    var out = [chapter.intro, chapter.done, L.end.heading];
    chapter.steps.forEach(function (s) {
      s.tasks.forEach(function (t) {
        out.push(t.say);
        if (t.ok) out.push(t.ok.say);
        Object.keys(t.wrong || {}).forEach(function (k) { out.push(t.wrong[k].say); });
        (t.choices || []).forEach(function (c) {
          out.push(c.text, c.say);
          if (FILES[c.pic]) new Image().src = FILES[c.pic];
        });
      });
    });
    out.filter(Boolean).forEach(function (text) {
      var l = document.createElement("link");
      l.rel = "prefetch";
      l.href = voiceOf(text);
      document.head.appendChild(l);
    });
  }

  /* ---------- camera ---------- */
  var cam = FIG.views.all.slice();
  var camFrom = null, camTo = null, camT0 = 0, camDur = 900, camRaf = 0;
  // the model fills the screen; a view is framed inside #focus, the part the top bar and the card leave free
  function fitAspect(r) {
    var box = stage.getBoundingClientRect(), f = focus.getBoundingClientRect();
    var fw = Math.max(1, f.width), fh = Math.max(1, f.height);
    var x = r[0], y = r[1], w = r[2], h = r[3];
    if (w / h < fw / fh) { var nw = h * fw / fh; x -= (nw - w) / 2; w = nw; }
    else { var nh = w * fh / fw; y -= (nh - h) / 2; h = nh; }
    var unit = w / fw;
    return [x - (f.left - box.left) * unit, y - (f.top - box.top) * unit, box.width * unit, box.height * unit];
  }
  function applyCam(r) {
    cam = r;
    svg.setAttribute("viewBox", r.map(function (v) { return v.toFixed(1); }).join(" "));
    placeChips();
    placePointer();
  }
  var viewName = "all";
  function view(name, instant) {
    viewName = name || viewName;
    var target = fitAspect(FIG.views[viewName] || FIG.views.all);
    cancelAnimationFrame(camRaf);
    if (instant || reduced) { applyCam(target); return; }
    camFrom = cam.slice();
    camTo = target;
    camT0 = performance.now();
    var tick = function (now) {
      var t = Math.min(1, (now - camT0) / camDur);
      var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      applyCam(camFrom.map(function (v, i) { return v + (camTo[i] - v) * e; }));
      if (t < 1) camRaf = requestAnimationFrame(tick);
    };
    camRaf = requestAnimationFrame(tick);
  }
  window.addEventListener("resize", function () { view(viewName, true); });

  /* ---------- chips pinned to parts ---------- */
  var chipLayer = $("chips");
  var chips = [];
  function setChips(list) {
    chipLayer.textContent = "";
    chips = (list || []).map(function (c) {
      var el = document.createElement("span");
      el.className = "chip-tag" + (c.side ? " " + c.side : "");
      el.textContent = c.text;
      chipLayer.appendChild(el);
      return { el: el, at: c.at, point: c.point, side: c.side };
    });
    placeChips();
  }
  function toScreen(p) {
    var m = svg.getScreenCTM();
    if (!m) return null;
    var host = stage.getBoundingClientRect();
    return [m.a * p[0] + m.c * p[1] + m.e - host.left, m.b * p[0] + m.d * p[1] + m.f - host.top];
  }
  function placeChips() {
    var host = stage.getBoundingClientRect(), f = focus.getBoundingClientRect();
    chips.forEach(function (c) {
      var p = c.point || FIG.anchors[c.at];
      var s = p && toScreen(p);
      // a part the camera has left behind, or one under the card, keeps no label
      if (!s || s[0] < f.left - host.left || s[1] < f.top - host.top || s[0] > f.right - host.left || s[1] > f.bottom - host.top) { c.el.hidden = true; return; }
      c.el.hidden = false;
      c.el.style.transform = "translate(" + s[0].toFixed(1) + "px," + s[1].toFixed(1) + "px)";
      // a side label that would run off the stage goes on the other side of its part
      if (!c.side) return;
      c.el.className = "chip-tag " + c.side;
      var r = c.el.getBoundingClientRect();
      if (c.side === "left" ? r.left < host.left : r.right > host.right) c.el.className = "chip-tag " + (c.side === "left" ? "right" : "left");
    });
  }

  /* ---------- the pointer: a hand on the part to tap ---------- */
  var pointerAt = null;
  function pointAt(id) {
    pointerAt = id;
    $("pointer").hidden = !id;
    placePointer();
  }
  function placePointer() {
    if (!pointerAt) return;
    var anchor = FIG.anchors[pointerAt] || FIG.anchors["db-" + pointerAt];
    var host = stage.getBoundingClientRect();
    var spot = anchor && toScreen(anchor);
    if (!spot) {
      var rects = visibleRects(pointerAt);
      if (!rects.length) { $("pointer").hidden = true; return; }
      var l = Math.min.apply(null, rects.map(function (r) { return r.left; }));
      var t = Math.min.apply(null, rects.map(function (r) { return r.top; }));
      var rr = Math.max.apply(null, rects.map(function (r) { return r.right; }));
      var b = Math.max.apply(null, rects.map(function (r) { return r.bottom; }));
      spot = [(l + rr) / 2 - host.left, (t + b) / 2 - host.top];
    }
    $("pointer").hidden = false;
    // `translate`, not `transform`: the ring's `scale` animation must not scale the position
    $("pointer").style.translate = spot[0].toFixed(0) + "px " + spot[1].toFixed(0) + "px";
  }

  /* ---------- tapping the model ---------- */
  var want = null; // { ids: {id: kind}, onHit }
  function visibleRects(id) {
    var out = [];
    svg.querySelectorAll('[data-hit="' + id + '"]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) out.push(r);
    });
    return out;
  }
  function distTo(r, x, y) {
    var dx = Math.max(r.left - x, 0, x - r.right);
    var dy = Math.max(r.top - y, 0, y - r.bottom);
    return Math.sqrt(dx * dx + dy * dy);
  }
  function glow(ids) {
    svg.querySelectorAll("[data-glow]").forEach(function (el) { el.removeAttribute("data-glow"); });
    (ids || []).forEach(function (id) {
      svg.querySelectorAll('[data-hit="' + id + '"]').forEach(function (el) { el.setAttribute("data-glow", ""); });
    });
  }
  svg.addEventListener("click", function (ev) {
    if (!want) return;
    var under = ev.target.closest && ev.target.closest("[data-hit]");
    if (under && want.ids[under.getAttribute("data-hit")]) return want.onHit(under.getAttribute("data-hit"));
    var best = null, bestD = 26;
    Object.keys(want.ids).forEach(function (id) {
      visibleRects(id).forEach(function (r) {
        var d = distTo(r, ev.clientX, ev.clientY);
        if (d < bestD) { bestD = d; best = id; }
      });
    });
    if (!best) {
      if (under) want.onHit(null);
      return;
    }
    want.onHit(best);
  });

  /* ---------- panel ---------- */
  var chapterIndex = -1, stepIndex = -1, taskIndex = 0, mistakes = [], done = {};
  function chapter() { return L.chapters[chapterIndex]; }
  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function (m, k) { return values[k] != null ? values[k] : m; });
  }
  function paintProgress() {
    var ol = $("progress");
    ol.textContent = "";
    var steps = chapter().steps;
    steps.forEach(function (s, i) {
      var li = document.createElement("li");
      li.title = s.title;
      if (i < stepIndex) li.className = "done";
      else if (i === stepIndex) li.className = "now";
      ol.appendChild(li);
    });
    $("stepno").textContent = stepIndex < 0
      ? fill(UI.chapter, { n: chapterIndex + 1 }) + " · " + chapter().kind
      : fill(UI.step, { chapter: chapterIndex + 1, n: stepIndex + 1, total: steps.length });
  }
  function setBubble(text) {
    $("bubble").textContent = text || "";
    $("ravi").hidden = !text;
  }
  // on a phone the job card is a short sheet: bring new feedback and buttons into view
  function revealEnd() {
    var panel = $("panel");
    requestAnimationFrame(function () { panel.scrollTo({ top: panel.scrollHeight, behavior: reduced ? "auto" : "smooth" }); });
  }
  function setFeedback(kind, text) {
    var f = $("feedback");
    f.className = "feedback" + (kind ? " " + kind : "");
    f.querySelector("span").textContent = text || "";
    f.hidden = !text;
    if (kind) {
      f.classList.remove("pop");
      void f.offsetWidth;
      f.classList.add("pop");
      revealEnd();
    }
  }
  function clearTask() {
    want = null;
    glow([]);
    $("hint").hidden = true;
    $("choices").textContent = "";
    $("choices").hidden = true;
    $("actions").textContent = "";
    $("showme").hidden = true;
    pointAt(null);
    setFeedback(null, "");
  }
  function button(label, onClick, ghost) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn" + (ghost ? " ghost" : "");
    b.innerHTML = '<span></span><svg><use href="#i-arrow"/></svg>';
    b.querySelector("span").textContent = label;
    b.addEventListener("click", onClick);
    $("actions").appendChild(b);
    revealEnd();
    return b;
  }
  function paintReadout() {
    var sign = $("readout");
    if (!sign) return;
    var key = FIG.readout();
    sign.dataset.state = key === "off" ? "off" : "on";
    sign.querySelector("use").setAttribute("href", key === "off" ? "#i-off" : "#i-sign");
    sign.querySelector("span").textContent = UI.readout[key] || "";
  }
  function run(ops, instant) { (ops || []).forEach(function (op) { FIG.op(op, instant); }); paintReadout(); }
  function logMistake(remember) {
    if (remember && mistakes.indexOf(remember) < 0) mistakes.push(remember);
  }

  // the board as every chapter before this one leaves it
  function setUpBoard(index) {
    FIG.reset();
    L.chapters.slice(0, index).forEach(function (c) {
      c.steps.forEach(function (s) {
        run(s.setup, true);
        s.tasks.forEach(function (t) {
          if (t.ok) { run(t.ok.do, true); run(t.ok.then, true); }
          run(t.after, true);
        });
      });
    });
    paintReadout();
  }

  function openChapter(index) {
    flushUndo();
    chapterIndex = index;
    stepIndex = -1;
    mistakes = [];
    showScreen("work");
    setUpBoard(index);
    prefetch(chapter());
    $("steptitle").textContent = chapter().title;
    paintProgress();
    clearTask();
    setChips([]);
    view(chapter().steps[0].view);
    setBubble(chapter().intro);
    say(chapter().intro);
    button(UI.begin, function () { startStep(0); });
  }
  function startStep(i) {
    stepIndex = i;
    taskIndex = 0;
    var s = chapter().steps[i];
    $("steptitle").textContent = s.title;
    paintProgress();
    run(s.setup);
    view(s.view);
    setChips(s.chips);
    runTask();
  }
  function nextTask() {
    var s = chapter().steps[stepIndex];
    taskIndex++;
    if (taskIndex < s.tasks.length) runTask();
    else if (stepIndex + 1 < chapter().steps.length) startStep(stepIndex + 1);
    else finishChapter();
  }
  // a wrong answer's undo waits so the learner sees the mistake; moving on runs it at once
  var pendingUndo = null;
  function undoLater(ops) {
    flushUndo();
    pendingUndo = { ops: ops, timer: setTimeout(flushUndo, 2600) };
  }
  function flushUndo() {
    if (!pendingUndo) return;
    clearTimeout(pendingUndo.timer);
    var ops = pendingUndo.ops;
    pendingUndo = null;
    run(ops);
  }
  function succeed(task, ok, extraSay) {
    flushUndo();
    want = null;
    glow([]);
    pointAt(null);
    $("showme").hidden = true;
    $("hint").hidden = true;
    ok = ok || {};
    run(ok.do);
    if (ok.view) view(ok.view);
    var line = ok.say || extraSay;
    if (ok.then) setTimeout(function () { run(ok.then); }, 900);
    var steps = chapter().steps;
    var last = stepIndex === steps.length - 1 && taskIndex === steps[stepIndex].tasks.length - 1;
    if (line) {
      setFeedback("good", line);
      say(line);
      button(last ? UI.finish : UI.next, nextTask);
    } else {
      setTimeout(nextTask, 650);
    }
  }
  function miss(w) {
    run(w.do);
    setFeedback("miss", w.say);
    say(w.say);
    logMistake(w.remember);
    if (w.undo) undoLater(w.undo);
  }

  function runTask() {
    clearTask();
    $("panel").scrollTop = 0;
    var s = chapter().steps[stepIndex];
    var task = s.tasks[taskIndex];
    if (task.view) view(task.view);
    if (task.chips) setChips(task.chips);
    else if (taskIndex === 0) setChips(s.chips);
    setBubble(task.say);
    if (task.choices) return askChoices(task);
    say(task.say);
    if (task.toggles) return phoneToggles(task);
    if (task.tap) return askTap(task);
    button(UI.next, nextTask);
  }

  function askTap(task) {
    $("hint").hidden = false;
    $("hintText").textContent = task.hint;
    $("showme").hidden = false;
    var ids = {};
    ids[task.tap] = "ok";
    (task.alsoOk || []).forEach(function (id) { ids[id] = "ok"; });
    Object.keys(task.wrong || {}).forEach(function (id) { ids[id] = "wrong"; });
    glow([task.glow || task.tap]);
    // the hand shows the answer only when asked (Show me) or after two misses
    var misses = 0;
    want = {
      ids: ids,
      onHit: function (id) {
        if (id && ids[id] === "ok") return succeed(task, task.ok);
        misses++;
        if (misses >= 2) pointAt(task.tap);
        if (id && task.wrong && task.wrong[id]) return miss(task.wrong[id]);
        setFeedback("miss", fill(UI.notThat, { hint: task.hint }));
      },
    };
  }

  function askChoices(task) {
    var box = $("choices");
    box.hidden = false;
    box.classList.toggle("phone", !!task.phone);
    var withPics = task.choices.every(function (c) { return FILES[c.pic]; });
    box.classList.toggle("pics", withPics);
    if (task.phone) {
      var head = document.createElement("p");
      head.className = "phone-head";
      head.textContent = task.ask;
      box.appendChild(head);
    }
    var cards = task.choices.map(function (c) {
      var card = document.createElement("div");
      card.className = "choice";
      var pick = document.createElement("button");
      pick.type = "button";
      pick.className = "pick";
      if (FILES[c.pic]) {
        var img = document.createElement("img");
        img.alt = "";
        img.src = FILES[c.pic];
        pick.appendChild(img);
      } else if (task.phone && task.icon !== false) {
        pick.insertAdjacentHTML("beforeend", '<svg class="phone-icon"><use href="#i-' + (task.icon || "wifi") + '"/></svg>');
      }
      var words = document.createElement("span");
      words.className = "words";
      words.textContent = c.text + (c.sub ? "  ·  " + c.sub : "");
      pick.appendChild(words);
      pick.insertAdjacentHTML("beforeend", '<i class="mark" aria-hidden="true"></i>');
      var listen = document.createElement("button");
      listen.type = "button";
      listen.className = "listen";
      listen.setAttribute("aria-label", UI.listen);
      listen.innerHTML = '<svg><use href="#i-sound"/></svg>';
      listen.addEventListener("click", function () { reading(-1); speak(c.text); });
      pick.addEventListener("click", function () {
        if (pick.disabled) return;
        reading(-1);
        if (c.right) {
          box.querySelectorAll(".pick").forEach(function (x) { x.disabled = true; });
          card.classList.add("right");
          flushUndo();
          run(task.after);
          succeed(task, { say: c.say });
        } else {
          card.classList.add("wrong");
          pick.disabled = true;
          run(c.do);
          if (c.undo) undoLater(c.undo);
          setFeedback("miss", c.say);
          say(c.say);
          logMistake(c.remember);
        }
      });
      card.appendChild(pick);
      card.appendChild(listen);
      box.appendChild(card);
      return card;
    });
    function reading(i) {
      cards.forEach(function (card, j) { card.classList.toggle("reading", j === i); });
    }
    // Ravi asks, then reads each answer while it lights up, so a slow reader can follow
    replay = function () {
      speak(task.say, function () {
        speakAll(task.choices.map(function (c) { return c.text; }), reading, function () { reading(-1); });
      });
    };
    replay();
  }

  function phoneToggles(task) {
    var box = $("choices");
    box.hidden = false;
    box.classList.remove("pics");
    box.classList.add("phone");
    var head = document.createElement("p");
    head.className = "phone-head";
    head.textContent = task.ask;
    box.appendChild(head);
    $("hint").hidden = false;
    $("hintText").textContent = task.hint;
    task.toggles.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "toggle" + (t.on ? " on" : "");
      b.innerHTML = '<span></span><i aria-hidden="true"></i>';
      b.querySelector("span").textContent = t.text;
      b.setAttribute("role", "switch");
      b.setAttribute("aria-checked", t.on ? "true" : "false");
      if (t.id === task.tap) b.classList.add("glowing");
      b.addEventListener("click", function () {
        if (t.id !== task.tap) { setFeedback("miss", fill(UI.notThat, { hint: task.hint })); return; }
        b.classList.add("on");
        b.classList.remove("glowing");
        b.setAttribute("aria-checked", "true");
        succeed(task, task.ok);
      });
      box.appendChild(b);
    });
  }

  $("showme").addEventListener("click", function () {
    var task = chapter() && stepIndex >= 0 && chapter().steps[stepIndex].tasks[taskIndex];
    if (task && task.tap) pointAt(task.tap);
  });

  /* ---------- screens ---------- */
  // the title and the menu show the finished job: `showcase: true` replays every chapter,
  // a list of ops sets the board from reset; without it they show the reset board
  function showcase() {
    if (L.showcase === true) return setUpBoard(L.chapters.length);
    FIG.reset();
    run(L.showcase, true);
  }
  function finishChapter() {
    clearTask();
    setChips([]);
    done[chapter().id] = true;
    body.dataset.screen = "end";
    $("panel").scrollTop = 0;
    var c = chapter();
    var index = chapterIndex;
    $("end_kind").textContent = fill(UI.chapter, { n: chapterIndex + 1 }) + " · " + c.kind;
    $("end_head").textContent = L.end.heading;
    $("end_sub").textContent = c.done;
    chime();
    replay = function () { speakAll([L.end.heading, c.done]); };
    setTimeout(replay, 500);
    $("end_note").textContent = mistakes.length ? L.end.mistakes : L.end.clean;
    $("end_again").hidden = !mistakes.length;
    $("end_again").onclick = function () { openChapter(index); };
    $("end_list").textContent = "";
    mistakes.forEach(function (m) {
      var li = document.createElement("li");
      li.textContent = m;
      $("end_list").appendChild(li);
    });
    var nextIndex = -1;
    for (var i = 1; i <= L.chapters.length; i++) {
      var j = (chapterIndex + i) % L.chapters.length;
      if (!done[L.chapters[j].id]) { nextIndex = j; break; }
    }
    var allDone = nextIndex < 0;
    $("end_all").hidden = !allDone;
    $("end_all").textContent = L.end.allDone;
    var nextBtn = $("end_next");
    nextBtn.hidden = allDone;
    if (!allDone) {
      nextBtn.querySelector("span").textContent = fill(L.end.next, { title: L.chapters[nextIndex].title });
      nextBtn.onclick = function () { openChapter(nextIndex); };
    }
    if (window.LAB_ON_DONE) window.LAB_ON_DONE();   // Living Textbook: tell the lesson the class finished
  }
  function showScreen(name) {
    body.dataset.screen = name;
    $("s_title").inert = name !== "title";
    $("s_menu").inert = name !== "menu";
  }
  // the chapter menu: Ravi asks which chapter
  function showHub() {
    clearTask();
    setChips([]);
    chapterIndex = -1;
    showScreen("menu");
    paintHub();
    showcase();
    view("all");
    say(UI.choose);
  }
  function showTitle() {
    speak(null);
    showScreen("title");
  }

  function paintHub() {
    var ol = $("hub");
    ol.textContent = "";
    L.chapters.forEach(function (c, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chapter" + (done[c.id] ? " done" : "");
      b.innerHTML = '<span class="face"></span><span class="txt"><span class="kind"></span><b></b></span>';
      var face = b.querySelector(".face");
      if (FILES[c.pic]) face.innerHTML = '<img alt="" src="' + FILES[c.pic] + '">';
      else face.textContent = i + 1;
      if (done[c.id]) face.insertAdjacentHTML("beforeend", '<i class="tick" aria-label="' + UI.doneTag + '"></i>');
      b.querySelector(".kind").textContent = fill(UI.chapter, { n: i + 1 }) + " · " + c.kind;
      b.querySelector("b").textContent = c.title;
      b.addEventListener("click", function () { openChapter(i); });
      var listen = document.createElement("button");
      listen.type = "button";
      listen.className = "listen";
      listen.setAttribute("aria-label", UI.listen);
      listen.innerHTML = '<svg><use href="#i-sound"/></svg>';
      listen.addEventListener("click", function () { speak(c.title); });
      li.appendChild(b);
      li.appendChild(listen);
      ol.appendChild(li);
    });
  }

  /* ---------- language ---------- */
  function setLang(code, keepUrl) {
    L = LESSONS[code] || LESSONS.en;
    UI = L.ui;
    document.documentElement.lang = code;
    $("t_kicker").textContent = L.kicker;
    $("t_title").textContent = L.title;
    $("t_sub").textContent = L.sub;
    $("hub_head").textContent = UI.choose;
    $("guideName").textContent = L.guide;
    $("guideRole").textContent = L.guideRole;
    $("replay").querySelector("span").textContent = UI.replay;
    $("toHub").querySelector("span").textContent = UI.chapters;
    $("showme").textContent = UI.showMe;
    $("end_hub").querySelector("span").textContent = L.end.hub;
    $("end_again").querySelector("span").textContent = L.end.again;
    $("end_more").textContent = L.end.more;
    $("t_more").textContent = L.end.more;
    $("m_more").textContent = L.end.more;
    $("t_start").textContent = UI.begin;
    $("m_back").querySelector("span").textContent = UI.back;
    setMuted(muted);
    document.querySelectorAll("#langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.lang === code ? "true" : "false");
    });
    paintHub();
    paintReadout();
    if (!keepUrl) {
      var url = new URL(location.href);
      if (code === "en") url.searchParams.delete("lang"); else url.searchParams.set("lang", code);
      history.replaceState(null, "", url);
    }
  }

  /* ---------- boot ---------- */
  var langs = $("langs");
  LANGS.forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "lang";
    b.dataset.lang = l.code;
    b.lang = l.code;
    b.textContent = l.name;
    b.addEventListener("click", function () { setLang(l.code); });
    langs.appendChild(b);
  });
  langs.hidden = LANGS.length < 2;
  var asked = new URLSearchParams(location.search).get("lang");
  setLang(LESSONS[asked] ? asked : "en", true);
  showcase();
  view("all", true);
  $("mute").addEventListener("click", function () { setMuted(!muted); });
  $("replay").addEventListener("click", function () { setMuted(false); replay(); });
  $("toHub").addEventListener("click", showHub);
  // Living Textbook: a lab with one job starts it straight away (no chapter menu)
  $("t_start").addEventListener("click", function () { if (window.LAB_DIRECT) { openChapter(0); startStep(0); } else showHub(); });
  $("m_back").addEventListener("click", showTitle);
  $("m_mute").addEventListener("click", function () { setMuted(!muted); });
  $("end_hub").addEventListener("click", showHub);
  // ?chapter=<n> opens that chapter straight away
  var askedChapter = Number(new URLSearchParams(location.search).get("chapter"));
  if (askedChapter >= 1 && askedChapter <= L.chapters.length) openChapter(askedChapter - 1);
  window.WB = { openChapter: openChapter, startStep: startStep };   // Living Textbook hooks
})();
