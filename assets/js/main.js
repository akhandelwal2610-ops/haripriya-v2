/**
 * Haripriya v2 Premium JS
 * Handles SEO-Friendly Bilingual Toggling, Scroll Animations, Tabs, and Nav.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---- NAV SCROLL ---- */
  const nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---- MOBILE MENU ---- */
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navLinks.style.display = burger.classList.contains('active') ? 'flex' : 'none';
      if (burger.classList.contains('active')) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(255,255,255,0.95)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1px solid var(--border)';
      } else {
        navLinks.style.display = ''; // Reset
      }
    });
  }

  /* ---- SEO-FRIENDLY I18N SYSTEM ---- */
  /* We store original EN HTML so we can revert. Hindi comes from data-hi. */
  const i18nElements = document.querySelectorAll('.i18n');
  
  // Store the English state on init
  i18nElements.forEach(el => {
    el.setAttribute('data-en', el.innerHTML);
  });

  window.setLang = function(lang, btn) {
    // UI Update
    document.querySelectorAll('.lb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // DOM Swap — standard i18n elements (data-hi/data-en)
    i18nElements.forEach(el => {
      if (lang === 'hi') {
        const hiText = el.getAttribute('data-hi');
        if (hiText) { el.innerHTML = hiText; }
        document.documentElement.lang = 'hi';
        document.body.style.fontFamily = "'Tiro Devanagari Hindi', 'Outfit', sans-serif";
      } else {
        const enText = el.getAttribute('data-en');
        if (enText) { el.innerHTML = enText; }
        document.documentElement.lang = 'en';
        document.body.style.fontFamily = "'Outfit', sans-serif";
      }
    });

    // DOM Swap — legacy .en/.hi span pairs (blog/index.html style)
    if (lang === 'hi') {
      document.querySelectorAll('.en').forEach(el => { el.style.display = 'none'; });
      document.querySelectorAll('.hi').forEach(el => { el.style.display = ''; });
    } else {
      document.querySelectorAll('.en').forEach(el => { el.style.display = ''; });
      document.querySelectorAll('.hi').forEach(el => { el.style.display = 'none'; });
    }
  };

  /* ---- PROCEDURE TABS ---- */
  const pgTabs = document.querySelectorAll('.pg-tab');
  const pgPanels = document.querySelectorAll('.pg-panel');
  pgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      pgTabs.forEach(t => t.classList.remove('active'));
      pgPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  /* ---- SERVICE TABS ---- */
  const srvTabs = document.querySelectorAll('.srv-tab');
  const srvPanels = document.querySelectorAll('.srv-panel');
  srvTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const srvId = tab.getAttribute('data-srv');
      srvTabs.forEach(t => t.classList.remove('active'));
      srvPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.getElementById('srv-' + srvId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  /* ---- ANIMATED COUNTERS ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-num[data-count]');
  if ('IntersectionObserver' in window && counterEls.length > 0) {
    const counterObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ---- WHATSAPP SUBMIT ---- */
  window.submitViaWhatsApp = function () {
    let name = (document.getElementById('cf-name') || {}).value || '';
    let phone = (document.getElementById('cf-phone') || {}).value || '';
    let dept = (document.getElementById('cf-dept') || {}).value || '';
    let msg = (document.getElementById('cf-msg') || {}).value || '';
    name = name.trim();
    phone = phone.trim();
    if (!name) { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your phone.'); return; }
    
    const text = [
      'New Appointment Request — Haripriya Centre',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Department: ' + dept,
      msg ? 'Concern: ' + msg : ''
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/917217327979?text=' + encodeURIComponent(text), '_blank');
  };

  /* ---- SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---- */
  const animEls = document.querySelectorAll('.reveal-up, .reveal-scale');
  
  if ('IntersectionObserver' in window && animEls.length > 0) {
    // Respect user motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      animEls.forEach(el => el.classList.add('vis'));
    } else {
      const animObs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animEls.forEach(el => animObs.observe(el));
    }
  } else {
    // Fallback if no observer support
    animEls.forEach(el => el.classList.add('vis'));
  }
});

// ---- IMAGE SECURITY SYSTEM ----

// Block right-click globally (covers images, background renders, canvas, SVG)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Block drag-and-drop of any image or link element
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
        e.preventDefault();
    }
});

// Block Ctrl+S (Save Page) and Ctrl+U (View Source)
document.addEventListener('keydown', function(e) {
    const ctrl = e.ctrlKey || e.metaKey; // metaKey = Cmd on Mac
    if (ctrl && (e.key === 's' || e.key === 'S')) { e.preventDefault(); }
    if (ctrl && (e.key === 'u' || e.key === 'U')) { e.preventDefault(); }
    if (ctrl && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); } // Print
});

// Inject transparent shields to block touch-hold "Save Image" on iOS/Android.
// Only targets containers that already have position:relative — never modifies layout.
(function shieldImages() {
    // .float-prof (hero doctor cutouts) and .pd-img-area (doctors section) already position:relative
    ['.float-prof', '.pd-img-area'].forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(wrap) {
            if (!wrap.querySelector('.img-shield')) {
                var shield = document.createElement('div');
                shield.className = 'img-shield';
                shield.style.cssText = 'position:absolute;inset:0;z-index:9;cursor:default;-webkit-tap-highlight-color:transparent;';
                wrap.appendChild(shield);
            }
        });
    });
    // Art renders (.art-heart, .art-eye) are already protected by:
    // CSS pointer-events:none + global right-click block + dragstart prevention.
    // Do NOT modify .hero-bg-layer position — it is position:absolute and must stay that way.
})();
