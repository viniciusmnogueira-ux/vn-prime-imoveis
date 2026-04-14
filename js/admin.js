(function () {
  var VP = window.VNPrime;
  var getProperties = VP.getProperties;
  var updateProperty = VP.updateProperty;
  var showToast = VP.showToast;

  function formatBRL(n) {
    return Number(n).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  }

  function statusBadge(status) {
    if (status === "PENDENTE_PLANO") {
      return "<span class=\"status status--pendente-plano\">Pendente · sem plano</span>";
    }
    return "<span class=\"status status--pendente\">Pendente</span>";
  }

  function render() {
    var tbody = document.getElementById("admin-tbody");
    var empty = document.getElementById("admin-empty");
    if (!tbody) return;

    var pending = getProperties().filter(function (p) {
      return p.status === "Pendente" || p.status === "PENDENTE_PLANO";
    });

    tbody.innerHTML = "";

    if (!pending.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    pending.forEach(function (p) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        p.title +
        "</td>" +
        "<td>" +
        p.neighborhood +
        "</td>" +
        "<td>" +
        p.type +
        "</td>" +
        "<td>" +
        formatBRL(p.price) +
        "</td>" +
        "<td>" +
        (p.plan || p.commissionPlan || "—") +
        "</td>" +
        "<td>" +
        statusBadge(p.status) +
        "</td>" +
        "<td><button type=\"button\" class=\"btn btn--accent btn--sm approve-btn\" data-id=\"" +
        p.id +
        "\">Aprovar</button></td>";
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".approve-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var list = getProperties();
        var row = list.find(function (x) {
          return x.id === id;
        });
        if (row && row.status === "PENDENTE_PLANO") {
          showToast(
            "Não é possível aprovar: o anúncio está PENDENTE_PLANO (sem comissão/plano). Regularize com o proprietário."
          );
          return;
        }
        updateProperty(id, { status: "Aprovado" });
        showToast("Anúncio aprovado. Pode aparecer na vitrine pública (somente status Aprovado).");
        render();
      });
    });
  }

  document.documentElement.dataset.profile = "admin";
  render();
})();
