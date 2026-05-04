// gsap-animations.js — Animações premium GSAP para a página inicial
(function () {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Animação da hero ao carregar ─────────────────────────────────────
    gsap.set('.hero-text h1',     { y: 70,  opacity: 0 });
    gsap.set('.hero-text > p',    { y: 45,  opacity: 0 });
    gsap.set('.hero-benefits li', { y: 30,  opacity: 0 });
    gsap.set('.hero-form-card',   { x: 90,  opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.hero-text h1', { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out' }, 0.1)
        .to('.hero-text > p', { y: 0, opacity: 1, duration: 0.65 }, '-=0.55')
        .to('.hero-benefits li', { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.45')
        .to('.hero-form-card', { x: 0, opacity: 1, duration: 0.9 }, '-=0.65');

    // ── ScrollTriggers ───────────────────────────────────────────────────
    gsap.utils.toArray('.section-header').forEach(function (el) {
        gsap.from(el, {
            y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
    });

    gsap.from('.service-card', {
        y: 60, opacity: 0, duration: 0.6, stagger: 0.08,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.services-grid', start: 'top 92%', toggleActions: 'play none none none' }
    });

    gsap.utils.toArray('.service-card').forEach(function (card, i) {
        var iconBox = card.querySelector('.icon-box');
        if (!iconBox) return;
        gsap.from(iconBox, {
            scale: 0.4, opacity: 0, duration: 0.45,
            ease: 'back.out(1.7)', delay: i * 0.08 + 0.2, clearProps: 'all',
            scrollTrigger: { trigger: '.services-grid', start: 'top 92%', toggleActions: 'play none none none' }
        });
    });

    gsap.from('.why-text', {
        x: -65, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.why-us-content', start: 'top 85%', toggleActions: 'play none none none' }
    });
    gsap.from('.why-image', {
        x: 65, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.why-us-content', start: 'top 85%', toggleActions: 'play none none none' }
    });

    gsap.from('.feature', {
        x: -45, opacity: 0, duration: 0.6, stagger: 0.18,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.features-list', start: 'top 88%', toggleActions: 'play none none none' }
    });

    gsap.from('#cta-container > *', {
        y: 35, opacity: 0, duration: 0.7, stagger: 0.15,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.cta-section', start: 'top 88%', toggleActions: 'play none none none' }
    });

    gsap.from('.footer-col', {
        y: 35, opacity: 0, duration: 0.6, stagger: 0.15,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: 'footer', start: 'top 95%', toggleActions: 'play none none none' }
    });

    gsap.to('.hero-bg-overlay', {
        yPercent: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

})();
