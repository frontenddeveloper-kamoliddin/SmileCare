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

// Service Cards and Modal functionality
const serviceModal = $('#serviceModal');
const modalBackdrop = $('.modal__backdrop');
const modalClose = $('.modal__close');
const imageGrid = $('#imageGrid');

// Service images data
const serviceImages = {
  vinerlar: [
    { image: 'https://picsum.photos/400/300?random=1', title: 'Vinerlar - Oldin', desc: 'Dastlabki tish holati' },
    { image: 'https://picsum.photos/400/300?random=2', title: 'Vinerlar - Keyin', desc: 'Laminat qo\'yilgandan keyin' },
    { image: 'https://picsum.photos/400/300?random=3', title: 'Rangli vinerlar', desc: 'Turli xil rang tanlovlari' },
    { image: 'https://picsum.photos/400/300?random=4', title: 'Materiallar', desc: 'Yuqori sifatli keramika' },
    { image: 'https://picsum.photos/400/300?random=5', title: 'Jarayon', desc: 'Professional o\'rnatish' },
    { image: 'https://picsum.photos/400/300?random=6', title: 'Natija', desc: 'Chiroyli tabassum' }
  ],
  zirkoniy: [
    { image: 'https://picsum.photos/400/300?random=11', title: 'Zirkoniy tojlar', desc: 'Mustahkam va chiroyli' },
    { image: 'https://picsum.photos/400/300?random=12', title: 'Texnologiya', desc: 'Zamonaviy CAD/CAM' },
    { image: 'https://picsum.photos/400/300?random=13', title: 'Mustahkamlik', desc: 'Uzoq muddatli kafolat' },
    { image: 'https://picsum.photos/400/300?random=14', title: 'Estetika', desc: 'Tabiiy ko\'rinish' },
    { image: 'https://picsum.photos/400/300?random=15', title: 'Tezlik', desc: 'Bir kun ichida' },
    { image: 'https://picsum.photos/400/300?random=16', title: 'Sifat', desc: 'Nemis standarti' }
  ],
  ortopediya: [
    { image: 'https://picsum.photos/400/300?random=21', title: 'To\'liq protez', desc: 'Barcha tishlarni almashtirish' },
    { image: 'https://picsum.photos/400/300?random=22', title: 'Qisman protez', desc: 'Ayrim tishlar uchun' },
    { image: 'https://picsum.photos/400/300?random=23', title: 'Ko\'prik protezi', desc: 'Bir nechta tish o\'rniga' },
    { image: 'https://picsum.photos/400/300?random=24', title: 'Byugel protez', desc: 'Metall ramkali' },
    { image: 'https://picsum.photos/400/300?random=25', title: 'Aniq o\'lchov', desc: 'Individual tayyorlash' },
    { image: 'https://picsum.photos/400/300?random=26', title: 'Qulay foydalanish', desc: 'Tabiiy his-tuyg\'u' }
  ],
  terapiya: [
    { image: 'https://picsum.photos/400/300?random=31', title: 'Karies davolash', desc: 'Zarar ko\'rgan qismni tozalash' },
    { image: 'https://picsum.photos/400/300?random=32', title: 'Kanal davolash', desc: 'Chuqur infeksiya davolash' },
    { image: 'https://picsum.photos/400/300?random=33', title: 'Og\'riqsiz davolash', desc: 'Zamonaviy anesteziya' },
    { image: 'https://picsum.photos/400/300?random=34', title: 'Diagnostika', desc: 'Aniq tashxis qo\'yish' },
    { image: 'https://picsum.photos/400/300?random=35', title: 'Laser terapiya', desc: 'Noinvaziv usul' },
    { image: 'https://picsum.photos/400/300?random=36', title: 'Natija', desc: 'Sog\'lom tishlar' }
  ],
  plombalar: [
    { image: 'https://picsum.photos/400/300?random=41', title: 'Kompozit plombalar', desc: 'Tish rangiga mos' },
    { image: 'https://picsum.photos/400/300?random=42', title: 'Mustahkam materiallar', desc: 'Uzoq muddatli' },
    { image: 'https://picsum.photos/400/300?random=43', title: 'Qayta tiklash', desc: 'Tishning shakli va funksiyasi' },
    { image: 'https://picsum.photos/400/300?random=44', title: 'Aniq ish', desc: 'Mikroskop ostida' },
    { image: 'https://picsum.photos/400/300?random=45', title: 'Tez jarayon', desc: 'Bir seansta' },
    { image: 'https://picsum.photos/400/300?random=46', title: 'Estetik ko\'rinish', desc: 'Ko\'zga ko\'rinmaydigan' }
  ],
  tozalash: [
    { image: 'https://picsum.photos/400/300?random=51', title: 'Professional tozalash', desc: 'Chuqur tozalash' },
    { image: 'https://picsum.photos/400/300?random=52', title: 'AirFlow usuli', desc: 'Yumshoq tozalash' },
    { image: 'https://picsum.photos/400/300?random=53', title: 'Skaling', desc: 'Tosh va blyashka olib tashlash' },
    { image: 'https://picsum.photos/400/300?random=54', title: 'Polirovka', desc: 'Silliqlash va jilolash' },
    { image: 'https://picsum.photos/400/300?random=55', title: 'Himoya', desc: 'Karies oldini olish' },
    { image: 'https://picsum.photos/400/300?random=56', title: 'Natija', desc: 'Toza va oq tishlar' }
  ],
  halitoz: [
    { image: 'https://picsum.photos/400/300?random=61', title: 'Diagnostika', desc: 'Sabab aniqlash' },
    { image: 'https://picsum.photos/400/300?random=62', title: 'Laboratoriya', desc: 'Mikrobiologik tahlil' },
    { image: 'https://picsum.photos/400/300?random=63', title: 'Davolash', desc: 'Individual yondashuv' },
    { image: 'https://picsum.photos/400/300?random=64', title: 'Tabiiy usullar', desc: 'Xavfsiz vositalar' },
    { image: 'https://picsum.photos/400/300?random=65', title: 'Maslahat', desc: 'Og\'iz gigienasi bo\'yicha' },
    { image: 'https://picsum.photos/400/300?random=66', title: 'Muammo hal qilindi', desc: 'Nafas hidining yo\'qolishi' }
  ],
  breket: [
    { image: 'https://picsum.photos/400/300?random=71', title: 'Metall breket', desc: 'Eng samarali usul' },
    { image: 'https://picsum.photos/400/300?random=72', title: 'Keramika breket', desc: 'Estetik variant' },
    { image: 'https://picsum.photos/400/300?random=73', title: 'Ko\'rinmas breket', desc: 'Lingual tizim' },
    { image: 'https://picsum.photos/400/300?random=74', title: 'Davolash rejasi', desc: '3D modellashtirish' },
    { image: 'https://picsum.photos/400/300?random=75', title: 'Muntazam nazorat', desc: 'Oylik ko\'riklar' },
    { image: 'https://picsum.photos/400/300?random=76', title: 'Ideal tabassum', desc: 'To\'g\'ri tish qatori' }
  ]
};

