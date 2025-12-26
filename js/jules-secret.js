/**
 * Script pour la page secrète Jules - Mini-jeux
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'année
    const yearElement = document.getElementById('current-year-jules');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mini-jeu Glace
    let iceCreamStack = [];
    let iceCreamScore = 0;

    window.openIceCreamGame = function() {
        document.getElementById('ice-cream-game-overlay').classList.add('active');
        updateIceCreamDisplay();
    };

    window.addScoop = function(flavor) {
        iceCreamStack.push(flavor);
        iceCreamScore += 10;
        if (iceCreamStack.length >= 3) {
            iceCreamScore += 20; // Bonus pour les grandes glaces
        }
        document.getElementById('ice-cream-score').textContent = iceCreamScore;
        updateIceCreamDisplay();
    };

    window.clearStack = function() {
        iceCreamStack = [];
        updateIceCreamDisplay();
    };

    function updateIceCreamDisplay() {
        const stack = document.getElementById('ice-cream-stack');
        stack.innerHTML = '';
        
        if (iceCreamStack.length === 0) {
            stack.innerHTML = '<p style="color: var(--dim-text-color);">Commencez à empiler vos boules !</p>';
        } else {
            iceCreamStack.forEach((flavor, index) => {
                const scoop = document.createElement('div');
                scoop.className = `ice-cream-scoop scoop-${flavor}`;
                scoop.textContent = '🍦';
                scoop.style.animationDelay = `${index * 0.1}s`;
                stack.appendChild(scoop);
            });
        }
    }

    // Mini-jeu Mangas
    let mangaCollection = [];
    const mangaTitles = ['📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '📕', '📗'];

    window.openMangaGame = function() {
        document.getElementById('manga-game-overlay').classList.add('active');
        generateMangaShelf();
    };

    function generateMangaShelf() {
        const shelf = document.getElementById('manga-shelf');
        shelf.innerHTML = '';
        
        mangaTitles.forEach((title, index) => {
            const book = document.createElement('div');
            book.className = 'manga-book';
            book.textContent = title;
            book.dataset.index = index;
            
            if (mangaCollection.includes(index)) {
                book.style.opacity = '0.3';
                book.style.cursor = 'not-allowed';
            } else {
                book.addEventListener('click', () => collectManga(index));
            }
            
            shelf.appendChild(book);
        });
    }

    function collectManga(index) {
        if (!mangaCollection.includes(index)) {
            mangaCollection.push(index);
            document.getElementById('manga-score').textContent = mangaCollection.length;
            generateMangaShelf();
            
            // Animation de collection
            const book = document.querySelector(`[data-index="${index}"]`);
            if (book) {
                book.style.animation = 'chickenCaught 0.5s ease-out';
            }
            
            if (mangaCollection.length === mangaTitles.length) {
                setTimeout(() => {
                    alert('🎉 Félicitations ! Vous avez collecté tous les mangas !');
                }, 600);
            }
        }
    }

    window.resetMangaGame = function() {
        mangaCollection = [];
        document.getElementById('manga-score').textContent = '0';
        generateMangaShelf();
    };

    // Mini-jeu Poulet
    let chickenScore = 0;
    let chickenTime = 30;
    let chickenGameInterval;
    let chickenSpawnInterval;

    window.openChickenGame = function() {
        document.getElementById('chicken-game-overlay').classList.add('active');
        chickenScore = 0;
        chickenTime = 30;
        document.getElementById('chicken-score').textContent = chickenScore;
        document.getElementById('chicken-time').textContent = chickenTime;
        startChickenGame();
    };

    function startChickenGame() {
        const arena = document.getElementById('chicken-arena');
        if (!arena) return;
        
        arena.innerHTML = '';
        
        // Timer
        const timer = setInterval(() => {
            chickenTime--;
            const timeElement = document.getElementById('chicken-time');
            if (timeElement) {
                timeElement.textContent = chickenTime;
            }
            
            if (chickenTime <= 0) {
                clearInterval(timer);
                if (chickenSpawnInterval) {
                    clearInterval(chickenSpawnInterval);
                }
                endChickenGame();
            }
        }, 1000);
        
        // Spawn poulets
        chickenSpawnInterval = setInterval(() => {
            spawnChicken();
        }, 1500);
        
        spawnChicken(); // Premier poulet
    }

    function spawnChicken() {
        const arena = document.getElementById('chicken-arena');
        if (!arena) return;
        
        const chicken = document.createElement('div');
        chicken.className = 'chicken';
        chicken.textContent = '🍗';
        chicken.style.left = Math.random() * (arena.offsetWidth - 60) + 'px';
        chicken.style.top = Math.random() * (arena.offsetHeight - 60) + 'px';
        
        chicken.addEventListener('click', () => {
            chicken.classList.add('caught');
            chickenScore += 10;
            const scoreElement = document.getElementById('chicken-score');
            if (scoreElement) {
                scoreElement.textContent = chickenScore;
            }
            
            setTimeout(() => {
                chicken.remove();
            }, 500);
        });
        
        arena.appendChild(chicken);
        
        // Le poulet disparaît après 3 secondes
        setTimeout(() => {
            if (chicken.parentNode) {
                chicken.style.opacity = '0';
                chicken.style.transform = 'scale(0)';
                setTimeout(() => chicken.remove(), 300);
            }
        }, 3000);
    }

    function endChickenGame() {
        const arena = document.getElementById('chicken-arena');
        if (arena) {
            arena.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem; color: var(--primary-color);">🎉 Score final: ${chickenScore}</div>`;
        }
    }

    window.closeGame = function(gameType) {
        const overlay = document.getElementById(`${gameType}-game-overlay`);
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Reset games
        if (gameType === 'chicken') {
            if (chickenGameInterval) clearInterval(chickenGameInterval);
            if (chickenSpawnInterval) clearInterval(chickenSpawnInterval);
        }
    };
});
