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

    const BASE = '../ressources/meme-ory/';
    const MEME_IMAGES = Array.from({ length: 16 }, (_, i) => BASE + 'meme' + (i + 1) + '.png');

    const DIFFICULTIES = {
        easy:   { pairs: 4,  timeSec: 90,  label: 'Facile' },
        medium: { pairs: 6,  timeSec: 120, label: 'Moyen' },
        hard:   { pairs: 8,  timeSec: 150, label: 'Difficile' }
    };

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

    function createCardElement(imageSrc, pairId, index) {
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
        img.src = imageSrc;
        img.alt = '';
        img.loading = 'lazy';
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
            if (resultTitleEl) resultTitleEl.textContent = 'GG, tu as tout trouvé !';
            if (finalMovesEl) finalMovesEl.textContent = moves.toString();
            if (finalTimeEl) finalTimeEl.textContent = timeLeft + 's restants';
            if (winOverlay) {
                winOverlay.setAttribute('aria-hidden', 'false');
                winOverlay.classList.add('show');
            }
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

        if (grid) {
            grid.innerHTML = '';
            cards.forEach((item, index) => {
                const cardEl = createCardElement(item.imageSrc, item.pairId, index);
                cardEl.style.animationDelay = (index * 0.04) + 's';
                grid.appendChild(cardEl);
            });
        }
    }

    function setDifficulty(diff) {
        if (!DIFFICULTIES[diff]) return;
        currentDifficulty = diff;
        document.querySelectorAll('.meme-diff-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-diff') === diff);
        });
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
