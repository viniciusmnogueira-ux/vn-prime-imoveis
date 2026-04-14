/**
 * VN Prime — núcleo compartilhado (sem módulos ES6 → compatível com file://).
 *
 * Integrações futuras (conectar nos pontos indicados nos HTML/JS):
 *
 * 1) Stripe
 *    - Frontend: carregar Stripe.js (`loadStripe`) e criar sessão no backend.
 *    - Backend: POST que retorna `sessionId` ou URL de Checkout Session (mode: payment | subscription).
 *    - Substituir `simulateStripeCheckout()` por redirect para `session.url` ou `stripe.confirmPayment`.
 *    - Webhooks: `checkout.session.completed`, `invoice.paid` → atualizar `vnprime_user` / banco.
 *
 * 2) Google Maps Platform
 *    - Habilitar Maps JavaScript API + Places API.
 *    - Em cadastrar.html: inicializar mapa no `#map-placeholder`; usar `google.maps.Map` + marcador.
 *    - Autocomplete: `new google.maps.places.Autocomplete(input)` nos campos de endereço.
 *    - Persistir `lat`, `lng`, `placeId` apenas no servidor; exibir bairro público vs endereço privado.
 *
 * 3) n8n
 *    - Criar webhooks de entrada (HTTP Trigger) para: lead criado, imóvel pendente, imóvel aprovado,
 *      pagamento simulado → produção (Stripe webhook → n8n).
 *    - Ex.: `fetch('https://n8n.seudominio/webhook/vnprime-lead', { method:'POST', body: JSON.stringify(...) })`
 *      nos handlers de `addLead`, `addProperty`, aprovação no admin e sucesso do checkout.
 */
