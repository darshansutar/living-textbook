/* Living Textbook adapter, runs before the workbench scripts: puts the board figure on the stage and tells the
   player where every voice line and picture is. Voice files are found the workbench way (FNV-1a of the line's
   text), mapped to this lesson's narration files: <audio dir><lines prefix><key>.mp3 (passed by the lesson). */
(function () {
  "use strict";
  var Q = new URLSearchParams(location.search);
  var LINES = Q.get("lines"), AUDIO = Q.get("audio") || "audio/";
  window.LAB_EMBED = Q.get("embed") === "1" && window.parent !== window;
  window.LAB_DIRECT = true;   // one job: Start goes straight into step 1
  if (window.LAB_EMBED) document.documentElement.classList.add("lt-embed");
  document.getElementById("stage").insertAdjacentHTML("afterbegin", window.FIG_SVG);
  function hashOf(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ("0000000" + h.toString(16)).slice(-8);
  }
  var files = {};
  // two languages live in one lab: English lines in <audio>, Hinglish lines in <audio>hi/. The learner's choice is
  // remembered between the two labs; inside a lesson the lab shows the language switch on its first screen.
  try {
    var want = window.localStorage.getItem("lt-weld-lab-lang");
    if (want && window.WORKBENCH[want] && Q.get("lang") !== want) { Q.set("lang", want); history.replaceState(null, "", location.pathname + "?" + Q.toString()); }
  } catch (e) {}
  var DIRS = { en: "", hi: "hi/" };
  Object.keys(window.WORKBENCH).forEach(function (code) {
    window.WORKBENCH[code].chapters.forEach(function (c) { c.steps.forEach(function (s) { s.tasks.forEach(function (t) {
      (t.choices || []).forEach(function (o) { if (o.pic) files[o.pic] = o.pic; });
    }); }); });
    var TEXTS = window.LAB_LINES[code] || {};
    if (LINES) Object.keys(TEXTS).forEach(function (key) {
      files["say/" + hashOf(TEXTS[key]) + ".mp3"] = AUDIO + (DIRS[code] || "") + LINES + key + ".mp3";
    });
  });
  window.STORY_FILES = { files: files, texts: {} };
})();
