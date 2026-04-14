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
      if (c.status === "Aprovado") byId.set(c.id, c);
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
    var profile =
      p.listingProfile ||
      (comm === "3%" || planStr.indexOf("3%") !== -1 ? "autonomia" : "consultoria");
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
      hideOwnerContact:
        profile === "autonomia" ||
        comm === "3%" ||
        String(p.plan || "").indexOf("3%") !== -1,
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
        (item.listingProfile === "autonomia" ? " listing-card__tag--direta" : "") +
        '">' +
        (item.listingProfile === "autonomia" ? "Venda direta · plano 3%" : "Intermediação VN Prime (4% ou 6%)") +
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

  var PRECO_M2 = {
    savassi: 12500,
    belvedere: 11800,
    "nova lima": 10200,
    lourdes: 11200,
    funcionarios: 12000,
    "serra": 9800,
    "alphaville": 10500,
    "cidade jardim": 10800,
    default: 8500,
  };

  function pricePerM2Key(bairro) {
    var k = (bairro || "").trim().toLowerCase();
    if (PRECO_M2[k] != null) return PRECO_M2[k];
    for (var key in PRECO_M2) {
      if (key !== "default" && k.indexOf(key) !== -1) return PRECO_M2[key];
    }
    return PRECO_M2.default;
  }

  function updateCalculator() {
    var m2 = Number((document.getElementById("calc-m2") || {}).value || 0);
    var bairro = (document.getElementById("calc-bairro") || {}).value || "";
    var anos = Number((document.getElementById("calc-prazo") || {}).value || 5);
    var taxa = Number((document.getElementById("calc-taxa") || {}).value || 6) / 100;
    var label = document.getElementById("calc-prazo-label");
    if (label) label.textContent = anos + " " + (anos === 1 ? "ano" : "anos");

    var baseValor = m2 > 0 ? m2 * pricePerM2Key(bairro) : Number((document.getElementById("calc-valor") || {}).value || 0);
    var futuro = baseValor * Math.pow(1 + taxa, anos);
    var res = document.getElementById("calc-resultado");
    var det = document.getElementById("calc-detalhe");
    if (res) res.textContent = formatBRL(Math.round(futuro));
    if (det) {
      if (m2 > 0) {
        det.textContent =
          "Estimativa a partir de " +
          m2 +
          " m² × referência regional (~" +
          formatBRL(pricePerM2Key(bairro)) +
          "/m²). Projeção composta " +
          (taxa * 100).toFixed(1) +
          "% a.a. — não é laudo.";
      } else {
        det.textContent =
          "Informe metragem e bairro para estimativa por m², ou use o valor manual abaixo. Não constitui laudo.";
      }
    }
  }

  function onCalcSubmit(e) {
    e.preventDefault();
    var emailEl = document.getElementById("calc-email");
    var m2El = document.getElementById("calc-m2");
    var bairroEl = document.getElementById("calc-bairro");
    var resultadoEl = document.getElementById("calc-resultado");
    addLead({
      id: "L-" + Date.now(),
      name: "Lead Calculadora",
      email: emailEl ? emailEl.value : "",
      phone: "—",
      column: "novo",
      source:
        "Calculadora · " +
        (m2El ? m2El.value : "") +
        " m² · " +
        (bairroEl ? bairroEl.value : "") +
        " · " +
        (resultadoEl ? resultadoEl.textContent : ""),
    });
    showToast("Interesse registrado. Em produção: webhook n8n + e-mail transacional.");
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

  ["calc-m2", "calc-bairro", "calc-valor", "calc-prazo", "calc-taxa"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", updateCalculator);
    if (el) el.addEventListener("change", updateCalculator);
  });

  var calcForm = document.getElementById("calc-form");
  if (calcForm) calcForm.addEventListener("submit", onCalcSubmit);

  renderListings(getPublicListings());
  updateCalculator();
})();
