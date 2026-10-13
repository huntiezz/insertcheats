const PRODUCTS = [
  {
    id: "fn",
    name: "Fortnite Private",
    cat: "Fortnite",
    price: "€10.99",
    image: "/assets/img/fortnite.png",
  },
  {
    id: "hwid-spoofer",
    name: "HWID Spoofer",
    cat: "Spoofer",
    price: "€6.00",
    image: "/assets/img/hwid-spoofer.png",
  },
  {
    id: "valorant",
    name: "Valorant",
    cat: "Valorant",
    price: "€9.99",
    image: "/assets/img/valorant.png",
  },
  {
    id: "bo7",
    name: "Black Ops 7",
    cat: "Black Ops 7",
    price: "€6.99",
    image: "/assets/img/call-of-duty.png",
  },
  {
    id: "eac-emulator",
    name: "EAC Emulator",
    cat: "EAC Emulator",
    price: "€14.99",
    image: "/assets/img/eac-emulator.png",
  },
];

const CAT_IDS = {
  "02992494-2501-4838-9126-5312c53f49e6": "Fortnite",
  "a848f2a0-5252-4a52-910c-bd0b5b6a1654": "Spoofer",
  "5766ae29-f9bc-457e-bcb6-647b52dba2e1": "Valorant",
  "89363b01-735c-4bc4-8241-310bf21c9694": "Black Ops 7",
  "eac-emulator": "EAC Emulator",
};

const header = document.getElementById("header");
let navCompact = false;
function onScroll() {
  if (!header) return;
  const y = window.scrollY;
  if (!navCompact && y > 56) navCompact = true;
  else if (navCompact && y < 20) navCompact = false;
  header.classList.toggle("at-top", !navCompact);
  header.classList.toggle("is-scrolled", navCompact);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

function revealAosElement(el) {
  el.classList.add("aos-animate");
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

document.querySelectorAll("[data-aos]").forEach((el) => {
  if (isElementInViewport(el)) {
    revealAosElement(el);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAosElement(el);
          io.disconnect();
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px 8% 0px" },
  );
  io.observe(el);
});

requestAnimationFrame(() => {
  document.querySelectorAll("[data-aos]:not(.aos-animate)").forEach((el) => {
    if (isElementInViewport(el)) revealAosElement(el);
  });
});

function cart() {
  try {
    return JSON.parse(localStorage.getItem("sulphated-cart") || "[]");
  } catch {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem("sulphated-cart", JSON.stringify(items));
  renderCart();
}
function money(items) {
  const n = items.reduce(
    (sum, item) => sum + Number(item.price.replace("€", "")),
    0,
  );
  return "€" + n.toFixed(2);
}

const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("cart-overlay");
function openCart() {
  renderCart();
  drawer.hidden = false;
  overlay.hidden = false;
}
function closeCart() {
  drawer.hidden = true;
  overlay.hidden = true;
}
function renderCart() {
  const items = cart();
  const count = document.getElementById("cart-count");
  const body = document.getElementById("cart-body");
  const foot = document.getElementById("cart-foot");
  if (count)
    count.textContent = `(${items.length} Item${items.length === 1 ? "" : "s"})`;
  if (!body) return;
  if (!items.length) {
    body.innerHTML = `<div class="flex flex-col items-center justify-center py-12 text-center h-full"><div class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8 text-gray-400"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg></div><h3 class="text-theme-primary text-xl font-semibold mb-2">Your cart is empty</h3><p class="text-theme-secondary text-base mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p><button type="button" data-close-cart class="inline-flex items-center justify-center py-2 bg-transparent border border-gray-300 dark:border-white/20 text-white hover:bg-white/10 h-10 px-6 text-sm rounded-md font-medium">Continue Shopping</button></div>`;
    foot.hidden = true;
    return;
  }
  body.innerHTML = items
    .map(
      (item, i) =>
        `<div class="cart-line"><img alt="" src="${item.image}"><div style="flex:1"><div class="text-white text-sm font-medium">${item.name}</div><div class="text-theme-secondary text-xs">${item.variant}</div></div><div class="text-white text-sm">${item.price}</div><button class="remove" type="button" data-remove="${i}" aria-label="Remove">×</button></div>`,
    )
    .join("");
  foot.hidden = false;
  document.getElementById("cart-total").textContent = money(items);
}

document.addEventListener("click", (event) => {
  const t = event.target.closest("button, a");
  if (!t) return;
  if (
    t.matches("[data-open-cart]") ||
    t.querySelector?.(".lucide-shopping-cart")
  ) {
    event.preventDefault();
    openCart();
  }
  if (t.matches("[data-close-cart]") || t === overlay) closeCart();
  if (t.dataset.remove != null) {
    const items = cart();
    items.splice(Number(t.dataset.remove), 1);
    saveCart(items);
  }
  if (t.querySelector?.(".lucide-search") && t.tagName === "BUTTON") {
    const wrap = t.parentElement;
    wrap.querySelector(".search-pop")?.classList.toggle("is-open");
    wrap.querySelector("input")?.focus();
  }
  if (t.querySelector?.(".lucide-menu")) {
    const menu = document.getElementById("mobile-menu");
    const btn = t.closest("button");
    const open = !menu?.classList.contains("is-open");
    menu?.classList.toggle("is-open", open);
    btn?.classList.toggle("is-menu-open", open);
    if (!open) btn?.blur();
  }
  if (t.classList.contains("ux-faq-question")) {
    const item = t.closest(".ux-faq-item");
    const willOpen = !item.classList.contains("is-open");
    document.querySelectorAll(".ux-faq-item").forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-open");
        other
          .querySelector(".ux-faq-question")
          ?.setAttribute("aria-expanded", "false");
      }
    });
    item.classList.toggle("is-open", willOpen);
    t.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }
  if (
    t.classList.contains("dp-pp-variant") &&
    !t.disabled &&
    !t.classList.contains("is-disabled")
  ) {
    t.parentElement
      .querySelectorAll(".dp-pp-variant")
      .forEach((b) => b.classList.remove("is-selected"));
    t.classList.add("is-selected");
  }
  if (t.classList.contains("dp-pp-buy") || t.classList.contains("dp-pp-cart")) {
    const view = t.closest(".product-view");
    const selected =
      view.querySelector(".dp-pp-variant.is-selected") ||
      view.querySelector(".dp-pp-variant:not(.is-disabled)");
    const product = PRODUCTS.find((p) => p.id === view.dataset.product);
    if (!product || !selected) return;
    const items = cart();
    items.push({
      id: product.id,
      name: product.name,
      variant: selected.querySelector(".dp-pp-variant-name").textContent.trim(),
      price: selected.querySelector(".dp-pp-variant-price").textContent.trim(),
      image: product.image,
    });
    saveCart(items);
    openCart();
  }
  if (t.classList.contains("ins-allprod-tab")) {
    document
      .querySelectorAll(".ins-allprod-tab")
      .forEach((tab) => tab.classList.toggle("is-active", tab === t));
    applyCategory(t.dataset.cat || t.textContent.trim());
    const url = new URL(location.href);
    const entry = Object.entries(CAT_IDS).find(
      ([, name]) => name === t.textContent.trim(),
    );
    if (entry) url.searchParams.set("id", entry[0]);
    else url.searchParams.delete("id");
    history.replaceState(null, "", url.pathname + url.search);
  }
});