(function (global) {
  const STORAGE_KEYS = {
    user: "vnprime_user",
    properties: "vnprime_properties",
    leads: "vnprime_leads",
  };

  function defaultLeads() {
    return [
      {
        id: "L1",
        name: "Marina Costa",
        email: "marina@email.com",
        phone: "(11) 98888-0001",
        column: "novo",
        source: "Landing calculadora",
      },
      {
        id: "L2",
        name: "Ricardo Alves",
        email: "ricardo@email.com",
        phone: "(21) 97777-0002",
        column: "contato",
        source: "Busca hero",
      },
      {
        id: "L3",
        name: "Patrícia Mendes",
        email: "patricia@email.com",
        phone: "(31) 96666-0003",
        column: "visita",
        source: "Indicação",
      },
    ];
  }

  function defaultProperties() {
    return [
      {
        id: "P-demo-1",
        title: "Cobertura duplex — Vale do Sereno, Nova Lima · 320m²",
        neighborhood: "Nova Lima",
        type: "Cobertura",
        price: 8900000,
        status: "Pendente",
        ownerEmail: "demo@vnprime.com",
        plan: "4% · Mídia Pro (pacote)",
        areaM2: 320,
        quartos: 4,
        suites: 3,
        description:
          "Cobertura em pavimentos com terraço e área gourmet; referência de estilo para vitrine e curadoria VN Prime (demo).",
        photos: [
          "https://images.unsplash.com/photo-1576013551627-e0d5d6f0e11b?w=1200&q=80",
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getUser() {
    return readJSON(STORAGE_KEYS.user, null);
  }

  function setUser(user) {
    writeJSON(STORAGE_KEYS.user, user);
  }

  function getProperties() {
    let list = readJSON(STORAGE_KEYS.properties, null);
    if (!list || !list.length) {
      list = defaultProperties();
      writeJSON(STORAGE_KEYS.properties, list);
      return list;
    }
    var cat = global.VNPrimeCatalog;
    var catalogIds =
      cat && Array.isArray(cat)
        ? cat.reduce(function (acc, x) {
            acc[x.id] = true;
            return acc;
          }, {})
        : {};
    var cleaned = list.filter(function (p) {
      var n = String(p.neighborhood || "").toLowerCase();
      var t = String(p.title || "").toLowerCase();
      if (n.indexOf("morumbi") !== -1 || t.indexOf("morumbi") !== -1) return false;
      if (p.id === "P-demo-2" || p.id === "demo-2") return false;
      if (catalogIds[p.id]) return false;
      return true;
    });
    if (cleaned.length !== list.length) {
      saveProperties(cleaned);
      list = cleaned;
    }
    return list;
  }

  function saveProperties(list) {
    writeJSON(STORAGE_KEYS.properties, list);
  }

  function addProperty(property) {
    const list = getProperties();
    list.push(property);
    saveProperties(list);
    return property;
  }

  function updateProperty(id, patch) {
    const list = getProperties();
    const i = list.findIndex((p) => p.id === id);
    if (i === -1) return null;
    list[i] = Object.assign({}, list[i], patch);
    saveProperties(list);
    return list[i];
  }

  function getLeads() {
    let list = readJSON(STORAGE_KEYS.leads, null);
    if (!list || !list.length) {
      list = defaultLeads();
      writeJSON(STORAGE_KEYS.leads, list);
    }
    return list;
  }

  function saveLeads(list) {
    writeJSON(STORAGE_KEYS.leads, list);
  }

  function addLead(lead) {
    const list = getLeads();
    list.push(lead);
    saveLeads(list);
  }

  function applyProfileTheme(role) {
    const map = { owner: "owner", broker: "broker", photo: "photo", admin: "admin" };
    document.documentElement.dataset.profile = map[role] || "owner";
  }

  function simulateStripeCheckout(opts) {
    var title = opts.title;
    var amountLabel = opts.amountLabel;
    var onSuccess = opts.onSuccess;
    var overlay = document.getElementById("stripe-modal");
    var titleEl = document.getElementById("stripe-modal-title");
    var amountEl = document.getElementById("stripe-modal-amount");
    var confirmBtn = document.getElementById("stripe-modal-confirm");
    var cancelBtn = document.getElementById("stripe-modal-cancel");

    if (!overlay || !titleEl || !amountEl || !confirmBtn || !cancelBtn) {
      var ok = global.confirm("Simular pagamento Stripe?\n" + title + " — " + amountLabel);
      if (ok && typeof onSuccess === "function") onSuccess();
      return;
    }

    titleEl.textContent = title;
    amountEl.textContent = amountLabel;
    overlay.classList.add("is-open");

    function close() {
      overlay.classList.remove("is-open");
    }

    function onConfirm() {
      close();
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
      if (typeof onSuccess === "function") onSuccess();
    }

    function onCancel() {
      close();
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
    }

    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
  }

  function showToast(message) {
    var el = document.getElementById("app-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "app-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 3200);
  }

  /** Normaliza imóvel do storage para vitrine/ficha (campos opcionais). */
  function enrichProperty(p) {
    if (!p) return null;
    var o = Object.assign({}, p);
    if (!o.codigo && o.id) o.codigo = String(o.id).replace(/^P-/, "VN-");
    o.areaM2 = o.areaM2 != null ? Number(o.areaM2) : 0;
    o.quartos = o.quartos != null ? Number(o.quartos) : 0;
    o.suites = o.suites != null ? Number(o.suites) : 0;
    o.salas = o.salas != null ? Number(o.salas) : 0;
    o.banheiros = o.banheiros != null ? Number(o.banheiros) : 0;
    o.vagas = o.vagas != null ? Number(o.vagas) : 0;
    var comm = String(o.commissionPlan || "");
    var planStr = String(o.plan || "");
    if (!o.listingProfile) {
      if (
        comm.indexOf("3") === 0 ||
        planStr.indexOf("3%") !== -1 ||
        planStr.toLowerCase().indexOf("conta própria") !== -1 ||
        planStr.toLowerCase().indexOf("self") !== -1
      ) {
        o.listingProfile = "autonomia";
      } else {
        o.listingProfile = "consultoria";
      }
    }
    if (!o.planLabel) {
      if (comm === "3%") o.planLabel = "3% · Venda por conta própria";
      else if (comm === "4%") o.planLabel = "4% · Mídia Pro (pacote)";
      else if (comm === "6%") o.planLabel = "6% · VN Prime Tradicional";
      else o.planLabel = planStr || "—";
    }
    if (!o.description) o.description = "Descrição em elaboração pela curadoria VN Prime.";
    if (!o.photos) o.photos = [];
    o.hideOwnerContact = o.listingProfile === "autonomia" || comm === "3%";
    return o;
  }

  /** Catálogo demo + imóveis persistidos (detalhe do anúncio). Aceita `id` ou `codigo` (ex.: VN-4401). */
  function getListingById(idOrCode) {
    if (idOrCode == null || idOrCode === "") return null;
    var key = String(idOrCode);
    var cat = global.VNPrimeCatalog;
    if (cat && Array.isArray(cat)) {
      var found = cat.find(function (x) {
        return x.id === key || x.codigo === key;
      });
      if (found) return enrichProperty(Object.assign({}, found));
    }
    var list = getProperties();
    var p = list.find(function (x) {
      return x.id === key || x.codigo === key;
    });
    return p ? enrichProperty(p) : null;
  }

  global.VNPrime = {
    getUser: getUser,
    setUser: setUser,
    getProperties: getProperties,
    saveProperties: saveProperties,
    addProperty: addProperty,
    updateProperty: updateProperty,
    getLeads: getLeads,
    saveLeads: saveLeads,
    addLead: addLead,
    applyProfileTheme: applyProfileTheme,
    simulateStripeCheckout: simulateStripeCheckout,
    showToast: showToast,
    getListingById: getListingById,
  };
})(window);
