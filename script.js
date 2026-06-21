/**
 * ============================================================
 * HappyGSR.com — Main JavaScript
 * Vanilla JS • No dependencies • ES6+
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
   * Utility helpers
   * -------------------------------------------------------- */

  /** Detect mobile breakpoint (matches CSS) */
  const isMobile = () => window.innerWidth <= 768;

  /** Safely query an element — returns null if missing */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ----------------------------------------------------------
   * 1. Announcement Bar — close with slide-up animation
   * -------------------------------------------------------- */
  const announcementBar = $('#announcement-bar');
  const announcementClose = $('#announcement-close');

  if (announcementClose && announcementBar) {
    announcementClose.addEventListener('click', () => {
      // Slide-up: collapse height + fade out
      announcementBar.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, margin 0.4s ease, padding 0.4s ease';
      announcementBar.style.maxHeight = announcementBar.scrollHeight + 'px';
      // Force reflow so the browser registers the starting value
      announcementBar.offsetHeight; // eslint-disable-line no-unused-expressions
      announcementBar.style.maxHeight = '0';
      announcementBar.style.opacity = '0';
      announcementBar.style.overflow = 'hidden';
      announcementBar.style.marginTop = '0';
      announcementBar.style.marginBottom = '0';
      announcementBar.style.paddingTop = '0';
      announcementBar.style.paddingBottom = '0';

      // After animation, remove from flow entirely
      announcementBar.addEventListener('transitionend', function handler() {
        announcementBar.style.display = 'none';
        announcementBar.removeEventListener('transitionend', handler);
      });
    });
  }

  /* ----------------------------------------------------------
   * 2. Sticky Header — add 'scrolled' class after 100px
   * -------------------------------------------------------- */
  const mainHeader = $('#main-header');
  let lastScrollY = 0;
  let ticking = false;

  function handleStickyHeader() {
    const scrollY = window.scrollY;

    if (mainHeader) {
      if (scrollY > 100) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Feature 7 — Scroll-to-Top visibility
    if (scrollTopBtn) {
      if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleStickyHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ----------------------------------------------------------
   * 3. Mobile Menu Toggle
   * -------------------------------------------------------- */
  const mobileMenuBtn = $('#mobile-menu-btn');
  const navMain = $('#nav-main');

  if (mobileMenuBtn && navMain) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMain.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active', isActive);
      // Lock body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (navMain.classList.contains('active') &&
          !navMain.contains(e.target) &&
          !mobileMenuBtn.contains(e.target)) {
        navMain.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
   * 4. Cart Functionality — count + toast notification
   * -------------------------------------------------------- */
  let cartCount = 0;
  const cartBadge = $('#cart-count');

  /** Create and show a brief toast notification */
  function showToast(message, duration = 2500) {
    // Reuse or create toast container
    let container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      Object.assign(container.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '10000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
      });
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      background: 'linear-gradient(135deg, #1e3a5f, #2d5a8c)',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 8px 24px rgba(0,0,0,.18)',
      opacity: '0',
      transform: 'translateY(20px) scale(0.95)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      pointerEvents: 'auto',
      whiteSpace: 'nowrap',
    });
    container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0) scale(1)';
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px) scale(0.95)';
      toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
  }

  // Event delegation for add-to-cart buttons
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    if (!addBtn) return;

    cartCount++;
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      // Bounce animation on badge
      cartBadge.style.transition = 'none';
      cartBadge.style.transform = 'scale(1.5)';
      requestAnimationFrame(() => {
        cartBadge.style.transition = 'transform 0.3s cubic-bezier(.34,1.56,.64,1)';
        cartBadge.style.transform = 'scale(1)';
      });
    }

    // Determine product name from nearest card
    const card = addBtn.closest('.product-card');
    const productName = card
      ? (card.querySelector('.product-title a')?.textContent?.trim().slice(0, 40) + '…')
      : 'Produk';

    showToast(`✓ ${productName} ditambahkan ke keranjang`);
  });

  /* ----------------------------------------------------------
   * 5. Product Filter — filter by data-category
   * -------------------------------------------------------- */
  const filterContainer = $('#product-filters');
  const productGrid = $('#product-grid');

  if (filterContainer && productGrid) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      const filterValue = btn.dataset.filter;

      // Update active class
      $$('.filter-btn', filterContainer).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with a smooth fade
      const cards = $$('.product-card', productGrid);
      cards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filterValue === 'all' || category === filterValue;

        if (shouldShow) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          // Hide after transition
          setTimeout(() => {
            if (!card.style.opacity || card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });

    // Apply transition to product cards for smooth filtering
    $$('.product-card', productGrid).forEach((card) => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
  }

  /* ----------------------------------------------------------
   * 6. Counter Animation — IntersectionObserver on .hero-stats
   * -------------------------------------------------------- */
  const heroStats = $('.hero-stats');
  let countersAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 2000; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('id-ID');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure we land exactly on the target
        el.textContent = target.toLocaleString('id-ID');
        // Append '+' for large numbers
        if (target >= 100) {
          el.textContent += '+';
        }
      }
    }

    requestAnimationFrame(update);
  }

  if (heroStats) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            $$('.stat-number', heroStats).forEach((num) => animateCounter(num));
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(heroStats);
  }

  /* ----------------------------------------------------------
   * 7. Scroll-to-Top button
   * -------------------------------------------------------- */
  const scrollTopBtn = $('#scroll-top');

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial visibility is handled inside handleStickyHeader (scroll listener)
  // Trigger once on load
  handleStickyHeader();

  /* ----------------------------------------------------------
   * 8. WhatsApp FAB — toggle popup
   * -------------------------------------------------------- */
  const waFab = $('#wa-fab');
  const waFabBtn = $('#wa-fab-btn');
  const waPopupClose = $('#wa-popup-close');

  if (waFabBtn && waFab) {
    waFabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      waFab.classList.toggle('active');
    });

    if (waPopupClose) {
      waPopupClose.addEventListener('click', (e) => {
        e.stopPropagation();
        waFab.classList.remove('active');
      });
    }

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (waFab.classList.contains('active') && !waFab.contains(e.target)) {
        waFab.classList.remove('active');
      }
    });
  }

  /* ----------------------------------------------------------
   * 9. Smooth Scroll — for anchor links starting with '#'
   * -------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = $(hash);
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    if (navMain && navMain.classList.contains('active')) {
      navMain.classList.remove('active');
      mobileMenuBtn?.classList.remove('active');
      document.body.style.overflow = '';
    }

    const headerOffset = mainHeader ? mainHeader.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;

    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
   * 10. Search Bar — demo alert on search
   * -------------------------------------------------------- */
  const searchBtn = $('#search-btn');
  const searchInput = $('#search-input');
  const searchCategory = $('#search-category');

  function performSearch() {
    const query = searchInput?.value.trim();
    const category = searchCategory?.value || 'Semua Kategori';

    if (!query) {
      searchInput?.focus();
      return;
    }

    const categoryLabel = searchCategory?.options[searchCategory.selectedIndex]?.text || category;
    alert(
      `🔍 Mencari: "${query}"\n📂 Kategori: ${categoryLabel}\n\n` +
      `(Fitur pencarian akan terhubung ke backend pada versi production)`
    );
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });
  }

  /* ----------------------------------------------------------
   * 11. Dropdown Navigation — hover (desktop) / click (mobile)
   * -------------------------------------------------------- */
  const dropdownItems = $$('.has-dropdown');

  dropdownItems.forEach((item) => {
    const link = $('a', item);
    const dropdown = $('.mega-dropdown', item) || $('.dropdown', item);
    if (!link || !dropdown) return;

    // DESKTOP — show on hover with a small delay
    let hoverTimeout;

    item.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      clearTimeout(hoverTimeout);
      // Close any other open dropdowns first
      dropdownItems.forEach((other) => {
        if (other !== item) other.classList.remove('dropdown-open');
      });
      item.classList.add('dropdown-open');
    });

    item.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      hoverTimeout = setTimeout(() => {
        item.classList.remove('dropdown-open');
      }, 200);
    });

    // MOBILE — toggle on click
    link.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      const isOpen = item.classList.contains('dropdown-open');
      // Close all others
      dropdownItems.forEach((other) => other.classList.remove('dropdown-open'));
      if (!isOpen) item.classList.add('dropdown-open');
    });
  });

  /* ----------------------------------------------------------
   * 12. Announcement Ticker — cycle messages every 5s
   * -------------------------------------------------------- */
  const announcementText = $('#announcement-text');
  const tickerMessages = [
    'PROMO SPESIAL HARI INI! Gunakan Kode <strong>"GSRWEB"</strong> untuk Diskon Tambahan!',
    '🚀 GRATIS Ongkir se-Indonesia untuk pembelian laptop di atas Rp 3 Juta!',
    '🎁 Beli 2 Laptop Diskon 5% — Paket Spesial Instansi & Sekolah!',
    '💻 NEW! PC All-in-One HappyGSR — Mulai Rp 3.999.045!',
    '🏠 GSR Property — Investasi Properti di Bawah Harga Developer!',
  ];
  let tickerIndex = 0;

  if (announcementText) {
    setInterval(() => {
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;

      // Fade-out
      announcementText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      announcementText.style.opacity = '0';
      announcementText.style.transform = 'translateY(-6px)';

      setTimeout(() => {
        announcementText.innerHTML = tickerMessages[tickerIndex];
        // Fade-in
        announcementText.style.transform = 'translateY(6px)';
        requestAnimationFrame(() => {
          announcementText.style.opacity = '1';
          announcementText.style.transform = 'translateY(0)';
        });
      }, 400); // matches fade-out duration
    }, 5000);
  }

  /* ----------------------------------------------------------
   * 13. Intersection Observer Animations — fade-up on scroll
   * -------------------------------------------------------- */
  const animateSections = $$([
    '.categories',
    '.products',
    '.why-us',
    '.about',
    '.testimonials',
    '.news',
    '.cta-section',
    '.location',
  ].join(','));

  // Also animate individual cards and grid children
  const animateElements = $$([
    '.category-card',
    '.product-card',
    '.why-card',
    '.testimonial-card',
    '.news-card',
    '.about-stat-card',
    '.location-card',
  ].join(','));

  const allAnimatable = [...animateSections, ...animateElements];

  // Set initial hidden state via JS (avoids FOUC if CSS doesn't have it)
  allAnimatable.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger child animations slightly
          const delay = entry.target.dataset.animDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('animate-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Assign stagger delays to grid children
  [
    '.category-card',
    '.product-card',
    '.why-card',
    '.testimonial-card',
    '.news-card',
    '.about-stat-card',
    '.location-card',
  ].forEach((selector) => {
    $$(selector).forEach((el, i) => {
      el.dataset.animDelay = i * 100; // 100ms stagger per item
    });
  });

  allAnimatable.forEach((el) => sectionObserver.observe(el));

  /* ----------------------------------------------------------
   * Initialization complete ✓
   * -------------------------------------------------------- */
  console.log('%c⚡ HappyGSR.com — Ready', 'color:#2d5a8c;font-weight:bold;font-size:14px');
});