overlay?.addEventListener("click", closeCart);

function closeMobileMenu() {
  document.getElementById("mobile-menu")?.classList.remove("is-open");
  document
    .querySelector("#header button.is-menu-open")
    ?.classList.remove("is-menu-open");
}

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    document
      .querySelectorAll(".search-pop.is-open")
      .forEach((el) => el.classList.remove("is-open"));
    closeMobileMenu();
  }
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const q =
      new FormData(form).get("q") || form.querySelector("input")?.value || "";
    const hit = PRODUCTS.find((p) =>
      p.name.toLowerCase().includes(String(q).trim().toLowerCase()),
    );
    if (hit) location.href = "/product?id=" + hit.id;
  });
});

function applyCategory(name) {
  const cards = [...document.querySelectorAll(".ins-prod-card")];
  if (!cards.length) return;
  let shown = 0;
  cards.forEach((card) => {
    const cat = card.querySelector(".ins-prod-badge")?.textContent.trim();
    const match = !name || name === "All Products" || cat === name;
    card.hidden = !match;
    if (match) shown += 1;
  });
  const empty = document.querySelector(".ins-empty");
  if (empty) empty.hidden = shown !== 0;
}

const productId = new URLSearchParams(location.search).get("id");
const views = document.querySelectorAll(".product-view");
if (views.length) {
  let found = false;
  views.forEach((view) => {
    const on = view.dataset.product === productId;
    view.hidden = !on;
    if (on) {
      found = true;
      document.title = view.dataset.title || document.title;
    }
  });
  if (!found) {
    views[0].hidden = false;
    document.title = views[0].dataset.title || document.title;
  }
}

if (document.querySelector(".ins-allprod-tab")) {
  const name = CAT_IDS[productId] || "All Products";
  document.querySelectorAll(".ins-allprod-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.textContent.trim() === name);
  });
  applyCategory(name);
}

document.querySelectorAll(".ux-faq-item").forEach((item) => {
  const open =
    item.querySelector(".ux-faq-question")?.getAttribute("aria-expanded") ===
    "true";
  item.classList.toggle("is-open", open);
});
const faqList = document.querySelector(".ux-faq-list");
if (faqList) {
  requestAnimationFrame(() => {
    faqList.classList.add("is-interactive");
  });
}

