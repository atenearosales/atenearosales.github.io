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
  // PRIVACY NOTICE
  // ========================================
  const privacyBanner = document.getElementById('privacyBanner');
  const privacyAccept = document.getElementById('privacyAccept');

  if (privacyBanner && privacyAccept) {
    privacyBanner.setAttribute('aria-hidden', 'true');

    function showPrivacyNotice() {
      privacyBanner.classList.add('show');
      privacyBanner.setAttribute('aria-hidden', 'false');
    }

    const closePrivacyNotice = () => {
      privacyBanner.classList.remove('show');
      privacyBanner.setAttribute('aria-hidden', 'true');
    };
    privacyAccept.addEventListener('click', closePrivacyNotice);
    showPrivacyNotice();
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
    const portfolioCards = document.querySelectorAll('.portfolio-card[data-category], .masonry-item[data-category]');
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

/* ========================================
   CAMBIO DE IDIOMA ES / EN
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
  const languagePairs = {
    'Inicio': 'Home', 'Nosotros': 'About us', 'Servicios': 'Services', 'Portafolio': 'Portfolio', 'Contáctanos': 'Contact', 'Iniciar Sesión': 'Sign in',
    'Creatividad con propósito': 'Creativity with purpose', 'Mejorar mi marca': 'Improve my brand', 'Ver proyectos': 'View projects', 'Conocer nuestra historia →': 'Discover our story →',
    'Diseñamos marcas que conectan, inspiran y dejan huella.': 'We design brands that connect, inspire and leave a mark.',
    'En Atenea Digital transformamos ideas en experiencias visuales claras, elegantes y memorables. Escuchamos lo que hace especial a cada negocio y lo convertimos en una imagen que comunica su verdadero valor.': 'At Atenea Digital, we transform ideas into clear, elegant and memorable visual experiences. We listen to what makes each business special and turn it into an image that communicates its true value.',
    'Haz que tu negocio brille con una imagen tan profesional como lo que haces. Creamos logos, páginas web e identidades visuales que cuentan tu historia.': 'Make your business shine with an image as professional as the work you do. We create logos, websites and visual identities that tell your story.',
    'Una agencia que diseña desde lo humano.': 'An agency that designs from a human perspective.',
    'Nuestra esencia': 'Our essence', 'Nuestros valores': 'Our values', 'Claridad': 'Clarity', 'Confianza': 'Confidence', 'Coherencia': 'Consistency', 'Creatividad': 'Creativity', 'Escucha': 'Listening', 'Autenticidad': 'Authenticity', 'Compromiso': 'Commitment', 'Transparencia': 'Transparency',
    'Hacer visible el valor de cada idea.': 'Make the value of every idea visible.',
    'Brindar soluciones creativas en diseño gráfico y multimedia, trabajando de manera responsable e innovadora y creando contenido visual moderno y atractivo.': 'Provide creative graphic design and multimedia solutions, working responsibly and innovatively while creating modern and attractive visual content.',
    'Ser una aliada creativa para marcas con futuro.': 'Be a creative ally for brands with a future.',
    'Para el año 2030, Atenea Digital será reconocida en Cali y a nivel nacional por la creatividad y el profesionalismo de sus logos y páginas web.': 'By 2030, Atenea Digital will be recognized in Cali and nationally for the creativity and professionalism of its logos and websites.',
    'La solución para tu siguiente paso': 'The solution for your next step', 'Haz que tu marca refleje todo lo que vale': 'Make your brand reflect everything it is worth', 'Diseño pensado para comunicar, conectar y hacer avanzar tu negocio.': 'Design made to communicate, connect and move your business forward.',
    'Diseño de Logos': 'Logo Design', 'Páginas Web': 'Websites', 'Identidad Visual': 'Visual Identity', 'Tu marca, pensada para conectar.': 'Your brand, designed to connect.', 'Diseñamos soluciones que hacen la diferencia.': 'We design solutions that make a difference.',
    '¿Hablamos?': 'Shall we talk?', 'Volver al inicio': 'Back to home', 'Explorar Atenea Digital': 'Explore Atenea Digital', 'Cuenta de cliente': 'Client account', 'Bienvenido de vuelta': 'Welcome back', 'Iniciar sesión': 'Sign in', 'Crear mi cuenta': 'Create my account',

    'Conoce Atenea Digital': 'Discover Atenea Digital', 'Quiero verme más profesional →': 'I want to look more professional →', 'Necesito una web clara →': 'I need a clear website →', 'Tengo una idea y quiero empezar →': 'I have an idea and want to start →',
    'Diseño que deja huella': 'Design that leaves a mark', 'Ideas con intención.': 'Ideas with intention.', 'Marcas con presencia.': 'Brands with presence.', 'Construimos identidades visuales y experiencias digitales que hacen que tu negocio se vea tan profesional como realmente es.': 'We build visual identities and digital experiences that make your business look as professional as it truly is.', 'Conoce nuestros servicios →': 'Explore our services →',
    'Creemos juntos': 'Let’s create together', 'Tu negocio ya tiene valor.': 'Your business already has value.', 'Ahora haz que se note.': 'Now make it visible.', 'Hablemos de tu proyecto': 'Let’s talk about your project', 'Conoce nuestra historia →': 'Discover our story →', 'Conoce a la creadora': 'Meet the creator', 'Conocer mi proyecto': 'Tell me about my project',
    'Tu marca, pensada para conectar.': 'Your brand, designed to connect.', 'Elige el punto de partida de tu proyecto. Cada servicio está pensado para resolver una necesidad real y ayudarte a comunicar con seguridad.': 'Choose the starting point for your project. Each service is designed to solve a real need and help you communicate with confidence.', 'Tu negocio, listo para destacar.': 'Your business, ready to stand out.', 'Diseño de logos': 'Logo design', 'Páginas web': 'Websites', 'Identidad visual': 'Visual identity', 'Diseño para redes': 'Social media design', 'Concepto y bocetos': 'Concept and sketches', 'Variaciones para diferentes usos': 'Variations for different uses', 'Entrega lista para redes y web': 'Ready for social media and web', 'Diseño adaptable a celular': 'Mobile-friendly design', 'Secciones claras y llamadas a la acción': 'Clear sections and calls to action', 'Experiencia visual coherente': 'Consistent visual experience', 'Paleta y tipografías': 'Color palette and typography', 'Aplicaciones para papelería y redes': 'Applications for stationery and social media', 'Guía para comunicar sin improvisar': 'A guide to communicate consistently', 'Plantillas para publicaciones': 'Post templates', 'Historias y piezas promocionales': 'Stories and promotional pieces', 'Contenido visual coherente': 'Consistent visual content',
    'Marcas que decidieron dar el siguiente paso': 'Brands that decided to take the next step', 'La confianza también se diseña': 'Trust is designed too', 'Negocio local': 'Local business', 'Marca personal': 'Personal brand', 'Tu historia merece una imagen a la altura.': 'Your story deserves an image that matches its value.',
    'Creatividad con propósito': 'Creativity with purpose', 'Diseñamos marcas que conectan, inspiran y dejan huella.': 'We design brands that connect, inspire and leave a mark.', 'Una esencia que se reconoce': 'An essence people recognize', 'Diseñamos identidades visuales que expresan quién eres y hacen que tu marca permanezca en la mente.': 'We design visual identities that express who you are and keep your brand memorable.', 'Una experiencia que guía': 'An experience that guides', 'Construimos páginas claras y responsivas que acompañan al usuario hasta el siguiente paso.': 'We build clear, responsive websites that guide users to the next step.', 'Coherencia que inspira': 'Consistency that inspires', 'Ordenamos cada detalle para que tu negocio transmita confianza en redes, web y cada contacto.': 'We organize every detail so your business communicates trust across social media, web and every interaction.', 'Las mejores ideas nacen cuando estrategia, creatividad y propósito trabajan juntos.': 'The best ideas are born when strategy, creativity and purpose work together.', 'Escuchamos': 'We listen', 'Diseñamos': 'We design', 'Conectamos': 'We connect',
    'Conoce a la gerente': 'Meet the manager', 'Detrás de cada idea, hay una historia.': 'Behind every idea, there is a story.', 'Soy Sury Rosales, gerente y creadora de Atenea Digital. Esta agencia nace de mi gusto por el diseño, la creatividad y las nuevas ideas, pero también de mi deseo de ayudar a que cada negocio encuentre una imagen que lo represente.': 'I am Sury Rosales, manager and creator of Atenea Digital. This agency was born from my love of design, creativity and new ideas, as well as my desire to help every business find an image that represents it.', 'En cada proyecto trabajo con dedicación para crear diseños claros, bonitos y pensados para conectar con las personas. Mi propósito es acompañarte con responsabilidad, cercanía y una mirada creativa.': 'In every project, I work with dedication to create clear, beautiful designs made to connect with people. My purpose is to guide you with responsibility, closeness and a creative perspective.', 'Lo que nos mueve': 'What moves us', 'Una agencia que escucha,': 'An agency that listens,', 'ordena y crea contigo.': 'organizes and creates with you.', 'En Atenea Digital no empezamos por una plantilla: empezamos por entender tu historia, tus metas y lo que quieres hacer sentir.': 'At Atenea Digital, we do not start with a template: we start by understanding your story, your goals and what you want people to feel.', 'Escuchamos tu esencia': 'We listen to your essence', 'Conocemos tu negocio antes de convertirlo en una imagen.': 'We get to know your business before turning it into an image.', 'Diseñamos con intención': 'We design with intention', 'Cada color, palabra e imagen tiene una razón.': 'Every color, word and image has a reason.', 'Nuestra historia': 'Our story', 'Una agencia que diseña desde lo humano.': 'An agency that designs from a human perspective.', 'Atenea Digital es una agencia creativa creada por': 'Atenea Digital is a creative agency created by', 'Nació de la unión entre el gusto por el diseño, la creatividad y el deseo de acompañar a quienes tienen una buena idea, pero necesitan comunicarla mejor.': 'It was born from a love of design, creativity and the desire to support people who have a good idea but need to communicate it better.', 'Hacer visible el valor de cada idea.': 'Make the value of every idea visible.', 'Ser una aliada creativa para marcas con futuro.': 'Be a creative ally for brands with a future.', 'Para el año 2030, Atenea Digital será reconocida en Cali y a nivel nacional por la creatividad y el profesionalismo de sus logos y páginas web.': 'By 2030, Atenea Digital will be recognized in Cali and nationally for the creativity and professionalism of its logos and websites.',

    'Utilizamos nuestro aviso de privacidad para mejorar tu experiencia. Al continuar navegando, aceptas nuestro ': 'We use privacy notice to improve your experience. By continuing to browse, you accept our ', 'Todos los derechos reservados.': 'All rights reserved.',
    '01 · Identidad': '01 · Identity', '02 · Experiencia': '02 · Experience', '03 · Presencia': '03 · Presence', '04 · Comunicación': '04 · Communication', 'Construimos un símbolo que sintetiza tu esencia, se reconoce con facilidad y funciona igual de bien en una tarjeta, una red social o una página web.': 'We build a symbol that captures your essence, is easy to recognize and works equally well on a card, social network or website.', 'Organizamos tu información para que tus visitantes entiendan lo que haces, confíen en ti y sepan cuál es el siguiente paso.': 'We organize your information so visitors understand what you do, trust you and know the next step.', 'Unimos colores, tipografías, estilo fotográfico y piezas de comunicación para que tu marca sea consistente y memorable.': 'We combine colors, typography, photography and communication pieces so your brand is consistent and memorable.', 'Creamos piezas que detienen el scroll, mantienen una estética coherente y ayudan a que tu comunidad recuerde tu marca.': 'We create pieces that stop the scroll, keep a consistent aesthetic and help your community remember your brand.', 'Atenea Digital transformó completamente la imagen de mi empresa. El logo es exactamente lo que soñé: elegante, moderno y memorable. Mi página web recibe elogios todos los días.': 'Atenea Digital completely transformed my company’s image. The logo is exactly what I dreamed of: elegant, modern and memorable. My website receives praise every day.', 'Profesionalismo en cada detalle. Desde la primera reunión supe que estaba en buenas manos. Mi marca ahora tiene una identidad visual que transmite confianza y calidad.': 'Professionalism in every detail. From the first meeting I knew I was in good hands. My brand now has a visual identity that communicates trust and quality.', 'El equipo de Atenea Digital entendió mi visión a la perfección. Mi página web no solo se ve increíble, sino que también genera más leads que nunca. ¡Totalmente recomendados!': 'The Atenea Digital team understood my vision perfectly. My website not only looks incredible, it also generates more leads than ever. Highly recommended!', 'Emprendimiento': 'Entrepreneurship', 'Cali, Colombia': 'Cali, Colombia', 'Utilizamos nuestra Política de Privacidad y nuestros Términos y Condiciones para ofrecerte una experiencia más segura y transparente.': 'We use privacy notice to improve your experience. By continuing to browse, you accept our Privacy Policy.', 'Aceptar': 'Accept', 'Política de Privacidad': 'Privacy Policy', 'Tu navegador no admite videos HTML5.': 'Your browser does not support HTML5 video.', 'Diseño de Logo': 'Logo Design', 'Diseño Web': 'Web Design', 'Conoce Atenea Digital': 'Discover Atenea Digital', 'Correo electrónico': 'Email address', 'Contraseña': 'Password', 'Recordarme en este dispositivo': 'Remember me on this device', '¿Aún no tienes una cuenta?': 'Do you not have an account yet?', 'Regístrate aquí': 'Register here', 'Ejemplo para la sustentación': 'Example for the presentation', 'Verificación: ¿cuánto es': 'Verification: how much is', 'Cambiar': 'Change', 'Respuesta': 'Answer', 'Crear una cuenta': 'Create an account', 'Nombre completo': 'Full name', 'Confirmar contraseña': 'Confirm password', 'Registrarme': 'Register', 'Ya tengo una cuenta': 'I already have an account'
  };
  Object.assign(languagePairs, {
    'En Atenea Digital descubrimos lo que hace única a cada idea y la convertimos en una identidad con propósito. Unimos creatividad, estrategia y diseño para proyectar todo su valor.': 'At Atenea Digital, we discover what makes every idea unique and turn it into an identity with purpose. We unite creativity, strategy and design to bring its full value to life.',
    'Video promocional de Atenea Digital': 'Atenea Digital promotional video',
    'La mirada detrás de Atenea Digital.':'The vision behind Atenea Digital.', 'Mi propósito es acompañar a emprendimientos, negocios y marcas personales para que encuentren una imagen clara, profesional y fiel a lo que son.':'My purpose is to support businesses, ventures and personal brands in finding a clear, professional image that reflects who they are.', 'Creo en el diseño como una forma de escuchar, ordenar ideas y construir confianza. Por eso cada proyecto nace de una conversación y termina en una experiencia visual que puede crecer contigo.':'I believe design is a way to listen, organize ideas and build trust. That is why every project begins with a conversation and ends in a visual experience that can grow with you.', 'El origen de nuestro nombre':'The origin of our name', 'Inspirada en Atenea, la diosa de la sabiduría y la estrategia.':'Inspired by Athena, goddess of wisdom and strategy.', 'Atenea es una figura de la mitología griega asociada con la sabiduría, la inteligencia, las artes, la justicia y la estrategia. Elegimos su nombre porque representa la manera en que entendemos el diseño: no como decoración, sino como una herramienta para pensar, comunicar y avanzar.':'Athena is a figure from Greek mythology associated with wisdom, intelligence, the arts, justice and strategy. We chose her name because it represents how we understand design: not as decoration, but as a tool to think, communicate and move forward.', 'Su casco simboliza visión y protección; la lanza, decisión para defender una idea; y el olivo, paz, crecimiento y prosperidad. En Atenea Digital convertimos esos símbolos en una promesa: crear con inteligencia, actuar con propósito y ayudar a que cada marca encuentre su propia voz.':'Her helmet symbolizes vision and protection; her spear, the decision to defend an idea; and the olive tree, peace, growth and prosperity. At Atenea Digital, we turn those symbols into a promise: create intelligently, act with purpose and help every brand find its own voice.', 'Sabiduría · estrategia · creatividad':'Wisdom · strategy · creativity', 'Lo que comunica nuestra imagen':'What our image communicates', 'Una identidad pensada con intención.':'An identity designed with intention.', 'Colores':'Colors', 'El dorado representa la luz de las ideas, el valor y la confianza. El negro comunica elegancia, fuerza y profesionalismo. El blanco aporta claridad, equilibrio y espacio para que cada mensaje respire.':'Gold represents the light of ideas, courage and trust. Black communicates elegance, strength and professionalism. White brings clarity, balance and space for every message to breathe.', 'Tipografía':'Typography', 'La combinación entre una serif elegante y una sans serif limpia une lo clásico con lo contemporáneo: historia y futuro, sensibilidad y precisión, personalidad y fácil lectura.':'The combination of an elegant serif and a clean sans serif unites classic and contemporary: history and future, sensitivity and precision, personality and readability.', 'El perfil de Atenea une inteligencia, protección y visión. Es un símbolo memorable que acompaña a marcas que quieren crecer sin perder su esencia.':'Athena’s profile brings together intelligence, protection and vision. It is a memorable symbol for brands that want to grow without losing their essence.', 'Nuestro propósito':'Our purpose', 'Atenea Digital existe para que las buenas ideas no se queden sin voz. Creamos soluciones gráficas y multimedia que ayudan a comunicar con seguridad, conectar con las personas y abrir nuevas oportunidades.':'Atenea Digital exists so good ideas are never left without a voice. We create graphic and multimedia solutions that help communicate with confidence, connect with people and open new opportunities.', 'Trabajamos con responsabilidad, innovación y cercanía para que cada marca tenga una presencia visual coherente y memorable.':'We work with responsibility, innovation and closeness so every brand has a consistent and memorable visual presence.', 'Crear con responsabilidad.':'Create responsibly.', 'Crecer con reconocimiento.':'Grow with recognition.', 'Conoce una agencia que diseña con propósito.':'Meet an agency that designs with purpose.', 'Hablemos de tu proyecto':'Let’s talk about your project', '05 · Estrategia':'05 · Strategy', 'Asesoría de marca':'Brand consulting', 'Te ayudamos a ordenar tus ideas, definir una dirección visual y tomar decisiones para que tu comunicación sea más clara.':'We help you organize your ideas, define a visual direction and make decisions so your communication is clearer.', 'Diagnóstico de tu marca':'Brand diagnosis', 'Ruta visual y de contenidos':'Visual and content roadmap', 'Recomendaciones prácticas':'Practical recommendations', '06 · Multimedia':'06 · Multimedia', 'Contenido multimedia':'Multimedia content', 'Diseñamos piezas visuales para presentar, promocionar y contar tu proyecto de una forma atractiva y fácil de recordar.':'We design visual pieces to present, promote and tell your project in an attractive and memorable way.', 'Presentaciones y campañas':'Presentations and campaigns', 'Piezas para lanzamientos':'Launch materials', 'Adaptaciones para diferentes formatos':'Adaptations for different formats', 'Acceso rápido':'Quick access', 'Usa los datos predeterminados o crea tu propia cuenta para comenzar.':'Use the preset details or create your own account to begin.', 'Prueba rápida con un ejemplo':'Quick example', 'Ver ejemplo':'View example', 'Ideas para comenzar':'Ideas to get started'
  });
  const reversePairs = Object.fromEntries(Object.entries(languagePairs).map(([es,en])=>[en,es]));
  const buttons = document.querySelectorAll('.language-toggle');
  if (!buttons.length) return;
  let current = localStorage.getItem('ateneaLanguage') || 'es';
  function translate(to) {
    const dictionary = to === 'en' ? languagePairs : reversePairs;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.nodeValue.trim()) return;
      Object.entries(dictionary).forEach(([from, toText]) => {
        if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.split(from).join(toText);
      });
    });
    document.querySelectorAll('[alt],[aria-label],[title],[placeholder]').forEach(element => {
      ['alt','aria-label','title','placeholder'].forEach(attribute => {
        const value = element.getAttribute(attribute);
        if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value]);
      });
    });
    document.documentElement.lang = to;
    buttons.forEach(button => { button.textContent = to === 'en' ? 'ES' : 'EN'; button.setAttribute('aria-pressed', String(to === 'en')); button.setAttribute('aria-label', to === 'en' ? 'Cambiar a español' : 'Cambiar a inglés'); });
    localStorage.setItem('ateneaLanguage', to);
    current = to;
  }
  buttons.forEach(button => button.addEventListener('click', () => translate(current === 'es' ? 'en' : 'es')));
  if (current === 'en') translate('en');
});

// Ventanas de información legal del pie de página
document.addEventListener('DOMContentLoaded', function() {
  const legalLinks = document.querySelectorAll('[data-legal-modal]');
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };
  legalLinks.forEach(link => link.addEventListener('click', (event) => {
    event.preventDefault();
    const modal = document.getElementById(link.dataset.legalModal);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.legal-modal-close')?.focus();
  }));
  document.querySelectorAll('.legal-modal').forEach(modal => {
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); });
    modal.querySelector('[data-close-legal]')?.addEventListener('click', () => closeModal(modal));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('.legal-modal.is-open').forEach(closeModal);
  });
});
