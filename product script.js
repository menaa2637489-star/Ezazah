'use strict';

const CART_KEY = 'ezazahCart';
const ORDERS_KEY = 'ezazahOrders';
const LANGUAGE_KEY = 'ezazahLanguage';


const WHATSAPP_NUMBER = '0201277371995';

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'ar';
let currentCategory = 'all';
let selectedProduct = null;
let selectedQuantity = 1;
let activeSlide = 0;
let slideTimer = null;
let toastTimer = null;

const categoryNames = {
    all: {
        ar: 'الكل',
        en: 'All'
    },
    grains: {
        ar: 'أرز وحبوب',
        en: 'Rice & grains'
    },
    legumes: {
        ar: 'بقوليات',
        en: 'Legumes'
    },
    pasta: {
        ar: 'مكرونة ومنتجاتها',
        en: 'Pasta & noodles'
    },
    baking: {
        ar: 'مستلزمات المطبخ',
        en: 'Kitchen essentials'
    }
};

// الأسعار افتراضية للتجربة فقط.
const productRows = [
    { name: 'أرز', en: 'Rice', weight: '1 كيلو', weightEn: '1 kg', price: 35, category: 'grains', emoji: '🍚', size: '9.6', ink: 'أسود', cap: 'أسود' },
    { name: 'أرز بسمتي', en: 'Basmati rice', weight: 'نصف كيلو', weightEn: '500 g', price: 45, category: 'grains', emoji: '🍚', size: '6.6', ink: 'أسود', cap: 'أسود' },
    { name: 'برغل', en: 'Bulgur', weight: 'نصف كيلو', weightEn: '500 g', price: 25, category: 'grains', emoji: '🌾', size: '7.3', ink: 'أبيض', cap: 'أبيض' },
    { name: 'برغل', en: 'Bulgur', weight: '1 كيلو', weightEn: '1 kg', price: 40, category: 'grains', emoji: '🌾', size: '11.8', ink: 'أبيض', cap: 'أبيض' },
    { name: 'بقسماط', en: 'Breadcrumbs', weight: '400 جرام', weightEn: '400 g', price: 22, category: 'baking', emoji: '🥖', size: '7.3', ink: 'أحمر', cap: 'أحمر' },
    { name: 'ترمس', en: 'Lupini beans', weight: 'نصف كيلو', weightEn: '500 g', price: 28, category: 'legumes', emoji: '🫘', size: '7.3', ink: 'كحلي', cap: 'كحلي' },
    { name: 'ترمس', en: 'Lupini beans', weight: '1 كيلو', weightEn: '1 kg', price: 50, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'كحلي', cap: 'كحلي' },
    { name: 'حمص', en: 'Chickpeas', weight: 'نصف كيلو', weightEn: '500 g', price: 32, category: 'legumes', emoji: '🫘', size: '7.3', ink: 'كحلي', cap: 'كحلي' },
    { name: 'حمص', en: 'Chickpeas', weight: '1 كيلو', weightEn: '1 kg', price: 58, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'كحلي', cap: 'كحلي' },
    { name: 'دقيق', en: 'Flour', weight: 'نصف كيلو', weightEn: '500 g', price: 18, category: 'baking', emoji: '🌾', size: '7.3', ink: 'ذهبي', cap: 'ذهبي' },
    { name: 'دقيق', en: 'Flour', weight: '1 كيلو', weightEn: '1 kg', price: 32, category: 'baking', emoji: '🌾', size: '11.8', ink: 'ذهبي', cap: 'ذهبي' },
    { name: 'ذرة فشار', en: 'Popcorn kernels', weight: 'نصف كيلو', weightEn: '500 g', price: 24, category: 'grains', emoji: '🍿', size: '6.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'ذرة فشار', en: 'Popcorn kernels', weight: '1 كيلو', weightEn: '1 kg', price: 42, category: 'grains', emoji: '🍿', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'سكر', en: 'Sugar', weight: 'نصف كيلو', weightEn: '500 g', price: 18, category: 'baking', emoji: '🧂', size: '6.6', ink: 'طوبي (بني محمر)', cap: '' },
    { name: 'سكر', en: 'Sugar', weight: '1 كيلو', weightEn: '1 kg', price: 32, category: 'baking', emoji: '🧂', size: '9.6', ink: 'طوبي (بني محمر)', cap: '' },
    { name: 'شعرية', en: 'Vermicelli', weight: 'نصف كيلو', weightEn: '500 g', price: 20, category: 'pasta', emoji: '🍝', size: '7.3', ink: 'أبيض', cap: 'أبيض' },
    { name: 'شعرية', en: 'Vermicelli', weight: '1 كيلو', weightEn: '1 kg', price: 36, category: 'pasta', emoji: '🍝', size: '11.8', ink: 'أبيض', cap: 'أبيض' },
    { name: 'عدس أصفر', en: 'Yellow lentils', weight: 'نصف كيلو', weightEn: '500 g', price: 30, category: 'legumes', emoji: '🫘', size: '6.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'عدس أصفر', en: 'Yellow lentils', weight: '1 كيلو', weightEn: '1 kg', price: 55, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'عدس بجبة', en: 'Brown lentils', weight: 'نصف كيلو', weightEn: '500 g', price: 28, category: 'legumes', emoji: '🫘', size: '6.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'عدس بجبة', en: 'Brown lentils', weight: '1 كيلو', weightEn: '1 kg', price: 50, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'فاصوليا بيضاء', en: 'White beans', weight: 'نصف كيلو', weightEn: '500 g', price: 32, category: 'legumes', emoji: '🫘', size: '7.3', ink: 'كحلي', cap: 'كحلي' },
    { name: 'فاصوليا بيضاء', en: 'White beans', weight: '1 كيلو', weightEn: '1 kg', price: 58, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'كحلي', cap: 'كحلي' },
    { name: 'فريك', en: 'Freekeh', weight: 'نصف كيلو', weightEn: '500 g', price: 30, category: 'grains', emoji: '🌾', size: '7.3', ink: 'أبيض', cap: 'أبيض' },
    { name: 'فريك', en: 'Freekeh', weight: '1 كيلو', weightEn: '1 kg', price: 52, category: 'grains', emoji: '🌾', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'فول مدشوش', en: 'Split fava beans', weight: 'نصف كيلو', weightEn: '500 g', price: 25, category: 'legumes', emoji: '🫘', size: '7.3', ink: 'أبيض', cap: 'أبيض' },
    { name: 'فول مدشوش', en: 'Split fava beans', weight: '1 كيلو', weightEn: '1 kg', price: 44, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'فول مدمس', en: 'Fava beans', weight: 'نصف كيلو', weightEn: '500 g', price: 22, category: 'legumes', emoji: '🫘', size: '6.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'فول مدمس', en: 'Fava beans', weight: '1 كيلو', weightEn: '1 kg', price: 40, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'قمح مقشور (بليلة)', en: 'Peeled wheat', weight: 'نصف كيلو', weightEn: '500 g', price: 22, category: 'grains', emoji: '🌾', size: '6.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'قمح مقشور (بليلة)', en: 'Peeled wheat', weight: '1 كيلو', weightEn: '1 kg', price: 40, category: 'grains', emoji: '🌾', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'لسان عصفور', en: 'Orzo pasta', weight: 'نصف كيلو', weightEn: '500 g', price: 22, category: 'pasta', emoji: '🍝', size: '6.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'لسان عصفور', en: 'Orzo pasta', weight: '1 كيلو', weightEn: '1 kg', price: 38, category: 'pasta', emoji: '🍝', size: '9.6', ink: 'أبيض', cap: 'أبيض' },
    { name: 'لوبيا', en: 'Black-eyed peas', weight: 'نصف كيلو', weightEn: '500 g', price: 25, category: 'legumes', emoji: '🫘', size: '6.6', ink: 'كحلي', cap: 'كحلي' },
    { name: 'لوبيا', en: 'Black-eyed peas', weight: '1 كيلو', weightEn: '1 kg', price: 45, category: 'legumes', emoji: '🫘', size: '9.6', ink: 'كحلي', cap: 'كحلي' },
    { name: 'مكرونة', en: 'Pasta', weight: 'نصف كيلو', weightEn: '500 g', price: 20, category: 'pasta', emoji: '🍝', size: '7.3', ink: 'أبيض', cap: 'أبيض' },
    { name: 'مكرونة', en: 'Pasta', weight: '1 كيلو', weightEn: '1 kg', price: 36, category: 'pasta', emoji: '🍝', size: '11.8', ink: 'أبيض', cap: 'أبيض' },
    { name: 'ملح', en: 'Salt', weight: '700 جرام', weightEn: '700 g', price: 15, category: 'baking', emoji: '🧂', size: '6.6', ink: 'أزرق', cap: 'أزرق' },
    { name: 'نشا', en: 'Starch', weight: 'الوزن غير محدد', weightEn: 'Weight not set', price: 18, category: 'baking', emoji: '🥣', size: 'غير محدد', ink: 'ذهبي', cap: '' }
];

const products = productRows.map((product, index) => ({
    ...product,
    id: `${slugify(product.name)}-${slugify(product.weight)}-${index}`,
    descriptionAr: `${product.name} بوزن ${product.weight}. سعر تجريبي قابل للتعديل.`,
    descriptionEn: `${product.en}, ${product.weightEn}. Sample price that can be changed.`,
    image: ''
}));

const $ = id => document.getElementById(id);

const formatMoney = value =>
    `${Number(value || 0).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')} ${currentLanguage === 'ar' ? 'ج.م' : 'EGP'}`;

const getCart = () => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveCart = cart => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    updateCartCount();
};

const getOrders = () => {
    try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    } catch {
        return [];
    }
};

