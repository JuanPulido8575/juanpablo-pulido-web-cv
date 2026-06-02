/* ============================================
   PORTFOLIO DATA SCIENTIST - MAIN JS
   Animaciones, filtros, interacciones
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. LOADING SCREEN
     ========================================== */
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1400);
  }

  /* ==========================================
     2. TYPING EFFECT
     ========================================== */
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const roles = [
      'Data Scientist',
      'Data Analyst',
      'BI Developer',
      'Data Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    let cursor = document.querySelector('.typing-cursor');

    function typeEffect() {
      const currentRole = roles[roleIndex];
      
      if (!isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentRole.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            typeEffect();
          }, 2000);
          return;
        }
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeEffect, 500);
          return;
        }
      }

      const speed = isDeleting ? 40 : 80;
      setTimeout(typeEffect, speed);
    }

    setTimeout(typeEffect, 1600);
  }

  /* ==========================================
     3. SCROLL ANIMATIONS (IntersectionObserver)
     ========================================== */
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .stagger-children');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  /* ==========================================
     4. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================
     5. NAVIGATION HIDE/SHOW ON SCROLL
     ========================================== */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ==========================================
     6. MOBILE MENU TOGGLE
     ========================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ==========================================
     7. PORTFOLIO FILTERS
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bentoCards = document.querySelectorAll('.bento-card');

  if (filterBtns.length > 0 && bentoCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Filter cards with animation
        bentoCards.forEach(card => {
          const cardTags = card.getAttribute('data-tags') || '';
          
          if (filter === 'all' || cardTags.includes(filter)) {
            card.classList.remove('hidden');
            // Re-trigger animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  /* ==========================================
     8. PARALLAX IN HERO (subtle)
     ========================================== */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  /* ==========================================
     9. LAZY LOADING FOR IMAGES
     ========================================== */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported - set attribute on images
    lazyImages.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Fallback: use IntersectionObserver for older browsers
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* ==========================================
     10. BENTO CARD IMAGE PLACEHOLDER STYLING
     ========================================== */
  document.querySelectorAll('.bento-card-image img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const placeholder = this.parentElement.querySelector('.placeholder-img');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    });
  });

  /* ==========================================
     11. TECH ICON FALLBACK
     ========================================== */
  document.querySelectorAll('.tech-chip img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const fallback = this.parentElement.querySelector('.tech-chip-fallback');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    });
  });

  /* ==========================================
     12. CASE STUDY: BACK TO PORTFOLIO
     ========================================== */
  // Add project navigation buttons to case study pages
  const projectIds = ['atpe-report', 'analisis-intencion-voto', 'reporte-seguimiento-cartera', 'prototipo-arquitectura-lakehouse'];
  
  projectIds.forEach((id, index) => {
    const prevProject = index > 0 ? projectIds[index - 1] : null;
    const nextProject = index < projectIds.length - 1 ? projectIds[index + 1] : null;
    
    // This would be more dynamic if needed
  });

  /* ==========================================
     13. COUNTER ANIMATION FOR STATS
     ========================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetValue = parseInt(target.getAttribute('data-target') || target.textContent.replace(/[^0-9]/g, ''));
          const duration = 1500;
          const startTime = performance.now();
          
          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const currentValue = Math.floor(eased * targetValue);
            
            target.textContent = currentValue + '+';
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = targetValue + '+';
            }
          }
          
          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  /* ==========================================
     14. PRELOAD IMAGES ON PAGE LOAD
     ========================================== */
  window.addEventListener('load', () => {
    // Any post-load tasks can go here
    document.body.classList.add('loaded');
  });

});
