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
})();
