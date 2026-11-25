/* Living Textbook adapter, runs after the workbench player: the lesson's embed contract
   (lab-intro, lab-start, lab-started, lab-done, lab-next) and a single-job end card. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var EMBED = window.LAB_EMBED;
  var post = function (lt) { if (EMBED) window.parent.postMessage({ lt: lt, lab: "smart-switch" }, "*"); };
  ["t_more", "m_more", "end_more", "end_hub", "toHub", "end_all"].forEach(function (id) { var el = $(id); if (el) el.hidden = true; });
  var started = false;
  $("t_start").addEventListener("click", function () { if (!started) { started = true; post("lab-started"); } });
  window.LAB_ON_DONE = function () {
    var b = $("end_next");
    b.hidden = false;
    $("end_all").hidden = true;
    var lang = document.documentElement.lang;
    var T = lang === "hi" ? { c: (window.LAB_UI_HI || {}).continue || "आगे बढ़ें", d: (window.LAB_UI_HI || {}).do_again || "फिर से करें" }
      : lang === "kn" ? { c: (window.LAB_UI_KN || {}).continue || "ಮುಂದುವರಿಸಿ", d: (window.LAB_UI_KN || {}).do_again || "ಮತ್ತೆ ಮಾಡಿ" }
      : { c: "Continue", d: "Do it again" };
    b.querySelector("span").textContent = EMBED ? T.c : T.d;
    b.onclick = EMBED ? function () { post("lab-next"); } : function () { location.reload(); };
    post("lab-done");
  };
  if (EMBED) {
    window.addEventListener("message", function (e) {
      if (e.source === window.parent && e.data && e.data.lt === "lab-start" && !started) $("t_start").click();
    });
    post("lab-intro");
  }
})();
