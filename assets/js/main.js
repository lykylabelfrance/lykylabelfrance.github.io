/* ============================================
   LYKY LABEL FRANCE — Main JavaScript
   Navigation, animations, formulaire
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL EFFECT ----------
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ---------- MOBILE MENU ----------
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');

    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- ACTIVE LINK ON SCROLL ----------
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = navLinks.querySelectorAll('a[href^="#"]');

  function updateActiveLink() {
    const scrollY = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---------- SCROLL REVEAL ANIMATIONS ----------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${index % 3 * 0.1}s`;
    revealObserver.observe(el);
  });

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---------- CONTACT FORM HANDLING ----------
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      // Basic validation
      if (!name || !email || !subject || !message) {
        showNotification('Veuillez remplir tous les champs.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      // Construct mailto link as fallback (since no backend on GitHub Pages)
      const subjectText = document.querySelector(`#subject option[value="${subject}"]`)?.textContent || subject;
      const mailtoBody = `Nom : ${name}%0D%0AEmail : ${email}%0D%0AObjet : ${subjectText}%0D%0A%0D%0AMessage :%0D%0A${encodeURIComponent(message)}`;
      const mailtoLink = `mailto:loic@lykylabel.fr?subject=${encodeURIComponent('Contact via site — ' + subjectText)}&body=${mailtoBody}`;

      window.location.href = mailtoLink;
      showNotification('Votre client email va s\'ouvrir avec le message pré-rempli.', 'success');

      // Reset form
      setTimeout(() => contactForm.reset(), 1000);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" aria-label="Fermer">&times;</button>
    `;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '16px 24px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '.9rem',
      fontWeight: '500',
      zIndex: '9999',
      animation: 'fadeInUp .4s ease-out',
      background: type === 'success' ? '#1a3a1a' : '#3a1a1a',
      color: type === 'success' ? '#4ade80' : '#f87171',
      border: `1px solid ${type === 'success' ? '#2a5a2a' : '#5a2a2a'}`,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)'
    });

    const closeBtn = notification.querySelector('button');
    Object.assign(closeBtn.style, {
      background: 'none',
      border: 'none',
      color: 'inherit',
      fontSize: '1.3rem',
      cursor: 'pointer',
      padding: '0 4px'
    });

    document.body.appendChild(notification);

    // Auto-remove after 5s
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = '.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // ---------- KEYBOARD NAVIGATION ----------
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navToggle.click();
    }
  });

  // ---------- PREFERS REDUCED MOTION ----------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
      el.style.transition = 'none';
    });
  }

});
