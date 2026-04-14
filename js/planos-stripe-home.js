/** Botões de plano / booster na home — checkout simulado Stripe (substituir por Session real). */
(function () {
  var VP = window.VNPrime;
  if (!VP || !VP.simulateStripeCheckout) return;

  document.querySelectorAll("[data-stripe-checkout]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-title") || "Pagamento";
      var amount = btn.getAttribute("data-amount") || "—";
      VP.simulateStripeCheckout({
        title: title,
        amountLabel: amount,
        onSuccess: function () {
          VP.showToast("Pagamento simulado. Produção: webhook Stripe → n8n → liberação.");
 },
      });
    });
  });
})();
