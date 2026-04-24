// gsap-animations.js — Animações premium GSAP para a página inicial
(function () {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── ScrollTriggers registrados IMEDIATAMENTE ─────────────────────────
    // Cabeçalho das seções
    gsap.utils.toArray('.section-header').forEach(function (el) {
        gsap.from(el, {
            y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        });
    });

    // Cards de serviços — entrada em cascata
    gsap.from('.service-card', {
        y: 60, opacity: 0, duration: 0.6, stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 92%',
            toggleActions: 'play none none none'
        }
    });

    // Ícone de cada card
    gsap.utils.toArray('.service-card').forEach(function (card, i) {
        var iconBox = card.querySelector('.icon-box');
        if (!iconBox) return;
        gsap.from(iconBox, {
            scale: 0.4, opacity: 0, duration: 0.45,
            ease: 'back.out(1.7)',
            delay: i * 0.08 + 0.2,
            clearProps: 'all',
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 92%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Seção "Por que nos escolher"
    gsap.from('.why-text', {
        x: -65, opacity: 0, duration: 0.85, ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: '.why-us-content', start: 'top 85%', toggleActions: 'play none none none' }
    });
    gsap.from('.why-image', {
        x: 65, opacity: 0, duration: 0.85, ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: '.why-us-content', start: 'top 85%', toggleActions: 'play none none none' }
    });

    // Features individuais
    gsap.from('.feature', {
        x: -45, opacity: 0, duration: 0.6, stagger: 0.18,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.features-list', start: 'top 88%', toggleActions: 'play none none none' }
    });

    // CTA Section
    gsap.from('#cta-container > *', {
        y: 35, opacity: 0, duration: 0.7, stagger: 0.15,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: '.cta-section', start: 'top 88%', toggleActions: 'play none none none' }
    });

    // Footer colunas
    gsap.from('.footer-col', {
        y: 35, opacity: 0, duration: 0.6, stagger: 0.15,
        ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: 'footer', start: 'top 95%', toggleActions: 'play none none none' }
    });

    // Parallax no overlay da hero
    gsap.to('.hero-bg-overlay', {
        yPercent: 30, ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // ── Estado inicial dos elementos da hero ─────────────────────────────
    gsap.set('.hero-text h1',     { y: 70,  opacity: 0 });
    gsap.set('.hero-text > p',    { y: 45,  opacity: 0 });
    gsap.set('.hero-benefits li', { y: 30,  opacity: 0 });
    gsap.set('.hero-form-card',   { x: 90,  opacity: 0 });

    // ── Timeline: loader → hero ───────────────────────────────────────────
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
        .from('.loader-icon-wrap', {
            scale: 0, rotation: -200, opacity: 0,
            duration: 0.75, ease: 'back.out(1.7)'
        })
        .from('.loader-brand', {
            y: 22, opacity: 0, duration: 0.5
        }, '-=0.15')
        .from('.loader-bar-track', {
            scaleX: 0, opacity: 0, duration: 0.3, ease: 'power2.out'
        }, '+=0.05')
        .to('.loader-bar-fill', {
            scaleX: 1, duration: 1.0, ease: 'power2.inOut',
            transformOrigin: 'left center'
        })
        .to('#page-loader', {
            yPercent: -100, duration: 0.75, ease: 'power3.inOut'
        }, '+=0.1')
        .add(function () {
            var loader = document.getElementById('page-loader');
            if (loader) { loader.style.display = 'none'; }
            ScrollTrigger.refresh();
        })
        .to('.hero-text h1', {
            y: 0, opacity: 1, duration: 0.85, ease: 'power4.out'
        }, '-=0.4')
        .to('.hero-text > p', {
            y: 0, opacity: 1, duration: 0.65
        }, '-=0.6')
        .to('.hero-benefits li', {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1
        }, '-=0.5')
        .to('.hero-form-card', {
            x: 0, opacity: 1, duration: 0.9
        }, '-=0.75');

})();
