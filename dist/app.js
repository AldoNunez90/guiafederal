import {matchesMedia} from './search.js';
import {
  youtubeVideoId,
  youtubeEmbedURL,
  youtubeStream,
  currentLiveStream,
} from "./youtube.js";
const $ = (id) => document.getElementById(id);
const provinces = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];
const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast("No se pudo guardar en este navegador.");
    return false;
  }
}
const stored = read("sf-favorites", []);
let favorites = new Set(Array.isArray(stored) ? stored : []),
  onlyFavorites = false,
  media = [];
function toast(message) {
  $("toast").textContent = message;
  $("toast").style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(
    () => ($("toast").style.display = "none"),
    3500,
  );
}
for (const province of provinces) {
  $("province").add(new Option(province, province));
  $("form-province").add(new Option(province, province));
}
function element(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function safeURL(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
function external(text, url, className) {
  const a = element("a", text, className);
  a.href = safeURL(url);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", text + " (abre en otra pestaña)");
  return a;
}
const historyValue = read("sf-recent", []);
let recent = Array.isArray(historyValue)
  ? historyValue.filter((id) => typeof id === "string").slice(0, 12)
  : [];
function recordOpen(id) {
  recent = [id, ...recent.filter((x) => x !== id)].slice(0, 12);
  save("sf-recent", recent);
  render();
}
function row(m) {
  const card = element("article", undefined, "card");
  const mono = element(
    "div",
    m.name
      .split(" ")
      .slice(0, 2)
      .map((x) => x[0])
      .join(""),
    "monogram",
  );
  mono.setAttribute("aria-hidden", "true");
  if (m.logo && (/^assets\/logos\/[a-z0-9.-]+$/.test(m.logo) || /^https:\/\//.test(safeURL(m.logo)||""))) {
    const image = element("img");
    image.src = m.logo;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 48;
    image.height = 48;
    image.onerror = () => {
      image.remove();
      mono.textContent = m.name
        .split(" ")
        .slice(0, 2)
        .map((x) => x[0])
        .join("");
    };
    mono.textContent = "";
    mono.classList.add("official-logo");
    if (m.logoTheme === "dark") mono.classList.add("logo-dark");
    mono.append(image);
  }
  const content = element("div", undefined, "row-content");
  const live = currentLiveStream(m);
  if(live)card.classList.add('is-live');
  const website = safeURL(m.website);
  const title = element("h3", m.name);
  content.append(
    title,
    element("p", m.kind + " · " + m.city + " · " + m.province, "location"),
    element(
      "span",
      live ? "En vivo · Ver vivo" : website ? "Abrir web ↗" : "Acceso pendiente",
      live ? "action-label live-label" : "action-label",
    ),
  );
  const action = element(
    live ? "button" : website ? "a" : "div",
    undefined,
    "medium-action",
  );
  if (live) {
    action.type = "button";
    action.setAttribute("aria-label", "Ver vivo de " + m.name);
    action.classList.add("play-link");
    action.onclick = () => {
      if (currentLiveStream(m)) openPlayer(m, action);
      else {
        render();
        toast("La confirmación del vivo venció. Podés abrir la web del medio.");
      }
    };
  } else if (website) {
    action.href = website;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
    action.setAttribute(
      "aria-label",
      "Abrir web de " + m.name + " (otra pestaña)",
    );
    action.onclick = () => recordOpen(m.id);
  }
  action.append(mono, content);
  const heart = element("button", favorites.has(m.id) ? "♥" : "♡", "heart");
  heart.setAttribute("aria-label", "Favorito: " + m.name);
  heart.setAttribute("aria-pressed", String(favorites.has(m.id)));
  heart.onclick = () => {
    const next = new Set(favorites);
    next.has(m.id) ? next.delete(m.id) : next.add(m.id);
    if (save("sf-favorites", [...next])) {
      favorites = next;
      render();
    }
  };
  const details = element("details", undefined, "row-details");
  const summary = element("summary", "Información de " + m.name);
  summary.setAttribute("aria-label", "Información de " + m.name);
  const detailBody = element("div", undefined, "detail-body");
  const research = {
    sitio_revisado: "Sitio consultado",
    referencia: "Referencia encontrada",
    pendiente: "Revisión pendiente",
  };
  detailBody.append(
    element("p", m.topics.join(" · ")),
    element("p", m.accessNote || "En vivo: sin verificar."),
    element("p", research[m.researchStatus] + " · " + m.researchDate),
    external("Fuente del relevamiento ↗", m.source, "source"),
  );
  if (youtubeStream(m)?.title)
    detailBody.append(element("p", "Video: " + youtubeStream(m).title));
  if (m.logoSource)
    detailBody.append(external("Origen del logo ↗", m.logoSource, "source"));
  if (safeURL(m.youtubeChannel))
    detailBody.append(
      external("Abrir canal en YouTube ↗", m.youtubeChannel, "source"),
    );
  if (youtubeStream(m) && safeURL(m.website))
    detailBody.append(external("Sitio oficial ↗", m.website, "source"));
  if (!safeURL(m.website))
    detailBody.append(element("p", "Acceso oficial pendiente de validar."));
  details.append(summary, detailBody);
  card.append(action, heart, details);
  return card;
}
function section(title, items, emptyText) {
  const group = element("section", undefined, "media-group");
  group.append(element("h2", title, "group-title"));
  if (items.length) {
    const list = element("div", undefined, "media-list");
    items.forEach((m) => list.append(row(m)));
    group.append(list);
  } else group.append(element("p", emptyText, "empty"));
  $("grid").append(group);
}
function render() {
  const query = norm($("query").value.trim());
  const filtering = ["query", "province", "kind", "topic", "live"].some(
    (id) => $(id).value,
  );
  const sorted = [...media].sort(
    (a, b) =>
      a.province.localeCompare(b.province, "es") ||
      a.name.localeCompare(b.name, "es"),
  );
  const list = sorted.filter(
    (m) =>
      (!query || matchesMedia(m,query)) &&
      (!$("province").value || m.province === $("province").value) &&
      (!$("kind").value || m.kind === $("kind").value) &&
      (!$("topic").value || m.topics.includes($("topic").value)) &&
      (!$("live").value ||
        ($("live").value === "live"
          ? !!currentLiveStream(m)
          : !currentLiveStream(m))) &&
      (!onlyFavorites || favorites.has(m.id)),
  );
  $("grid").replaceChildren();
  $("home").setAttribute("aria-pressed", String(!onlyFavorites));
  $("favorites").setAttribute("aria-pressed", String(onlyFavorites));
  if (onlyFavorites || filtering) {
    $("results").textContent =
      (onlyFavorites ? "Tus favoritos" : "Resultados") + " · " + list.length;
    section(
      onlyFavorites ? "Tus medios guardados" : "Medios encontrados",
      list,
      $("live").value === "live"
        ? "Todavía no hay señales con estado en vivo comprobado."
        : "No hay medios en esta selección. Guardá favoritos con el corazón o probá otros filtros.",
    );
    return;
  }
  $("results").textContent = "Tu selección";
  const recentMedia = recent
    .map((id) => media.find((m) => m.id === id))
    .filter(Boolean);
  if (recentMedia.length) section("Últimos abiertos", recentMedia.slice(0, 5));
  const saved = sorted.filter((m) => favorites.has(m.id));
  if (saved.length) section("Tus favoritos", saved);
  section(
    "Para probar",
    sorted.filter((m) => m.pilot),
  );
  section("Explorá el país", sorted);
}
let activeVideo = null,
  returnFocus = null;
function openPlayer(m, trigger) {
  const stream = currentLiveStream(m);
  if (!stream) return;
  const id = youtubeVideoId(stream.url);
  returnFocus = m.id;
  $("player-heading").textContent = m.name;
  $("player-video-title").textContent =
    stream.title || "Video del canal oficial";
  $("player-external").href = "https://www.youtube.com/watch?v=" + id;
  $("player-external").setAttribute(
    "aria-label",
    "Abrir " + m.name + " en YouTube (otra pestaña)",
  );
  const channel = safeURL(m.youtubeChannel);
  $("player-channel").hidden = !channel;
  if (channel) $("player-channel").href = channel;
  $("player-panel").hidden = false;
  if (activeVideo !== id) {
    $("player-slot").replaceChildren();
    const iframe = element("iframe");
    iframe.title = "Reproductor de YouTube: " + m.name;
    iframe.src = youtubeEmbedURL(id, location.origin);
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    $("player-slot").append(iframe);
    activeVideo = id;
  }
  recordOpen(m.id);
  $("player-close").focus();
}
$("player-close").onclick = () => {
  $("player-slot").replaceChildren();
  activeVideo = null;
  $("player-panel").hidden = true;
  const buttons = [...document.querySelectorAll(".play-link")];
  const m = media.find((m) => m.id === returnFocus);
  const target = buttons.find(
    (b) => b.getAttribute("aria-label") === "Ver vivo de " + m?.name,
  );
  (target || $("home")).focus();
};
function searchPanel(open) {
  $("search-panel").hidden = !open;
  $("search-toggle").setAttribute("aria-expanded", String(open));
  if (open) $("query").focus();
}
for (const id of ["query", "province", "kind", "topic", "live"])
  $(id).addEventListener(id === "query" ? "input" : "change", render);
$("search-toggle").onclick = () => searchPanel($("search-panel").hidden);
$("favorites").onclick = () => {
  onlyFavorites = true;
  render();
};
function resetFilters() {
  for (const id of ["query", "province", "kind", "topic", "live"])
    $(id).value = "";
}
$("home").onclick = () => {
  onlyFavorites = false;
  resetFilters();
  searchPanel(false);
  render();
};
$("reset").onclick = () => {
  resetFilters();
  render();
};
for (const id of ["add", "add-bottom"])
  $(id).onclick = () => $("proposal").showModal();
$("close").onclick = () => $("proposal").close();
$("form").onsubmit = async (e) => {
  e.preventDefault();
  const item = Object.fromEntries(new FormData(e.target));
  if (!safeURL(item.website)) {
    toast("Ingresá una dirección http o https válida.");
    return;
  }
  if (item.youtubeVideo && !youtubeVideoId(item.youtubeVideo)) {
    toast(
      "Usá un enlace de un video o vivo específico de YouTube, no el enlace del canal.",
    );
    return;
  }
  const submit=e.submitter;submit.disabled=true;
  try{const r=await fetch('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(item)});const result=await r.json();if(!r.ok)throw Error(result.error||'No se pudo enviar');$('saved').textContent=result.duplicate?'Este sitio ya tiene una propuesta registrada.':'Propuesta recibida. Queda pendiente de revisión; todavía no está publicada.';e.target.reset()}
  catch(error){$('saved').textContent=error.message}
  finally{submit.disabled=false}

};
$("export").onclick = () => {
  const drafts = read("sf-proposals", []);
  if (!Array.isArray(drafts) || !drafts.length) {
    $("saved").textContent = "Todavía no hay borradores para exportar.";
    return;
  }
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(drafts, null, 2)], { type: "application/json" }),
  );
  const a = element("a");
  a.href = url;
  a.download = "propuestas-medios.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
let catalogSource = null;
function showCatalogSource(source, stale = false) {
  catalogSource = source;
  const labels = {
    mongo: "Datos de MongoDB",
    local: "Catálogo de respaldo",
    error: "Sin datos",
  };
  $("data-source").textContent =
    labels[source] + (stale ? " · sin actualizar" : "");
  $("data-source").title =
    source === "mongo"
      ? "Datos recibidos de la API conectada a Atlas."
      : source === "local"
        ? "Datos del archivo local media.json; no se pudo consultar la base."
        : "No se pudo cargar ninguna fuente.";
}
async function loadCatalog() {
  try {
    const r = await fetch("/api/media", { cache: "no-store" });
    if (!r.ok) throw Error();
    const rows = await r.json();
    if (!Array.isArray(rows)) throw Error();
    showCatalogSource("mongo");
    return rows;
  } catch {
    const r = await fetch("data/media.json");
    if (!r.ok) throw Error();
    const rows = await r.json();
    if (!Array.isArray(rows)) throw Error();
    showCatalogSource("local");
    toast("Catálogo de respaldo: no se pudo consultar la base.");
    return rows.map((m) => ({
      ...m,
      liveStatus: "unknown",
      streams: (m.streams || []).map((s) => ({
        ...s,
        status: "unknown",
        expiresAt: null,
      })),
    }));
  }
}
loadCatalog()
  .then((data) => {
    media = data;
    $("stats").replaceChildren();
    for (const [n, label] of [
      [media.length, "fichas iniciales"],
      [new Set(media.map((m) => m.province)).size, "jurisdicciones"],
    ]) {
      const span = element("span");
      span.append(element("strong", n), document.createTextNode(label));
      $("stats").append(span);
    }
    render();
  })
  .catch(() => {
    showCatalogSource("error");
    $("results").textContent = "No se pudo cargar el catálogo";
    const button = element("button", "Reintentar");
    button.onclick = () => location.reload();
    $("grid").append(
      element(
        "p",
        "Abrí esta versión desde el servidor local indicado en el README.",
      ),
      button,
    );
  });

// Actualizar las etiquetas vencidas sin reconstruir el reproductor.
setInterval(async () => {
  if (!media.length || document.hidden) return;
  try {
    const r = await fetch("/api/media", { cache: "no-store" });
    if (!r.ok) throw Error();
    const rows = await r.json();
    if (!Array.isArray(rows)) throw Error();
    media = rows;
    showCatalogSource("mongo");
  } catch {
    if (catalogSource) showCatalogSource(catalogSource, true);
  }
  render();
}, 60000);