function slugify(value) {
    return String(value)
        .toLowerCase()
        .replace(/[\s()]+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '')
        .replace(/-+/g, '-');
}

function productName(product) {
    return currentLanguage === 'ar' ? product.name : product.en;
}

function productWeight(product) {
    return currentLanguage === 'ar' ? product.weight : product.weightEn;
}

function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

function renderCategories() {
    const root = $('categoryFilters');
    root.innerHTML = '';

    Object.entries(categoryNames).forEach(([key, labels]) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = `category-btn ${currentCategory === key ? 'active' : ''}`;
        button.textContent = labels[currentLanguage];

        button.addEventListener('click', () => {
            currentCategory = key;
            renderCategories();
            renderProducts();
        });

        root.appendChild(button);
    });
}

function renderProducts() {
    const root = $('productsGrid');
    const query = $('searchInput').value.trim().toLocaleLowerCase();

    const filtered = products.filter(product => {
        const categoryMatch =
            currentCategory === 'all' || product.category === currentCategory;

        const text =
            `${product.name} ${product.en} ${product.weight} ${product.weightEn}`
                .toLocaleLowerCase();

        return categoryMatch && text.includes(query);
    });

    root.innerHTML = '';

    filtered.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-visual">
                <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
            </div>

            <div class="product-info">
                <span class="product-category">
                    ${categoryNames[product.category][currentLanguage]}
                </span>

                <h3>${productName(product)}</h3>

                <p>
                    ${productWeight(product)}
                    ·
                    ${currentLanguage === 'ar' ? 'عبوة إزازة' : 'Ezazah package'}
                </p>

                <div class="product-card-bottom">
                    <span class="product-price">
                        ${formatMoney(product.price)}
                        <small>${currentLanguage === 'ar' ? 'تجريبي' : 'sample'}</small>
                    </span>

                    <button
                        class="small-btn"
                        type="button"
                        data-product-id="${product.id}"
                    >
                        ${currentLanguage === 'ar' ? 'التفاصيل +' : 'Details +'}
                    </button>
                </div>
            </div>
        `;

        card.querySelector('button').addEventListener('click', () => {
            openProduct(product.id);
        });

        root.appendChild(card);
    });

    $('resultsCount').textContent =
        currentLanguage === 'ar'
            ? `${filtered.length} اختيار`
            : `${filtered.length} options`;

    $('emptyState').hidden = filtered.length !== 0;
}

function openProduct(id) {
    selectedProduct = products.find(product => product.id === id);

    if (!selectedProduct) return;

    selectedQuantity = 1;

    const image = $('modalProductImage');
    image.alt = productName(selectedProduct);
    image.style.display = 'block';
    image.src =
        `https://dummyimage.com/600x600/eee9df/555&text=${encodeURIComponent(productName(selectedProduct))}`;

    $('modalProductCategory').textContent =
        categoryNames[selectedProduct.category][currentLanguage];

    $('modalProductName').textContent = productName(selectedProduct);

    $('modalProductDescription').textContent =
        currentLanguage === 'ar'
            ? selectedProduct.descriptionAr
            : selectedProduct.descriptionEn;

    $('modalWeight').innerHTML =
        `<option value="${selectedProduct.id}">${productWeight(selectedProduct)}</option>`;

    $('modalPrice').textContent = formatMoney(selectedProduct.price);
    $('modalQuantity').textContent = selectedQuantity;

    openModal('productModal');
}

