// Integración para HTML sin React. Endpoint predeterminado del SDK oficial.
// En local Vercel no sirve este endpoint: evitar solicitudes de prueba.
if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.append(script);
}
