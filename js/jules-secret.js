/**
 * Script pour la page secrète Jules - Mini-jeux améliorés
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'année
    const yearElement = document.getElementById('current-year-jules');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ============================================
    // MINI-JEU 1 : STAND DE GLACE - STACK GAME
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
        direction: 1, // 1 = droite, -1 = gauche
        gameInterval: null,
        fallInterval: null
    };

    window.openIceCreamGame = function() {
        const overlay = document.getElementById('ice-cream-game-overlay');
        overlay.classList.add('active');
        // Restaurer le curseur normal dans le jeu
        restoreCursorInGame(overlay);
        resetIceCreamGame();
        startIceCreamGame();
    };

    function resetIceCreamGame() {
        iceCreamGame.score = 0;
        iceCreamGame.stack = [];
        iceCreamGame.speed = 2;
        iceCreamGame.currentWidth = iceCreamGame.baseWidth;
        iceCreamGame.direction = 1;
        iceCreamGame.gameRunning = true;
        
        const stack = document.getElementById('ice-cream-stack');
        stack.innerHTML = '';
        document.getElementById('ice-cream-score').textContent = '0';
        document.getElementById('ice-cream-level').textContent = '1';
    }

    function startIceCreamGame() {
        const stack = document.getElementById('ice-cream-stack');
        
        // Créer la première boule qui bouge
        createFallingScoop();
        
        // Détection du clic pour placer la boule
        stack.addEventListener('click', placeScoop);
    }

    function createFallingScoop() {
        if (!iceCreamGame.gameRunning) return;
        
        const stack = document.getElementById('ice-cream-stack');
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
        
        stack.appendChild(iceCreamGame.fallingScoop);
        
        // Animation de mouvement horizontal
        let position = 0;
        const maxPosition = (stack.offsetWidth - iceCreamGame.currentWidth) / 2;
        
        iceCreamGame.fallInterval = setInterval(() => {
            if (!iceCreamGame.gameRunning) {
                clearInterval(iceCreamGame.fallInterval);
                return;
            }
            
            position += iceCreamGame.speed * iceCreamGame.direction;
            
            if (position >= maxPosition || position <= -maxPosition) {
                iceCreamGame.direction *= -1;
            }
            
            if (iceCreamGame.fallingScoop) {
                iceCreamGame.fallingScoop.style.left = `calc(50% + ${position}px)`;
            }
        }, 16);
    }

    function placeScoop() {
        if (!iceCreamGame.gameRunning || !iceCreamGame.fallingScoop) return;
        
        const stack = document.getElementById('ice-cream-stack');
        const falling = iceCreamGame.fallingScoop;
        const rect = falling.getBoundingClientRect();
        const stackRect = stack.getBoundingClientRect();
        const leftOffset = rect.left - stackRect.left;
        const scoopWidth = rect.width;
        
        // Vérifier si la boule est bien placée (tolérance de 20px)
        const lastScoop = iceCreamGame.stack[iceCreamGame.stack.length - 1];
        let isValid = true;
        
        if (lastScoop) {
            const lastRect = lastScoop.getBoundingClientRect();
            const lastLeft = lastRect.left - stackRect.left;
            const diff = Math.abs(leftOffset - lastLeft);
            
            if (diff > 20) {
                // Game Over
                endIceCreamGame();
                return;
            }
            
            // Réduire la largeur pour le prochain niveau
            iceCreamGame.currentWidth = Math.max(40, iceCreamGame.currentWidth - 2);
        }
        
        // Placer la boule
        clearInterval(iceCreamGame.fallInterval);
        falling.classList.remove('falling-scoop');
        falling.style.position = 'relative';
        falling.style.bottom = 'auto';
        falling.style.left = 'auto';
        falling.style.transform = 'none';
        falling.style.width = scoopWidth + 'px';
        falling.style.height = scoopWidth + 'px';
        falling.style.margin = '0 auto';
        
        iceCreamGame.stack.push(falling);
        iceCreamGame.score += 10;
        document.getElementById('ice-cream-score').textContent = iceCreamGame.score;
        
        // Augmenter la difficulté
        if (iceCreamGame.stack.length % 5 === 0) {
            iceCreamGame.speed += 0.5;
            document.getElementById('ice-cream-level').textContent = Math.floor(iceCreamGame.stack.length / 5) + 1;
        }
        
        // Créer la prochaine boule
        setTimeout(() => {
            if (iceCreamGame.gameRunning) {
                createFallingScoop();
            }
        }, 300);
    }

    function endIceCreamGame() {
        iceCreamGame.gameRunning = false;
        clearInterval(iceCreamGame.fallInterval);
        
        const stack = document.getElementById('ice-cream-stack');
        stack.removeEventListener('click', placeScoop);
        
        if (iceCreamGame.fallingScoop) {
            iceCreamGame.fallingScoop.style.animation = 'shake 0.5s';
            setTimeout(() => {
                if (iceCreamGame.fallingScoop) {
                    iceCreamGame.fallingScoop.remove();
                }
            }, 500);
        }
        
        setTimeout(() => {
            alert(`🎉 Game Over !\nScore: ${iceCreamGame.score}\nHauteur: ${iceCreamGame.stack.length} boules`);
        }, 600);
    }

    // ============================================
    // MINI-JEU 2 : STAND DE MANGAS - MEMORY GAME
    // ============================================
    let mangaGame = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: 8,
        canFlip: true,
        moves: 0
    };

    const mangaEmojis = ['📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒'];

    window.openMangaGame = function() {
        const overlay = document.getElementById('manga-game-overlay');
        overlay.classList.add('active');
        // Restaurer le curseur normal dans le jeu
        restoreCursorInGame(overlay);
        resetMangaGame();
        generateMangaCards();
    };

    function resetMangaGame() {
        mangaGame.cards = [];
        mangaGame.flippedCards = [];
        mangaGame.matchedPairs = 0;
        mangaGame.canFlip = true;
        mangaGame.moves = 0;
        
        document.getElementById('manga-score').textContent = '0';
        document.getElementById('manga-moves').textContent = '0';
    }

    function generateMangaCards() {
        const shelf = document.getElementById('manga-shelf');
        shelf.innerHTML = '';
        
        // Créer des paires
        let cardPairs = [];
        mangaEmojis.forEach((emoji, index) => {
            cardPairs.push({ id: index, emoji: emoji });
            cardPairs.push({ id: index, emoji: emoji });
        });
        
        // Mélanger
        cardPairs.sort(() => Math.random() - 0.5);
        
        // Créer les cartes
        cardPairs.forEach((pair, index) => {
            const card = document.createElement('div');
            card.className = 'manga-card';
            card.dataset.id = pair.id;
            card.dataset.index = index;
            card.innerHTML = '<div class="manga-card-back">?</div><div class="manga-card-front">' + pair.emoji + '</div>';
            
            card.addEventListener('click', () => flipCard(card));
            shelf.appendChild(card);
            mangaGame.cards.push(card);
        });
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
            document.getElementById('manga-moves').textContent = mangaGame.moves;
            
            setTimeout(() => {
                checkMatch();
            }, 1000);
        }
    }

    function checkMatch() {
        const [card1, card2] = mangaGame.flippedCards;
        
        if (card1.dataset.id === card2.dataset.id) {
            // Match !
            card1.classList.add('matched');
            card2.classList.add('matched');
            mangaGame.matchedPairs++;
            document.getElementById('manga-score').textContent = mangaGame.matchedPairs;
            
            if (mangaGame.matchedPairs === mangaGame.totalPairs) {
                setTimeout(() => {
                    alert(`🎉 Félicitations !\nVous avez trouvé toutes les paires en ${mangaGame.moves} coups !`);
                }, 500);
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
    // MINI-JEU 3 : STAND DE POULET - WHACK-A-MOLE
    // ============================================
    let chickenGame = {
        score: 0,
        time: 30,
        gameRunning: false,
        timer: null,
        spawnInterval: null,
        activeChickens: [],
        holes: []
    };

    window.openChickenGame = function() {
        const overlay = document.getElementById('chicken-game-overlay');
        overlay.classList.add('active');
        // Restaurer le curseur normal dans le jeu
        restoreCursorInGame(overlay);
        resetChickenGame();
        createChickenHoles();
        startChickenGame();
    };

    function resetChickenGame() {
        chickenGame.score = 0;
        chickenGame.time = 30;
        chickenGame.gameRunning = false;
        chickenGame.activeChickens = [];
        
        document.getElementById('chicken-score').textContent = '0';
        document.getElementById('chicken-time').textContent = '30';
    }

    function createChickenHoles() {
        const arena = document.getElementById('chicken-arena');
        arena.innerHTML = '';
        chickenGame.holes = [];
        
        // Créer une grille 3x3 de trous
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'chicken-hole';
            hole.dataset.index = i;
            arena.appendChild(hole);
            chickenGame.holes.push(hole);
        }
    }

    function startChickenGame() {
        chickenGame.gameRunning = true;
        
        // Timer
        chickenGame.timer = setInterval(() => {
            chickenGame.time--;
            document.getElementById('chicken-time').textContent = chickenGame.time;
            
            if (chickenGame.time <= 0) {
                endChickenGame();
            }
        }, 1000);
        
        // Spawn poulets
        spawnChicken();
        chickenGame.spawnInterval = setInterval(() => {
            if (chickenGame.gameRunning && chickenGame.activeChickens.length < 3) {
                spawnChicken();
            }
        }, 1500);
    }

    function spawnChicken() {
        if (!chickenGame.gameRunning) return;
        
        // Trouver un trou libre
        const availableHoles = chickenGame.holes.filter(hole => {
            return !hole.querySelector('.chicken');
        });
        
        if (availableHoles.length === 0) return;
        
        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const chicken = document.createElement('div');
        chicken.className = 'chicken';
        chicken.textContent = '🍗';
        
        chicken.addEventListener('click', () => {
            if (chickenGame.gameRunning) {
                hitChicken(chicken);
            }
        });
        
        randomHole.appendChild(chicken);
        chickenGame.activeChickens.push({ element: chicken, hole: randomHole });
        
        // Animation d'apparition
        setTimeout(() => {
            chicken.classList.add('appear');
        }, 10);
        
        // Le poulet disparaît après 2-4 secondes
        const disappearTime = 2000 + Math.random() * 2000;
        setTimeout(() => {
            if (chicken.parentNode && chickenGame.gameRunning) {
                removeChicken(chicken);
            }
        }, disappearTime);
    }

    function hitChicken(chicken) {
        chicken.classList.add('hit');
        chickenGame.score += 10;
        document.getElementById('chicken-score').textContent = chickenGame.score;
        
        // Effet de particules
        createHitEffect(chicken);
        
        setTimeout(() => {
            removeChicken(chicken);
        }, 300);
    }

    function removeChicken(chicken) {
        chicken.classList.add('disappear');
        setTimeout(() => {
            if (chicken.parentNode) {
                chicken.remove();
            }
            chickenGame.activeChickens = chickenGame.activeChickens.filter(c => c.element !== chicken);
        }, 300);
    }

    function createHitEffect(chicken) {
        const rect = chicken.getBoundingClientRect();
        const arena = document.getElementById('chicken-arena');
        const arenaRect = arena.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'hit-particle';
            const angle = (Math.PI * 2 * i) / 5;
            const distance = 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.left = (rect.left - arenaRect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top - arenaRect.top + rect.height / 2) + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            arena.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 500);
        }
    }

    function endChickenGame() {
        chickenGame.gameRunning = false;
        clearInterval(chickenGame.timer);
        clearInterval(chickenGame.spawnInterval);
        
        // Retirer tous les poulets
        chickenGame.activeChickens.forEach(({ element }) => {
            removeChicken(element);
        });
        
        setTimeout(() => {
            const arena = document.getElementById('chicken-arena');
            arena.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem; color: var(--primary-color); flex-direction: column; gap: 20px;">
                <div>🎉 Temps écoulé !</div>
                <div>Score final: ${chickenGame.score}</div>
            </div>`;
        }, 500);
    }

    // ============================================
    // GESTION DU CURSEUR DANS LES JEUX
    // ============================================
    function restoreCursorInGame(overlay) {
        // Cacher le curseur personnalisé
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.style.display = 'none';
        }
        
        // Restaurer le curseur normal sur le body et l'overlay
        document.body.style.cursor = 'auto';
        overlay.style.cursor = 'auto';
        
        // S'assurer que tous les éléments interactifs dans l'overlay ont le bon curseur
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
        // Restaurer le curseur personnalisé
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
            // Restaurer le curseur personnalisé
            restoreCustomCursor();
        }
        
        // Reset games
        if (gameType === 'ice-cream') {
            iceCreamGame.gameRunning = false;
            clearInterval(iceCreamGame.fallInterval);
            const stack = document.getElementById('ice-cream-stack');
            stack.removeEventListener('click', placeScoop);
        } else if (gameType === 'chicken') {
            chickenGame.gameRunning = false;
            if (chickenGame.timer) clearInterval(chickenGame.timer);
            if (chickenGame.spawnInterval) clearInterval(chickenGame.spawnInterval);
        }
    };
});