function updateModalQuantity() {
    $('modalQuantity').textContent = selectedQuantity;

    if (selectedProduct) {
        $('modalPrice').textContent =
            formatMoney(selectedProduct.price * selectedQuantity);
    }
}

function addToCart(productId, quantity = 1) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity
        });
    }

    saveCart(cart);

    showToast(
        currentLanguage === 'ar'
            ? 'اتضاف المنتج للسلة ❤️'
            : 'Added to cart ❤️'
    );
}

function updateCartCount() {
    const total = getCart().reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    $('cartCount').textContent = total;
}

function renderCart() {
    const root = $('cartItems');
    const cart = getCart();

    root.innerHTML = '';

    if (!cart.length) {
        root.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:42px;margin-bottom:10px">🛍️</div>
                <p>${currentLanguage === 'ar' ? 'السلة لسه فاضية' : 'Your cart is empty'}</p>
            </div>
        `;

        $('cartTotal').textContent = formatMoney(0);
        $('checkoutTotal').textContent = formatMoney(0);
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const row = document.createElement('div');
        row.className = 'cart-item';

        row.innerHTML = `
            <div
                class="cart-thumb"
                style="display:grid;place-items:center;font-size:30px"
            >
                ${product.emoji}
            </div>

            <div>
                <h4>${productName(product)}</h4>

                <p>
                    ${productWeight(product)}
                    ·
                    ${formatMoney(product.price)}
                </p>

                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button type="button" data-action="minus" aria-label="minus">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-action="plus" aria-label="plus">+</button>
                    </div>

                    <button class="remove-item" type="button" data-action="remove">
                        ${currentLanguage === 'ar' ? 'حذف' : 'Remove'}
                    </button>
                </div>
            </div>

            <strong>${formatMoney(product.price * item.quantity)}</strong>
        `;

        row.querySelector('[data-action="minus"]').addEventListener('click', () => {
            changeCartQuantity(item.id, -1);
        });

        row.querySelector('[data-action="plus"]').addEventListener('click', () => {
            changeCartQuantity(item.id, 1);
        });

        row.querySelector('[data-action="remove"]').addEventListener('click', () => {
            saveCart(getCart().filter(cartItem => cartItem.id !== item.id));
        });

        root.appendChild(row);
    });

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);

        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    $('cartTotal').textContent = formatMoney(total);
    $('checkoutTotal').textContent = formatMoney(total);
}

function changeCartQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find(cartItem => cartItem.id === id);

    if (!item) return;

    item.quantity += delta;

    saveCart(cart.filter(cartItem => cartItem.quantity > 0));
}

function renderOrders() {
    const root = $('ordersList');
    const orders = getOrders();

    root.innerHTML = '';

    if (!orders.length) {
        root.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:42px;margin-bottom:10px">🧾</div>
                <p>${currentLanguage === 'ar' ? 'لسه مفيش طلبات محفوظة' : 'No saved orders yet'}</p>
            </div>
        `;

        return;
    }

    orders.slice().reverse().forEach(order => {
        const card = document.createElement('article');
        card.className = 'order-card';

        const lines = order.items.map(item => `
            <li>
                ${currentLanguage === 'ar' ? item.name : item.nameEn}
                × ${item.quantity}
                — ${formatMoney(item.price * item.quantity)}
            </li>
        `).join('');

        card.innerHTML = `
            <h3>${currentLanguage === 'ar' ? 'طلب رقم' : 'Order #'} ${order.number}</h3>
            <p>${new Date(order.createdAt).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</p>
            <p>${escapeHtml(order.customer.name)} · ${escapeHtml(order.customer.phone)}</p>
            <ul>${lines}</ul>
            <strong>
                ${currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}:
                ${formatMoney(order.total)}
            </strong>
        `;

        root.appendChild(card);
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function openDrawer(id) {
    closeAllOverlays();

    $(id).classList.add('active');
    $('pageOverlay').classList.add('active');
    document.body.classList.add('locked');
}

function openModal(id) {
    closeAllOverlays();

    $(id).classList.add('active');
    document.body.classList.add('locked');
}

function closeAllOverlays() {
    $$('.side-drawer, .modal').forEach(element => {
        element.classList.remove('active');
    });

    $('pageOverlay').classList.remove('active');
    document.body.classList.remove('locked');
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function setLanguage(lang) {
    currentLanguage = lang;

    localStorage.setItem(LANGUAGE_KEY, lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    $$('[data-ar][data-en]').forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            return;
        }

        element.textContent = element.dataset[lang];
    });

    $('languageToggle').innerHTML =
        `<i class="fas fa-globe"></i> ${lang === 'ar' ? 'English' : 'العربية'}`;

    $('searchInput').placeholder =
        lang === 'ar' ? 'ابحثي عن منتج...' : 'Search for a product...';

    renderCategories();
    renderProducts();
    renderCart();
    renderOrders();

    if (selectedProduct) {
        $('modalProductCategory').textContent =
            categoryNames[selectedProduct.category][lang];

        $('modalProductName').textContent = productName(selectedProduct);

        $('modalProductDescription').textContent =
            lang === 'ar'
                ? selectedProduct.descriptionAr
                : selectedProduct.descriptionEn;

        $('modalWeight').options[0].textContent =
            productWeight(selectedProduct);

        updateModalQuantity();
    }
}

function nextSlide() {
    const slides = $$('.hero-slide');
    const dots = $$('#sliderDots button');

    if (!slides.length) return;

    slides[activeSlide].classList.remove('active');
    dots[activeSlide]?.classList.remove('active');

    activeSlide = (activeSlide + 1) % slides.length;

    slides[activeSlide].classList.add('active');
    dots[activeSlide]?.classList.add('active');
}

function previousSlide() {
    const slides = $$('.hero-slide');
    const dots = $$('#sliderDots button');

    if (!slides.length) return;

    slides[activeSlide].classList.remove('active');
    dots[activeSlide]?.classList.remove('active');

    activeSlide = (activeSlide - 1 + slides.length) % slides.length;

    slides[activeSlide].classList.add('active');
    dots[activeSlide]?.classList.add('active');
}

function setupSlider() {
    const root = $('sliderDots');

    root.innerHTML = '';

    $$('.hero-slide').forEach((slide, index) => {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.className = index === 0 ? 'active' : '';
        dot.setAttribute('aria-label', `Slide ${index + 1}`);

        dot.addEventListener('click', () => {
            clearInterval(slideTimer);

            while (activeSlide !== index) {
                nextSlide();
            }

            slideTimer = setInterval(nextSlide, 6000);
        });

        root.appendChild(dot);
    });

    slideTimer = setInterval(nextSlide, 6000);
}

// LANGUAGE BUTTON

$('languageToggle').addEventListener('click', () => {
    setLanguage(currentLanguage === 'ar' ? 'en' : 'ar');
});

// SEARCH

$('searchInput').addEventListener('input', renderProducts);

$('clearSearch').addEventListener('click', () => {
    $('searchInput').value = '';
    renderProducts();
    $('searchInput').focus();
});

// CART AND ORDERS

$('cartButton').addEventListener('click', () => {
    renderCart();
    openDrawer('cartDrawer');
});

$('ordersButton').addEventListener('click', () => {
    renderOrders();
    openDrawer('ordersDrawer');
});


$('pageOverlay').addEventListener('click', closeAllOverlays);

$$('[data-close]').forEach(button => {
    button.addEventListener('click', closeAllOverlays);
});

$$('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeAllOverlays();
        }
    });
});

