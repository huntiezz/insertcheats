const PRODUCTS = [
  {
    id: "fn",
    name: "Fortnite Private",
    cat: "Fortnite",
    price: "€10.99",
    image: "/assets/img/4c9d1361-65ad-4fe0-a764-57be6b8a2421.png",
  },
  {
    id: "r6-lite",
    name: "R6 Lite",
    cat: "Rainbow Six Seige",
    price: "€9.99",
    image: "/assets/img/8720e6ca-8a57-4778-8058-c3dcd9cb3e89.png",
  },
  {
    id: "r6-pro",
    name: "R6 Pro",
    cat: "Rainbow Six Seige",
    price: "€6.00",
    image: "/assets/img/0065a681-89a2-4360-8e33-eb5293eb0f16.png",
  },
  {
    id: "arc-raiders-public",
    name: "Arc Raiders Public",
    cat: "Arc Raiders",
    price: "€5.00",
    image: "/assets/img/f95b2b38-c65c-414c-9bf5-27fbbedf684b.png",
  },
  {
    id: "rust-private",
    name: "Rust Private",
    cat: "Rust",
    price: "€6.99",
    image: "/assets/img/0e6ce96a-b687-4267-b642-36cef1f46e9d.png",
  },
  {
    id: "sulphated-temp",
    name: "Sulphated Temp",
    cat: "Spoofer",
    price: "€6.00",
    image: "/assets/img/2a7c3f97-bb55-4cb3-b3e6-ab56aef9cd22.png",
  },
  {
    id: "sulphated-perm",
    name: "Sulphated Perm",
    cat: "Spoofer",
    price: "€25.00",
    image: "/assets/img/2a7c3f97-bb55-4cb3-b3e6-ab56aef9cd22.png",
  },
];

const CAT_IDS = {
  "02992494-2501-4838-9126-5312c53f49e6": "Fortnite",
  "a848f2a0-5252-4a52-910c-bd0b5b6a1654": "Spoofer",
  "5766ae29-f9bc-457e-bcb6-647b52dba2e1": "Valorant",
  "d9f4aa93-1eca-44e3-8bc4-21be9d468f83": "Rainbow Six Seige",
  "89363b01-735c-4bc4-8241-310bf21c9694": "Black Ops 7",
  "72aa29e6-6c59-4a9f-86ac-bd4d514baab9": "Arc Raiders",
  "35b4d23e-f40e-411f-bd64-0f9899b833c0": "Rust",
  "0ec094b7-b4be-4816-a6f6-45f4c28b37ed": "Apex Legends",
};

const header = document.getElementById("header");
function onScroll() {
  if (!header) return;
  const scrolled = window.scrollY > 24;
  header.classList.toggle("at-top", !scrolled);
  header.classList.toggle("is-scrolled", scrolled);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

document.querySelectorAll("[data-aos]").forEach((el) => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add("aos-animate");
          io.disconnect();
        }
      });
    },
    { threshold: 0.15 },
  );
  io.observe(el);
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
  const n = items.reduce((sum, item) => sum + Number(item.price.replace("€", "")), 0);
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
  if (count) count.textContent = `(${items.length} Item${items.length === 1 ? "" : "s"})`;
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
  if (t.matches("[data-open-cart]") || t.querySelector?.(".lucide-shopping-cart")) {
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
    document.getElementById("mobile-menu")?.classList.toggle("is-open");
  }
  if (t.classList.contains("ux-faq-question")) {
    const item = t.closest(".ux-faq-item");
    const panel = item.querySelector(".ux-faq-collapse");
    const open = item.classList.toggle("is-open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
    panel.style.height = open ? panel.scrollHeight + "px" : "0px";
    document.querySelectorAll(".ux-faq-item").forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-open");
        other.querySelector(".ux-faq-question")?.setAttribute("aria-expanded", "false");
        const p = other.querySelector(".ux-faq-collapse");
        if (p) p.style.height = "0px";
      }
    });
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
    const entry = Object.entries(CAT_IDS).find(([, name]) => name === t.textContent.trim());
    if (entry) url.searchParams.set("id", entry[0]);
    else url.searchParams.delete("id");
    history.replaceState(null, "", url.pathname + url.search);
  }
});

overlay?.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    document
      .querySelectorAll(".search-pop.is-open")
      .forEach((el) => el.classList.remove("is-open"));
    document.getElementById("mobile-menu")?.classList.remove("is-open");
  }
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = new FormData(form).get("q") || form.querySelector("input")?.value || "";
    const hit = PRODUCTS.find((p) => p.name.toLowerCase().includes(String(q).trim().toLowerCase()));
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
  const panel = item.querySelector(".ux-faq-collapse");
  const open = item.querySelector(".ux-faq-question")?.getAttribute("aria-expanded") === "true";
  item.classList.toggle("is-open", open);
  if (panel) panel.style.height = open ? "auto" : "0px";
});

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
document.querySelectorAll("#navbar-buttons button, .flex.md\\:hidden button").forEach((button) => {
  if (button.querySelector(".lucide-shopping-cart")) button.dataset.openCart = "";
});
