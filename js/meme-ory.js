document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('meme-grid');
    if (!grid) return;

    const movesEl = document.getElementById('meme-moves');
    const matchesEl = document.getElementById('meme-matches');
    const timeEl = document.getElementById('meme-time');
    const restartBtn = document.getElementById('meme-restart');
    const winOverlay = document.getElementById('meme-win-overlay');
    const playAgainBtn = document.getElementById('meme-play-again');
    const finalMovesEl = document.getElementById('meme-final-moves');
    const finalTimeEl = document.getElementById('meme-final-time');

    const MEME_IMAGES_BASE = '../ressources/meme-ory';
    const MEME_IMAGES = [
        `${MEME_IMAGES_BASE}/meme-1.png`,
        `${MEME_IMAGES_BASE}/meme-2.png`,
        `${MEME_IMAGES_BASE}/meme-3.png`,
        `${MEME_IMAGES_BASE}/meme-4.png`,
        `${MEME_IMAGES_BASE}/meme-5.png`,
        `${MEME_IMAGES_BASE}/meme-6.png`,
        `${MEME_IMAGES_BASE}/meme-7.png`,
        `${MEME_IMAGES_BASE}/meme-8.png`
    ];

    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let startTime = null;
    let timerId = null;

    function startTimer() {
        startTime = Date.now();
        if (timerId) clearInterval(timerId);
        timerId = setInterval(() => {
            const diff = Math.floor((Date.now() - startTime) / 1000);
            if (timeEl) timeEl.textContent = diff + 's';
        }, 1000);
    }

    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCardElement(imageSrc, index) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'meme-card';
        card.setAttribute('data-index', index.toString());
        card.setAttribute('aria-label', 'Carte mème masquée');
        card.style.animationDelay = `${index * 0.04}s`;

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
        img.loading = 'eager';
        img.className = 'meme-card-img';
        img.decode().catch(() => {});
        back.appendChild(img);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => onCardClick(card, imageSrc));

        return card;
    }

    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function onCardClick(card, imageSrc) {
        if (lockBoard) return;
        if (card.classList.contains('matched') || card.classList.contains('flipped')) return;

        if (moves === 0 && matches === 0 && !startTime) {
            startTimer();
        }

        card.classList.add('flipped');
        card.classList.add('meme-card-reveal');

        if (!firstCard) {
            firstCard = { card, label: imageSrc };
            return;
        }

        if (!secondCard && card !== firstCard.card) {
            secondCard = { card, label: imageSrc };
            moves++;
            if (movesEl) movesEl.textContent = moves.toString();
            checkForMatch();
        }
    }

    function checkForMatch() {
        if (!firstCard || !secondCard) return;

        lockBoard = true;
        const isMatch = firstCard.label === secondCard.label;

        if (isMatch) {
            firstCard.card.classList.add('matched', 'meme-card-match');
            secondCard.card.classList.add('matched', 'meme-card-match');
            matches++;
            if (matchesEl) matchesEl.textContent = matches.toString();
            setTimeout(() => {
                firstCard.card.classList.remove('meme-card-match');
                secondCard.card.classList.remove('meme-card-match');
                resetBoard();
                checkVictory();
            }, 500);
        } else {
            setTimeout(() => {
                firstCard.card.classList.remove('flipped', 'meme-card-reveal');
                secondCard.card.classList.remove('flipped', 'meme-card-reveal');
                resetBoard();
            }, 900);
        }
    }

    function checkVictory() {
        if (matches !== MEME_IMAGES.length) return;
        stopTimer();
        const totalTime = timeEl ? timeEl.textContent : '';
        if (finalMovesEl) finalMovesEl.textContent = moves.toString();
        if (finalTimeEl && totalTime) finalTimeEl.textContent = totalTime;
        if (winOverlay) {
            winOverlay.setAttribute('aria-hidden', 'false');
            winOverlay.classList.add('show', 'meme-win-pop');
        }
    }

    function initGame() {
        const shuffledPool = shuffle([...MEME_IMAGES]);
        cards = shuffle([...shuffledPool, ...shuffledPool]);
        moves = 0;
        matches = 0;
        startTime = null;
        if (movesEl) movesEl.textContent = '0';
        if (matchesEl) matchesEl.textContent = '0';
        if (timeEl) timeEl.textContent = '0s';
        stopTimer();
        resetBoard();

        if (winOverlay) {
            winOverlay.classList.remove('show', 'meme-win-pop');
            winOverlay.setAttribute('aria-hidden', 'true');
        }

        if (grid) {
            grid.innerHTML = '';
            grid.classList.remove('meme-grid-ready');
            void grid.offsetWidth;
            cards.forEach((imageSrc, index) => {
                const cardEl = createCardElement(imageSrc, index);
                grid.appendChild(cardEl);
            });
            requestAnimationFrame(() => {
                grid.classList.add('meme-grid-ready');
            });
        }
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => initGame());
    }
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => initGame());
    }

    initGame();
});
