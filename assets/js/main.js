// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Header nav toggle
const navToggle = $('.nav__toggle');
const navList = $('.nav__list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scroll for in-page links
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (!targetId) return;
    const el = document.querySelector(targetId);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
      navList?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Counters
const counters = $$('.stat__num');
const animateCounter = (el) => {
  const end = Number(el.getAttribute('data-count')) || 0;
  if (end <= 0) return;
  const isPercent = el.textContent?.trim().endsWith('%');
  const dur = 1.6;
  const start = 0;
  const startTime = performance.now();
  const step = (now) => {
    const p = Math.min((now - startTime) / (dur * 1000), 1);
    const val = Math.floor(start + (end - start) * (p < 0.5 ? 2*p*p : -1 + (4 - 2*p) * p));
    el.textContent = isPercent ? `${val}%` : `${val}`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Intersection Observer for reveal elements
const revealEls = $$('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      if (entry.target.classList.contains('stat')) {
        const num = entry.target.querySelector('.stat__num');
        if (num) animateCounter(num);
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// 3D card hover effect for doctors
$$('.card3d').forEach(card => {
  const bounds = () => card.getBoundingClientRect();
  const maxDeg = 10;
  let raf = null;
  const onMove = (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const b = bounds();
      const x = (e.clientX - b.left) / b.width - 0.5;
      const y = (e.clientY - b.top) / b.height - 0.5;
      card.style.transform = `rotateX(${(-y*maxDeg).toFixed(2)}deg) rotateY(${(x*maxDeg).toFixed(2)}deg)`;
    });
  };
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', () => { card.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
});

// Swipers
const gallerySwiper = new Swiper('.gallery-swiper', {
  spaceBetween: 16,
  slidesPerView: 1,
  pagination: { el: '.gallery-swiper .swiper-pagination', clickable: true },
});
const testiSwiper = new Swiper('.testi-swiper', {
  spaceBetween: 16,
  slidesPerView: 1,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: '.testi-swiper .swiper-pagination', clickable: true },
});

// GSAP animations
gsap.registerPlugin(ScrollTrigger);
gsap.from('.header .container', { y: -24, opacity: 0, duration: .8, ease: 'power3.out' });
gsap.from('.hero__title', { y: 24, opacity: 0, duration: .8, delay: .1, ease: 'power3.out' });
gsap.from('.hero__subtitle', { y: 24, opacity: 0, duration: .8, delay: .2, ease: 'power3.out' });
gsap.from('.hero__actions', { y: 24, opacity: 0, duration: .8, delay: .3, ease: 'power3.out' });

// Parallax tooth
gsap.to('.tooth-3d', { yPercent: -4, duration: 1.2, ease: 'power1.out' });

// Scroll-triggered sections
gsap.utils.toArray('.section').forEach((sec, i) => {
  gsap.from(sec.querySelector('.section__head'), {
    scrollTrigger: { trigger: sec, start: 'top 70%' },
    y: 20, opacity: 0, duration: .7, ease: 'power2.out'
  });
});

// Form handling
const form = $('#appointmentForm');
const toast = $('#toast');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // Simple validation
    if (!data.name || !data.phone || !data.service || !data.date) {
      showToast('Iltimos, barcha majburiy maydonlarni toʻldiring.', true);
      return;
    }
    // Simulate async submit
    showToast('Soʻrovingiz yuborildi. Tez orada bogʻlanamiz!', false);
    form.reset();
  });
}

function showToast(message, isError) {
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.background = isError ? 'rgba(248,113,113,.15)' : 'rgba(34,197,94,.15)';
  toast.style.borderColor = isError ? 'rgba(248,113,113,.35)' : 'rgba(34,197,94,.35)';
  toast.style.color = isError ? '#fecaca' : '#86efac';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.style.display = 'none'; }, 3800);
}

// Footer year
const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());

// Preloader
window.addEventListener('load', () => {
  const pre = $('#preloader');
  if (pre) {
    pre.style.opacity = '0';
    setTimeout(() => pre.remove(), 400);
  }
});



