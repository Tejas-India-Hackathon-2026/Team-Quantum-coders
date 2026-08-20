/**
 * LifeProof - Main JavaScript Controller
 * Handles global UI interactions, animated stat counters, intersection observers, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initHeaderScrollEffect();
  initSmoothScroll();
  initStatCounters();
  initScrollSpy();
  initMockupTelemetry();
});

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-active');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close menu when clicking navigation links on mobile
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '☰';
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !menuBtn.contains(event.target) && navMenu.classList.contains('is-active')) {
      navMenu.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '☰';
    }
  });
}

/**
 * Header background elevation and shadow on scroll
 */
function initHeaderScrollEffect() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.style.backgroundColor = 'rgba(7, 11, 20, 0.94)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
    } else {
      header.style.backgroundColor = 'rgba(7, 11, 20, 0.82)';
      header.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Smooth scrolling for internal anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Animated Numerical Counters for Statistics Section
 */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-number[data-target]');
  if (!statElements.length) return;

  const observerOptions = {
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = targetValue % 1 !== 0;
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          // Ease-out cubic formula
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = easeOut * targetValue;

          if (isDecimal) {
            el.textContent = currentVal.toFixed(1) + suffix;
          } else {
            el.textContent = Math.floor(currentVal).toLocaleString() + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = (isDecimal ? targetValue.toFixed(1) : targetValue.toLocaleString()) + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        observerInstance.unobserve(el);
      }
    });
  }, observerOptions);

  statElements.forEach(el => observer.observe(el));
}

/**
 * ScrollSpy to highlight active navbar links
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (currentSectionId === 'hero' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/**
 * Live Telemetry Simulation for Hero Dashboard Mockup
 */
function initMockupTelemetry() {
  const scoreFill = document.getElementById('mockupScoreFill');
  const matchPill = document.getElementById('mockupMatchPill');

  if (!scoreFill) return;

  // Subtle live pulse effect
  setTimeout(() => {
    scoreFill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    scoreFill.style.width = '94%';
  }, 300);
}

/**
 * Syncs Homepage Header Navigation with Active User Session
 */
function initHeaderAuthSync() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  let activeSession = null;
  try {
    const raw = sessionStorage.getItem('lp_active_session');
    if (raw) activeSession = JSON.parse(raw);
  } catch (e) {}

  if (activeSession && activeSession.email) {
    const role = activeSession.role || sessionStorage.getItem('lp_user_role') || 'student';
    let dashboardPath = 'pages/student.html';
    if (role === 'recruiter') dashboardPath = 'pages/recruiter.html';
    else if (role === 'faculty') dashboardPath = 'pages/faculty.html';

    const displayName = activeSession.displayName || activeSession.name || 'My Dashboard';

    navActions.innerHTML = `
      <a href="${dashboardPath}" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem;">
        <span>📊 ${escapeHtml(displayName)}</span>
      </a>
      <button type="button" class="btn btn-secondary btn-sm" id="btnMainSignOut" style="cursor: pointer;">
        Sign Out 🚪
      </button>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle navigation menu">☰</button>
    `;

    const signoutBtn = document.getElementById('btnMainSignOut');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        sessionStorage.clear();
        localStorage.removeItem('lp_active_session');
        localStorage.removeItem('lp_user_role');
        window.location.reload();
      });
    }
  }
}

// Ensure initHeaderAuthSync runs on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initHeaderAuthSync();
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

