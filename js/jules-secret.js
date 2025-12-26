/**
 * Script pour la page secrète Jules - Mini-jeux optimisés
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'année
    const yearElement = document.getElementById('current-year-jules');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ============================================
    // MINI-JEU 1 : STAND DE GLACE - STACK GAME (OPTIMISÉ)
    // ============================================
    let iceCreamGame = {
        score: 0,
        stack: [],
        fallingScoop: null,
        gameRunning: false,
        speed: 2,
        scoopSize: 60,
        baseWidth: 100,
        currentWidth: 100,
        direction: 1,
        position: 0,
        maxPosition: 0,
        animationFrame: null,
        // Cache DOM
        stackEl: null,
        scoreEl: null,
        levelEl: null
    };

    window.openIceCreamGame = function() {
        const overlay = document.getElementById('ice-cream-game-overlay');
        overlay.classList.add('active');
        restoreCursorInGame(overlay);
        
        // Cache des éléments DOM
        iceCreamGame.stackEl = document.getElementById('ice-cream-stack');
        iceCreamGame.scoreEl = document.getElementById('ice-cream-score');
        iceCreamGame.levelEl = document.getElementById('ice-cream-level');
        
        resetIceCreamGame();
        startIceCreamGame();
    };

    function resetIceCreamGame() {
        iceCreamGame.score = 0;
        iceCreamGame.stack = [];
        iceCreamGame.speed = 2;
        iceCreamGame.currentWidth = iceCreamGame.baseWidth;
        iceCreamGame.direction = 1;
        iceCreamGame.position = 0;
        iceCreamGame.gameRunning = true;
        
        if (iceCreamGame.stackEl) {
            iceCreamGame.stackEl.innerHTML = '';
            iceCreamGame.maxPosition = (iceCreamGame.stackEl.offsetWidth - iceCreamGame.currentWidth) / 2;
        }
        if (iceCreamGame.scoreEl) iceCreamGame.scoreEl.textContent = '0';
        if (iceCreamGame.levelEl) iceCreamGame.levelEl.textContent = '1';
    }

    function startIceCreamGame() {
        if (!iceCreamGame.stackEl) return;
        
        // Détection du clic pour placer la boule
        iceCreamGame.stackEl.addEventListener('click', placeScoop, { once: false });
        
        // Créer la première boule qui bouge
        createFallingScoop();
    }

    function createFallingScoop() {
        if (!iceCreamGame.gameRunning || !iceCreamGame.stackEl) return;
        
        const flavors = ['vanilla', 'chocolate', 'strawberry', 'mint'];
        const flavor = flavors[Math.floor(Math.random() * flavors.length)];
        
        iceCreamGame.fallingScoop = document.createElement('div');
        iceCreamGame.fallingScoop.className = `ice-cream-scoop scoop-${flavor} falling-scoop`;
        iceCreamGame.fallingScoop.style.width = iceCreamGame.currentWidth + 'px';
        iceCreamGame.fallingScoop.style.height = iceCreamGame.currentWidth + 'px';
        iceCreamGame.fallingScoop.style.position = 'absolute';
        iceCreamGame.fallingScoop.style.bottom = '0px';
        iceCreamGame.fallingScoop.style.left = '50%';
        iceCreamGame.fallingScoop.style.transform = 'translateX(-50%)';
        iceCreamGame.fallingScoop.style.transition = 'none';
        iceCreamGame.fallingScoop.style.willChange = 'transform';
        
        iceCreamGame.stackEl.appendChild(iceCreamGame.fallingScoop);
        
        // Réinitialiser la position
        iceCreamGame.position = 0;
        
        // Animation avec requestAnimationFrame (plus fluide)
        function animate() {
            if (!iceCreamGame.gameRunning || !iceCreamGame.fallingScoop) return;
            
            iceCreamGame.position += iceCreamGame.speed * iceCreamGame.direction;
            
            if (iceCreamGame.position >= iceCreamGame.maxPosition || iceCreamGame.position <= -iceCreamGame.maxPosition) {
                iceCreamGame.direction *= -1;
            }
            
            if (iceCreamGame.fallingScoop) {
                iceCreamGame.fallingScoop.style.transform = `translateX(calc(-50% + ${iceCreamGame.position}px))`;
            }
            
            iceCreamGame.animationFrame = requestAnimationFrame(animate);
        }
        
        iceCreamGame.animationFrame = requestAnimationFrame(animate);
    }

    function placeScoop() {
        if (!iceCreamGame.gameRunning || !iceCreamGame.fallingScoop || !iceCreamGame.stackEl) return;
        
        // Annuler l'animation
        if (iceCreamGame.animationFrame) {
            cancelAnimationFrame(iceCreamGame.animationFrame);
            iceCreamGame.animationFrame = null;
        }
        
        const falling = iceCreamGame.fallingScoop;
        const scoopWidth = iceCreamGame.currentWidth;
        
        // Vérifier si la boule est bien placée (tolérance de 20px)
        const lastScoop = iceCreamGame.stack[iceCreamGame.stack.length - 1];
        let isValid = true;
        
        if (lastScoop) {
            // Utiliser la position calculée au lieu de getBoundingClientRect (plus rapide)
            const lastPosition = iceCreamGame.position;
            const currentPosition = iceCreamGame.position;
            const diff = Math.abs(currentPosition - lastPosition);
            
            if (diff > 20) {
                endIceCreamGame();
                return;
            }
            
            // Réduire la largeur pour le prochain niveau
            iceCreamGame.currentWidth = Math.max(40, iceCreamGame.currentWidth - 2);
            iceCreamGame.maxPosition = (iceCreamGame.stackEl.offsetWidth - iceCreamGame.currentWidth) / 2;
        }
        
        // Placer la boule
        falling.classList.remove('falling-scoop');
        falling.style.position = 'relative';
        falling.style.bottom = 'auto';
        falling.style.left = 'auto';
        falling.style.transform = 'none';
        falling.style.width = scoopWidth + 'px';
        falling.style.height = scoopWidth + 'px';
        falling.style.margin = '0 auto';
        falling.style.willChange = 'auto';
        
        iceCreamGame.stack.push(falling);
        iceCreamGame.score += 10;
        if (iceCreamGame.scoreEl) iceCreamGame.scoreEl.textContent = iceCreamGame.score;
        
        // Augmenter la difficulté
        if (iceCreamGame.stack.length % 5 === 0) {
            iceCreamGame.speed += 0.5;
            if (iceCreamGame.levelEl) {
                iceCreamGame.levelEl.textContent = Math.floor(iceCreamGame.stack.length / 5) + 1;
            }
        }
        
        // Créer la prochaine boule immédiatement (pas de setTimeout)
        requestAnimationFrame(() => {
            if (iceCreamGame.gameRunning) {
                createFallingScoop();
            }
        });
    }

    function endIceCreamGame() {
        iceCreamGame.gameRunning = false;
        if (iceCreamGame.animationFrame) {
            cancelAnimationFrame(iceCreamGame.animationFrame);
        }
        
        if (iceCreamGame.stackEl) {
            iceCreamGame.stackEl.removeEventListener('click', placeScoop);
        }
        
        if (iceCreamGame.fallingScoop) {
            iceCreamGame.fallingScoop.style.animation = 'shake 0.3s';
            setTimeout(() => {
                if (iceCreamGame.fallingScoop) {
                    iceCreamGame.fallingScoop.remove();
                }
            }, 300);
        }
        
        setTimeout(() => {
            alert(`🎉 Game Over !\nScore: ${iceCreamGame.score}\nHauteur: ${iceCreamGame.stack.length} boules`);
        }, 350);
    }

    // ============================================
    // MINI-JEU 2 : STAND DE MANGAS - MEMORY GAME (OPTIMISÉ)
    // ============================================
    let mangaGame = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: 8,
        canFlip: true,
        moves: 0,
        // Cache DOM
        shelfEl: null,
        scoreEl: null,
        movesEl: null
    };

    const mangaEmojis = ['📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒'];

    window.openMangaGame = function() {
        const overlay = document.getElementById('manga-game-overlay');
        overlay.classList.add('active');
        restoreCursorInGame(overlay);
        
        // Cache des éléments DOM
        mangaGame.shelfEl = document.getElementById('manga-shelf');
        mangaGame.scoreEl = document.getElementById('manga-score');
        mangaGame.movesEl = document.getElementById('manga-moves');
        
        resetMangaGame();
        generateMangaCards();
    };

    function resetMangaGame() {
        mangaGame.cards = [];
        mangaGame.flippedCards = [];
        mangaGame.matchedPairs = 0;
        mangaGame.canFlip = true;
        mangaGame.moves = 0;
        
        if (mangaGame.scoreEl) mangaGame.scoreEl.textContent = '0';
        if (mangaGame.movesEl) mangaGame.movesEl.textContent = '0';
    }

    function generateMangaCards() {
        if (!mangaGame.shelfEl) return;
        
        // Utiliser DocumentFragment pour réduire les reflows
        const fragment = document.createDocumentFragment();
        mangaGame.shelfEl.innerHTML = '';
        
        // Créer des paires
        let cardPairs = [];
        mangaEmojis.forEach((emoji, index) => {
            cardPairs.push({ id: index, emoji: emoji });
            cardPairs.push({ id: index, emoji: emoji });
        });
        
        // Mélanger (Fisher-Yates pour meilleure performance)
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }
        
        // Créer les cartes
        cardPairs.forEach((pair, index) => {
            const card = document.createElement('div');
            card.className = 'manga-card';
            card.dataset.id = pair.id;
            card.dataset.index = index;
            card.innerHTML = '<div class="manga-card-back">?</div><div class="manga-card-front">' + pair.emoji + '</div>';
            card.style.willChange = 'transform';
            
            card.addEventListener('click', () => flipCard(card), { passive: true });
            fragment.appendChild(card);
            mangaGame.cards.push(card);
        });
        
        mangaGame.shelfEl.appendChild(fragment);
    }

    function flipCard(card) {
        if (!mangaGame.canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        mangaGame.flippedCards.push(card);
        
        if (mangaGame.flippedCards.length === 2) {
            mangaGame.canFlip = false;
            mangaGame.moves++;
            if (mangaGame.movesEl) mangaGame.movesEl.textContent = mangaGame.moves;
            
            // Réduire le délai de vérification (600ms au lieu de 1000ms)
            setTimeout(() => {
                checkMatch();
            }, 600);
        }
    }

    function checkMatch() {
        const [card1, card2] = mangaGame.flippedCards;
        
        if (card1.dataset.id === card2.dataset.id) {
            // Match !
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.style.willChange = 'auto';
            card2.style.willChange = 'auto';
            mangaGame.matchedPairs++;
            if (mangaGame.scoreEl) mangaGame.scoreEl.textContent = mangaGame.matchedPairs;
            
            if (mangaGame.matchedPairs === mangaGame.totalPairs) {
                setTimeout(() => {
                    alert(`🎉 Félicitations !\nVous avez trouvé toutes les paires en ${mangaGame.moves} coups !`);
                }, 300);
            }
        } else {
            // Pas de match
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        
        mangaGame.flippedCards = [];
        mangaGame.canFlip = true;
    }

    window.resetMangaGame = function() {
        resetMangaGame();
        generateMangaCards();
    };

    // ============================================
    // MINI-JEU 3 : STAND DE POULET - WHACK-A-MOLE (OPTIMISÉ)
    // ============================================
    let chickenGame = {
        score: 0,
        time: 30,
        gameRunning: false,
        timer: null,
        spawnInterval: null,
        activeChickens: [],
        holes: [],
        // Cache DOM
        arenaEl: null,
        scoreEl: null,
        timeEl: null
    };

    window.openChickenGame = function() {
        const overlay = document.getElementById('chicken-game-overlay');
        overlay.classList.add('active');
        restoreCursorInGame(overlay);
        
        // Cache des éléments DOM
        chickenGame.arenaEl = document.getElementById('chicken-arena');
        chickenGame.scoreEl = document.getElementById('chicken-score');
        chickenGame.timeEl = document.getElementById('chicken-time');
        
        resetChickenGame();
        createChickenHoles();
        startChickenGame();
    };

    function resetChickenGame() {
        chickenGame.score = 0;
        chickenGame.time = 30;
        chickenGame.gameRunning = false;
        chickenGame.activeChickens = [];
        
        if (chickenGame.scoreEl) chickenGame.scoreEl.textContent = '0';
        if (chickenGame.timeEl) chickenGame.timeEl.textContent = '30';
    }

    function createChickenHoles() {
        if (!chickenGame.arenaEl) return;
        
        // Utiliser DocumentFragment
        const fragment = document.createDocumentFragment();
        chickenGame.arenaEl.innerHTML = '';
        chickenGame.holes = [];
        
        // Créer une grille 3x3 de trous
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'chicken-hole';
            hole.dataset.index = i;
            fragment.appendChild(hole);
            chickenGame.holes.push(hole);
        }
        
        chickenGame.arenaEl.appendChild(fragment);
    }

    function startChickenGame() {
        chickenGame.gameRunning = true;
        
        // Timer optimisé
        chickenGame.timer = setInterval(() => {
            chickenGame.time--;
            if (chickenGame.timeEl) chickenGame.timeEl.textContent = chickenGame.time;
            
            if (chickenGame.time <= 0) {
                endChickenGame();
            }
        }, 1000);
        
        // Spawn poulets (intervalle réduit : 1200ms au lieu de 1500ms)
        spawnChicken();
        chickenGame.spawnInterval = setInterval(() => {
            if (chickenGame.gameRunning && chickenGame.activeChickens.length < 3) {
                spawnChicken();
            }
        }, 1200);
    }

    function spawnChicken() {
        if (!chickenGame.gameRunning || !chickenGame.arenaEl) return;
        
        // Trouver un trou libre (optimisé)
        const availableHoles = [];
        for (let i = 0; i < chickenGame.holes.length; i++) {
            if (!chickenGame.holes[i].querySelector('.chicken')) {
                availableHoles.push(chickenGame.holes[i]);
            }
        }
        
        if (availableHoles.length === 0) return;
        
        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const chicken = document.createElement('div');
        chicken.className = 'chicken';
        chicken.textContent = '🍗';
        chicken.style.willChange = 'transform, opacity';
        
        // Utiliser une fonction optimisée pour le clic
        const hitHandler = () => {
            if (chickenGame.gameRunning) {
                hitChicken(chicken);
            }
        };
        chicken.addEventListener('click', hitHandler, { passive: true });
        
        randomHole.appendChild(chicken);
        chickenGame.activeChickens.push({ element: chicken, hole: randomHole, hitHandler: hitHandler });
        
        // Animation d'apparition immédiate (requestAnimationFrame)
        requestAnimationFrame(() => {
            chicken.classList.add('appear');
        });
        
        // Le poulet disparaît après 1.5-3 secondes (réduit)
        const disappearTime = 1500 + Math.random() * 1500;
        setTimeout(() => {
            if (chicken.parentNode && chickenGame.gameRunning) {
                removeChicken(chicken);
            }
        }, disappearTime);
    }

    function hitChicken(chicken) {
        chicken.classList.add('hit');
        chickenGame.score += 10;
        if (chickenGame.scoreEl) chickenGame.scoreEl.textContent = chickenGame.score;
        
        // Effet de particules (réduit à 3 au lieu de 5)
        createHitEffect(chicken);
        
        // Retirer immédiatement
        removeChicken(chicken);
    }

    function removeChicken(chicken) {
        chicken.classList.add('disappear');
        // Retirer l'event listener
        const chickenData = chickenGame.activeChickens.find(c => c.element === chicken);
        if (chickenData && chickenData.hitHandler) {
            chicken.removeEventListener('click', chickenData.hitHandler);
        }
        
        setTimeout(() => {
            if (chicken.parentNode) {
                chicken.remove();
            }
            chickenGame.activeChickens = chickenGame.activeChickens.filter(c => c.element !== chicken);
        }, 200); // Réduit de 300ms à 200ms
    }

    function createHitEffect(chicken) {
        if (!chickenGame.arenaEl) return;
        
        const rect = chicken.getBoundingClientRect();
        const arenaRect = chickenGame.arenaEl.getBoundingClientRect();
        
        // Réduire à 3 particules
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'hit-particle';
            const angle = (Math.PI * 2 * i) / 3;
            const distance = 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.left = (rect.left - arenaRect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top - arenaRect.top + rect.height / 2) + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.willChange = 'transform, opacity';
            chickenGame.arenaEl.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 400); // Réduit de 500ms à 400ms
        }
    }

    function endChickenGame() {
        chickenGame.gameRunning = false;
        if (chickenGame.timer) clearInterval(chickenGame.timer);
        if (chickenGame.spawnInterval) clearInterval(chickenGame.spawnInterval);
        
        // Retirer tous les poulets
        chickenGame.activeChickens.forEach(({ element, hitHandler }) => {
            if (hitHandler) element.removeEventListener('click', hitHandler);
            removeChicken(element);
        });
        
        setTimeout(() => {
            if (chickenGame.arenaEl) {
                chickenGame.arenaEl.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem; color: var(--primary-color); flex-direction: column; gap: 20px;">
                    <div>🎉 Temps écoulé !</div>
                    <div>Score final: ${chickenGame.score}</div>
                </div>`;
            }
        }, 300); // Réduit de 500ms à 300ms
    }

    // ============================================
    // GESTION DU CURSEUR DANS LES JEUX
    // ============================================
    function restoreCursorInGame(overlay) {
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.style.display = 'none';
        }
        
        document.body.style.cursor = 'auto';
        overlay.style.cursor = 'auto';
        
        const interactiveElements = overlay.querySelectorAll('button, .chicken, .manga-card, .ice-cream-scoop, .chicken-hole');
        interactiveElements.forEach(el => {
            if (el.tagName === 'BUTTON' || el.classList.contains('chicken') || el.classList.contains('manga-card')) {
                el.style.cursor = 'pointer';
            } else {
                el.style.cursor = 'auto';
            }
        });
    }
    
    function restoreCustomCursor() {
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.style.display = 'block';
        }
        document.body.style.cursor = 'none';
    }

    // ============================================
    // FONCTION GÉNÉRALE DE FERMETURE
    // ============================================
    window.closeGame = function(gameType) {
        const overlay = document.getElementById(`${gameType}-game-overlay`);
        if (overlay) {
            overlay.classList.remove('active');
            restoreCustomCursor();
        }
        
        // Reset games
        if (gameType === 'ice-cream') {
            iceCreamGame.gameRunning = false;
            if (iceCreamGame.animationFrame) {
                cancelAnimationFrame(iceCreamGame.animationFrame);
            }
            if (iceCreamGame.stackEl) {
                iceCreamGame.stackEl.removeEventListener('click', placeScoop);
            }
        } else if (gameType === 'chicken') {
            chickenGame.gameRunning = false;
            if (chickenGame.timer) clearInterval(chickenGame.timer);
            if (chickenGame.spawnInterval) clearInterval(chickenGame.spawnInterval);
        }
    };
});
