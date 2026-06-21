/* ==========================================================================
   HappyGSR Redesign - Interactive Functionality JavaScript
   ========================================================================== */

// Sample Catalog Data reflecting products on happygsr.com
const productsData = [
    {
        id: "H32",
        title: "Laptop HP H32 Intel Core 4GB/SSD Layar 12″ Chrome OS Playstore",
        category: "laptop-grosir",
        price: 1799045,
        originalPrice: 2158854,
        discount: 17,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300",
        badge: "Paling Laris",
        stock: "available"
    },
    {
        id: "D24",
        title: "Laptop DELL D24 4GB/SSD Layar 12″ Chrome OS Playstore",
        category: "laptop-grosir",
        price: 1799045,
        originalPrice: 2158854,
        discount: 17,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=300",
        badge: "Edisi Terbatas",
        stock: "available"
    },
    {
        id: "D25",
        title: "Laptop DELL Latitude D25 Flip 2in1 TouchScreen Intel 4GB/SSD",
        category: "laptop-grosir",
        price: 1699045,
        originalPrice: 2038854,
        discount: 17,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=300",
        badge: "Paling Laris",
        stock: "available"
    },
    {
        id: "L23",
        title: "Laptop Lenovo ThinkPad L23 Intel Core i5 Gen 7 RAM 8GB SSD 256GB 14″",
        category: "laptop-grosir",
        price: 4249045,
        originalPrice: 6586020,
        discount: 35,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300",
        badge: "Edisi Terbatas",
        stock: "available"
    },
    {
        id: "D20",
        title: "Laptop Dell Latitude D20 Intel Core i5 Gen 6 RAM 8GB SSD 256GB 14″",
        category: "laptop-grosir",
        price: 4049045,
        originalPrice: 6276020,
        discount: 35,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=300",
        badge: "Edisi Terbatas",
        stock: "available"
    },
    {
        id: "DST-A14",
        title: "Laptop DST A14 Intel Celeron N4020 RAM 6GB SSD 128GB 14″ Windows 11",
        category: "laptop-new",
        price: 3949045,
        originalPrice: 3949045,
        discount: 0,
        image: "https://images.unsplash.com/photo-1496181130204-7552cc1574e9?q=80&w=300",
        badge: "Baru",
        stock: "available"
    },
    {
        id: "CCTV-4CH",
        title: "Paket CCTV Hikvision 4 Channel HD 2MP Lengkap Pemasangan",
        category: "cctv",
        price: 2850000,
        originalPrice: 3500000,
        discount: 18,
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=300",
        badge: "Promo",
        stock: "available"
    },
    {
        id: "WEB-SHOP",
        title: "Jasa Pembuatan Website Online Shop Terintegrasi POS & Payment Gateway",
        category: "website",
        price: 4500000,
        originalPrice: 6000000,
        discount: 25,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300",
        badge: "Terlaris",
        stock: "available"
    },
    {
        id: "PROP-APT",
        title: "GSR Property Investment - Apartemen Daan Mogot Jakarta Barat Under Developer",
        category: "property",
        price: 450000000,
        originalPrice: 520000000,
        discount: 13,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=300",
        badge: "Investasi Cerdas",
        stock: "available"
    }
];

// App State Management
let cart = [];
let appliedDiscount = 0;
const TAX_RATE = 0;

// Initialize app when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    renderHomeProducts();
    renderCatalogProducts();
    calculateCommission();
    updateCartUI();

    // Close dropdowns on clicking outside
    document.addEventListener("click", (e) => {
        const cartWidget = document.querySelector(".cart-widget");
        const memberWidget = document.querySelector(".member-profile-btn");
        
        if (!cartWidget.contains(e.target)) {
            document.getElementById("cartDropdown").classList.remove("active");
        }
        if (!memberWidget.contains(e.target)) {
            document.getElementById("memberDropdown").classList.remove("active");
        }
    });
});

// Format numbers into Indonesian Rupiah currency style
function formatRupiah(num) {
    return "Rp" + num.toLocaleString("id-ID");
}

