(function () {
  var VP = window.VNPrime;
  var getProperties = VP.getProperties;
  var addLead = VP.addLead;
  var showToast = VP.showToast;

  function getCatalog() {
    return window.VNPrimeCatalog || [];
  }

  function formatBRL(n) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }

  /** Vitrine: catálogo demo + aprovados no storage (exceto PENDENTE_PLANO). */
  function getPublicListings() {
    var byId = new Map();
    getCatalog().forEach(function (c) {
      if (c.status === "Aprovado") byId.set(c.id, enrichStored(c));
    });
    getProperties().forEach(function (p) {
      if (p.status !== "Aprovado") return;
      byId.set(p.id, enrichStored(p));
    });
    return Array.from(byId.values());
  }

  function enrichStored(p) {
    var planStr = String(p.plan || "");
    var comm = p.commissionPlan || "";
    var profile = p.listingProfile;
    if (!profile) {
      if (comm === "Taxa" || /venda direta/i.test(planStr)) profile = "venda_direta";
      else if (comm === "3%" || /assistida/i.test(planStr) || planStr.indexOf("3%") !== -1) profile = "autonomia";
      else profile = "consultoria";
    }
    var hideOwnerContact =
      profile === "autonomia" ||
      profile === "venda_direta" ||
      comm === "3%" ||
      comm === "Taxa" ||
      planStr.indexOf("3%") !== -1;
    return {
      id: p.id,
      codigo: p.codigo || String(p.id).replace(/^P-/, "VN-"),
      title: p.title,
      neighborhood: p.neighborhood,
      type: p.type,
      price: p.price,
      status: p.status,
      areaM2: p.areaM2 || 0,
      quartos: p.quartos || 0,
      suites: p.suites || 0,
      salas: p.salas || 0,
      banheiros: p.banheiros || 0,
      vagas: p.vagas || 0,
      listingProfile: profile,
      planLabel: p.planLabel || p.plan || "—",
      commissionPlan: comm,
      hideOwnerContact: hideOwnerContact,
      description: p.description || "Descrição em elaboração pela curadoria VN Prime.",
      photos: p.photos && p.photos.length ? p.photos : [],
    };
  }

  function filterListings(bairro, tipo, maxValor, transacao) {
    var list = getPublicListings();
    var b = (bairro || "").trim().toLowerCase();
    if (b) list = list.filter(function (x) { return x.neighborhood.toLowerCase().indexOf(b) !== -1; });
    if (tipo) list = list.filter(function (x) { return x.type === tipo; });
    if (maxValor && Number(maxValor) > 0) list = list.filter(function (x) { return x.price <= Number(maxValor); });
    if (transacao === "venda_direta") list = list.filter(function (x) { return x.listingProfile === "venda_direta"; });
    if (transacao === "autonomia") list = list.filter(function (x) { return x.listingProfile === "autonomia"; });
    if (transacao === "consultoria") list = list.filter(function (x) { return x.listingProfile === "consultoria"; });
    return list;
  }

  function thumbUrl(item) {
    if (item.photos && item.photos[0]) return item.photos[0];
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80";
  }

  function renderListings(items) {
    var grid = document.getElementById("listing-grid");
    if (!grid) return;
    grid.innerHTML = "";
    if (!items.length) {
      grid.innerHTML =
        '<p class="muted" style="grid-column:1/-1">Nenhum imóvel encontrado com os filtros atuais.</p>';
      return;
    }
    items.forEach(function (item) {
      var el = document.createElement("article");
      el.className = "card listing-card";
      var tagClass = "";
      var tagText = "Venda completa · 6%";
      if (item.listingProfile === "venda_direta") {
        tagClass = " listing-card__tag--direta";
        tagText = "Venda direta · taxa";
      } else if (item.listingProfile === "autonomia") {
        tagClass = " listing-card__tag--direta";
        tagText = "Venda assistida · 3%";
      } else if (item.listingProfile === "consultoria" && item.commissionPlan === "4%") {
        tagText = "Venda premium · 4%";
      }
      var specs =
        (item.areaM2 ? item.areaM2 + " m² · " : "") +
        (item.quartos ? item.quartos + " qts" : "") +
        (item.suites ? " · " + item.suites + " suítes" : "") +
        (item.banheiros ? " · " + item.banheiros + " banh." : "");
      el.innerHTML =
        '<a class="listing-card__media" href="imovel.html?id=' +
        encodeURIComponent(item.id) +
        '"><img src="' +
        thumbUrl(item) +
        '" alt="" loading="lazy" width="400" height="260" /></a>' +
        '<div class="listing-card__body">' +
        '<p class="listing-card__code">' +
        (item.codigo || "") +
        "</p>" +
        "<h3><a href=\"imovel.html?id=" +
        encodeURIComponent(item.id) +
        '">' +
        item.title +
        "</a></h3>" +
        "<p><strong>" +
        item.type +
        "</strong> · " +
        item.neighborhood +
        "</p>" +
        '<p class="listing-card__specs muted">' +
        specs +
        "</p>" +
        '<p class="card__price" style="font-size:1.25rem;margin:0.35rem 0">' +
        formatBRL(item.price) +
        "</p>" +
        '<span class="listing-card__tag' +
        tagClass +
        '">' +
        tagText +
        "</span>" +
        '<a class="btn btn--ghost btn--sm" style="margin-top:0.75rem" href="imovel.html?id=' +
        encodeURIComponent(item.id) +
        '">Ver ficha completa</a></div>';
      grid.appendChild(el);
    });
  }

  function runSearch(e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    var items = filterListings(fd.get("bairro"), fd.get("tipo"), fd.get("valor"), fd.get("transacao"));
    renderListings(items);
    var sec = document.getElementById("resultados");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  }

  var heroForm = document.getElementById("hero-search");
  if (heroForm) heroForm.addEventListener("submit", runSearch);

  var btnVerTodos = document.getElementById("btn-ver-todos");
  if (btnVerTodos)
    btnVerTodos.addEventListener("click", function () {
      renderListings(getPublicListings());
      var sec2 = document.getElementById("resultados");
      if (sec2) sec2.scrollIntoView({ behavior: "smooth" });
    });

  renderListings(getPublicListings());
})();
