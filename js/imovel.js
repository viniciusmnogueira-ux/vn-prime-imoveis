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

  var isVendaDireta = data.hideOwnerContact === true || data.listingProfile === "autonomia";
  var privacy = document.getElementById("imovel-privacy-banner");
  if (privacy) {
    privacy.hidden = false;
    if (isVendaDireta) {
      privacy.className = "imovel-privacy imovel-privacy--direta";
      privacy.innerHTML =
        "<p><strong>Venda direta (plano 3%).</strong> O endereço completo e os dados do proprietário ficam apenas no cadastro interno; na vitrine o público vê <strong>só o bairro</strong>. Telefone e e-mail do anunciante <strong>não são exibidos</strong> — o interesse entra pela plataforma.</p>";
    } else {
      privacy.className = "imovel-privacy imovel-privacy--vn";
      privacy.innerHTML =
        "<p><strong>Intermediação VN Prime (4% ou 6%).</strong> A operação é conduzida pelo time e, no modelo tradicional (6%), por <strong>corretor parceiro</strong> alocado no portal do corretor. Pacotes extras de foto, vídeo, drone e <strong>BOOSTER!</strong> são contratados à parte, quando fizer sentido.</p>";
    }
  }

  var leadIntro = document.getElementById("imovel-lead-intro");
  if (leadIntro) {
    leadIntro.textContent = isVendaDireta
      ? "Venda direta: preencha seus dados. A VN Prime encaminha ao proprietário sem expor o contato dele na página."
      : "Seus dados seguem para o time VN Prime ou corretor parceiro, conforme a etapa da negociação.";
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

