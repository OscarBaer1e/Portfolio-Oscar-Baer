/**
 * Fichier script.js
 * Fonctionnalités principales + GSAP (animations normales et mode CRAZY)
 * https://gsap.com
 */

// Détection mobile pour optimisations
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isLowEndDevice = isMobile && (navigator.hardwareConcurrency <= 4 || /Android.*Chrome/i.test(navigator.userAgent));

// Réduire les animations sur mobile
if (isMobile) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    // Désactiver les animations complexes sur appareils bas de gamme
    if (isLowEndDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        // Préférence pour réduire les animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    /* ----- Accessibilité : lien d'évitement ----- */
    var mainEl = document.querySelector('main');
    if (mainEl && !mainEl.id) mainEl.id = 'main-content';
    var skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Aller au contenu principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    /* ----- Accessibilité : widget et préférences ----- */
    var A11Y_KEYS = { contrast: 'a11y-high-contrast', textLarge: 'a11y-text-large', reduceMotion: 'a11y-reduce-motion', chaos: 'a11y-chaos', theme: 'a11y-theme' };
    function a11yLoad() {
        // Thème : par défaut en mode clair pour mieux mettre en valeur les projets
        var storedTheme = localStorage.getItem(A11Y_KEYS.theme);
        if (storedTheme === 'dark') {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.add('theme-light');
        }
        if (localStorage.getItem(A11Y_KEYS.contrast) === '1') document.body.classList.add('a11y-high-contrast');
        if (localStorage.getItem(A11Y_KEYS.textLarge) === '1') document.documentElement.classList.add('a11y-text-large');
        if (localStorage.getItem(A11Y_KEYS.reduceMotion) === '1') document.documentElement.classList.add('a11y-reduce-motion');
        if (localStorage.getItem(A11Y_KEYS.chaos) === '1') document.body.classList.add('chaos-mode');
    }
    function a11ySave() {
        var el;
        if ((el = document.querySelector('#a11y-contrast'))) localStorage.setItem(A11Y_KEYS.contrast, document.body.classList.contains('a11y-high-contrast') ? '1' : '0');
        if ((el = document.querySelector('#a11y-text-large'))) localStorage.setItem(A11Y_KEYS.textLarge, document.documentElement.classList.contains('a11y-text-large') ? '1' : '0');
        if ((el = document.querySelector('#a11y-reduce-motion'))) localStorage.setItem(A11Y_KEYS.reduceMotion, document.documentElement.classList.contains('a11y-reduce-motion') ? '1' : '0');
        if ((el = document.querySelector('#a11y-chaos'))) localStorage.setItem(A11Y_KEYS.chaos, document.body.classList.contains('chaos-mode') ? '1' : '0');
        // Thème : stocke "dark" ou "light"
        if ((el = document.querySelector('#a11y-theme-dark'))) {
            var isDark = document.body.classList.contains('theme-dark');
            localStorage.setItem(A11Y_KEYS.theme, isDark ? 'dark' : 'light');
        }
    }
    a11yLoad();

    var widget = document.createElement('div');
    widget.className = 'a11y-widget';
    widget.innerHTML = '<button type="button" class="a11y-trigger" aria-label="Options d\'accessibilité et préférences" aria-expanded="false" aria-haspopup="true"><i class="fas fa-universal-access"></i></button>' +
        '<div class="a11y-panel" id="a11y-panel" role="dialog" aria-labelledby="a11y-panel-title" aria-describedby="a11y-panel-desc">' +
        '<h3 id="a11y-panel-title"><i class="fas fa-sliders-h" aria-hidden="true"></i> Préférences</h3>' +
        '<p id="a11y-panel-desc" class="a11y-panel-desc">Thème clair/sombre, contraste, taille du texte et animations.</p>' +
        '<div class="a11y-options-group">' +
        '<div class="a11y-option"><label for="a11y-theme-dark">Mode sombre</label><input type="checkbox" id="a11y-theme-dark" aria-describedby="a11y-desc-theme"></div>' +
        '<div class="a11y-option"><label for="a11y-contrast">Contraste élevé</label><input type="checkbox" id="a11y-contrast" aria-describedby="a11y-desc-contrast"></div>' +
        '<div class="a11y-option"><label for="a11y-text-large">Texte agrandi</label><input type="checkbox" id="a11y-text-large" aria-describedby="a11y-desc-text"></div>' +
        '<div class="a11y-option"><label for="a11y-reduce-motion">Réduire les animations</label><input type="checkbox" id="a11y-reduce-motion" aria-describedby="a11y-desc-motion"></div>' +
        '</div>' +
        '<div class="a11y-option a11y-option-chaos"><label for="a11y-chaos">Mode CRAZY <span aria-hidden="true">🤪</span></label><input type="checkbox" id="a11y-chaos"></div>' +
        '<button type="button" class="a11y-reset">Tout réinitialiser</button></div>';
    document.body.appendChild(widget);

    var trigger = widget.querySelector('.a11y-trigger');
    var panel = widget.querySelector('.a11y-panel');
    var cbThemeDark = widget.querySelector('#a11y-theme-dark');
    var cbContrast = widget.querySelector('#a11y-contrast');
    var cbText = widget.querySelector('#a11y-text-large');
    var cbMotion = widget.querySelector('#a11y-reduce-motion');
    var cbChaos = widget.querySelector('#a11y-chaos');
    cbThemeDark.checked = document.body.classList.contains('theme-dark');
    cbContrast.checked = document.body.classList.contains('a11y-high-contrast');
    cbText.checked = document.documentElement.classList.contains('a11y-text-large');
    cbMotion.checked = document.documentElement.classList.contains('a11y-reduce-motion');
    cbChaos.checked = document.body.classList.contains('chaos-mode');

    trigger.addEventListener('click', function() {
        var open = panel.classList.toggle('open');
        trigger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function(e) {
        if (panel.classList.contains('open') && !widget.contains(e.target)) {
            panel.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });
    cbThemeDark.addEventListener('change', function() {
        // Bascule entre thème clair (par défaut) et sombre
        if (this.checked) {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
        }
        a11ySave();
    });
    cbContrast.addEventListener('change', function() {
        document.body.classList.toggle('a11y-high-contrast', this.checked);
        a11ySave();
    });
    cbText.addEventListener('change', function() {
        document.documentElement.classList.toggle('a11y-text-large', this.checked);
        a11ySave();
    });
    cbMotion.addEventListener('change', function() {
        document.documentElement.classList.toggle('a11y-reduce-motion', this.checked);
        a11ySave();
    });
    cbChaos.addEventListener('change', function() {
        document.body.classList.toggle('chaos-mode', this.checked);
        a11ySave();
        if (this.checked) {
            initCrazyDodge();
            if (typeof gsap !== 'undefined') initChaosGSAP();
        } else {
            stopCrazyDodge();
            if (typeof gsap !== 'undefined') stopChaosGSAP();
        }
    });
    if (document.body.classList.contains('chaos-mode')) {
        initCrazyDodge();
        if (typeof gsap !== 'undefined') initChaosGSAP();
    }
    widget.querySelector('.a11y-reset').addEventListener('click', function() {
        localStorage.removeItem(A11Y_KEYS.contrast); localStorage.removeItem(A11Y_KEYS.textLarge); localStorage.removeItem(A11Y_KEYS.reduceMotion); localStorage.removeItem(A11Y_KEYS.chaos); localStorage.removeItem(A11Y_KEYS.theme);
        document.body.classList.remove('a11y-high-contrast', 'chaos-mode');
        document.documentElement.classList.remove('a11y-text-large', 'a11y-reduce-motion');
        // Reset du thème : retour au mode clair par défaut
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
        cbThemeDark.checked = false;
        cbContrast.checked = false; cbText.checked = false; cbMotion.checked = false; cbChaos.checked = false;
        panel.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        stopCrazyDodge();
        if (typeof gsap !== 'undefined') stopChaosGSAP();
    });

    /* GSAP : mode CRAZY — animations GSAP (https://gsap.com) quand la lib est dispo */
    var chaosGSAPTweens = [];
    function initChaosGSAP() {
        if (document.documentElement.classList.contains('a11y-reduce-motion') || !document.body.classList.contains('chaos-mode')) return;
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        var dur = 1.8;
        chaosGSAPTweens.push(gsap.to('h1, .hero-name', { rotation: '+=15', duration: dur, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        chaosGSAPTweens.push(gsap.to('h2, .section-title', { rotation: '-=12', duration: dur * 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        chaosGSAPTweens.push(gsap.to('.logo a', { scale: 1.15, rotation: 5, duration: 1.2, repeat: -1, yoyo: true, ease: 'power2.inOut' }));
        chaosGSAPTweens.push(gsap.to('.portfolio-item', { y: -20, rotation: 3, duration: 2, repeat: -1, yoyo: true, stagger: 0.15, ease: 'sine.inOut' }));
        chaosGSAPTweens.push(gsap.to('.skill-category', { y: 10, rotation: -2, duration: 2.2, repeat: -1, yoyo: true, stagger: 0.12, ease: 'sine.inOut' }));
        chaosGSAPTweens.push(gsap.to('.btn, .primary-btn, .secondary-btn', { scale: 1.05, duration: 0.8, repeat: -1, yoyo: true, stagger: 0.08, ease: 'power2.inOut' }));
        chaosGSAPTweens.push(gsap.to('.animated-background', { rotation: 360, duration: 40, repeat: -1, ease: 'none', transformOrigin: '50% 50%' }));
    }
    function stopChaosGSAP() {
        chaosGSAPTweens.forEach(function(t) { t.kill(); });
        chaosGSAPTweens.length = 0;
        if (typeof gsap !== 'undefined') gsap.set('h1, h2, .hero-name, .section-title, .logo a, .portfolio-item, .skill-category, .btn, .primary-btn, .secondary-btn, .animated-background', { clearProps: 'all' });
    }

    /* GSAP : animations d'entrée / scroll (hors mode CRAZY, respecte "réduire les mouvements") */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !document.body.classList.contains('chaos-mode') && !document.documentElement.classList.contains('a11y-reduce-motion')) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.reveal').forEach(function(el) {
            gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
        });

        /* ----- 2. Text Reveal – titres principaux (dévoilement vertical) ----- */
        function applyTextReveal(selector) {
            var el = document.querySelector(selector);
            if (!el || !el.textContent.trim()) return;
            var text = el.textContent;
            el.textContent = '';
            el.style.overflow = 'hidden';
            el.style.display = 'inline-block';
            var wrap = document.createElement('span');
            wrap.className = 'text-reveal-wrap';
            wrap.setAttribute('aria-hidden', 'true');
            wrap.style.display = 'inline-block';
            wrap.style.overflow = 'hidden';
            wrap.style.verticalAlign = 'bottom';
            for (var i = 0; i < text.length; i++) {
                var s = document.createElement('span');
                s.className = 'text-reveal-char';
                s.style.display = 'inline-block';
                s.textContent = text[i] === ' ' ? '\u00A0' : text[i];
                wrap.appendChild(s);
            }
            el.appendChild(wrap);
            gsap.from(wrap.children, { y: '100%', duration: 0.6, ease: 'power4.out', stagger: 0.02, delay: selector === '.hero-name' ? 0.25 : 0 });
        }
        var heroName = document.querySelector('.hero-name');
        if (heroName) applyTextReveal('.hero-name');
        var projectTitle = document.querySelector('.project-detail .section-title');
        if (projectTitle) applyTextReveal('.project-detail .section-title');

        /* ----- 3. ScrollTrigger – Articles projet (H2 + images fade-in au scroll) ----- */
        if (document.querySelector('.project-detail')) {
            var articleReveal = gsap.utils.toArray('.project-detail .project-description h2, .project-detail .project-description h1, .project-detail .gallery, .project-detail .project-figure');
            articleReveal.forEach(function(el) {
                gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } });
            });
        }

        /* ----- 4. Magnetic Button – micro-interaction (boutons attirés par le curseur) ----- */
        if (!isMobile && document.documentElement.classList.contains('a11y-reduce-motion') === false) {
            var magneticMouse = { x: 0, y: 0 };
            document.addEventListener('mousemove', function(e) { magneticMouse.x = e.clientX; magneticMouse.y = e.clientY; });
            var magneticBtns = document.querySelectorAll('.primary-btn, .secondary-btn, .portfolio-item-cta, .btn.primary-btn, .btn.secondary-btn');
            magneticBtns.forEach(function(btn) {
                if (btn.closest('.a11y-widget')) return;
                btn.addEventListener('mouseenter', function() {
                    var radius = 100, strength = 12;
                    function update() {
                        var r = btn.getBoundingClientRect();
                        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                        var dx = magneticMouse.x - cx, dy = magneticMouse.y - cy;
                        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                        var move = dist < radius ? (1 - dist / radius) * strength : 0;
                        var tx = (dx / dist) * move, ty = (dy / dist) * move;
                        gsap.to(btn, { x: tx, y: ty, duration: 0.35, ease: 'power2.out', overwrite: true });
                    }
                    var id = setInterval(update, 16);
                    btn._magneticId = id;
                });
                btn.addEventListener('mouseleave', function() {
                    if (btn._magneticId) clearInterval(btn._magneticId);
                    gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
                });
            });
        }
    }

    /* Mode CRAZY : boutons qui esquivent le curseur */
    var crazyDodgeRaf = null, crazyDodgeMouse = { x: -1e4, y: -1e4 };
    document.addEventListener('mousemove', function(e) { crazyDodgeMouse.x = e.clientX; crazyDodgeMouse.y = e.clientY; });
    function initCrazyDodge() {
        if (document.documentElement.classList.contains('a11y-reduce-motion')) return;
        function updateDodge() {
            if (!document.body.classList.contains('chaos-mode') || document.documentElement.classList.contains('a11y-reduce-motion')) return;
            var mx = crazyDodgeMouse.x, my = crazyDodgeMouse.y;
            var sel = '.btn, .primary-btn, .secondary-btn, header .nav-links a, .hero a.btn';
            [].slice.call(document.querySelectorAll(sel)).forEach(function(el) {
                if (el.closest('.a11y-widget')) return;
                var r = el.getBoundingClientRect();
                var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                var dx = cx - mx, dy = cy - my;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                var zone = 160, maxPush = 90;
                var push = dist < zone ? ((zone - dist) / zone) * maxPush : 0;
                var tx = (dx / dist) * push, ty = (dy / dist) * push;
                el.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
                el.style.transition = 'transform 0.05s ease-out';
            });
            crazyDodgeRaf = requestAnimationFrame(updateDodge);
        }
        crazyDodgeRaf = requestAnimationFrame(updateDodge);
    }
    function stopCrazyDodge() {
        if (crazyDodgeRaf) cancelAnimationFrame(crazyDodgeRaf);
        crazyDodgeRaf = null;
        [].slice.call(document.querySelectorAll('.btn, .primary-btn, .secondary-btn, header .nav-links a, .hero a.btn')).forEach(function(el) {
            if (el.closest('.a11y-widget')) return;
            el.style.transform = '';
            el.style.transition = '';
        });
    }

    const pageLoader = document.querySelector('.page-loader');
    
    if (pageLoader) {
        // Simule le chargement
        setTimeout(() => {
            pageLoader.classList.add('hidden');
            // Retire le loader du DOM après l'animation
            setTimeout(() => {
                pageLoader.remove();
            }, 500);
        }, 2000);
    }

    const currentYearElements = document.querySelectorAll('[id^="current-year"]');
    currentYearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            // Logique de changement d'icône (fa-bars <-> fa-times)
            if (navList.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Ferme le menu quand un lien est cliqué (pour mobile)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });
        
        // Ferme le menu quand on clique en dehors (pour mobile)
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('active') && 
                !navList.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navList.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    /* ----- Lightbox global : zoom sur toutes les images ----- */
    (function initGlobalImageLightbox() {
        var allImages = document.querySelectorAll('img');
        if (!allImages.length) return;

        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Agrandir l\'image');

        var img = document.createElement('img');
        img.alt = '';
        var sideDescription = document.createElement('div');
        sideDescription.className = 'lightbox-side-description';
        sideDescription.setAttribute('aria-live', 'polite');

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        closeBtn.setAttribute('aria-label', 'Fermer');

        overlay.appendChild(img);
        overlay.appendChild(sideDescription);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        function canOpenInLightbox(el) {
            if (!el || el.tagName !== 'IMG') return false;
            if (el.closest('.lightbox-overlay, .zoom-modal, .skill-overlay, .pdf-viewer-overlay')) return false;
            if (el.dataset.noLightbox === 'true') return false;
            return true;
        }

        function openLightbox(sourceImg) {
            var src = sourceImg.currentSrc || sourceImg.src;
            if (!src) return;
            img.src = src;
            img.alt = sourceImg.getAttribute('alt') || '';
            sideDescription.textContent = sourceImg.dataset.lightboxDescription || '';
            overlay.classList.toggle('has-side-description', !!sourceImg.dataset.lightboxDescription);
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('is-open');
            overlay.classList.remove('has-side-description');
            document.body.style.overflow = '';
            img.src = '';
            sideDescription.textContent = '';
        }

        allImages.forEach(function(el) {
            if (!canOpenInLightbox(el)) return;
            el.classList.add('lightbox-zoomable');
            el.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(el);
            });
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay || e.target.closest('.lightbox-close')) closeLightbox();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeLightbox();
        });
    })();

    /* ----- Accueil : cartes compétences → overlay avec forme différente par carte ----- */
    (function initSkillCardsOverlay() {
        var cards = document.querySelectorAll('.skill-preview-card[data-expandable]');
        if (!cards.length) return;
        var overlay = document.createElement('div');
        overlay.className = 'skill-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Détail de la compétence');
        overlay.innerHTML = '<div class="skill-overlay-backdrop"></div><div class="skill-overlay-panel">' +
            '<button type="button" class="skill-overlay-close" aria-label="Fermer"><i class="fas fa-times"></i></button>' +
            '<div class="skill-overlay-content"></div></div>';
        document.body.appendChild(overlay);
        var backdrop = overlay.querySelector('.skill-overlay-backdrop');
        var panel = overlay.querySelector('.skill-overlay-panel');
        var content = overlay.querySelector('.skill-overlay-content');
        var closeBtn = overlay.querySelector('.skill-overlay-close');
        function openOverlay(card) {
            var title = card.querySelector('h3');
            var detail = card.querySelector('.skill-preview-detail');
            var shape = card.getAttribute('data-shape') || 'rounded';
            content.innerHTML = (title ? '<h3 class="skill-overlay-title">' + title.innerHTML + '</h3>' : '') +
                (detail ? '<div class="skill-overlay-body">' + detail.innerHTML + '</div>' : '');
            panel.className = 'skill-overlay-panel skill-overlay-panel--' + shape;
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }
        function closeOverlay() {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }
        cards.forEach(function(card) {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-expanded', 'false');
            card.addEventListener('click', function() {
                openOverlay(this);
                this.setAttribute('aria-expanded', 'true');
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        overlay.addEventListener('click', function(e) {
            if (e.target.closest('.skill-overlay-close') || (e.target === backdrop)) {
                closeOverlay();
                cards.forEach(function(c) { c.setAttribute('aria-expanded', 'false'); });
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
                closeOverlay();
                cards.forEach(function(c) { c.setAttribute('aria-expanded', 'false'); });
            }
        });
    })();

    // ===============================================
    // 3. Effet de Frappe (Typing Effect) sur la page d'accueil
    //    (Assure-toi d'avoir la classe CSS '.typing-cursor' pour l'effet '|')
    // ===============================================
    const typingElement = document.querySelector('#typing-text');
    
    // Déplace la déclaration de la variable globale au début du script pour la rendre disponible.
    const roleDescriptions = [
        "Développeur Web Full-Stack",
        "Designer UI/UX Créatif",
        "Design Graphique",
        "Passionné par l'Audiovisuel"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 1500;

    function typeWriter() {
        // Vérifie si l'élément existe avant de continuer
        if (!typingElement) return;

        const currentText = roleDescriptions[roleIndex];
        let display = currentText.substring(0, charIndex);

        typingElement.innerHTML = display + '<span class="typing-cursor">|</span>';

        if (!isDeleting) {
            charIndex++;
            if (charIndex > currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, pauseTime);
            } else {
                setTimeout(typeWriter, typingSpeed);
            }
        } else {
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roleDescriptions.length;
                setTimeout(typeWriter, 500); // Délai avant de taper la phrase suivante
            } else {
                setTimeout(typeWriter, deletingSpeed);
            }
        }
    }

    // Démarre l'effet uniquement si l'élément existe sur la page
    // Attend que le loader soit terminé pour commencer
    if (typingElement) {
        if (pageLoader) {
            // Attend la fin du loader + un petit délai
            setTimeout(() => {
                typeWriter();
            }, 2500);
        } else {
            // Si pas de loader, démarre immédiatement
            typeWriter();
        }
    }
    // NOTE: Cela fonctionne correctement si les liens de la navbar pointent 
    // vers des IDs de section existants (ex: a[href="#portfolio-section"]).
    
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-list a');

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Supprime la classe 'active' de tous les liens
                navLinks.forEach(link => link.classList.remove('active'));

                // Ajoute la classe 'active' au lien correspondant à la section visible
                // NOTE : Utilise le chemin relatif (ex: './pages/portfolio.html' doit être géré)
                
                // Si le lien est un lien relatif (ex: ./pages/portfolio.html), il faut
                // le traiter différemment que pour les liens ancrés (#id).
                // Pour simplifier, nous ciblons uniquement les liens d'ancre (ancres internes).
                const targetHref = document.querySelector(`.nav-list a[href*="${entry.target.id}"]`);
                
                if (targetHref) {
                    targetHref.classList.add('active');
                }
            }
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        // Déclenchement lorsque 30% de la section est visible
        threshold: 0.3 
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        if (section.id) {
            sectionObserver.observe(section);
        }
    });


    // ===============================================
    // 5. Scroll Reveal Animations (Intersection Observer natif)
    //    (Ceci remplace les animations GSAP au défilement)
    // ===============================================
    
    // Vous aurez besoin d'un CSS de base pour cette fonctionnalité:
    // .reveal { opacity: 0; transform: translateY(20px); transition: all 0.8s ease-out; }
    // .revealed { opacity: 1; transform: translateY(0); }
    
    const revealElements = document.querySelectorAll(
        '.section-title, .portfolio-item, .hero-content h2, .hero-content h3, .hero-actions .btn'
    );

    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserverOptions = {
        root: null,
        threshold: 0.1 
    };

    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);

    revealElements.forEach((el, index) => {
        // Ajout d'un petit délai pour l'effet "staggered" (comme le faisait GSAP)
        const delay = el.dataset.animationDelay || index * 50;
        el.style.transitionDelay = `${delay}ms`; 
        el.style.setProperty('--delay', delay);
        el.classList.add('reveal'); // Classe de base pour la transition CSS
        revealObserver.observe(el);
    });
    const cardsWithDelay = document.querySelectorAll('[data-animation-delay]');
    cardsWithDelay.forEach(card => {
        const delay = parseInt(card.dataset.animationDelay) || 0;
        card.style.setProperty('--delay', delay);
        card.classList.add('reveal');
        revealObserver.observe(card);
    });
    // Parallaxe désactivée pour alléger les calculs au scroll
    // Effet ripple et curseur personnalisé supprimés pour simplifier l'expérience
    const counters = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                countObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => countObserver.observe(counter));
    // Effet de tilt 3D sur les cartes désactivé pour une interaction plus sobre
    // Animation des titres (simplifiée sur mobile)
    if (!isLowEndDevice) {
    // Animation des titres (simplifiée sur mobile)
    if (!isLowEndDevice) {
        const animatedTitles = document.querySelectorAll('.section-title');
        animatedTitles.forEach(title => {
            if (!title.querySelector('.letter-animation')) {
                const text = title.textContent;
                title.innerHTML = '';
                const delayMultiplier = isMobile ? 0.02 : 0.05; // Plus rapide sur mobile
                text.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.animationDelay = `${index * delayMultiplier}s`;
                    span.classList.add('letter-animation');
                    title.appendChild(span);
                });
            }
        });
    }
    }
    // Lazy loading des images optimisé pour mobile
    const images = document.querySelectorAll('img[loading="lazy"], img:not([loading])');
    const imageObserverOptions = {
        rootMargin: isMobile ? '50px' : '100px', // Charger plus tôt sur mobile
        threshold: isMobile ? 0.1 : 0.2
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Ajouter loading="lazy" si pas déjà présent
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    }, { once: true });
                }
                imageObserver.unobserve(img);
            }
        });
    }, imageObserverOptions);
    
    images.forEach(img => {
        // Ajouter loading="lazy" par défaut si pas déjà présent
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (img.complete) {
            img.classList.add('loaded');
        }
        imageObserver.observe(img);
    });
    const allRevealElements = document.querySelectorAll('.reveal:not(.revealed)');
    const enhancedRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed', 'fade-blur');
                enhancedRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    allRevealElements.forEach(el => {
        enhancedRevealObserver.observe(el);
    });
    // Particules décoratives supprimées pour réduire la charge graphique
    if (document.querySelector('#hero')) {
        const heroElements = document.querySelectorAll('.hero-left, .hero-right, .hero-intro > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 500 + (index * 100));
        });
    }
    let clickCount = 0;
    let clickTimeout;
    const easterEggTrigger = document.getElementById('easter-egg-trigger');
    const easterEggTriggerImg = document.getElementById('easter-egg-trigger-img');
    
    function triggerEasterEgg() {
        // Affiche un message amusant
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--dark-bg-color);
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 100000;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
            animation: easterEggPulse 0.5s ease;
        `;
        message.innerHTML = '🎳 Easter Egg Découvert ! 🎳<br><small style="font-size: 1rem; margin-top: 10px; display: block;">Redirection vers le mini-jeu...</small>';
        document.body.appendChild(message);
        
        setTimeout(() => {
            // Détermine le bon chemin selon la page actuelle
            const currentPath = window.location.pathname;
            const currentUrl = window.location.href;
            // Vérifie si on est dans le dossier pages (Windows ou Unix)
            const isInPagesFolder = currentPath.includes('/pages/') || currentPath.includes('\\pages\\') || currentUrl.includes('/pages/') || currentUrl.includes('\\pages\\');
            const redirectPath = isInPagesFolder ? './bowling-game.html' : './pages/bowling-game.html';
            window.location.href = redirectPath;
        }, 1500);
    }
    
    if (easterEggTrigger) {
        easterEggTrigger.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimeout);
            
            if (clickCount >= 5) {
                triggerEasterEgg();
                clickCount = 0;
            } else {
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, 2000);
            }
        });
    }
    
    if (easterEggTriggerImg) {
        easterEggTriggerImg.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimeout);
            
            if (clickCount >= 5) {
                triggerEasterEgg();
                clickCount = 0;
            } else {
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, 2000);
            }
        });
    }
    
    // Raccourci clavier : B + O + W + L + I + N + G
    let keySequence = [];
    const bowlingSequence = ['b', 'o', 'w', 'l', 'i', 'n', 'g'];
    
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        keySequence.push(key);
        if (keySequence.length > bowlingSequence.length) {
            keySequence.shift();
        }
        
        if (keySequence.join('') === bowlingSequence.join('')) {
            triggerEasterEgg();
            keySequence = [];
        }
    });
    let basketballClickCount = 0;
    let basketballClickTimeout;
    const basketballEasterEgg = document.getElementById('basketball-easter-egg');
    const basketballEasterEggTitle = document.getElementById('basketball-easter-egg-title');
    let basketballKeySequence = [];
    const basketballSequence = ['b', 'a', 's', 'k', 'e', 't', 'b', 'a', 'l', 'l'];
    
    function triggerBasketballEasterEgg() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--dark-bg-color);
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 100000;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
            animation: easterEggPulse 0.5s ease;
        `;
        message.innerHTML = '🚀 Easter Egg Space Shooter Découvert ! 🚀<br><small style="font-size: 1rem; margin-top: 10px; display: block;">Redirection vers le mini-jeu...</small>';
        document.body.appendChild(message);
        
        setTimeout(() => {
            // Détermine le bon chemin selon la page actuelle
            const currentPath = window.location.pathname;
            const currentUrl = window.location.href;
            // Vérifie si on est dans le dossier pages (Windows ou Unix)
            const isInPagesFolder = currentPath.includes('/pages/') || currentPath.includes('\\pages\\') || currentUrl.includes('/pages/') || currentUrl.includes('\\pages\\');
            const redirectPath = isInPagesFolder ? './space-shooter.html' : './pages/space-shooter.html';
            window.location.href = redirectPath;
        }, 1500);
    }
    
    if (basketballEasterEgg) {
        basketballEasterEgg.addEventListener('click', () => {
            basketballClickCount++;
            clearTimeout(basketballClickTimeout);
            
            if (basketballClickCount >= 7) {
                triggerBasketballEasterEgg();
                basketballClickCount = 0;
            } else {
                basketballClickTimeout = setTimeout(() => {
                    basketballClickCount = 0;
                }, 2000);
            }
        });
    }
    
    if (basketballEasterEggTitle) {
        basketballEasterEggTitle.addEventListener('click', () => {
            basketballClickCount++;
            clearTimeout(basketballClickTimeout);
            
            if (basketballClickCount >= 7) {
                triggerBasketballEasterEgg();
                basketballClickCount = 0;
            } else {
                basketballClickTimeout = setTimeout(() => {
                    basketballClickCount = 0;
                }, 2000);
            }
        });
    }
    
    // Raccourci clavier : B + A + S + K + E + T + B + A + L + L
    document.addEventListener('keydown', (e) => {
        if (window.location.pathname.includes('about.html')) {
            basketballKeySequence.push(e.key.toLowerCase());
            if (basketballKeySequence.length > basketballSequence.length) {
                basketballKeySequence.shift();
            }
            
            if (basketballKeySequence.join('') === basketballSequence.join('')) {
                triggerBasketballEasterEgg();
                basketballKeySequence = [];
            }
        }
    });
    if (window.location.pathname.includes('portfolio.html')) {
        let pacmanClickCount = 0;
        let pacmanClickTimeout;
        const pacmanEasterEgg = document.getElementById('pacman-easter-egg-trigger');
        let pacmanKeySequence = [];
        const pacmanSequence = ['p', 'a', 'c', 'm', 'a', 'n'];
        
        function triggerPacmanEasterEgg() {
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: var(--dark-bg-color);
                padding: 30px 50px;
                border-radius: 15px;
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 100000;
                text-align: center;
                box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
                animation: easterEggPulse 0.5s ease;
            `;
            message.innerHTML = '👻 Easter Egg Pacman Découvert ! 👻<br><small style="font-size: 1rem; margin-top: 10px; display: block;">Redirection vers le mini-jeu...</small>';
            document.body.appendChild(message);
            
            setTimeout(() => {
                const currentPath = window.location.pathname;
                const currentUrl = window.location.href;
                const isInPagesFolder = currentPath.includes('/pages/') || currentPath.includes('\\pages\\') || currentUrl.includes('/pages/') || currentUrl.includes('\\pages\\');
                const redirectPath = isInPagesFolder ? './pacman-game.html' : './pages/pacman-game.html';
                window.location.href = redirectPath;
            }, 1500);
        }
        
        if (pacmanEasterEgg) {
            pacmanEasterEgg.addEventListener('click', () => {
                pacmanClickCount++;
                clearTimeout(pacmanClickTimeout);
                
                if (pacmanClickCount >= 5) {
                    triggerPacmanEasterEgg();
                    pacmanClickCount = 0;
                } else {
                    pacmanClickTimeout = setTimeout(() => {
                        pacmanClickCount = 0;
                    }, 2000);
                }
            });
        }
        
        // Raccourci clavier : P + A + C + M + A + N
        document.addEventListener('keydown', (e) => {
            if (window.location.pathname.includes('portfolio.html')) {
                pacmanKeySequence.push(e.key.toLowerCase());
                if (pacmanKeySequence.length > pacmanSequence.length) {
                    pacmanKeySequence.shift();
                }
                
                if (pacmanKeySequence.join('') === pacmanSequence.join('')) {
                    triggerPacmanEasterEgg();
                    pacmanKeySequence = [];
                }
            }
        });
    }
    // Vérifier si on est sur la page contact (plusieurs méthodes pour être sûr)
    const isContactPage = window.location.pathname.includes('contact.html') || 
                         window.location.href.includes('contact.html') ||
                         document.getElementById('omerta-easter-egg-trigger') !== null;
    
    if (isContactPage) {
        let omertaClickCount = 0;
        let omertaClickTimeout;
        let omertaKeySequence = [];
        const omertaSequence = ['o', 'm', 'e', 'r', 't', 'a'];
        
        function triggerOmertaEasterEgg() {
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: var(--dark-bg-color);
                padding: 30px 50px;
                border-radius: 15px;
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 100000;
                text-align: center;
                box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
                animation: easterEggPulse 0.5s ease;
            `;
            message.innerHTML = '🔒 Easter Egg Découvert ! 🔒<br><small style="font-size: 1rem; margin-top: 10px; display: block;">Redirection vers la page secrète...</small>';
            document.body.appendChild(message);
            
            setTimeout(() => {
                const currentPath = window.location.pathname;
                const currentUrl = window.location.href;
                const isInPagesFolder = currentPath.includes('/pages/') || currentPath.includes('\\pages\\') || currentUrl.includes('/pages/') || currentUrl.includes('\\pages\\');
                const redirectPath = isInPagesFolder ? './omerta.html' : './pages/omerta.html';
                window.location.href = redirectPath;
            }, 1500);
        }
        
        // Attendre que le DOM soit complètement chargé avant d'attacher les événements
        const omertaEasterEgg = document.getElementById('omerta-easter-egg-trigger');
        
        if (omertaEasterEgg) {
            omertaEasterEgg.addEventListener('click', (e) => {
                e.preventDefault();
                omertaClickCount++;
                clearTimeout(omertaClickTimeout);
                
                if (omertaClickCount >= 5) {
                    triggerOmertaEasterEgg();
                    omertaClickCount = 0;
                } else {
                    omertaClickTimeout = setTimeout(() => {
                        omertaClickCount = 0;
                    }, 2000);
                }
            });
            
            // Ajouter un style pour indiquer que c'est cliquable (optionnel)
            omertaEasterEgg.style.cursor = 'pointer';
        }
        
        // Raccourci clavier : O + M + E + R + T + A
        document.addEventListener('keydown', (e) => {
            // Ignorer si on est dans un input ou textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            omertaKeySequence.push(e.key.toLowerCase());
            if (omertaKeySequence.length > omertaSequence.length) {
                omertaKeySequence.shift();
            }
            
            if (omertaKeySequence.join('') === omertaSequence.join('')) {
                triggerOmertaEasterEgg();
                omertaKeySequence = [];
            }
        });
    }
});