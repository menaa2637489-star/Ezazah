"use strict";

/* =========================
   SHARED SETTINGS
========================= */

const CART_KEY = "ezazahCart";
const ORDERS_KEY = "ezazahOrders";
const LANGUAGE_KEY = "ezazahLanguage";

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "ar";

const $ = id => document.getElementById(id);

function getCart() {
    try {
        const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
}

function getOrders() {
    try {
        const value = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function money(value) {
    const number = Number(value) || 0;

    return currentLanguage === "ar"
        ? `${number.toLocaleString("ar-EG")} ج.م`
        : `${number.toLocaleString("en-US")} EGP`;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function textFor(item, arKey, enKey, fallback = "") {
    if (currentLanguage === "en") {
        return item[enKey] || item[arKey] || fallback;
    }

    return item[arKey] || item[enKey] || fallback;
}

function productTitle(item) {
    return textFor(item, "name", "nameEn", "منتج");
}

function productWeight(item) {
    return textFor(item, "weight", "weightEn", "");
}

function itemPrice(item) {
    return Number(item.price) || 0;
}

/* =========================
   LANGUAGE
========================= */

const languageBtn = $("languageBtn");

function updateLanguage() {
    document.querySelectorAll("[data-ar][data-en]").forEach(element => {
        element.textContent = currentLanguage === "en"
            ? element.dataset.en
            : element.dataset.ar;
    });

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "en" ? "ltr" : "rtl";

    document.body.classList.toggle("english", currentLanguage === "en");

    if (languageBtn) {
        languageBtn.textContent =
            currentLanguage === "ar" ? "English" : "العربية";
    }

    localStorage.setItem(LANGUAGE_KEY, currentLanguage);

    renderCart();
}

languageBtn?.addEventListener("click", () => {
    currentLanguage = currentLanguage === "ar" ? "en" : "ar";
    updateLanguage();
});

/* =========================
   HERO SLIDER
========================= */

const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".hero-dot")];

const prevBtn = $("heroPrev");
const nextBtn = $("heroNext");

let currentSlide = 0;
let autoSlide = null;

function showSlide(index) {
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

function restartAutoSlide() {
    clearInterval(autoSlide);

    if (slides.length > 1) {
        autoSlide = setInterval(nextSlide, 5000);
    }
}

nextBtn?.addEventListener("click", () => {
    nextSlide();
    restartAutoSlide();
});

prevBtn?.addEventListener("click", () => {
    previousSlide();
    restartAutoSlide();
});

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        restartAutoSlide();
    });
});

showSlide(0);
restartAutoSlide();

/* =========================
   CART DRAWER
========================= */

const cartBtn = $("cartBtn");
const cartPanel = $("cartPanel");
const cartOverlay = $("cartOverlay");
const closeCartBtn = $("closeCart");
const cartItems = $("cartItems");
const cartCount = $("cartCount");
const cartTotal = $("cartTotal");
const clearCartBtn = $("clearCart");

function openCart() {
    cartPanel?.classList.add("active");
    cartPanel?.classList.add("open");
    cartOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";
    renderCart();
}

function closeCartPanel() {
    cartPanel?.classList.remove("active", "open");
    cartOverlay?.classList.remove("active", "show");
    document.body.style.overflow = "";
}

cartBtn?.addEventListener("click", openCart);
closeCartBtn?.addEventListener("click", closeCartPanel);
cartOverlay?.addEventListener("click", closeCartPanel);

/* =========================
   RENDER SHARED CART
========================= */

function renderCart() {
    if (!cartItems) return;

    const cart = getCart();

    let total = 0;
    let count = 0;

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const price = itemPrice(item);
        const lineTotal = price * quantity;

        total += lineTotal;
        count += quantity;

        const name = productTitle(item);
        const weight = productWeight(item);
        const image = item.image || item.img || "";
        const emoji = item.emoji || "🛍️";

        const row = document.createElement("article");
        row.className = "cart-item";

        row.innerHTML = `
            <div class="cart-item-image">
                ${
                    image
                        ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(name)}">`
                        : `<div class="cart-item-emoji">${escapeHTML(emoji)}</div>`
                }
            </div>

            <div class="cart-item-info">
                <h4>${escapeHTML(name)}</h4>

                <p>
                    ${weight ? `${escapeHTML(weight)} · ` : ""}
                    ${money(price)}
                </p>

                <div class="cart-item-actions">
                    <button type="button" data-action="minus"
                            aria-label="Decrease quantity">−</button>

                    <span class="cart-quantity">${quantity}</span>

                    <button type="button" data-action="plus"
                            aria-label="Increase quantity">+</button>

                    <button type="button" class="remove-item"
                            data-action="remove">
                        ${currentLanguage === "ar" ? "حذف" : "Remove"}
                    </button>
                </div>
            </div>

            <strong class="cart-line-total">${money(lineTotal)}</strong>
        `;

        row.querySelector('[data-action="minus"]').addEventListener("click", () => {
            changeQuantity(index, -1);
        });

        row.querySelector('[data-action="plus"]').addEventListener("click", () => {
            changeQuantity(index, 1);
        });

        row.querySelector('[data-action="remove"]').addEventListener("click", () => {
            const updated = getCart();
            updated.splice(index, 1);
            saveCart(updated);
        });

        cartItems.appendChild(row);
    });

    if (!cart.length) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛍️</div>
                <p>${currentLanguage === "ar" ? "السلة فاضية" : "Your cart is empty"}</p>
            </div>
        `;
    }

    if (cartCount) cartCount.textContent = String(count);
    if (cartTotal) cartTotal.textContent = money(total);

    const checkoutTotal = $("checkoutTotal");
    if (checkoutTotal) checkoutTotal.textContent = money(total);
}

