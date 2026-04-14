(function () {
  var VP = window.VNPrime;
  var addProperty = VP.addProperty;
  var addLead = VP.addLead;
  var simulateStripeCheckout = VP.simulateStripeCheckout;
  var showToast = VP.showToast;

  var TOTAL_STEPS = 5;
  var currentStep = 1;

  var indicator = document.getElementById("step-indicator");
  var panels = Array.prototype.slice.call(document.querySelectorAll(".wizard-panel"));
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  var thanksPanel = document.getElementById("cadastro-thanks");
  var thanksTitle = document.getElementById("thanks-title");
  var thanksBody = document.getElementById("thanks-body");

  function renderIndicator() {
    if (!indicator) return;
    indicator.innerHTML = "";
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var span = document.createElement("span");
      span.className = "step-pill";
      span.textContent = "Passo " + i;
      if (i === currentStep) span.classList.add("is-active");
      else if (i < currentStep) span.classList.add("is-done");
      indicator.appendChild(span);
    }
  }

  function showStep(n) {
    currentStep = n;
    panels.forEach(function (p) {
      var s = Number(p.dataset.step);
      p.classList.toggle("is-visible", s === n);
    });
    if (btnPrev) btnPrev.disabled = n === 1;
    if (btnNext) {
      if (n === TOTAL_STEPS) {
        btnNext.textContent = "—";
        btnNext.disabled = true;
      } else {
        btnNext.textContent = "Próximo";
        btnNext.disabled = false;
      }
    }
    renderIndicator();
  }

  function validateStep(n) {
    if (n === 1) {
      var nome = (document.getElementById("c-nome") || {}).value.trim();
      var email = (document.getElementById("c-email") || {}).value.trim();
      var zap = (document.getElementById("c-zap") || {}).value.trim();
      var tipo = (document.getElementById("c-tipo") || {}).value;
      return nome && email && zap && tipo;
    }
    if (n === 2) return !!(document.getElementById("c-bairro-pub") || {}).value.trim();
    if (n === 3) {
      var titulo = (document.getElementById("c-titulo") || {}).value.trim();
      var preco = (document.getElementById("c-preco") || {}).value;
      var tipo = (document.getElementById("c-tipo") || {}).value;
      return tipo && titulo && preco;
    }
    return true;
  }

  function validateAllForSubmit() {
    for (var s = 1; s <= 4; s++) {
      if (!validateStep(s)) return false;
    }
    return true;
  }

  function syncPlanRadios(groupName) {
    document.querySelectorAll('input[name="' + groupName + '"]').forEach(function (r) {
      var lab = r.closest(".plan-option");
      if (lab) lab.classList.toggle("is-selected", r.checked);
    });
  }

  function wirePlanOptions() {
    document.querySelectorAll('.plan-option input[type="radio"]').forEach(function (inp) {
      inp.addEventListener("change", function () {
        syncPlanRadios(inp.name);
      });
    });
  }

  function mediaAmountForQuartos() {
    var q = Number((document.getElementById("c-quartos") || {}).value || 0);
    if (q <= 1) return { label: "R$ 899,00", title: "Pacote Mídia Pro — compacto (até 1 qto)", amount: "R$ 899,00" };
    if (q <= 3) return { label: "R$ 1.499,00", title: "Pacote Mídia Pro — residencial (2–3 qtos)", amount: "R$ 1.499,00" };
    return { label: "R$ 1.999,00", title: "Pacote Mídia Pro — editorial (4+ qtos)", amount: "R$ 1.999,00" };
  }

  function boosterCheckoutMeta(key) {
    if (key === "pro") key = "elite";
    if (key === "lite") return { title: "BOOSTER! Impulso", amount: "R$ 49,90" };
    if (key === "elite") return { title: "BOOSTER! Performance", amount: "R$ 99,00" };
    return null;
  }

  function readPhotosPreview() {
    var input = document.getElementById("c-upload");
    if (!input || !input.files || !input.files.length) return [];
    var out = [];
    var max = Math.min(6, input.files.length);
    for (var i = 0; i < max; i++) {
      try {
        out.push(URL.createObjectURL(input.files[i]));
      } catch (e) {}
    }
    return out;
  }

  function buildDraftProperty(overrides) {
    var email = (document.getElementById("c-email") || {}).value || "sem-email";
    var titulo = (document.getElementById("c-titulo") || {}).value || "Imóvel sem título";
    var bairro = (document.getElementById("c-bairro-pub") || {}).value || "—";
    var tipo = (document.getElementById("c-tipo") || {}).value || "—";
    var preco = Number((document.getElementById("c-preco") || {}).value || 0);
    var areaM2 = Number((document.getElementById("c-metragem") || {}).value || 0);
    var quartos = Number((document.getElementById("c-quartos") || {}).value || 0);
    var suites = Number((document.getElementById("c-suites") || {}).value || 0);
    var salas = Number((document.getElementById("c-salas") || {}).value || 0);
    var banheiros = Number((document.getElementById("c-banheiros") || {}).value || 0);
    var vagas = Number((document.getElementById("c-vagas") || {}).value || 0);
    var desc = (document.getElementById("c-descricao") || {}).value.trim();
    var endPriv = (document.getElementById("c-endereco-priv") || {}).value.trim();

    var commEl = document.querySelector('input[name="commission-plan"]:checked');
    var comm = (commEl && commEl.value) || "3";
    var boostEl = document.querySelector('input[name="booster-plan"]:checked');
    var boost = (boostEl && boostEl.value) || "none";

    var commissionPlan =
      comm === "direta" ? "Taxa" : comm === "4" ? "4%" : comm === "6" ? "6%" : "3%";
    var listingProfile =
      comm === "direta" ? "venda_direta" : comm === "3" ? "autonomia" : "consultoria";
    var planLabel =
      comm === "direta"
        ? "Venda direta · taxa (sem comissão na venda)"
        : comm === "3"
          ? "Venda assistida · 3% (venda pela plataforma)"
          : comm === "4"
            ? "Venda premium VN Prime · 4% (mídia credenciada)"
            : "Venda completa · 6% (processo convencional VN Prime)";

    var photos = readPhotosPreview();

    return Object.assign(
      {
        id: "P-" + Date.now(),
        codigo: "VN-" + String(Date.now()).slice(-4),
        title: titulo,
        neighborhood: bairro,
        type: tipo,
        price: preco,
        areaM2: areaM2,
        quartos: quartos,
        suites: suites,
        salas: salas,
        banheiros: banheiros,
        vagas: vagas,
        description: desc || "Descrição enviada pelo proprietário — em curadoria.",
        ownerEmail: email,
        ownerPhone: (document.getElementById("c-zap") || {}).value || "",
        addressPrivate: endPriv,
        commissionPlan: commissionPlan,
        listingProfile: listingProfile,
        plan: planLabel,
        planLabel: planLabel,
        booster: boost,
        photos: photos,
        createdAt: new Date().toISOString(),
      },
      overrides || {}
    );
  }

  function showThanks(title, body) {
    if (thanksTitle) thanksTitle.textContent = title;
    if (thanksBody) thanksBody.textContent = body;
    if (thanksPanel) {
      thanksPanel.classList.add("is-visible");
      thanksPanel.scrollIntoView({ behavior: "smooth" });
    }
  }

  function registerLead(property, extra) {
    addLead({
      id: "L-" + Date.now(),
      name: (document.getElementById("c-nome") || {}).value || "Lead cadastro",
      email: (document.getElementById("c-email") || {}).value || "",
      phone: (document.getElementById("c-zap") || {}).value || "—",
      column: "novo",
      source: "Cadastro 5 passos · " + (extra || property.plan || property.status),
    });
  }

  function finalizeProperty(property, thanksKey) {
    addProperty(property);
    registerLead(property);

    if (thanksKey === "sem-plano") {
      showThanks(
        "Rascunho salvo",
        "Seu imóvel está como PENDENTE_PLANO: não entra na vitrine pública até você escolher venda direta (taxa), assistida (3%), premium (4%) ou completa (6%) e concluir os passos de pagamento quando aplicável."
      );
    } else if (thanksKey === "direta") {
      showThanks(
        "Venda direta registrada",
        "Taxa de publicação confirmada (simulado). Não há comissão sobre o valor da venda — apenas a taxa contratada. O anúncio segue para curadoria."
      );
    } else if (thanksKey === "3") {
      showThanks(
        "Recebemos seu anúncio",
        "Venda assistida: após aprovação, a comissão de 3% incide se a venda ocorrer pela plataforma. Você receberá retorno da curadoria."
      );
    } else if (thanksKey === "4") {
      showThanks(
        "Pacote de mídia confirmado (simulado)",
        "Em produção: após o webhook do Stripe, agendamos o fotógrafo credenciado. O anúncio segue como Pendente até a curadoria aprovar as fotos finais."
      );
    } else if (thanksKey === "6") {
      showThanks(
        "Venda completa VN Prime",
        "Um consultor entrará em contato em até 2 horas (horário comercial) para conduzir o processo convencional de venda com a VN Prime Imóveis."
      );
    } else {
      showThanks("Obrigado!", "Registro concluído.");
    }
    showToast("Cadastro registrado localmente (protótipo).");
  }

  function runCheckoutChain(first, thenFn) {
    simulateStripeCheckout({
      title: first.title,
      amountLabel: first.amount,
      onSuccess: function () {
        if (typeof thenFn === "function") thenFn();
 },
    });
  }

  if (btnPrev)
    btnPrev.addEventListener("click", function () {
      if (currentStep > 1) showStep(currentStep - 1);
    });

  if (btnNext)
    btnNext.addEventListener("click", function () {
      if (currentStep >= TOTAL_STEPS) return;
      if (!validateStep(currentStep)) {
        showToast("Preencha os campos obrigatórios deste passo.");
        return;
      }
      showStep(currentStep + 1);
    });

  wirePlanOptions();

  document.querySelectorAll(".plan-option").forEach(function (opt) {
    opt.addEventListener("click", function () {
      var inp = opt.querySelector('input[type="radio"]');
      if (!inp || !inp.name) return;
      document.querySelectorAll('input[name="' + inp.name + '"]').forEach(function (r) {
        var lab = r.closest(".plan-option");
        if (lab) lab.classList.toggle("is-selected", r === inp);
      });
    });
  });

  var btnSemPlano = document.getElementById("btn-sem-plano");
  if (btnSemPlano)
    btnSemPlano.addEventListener("click", function () {
      if (!validateAllForSubmit()) {
        showToast("Volte aos passos anteriores e complete os campos obrigatórios.");
        return;
      }
      var prop = buildDraftProperty({ status: "PENDENTE_PLANO" });
      finalizeProperty(prop, "sem-plano");
    });

  var btnFin = document.getElementById("btn-finalizar-plano");
  if (btnFin)
    btnFin.addEventListener("click", function () {
      if (!validateAllForSubmit()) {
        showToast("Complete os passos 1 a 4 antes de enviar.");
        return;
      }

      var commEl = document.querySelector('input[name="commission-plan"]:checked');
      var comm = (commEl && commEl.value) || "3";
      var boostEl = document.querySelector('input[name="booster-plan"]:checked');
      var boost = (boostEl && boostEl.value) || "none";

      var draft = buildDraftProperty({ status: "Pendente" });
      var boostMeta = boosterCheckoutMeta(boost);

      function afterBoostOrDone() {
        finalizeProperty(draft, comm);
      }

      function afterMediaIfNeeded() {
        if (boostMeta) {
          runCheckoutChain(boostMeta, afterBoostOrDone);
        } else {
          afterBoostOrDone();
        }
      }

      if (comm === "direta") {
        runCheckoutChain(
          {
            title: "Taxa Venda direta · publicação na vitrine",
            amount: "R$ 297,00",
          },
          function () {
            draft.plan = draft.plan + " · Taxa paga (simulado)";
            draft.planLabel = draft.plan;
            afterMediaIfNeeded();
          }
        );
        return;
      }

      if (comm === "4") {
        var media = mediaAmountForQuartos();
        runCheckoutChain(
          { title: media.title, amount: media.amount },
          function () {
            draft.plan = draft.plan + " · Pacote pago (simulado)";
            draft.planLabel = draft.plan;
            afterMediaIfNeeded();
          }
        );
        return;
      }

      if (boostMeta) {
        runCheckoutChain(boostMeta, afterBoostOrDone);
        return;
      }

      afterBoostOrDone();
    });

  var params = new URLSearchParams(window.location.search);
  var fluxo = params.get("fluxo");
  if (fluxo === "venda-direta") {
    var rd = document.querySelector('input[name="commission-plan"][value="direta"]');
    if (rd) {
      rd.checked = true;
      syncPlanRadios("commission-plan");
    }
  } else if (fluxo === "conta-propria") {
    var r3 = document.querySelector('input[name="commission-plan"][value="3"]');
    if (r3) {
      r3.checked = true;
      syncPlanRadios("commission-plan");
    }
  } else if (fluxo === "premium") {
    var r4 = document.querySelector('input[name="commission-plan"][value="4"]');
    if (r4) {
      r4.checked = true;
      syncPlanRadios("commission-plan");
    }
  } else if (fluxo === "consultoria") {
    var r6 = document.querySelector('input[name="commission-plan"][value="6"]');
    if (r6) {
      r6.checked = true;
      syncPlanRadios("commission-plan");
    }
  }

  renderIndicator();
})();
