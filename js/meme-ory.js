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
    const timeoverMatchesEl = document.getElementById('meme-timeover-matches');

    var MEME_IMAGES = [];
    if (typeof MEME_ORY_BASE64 !== 'undefined' && MEME_ORY_BASE64 && MEME_ORY_BASE64.length >= 16) {
        MEME_IMAGES = MEME_ORY_BASE64.map(function(b) { return 'data:image/png;base64,' + b; });
    }

    const DIFFICULTIES = {
        easy:   { pairs: 8, timeSec: 150, level: 1 },
        medium: { pairs: 8, timeSec: 120, level: 2 },
        hard:   { pairs: 8, timeSec: 90,  level: 3 }
    };

    const STORAGE_KEY = 'memeoryUnlockedLevel';
    function getUnlockedLevel() {
        try {
            var n = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
            return Math.max(1, Math.min(3, n));
        } catch (e) { return 1; }
    }
    function setUnlockedLevel(level) {
        try {
            localStorage.setItem(STORAGE_KEY, String(Math.max(getUnlockedLevel(), level)));
        } catch (e) {}
    }

    var currentDifficulty = 'easy';
    var cards = [];
    var firstCard = null;
    var secondCard = null;
    var lockBoard = false;
    var moves = 0;
    var matches = 0;
    var timeLeft = 0;
    var timerId = null;
    var gameStarted = false;

    function getConfig() {
        return DIFFICULTIES[currentDifficulty];
    }

    function startCountdown() {
        var config = getConfig();
        timeLeft = config.timeSec;
        if (timeEl) timeEl.textContent = timeLeft + 's';
        timeEl && timeEl.classList.remove('meme-timer-warning', 'meme-timer-danger');
        if (timerId) clearInterval(timerId);
        timerId = setInterval(function() {
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
        var a = array.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function createCardElement(pairId, index) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'meme-card';
        card.setAttribute('data-index', String(index));
        card.setAttribute('data-pair-id', String(pairId));
        card.setAttribute('aria-label', 'Carte mème');

        var inner = document.createElement('div');
        inner.className = 'meme-card-inner';

        var front = document.createElement('div');
        front.className = 'meme-card-face meme-card-front';
        front.innerHTML = '<span class="meme-card-question">?</span>';

        var back = document.createElement('div');
        back.className = 'meme-card-face meme-card-back';
        var img = document.createElement('img');
        img.alt = '';
        if (MEME_IMAGES[pairId]) {
            img.src = MEME_IMAGES[pairId];
        } else {
            img.style.background = 'linear-gradient(135deg, #333, #111)';
            img.style.minHeight = '100%';
        }
        back.appendChild(img);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', function() { onCardClick(card, pairId); });
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
            firstCard = { card: card, pairId: pairId };
            return;
        }

        if (card !== firstCard.card) {
            secondCard = { card: card, pairId: pairId };
            moves++;
            if (movesEl) movesEl.textContent = String(moves);
            checkForMatch();
        }
    }

    function checkForMatch() {
        if (!firstCard || !secondCard) return;
        lockBoard = true;
        var isMatch = firstCard.pairId === secondCard.pairId;

        if (isMatch) {
            firstCard.card.classList.add('matched', 'meme-match-pop');
            secondCard.card.classList.add('matched', 'meme-match-pop');
            matches++;
            if (matchesEl) matchesEl.textContent = String(matches);
            setTimeout(function() {
                firstCard.card.classList.remove('meme-match-pop');
                secondCard.card.classList.remove('meme-match-pop');
                resetBoard();
                checkVictory();
            }, 450);
        } else {
            setTimeout(function() {
                firstCard.card.classList.remove('flipped');
                secondCard.card.classList.remove('flipped');
                resetBoard();
            }, 700);
        }
    }

    function checkVictory() {
        var config = getConfig();
        if (matches !== config.pairs) return;
        stopTimer();
        setUnlockedLevel((config.level || 1) + 1);
        if (resultTitleEl) resultTitleEl.textContent = config.level < 3 ? 'Niveau ' + config.level + ' réussi !' : 'GG, tu as tout fini !';
        if (finalMovesEl) finalMovesEl.textContent = String(moves);
        if (finalTimeEl) finalTimeEl.textContent = timeLeft + 's restants';
        if (winOverlay) {
            winOverlay.setAttribute('aria-hidden', 'false');
            winOverlay.classList.add('show');
        }
        updateDifficultyButtons();
    }

    function gameOverTime() {
        if (timeoverMatchesEl) timeoverMatchesEl.textContent = String(matches);
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

    function updateDifficultyButtons() {
        var unlocked = getUnlockedLevel();
        document.querySelectorAll('.meme-diff-btn').forEach(function(btn) {
            var diff = btn.getAttribute('data-diff');
            var cfg = DIFFICULTIES[diff];
            var level = (cfg && cfg.level) ? cfg.level : 1;
            var isLocked = level > unlocked;
            btn.classList.toggle('locked', isLocked);
            btn.disabled = isLocked;
            btn.classList.toggle('active', !isLocked && diff === currentDifficulty);
        });
    }

    function initGame() {
        var config = getConfig();
        var pairIds = [];
        for (var i = 0; i < config.pairs; i++) pairIds.push(i);
        pairIds = shuffle(pairIds);
        var deck = shuffle(pairIds.concat(pairIds));
        cards = deck.map(function(pairId, index) { return { pairId: pairId, index: index }; });

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

        grid.innerHTML = '';
        cards.forEach(function(item, index) {
            var cardEl = createCardElement(item.pairId, index);
            cardEl.style.animationDelay = (index * 0.04) + 's';
            grid.appendChild(cardEl);
        });
    }

    function setDifficulty(diff) {
        if (!DIFFICULTIES[diff]) return;
        var cfg = DIFFICULTIES[diff];
        var level = (cfg && cfg.level) ? cfg.level : 1;
        if (level > getUnlockedLevel()) return;
        currentDifficulty = diff;
        updateDifficultyButtons();
        initGame();
    }

    document.querySelectorAll('.meme-diff-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { setDifficulty(btn.getAttribute('data-diff')); });
    });
    if (restartBtn) restartBtn.addEventListener('click', initGame);
    if (playAgainBtn) playAgainBtn.addEventListener('click', initGame);
    if (timeoverRetryBtn) timeoverRetryBtn.addEventListener('click', initGame);

    initGame();
});
