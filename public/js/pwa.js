// Instalación como app (PWA): registra el service worker y ofrece "Instalar app" cuando el navegador lo permite.
(() => {
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
  let evento = null;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); evento = e;
    if (matchMedia("(display-mode: standalone)").matches) return;
    const b = document.createElement("button");
    b.textContent = "📲 Instalar app Brie";
    b.style.cssText = "position:fixed;left:1rem;bottom:1rem;z-index:50;background:#453a6b;color:#fff;border:0;border-radius:2rem;padding:.7rem 1.1rem;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,.3);cursor:pointer;";
    b.onclick = async () => { b.remove(); evento.prompt(); await evento.userChoice; evento = null; };
    document.body.appendChild(b);
  });
})();
