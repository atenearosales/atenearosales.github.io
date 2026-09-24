/**
 * ATENEA DIGITAL - Main JavaScript (js/main.js)
 * Premium Agency Website Functionality (Multipágina)
 */

document.addEventListener('DOMContentLoaded', function() {

  // ========================================
  // NAVBAR SCROLL EFFECT
  // ========================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // ========================================
  // FADE-UP ANIMATIONS ON SCROLL
  // ========================================
  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(faq => {
            faq.classList.remove('active');
            const q = faq.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
          });
          if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  // ========================================
  // COOKIE BANNER
  // ========================================
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && cookieAccept) {
    cookieBanner.setAttribute('aria-hidden', 'true');

    function showCookieBanner() {
      let cookiesAccepted = null;
      try {
        cookiesAccepted = localStorage.getItem('ateneaCookiesAcceptedV2');
      } catch (error) {
        // Si el navegador bloquea el almacenamiento, el aviso aún puede usarse.
      }
      if (!cookiesAccepted) {
        cookieBanner.classList.add('show');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }
    }

    cookieAccept.addEventListener('click', () => {
      try {
        localStorage.setItem('ateneaCookiesAcceptedV2', 'true');
      } catch (error) {
        // El aviso se cierra aunque el almacenamiento no esté disponible.
      }
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });

    showCookieBanner();
  }

  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (menuToggle && mobileMenu) {
    function toggleMenu() {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('active', menuOpen);
      menuToggle.setAttribute('aria-expanded', String(menuOpen));
      const spans = menuToggle.querySelectorAll('span');
      if (spans.length === 3) {
        if (menuOpen) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      }
    }

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (menuOpen) toggleMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (menuOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) toggleMenu();
    });
  }

  // ========================================
  // BACK TO TOP BUTTON
  // ========================================
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop);
  }

  // ========================================
  // CONTACT DEMO EXAMPLES
  // ========================================
  const contactDemoData = {
    cielo: {
      nombre: 'Valentina Gómez', email: 'cieloazul@gmail.com', telefono: '+57 300 123 4567',
      proyecto: 'Identidad visual para Cielo Azul', mensaje: 'Hola, queremos renovar nuestro logo y crear una identidad visual moderna para nuestra agencia.'
    },
    vip: {
      nombre: 'Andrés Martínez', email: 'estudiovip@gmail.com', telefono: '+57 301 234 5678',
      proyecto: 'Página web para Estudio VIP', mensaje: 'Hola, nos interesa una página web clara y profesional para presentar nuestros servicios.'
    },
    nova: {
      nombre: 'Sofía Ramírez', email: 'nova@gmail.com', telefono: '+57 302 852 2565',
      proyecto: 'Identidad visual para Agencia Nova', mensaje: 'Hola, queremos crear una identidad visual moderna y memorable para nuestra agencia.'
    },
  };
  document.querySelectorAll('.contact-demo-button').forEach(button => {
    button.addEventListener('click', () => {
      const data = contactDemoData[button.dataset.demoContact];
      if (!data) return;
      Object.entries(data).forEach(([field, value]) => {
        const input = document.getElementById(field);
        if (input) input.value = value;
      });
      document.getElementById('nombre')?.focus();
      showNotification('Ejemplo cargado. Puedes editarlo y enviarlo.', 'success');
    });
  });

  // ========================================
  // CONTACT FORM HANDLING
  // ========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      if (!data.nombre || !data.email || !data.mensaje) {
        showNotification('Por favor completa todos los campos obligatorios.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Por favor ingresa un correo electrónico válido.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // ========================================
  // NOTIFICATION SYSTEM
  // ========================================
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.atenea-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `atenea-notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" aria-label="Cerrar notificación">&times;</button>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      background: ${type === 'success' ? '#C9A227' : '#e74c3c'};
      color: #fff;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      animation: slideInRight 0.4s ease;
    `;

    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: #fff;
      font-size: 1.4rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
      }
    }, 5000);
  }

  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(notificationStyles);

  // ========================================
  // PORTFOLIO FILTERS
  // ========================================
  const portfolioFilters = document.querySelectorAll('.portfolio-filter');
  if (portfolioFilters.length > 0) {
    const portfolioCards = document.querySelectorAll('.masonry-item[data-category]');
    portfolioFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.dataset.filter;
        portfolioFilters.forEach(button => button.classList.remove('active'));
        filter.classList.add('active');
        portfolioCards.forEach(card => {
          card.classList.toggle('is-hidden', category !== 'all' && card.dataset.category !== category);
        });
      });
    });
  }

  // ========================================
  // PORTFOLIO ITEM CLICK (Lightbox placeholder)
  // ========================================
  const portfolioItems = document.querySelectorAll('.masonry-item');
  if (portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('.masonry-overlay h4')?.textContent || 'Proyecto';
        const category = item.querySelector('.masonry-overlay span')?.textContent || '';
        showNotification(`Proyecto: ${title} - ${category}. Próximamente galería ampliada.`, 'success');
      });
    });
  }

  // ========================================
  // PARALLAX EFFECT FOR HERO DECORATIONS
  // ========================================
  const hero = document.querySelector('.hero');
  if (hero && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const mockup = hero.querySelector('.mockup-screen');
      if (mockup) {
        mockup.style.transform = `perspective(1000px) rotateY(${-8 + x * 0.1}deg) rotateX(${4 + y * 0.1}deg)`;
      }
    });
  }

});
