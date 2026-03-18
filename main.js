/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  MAIN.JS — JavaScript compartido para las 6 plantillas       ║
 * ║  Funcionalidades:                                             ║
 * ║    1. Menú hamburguesa mobile                                 ║
 * ║    2. Header sticky con cambio de estilo al hacer scroll      ║
 * ║    3. Smooth scroll hacia secciones                           ║
 * ║    4. Lightbox para galería de imágenes                       ║
 * ║    5. Validación del formulario de contacto                   ║
 * ║    6. Animaciones de entrada al hacer scroll (IntersectionObs)║
 * ║    7. Año dinámico en el footer                               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use strict';

/* ──────────────────────────────────────────────
   1. AÑO DINÁMICO EN EL FOOTER
────────────────────────────────────────────── */
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ──────────────────────────────────────────────
   2. MENÚ HAMBURGUESA MOBILE
────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

if (navToggle && mainNav) {

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.classList.toggle('is-active', isOpen);
  });

  // Cerrar al hacer clic en un link de nav
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-active');
    });
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-active');
    }
  });
}


/* ──────────────────────────────────────────────
   3. HEADER STICKY — sombra al hacer scroll
────────────────────────────────────────────── */
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const handleHeaderScroll = () => {
    siteHeader.classList.toggle('header-scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // estado inicial
}


/* ──────────────────────────────────────────────
   4. SMOOTH SCROLL
   (Fallback para navegadores sin soporte CSS scroll-behavior)
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});


/* ──────────────────────────────────────────────
   5. LIGHTBOX PARA GALERÍA
────────────────────────────────────────────── */
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxClose   = document.getElementById('lightboxClose');

if (lightboxOverlay && lightboxImg) {

  // Abrir lightbox al hacer clic en una imagen de galería
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxOverlay.classList.add('lightbox-visible');
      document.body.style.overflow = 'hidden';
    });
  });

  // Cerrar lightbox
  const closeLightbox = () => {
    lightboxOverlay.classList.remove('lightbox-visible');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('lightbox-visible')) {
      closeLightbox();
    }
  });
}


/* ──────────────────────────────────────────────
   6. VALIDACIÓN Y ENVÍO DEL FORMULARIO
────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {

  // ── Helpers de validación ──
  const showError = (fieldId, errorId, msg) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field)  field.classList.add('input-error');
    if (error)  error.textContent = msg;
  };

  const clearError = (fieldId, errorId) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field)  field.classList.remove('input-error');
    if (error)  error.textContent = '';
  };

  // Validación en tiempo real
  const fields = [
    { id: 'nombre',   errorId: 'errorNombre',   min: 2, label: 'nombre' },
    { id: 'telefono', errorId: 'errorTelefono', min: 7, label: 'teléfono' },
    { id: 'consulta', errorId: 'errorConsulta', min: 10, label: 'consulta' },
  ];

  fields.forEach(({ id, errorId, min, label }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', () => {
      if (el.value.trim().length >= min) {
        clearError(id, errorId);
      }
    });

    el.addEventListener('blur', () => {
      if (!el.value.trim()) {
        showError(id, errorId, `Por favor ingresá tu ${label}.`);
      } else if (el.value.trim().length < min) {
        showError(id, errorId, `Mínimo ${min} caracteres.`);
      }
    });
  });

  // Validación de teléfono con regex
  const validarTelefono = (tel) => /^[\d\s\+\-\(\)]{7,20}$/.test(tel.trim());

  // Envío del formulario
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    const formSuccess = document.getElementById('formSuccess');
    const formError   = document.getElementById('formError');

    // Limpiar mensajes previos
    if (formSuccess) formSuccess.style.display = 'none';
    if (formError)   formError.style.display   = 'none';

    // Validar campos
    let isValid = true;

    const nombre   = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const consulta = document.getElementById('consulta');

    if (!nombre?.value.trim() || nombre.value.trim().length < 2) {
      showError('nombre', 'errorNombre', 'Por favor ingresá tu nombre completo.');
      isValid = false;
    }

    if (!telefono?.value.trim() || !validarTelefono(telefono.value)) {
      showError('telefono', 'errorTelefono', 'Ingresá un número de teléfono válido.');
      isValid = false;
    }

    if (!consulta?.value.trim() || consulta.value.trim().length < 10) {
      showError('consulta', 'errorConsulta', 'Escribí tu consulta (mínimo 10 caracteres).');
      isValid = false;
    }

    if (!isValid) return;

    // Estado de carga
    if (submitBtn)  submitBtn.disabled = true;
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.style.display = 'flex';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        throw new Error('Error de servidor');
      }
    } catch {
      if (formError) formError.style.display = 'flex';
    } finally {
      if (submitBtn)  submitBtn.disabled = false;
      if (btnText)    btnText.style.display    = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  });
}


/* ──────────────────────────────────────────────
   7. ANIMACIONES DE ENTRADA (Intersection Observer)
   Las secciones se animan al entrar en el viewport
   Agrega clase "fade-in-up" a los elementos en el CSS
────────────────────────────────────────────── */
const animatedEls = document.querySelectorAll(
  '.nosotros-text, .nosotros-image, .gallery-item, .info-item, .instagram-text, .instagram-feed, .contact-form'
);

if ('IntersectionObserver' in window && animatedEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  animatedEls.forEach((el, i) => {
    el.classList.add('animate-on-scroll');
    // Stagger delay para listas
    if (el.classList.contains('gallery-item') || el.classList.contains('info-item')) {
      el.style.transitionDelay = `${i % 6 * 0.08}s`;
    }
    observer.observe(el);
  });
}


/* ──────────────────────────────────────────────
   8. WHATSAPP BUTTON — ocultar en hero, mostrar luego
────────────────────────────────────────────── */
const waFloat = document.querySelector('.whatsapp-float');
const heroSection = document.querySelector('.hero');

if (waFloat && heroSection) {
  const toggleWa = () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    waFloat.classList.toggle('wa-visible', heroBottom < 0);
  };

  window.addEventListener('scroll', toggleWa, { passive: true });
  toggleWa();
}
