(function () {
  const destinationButtons = document.querySelectorAll('a[id^="btn-"]');

  destinationButtons.forEach((button) => {
    const destinationId = button.id;
    if (!destinationId) return;

    const destinationUrl = `viaje.html?destino=${encodeURIComponent(destinationId)}`;
    button.setAttribute("href", destinationUrl);

    button.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = destinationUrl;
    });
  });
})();
