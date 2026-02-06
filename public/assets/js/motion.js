(function () {
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = 'rotateX(0) rotateY(0)'; });
    });
  }

  function initMotion() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !window.gsap || !window.ScrollTrigger) return initTilt();

    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis && window.innerWidth > 768) {
      const lenis = new Lenis({ smoothWheel: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    gsap.from('.hero-copy > *', { y: 40, opacity: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out' });
    gsap.to('.hero-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: true } });

    document.querySelectorAll('.chapter').forEach((chapter) => {
      gsap.to(chapter, {
        opacity: 1,
        scale: 1,
        scrollTrigger: { trigger: chapter, start: 'top center', end: 'bottom center', scrub: true }
      });
      gsap.from(chapter.querySelectorAll('li'), { y: 18, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: chapter, start: 'top 70%' } });
    });

    if (window.innerWidth > 768) {
      const track = document.querySelector('.deck-track');
      if (track) {
        gsap.to(track, {
          xPercent: -75,
          ease: 'none',
          scrollTrigger: { trigger: '.deck-wrap', pin: true, scrub: true, end: '+=2500' }
        });
      }
    }

    initTilt();
  }

  window.addEventListener('DOMContentLoaded', initMotion);
})();
