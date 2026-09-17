// Copy email, show-more bullets, print, year.
(function () {
  var EMAIL = "maikrieffenstahl@gmail.com";
  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    var label = btn.querySelector(".t") || btn;
    var original = label.textContent;
    btn.addEventListener("click", function () {
      var done = function () {
        label.textContent = "Copied";
        setTimeout(function () { label.textContent = original; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(done, function () { window.location.href = "mailto:" + EMAIL; });
      } else {
        window.location.href = "mailto:" + EMAIL;
      }
    });
  });
  document.querySelectorAll("[data-more-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var entry = btn.closest(".entry");
      entry.classList.toggle("open");
      btn.setAttribute("aria-expanded", entry.classList.contains("open") ? "true" : "false");
    });
  });
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