const visitors = document.querySelector(".ux-visitors-text strong");
if (visitors) {
  let n = 42 + Math.floor(Math.random() * 18);
  visitors.textContent = String(n);
  setInterval(() => {
    n = Math.max(28, n + (Math.random() > 0.5 ? 1 : -1));
    visitors.textContent = String(n);
  }, 4000);
}

renderCart();
document
  .querySelectorAll("#navbar-buttons button, .flex.md\\:hidden button")
  .forEach((button) => {
    if (button.querySelector(".lucide-shopping-cart"))
      button.dataset.openCart = "";
  });

const MAGIC_GLOBE_MARKERS = [
  { location: [14.5995, 120.9842], size: 0.03 },
  { location: [19.076, 72.8777], size: 0.1 },
  { location: [23.8103, 90.4125], size: 0.05 },
  { location: [30.0444, 31.2357], size: 0.07 },
  { location: [39.9042, 116.4074], size: 0.08 },
  { location: [-23.5505, -46.6333], size: 0.1 },
  { location: [19.4326, -99.1332], size: 0.1 },
  { location: [40.7128, -74.006], size: 0.1 },
  { location: [34.6937, 135.5022], size: 0.05 },
  { location: [41.0082, 28.9784], size: 0.06 },
];

function showGlobeFallback(container) {
  container.innerHTML =
    '<img alt="Customers around the world" src="/assets/ui/customers-world.png" width="200" height="200" />';
}

async function initCobeGlobe() {
  const canvas = document.getElementById("ux-f-globe-canvas");
  const mount = document.querySelector(".ins-magic-globe-mount");
  const container = canvas?.closest(".ux-f-globe");
  if (!canvas || !mount || !container) return;

  let createGlobe;
  try {
    ({ default: createGlobe } = await import("/js/cobe.bundle.js"));
  } catch {
    showGlobeFallback(container);
    return;
  }

  const isDark = document.documentElement.classList.contains("dark");
  const dpr = 2;
  let phi = 0;
  let dragOffset = 0;
  let pointerX = null;
  let globe = null;

  function layoutSize() {
    const layout = Math.max(1, Math.round(mount.offsetWidth));
    const px = layout * dpr;
    canvas.width = px;
    canvas.height = px;
    canvas.style.width = `${layout}px`;
    canvas.style.height = `${layout}px`;
    return { layout, px };
  }

  function globeConfig(px) {
    return {
      devicePixelRatio: dpr,
      width: px,
      height: px,
      phi: 0,
      theta: 0.3,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 0.82 : 0.55,
      mapSamples: 16000,
      mapBrightness: isDark ? 2.35 : 1.35,
      baseColor: isDark ? [0.62, 0.66, 0.72] : [1, 1, 1],
      markerColor: isDark
        ? [0.92, 0.94, 0.98]
        : [251 / 255, 100 / 255, 21 / 255],
      glowColor: isDark ? [0.52, 0.56, 0.62] : [1, 1, 1],
      markers: MAGIC_GLOBE_MARKERS,
      onRender: (state) => {
        if (pointerX === null) phi += 0.005;
        state.phi = phi + dragOffset;
        state.width = cachedPx;
        state.height = cachedPx;
      },
    };
  }

  let { px: cachedPx } = layoutSize();
  globe = createGlobe(canvas, globeConfig(cachedPx));
  requestAnimationFrame(() => canvas.classList.add("is-ready"));

  function setPointer(x) {
    if (pointerX === null) return;
    const delta = x - pointerX;
    pointerX = x;
    dragOffset += delta / 1400;
  }

  function endPointer() {
    pointerX = null;
    canvas.classList.remove("is-dragging");
  }

  canvas.addEventListener("pointerdown", (event) => {
    pointerX = event.clientX;
    canvas.classList.add("is-dragging");
  });
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointerout", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("mousemove", (event) => setPointer(event.clientX));
  canvas.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches[0]) setPointer(event.touches[0].clientX);
    },
    { passive: true },
  );

  const ro = new ResizeObserver(() => {
    cachedPx = layoutSize().px;
  });
  ro.observe(mount);

  return () => {
    ro.disconnect();
    globe?.destroy?.();
  };
}

initCobeGlobe();

function initMagicShield() {
  const mount = window.mountFlickeringGrid;
  const host = document.querySelector(".ins-shield-flicker");
  if (!mount || !host) return;

  mount(host, {
    squareSize: 2,
    gridGap: 4,
    maxOpacity: 0.5,
  });
}

function initFooterWatermark() {
  const mount = window.mountFlickeringGrid;
  const host = document.getElementById("ux-footer-flicker");
  if (!mount || !host) return;

  const narrow = window.matchMedia("(max-width: 767px)").matches;
  mount(host, {
    text: "Sulphated",
    fontSize: narrow ? 64 : 88,
    fontWeight: 600,
    squareSize: 2,
    gridGap: narrow ? 2 : 3,
    flickerChance: 0.1,
    color: "#9CA3AF",
    maxOpacity: 0.38,
  });
}

initMagicShield();
initFooterWatermark();