// Open modal function
function openServiceModal(serviceType) {
  const images = serviceImages[serviceType] || [];
  const serviceNames = {
    vinerlar: 'Vinerlar',
    zirkoniy: 'Zirkoniy qoplamalar',
    ortopediya: 'Ortopediya / protezlash',
    terapiya: 'Terapiya',
    plombalar: 'Tish plombalari',
    tozalash: 'Tishlarni tozalash',
    halitoz: 'Halitoz (hidni yo\'qotish)',
    breket: 'Breket taqish'
  };
  
  // Update modal title
  const modalTitle = $('.modal__title');
  if (modalTitle) {
    modalTitle.textContent = serviceNames[serviceType] + ' - rasmlar';
  }
  
  // Clear and populate image grid
  if (imageGrid) {
    imageGrid.innerHTML = '';
    images.forEach((image, index) => {
      const imageItem = document.createElement('div');
      imageItem.className = 'image-item';
      imageItem.innerHTML = `
        <div class="image-placeholder">
          <img src="${image.image}" alt="${image.title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0ZjRmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='; this.style.opacity='0.7';" />
        </div>
        <h4 class="image-title">${image.title}</h4>
        <p class="image-desc">${image.desc}</p>
      `;
      imageGrid.appendChild(imageItem);
    });
  }
  
  // Show modal
  if (serviceModal) {
    serviceModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

// Close modal function
function closeServiceModal() {
  if (serviceModal) {
    serviceModal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

// Add click handlers to service cards
$$('.service-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const serviceType = card.getAttribute('data-service');
    if (serviceType) {
      openServiceModal(serviceType);
    }
  });
});

// Modal close handlers
if (modalClose) {
  modalClose.addEventListener('click', closeServiceModal);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeServiceModal);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('is-open')) {
    closeServiceModal();
  }
});