function changeQuantity(index, amount) {
    const cart = getCart();
    const item = cart[index];

    if (!item) return;

    const nextQuantity = (Number(item.quantity) || 1) + amount;

    if (nextQuantity <= 0) {
        cart.splice(index, 1);
    } else {
        item.quantity = Math.min(99, nextQuantity);
    }

    saveCart(cart);
}

clearCartBtn?.addEventListener("click", () => {
    if (!getCart().length) return;

    const confirmed = window.confirm(
        currentLanguage === "ar"
            ? "متأكدة إنك عايزة تفرّغي السلة؟"
            : "Are you sure you want to clear the cart?"
    );

    if (confirmed) saveCart([]);
});

/* =========================
   CHECKOUT
========================= */

const checkoutBtn = $("checkoutBtn");
const checkoutModal = $("checkoutModal");
const closeCheckoutBtn = $("closeCheckout");
const backFromCheckout = $("backFromCheckout");
const checkoutForm = $("checkoutForm");

function openCheckout() {
    if (!getCart().length) {
        alert(currentLanguage === "ar"
            ? "ضيفي منتجات للسلة الأول."
            : "Add products to your cart first.");
        return;
    }

    closeCartPanel();
    renderCart();

    checkoutModal?.classList.add("active", "show");
    document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
    checkoutModal?.classList.remove("active", "show");
    document.body.style.overflow = "";
}

checkoutBtn?.addEventListener("click", openCheckout);
closeCheckoutBtn?.addEventListener("click", closeCheckoutModal);

backFromCheckout?.addEventListener("click", () => {
    closeCheckoutModal();
    openCart();
});

checkoutModal?.addEventListener("click", event => {
    if (event.target === checkoutModal) closeCheckoutModal();
});

checkoutForm?.addEventListener("submit", event => {
    event.preventDefault();

    const cart = getCart();

    if (!cart.length) {
        closeCheckoutModal();
        return;
    }

    const formData = new FormData(checkoutForm);

    const items = cart.map(item => ({
        id: item.id || "",
        name: item.name || item.title || "منتج",
        nameEn: item.nameEn || item.en || item.name || item.title || "Product",
        weight: item.weight || "",
        weightEn: item.weightEn || item.weight || "",
        price: itemPrice(item),
        quantity: Math.max(1, Number(item.quantity) || 1)
    }));

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const orders = getOrders();

    orders.push({
        number: Date.now().toString().slice(-7),
        createdAt: new Date().toISOString(),
        customer: {
            name: String(formData.get("customerName") || "").trim(),
            phone: String(formData.get("customerPhone") || "").trim(),
            address: String(formData.get("customerAddress") || "").trim()
        },
        paymentMethod: String(formData.get("paymentMethod") || "cash"),
        items,
        total
    });

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    saveCart([]);

    checkoutForm.reset();
    closeCheckoutModal();

    alert(currentLanguage === "ar"
        ? "تم حفظ طلبك على الجهاز بنجاح."
        : "Your order has been saved on this device.");

});

/* =========================
   ABOUT POPUP
========================= */

const aboutToggle = $("aboutToggle");
const aboutTooltip = $("aboutTooltip");

aboutToggle?.addEventListener("click", () => {
    const isOpen = aboutTooltip?.classList.toggle("show");
    aboutToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

document.addEventListener("click", event => {
    if (
        aboutTooltip &&
        aboutToggle &&
        !aboutTooltip.contains(event.target) &&
        !aboutToggle.contains(event.target)
    ) {
        aboutTooltip.classList.remove("show");
        aboutToggle.setAttribute("aria-expanded", "false");
    }
});

/* =========================
   DASHBOARD
========================= */

$("dashboardBtn")?.addEventListener("click", () => {
    alert(
        currentLanguage === "ar"
            ? "لوحة التحكم هتتضاف قريبًا."
            : "The dashboard will be added soon."
    );
});

/* =========================
   CROSS-PAGE SYNC
========================= */

window.addEventListener("storage", event => {
    if (event.key === CART_KEY) renderCart();

    if (event.key === LANGUAGE_KEY) {
        currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "ar";
        updateLanguage();
    }
});

/* =========================
   ESC KEY
========================= */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCartPanel();
        closeCheckoutModal();
    }
});

/* =========================
   INITIALIZE
========================= */

updateLanguage();
renderCart();