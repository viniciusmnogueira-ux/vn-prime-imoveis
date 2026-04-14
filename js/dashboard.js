(function () {
  var VP = window.VNPrime;
  var getLeads = VP.getLeads;
  var saveLeads = VP.saveLeads;
  var getProperties = VP.getProperties;
  var setUser = VP.setUser;
  var applyProfileTheme = VP.applyProfileTheme;
  var simulateStripeCheckout = VP.simulateStripeCheckout;
  var showToast = VP.showToast;

  var roleSelect = document.getElementById("role-select");
  var roleBadge = document.getElementById("role-badge");
  var panels = {
    owner: document.getElementById("panel-owner"),
    broker: document.getElementById("panel-broker"),
    photo: document.getElementById("panel-photo"),
    admin: document.getElementById("panel-admin"),
  };

  var roleLabels = {
    owner: "Proprietário",
    broker: "Corretor",
    photo: "Fotógrafo",
    admin: "Administração",
  };

  function showPanel(role) {
    Object.keys(panels).forEach(function (k) {
      var el = panels[k];
      if (!el) return;
      el.hidden = k !== role;
    });
  }

  function refreshFactorOne() {
    var factor = document.getElementById("owner-factorone");
    if (!factor) return;
    var u = VP.getUser();
    var show = u && u.plan === "elite";
    factor.style.display = show ? "block" : "none";
  }

  function persistRole(role) {
    var prev = VP.getUser() || {};
    setUser(
      Object.assign({}, prev, {
        role: role,
        name: prev.name || "Usuário Demo",
        email: prev.email || "demo@vnprime.com",
      })
    );
    applyProfileTheme(role);
    if (roleBadge) roleBadge.textContent = roleLabels[role] || role;
    showPanel(role);
    refreshFactorOne();
  }

  function renderBoosters() {
    var grid = document.getElementById("booster-grid");
    if (!grid) return;
    var items = [
      {
        id: "b1",
        name: "BOOSTER! Impulso",
        price: "R$ 49,90",
        desc: "Destaque na busca + post IG VN Prime + roteiro Stories/Reels.",
      },
      {
        id: "b2",
        name: "BOOSTER! Performance",
        price: "R$ 99,00",
        desc: "Reels editado, e-mail marketing, tráfego Meta, copy e tratamento de imagem.",
      },
    ];
    grid.innerHTML = "";
    items.forEach(function (it) {
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        "<h4>" +
        it.name +
        "</h4>" +
        "<p class=\"card__price\" style=\"font-size:1.35rem\">" +
        it.price +
        "</p>" +
        "<p class=\"muted\">" +
        it.desc +
        "</p>" +
        "<button type=\"button\" class=\"btn btn--accent btn--sm booster-buy\" data-title=\"" +
        it.name +
        "\" data-price=\"" +
        it.price +
        "\">Comprar (simulado)</button>";
      grid.appendChild(card);
    });
    grid.querySelectorAll(".booster-buy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        simulateStripeCheckout({
          title: btn.getAttribute("data-title"),
          amountLabel: btn.getAttribute("data-price"),
          onSuccess: function () {
            showToast("Booster ativado (simulação). Stripe webhook → créditos de impressão.");
          },
        });
      });
    });
  }

  function renderKanban() {
    var root = document.getElementById("kanban-root");
    if (!root) return;
    var leads = getLeads();
    var cols = [
      { key: "novo", title: "Novo" },
      { key: "contato", title: "Em contato" },
      { key: "visita", title: "Visita" },
    ];
    root.innerHTML = "";
    cols.forEach(function (col) {
      var wrap = document.createElement("div");
      wrap.className = "kanban-col";
      wrap.dataset.column = col.key;
      wrap.innerHTML = "<h4>" + col.title + "</h4>";
      leads
        .filter(function (l) {
          return l.column === col.key;
        })
        .forEach(function (l) {
          var card = document.createElement("div");
          card.className = "lead-card";
          card.innerHTML =
            "<strong>" +
            l.name +
            "</strong><br><span class=\"muted\">" +
            l.email +
            "</span><br><small>" +
            l.source +
            "</small><div style=\"margin-top:0.5rem\">" +
            '<button type="button" class="btn btn--ghost btn--sm lead-move" data-id="' +
            l.id +
            '" data-dir="next">Avançar</button> ' +
            '<button type="button" class="btn btn--ghost btn--sm lead-move" data-id="' +
            l.id +
            '" data-dir="prev">Voltar</button></div>';
          wrap.appendChild(card);
        });
      root.appendChild(wrap);
    });

    root.querySelectorAll(".lead-move").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var dir = btn.getAttribute("data-dir");
        var order = ["novo", "contato", "visita"];
        var list = getLeads();
        var lead = list.find(function (x) {
          return x.id === id;
        });
        if (!lead) return;
        var i = order.indexOf(lead.column);
        if (dir === "next") i = Math.min(i + 1, order.length - 1);
        else i = Math.max(i - 1, 0);
        lead.column = order[i];
        saveLeads(list);
        renderKanban();
      });
    });
  }

  function renderBrokerTradicional() {
    var el = document.getElementById("broker-tradicional-list");
    if (!el) return;
    var props = getProperties().filter(function (p) {
      var plan = String(p.plan || "");
      return plan.indexOf("6%") !== -1 || plan.indexOf("Tradicional") !== -1;
    });
    if (!props.length) {
      el.innerHTML =
        '<p class="muted">Nenhum imóvel marcado como Tradicional 6% ainda. Cadastre com esse plano ou edite o campo <code>plan</code> no storage.</p>';
      return;
    }
    el.innerHTML = props
      .map(function (p) {
        return (
          '<div class="listing-mini"><div class="listing-mini__ph"></div><div><strong>' +
          p.title +
          "</strong><br><span class=\"muted\">" +
          p.neighborhood +
          " · " +
          p.plan +
          "</span></div></div>"
        );
      })
      .join("");
  }

  function renderPhotoJobs() {
    var el = document.getElementById("photo-jobs");
    if (!el) return;
    var jobs = [
      { id: "J1", title: "Apartamento 180m² — Pinheiros", price: 899, tipo: "Pacote Essencial" },
      { id: "J2", title: "Cobertura com terraço — Moema", price: 1499, tipo: "Pacote Intermediário" },
      { id: "J3", title: "Casa térrea — Alphaville", price: 1999, tipo: "Pacote Editorial" },
    ];
    el.innerHTML = "";
    jobs.forEach(function (j) {
      var card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML =
        "<strong>" +
        j.title +
        "</strong><br><span class=\"muted\">" +
        j.tipo +
        "</span>" +
        '<p class="card__price" style="font-size:1.25rem;margin:0.35rem 0">R$ ' +
        j.price.toLocaleString("pt-BR") +
        "</p>" +
        '<button type="button" class="btn btn--primary btn--sm job-accept" data-id="' +
        j.id +
        '">Aceitar job (simulado)</button>';
      el.appendChild(card);
    });
    el.querySelectorAll(".job-accept").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showToast(
          "Job " +
            btn.getAttribute("data-id") +
            " aceito. n8n: notificar proprietário + criar OS no Notion/CRM."
        );
      });
    });
  }

  function openLeadsPdf() {
    var leads = getLeads();
    var rows = leads
      .map(function (l) {
        return (
          "<tr><td>" +
          l.name +
          "</td><td>" +
          l.email +
          "</td><td>" +
          l.phone +
          "</td><td>" +
          l.column +
          "</td><td>" +
          l.source +
          "</td></tr>"
        );
      })
      .join("");
    var html =
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Leads VN Prime</title>" +
      "<style>body{font-family:system-ui;margin:24px}h1{color:#0f2244}table{width:100%;border-collapse:collapse}" +
      "th,td{border:1px solid #ccc;padding:8px;font-size:12px}th{background:#f2efe8;text-align:left}</style></head><body>" +
      "<h1>Relatório de Leads — VN Prime Imóveis</h1>" +
      "<p>Gerado em " +
      new Date().toLocaleString("pt-BR") +
      "</p>" +
      "<table><thead><tr><th>Nome</th><th>E-mail</th><th>WhatsApp</th><th>Etapa</th><th>Origem</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      "<script>window.onload=function(){window.print()}<\/script></body></html>";
    var w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      showToast("Permita pop-ups para gerar o PDF.");
    }
  }

  var btnPdf = document.getElementById("btn-pdf-leads");
  if (btnPdf) btnPdf.addEventListener("click", openLeadsPdf);

  if (roleSelect) {
    roleSelect.addEventListener("change", function () {
      persistRole(roleSelect.value);
      if (roleSelect.value === "broker") {
        renderKanban();
        renderBrokerTradicional();
      }
      if (roleSelect.value === "photo") renderPhotoJobs();
    });
  }

  /* Init */
  renderBoosters();
  renderKanban();
  renderBrokerTradicional();
  renderPhotoJobs();

  var initial = (VP.getUser() && VP.getUser().role) || "owner";
  if (roleSelect) roleSelect.value = initial;
  persistRole(initial);

  /* Se último cadastro foi Elite, lembrar FactorOne no painel do proprietário */
  try {
    var last = localStorage.getItem("vnprime_last_subscription");
    if (last === "elite") {
      var u = VP.getUser() || {};
      u.plan = "elite";
      setUser(u);
    }
  } catch (e) {}

  refreshFactorOne();

  /* Hook: cadastrar pode setar vnprime_last_subscription ao finalizar elite — feito em cadastrar */
})();
