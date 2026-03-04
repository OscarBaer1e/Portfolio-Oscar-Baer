document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('meme-grid');
    if (!grid) return;

    const movesEl = document.getElementById('meme-moves');
    const matchesEl = document.getElementById('meme-matches');
    const timeEl = document.getElementById('meme-time');
    const restartBtn = document.getElementById('meme-restart');
    const winOverlay = document.getElementById('meme-win-overlay');
    const timeoverOverlay = document.getElementById('meme-timeover-overlay');
    const playAgainBtn = document.getElementById('meme-play-again');
    const timeoverRetryBtn = document.getElementById('meme-timeover-retry');
    const finalMovesEl = document.getElementById('meme-final-moves');
    const finalTimeEl = document.getElementById('meme-final-time');
    const resultTitleEl = document.getElementById('meme-result-title');
    const resultTextEl = document.getElementById('meme-result-text');
    const timeoverMatchesEl = document.getElementById('meme-timeover-matches');

    /*
     * MEME-ORY – Ce qui peut empêcher les images de s’afficher en ligne :
     * 1. Chemins : on utilise une base absolue (origin + racine du site + ressources/meme-ory/).
     * 2. Casse : le dossier doit s’appeler exactement "ressources" (minuscules), pas "Ressources".
     * 3. Déploiement : les fichiers ressources/meme-ory/meme1.png … meme16.png doivent être poussés sur le repo (pas dans .gitignore).
     * 4. Hébergeur : le site doit être servi en HTTPS (ou en HTTP partout), pas en file://.
     * 5. GitHub Pages : si le site est dans un repo type "user.github.io/repo", l’URL contient /repo/ ; la détection de base gère ça.
     */
    function getMemeImageBase() {
        try {
            var pathname = window.location.pathname || '';
            var basePath = '/';
            var idx = pathname.indexOf('/pages/');
            if (idx !== -1) {
                basePath = pathname.substring(0, idx) + '/';
            }
            return window.location.origin + basePath + 'ressources/meme-ory/';
        } catch (e) {
            return '../ressources/meme-ory/';
        }
    }
    const MEME_IMAGES = Array.from({ length: 16 }, (_, i) => getMemeImageBase() + 'meme' + (i + 1) + '.png');

    // Niveau 1 = 8 paires (obligatoire), puis déblocage niveau 2, puis 3
    const DIFFICULTIES = {
        easy:   { pairs: 8, timeSec: 150, label: 'Niveau 1', level: 1 },
        medium: { pairs: 8, timeSec: 120, label: 'Niveau 2', level: 2 },
        hard:   { pairs: 8, timeSec: 90,  label: 'Niveau 3', level: 3 }
    };

    const STORAGE_KEY = 'memeoryUnlockedLevel';
    function getUnlockedLevel() {
        try {
            const n = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
            return Math.max(1, Math.min(3, n));
        } catch (e) { return 1; }
    }
    function setUnlockedLevel(level) {
        try {
            localStorage.setItem(STORAGE_KEY, String(Math.max(getUnlockedLevel(), level)));
        } catch (e) {}
    }

    let currentDifficulty = 'easy';
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let timeLeft = 0;
    let timerId = null;
    let gameStarted = false;

    function getConfig() {
        return DIFFICULTIES[currentDifficulty];
    }

    function startCountdown() {
        const config = getConfig();
        timeLeft = config.timeSec;
        if (timeEl) timeEl.textContent = timeLeft + 's';
        timeEl?.classList.remove('meme-timer-warning', 'meme-timer-danger');
        if (timerId) clearInterval(timerId);
        timerId = setInterval(() => {
            timeLeft--;
            if (timeEl) {
                timeEl.textContent = timeLeft + 's';
                if (timeLeft <= 10) {
                    timeEl.classList.add('meme-timer-danger');
                    timeEl.classList.remove('meme-timer-warning');
                } else if (timeLeft <= 20) {
                    timeEl.classList.add('meme-timer-warning');
                }
            }
            if (timeLeft <= 0) {
                stopTimer();
                gameOverTime();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function shuffle(array) {
        const a = [...array];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function createCardElement(pairId, index) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'meme-card';
        card.setAttribute('data-index', index.toString());
        card.setAttribute('data-pair-id', pairId.toString());
        card.setAttribute('aria-label', 'Carte mème masquée');

        const inner = document.createElement('div');
        inner.className = 'meme-card-inner';

        const front = document.createElement('div');
        front.className = 'meme-card-face meme-card-front';
        front.innerHTML = '<span class="meme-card-question">?</span>';

        const back = document.createElement('div');
        back.className = 'meme-card-face meme-card-back';
        const img = document.createElement('img');
        img.alt = '';
        img.loading = 'eager';
        img.referrerPolicy = 'no-referrer';
        img.setAttribute('data-meme-src', 'meme' + (pairId + 1) + '.png');
        img.onerror = function() {
            this.style.background = 'linear-gradient(135deg, #333, #111)';
            this.style.minHeight = '100%';
            this.onerror = null;
        };
        back.appendChild(img);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => onCardClick(card, pairId));

        return card;
    }

    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function onCardClick(card, pairId) {
        if (lockBoard) return;
        if (card.classList.contains('matched') || card.classList.contains('flipped')) return;

        if (!gameStarted) {
            gameStarted = true;
            startCountdown();
        }

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = { card, pairId };
            return;
        }

        if (!secondCard && card !== firstCard.card) {
            secondCard = { card, pairId };
            moves++;
            if (movesEl) movesEl.textContent = moves.toString();
            checkForMatch();
        }
    }

    function checkForMatch() {
        if (!firstCard || !secondCard) return;

        lockBoard = true;
        const isMatch = firstCard.pairId === secondCard.pairId;

        if (isMatch) {
            firstCard.card.classList.add('matched', 'meme-match-pop');
            secondCard.card.classList.add('matched', 'meme-match-pop');
            matches++;
            if (matchesEl) matchesEl.textContent = matches.toString();
            setTimeout(() => {
                firstCard.card.classList.remove('meme-match-pop');
                secondCard.card.classList.remove('meme-match-pop');
                resetBoard();
                checkVictory();
            }, 450);
        } else {
            setTimeout(() => {
                firstCard.card.classList.remove('flipped');
                secondCard.card.classList.remove('flipped');
                resetBoard();
            }, 700);
        }
    }

    function checkVictory() {
        const config = getConfig();
        if (matches === config.pairs) {
            stopTimer();
            const level = config.level || 1;
            setUnlockedLevel(level + 1);
            if (resultTitleEl) resultTitleEl.textContent = level < 3 ? 'Niveau ' + level + ' réussi !' : 'GG, tu as tout fini !';
            if (finalMovesEl) finalMovesEl.textContent = moves.toString();
            if (finalTimeEl) finalTimeEl.textContent = timeLeft + 's restants';
            if (winOverlay) {
                winOverlay.setAttribute('aria-hidden', 'false');
                winOverlay.classList.add('show');
            }
            updateDifficultyButtons();
        }
    }

    function gameOverTime() {
        if (timeoverMatchesEl) timeoverMatchesEl.textContent = matches.toString();
        if (timeoverOverlay) {
            timeoverOverlay.setAttribute('aria-hidden', 'false');
            timeoverOverlay.classList.add('show');
        }
    }

    function hideOverlays() {
        if (winOverlay) {
            winOverlay.classList.remove('show');
            winOverlay.setAttribute('aria-hidden', 'true');
        }
        if (timeoverOverlay) {
            timeoverOverlay.classList.remove('show');
            timeoverOverlay.setAttribute('aria-hidden', 'true');
        }
    }

    function setGridClass() {
        grid.className = 'meme-ory-grid meme-diff-' + currentDifficulty;
    }

    function initGame() {
        const config = getConfig();
        const pairIds = shuffle(MEME_IMAGES.slice(0, config.pairs).map((_, i) => i));
        const deck = shuffle([...pairIds, ...pairIds]);
        cards = deck.map((pairId, index) => ({ pairId, imageSrc: MEME_IMAGES[pairId] }));

        firstCard = null;
        secondCard = null;
        lockBoard = false;
        moves = 0;
        matches = 0;
        gameStarted = false;
        stopTimer();

        if (movesEl) movesEl.textContent = '0';
        if (matchesEl) matchesEl.textContent = '0';
        if (timeEl) {
            timeEl.textContent = config.timeSec + 's';
            timeEl.classList.remove('meme-timer-warning', 'meme-timer-danger');
        }
        resetBoard();
        hideOverlays();
        setGridClass();
        updateDifficultyButtons();

        if (grid) {
            grid.innerHTML = '';
            const base = getMemeImageBase();
            requestAnimationFrame(function() {
                cards.forEach((item, index) => {
                    const cardEl = createCardElement(item.pairId, index);
                    cardEl.style.animationDelay = (index * 0.04) + 's';
                    grid.appendChild(cardEl);
                    var img = cardEl.querySelector('.meme-card-back img');
                    if (img && img.getAttribute('data-meme-src')) {
                        img.src = base + img.getAttribute('data-meme-src');
                    }
                });
            });
        }
    }

    function updateDifficultyButtons() {
        const unlocked = getUnlockedLevel();
        document.querySelectorAll('.meme-diff-btn').forEach(btn => {
            const diff = btn.getAttribute('data-diff');
            const cfg = DIFFICULTIES[diff];
            const level = cfg && cfg.level ? cfg.level : 1;
            const isLocked = level > unlocked;
            btn.classList.toggle('locked', isLocked);
            btn.disabled = isLocked;
            btn.classList.toggle('active', !isLocked && diff === currentDifficulty);
        });
    }

    function setDifficulty(diff) {
        if (!DIFFICULTIES[diff]) return;
        const cfg = DIFFICULTIES[diff];
        const level = cfg && cfg.level ? cfg.level : 1;
        if (level > getUnlockedLevel()) return;
        currentDifficulty = diff;
        updateDifficultyButtons();
        initGame();
    }

    document.querySelectorAll('.meme-diff-btn').forEach(btn => {
        btn.addEventListener('click', () => setDifficulty(btn.getAttribute('data-diff')));
    });

    if (restartBtn) restartBtn.addEventListener('click', () => initGame());
    if (playAgainBtn) playAgainBtn.addEventListener('click', () => initGame());
    if (timeoverRetryBtn) timeoverRetryBtn.addEventListener('click', () => initGame());

    initGame();
});