// 1. TABS MANAGEMENT
function switchTab(tabId, subView = null) {
    // Deactivate all nav links
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));
    
    // Activate clicked tab main link
    const targetLi = document.querySelector(`.nav-links li[data-tab="${tabId}"]`);
    if (targetLi) targetLi.classList.add("active");

    // Hide all tab content panes
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    
    // Activate target pane
    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) targetPane.classList.add("active");

    // Handle subview redirections (e.g. Register form vs login form)
    if (tabId === 'member') {
        if (subView === 'register') {
            switchAuthTab('register');
        } else {
            switchAuthTab('login');
        }
    }

    if (tabId === 'orders') {
        if (subView === 'tracking') {
            document.getElementById("resiNumber").focus();
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu handler
function toggleMobileMenu() {
    document.getElementById("navLinks").classList.toggle("active");
}

// Dropdowns toggle handlers
function toggleCartDropdown() {
    document.getElementById("cartDropdown").classList.toggle("active");
    document.getElementById("memberDropdown").classList.remove("active");
}

function toggleMemberDropdown() {
    document.getElementById("memberDropdown").classList.toggle("active");
    document.getElementById("cartDropdown").classList.remove("active");
}

// 2. RENDER PRODUCTS
function createProductCardMarkup(prod) {
    const originalPriceFormatted = formatRupiah(prod.price);
    const slashPriceMarkup = prod.discount > 0 ? `<span class="price-discounted">${formatRupiah(prod.originalPrice)}</span>` : "";
    const badgeMarkup = prod.badge ? `<span class="product-badge">${prod.badge}</span>` : "";
    const discountBadge = prod.discount > 0 ? `<div class="product-discount-tag">-${prod.discount}%</div>` : "";

    return `
        <div class="product-card">
            ${badgeMarkup}
            ${discountBadge}
            <div class="product-img-wrapper">
                <img src="${prod.image}" alt="${prod.title}">
            </div>
            <div class="product-body">
                <span class="product-category">${prod.category.replace("-", " ")}</span>
                <h4 class="product-title" title="${prod.title}">${prod.title}</h4>
                <div class="stock-status">
                    <span class="stock-available"><i class="fa-solid fa-circle-check"></i> Ready Stock</span>
                </div>
                <div class="price-box">
                    <span class="price-original">${originalPriceFormatted}</span>
                    ${slashPriceMarkup}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${prod.id}')">Beli Sekarang</button>
                    <button class="btn-icon-cart" title="Tambah ke Keranjang" onclick="addToCart('${prod.id}', true)">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderHomeProducts() {
    const container = document.getElementById("homeProductsGrid");
    if (!container) return;
    
    // Select first 4 items as defaults for homepage
    const homeProds = productsData.slice(0, 4);
    container.innerHTML = homeProds.map(prod => createProductCardMarkup(prod)).join("");
}

function filterHomeProducts(filterType) {
    const container = document.getElementById("homeProductsGrid");
    if (!container) return;

    // Toggle active state in buttons
    document.querySelectorAll(".filter-tabs .tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    let filtered = productsData;
    if (filterType === 'best') {
        filtered = productsData.filter(p => p.badge === 'Paling Laris' || p.badge === 'Terlaris');
    } else if (filterType === 'promo') {
        filtered = productsData.filter(p => p.discount > 15);
    } else if (filterType === 'property') {
        filtered = productsData.filter(p => p.category === 'property');
    }

    container.innerHTML = filtered.slice(0, 4).map(prod => createProductCardMarkup(prod)).join("");
}

function renderCatalogProducts(filteredProducts = productsData) {
    const container = document.getElementById("catalogProductsGrid");
    if (!container) return;

    if (filteredProducts.length === 0) {
        container.innerHTML = `<div class="text-center mt-5" style="grid-column: 1/-1"><p>Tidak ada produk ditemukan matching filter Anda.</p></div>`;
        return;
    }

    container.innerHTML = filteredProducts.map(prod => createProductCardMarkup(prod)).join("");
    document.getElementById("catalogCountText").innerText = `Menampilkan ${filteredProducts.length} produk & layanan`;
}

// 3. CATALOG FILTERING & SORTING
let currentCategoryFilter = "all";

function filterCatalogItems(category, element) {
    // Toggle Active Class
    document.querySelectorAll(".filter-list li a").forEach(link => {
        link.classList.remove("active");
    });
    element.classList.add("active");

    currentCategoryFilter = category;
    applyAllFilters();
}

function applyPriceFilter() {
    applyAllFilters();
}

function applyAllFilters() {
    let filtered = productsData;

    // 1. Category Filter
    if (currentCategoryFilter !== "all") {
        filtered = filtered.filter(p => p.category === currentCategoryFilter);
    }

    // 2. Price Filters
    const minVal = parseFloat(document.getElementById("minPriceFilter").value);
    const maxVal = parseFloat(document.getElementById("maxPriceFilter").value);

    if (!isNaN(minVal)) {
        filtered = filtered.filter(p => p.price >= minVal);
    }
    if (!isNaN(maxVal)) {
        filtered = filtered.filter(p => p.price <= maxVal);
    }

    renderCatalogProducts(filtered);
}

function sortCatalogProducts() {
    const sortVal = document.getElementById("sortBy").value;
    let sorted = [...productsData];

    if (sortVal === "price-asc") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-desc") {
        sorted.sort((a, b) => b.price - a.price);
    } else if (sortVal === "discount") {
        sorted.sort((a, b) => b.discount - a.discount);
    }

    renderCatalogProducts(sorted);
}

function filterCatalog(category) {
    switchTab('catalog');
    const targetLink = document.querySelector(`.filter-list li a[onclick*="${category}"]`);
    if (targetLink) {
        filterCatalogItems(category, targetLink);
    }
}

// 4. CART & CHECKOUT SIMULATION
function addToCart(productId, stayOnPage = false) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();

    if (!stayOnPage) {
        switchTab('cart');
    } else {
        // Subtle alert or indicator
        alert(`${product.title} ditambahkan ke keranjang!`);
    }
}

function updateCartQty(productId, increment) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += increment;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    updateCartUI();
}

function removeCartItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

function applyVoucher() {
    const voucher = document.getElementById("voucherInput").value.trim().toUpperCase();
    if (voucher === "GSRWEB") {
        appliedDiscount = 0.10; // 10% discount
        alert("Voucher GSRWEB berhasil diterapkan! Diskon 10% dipotong dari subtotal.");
    } else {
        alert("Voucher tidak valid atau kadaluwarsa.");
        appliedDiscount = 0;
    }
    updateCartUI();
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * appliedDiscount;
    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, total };
}

function updateCartUI() {
    const { subtotal, discountAmount, total } = calculateTotals();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Header updates
    document.getElementById("cartCount").innerText = totalItems;
    document.getElementById("cartTotalHeader").innerText = formatRupiah(total);

    // Cart Dropdown updates
    const dropdownList = document.getElementById("cartItemsList");
    if (cart.length === 0) {
        dropdownList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Keranjang Anda kosong</p>
            </div>
        `;
    } else {
        dropdownList.innerHTML = cart.map(item => `
            <div class="cart-dropdown-item" style="display: flex; gap: 10px; margin-bottom: 12px; font-size: 12px; border-bottom: 1px dashed #E2E8F0; padding-bottom: 8px;">
                <img src="${item.image}" style="width: 40px; height: 40px; object-fit: contain;">
                <div style="flex: 1">
                    <h5 style="margin-bottom: 2px; font-weight: 600; line-height: 1.2;">${item.title.substring(0, 35)}...</h5>
                    <span>${item.quantity} x ${formatRupiah(item.price)}</span>
                </div>
            </div>
        `).join("");
    }
    document.getElementById("cartSubtotal").innerText = formatRupiah(total);

    // Checkout Page updates
    const tableBody = document.getElementById("cartTableBody");
    if (tableBody) {
        if (cart.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center" style="padding: 40px;">
                        <i class="fa-solid fa-basket-shopping" style="font-size: 40px; color: var(--muted-text); margin-bottom: 12px; display: block;"></i>
                        Keranjang belanja Anda kosong.
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = cart.map(item => `
                <tr>
                    <td>
                        <div class="cart-item-info">
                            <div class="cart-item-thumb"><img src="${item.image}"></div>
                            <div>
                                <h4 class="cart-item-title">${item.title}</h4>
                                <span class="badge badge-outline">${item.id}</span>
                            </div>
                        </div>
                    </td>
                    <td>${formatRupiah(item.price)}</td>
                    <td>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                        </div>
                    </td>
                    <td><strong>${formatRupiah(item.price * item.quantity)}</strong></td>
                    <td>
                        <button class="btn-remove-item" onclick="removeCartItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
            `).join("");
        }
    }

    // Totals box on Cart tab
    const subtotalText = document.getElementById("cartSummarySubtotal");
    if (subtotalText) {
        subtotalText.innerText = formatRupiah(subtotal);
        document.getElementById("cartSummaryDiscount").innerText = `- ${formatRupiah(discountAmount)}`;
        document.getElementById("cartSummaryTotal").innerText = formatRupiah(total);
    }
}

// Selesaikan Pemesanan via WhatsApp API
function processCheckout() {
    if (cart.length === 0) {
        alert("Keranjang belanja Anda kosong!");
        return;
    }

    const name = document.getElementById("checkoutName").value.trim();
    const phone = document.getElementById("checkoutPhone").value.trim();
    const address = document.getElementById("checkoutAddress").value.trim();
    const courier = document.getElementById("checkoutCourier").value;

    if (!name || !phone || !address) {
        alert("Mohon lengkapi data pemesanan terlebih dahulu!");
        return;
    }

    const { total } = calculateTotals();

    // Construct text for WA api
    let orderText = `*Pemesanan Baru HappyGSR*\n\n`;
    orderText += `*Detail Pelanggan:*\n`;
    orderText += `- Nama: ${name}\n`;
    orderText += `- WhatsApp: ${phone}\n`;
    orderText += `- Alamat: ${address}\n`;
    orderText += `- Pengiriman: ${courier}\n\n`;
    
    orderText += `*Daftar Produk:*\n`;
    cart.forEach(item => {
        orderText += `- ${item.title} (x${item.quantity}) - ${formatRupiah(item.price * item.quantity)}\n`;
    });

    orderText += `\n*Total Tagihan:* ${formatRupiah(total)}`;

    const waLink = `https://api.whatsapp.com/send?phone=6282240299789&text=${encodeURIComponent(orderText)}`;
    window.open(waLink, "_blank");
}

// 5. OTHER TOOLS & CALCULATORS
function calculateCommission() {
    const units = parseInt(document.getElementById("targetSales").value);
    const avgPrice = parseFloat(document.getElementById("avgPrice").value);
    
    document.getElementById("targetSalesVal").innerText = `${units} Unit`;

    // 10% commission model
    const totalCom = units * avgPrice * 0.10;
    document.getElementById("commissionOutput").innerText = formatRupiah(totalCom);
}

function checkOngkir() {
    const destinationPrice = parseFloat(document.getElementById("ongkirDestination").value);
    const weightGrams = parseFloat(document.getElementById("ongkirWeight").value) || 3000;
    
    // Weight formatted in KG (rounded up)
    const weightKg = Math.ceil(weightGrams / 1000);
    const totalOngkir = destinationPrice * weightKg;

    const resultBox = document.getElementById("ongkirResult");
    resultBox.classList.remove("d-none");
    resultBox.innerHTML = `
        <div style="background-color: var(--accent-light); padding: 16px; border-radius: var(--radius-md); border: 1.5px solid var(--accent)">
            <p style="font-weight: 700; color: var(--accent); margin-bottom: 4px;">Estimasi Ongkir Ditemukan:</p>
            <h4 style="font-size: 18px; margin-bottom: 8px;">${formatRupiah(totalOngkir)} (${weightKg} Kg)</h4>
            <p style="font-size: 12px; color: var(--muted-text);">*Sudah termasuk asuransi & packing kayu standar HappyGSR.</p>
        </div>
    `;
}

function trackOrder() {
    const resi = document.getElementById("resiNumber").value.trim().toUpperCase();
    const resultBox = document.getElementById("trackingResult");
    
    if (!resi) {
        alert("Mohon masukkan nomor resi terlebih dahulu!");
        return;
    }

    resultBox.classList.remove("d-none");
    resultBox.innerHTML = `
        <div class="tracking-step completed">
            <div class="step-bullet"></div>
            <div>
                <strong>[2026-06-20 10:00] - Paket Dikirim dari Hub Jakarta Barat</strong>
                <p>Paket laptop dalam perjalanan menuju alamat tujuan Anda.</p>
            </div>
        </div>
        <div class="tracking-step">
            <div class="step-bullet"></div>
            <div>
                <strong>[2026-06-19 14:00] - Verifikasi & Quality Control Passed</strong>
                <p>Uji fungsionalitas hardware dan kelayakan layar selesai.</p>
            </div>
        </div>
        <div class="tracking-step">
            <div class="step-bullet"></div>
            <div>
                <strong>[2026-06-19 09:00] - Pesanan Diterima</strong>
                <p>Pembayaran diverifikasi oleh PT GSR Bisnis Indonesia.</p>
            </div>
        </div>
    `;
}

// Auth Tabs Handler
function switchAuthTab(type) {
    const loginCard = document.getElementById("authLoginCard");
    const registerCard = document.getElementById("authRegisterCard");
    
    // Manage tab classes
    document.querySelectorAll(".auth-tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (type === 'login') {
        loginCard.classList.remove("d-none");
        registerCard.classList.add("d-none");
        event.target.classList.add("active");
    } else {
        loginCard.classList.add("d-none");
        registerCard.classList.remove("d-none");
        event.target.classList.add("active");
    }
}

// Accordion Policy Toggle
function toggleAccordion(header) {
    const item = header.closest(".accordion-item");
    item.classList.toggle("active");
}

function handleLogin(e) {
    e.preventDefault();
    alert("Simulasi: Login Berhasil! Anda sekarang masuk sebagai Member Premium HappyGSR.");
    switchTab('home');
}

function handleRegister(e) {
    e.preventDefault();
    alert("Simulasi: Pendaftaran Berhasil! Selamat datang di ekosistem kemitraan PT GSR Bisnis Indonesia.");
    switchTab('home');
}

function handlePaymentConfirm(e) {
    e.preventDefault();
    alert("Simulasi: Bukti transfer berhasil dikirim. Tim keuangan kami akan memverifikasi dalam waktu maksimal 10 menit.");
}

function handleSearch(e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    switchTab('catalog');
    
    const results = productsData.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderCatalogProducts(results);
}
