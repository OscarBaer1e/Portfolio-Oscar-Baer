/**
 * Mini-jeu de Bowling
 * Mode 1V1 avec lancer à la souris et tableau des scores
 */

document.addEventListener('DOMContentLoaded', function() {
    const pinsContainer = document.getElementById('pins-container');
    const ball = document.getElementById('bowling-ball');
    const resetBtn = document.getElementById('reset-game');
    const modeSelect = document.getElementById('game-mode');
    const scoreDisplay = document.getElementById('score');
    const throwsDisplay = document.getElementById('throws');
    const bestScoreDisplay = document.getElementById('best-score');
    const gameMessage = document.getElementById('game-message');
    const scoreTableContainer = document.getElementById('score-table-container');
    const currentPlayerDisplay = document.getElementById('current-player');
    const ballContainer = document.getElementById('ball-container');
    const ballDragArea = document.querySelector('.ball-drag-area');
    const lane = document.querySelector('.lane');
    const player2ImageSelector = document.getElementById('player2-image-selector');
    const player2ImageInput = document.getElementById('player2-image-input');
    const selectPlayer2ImageBtn = document.getElementById('select-player2-image');
    const resetPlayer2ImageBtn = document.getElementById('reset-player2-image');
    
    // Images des joueurs
    const defaultPlayer1Image = '../ressources/images/1764412073317.png';
    const defaultPlayer2Image = '../ressources/images/Snapchat-680444565.jpg';
    let player1Image = defaultPlayer1Image;
    let player2Image = defaultPlayer2Image;
    
    // Système de sons
    let audioContext = null;
    let audioContextInitialized = false;
    
    // Initialise l'audio context (nécessite une interaction utilisateur)
    function initAudioContext() {
        if (!audioContextInitialized) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContextInitialized = true;
            } catch (e) {
                console.warn('Audio context non disponible:', e);
            }
        }
        return audioContext;
    }
    
    // Initialise l'audio au premier clic
    document.addEventListener('click', () => {
        if (!audioContextInitialized) {
            initAudioContext();
        }
    }, { once: true });
    
    // Crée un son de boule qui roule
    function playRollingSound(duration = 2000) {
        const ctx = initAudioContext();
        if (!ctx) return;
        
        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // Fréquence basse pour simuler le roulement
            oscillator.frequency.setValueAtTime(80, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration / 1000);
            oscillator.type = 'sawtooth';
            
            // Enveloppe pour le son
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + duration / 1000 - 0.1);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);
            
            oscillator.start();
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            console.warn('Erreur lors de la lecture du son:', e);
        }
    }
    
    // Crée un son de quille renversée
    function playPinHitSound() {
        const ctx = initAudioContext();
        if (!ctx) return;
        
        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // Son court et aigu
            oscillator.frequency.setValueAtTime(400, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.warn('Erreur lors de la lecture du son:', e);
        }
    }
    
    // Crée un son de strike (plus fort)
    function playStrikeSound() {
        const ctx = initAudioContext();
        if (!ctx) return;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                try {
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    oscillator.frequency.setValueAtTime(300 + i * 100, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                    
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.2);
                } catch (e) {
                    console.warn('Erreur lors de la lecture du son:', e);
                }
            }, i * 50);
        }
    }
    
    // Crée un son de victoire
    function playVictorySound() {
        const ctx = initAudioContext();
        if (!ctx) return;
        
        // Séquence de notes pour une fanfare de victoire
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do (octave supérieure)
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                try {
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, ctx.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
                    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
                    
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.4);
                } catch (e) {
                    console.warn('Erreur lors de la lecture du son:', e);
                }
            }, index * 150);
        });
    }
    
    // Système de confettis
    const confettiCanvas = document.getElementById('confetti-canvas');
    let confettiCtx = null;
    let confettiParticles = [];
    let confettiAnimationId = null;
    
    if (confettiCanvas) {
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.width = '100%';
        confettiCanvas.style.height = '100%';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.style.zIndex = '9999';
        
        confettiCtx = confettiCanvas.getContext('2d');
        
        function resizeConfettiCanvas() {
            if (confettiCanvas) {
                confettiCanvas.width = window.innerWidth;
                confettiCanvas.height = window.innerHeight;
            }
        }
        
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);
        
        function createConfetti(x, y, count = 50) {
            if (!confettiCanvas || !confettiCtx) return;
            
            const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0000', '#0000ff', '#ff8800'];
            
            for (let i = 0; i < count; i++) {
                confettiParticles.push({
                    x: x || Math.random() * confettiCanvas.width,
                    y: y || -10,
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * 3 + 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 6 + 4,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 10
                });
            }
            
            if (!confettiAnimationId) {
                animateConfetti();
            }
        }
        
        function animateConfetti() {
            if (!confettiCanvas || !confettiCtx) return;
            
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            confettiParticles = confettiParticles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.rotation += particle.rotationSpeed;
                particle.vy += 0.1; // Gravité
                
                confettiCtx.save();
                confettiCtx.translate(particle.x, particle.y);
                confettiCtx.rotate(particle.rotation * Math.PI / 180);
                confettiCtx.fillStyle = particle.color;
                confettiCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                confettiCtx.restore();
                
                return particle.y < confettiCanvas.height + 20;
            });
            
            if (confettiParticles.length > 0) {
                confettiAnimationId = requestAnimationFrame(animateConfetti);
            } else {
                confettiAnimationId = null;
            }
        }
        
        function triggerConfetti(x, y, count = 100) {
            if (confettiCanvas) {
                createConfetti(x, y, count);
            }
        }
        
        // Expose la fonction globalement
        window.triggerConfetti = triggerConfetti;
    } else {
        // Fonction de secours si le canvas n'existe pas
        window.triggerConfetti = function() {};
    }
    
    let pins = [];
    let isThrowing = false;
    let gameMode = 'solo'; // 'solo' ou '1v1'
    let currentPlayer = 1; // 1 ou 2
    let currentFrame = 1; // 1 à 10
    let currentThrow = 1; // 1 ou 2
    let gameData = {
        player1: { frames: [], totalScore: 0 },
        player2: { frames: [], totalScore: 0 }
    };
    
    // Variables pour le lancer à la souris
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragCurrentX = 0;
    let dragCurrentY = 0;
    let powerLine = null;
    
    // Initialise le meilleur score
    const bestScore = parseInt(localStorage.getItem('bowlingBestScore')) || 0;
    bestScoreDisplay.textContent = bestScore;
    
    // Structure des données des quilles avec positions
    let pinData = [];
    
    // Crée les 10 quilles en formation triangulaire
    function createPins() {
        pinsContainer.innerHTML = '';
        pins = [];
        pinData = [];
        
        const rows = [
            [1],           // Rangée 1 : 1 quille
            [2, 3],        // Rangée 2 : 2 quilles
            [4, 5, 6],     // Rangée 3 : 3 quilles
            [7, 8, 9, 10]  // Rangée 4 : 4 quilles
        ];
        
        // Positions relatives des quilles (en pixels depuis le centre)
        const pinPositions = [
            { x: 0, y: 0 },           // 1
            { x: -30, y: 40 },        // 2
            { x: 30, y: 40 },         // 3
            { x: -60, y: 80 },        // 4
            { x: 0, y: 80 },          // 5
            { x: 60, y: 80 },         // 6
            { x: -90, y: 120 },       // 7
            { x: -30, y: 120 },       // 8
            { x: 30, y: 120 },        // 9
            { x: 90, y: 120 }         // 10
        ];
        
        rows.forEach((rowPins, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = `pin-row-${rowIndex + 1}`;
            
            rowPins.forEach((pinNum) => {
                const pin = document.createElement('div');
                pin.className = 'pin';
                pin.dataset.index = pinNum - 1;
                pin.dataset.pinNumber = pinNum;
                // Tours au lieu de quilles
                pin.textContent = '🗼';
                pin.style.fontSize = '40px';
                pin.style.textAlign = 'center';
                pin.style.lineHeight = '50px';
                
                const pos = pinPositions[pinNum - 1];
                const pinInfo = {
                    element: pin,
                    number: pinNum,
                    x: pos.x,
                    y: pos.y,
                    fallen: false,
                    falling: false
                };
                
                pins.push(pin);
                pinData.push(pinInfo);
                rowDiv.appendChild(pin);
            });
            
            pinsContainer.appendChild(rowDiv);
        });
    }
    
    // Initialise une nouvelle frame
    function initFrame() {
        createPins();
        currentThrow = 1;
        isThrowing = false;
    }
    
    // Calcule le score d'une frame
    function calculateFrameScore(player, frameIndex) {
        const frame = player.frames[frameIndex];
        if (!frame) return 0;
        
        let score = 0;
        
        // Strike
        if (frame.throw1 === 10) {
            score = 10;
            // Bonus des 2 prochains tirs
            if (frameIndex < 9) {
                const nextFrame = player.frames[frameIndex + 1];
                if (nextFrame) {
                    score += nextFrame.throw1 || 0;
                    if (nextFrame.throw1 === 10 && frameIndex < 8) {
                        // Strike consécutif
                        const nextNextFrame = player.frames[frameIndex + 2];
                        score += nextNextFrame?.throw1 || 0;
                    } else {
                        score += nextFrame.throw2 || 0;
                    }
                }
            } else {
                // 10ème frame
                score += (frame.throw2 || 0) + (frame.throw3 || 0);
            }
        }
        // Spare
        else if ((frame.throw1 || 0) + (frame.throw2 || 0) === 10) {
            score = 10;
            if (frameIndex < 9) {
                const nextFrame = player.frames[frameIndex + 1];
                score += nextFrame?.throw1 || 0;
            } else {
                score += frame.throw3 || 0;
            }
        }
        // Normal
        else {
            score = (frame.throw1 || 0) + (frame.throw2 || 0);
        }
        
        return score;
    }
    
    // Met à jour le tableau des scores
    function updateScoreTable() {
        if (gameMode !== '1v1') {
            scoreTableContainer.style.display = 'none';
            return;
        }
        
        scoreTableContainer.style.display = 'block';
        const table = document.getElementById('score-table');
        table.innerHTML = '';
        
        // En-têtes
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Frame</th>';
        for (let i = 1; i <= 10; i++) {
            headerRow.innerHTML += `<th>${i}</th>`;
        }
        headerRow.innerHTML += '<th>Total</th>';
        table.appendChild(headerRow);
        
        // Ligne pour chaque joueur
        [1, 2].forEach(playerNum => {
            const player = gameData[`player${playerNum}`];
            const row = document.createElement('tr');
            row.className = `player-row player${playerNum} ${currentPlayer === playerNum ? 'active' : ''}`;
            
            row.innerHTML = `<td class="player-name">Joueur ${playerNum}</td>`;
            
            let runningTotal = 0;
            for (let i = 0; i < 10; i++) {
                const frame = player.frames[i];
                const cell = document.createElement('td');
                cell.className = 'frame-cell';
                
                if (frame) {
                    const frameScore = calculateFrameScore(player, i);
                    runningTotal += frameScore;
                    
                    let display = '';
                    if (frame.throw1 === 10) {
                        display = 'X';
                        if (i === 9) {
                            display += ' ' + (frame.throw2 === 10 ? 'X' : frame.throw2 || '') + ' ' + (frame.throw3 === 10 ? 'X' : frame.throw3 || '');
                        }
                    } else if ((frame.throw1 || 0) + (frame.throw2 || 0) === 10) {
                        display = (frame.throw1 || 0) + ' /';
                        if (i === 9) {
                            display += ' ' + (frame.throw3 || '');
                        }
                    } else {
                        display = (frame.throw1 || 0) + ' ' + (frame.throw2 || '');
                    }
                    
                    cell.innerHTML = `<div class="frame-throws">${display}</div><div class="frame-score">${runningTotal}</div>`;
                } else if (i === currentFrame - 1 && currentPlayer === playerNum) {
                    cell.className += ' current-frame';
                }
                
                row.appendChild(cell);
            }
            
            // Total
            const totalCell = document.createElement('td');
            totalCell.className = 'total-cell';
            totalCell.textContent = runningTotal;
            row.appendChild(totalCell);
            
            player.totalScore = runningTotal;
            table.appendChild(row);
        });
    }
    
    // Lance la boule avec les paramètres calculés
    function throwBall(power, angle) {
        if (isThrowing) return;
        isThrowing = true;
        
        // Calcule la trajectoire de base
        // La boule part de beaucoup plus loin pour créer une vraie piste de bowling
        const laneHeight = 500; // Hauteur de la piste
        const ballStartY = laneHeight - 5; // Position de départ de la boule (très bas, presque tout en bas)
        const pinsY = 50; // Position Y approximative des quilles
        const distanceToPins = ballStartY - pinsY; // Distance à parcourir jusqu'aux quilles
        
        // Distance totale basée sur la puissance
        const totalDistance = (power / 100) * distanceToPins;
        const angleRad = (angle * Math.PI) / 180;
        
        // Amélioration du lancer : dérive plus réaliste et progressive
        const driftChance = 0.25; // 25% de chance de dérive
        let driftX = 0;
        if (Math.random() < driftChance) {
            // Dérive aléatoire entre -12 et +12 pixels
            driftX = (Math.random() - 0.5) * 24;
        }
        
        // Amélioration : ajoute une dérive progressive basée sur la puissance
        // Plus de puissance = moins de dérive (meilleur contrôle)
        const powerStability = 1 - (power / 100) * 0.3; // Réduit la dérive de 30% max avec plus de puissance
        driftX *= powerStability;
        
        // Ajoute un effet (courbe) basé sur l'angle et la puissance
        const spin = angle * 0.5; // Effet proportionnel à l'angle
        const curveAmount = spin * (power / 100) * 0.3; // Courbe plus prononcée avec plus de puissance
        
        // Calcule la position finale avec dérive et effet
        const baseX = Math.sin(angleRad) * totalDistance;
        const finalX = baseX + driftX + curveAmount;
        const ballX = finalX;
        const ballY = -totalDistance; // Distance à parcourir vers le haut
        
        // Rotation de la boule avec probabilité de rotation légère aléatoire
        const baseRotation = angle * 8; // Rotation de base proportionnelle à l'angle
        // 70% de chance d'avoir une rotation légère supplémentaire aléatoire
        let randomRotation = 0;
        if (Math.random() < 0.7) {
            // Rotation aléatoire entre -15° et +15° supplémentaires
            randomRotation = (Math.random() - 0.5) * 30;
        }
        const rotation = baseRotation + randomRotation;
        
        // Probabilité de rotation dans l'autre sens (20%)
        let rotationDirection = 1;
        if (Math.random() < 0.2) {
            rotationDirection = -1; // Rotation inverse
        }
        
        // Applique l'animation avec rotation améliorée
        ball.style.setProperty('--ball-x', ballX + 'px');
        ball.style.setProperty('--ball-y', ballY + 'px');
        ball.style.setProperty('--ball-rotation', (rotation * rotationDirection) + 'deg');
        ball.classList.add('rolling');
        
        // Améliore la trajectoire avec une courbe plus réaliste
        const trajectoryCurve = curveAmount * 0.5; // Courbe plus douce
        ball.style.setProperty('--trajectory-curve', trajectoryCurve + 'px');
        
        // Joue le son de la boule qui roule
        playRollingSound(2000);
        
        // Calcule le chemin de la boule pour vérifier toutes les quilles traversées
        const ballPath = calculateBallPath(0, ballStartY, finalX, pinsY, angleRad, driftX, curveAmount);
        
        // Après l'animation, vérifie les collisions
        setTimeout(() => {
            checkCollisions(ballPath, power, finalX);
            ball.classList.remove('rolling');
            ball.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
            
            // Attend que toutes les quilles tombent avant d'enregistrer le score
            setTimeout(() => {
                let totalPinsHit = countFallenPins();
                
                // Les quilles non touchées ne se renversent pas si elles ne sont pas touchées
                // On enregistre uniquement le nombre réel de quilles tombées
                // Pas de système de strike aléatoire qui ferait tomber des quilles non touchées
                
                if (totalPinsHit === 10) {
                    // Strike naturel (toutes les quilles touchées directement ou par collision)
                    setTimeout(() => {
                        playStrikeSound();
                        if (window.triggerConfetti && confettiCanvas) {
                            window.triggerConfetti(confettiCanvas.width / 2, confettiCanvas.height / 2, 150);
                        }
                    }, 200);
                }
                
                recordThrow(totalPinsHit);
                
                setTimeout(() => {
                    isThrowing = false;
                }, 500);
            }, 1500);
        }, 2000);
    }
    
    // Calcule le chemin de la boule (points successifs) - amélioré
    function calculateBallPath(startX, startY, endX, endY, angleRad, driftX, curveAmount) {
        const path = [];
        const steps = 120; // Plus de points pour une trajectoire plus fluide
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            
            // Position linéaire de base avec easing pour un mouvement plus naturel
            const easedT = t * t * (3 - 2 * t); // Easing smoothstep pour un mouvement plus fluide
            const linearX = startX + (endX - startX) * easedT;
            const linearY = startY + (endY - startY) * easedT;
            
            // Courbe progressive améliorée (effet de rotation)
            const curveX = curveAmount * t * t * (1 + t * 0.5); // Courbe cubique plus douce
            const driftXProgressive = driftX * t * (1 + t * 0.3); // Dérive progressive avec accélération
            
            // Ajoute une légère oscillation aléatoire pour plus de réalisme (10% de chance)
            let oscillation = 0;
            if (Math.random() < 0.1) {
                oscillation = Math.sin(t * Math.PI * 4) * 2; // Oscillation légère
            }
            
            path.push({
                x: linearX + curveX + driftXProgressive + oscillation,
                y: linearY
            });
        }
        
        return path;
    }
    
    // Enregistre un tir
    function recordThrow(pinsHit) {
        const player = gameData[`player${currentPlayer}`];
        
        // Initialise la frame si nécessaire
        if (!player.frames[currentFrame - 1]) {
            player.frames[currentFrame - 1] = { throw1: null, throw2: null, throw3: null };
        }
        
        const frame = player.frames[currentFrame - 1];
        
        // Enregistre le tir (corrige le bug : ne peut pas avoir plus de 10 quilles)
        const actualPinsHit = Math.min(10, Math.max(0, pinsHit));
        
        if (currentThrow === 1) {
            frame.throw1 = actualPinsHit;
            
            // Strike - passe au joueur suivant ou frame suivante
            if (actualPinsHit === 10) {
                if (currentFrame === 10) {
                    // 10ème frame : on peut avoir un 3ème tir
                    currentThrow = 3;
                } else {
                    nextTurn();
                }
            } else {
                currentThrow = 2;
            }
        } else if (currentThrow === 2) {
            // Ne peut pas dépasser le nombre de quilles restantes
            const remainingPins = 10 - (frame.throw1 || 0);
            frame.throw2 = Math.min(remainingPins, actualPinsHit);
            
            // Spare en 10ème frame
            if (currentFrame === 10 && (frame.throw1 || 0) + frame.throw2 === 10) {
                currentThrow = 3;
            } else {
                nextTurn();
            }
        } else if (currentThrow === 3) {
            // 3ème tir uniquement en 10ème frame
            // Ne peut pas dépasser le nombre de quilles restantes
            const remainingPins = 10 - (frame.throw1 || 0) - (frame.throw2 || 0);
            frame.throw3 = Math.min(remainingPins, actualPinsHit);
            nextTurn();
        }
        
        updateScoreTable();
        updateDisplay();
        
        // Messages et confettis
        if (pinsHit === 10 && currentThrow === 1) {
            showMessage('🎳 STRIKE ! 🎳', 'strike');
            // Confettis pour un strike
            setTimeout(() => {
                if (window.triggerConfetti && confettiCanvas) {
                    window.triggerConfetti(confettiCanvas.width / 2, confettiCanvas.height / 2, 150);
                }
            }, 500);
        } else if (pinsHit === 10 && currentThrow === 2) {
            showMessage('🎳 STRIKE ! 🎳', 'strike');
            // Confettis pour un strike
            setTimeout(() => {
                if (window.triggerConfetti && confettiCanvas) {
                    window.triggerConfetti(confettiCanvas.width / 2, confettiCanvas.height / 2, 150);
                }
            }, 500);
        } else if ((frame.throw1 || 0) + (frame.throw2 || 0) === 10 && currentThrow === 2) {
            showMessage('🎯 SPARE ! 🎯', 'spare');
        } else if (pinsHit >= 7) {
            showMessage('Excellent ! ' + pinsHit + ' quilles !', 'spare');
        } else if (pinsHit >= 4) {
            showMessage('Bien joué ! ' + pinsHit + ' quilles', '');
        } else if (pinsHit > 0) {
            showMessage(pinsHit + ' quille(s) renversée(s)', '');
        } else {
            showMessage('Raté !', '');
        }
    }
    
    // Passe au tour suivant
    function nextTurn() {
        if (gameMode === '1v1') {
            // Change de joueur
            if (currentPlayer === 1) {
                currentPlayer = 2;
            } else {
                currentPlayer = 1;
                currentFrame++;
            }
        } else {
            // Mode solo : passe à la frame suivante
            currentFrame++;
        }
        
        // Vérifie si la partie est terminée
        if (currentFrame > 10) {
            endGame();
            return;
        }
        
        currentThrow = 1;
        initFrame();
        updateDisplay();
        updateBallForPlayer(); // Met à jour l'image et la couleur de la boule
    }
    
    // Met à jour l'affichage
    function updateDisplay() {
        if (gameMode === '1v1') {
            currentPlayerDisplay.textContent = `Joueur ${currentPlayer} - Frame ${currentFrame} - Tir ${currentThrow}`;
            scoreDisplay.textContent = gameData[`player${currentPlayer}`].totalScore;
        } else {
            currentPlayerDisplay.textContent = `Frame ${currentFrame} - Tir ${currentThrow}`;
            const player = gameData.player1;
            scoreDisplay.textContent = player.totalScore;
        }
        
        throwsDisplay.textContent = currentFrame;
    }
    
    // Termine la partie
    function endGame() {
        if (gameMode === '1v1') {
            const p1Score = gameData.player1.totalScore;
            const p2Score = gameData.player2.totalScore;
            
            if (p1Score > p2Score) {
                const winnerMessage = '🎉 Joueur 1 gagne ! 🎉';
                showMessage(winnerMessage, 'strike');
                // Confettis et son de victoire
                setTimeout(() => {
                    if (window.triggerConfetti && confettiCanvas) {
                        window.triggerConfetti(confettiCanvas.width / 2, confettiCanvas.height / 2, 200);
                    }
                    playVictorySound();
                }, 500);
            } else if (p2Score > p1Score) {
                const winnerMessage = '🎉 Joueur 2 gagne ! 🎉';
                showMessage(winnerMessage, 'strike');
                // Confettis et son de victoire
                setTimeout(() => {
                    if (window.triggerConfetti && confettiCanvas) {
                        window.triggerConfetti(confettiCanvas.width / 2, confettiCanvas.height / 2, 200);
                    }
                    playVictorySound();
                }, 500);
            } else {
                showMessage('🤝 Égalité ! 🤝', 'spare');
            }
        } else {
            const score = gameData.player1.totalScore;
            if (score > bestScore) {
                localStorage.setItem('bowlingBestScore', score);
                bestScoreDisplay.textContent = score;
                const recordMessage = '🎉 Nouveau record ! 🎉';
                showMessage(recordMessage, 'strike');
                // Confettis et son de victoire pour un nouveau record
                setTimeout(() => {
                    if (window.triggerConfetti && confettiCanvas) {
                        window.triggerConfetti(confettiCanvas.width / 2, confettiCanvas.height / 2, 200);
                    }
                    playVictorySound();
                }, 500);
            } else {
                showMessage('🎳 Partie terminée ! 🎳', 'spare');
            }
        }
    }
    
    function checkCollisions(ballPath, power, finalBallX) {
        const hitRadius = 30 + (power / 20); // Rayon d'impact ajusté
        const pinsContainerY = 50; // Position Y du conteneur des quilles depuis le haut
        
        // Liste des quilles touchées (directement ou sur le chemin)
        const hitPins = [];
        
        // Vérifie chaque quille pour voir si la boule passe à proximité
        pinData.forEach((pinInfo) => {
            if (pinInfo.fallen) return;
            
            // Position X de la quille (relative au centre du conteneur)
            const pinX = pinInfo.x;
            // Position Y absolue de la quille (position du conteneur + position relative)
            const pinY = pinsContainerY + pinInfo.y;
            
            let minDistance = Infinity;
            let closestPoint = null;
            
            // Vérifie chaque point du chemin de la boule
            ballPath.forEach((point) => {
                const distance = Math.sqrt(
                    Math.pow(point.x - pinX, 2) + 
                    Math.pow(point.y - pinY, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = point;
                }
            });
            
            // Si la boule passe à proximité de la quille
            if (minDistance < hitRadius) {
                // Probabilité de faire tomber la quille basée sur la distance
                // Les quilles touchées doivent se renverser toutes ou avoir une forte probabilité
                // Plus proche = plus de chance (99% si très proche, 80% si juste à la limite)
                const hitProbability = Math.max(0.8, 0.99 - (minDistance / hitRadius) * 0.19);
                
                if (Math.random() < hitProbability) {
                    hitPins.push(pinInfo);
                }
            }
        });
        
        // Fait tomber les quilles touchées
        hitPins.forEach((pinInfo, index) => {
            if (!pinInfo.fallen) {
                pinInfo.fallen = true;
                pinInfo.falling = true;
                makePinFall(pinInfo);
                
                // Joue le son de quille renversée avec un léger délai pour chaque quille
                setTimeout(() => {
                    playPinHitSound();
                }, index * 20);
            }
        });
        
        // Stocke le nombre de quilles touchées pour le calcul du strike
        hitPins.actualHitCount = hitPins.length;
        
        // Après un court délai, vérifie les collisions entre quilles
        setTimeout(() => {
            checkPinToPinCollisions(hitPins);
        }, 100);
    }
    
    // Compte les quilles tombées
    function countFallenPins() {
        let count = 0;
        pinData.forEach((pinInfo) => {
            if (pinInfo.fallen) {
                count++;
            }
        });
        return count;
    }
    
    // Fait tomber une quille avec animation
    function makePinFall(pinInfo) {
        const pin = pinInfo.element;
        pin.classList.add('fallen');
        
        // Animation de chute avec rotation aléatoire
        const fallAngle = (Math.random() - 0.5) * 60; // Angle de chute aléatoire
        const fallDistance = 20 + Math.random() * 30; // Distance de chute
        
        pin.style.transition = 'all 0.6s ease-out';
        pin.style.transform = `rotate(${fallAngle}deg) translate(${fallDistance}px, ${fallDistance}px)`;
        pin.style.opacity = '0.3';
        
        setTimeout(() => {
            pin.style.opacity = '0';
        }, 600);
    }
    
    // Vérifie si une quille qui tombe fait tomber d'autres quilles
    function checkPinToPinCollisions(fallenPins) {
        if (fallenPins.length === 0) return;
        
        fallenPins.forEach((fallenPin) => {
            // Probabilité qu'une quille qui tombe fasse tomber d'autres quilles (60%)
            const knockOverChance = 0.6;
            
            if (Math.random() < knockOverChance) {
                // Cherche les quilles proches
                pinData.forEach((otherPin) => {
                    if (otherPin.fallen || otherPin === fallenPin) return;
                    
                    const distance = Math.sqrt(
                        Math.pow(fallenPin.x - otherPin.x, 2) + 
                        Math.pow(fallenPin.y - otherPin.y, 2)
                    );
                    
                    // Si la quille est proche (moins de 50px), probabilité de la faire tomber
                    // Plus proche = plus de chance
                    if (distance < 50) {
                        // Probabilité basée sur la distance : plus proche = plus de chance
                        const knockOverProbability = 0.7 * (1 - distance / 50); // Max 70% si très proche
                        
                        if (Math.random() < knockOverProbability) {
                            otherPin.fallen = true;
                            otherPin.falling = true;
                            makePinFall(otherPin);
                            
                            // Récursivement vérifie si cette quille en fait tomber d'autres
                            setTimeout(() => {
                                checkPinToPinCollisions([otherPin]);
                            }, 150);
                        }
                    }
                });
            }
        });
        
    }
    
    function showMessage(text, type) {
        gameMessage.textContent = text;
        gameMessage.className = 'game-message show ' + type;
        
        setTimeout(() => {
            gameMessage.classList.remove('show');
        }, 3000);
    }
    
    // Système de lancer à la souris
    function createPowerLine() {
        if (!powerLine) {
            powerLine = document.createElement('div');
            powerLine.className = 'power-line';
            lane.appendChild(powerLine);
        }
    }
    
    function removePowerLine() {
        if (powerLine) {
            powerLine.remove();
            powerLine = null;
        }
    }
    
    function updatePowerLine(startX, startY, endX, endY) {
        if (!powerLine) return;
        
        const laneRect = lane.getBoundingClientRect();
        const relativeStartX = startX - laneRect.left;
        const relativeStartY = startY - laneRect.top;
        const relativeEndX = endX - laneRect.left;
        const relativeEndY = endY - laneRect.top;
        
        const dx = relativeEndX - relativeStartX;
        const dy = relativeEndY - relativeStartY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        const maxDistance = 200;
        const displayDistance = Math.min(distance, maxDistance);
        
        powerLine.style.width = displayDistance + 'px';
        powerLine.style.transform = `rotate(${angle}deg)`;
        powerLine.style.left = relativeStartX + 'px';
        powerLine.style.top = relativeStartY + 'px';
        powerLine.style.opacity = Math.min(1, distance / maxDistance);
    }
    
    // Met à jour l'image et la couleur de la boule selon le joueur
    function updateBallForPlayer() {
        if (gameMode === '1v1') {
            if (currentPlayer === 1) {
                ball.src = player1Image;
                ball.style.borderColor = 'var(--primary-color)';
                ball.style.boxShadow = '0 0 20px var(--primary-color)';
            } else {
                ball.src = player2Image;
                ball.style.borderColor = 'var(--secondary-color)';
                ball.style.boxShadow = '0 0 20px var(--secondary-color)';
            }
        } else {
            ball.src = player1Image;
            ball.style.borderColor = 'var(--primary-color)';
            ball.style.boxShadow = '0 0 20px var(--primary-color)';
        }
    }
    
    // Événements de la souris pour lancer (sur le conteneur, pas l'image)
    ballDragArea.addEventListener('mousedown', (e) => {
        if (isThrowing) return;
        e.preventDefault();
        isDragging = true;
        
        const rect = ballContainer.getBoundingClientRect();
        dragStartX = rect.left + rect.width / 2;
        dragStartY = rect.top + rect.height / 2;
        
        createPowerLine();
        ballDragArea.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        dragCurrentX = e.clientX;
        dragCurrentY = e.clientY;
        
        const rect = ballContainer.getBoundingClientRect();
        const ballCenterX = rect.left + rect.width / 2;
        const ballCenterY = rect.top + rect.height / 2;
        
        updatePowerLine(ballCenterX, ballCenterY, dragCurrentX, dragCurrentY);
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        removePowerLine();
        ballDragArea.style.cursor = 'grab';
        
        if (isThrowing) return;
        
        // Calcule la puissance et l'angle
        const rect = ballContainer.getBoundingClientRect();
        const ballCenterX = rect.left + rect.width / 2;
        const ballCenterY = rect.top + rect.height / 2;
        
        const dx = dragCurrentX - ballCenterX;
        const dy = dragCurrentY - ballCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        const power = Math.min(100, Math.max(10, (distance / maxDistance) * 100));
        const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
        const clampedAngle = Math.max(-30, Math.min(30, angle));
        
        throwBall(power, clampedAngle);
    });
    
    
    // Changement de mode
    modeSelect.addEventListener('change', (e) => {
        gameMode = e.target.value;
        if (gameMode === '1v1') {
            player2ImageSelector.style.display = 'block';
        } else {
            player2ImageSelector.style.display = 'none';
        }
        resetGame();
    });
    
    // Sélection d'image pour le joueur 2
    selectPlayer2ImageBtn.addEventListener('click', () => {
        player2ImageInput.click();
    });
    
    player2ImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                player2Image = event.target.result;
                updateBallForPlayer();
            };
            reader.readAsDataURL(file);
        }
    });
    
    resetPlayer2ImageBtn.addEventListener('click', () => {
        player2Image = defaultPlayer2Image;
        player2ImageInput.value = '';
        updateBallForPlayer();
    });
    
    // Reset du jeu
    function resetGame() {
        gameData = {
            player1: { frames: [], totalScore: 0 },
            player2: { frames: [], totalScore: 0 }
        };
        currentPlayer = 1;
        currentFrame = 1;
        currentThrow = 1;
        isThrowing = false;
        gameMessage.classList.remove('show');
        initFrame();
        updateDisplay();
        updateScoreTable();
    }
    
    resetBtn.addEventListener('click', resetGame);
    
    // Initialise le jeu
    initFrame();
    updateDisplay();
    updateScoreTable();
    updateBallForPlayer(); // Initialise l'image et la couleur de la boule
    
    // Affiche le sélecteur d'image si on est en mode 1v1
    if (gameMode === '1v1') {
        player2ImageSelector.style.display = 'block';
    }
    
    // Raccourci clavier pour lancer (Espace)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isThrowing && !isDragging) {
            e.preventDefault();
            throwBall(50, 0);
        }
    });
});
