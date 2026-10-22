document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("siteQrCanvas");
  if (!canvas) return;
  const qr = window.QRCodeLib;
  if (!qr || typeof qr.toCanvas !== "function") {
    const message = document.createElement("p");
    message.className = "site-qr-error";
    message.textContent = "No se pudo preparar el código QR. Recarga la página para intentarlo de nuevo.";
    canvas.replaceWith(message);
    return;
  }

  // Codifica el inicio del mismo origen: en vista previa y en producción abre el sitio donde se escanea.
  const homeUrl = new URL("/", window.location.origin).href;
  qr.toCanvas(canvas, homeUrl, {
    width: 196,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#171717", light: "#ffffff" },
  }).catch(() => {
    const message = document.createElement("p");
    message.className = "site-qr-error";
    message.textContent = "No se pudo preparar el código QR. Recarga la página para intentarlo de nuevo.";
    canvas.replaceWith(message);
  });
});
