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
  // How I operate on phones: a swipeable deck. The card in front is sharp, the ones behind
  // sit lower, smaller and blurred, so there is only ever one card to read.
  var track = document.querySelector("[data-deck]");
  if (!track) return;
  var dots = document.querySelector("[data-deck-dots]");
  var cards = Array.prototype.slice.call(track.children);
  var phone = window.matchMedia("(max-width:767px)");
  var buttons = [];
  var frame = 0;
  function centreOn(card) {
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }
  function buildDots() {
    if (!dots || buttons.length) return;
    cards.forEach(function (card, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "deck__dot";
      b.setAttribute("aria-label", "Show " + (i + 1) + " of " + cards.length);
      b.addEventListener("click", function () { centreOn(card); });
      dots.appendChild(b);
      buttons.push(b);
    });
  }
  function paint() {
    frame = 0;
    if (!phone.matches) return;
    var mid = track.scrollLeft + track.clientWidth / 2;
    var active = 0, closest = Infinity;
    cards.forEach(function (card, i) {
      var away = (card.offsetLeft + card.offsetWidth / 2 - mid) / card.offsetWidth;
      var far = Math.min(Math.abs(away), 2.2);
      if (far < closest) { closest = far; active = i; }
      card.style.transform = "translateX(" + (-away * 14).toFixed(2) + "%) scale(" + (1 - far * 0.09).toFixed(3) + ")";
      card.style.filter = "blur(" + (far * 2.6).toFixed(2) + "px)";
      card.style.opacity = Math.max(0.3, 1 - far * 0.4).toFixed(3);
      card.style.zIndex = String(20 - Math.round(far * 10));
    });
    buttons.forEach(function (b, i) { b.classList.toggle("is-on", i === active); });
  }
  function onScroll() { if (!frame) frame = requestAnimationFrame(paint); }
  function sync() {
    if (phone.matches) { buildDots(); paint(); }
    else { cards.forEach(function (card) { card.removeAttribute("style"); }); }
  }
  track.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", sync);
  if (phone.addEventListener) { phone.addEventListener("change", sync); } else if (phone.addListener) { phone.addListener(sync); }
  sync();
})();
