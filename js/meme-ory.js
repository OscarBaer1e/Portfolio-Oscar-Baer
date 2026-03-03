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

    // Cartes "mème" basées sur des emojis/labels.
    // Tu peux remplacer les labels par de vraies images si tu veux :
    // - mets tes images dans ressources/meme-ory/
    // - et remplace le contenu de cardBack.innerHTML par un <img src="...">
    const MEME_LABELS = [
        '😂', '😎', '🔥', '🤯',
        '👀', '🙃', '🤡', '💀'
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

    function createCardElement(label, index) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'meme-card';
        card.setAttribute('data-index', index.toString());
        card.setAttribute('aria-label', 'Carte de mème masquée');

        const inner = document.createElement('div');
        inner.className = 'meme-card-inner';

        const front = document.createElement('div');
        front.className = 'meme-card-face meme-card-front';
        front.innerHTML = '<span>?</span>';

        const back = document.createElement('div');
        back.className = 'meme-card-face meme-card-back';
        back.innerHTML = `<span class="meme-emoji">${label}</span>`;

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => onCardClick(card, label));

        return card;
    }

    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function onCardClick(card, label) {
        if (lockBoard) return;
        if (card.classList.contains('matched') || card.classList.contains('flipped')) return;

        // Démarrage du timer au premier clic
        if (moves === 0 && matches === 0 && !startTime) {
            startTimer();
        }

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = { card, label };
            return;
        }

        if (!secondCard && card !== firstCard.card) {
            secondCard = { card, label };
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
            firstCard.card.classList.add('matched');
            secondCard.card.classList.add('matched');
            matches++;
            if (matchesEl) matchesEl.textContent = matches.toString();
            setTimeout(() => {
                resetBoard();
                checkVictory();
            }, 400);
        } else {
            setTimeout(() => {
                firstCard.card.classList.remove('flipped');
                secondCard.card.classList.remove('flipped');
                resetBoard();
            }, 800);
        }
    }

    function checkVictory() {
        if (matches === MEME_LABELS.length) {
            stopTimer();
            const totalTime = timeEl ? timeEl.textContent : '';
            if (finalMovesEl) finalMovesEl.textContent = moves.toString();
            if (finalTimeEl && totalTime) finalTimeEl.textContent = totalTime;
            if (winOverlay) {
                winOverlay.setAttribute('aria-hidden', 'false');
                winOverlay.classList.add('show');
            }
        }
    }

    function initGame() {
        cards = shuffle([...MEME_LABELS, ...MEME_LABELS]);
        moves = 0;
        matches = 0;
        startTime = null;
        if (movesEl) movesEl.textContent = '0';
        if (matchesEl) matchesEl.textContent = '0';
        if (timeEl) timeEl.textContent = '0s';
        stopTimer();
        resetBoard();

        if (winOverlay) {
            winOverlay.classList.remove('show');
            winOverlay.setAttribute('aria-hidden', 'true');
        }

        if (grid) {
            grid.innerHTML = '';
            cards.forEach((label, index) => {
                const cardEl = createCardElement(label, index);
                grid.appendChild(cardEl);
            });
        }
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            initGame();
        });
    }

    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            initGame();
        });
    }

    initGame();
});