$('clearCart').addEventListener('click', () => {
    saveCart([]);

    showToast(
        currentLanguage === 'ar'
            ? 'السلة اتفضت'
            : 'Cart cleared'
    );
});

$('checkoutButton').addEventListener('click', () => {
    if (!getCart().length) {
        showToast(
            currentLanguage === 'ar'
                ? 'ضيفي منتجات للسلة الأول'
                : 'Add products to your cart first'
        );

        return;
    }

    renderCart();
    openModal('checkoutModal');
});

// PRODUCT QUANTITY

$('modalMinus').addEventListener('click', () => {
    selectedQuantity = Math.max(1, selectedQuantity - 1);
    updateModalQuantity();
});

$('modalPlus').addEventListener('click', () => {
    selectedQuantity = Math.min(99, selectedQuantity + 1);
    updateModalQuantity();
});

$('addToCartButton').addEventListener('click', () => {
    if (selectedProduct) {
        addToCart(selectedProduct.id, selectedQuantity);
    }

    closeAllOverlays();
});

// SLIDER BUTTONS

$('prevSlide').addEventListener('click', () => {
    clearInterval(slideTimer);
    previousSlide();
    slideTimer = setInterval(nextSlide, 6000);
});


$('nextSlide').addEventListener('click', () => {
    clearInterval(slideTimer);
    nextSlide();
    slideTimer = setInterval(nextSlide, 6000);
});

