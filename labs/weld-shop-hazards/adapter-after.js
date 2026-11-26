/* Living Textbook adapter, runs after the workbench player: the lesson's embed contract
   (lab-intro, lab-start, lab-started, lab-done, lab-next) and a single-job end card. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var EMBED = window.LAB_EMBED;
  var post = function (lt) { if (EMBED) window.parent.postMessage({ lt: lt, lab: "weld-shop-hazards" }, "*"); };
  ["t_more", "m_more", "end_more", "end_hub", "toHub", "end_all"].forEach(function (id) { var el = $(id); if (el) el.hidden = true; });
  // remember the language between the two welding labs
  document.querySelectorAll("#langs button").forEach(function (b) {
    b.addEventListener("click", function () { try { window.localStorage.setItem("lt-weld-lab-lang", b.dataset.lang); } catch (e) {} });
  });
  // language button in the top bar, so English / Hindi can be switched at any step (the first screen is skipped by the lesson's Next)
  (function () {
    var tools = document.querySelector("#hud .tools");
    if (!tools || !window.WORKBENCH.hi || EMBED) return;   // inside a lesson the lesson's language menu decides
    var cur = document.documentElement.lang === "hi" ? "hi" : "en", to = cur === "hi" ? "en" : "hi";
    var b = document.createElement("button");
    b.type = "button"; b.className = "tool"; b.id = "langBtn"; b.lang = to;
    b.setAttribute("aria-label", to === "hi" ? "हिंदी में देखें" : "Switch to English");
    b.innerHTML = "<span>" + (to === "hi" ? "हिंदी" : "English") + "</span>";
    b.addEventListener("click", function () {
      try { window.localStorage.setItem("lt-weld-lab-lang", to); } catch (e) {}
      var u = new URL(location.href); u.searchParams.set("lang", to); location.replace(u.toString());
    });
    tools.insertBefore(b, tools.firstChild);
  })();
  var started = false;
  $("t_start").addEventListener("click", function () { if (!started) { started = true; post("lab-started"); } });
  window.LAB_ON_DONE = function () {
    var b = $("end_next");
    b.hidden = false;
    $("end_all").hidden = true;
    var hi = document.documentElement.lang === "hi", U = window.LAB_UI_HI || {};
    b.querySelector("span").textContent = EMBED ? (hi ? U["continue"] || "आगे बढ़ें" : "Continue") : (hi ? U.do_again || "फिर से करें" : "Do it again");
    b.onclick = EMBED ? function () { post("lab-next"); } : function () { location.reload(); };
    if (EMBED) $("end_again").hidden = true;   // inside a lesson the lab never restarts: Continue moves on
    post("lab-done");
  };
  if (EMBED) {
    window.addEventListener("message", function (e) {
      if (e.source === window.parent && e.data && e.data.lt === "lab-start" && !started) $("t_start").click();
    });
    post("lab-intro");
  }
})();
