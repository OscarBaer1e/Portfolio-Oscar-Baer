/**
 * Fichier script.js
 * Contient toutes les fonctionnalités JavaScript natives (Vanilla JS)
 * (GSAP et tous ses plugins ont été retirés)
 */
document.addEventListener('DOMContentLoaded', function() {
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

    // ===============================================
    // BOUTON JULES AVEC EXPLOSIONS
    // ===============================================
    const julesButton = document.getElementById('jules-button');
    if (julesButton) {
        julesButton.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Ajouter la classe d'explosion
            this.classList.add('exploding');
            
            // Créer un conteneur pour les particules
            let explosionContainer = document.querySelector('.explosion-container');
            if (!explosionContainer) {
                explosionContainer = document.createElement('div');
                explosionContainer.classList.add('explosion-container');
                document.body.appendChild(explosionContainer);
            }
            
            // Créer 20 particules d'explosion
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.classList.add('explosion-particle');
                
                // Position initiale au centre du bouton
                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';
                
                // Direction aléatoire pour chaque particule
                const angle = (Math.PI * 2 * i) / 20;
                const distance = 100 + Math.random() * 150;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                
                // Couleur aléatoire (cyan ou magenta)
                const color = Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)';
                particle.style.background = color;
                particle.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color === 'var(--primary-color)' ? 'var(--secondary-color)' : 'var(--primary-color)'}`;
                
                explosionContainer.appendChild(particle);
                
                // Retirer la particule après l'animation
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }
            
            // Retirer la classe d'explosion après l'animation
            setTimeout(() => {
                this.classList.remove('exploding');
            }, 800);
        });
    }

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
    let lastScrollTop = 0;
    let ticking = false;
    const parallaxElements = document.querySelectorAll('.parallax-section, .hero-content, .morph');
    
    function updateParallax() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    const buttons = document.querySelectorAll('.btn, .btn-overlay');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    // Curseur personnalisé - directement sur la souris
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    // Cacher le curseur système et utiliser la bulle
    document.body.style.cursor = 'none';
    
    // Positionner directement sur la souris (pas de lag)
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.transform = 'translate(-50%, -50%)';
    });
    
    // Masquer le curseur quand la souris quitte la page
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    // Agrandit le curseur au survol des éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .graphisme-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
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
    const tiltCards = document.querySelectorAll('.portfolio-item, .graphisme-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    const animatedTitles = document.querySelectorAll('.section-title');
    animatedTitles.forEach(title => {
        if (!title.querySelector('.letter-animation')) {
            const text = title.textContent;
            title.innerHTML = '';
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('letter-animation');
                title.appendChild(span);
            });
        }
    });
    const images = document.querySelectorAll('img[loading="lazy"], img:not([loading])');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
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
    function createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const colors = ['var(--primary-color)', 'var(--secondary-color)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.position = 'fixed';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.opacity = '0';
        particle.style.zIndex = '1';
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        document.body.appendChild(particle);
        
        const endX = (Math.random() - 0.5) * 300;
        const endY = -window.innerHeight - 100;
        
        const animation = particle.animate([
            { 
                transform: 'translateY(0) translateX(0) scale(0)', 
                opacity: 0 
            },
            { 
                transform: `translateY(${endY * 0.3}px) translateX(${endX * 0.3}px) scale(1)`, 
                opacity: 0.8 
            },
            { 
                transform: `translateY(${endY}px) translateX(${endX}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 4000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => particle.remove();
    }
    
    // Crée des particules occasionnellement (optimisé pour les performances)
    if (window.innerWidth > 768 && document.querySelector('.animated-background')) {
        let particleInterval = setInterval(() => {
            if (Math.random() > 0.6) {
                createParticle();
            }
        }, 3000);
        
        // Arrête les particules si l'utilisateur quitte la page
        window.addEventListener('blur', () => clearInterval(particleInterval));
        window.addEventListener('focus', () => {
            particleInterval = setInterval(() => {
                if (Math.random() > 0.6) {
                    createParticle();
                }
            }, 3000);
        });
    }
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
        keySequence.push(e.key.toLowerCase());
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