// WHATSAPP

$('whatsappButton').addEventListener('click', () => {
    if (WHATSAPP_NUMBER) {
        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}`,
            '_blank',
            'noopener'
        );
    } else {
        showToast(
            currentLanguage === 'ar'
                ? 'أضيفي رقم واتساب في Product script.js لتفعيل الزر'
                : 'Add the WhatsApp number in Product script.js to activate this button'
        );
    }
});

// CHECKOUT AND SAVE ORDER

$('checkoutForm').addEventListener('submit', event => {
    event.preventDefault();

    const cart = getCart();

    if (!cart.length) {
        closeAllOverlays();
        return;
    }

    const form = new FormData(event.currentTarget);

    const items = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return product
            ? {
                id: product.id,
                name: product.name,
                nameEn: product.en,
                weight: product.weight,
                weightEn: product.weightEn,
                price: product.price,
                quantity: item.quantity
            }
            : null;
    }).filter(Boolean);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const orders = getOrders();

    const order = {
        number: Date.now().toString().slice(-7),
        createdAt: new Date().toISOString(),
        customer: {
            name: String(form.get('customerName')).trim(),
            phone: String(form.get('customerPhone')).trim(),
            address: String(form.get('customerAddress')).trim()
        },
        paymentMethod: form.get('paymentMethod'),
        items,
        total
    };

    orders.push(order);

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    saveCart([]);

    event.currentTarget.reset();

    closeAllOverlays();

    showToast(
        currentLanguage === 'ar'
            ? 'تم حفظ طلبك على الجهاز بنجاح'
            : 'Your order was saved on this device'
    );

    renderOrders();
});

// SYNC CART BETWEEN TABS

window.addEventListener('storage', event => {
    if (event.key === CART_KEY) {
        updateCartCount();
        renderCart();
    }
});

// INITIALIZE PAGE

setupSlider();
setLanguage(currentLanguage);
updateCartCount();
renderCart();