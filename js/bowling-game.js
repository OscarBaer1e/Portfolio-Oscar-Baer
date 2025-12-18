/**
 * Mini-jeu de Bowling avec la tête d'Oscar comme boule
 */

document.addEventListener('DOMContentLoaded', function() {
    const pinsContainer = document.getElementById('pins-container');
    const ball = document.getElementById('bowling-ball');
    const throwBtn = document.getElementById('throw-ball');
    const resetBtn = document.getElementById('reset-game');
    const powerSlider = document.getElementById('power-slider');
    const angleSlider = document.getElementById('angle-slider');
    const powerValue = document.getElementById('power-value');
    const angleValue = document.getElementById('angle-value');
    const scoreDisplay = document.getElementById('score');
    const throwsDisplay = document.getElementById('throws');
    const bestScoreDisplay = document.getElementById('best-score');
    const gameMessage = document.getElementById('game-message');
    
    let pins = [];
    let score = 0;
    let throws = 0;
    let bestScore = parseInt(localStorage.getItem('bowlingBestScore')) || 0;
    let isThrowing = false;
    
    // Initialise le meilleur score
    bestScoreDisplay.textContent = bestScore;
    
    // Crée les 10 quilles en formation triangulaire
    function createPins() {
        pinsContainer.innerHTML = '';
        pins = [];
        
        const pinPositions = [
            { row: 1, col: 2 }, // Quille du fond (1)
            { row: 2, col: 1 }, // Rangée 2 (2)
            { row: 2, col: 3 },
            { row: 3, col: 1 }, // Rangée 3 (3)
            { row: 3, col: 2 },
            { row: 3, col: 4 },
            { row: 4, col: 1 }, // Rangée 4 (4)
            { row: 4, col: 2 },
            { row: 4, col: 3 },
            { row: 4, col: 4 }
        ];
        
        // Crée les rangées de quilles
        const rows = [
            [1],           // Rangée 1 : 1 quille
            [2, 3],        // Rangée 2 : 2 quilles
            [4, 5, 6],     // Rangée 3 : 3 quilles
            [7, 8, 9, 10]  // Rangée 4 : 4 quilles
        ];
        
        rows.forEach((rowPins, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = `pin-row-${rowIndex + 1}`;
            
            rowPins.forEach((pinNum) => {
                const pin = document.createElement('div');
                pin.className = 'pin';
                pin.dataset.index = pinNum - 1;
                pins.push(pin);
                rowDiv.appendChild(pin);
            });
            
            pinsContainer.appendChild(rowDiv);
        });
    }
    
    // Met à jour l'affichage des valeurs
    powerSlider.addEventListener('input', (e) => {
        powerValue.textContent = e.target.value + '%';
    });
    
    angleSlider.addEventListener('input', (e) => {
        angleValue.textContent = e.target.value + '°';
    });
    
    // Lance la boule
    throwBtn.addEventListener('click', () => {
        if (isThrowing) return;
        throwBall();
    });
    
    function throwBall() {
        if (isThrowing) return;
        isThrowing = true;
        throwBtn.disabled = true;
        
        const power = parseInt(powerSlider.value);
        const angle = parseInt(angleSlider.value);
        
        // Calcule la trajectoire
        const distance = (power / 100) * 400; // Distance maximale
        const angleRad = (angle * Math.PI) / 180;
        const ballX = Math.sin(angleRad) * distance;
        const ballY = -distance;
        
        // Applique l'animation
        ball.style.setProperty('--ball-x', ballX + 'px');
        ball.style.setProperty('--ball-y', ballY + 'px');
        ball.classList.add('rolling');
        
        // Après l'animation, vérifie les collisions
        setTimeout(() => {
            checkCollisions(ballX, ballY, power);
            ball.classList.remove('rolling');
            ball.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
            
            setTimeout(() => {
                isThrowing = false;
                throwBtn.disabled = false;
            }, 500);
        }, 2000);
    }
    
    function checkCollisions(ballX, ballY, power) {
        let pinsHit = 0;
        const hitRadius = 40 + (power / 10); // Rayon d'impact basé sur la puissance
        
        pins.forEach((pin, index) => {
            if (pin.classList.contains('fallen')) return;
            
            const pinRect = pin.getBoundingClientRect();
            const containerRect = pinsContainer.getBoundingClientRect();
            const pinX = (pinRect.left + pinRect.width / 2) - (containerRect.left + containerRect.width / 2);
            const pinY = (pinRect.top + pinRect.height / 2) - (containerRect.top + containerRect.height / 2);
            
            // Position finale de la boule (approximative)
            const finalBallX = ballX;
            const finalBallY = ballY + 350; // Ajustement pour la position finale
            
            const distance = Math.sqrt(
                Math.pow(finalBallX - pinX, 2) + 
                Math.pow(finalBallY - pinY, 2)
            );
            
            if (distance < hitRadius) {
                pin.classList.add('fallen');
                pinsHit++;
                
                // Animation de chute
                setTimeout(() => {
                    pin.style.opacity = '0';
                }, 300);
            }
        });
        
        // Met à jour le score
        if (pinsHit > 0) {
            score += pinsHit;
            scoreDisplay.textContent = score;
            throws++;
            throwsDisplay.textContent = throws;
            
            // Messages spéciaux
            if (pinsHit === 10) {
                showMessage('🎳 STRIKE ! 🎳', 'strike');
                score += 10; // Bonus strike
            } else if (pinsHit >= 7) {
                showMessage('Excellent ! ' + pinsHit + ' quilles !', 'spare');
            } else if (pinsHit >= 4) {
                showMessage('Bien joué ! ' + pinsHit + ' quilles', '');
            } else {
                showMessage(pinsHit + ' quille(s) renversée(s)', '');
            }
            
            // Met à jour le meilleur score
            if (score > bestScore) {
                bestScore = score;
                bestScoreDisplay.textContent = bestScore;
                localStorage.setItem('bowlingBestScore', bestScore);
            }
        } else {
            showMessage('Raté ! Essayez encore', '');
        }
    }
    
    function showMessage(text, type) {
        gameMessage.textContent = text;
        gameMessage.className = 'game-message show ' + type;
        
        setTimeout(() => {
            gameMessage.classList.remove('show');
        }, 3000);
    }
    
    // Reset du jeu
    resetBtn.addEventListener('click', () => {
        score = 0;
        throws = 0;
        scoreDisplay.textContent = '0';
        throwsDisplay.textContent = '0';
        createPins();
        gameMessage.classList.remove('show');
        powerSlider.value = 50;
        angleSlider.value = 0;
        powerValue.textContent = '50%';
        angleValue.textContent = '0°';
    });
    
    // Initialise le jeu
    createPins();
    
    // Raccourci clavier pour lancer (Espace)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isThrowing) {
            e.preventDefault();
            throwBall();
        }
    });
});

