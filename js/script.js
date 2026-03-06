/**
 * Fichier script.js
 * Contient toutes les fonctionnalités JavaScript natives (Vanilla JS)
 * (GSAP et tous ses plugins ont été retirés)
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
    const pageLoader = document.querySelector('.page-loader');
    
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
            setTimeout(() => pageLoader.remove(), 500);
        }, 1200);
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
            setTimeout(() => typeWriter(), 1700);
        } else {
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
});