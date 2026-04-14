(function () {
  /* Evita tema de perfil (ex.: corretor) ficar no <html> e afetar cores do site público no mobile. */
  var href = window.location.href || "";
  if (!/dashboard\.html/i.test(href)) {
    document.documentElement.removeAttribute("data-profile");
  }

  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 960px)").matches) {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  var backBtn = document.getElementById("breadcrumb-history-back");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      var path = (window.location.pathname || "").replace(/\\/g, "/");
      var file = path.split("/").pop() || "";
      if (/vn_prime_plataforma\.html/i.test(file)) {
        window.location.hash = "compra";
        window.scrollTo(0, 0);
      } else {
        window.location.href = "index.html";
      }
    });
  }
})();
