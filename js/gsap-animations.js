// gsap-animations.js — Animações premium GSAP para a página inicial
(function () {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Estado inicial (antes do primeiro frame) ─────────────────────────
    gsap.set('.top-bar',          { y: -40, opacity: 0 });
    gsap.set('.main-header',      { y: -20, opacity: 0 });
    gsap.set('.hero-text h1',     { y: 70,  opacity: 0 });
    gsap.set('.hero-text > p',    { y: 45,  opacity: 0 });
    gsap.set('.hero-benefits li', { y: 30,  opacity: 0 });
    gsap.set('.hero-form-card',   { x: 90,  opacity: 0 });

    // ── Timeline principal (loader → hero) ───────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
        // Loader: ícone gira para dentro
        .from('.loader-icon-wrap', {
            scale: 0, rotation: -200, opacity: 0,
            duration: 0.75, ease: 'back.out(1.7)'
        })
        // Nome da empresa aparece
        .from('.loader-brand', {
            y: 22, opacity: 0, duration: 0.5
        }, '-=0.15')
        // Barra de progresso aparece e preenche
        .from('.loader-bar-track', {
            scaleX: 0, opacity: 0, duration: 0.3, ease: 'power2.out'
        }, '+=0.05')
        .to('.loader-bar-fill', {
            scaleX: 1, duration: 1.0, ease: 'power2.inOut',
            transformOrigin: 'left center'
        })
        // Top-bar e header entram enquanto loader ainda está visível
        .to('.top-bar',     { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .to('.main-header', { y: 0, opacity: 1, duration: 0.5 }, '-=0.38')
        // Loader desliza para cima, revelando a hero
        .to('#page-loader', {
            yPercent: -100, duration: 0.75, ease: 'power3.inOut'
        }, '+=0.1')
        // Animação da hero
        .to('.hero-text h1', {
            y: 0, opacity: 1, duration: 0.85, ease: 'power4.out'
        }, '-=0.45')
        .to('.hero-text > p', {
            y: 0, opacity: 1, duration: 0.65
        }, '-=0.6')
        .to('.hero-benefits li', {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.1
        }, '-=0.5')
        .to('.hero-form-card', {
            x: 0, opacity: 1, duration: 0.9
        }, '-=0.75')
        // Quando tudo acabar: inicializar ScrollTriggers e ocultar loader
        .add(function () {
            var loader = document.getElementById('page-loader');
            if (loader) loader.style.display = 'none';
            initScrollAnimations();
        });

    // ── Animações de scroll ──────────────────────────────────────────────
    function initScrollAnimations() {

        // Cabeçalho das seções
        gsap.utils.toArray('.section-header').forEach(function (el) {
            gsap.from(el, {
                y: 50, opacity: 0, duration: 0.8,
                scrollTrigger: { trigger: el, start: 'top 87%', once: true }
            });
        });

        // Cards de serviços — entrada em cascata
        gsap.from('.service-card', {
            y: 80, opacity: 0, duration: 0.65, stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true }
        });

        // Ícone do card escala levemente ao entrar
        gsap.utils.toArray('.service-card').forEach(function (card, i) {
            gsap.from(card.querySelector('.icon-box'), {
                scale: 0.5, opacity: 0, duration: 0.5, delay: i * 0.09 + 0.25,
                ease: 'back.out(1.7)',
                scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true }
            });
        });

        // Seção "Por que nos escolher" — texto da esquerda, mapa da direita
        gsap.from('.why-text', {
            x: -65, opacity: 0, duration: 0.85,
            scrollTrigger: { trigger: '.why-us-content', start: 'top 78%', once: true }
        });
        gsap.from('.why-image', {
            x: 65, opacity: 0, duration: 0.85,
            scrollTrigger: { trigger: '.why-us-content', start: 'top 78%', once: true }
        });

        // Features individuais
        gsap.from('.feature', {
            x: -45, opacity: 0, duration: 0.6, stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.features-list', start: 'top 82%', once: true }
        });

        // CTA Section — escala + fade
        gsap.from('#cta-container > *', {
            y: 35, opacity: 0, duration: 0.7, stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.cta-section', start: 'top 82%', once: true }
        });

        // Footer colunas
        gsap.from('.footer-col', {
            y: 35, opacity: 0, duration: 0.6, stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: 'footer', start: 'top 92%', once: true }
        });

        // Efeito sutil de parallax no overlay da hero
        gsap.to('.hero-bg-overlay', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
})();
