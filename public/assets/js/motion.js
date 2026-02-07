/**
 * InfluencerHub - Premium Motion System
 * GSAP + ScrollTrigger + Lenis
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  // Lenis smooth scroll instance
  let lenis = null;

  /**
   * Initialize Lenis smooth scroll
   */
  function initLenis() {
    if (prefersReducedMotion || !window.Lenis) return;
    
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /**
   * Initialize card tilt effect
   */
  function initTiltCards() {
    if (prefersReducedMotion || isMobile) return;

    document.querySelectorAll('.tilt-card, .influencer-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const rotateX = (0.5 - y) * 10;
        const rotateY = (x - 0.5) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  /**
   * Initialize magnetic buttons
   */
  function initMagneticButtons() {
    if (prefersReducedMotion || isMobile) return;

    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /**
   * Initialize GSAP animations
   */
  function initGSAPAnimations() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTimeline
      .from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.8 })
      .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.4')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-cta', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4');

    // Hero parallax background
    if (!isMobile) {
      gsap.to('.hero-bg-image', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.hero-glow', {
        scale: 1.3,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Chapter/Story sections
    document.querySelectorAll('.story-section').forEach((section, index) => {
      const content = section.querySelector('.chapter-content');
      const visual = section.querySelector('.chapter-visual');
      const listItems = section.querySelectorAll('.chapter-list li');

      if (content) {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      if (visual) {
        gsap.to(visual, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 20%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      if (listItems.length) {
        gsap.from(listItems, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });

    // Horizontal scroll deck
    if (!isMobile) {
      const deckWrap = document.querySelector('.deck-wrap');
      const deckTrack = document.querySelector('.deck-track');
      const deckPanels = document.querySelectorAll('.deck-panel');
      const deckDots = document.querySelectorAll('.deck-dot');

      if (deckTrack && deckPanels.length) {
        const totalWidth = deckPanels.length * 100;
        
        gsap.to(deckTrack, {
          xPercent: -(totalWidth - 100),
          ease: 'none',
          scrollTrigger: {
            trigger: '.deck-section',
            pin: true,
            scrub: 1,
            end: () => `+=${deckPanels.length * 1000}`,
            onUpdate: (self) => {
              const progress = self.progress;
              const activeIndex = Math.min(
                Math.floor(progress * deckPanels.length),
                deckPanels.length - 1
              );
              deckDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
              });
            }
          }
        });

        // Deck card entrance animations
        deckPanels.forEach((panel, i) => {
          const card = panel.querySelector('.deck-card');
          if (card) {
            gsap.from(card, {
              scale: 0.8,
              opacity: 0,
              rotateY: 15,
              duration: 0.8,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: gsap.getById && gsap.getById('deckScroll'),
                start: 'left center',
                toggleActions: 'play none none reverse'
              }
            });
          }
        });
      }
    }

    // Discovery section
    gsap.from('.discovery-header', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.discovery-section',
        start: 'top 70%'
      }
    });

    gsap.from('.discovery-filters', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.discovery-section',
        start: 'top 60%'
      }
    });

    // CTA section cards
    gsap.from('.cta-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%'
      }
    });

    // Generic fade-up elements
    document.querySelectorAll('.fade-up').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  /**
   * Initialize text reveal animations
   */
  function initTextReveal() {
    if (prefersReducedMotion || !window.gsap) return;

    document.querySelectorAll('.reveal-text').forEach((el) => {
      const text = el.textContent;
      el.innerHTML = `<span>${text}</span>`;
      
      gsap.to(el.querySelector('span'), {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      });
    });
  }

  /**
   * Initialize scroll progress indicator
   */
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    });
  }

  /**
   * Initialize all motion effects
   */
  function initMotion() {
    // Initialize in order
    initLenis();
    initTiltCards();
    initMagneticButtons();
    initGSAPAnimations();
    initTextReveal();
    initScrollProgress();

    // Refresh ScrollTrigger after all images load
    window.addEventListener('load', () => {
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion);
  } else {
    initMotion();
  }

  // Expose for external use
  window.IHMotion = {
    initTiltCards,
    initMagneticButtons,
    refresh: () => {
      initTiltCards();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  };
})();
