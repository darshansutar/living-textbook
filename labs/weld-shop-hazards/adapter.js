/* Living Textbook adapter, runs before the workbench scripts: puts the scene on the stage and tells the player where every
   voice line is. Voice files are found the workbench way (FNV-1a of the line's text), mapped to this lesson's narration
   files: <audio dir><lines prefix><key>.mp3 (passed by the lesson). */
(function () {
  "use strict";
  var Q = new URLSearchParams(location.search);
  var LINES = Q.get("lines"), AUDIO = Q.get("audio") || "audio/";
  window.LAB_EMBED = Q.get("embed") === "1" && window.parent !== window;
  window.LAB_DIRECT = "intro";   // one job: Start opens on the guide's introduction, then "Start the job"
  if (window.LAB_EMBED) document.documentElement.classList.add("lt-embed");
  document.getElementById("stage").insertAdjacentHTML("afterbegin", window.FIG_SVG);
  function hashOf(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ("0000000" + h.toString(16)).slice(-8);
  }
  var files = {}, TEXTS = window.LAB_LINES.en || {};
  // answer-choice pictures: the workbench looks them up by their own path
  window.WORKBENCH.en.chapters.forEach(function (c) { c.steps.forEach(function (s) { s.tasks.forEach(function (t) {
    (t.choices || []).forEach(function (o) { if (o.pic) files[o.pic] = o.pic; });
  }); }); });
  if (LINES) Object.keys(TEXTS).forEach(function (key) { files["say/" + hashOf(TEXTS[key]) + ".mp3"] = AUDIO + LINES + key + ".mp3"; });
  window.STORY_FILES = { files: files, texts: {} };
})();
