document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("siteQrCanvas");
  const link = document.getElementById("siteQrLink");
  if (!canvas || !link || !window.QRCodeLib) return;
  const homeUrl = new URL("index.html", window.location.href).href;
  link.href = homeUrl;
  QRCodeLib.toCanvas(canvas, homeUrl, {
    width: 196,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#171717", light: "#ffffff" },
  }).catch(() => {
    canvas.hidden = true;
    link.textContent = "Abrir la página web →";
  });
});
