(function () {
  var VP = window.VNPrime;
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var data = id ? VP.getListingById(id) : null;

  var root = document.getElementById("imovel-root");
  if (!root) return;

  if (!data || data.status !== "Aprovado") {
    root.innerHTML =
      '<div class="container section"><p class="muted">Imóvel não encontrado ou ainda não disponível na vitrine.</p><p><a href="index.html#resultados">Voltar à busca</a></p></div>';
    return;
  }

  function formatBRL(n) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }

  var photos = data.photos && data.photos.length ? data.photos : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];
  var mainImg = document.getElementById("imovel-main-img");
  if (mainImg) {
    mainImg.src = photos[0];
    mainImg.alt = data.title;
  }

  var thumbs = document.getElementById("imovel-thumbs");
  if (thumbs) {
    thumbs.innerHTML = "";
    photos.forEach(function (src, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "imovel-thumb" + (i === 0 ? " is-active" : "");
      b.innerHTML = '<img src="' + src + '" alt="" loading="lazy" />';
      b.addEventListener("click", function () {
        if (mainImg) mainImg.src = src;
        thumbs.querySelectorAll(".imovel-thumb").forEach(function (t) {
          t.classList.remove("is-active");
        });
        b.classList.add("is-active");
      });
      thumbs.appendChild(b);
    });
  }

  document.getElementById("imovel-title").textContent = data.title;
  document.getElementById("imovel-code").textContent = data.codigo || data.id;
  document.getElementById("imovel-price").textContent = formatBRL(data.price);
  document.getElementById("imovel-neighborhood").textContent = data.neighborhood;
  document.getElementById("imovel-type").textContent = data.type;
  document.getElementById("imovel-plan").textContent = data.planLabel || data.plan || "—";

  var profile = data.listingProfile || "";
  var isTaxaDireta = profile === "venda_direta" || data.commissionPlan === "Taxa";
  var isAssistida = profile === "autonomia" || data.commissionPlan === "3%";

  var privacy = document.getElementById("imovel-privacy-banner");
  if (privacy) {
    privacy.hidden = false;
    if (isTaxaDireta) {
      privacy.className = "imovel-privacy imovel-privacy--direta";
      privacy.innerHTML =
        "<p><strong>Venda direta (taxa).</strong> <strong>Sem comissão sobre o valor do imóvel</strong> — apenas taxa de publicação conforme contrato. Endereço completo e dados do proprietário ficam no cadastro interno; na vitrine, <strong>só o bairro</strong>. Contatos do anunciante <strong>não aparecem</strong> — interesse pela plataforma.</p>";
    } else if (isAssistida) {
      privacy.className = "imovel-privacy imovel-privacy--direta";
      privacy.innerHTML =
        "<p><strong>Venda assistida (3%).</strong> Você cadastrou as fotos e conduz a negociação; se a venda ocorrer <strong>pela plataforma</strong>, incide <strong>3% de comissão</strong>. Na ficha pública: <strong>só o bairro</strong>; telefone e e-mail do proprietário <strong>não são exibidos</strong>.</p>";
    } else {
      privacy.className = "imovel-privacy imovel-privacy--vn";
      privacy.innerHTML =
        "<p><strong>Venda premium ou completa VN Prime (4% ou 6%).</strong> A VN Prime conduz ou apoia o processo; na <strong>venda completa</strong>, entra a <strong>rede de corretores</strong> quando aplicável. Pacotes de mídia, drone e <strong>BOOSTER!</strong> podem ser contratados à parte.</p>";
    }
  }

  var leadIntro = document.getElementById("imovel-lead-intro");
  if (leadIntro) {
    if (isTaxaDireta) {
      leadIntro.textContent =
        "Venda direta: preencha seus dados. A VN Prime encaminha o interesse ao proprietário sem expor o contato dele na página.";
    } else if (isAssistida) {
      leadIntro.textContent =
        "Venda assistida: seus dados seguem para o proprietário via plataforma; a comissão de 3% aplica-se se a venda for formalizada pelo canal VN Prime.";
    } else {
      leadIntro.textContent =
        "Seus dados seguem para o time VN Prime ou para um corretor da rede, conforme a etapa da negociação.";
    }
  }

  var spec = document.getElementById("imovel-specs");
  if (spec) {
    spec.innerHTML =
      '<li><strong>Área útil</strong><span>' +
      (data.areaM2 || "—") +
      " m²</span></li>" +
      '<li><strong>Quartos</strong><span>' +
      (data.quartos != null ? data.quartos : "—") +
      "</span></li>" +
      '<li><strong>Suítes</strong><span>' +
      (data.suites != null ? data.suites : "—") +
      "</span></li>" +
      '<li><strong>Salas</strong><span>' +
      (data.salas != null ? data.salas : "—") +
      "</span></li>" +
      '<li><strong>Banheiros</strong><span>' +
      (data.banheiros != null ? data.banheiros : "—") +
      "</span></li>" +
      '<li><strong>Vagas</strong><span>' +
      (data.vagas != null ? data.vagas : "—") +
      "</span></li>";
  }

  document.getElementById("imovel-description").textContent = data.description || "";

  var leadForm = document.getElementById("imovel-lead-form");
  if (leadForm)
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      VP.addLead({
        id: "L-" + Date.now(),
        name: fd.get("nome"),
        email: fd.get("email"),
        phone: fd.get("tel"),
        column: "novo",
        source: "Ficha imóvel " + (data.codigo || data.id),
      });
      VP.showToast(
        isVendaDireta
          ? "Interesse registrado. Em produção: notificação ao proprietário sem exibir o contato dele publicamente."
          : "Solicitação enviada. Um consultor retornará em breve."
      );
      e.target.reset();
    });
})();

