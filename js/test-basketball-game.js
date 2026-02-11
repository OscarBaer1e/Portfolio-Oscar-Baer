/**
 * 🧪 VERSION DE TEST - Jeu de Basket 1v1
 * 
 * ⚠️ ATTENTION : Ce fichier est utilisé uniquement pour les tests
 * Modifiez ce fichier pour tester vos changements
 * Une fois validé, copiez les modifications vers js/basketball-game.js
 * 
 * Version Logique et Intuitive
 * Contrôles simples, physique réaliste, gameplay équilibré
 */

document.addEventListener('DOMContentLoaded', function() {
    const basketball = document.getElementById('basketball');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const scorePlayer1 = document.getElementById('score-player1');
    const scorePlayer2 = document.getElementById('score-player2');
    const gameTime = document.getElementById('game-time');
    const startBtn = document.getElementById('start-game');
    const resetBtn = document.getElementById('reset-game');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const modeText = document.getElementById('mode-text');
    const gameMessage = document.getElementById('game-message');
    
    // État du jeu
    let gameState = {
        isPlaying: false,
        isPaused: false,
        timeLeft: 60,
        score1: 0,
        score2: 0,
        ballOwner: null, // 1, 2, ou null
        ballPos: { x: 0, y: 0 },
        ballVel: { x: 0, y: 0 },
        player1Pos: { x: 0, y: 0 },
        player2Pos: { x: 0, y: 0 },
        player1Vel: { x: 0, y: 0 },
        player2Vel: { x: 0, y: 0 },
        player1OnGround: true,
        player2OnGround: true,
        isAI: true
    };
    
    // Constantes physiques
    const GRAVITY = 0.9;
    const FRICTION = 0.92;
    const BOUNCE = 0.6;
    const PLAYER_SPEED = 5;
    const JUMP_FORCE = 12;
    const BALL_SIZE = 40;
    const PLAYER_SIZE = 60;
    const CATCH_DISTANCE = 50;
    
    let gameLoop;
    let timeInterval;
    let keys = {};
    
    // Initialisation
    function initGame() {
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        
        // Position initiale du ballon au centre
        gameState.ballPos = {
            x: rect.width / 2 - BALL_SIZE / 2,
            y: rect.height / 2 - BALL_SIZE / 2
        };
        gameState.ballVel = { x: 0, y: 0 };
        gameState.ballOwner = null;
        
        // Positions des joueurs
        gameState.player1Pos = {
            x: rect.width * 0.3,
            y: rect.height - 100
        };
        gameState.player2Pos = {
            x: rect.width * 0.7,
            y: rect.height - 100
        };
        gameState.player1Vel = { x: 0, y: 0 };
        gameState.player2Vel = { x: 0, y: 0 };
        gameState.player1OnGround = true;
        gameState.player2OnGround = true;
        
        updateDisplay();
    }
    
    function updateDisplay() {
        // Ballon - Utilisation de transform pour meilleure performance
        basketball.style.transform = `translate(${gameState.ballPos.x}px, ${gameState.ballPos.y}px)`;
        
        // Joueur 1 - Utilisation de transform pour meilleure performance
        player1.style.transform = `translateX(${gameState.player1Pos.x}px)`;
        player1.style.bottom = (500 - gameState.player1Pos.y) + 'px';
        
        // Joueur 2 - Utilisation de transform pour meilleure performance
        player2.style.transform = `translateX(${gameState.player2Pos.x}px)`;
        player2.style.bottom = (500 - gameState.player2Pos.y) + 'px';
        
        // Indicateur de possession
        if (gameState.ballOwner === 1) {
            basketball.classList.add('held');
            player1.classList.add('has-ball');
            player2.classList.remove('has-ball');
        } else if (gameState.ballOwner === 2) {
            basketball.classList.add('held');
            player2.classList.add('has-ball');
            player1.classList.remove('has-ball');
        } else {
            basketball.classList.remove('held');
            player1.classList.remove('has-ball');
            player2.classList.remove('has-ball');
        }
    }
    
    // Contrôles
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (e.code === 'Space') e.preventDefault();
        if (!gameState.isPlaying) return;
        
        // Joueur 1: Flèches ou WASD
        if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') {
            gameState.player1Vel.x = -PLAYER_SPEED;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            gameState.player1Vel.x = PLAYER_SPEED;
        }
        if ((e.code === 'ArrowUp' || e.code === 'KeyW') && gameState.player1OnGround) {
            gameState.player1Vel.y = -JUMP_FORCE;
            gameState.player1OnGround = false;
        }
        if (e.code === 'Space') {
            // Tirer si on a le ballon
            if (gameState.ballOwner === 1) {
                shootBall(1);
            } else if (gameState.player1OnGround) {
                // Sinon, sauter pour attraper
                gameState.player1Vel.y = -JUMP_FORCE;
                gameState.player1OnGround = false;
            }
        }
        
        // Joueur 2 (si pas IA)
        if (!gameState.isAI) {
            if (e.code === 'KeyJ') {
                gameState.player2Vel.x = -PLAYER_SPEED;
            }
            if (e.code === 'KeyL') {
                gameState.player2Vel.x = PLAYER_SPEED;
            }
            if (e.code === 'KeyK' && gameState.player2OnGround) {
                gameState.player2Vel.y = -JUMP_FORCE;
                gameState.player2OnGround = false;
            }
            if (e.code === 'KeyI') {
                if (gameState.ballOwner === 2) {
                    shootBall(2);
                }
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
        
        // Arrêt du mouvement horizontal
        if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'KeyQ') {
            gameState.player1Vel.x = 0;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            gameState.player1Vel.x = 0;
        }
        if (!gameState.isAI) {
            if (e.code === 'KeyJ') {
                gameState.player2Vel.x = 0;
            }
            if (e.code === 'KeyL') {
                gameState.player2Vel.x = 0;
            }
        }
    });
    
    // Physique des joueurs
    function updatePlayers() {
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        
        // Joueur 1
        gameState.player1Pos.x += gameState.player1Vel.x;
        gameState.player1Pos.y += gameState.player1Vel.y;
        
        // Gravité
        if (!gameState.player1OnGround) {
            gameState.player1Vel.y += GRAVITY;
        }
        
        // Sol
        if (gameState.player1Pos.y >= rect.height - 100) {
            gameState.player1Pos.y = rect.height - 100;
            gameState.player1Vel.y = 0;
            gameState.player1OnGround = true;
        }
        
        // Bords
        gameState.player1Pos.x = Math.max(0, Math.min(rect.width - PLAYER_SIZE, gameState.player1Pos.x));
        
        // Joueur 2
        gameState.player2Pos.x += gameState.player2Vel.x;
        gameState.player2Pos.y += gameState.player2Vel.y;
        
        if (!gameState.player2OnGround) {
            gameState.player2Vel.y += GRAVITY;
        }
        
        if (gameState.player2Pos.y >= rect.height - 100) {
            gameState.player2Pos.y = rect.height - 100;
            gameState.player2Vel.y = 0;
            gameState.player2OnGround = true;
        }
        
        gameState.player2Pos.x = Math.max(0, Math.min(rect.width - PLAYER_SIZE, gameState.player2Pos.x));
    }
    
    // Physique du ballon
    function updateBall() {
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        
        if (gameState.ballOwner) {
            // Le ballon suit le joueur qui le possède
            const owner = gameState.ballOwner;
            const playerPos = owner === 1 ? gameState.player1Pos : gameState.player2Pos;
            const playerVel = owner === 1 ? gameState.player1Vel : gameState.player2Vel;
            const onGround = owner === 1 ? gameState.player1OnGround : gameState.player2OnGround;
            
            gameState.ballPos.x = playerPos.x + PLAYER_SIZE / 2 - BALL_SIZE / 2;
            gameState.ballPos.y = playerPos.y - (onGround ? 40 : 60);
            gameState.ballVel = { x: 0, y: 0 };
        } else {
            // Le ballon est libre
            gameState.ballPos.x += gameState.ballVel.x;
            gameState.ballPos.y += gameState.ballVel.y;
            
            // Gravité
            gameState.ballVel.y += GRAVITY;
            
            // Rebond sur le sol
            if (gameState.ballPos.y > rect.height - BALL_SIZE - 20) {
                gameState.ballPos.y = rect.height - BALL_SIZE - 20;
                gameState.ballVel.y *= -BOUNCE;
                gameState.ballVel.x *= FRICTION;
            }
            
            // Rebond sur les bords
            if (gameState.ballPos.x < 0) {
                gameState.ballPos.x = 0;
                gameState.ballVel.x *= -BOUNCE;
            }
            if (gameState.ballPos.x > rect.width - BALL_SIZE) {
                gameState.ballPos.x = rect.width - BALL_SIZE;
                gameState.ballVel.x *= -BOUNCE;
            }
            
            // Plafond
            if (gameState.ballPos.y < 0) {
                gameState.ballPos.y = 0;
                gameState.ballVel.y *= -BOUNCE;
            }
            
            // Friction
            gameState.ballVel.x *= FRICTION;
            
            // Arrêt si trop lent
            if (Math.abs(gameState.ballVel.x) < 0.1) gameState.ballVel.x = 0;
            if (Math.abs(gameState.ballVel.y) < 0.1 && gameState.ballPos.y >= rect.height - BALL_SIZE - 20) {
                gameState.ballVel.y = 0;
            }
        }
    }
    
    // Vérification de l'attrapage
    function checkCatch() {
        if (gameState.ballOwner) return;
        
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        const ballOnGround = gameState.ballPos.y >= rect.height - BALL_SIZE - 20;
        const ballSpeed = Math.sqrt(gameState.ballVel.x ** 2 + gameState.ballVel.y ** 2);
        
        // Joueur 1
        const dist1 = Math.sqrt(
            (gameState.ballPos.x - gameState.player1Pos.x) ** 2 +
            (gameState.ballPos.y - gameState.player1Pos.y) ** 2
        );
        
        if (dist1 < CATCH_DISTANCE && (ballSpeed < 5 || ballOnGround || !gameState.player1OnGround)) {
            gameState.ballOwner = 1;
            return;
        }
        
        // Joueur 2
        const dist2 = Math.sqrt(
            (gameState.ballPos.x - gameState.player2Pos.x) ** 2 +
            (gameState.ballPos.y - gameState.player2Pos.y) ** 2
        );
        
        if (dist2 < CATCH_DISTANCE && (ballSpeed < 5 || ballOnGround || !gameState.player2OnGround)) {
            gameState.ballOwner = 2;
            return;
        }
    }
    
    // Tir
    function shootBall(playerNum) {
        if (gameState.ballOwner !== playerNum) return;
        
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        const playerPos = playerNum === 1 ? gameState.player1Pos : gameState.player2Pos;
        
        // Cible : panier adverse
        const targetHoop = playerNum === 1 ? 'right' : 'left';
        const hoopX = targetHoop === 'left' ? 130 : rect.width - 130;
        const hoopY = rect.height - 175;
        
        // Calcul de la trajectoire
        const dx = hoopX - (playerPos.x + PLAYER_SIZE / 2);
        const dy = hoopY - (playerPos.y - 40);
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        
        // Vitesse selon la distance
        const speed = Math.min(14, 6 + distance / 80);
        
        // Angle de tir
        const angle = Math.atan2(dy, dx);
        
        gameState.ballVel = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 2 // Légère arc
        };
        
        gameState.ballOwner = null;
        
        // Vérification du score après un délai
        setTimeout(() => {
            checkScore(targetHoop, playerNum);
        }, 1500);
    }
    
    // Vérification du score
    function checkScore(hoopSide, playerNum) {
        const hoop = document.querySelector(`.hoop-${hoopSide}`);
        const hoopRect = hoop.getBoundingClientRect();
        const ballRect = basketball.getBoundingClientRect();
        
        const ballCenterX = ballRect.left + ballRect.width / 2;
        const ballCenterY = ballRect.top + ballRect.height / 2;
        const hoopCenterX = hoopRect.left + hoopRect.width / 2;
        const hoopCenterY = hoopRect.top + 50;
        
        const distance = Math.sqrt(
            (ballCenterX - hoopCenterX) ** 2 +
            (ballCenterY - hoopCenterY) ** 2
        );
        
        if (distance < 45 && ballRect.top < hoopRect.bottom) {
            // Score !
            const points = 2;
            if (playerNum === 1) {
                gameState.score1 += points;
                scorePlayer1.textContent = gameState.score1;
            } else {
                gameState.score2 += points;
                scorePlayer2.textContent = gameState.score2;
            }
            
            showMessage('🏀 PANIER ! +2 points', 'score');
            
            setTimeout(() => {
                resetBall();
            }, 1000);
        } else {
            setTimeout(() => {
                resetBall();
            }, 2000);
        }
    }
    
    function resetBall() {
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        
        gameState.ballPos = {
            x: rect.width / 2 - BALL_SIZE / 2,
            y: rect.height / 2 - BALL_SIZE / 2
        };
        gameState.ballVel = { x: 0, y: 0 };
        gameState.ballOwner = null;
    }
    
    // IA
    let aiTimer = 0;
    function updateAI() {
        if (!gameState.isAI || !gameState.isPlaying) return;
        
        aiTimer++;
        const court = document.querySelector('.basketball-court');
        const rect = court.getBoundingClientRect();
        
        if (gameState.ballOwner === 2) {
            // L'IA a le ballon, va vers le panier
            const hoopX = 130;
            const dist = hoopX - gameState.player2Pos.x;
            
            if (Math.abs(dist) > 30) {
                gameState.player2Vel.x = dist > 0 ? PLAYER_SPEED : -PLAYER_SPEED;
            } else {
                gameState.player2Vel.x = 0;
                // Saute et tire
                if (gameState.player2OnGround && aiTimer % 30 === 0) {
                    gameState.player2Vel.y = -JUMP_FORCE;
                    gameState.player2OnGround = false;
                    setTimeout(() => {
                        if (gameState.ballOwner === 2) {
                            shootBall(2);
                        }
                    }, 200);
                }
            }
        } else {
            // L'IA va vers le ballon
            const distX = gameState.ballPos.x - gameState.player2Pos.x;
            const distY = Math.abs(gameState.ballPos.y - gameState.player2Pos.y);
            
            if (Math.abs(distX) > 20) {
                gameState.player2Vel.x = distX > 0 ? PLAYER_SPEED : -PLAYER_SPEED;
            } else {
                gameState.player2Vel.x = 0;
            }
            
            // Saute pour attraper
            if (distY > 30 && gameState.player2OnGround && aiTimer % 20 === 0) {
                gameState.player2Vel.y = -JUMP_FORCE;
                gameState.player2OnGround = false;
            }
        }
    }
    
    function showMessage(text, type) {
        gameMessage.textContent = text;
        gameMessage.className = 'game-message show ' + type;
        setTimeout(() => {
            gameMessage.classList.remove('show');
        }, 2000);
    }
    
    // Boucle principale avec requestAnimationFrame pour fluidité
    let animationFrameId = null;
    function gameUpdate() {
        if (!gameState.isPlaying || gameState.isPaused) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            return;
        }
        
        updatePlayers();
        updateBall();
        checkCatch();
        
        if (gameState.isAI) {
            updateAI();
        }
        
        updateDisplay();
        
        animationFrameId = requestAnimationFrame(gameUpdate);
    }
    
    // Contrôles du jeu
    startBtn.addEventListener('click', () => {
        if (gameState.isPlaying) {
            gameState.isPaused = !gameState.isPaused;
            startBtn.textContent = gameState.isPaused ? 'Reprendre' : 'Pause';
        } else {
            gameState.isPlaying = true;
            gameState.timeLeft = 60;
            gameState.score1 = 0;
            gameState.score2 = 0;
            scorePlayer1.textContent = '0';
            scorePlayer2.textContent = '0';
            startBtn.textContent = 'Pause';
            initGame();
            
            timeInterval = setInterval(() => {
                gameState.timeLeft--;
                gameTime.textContent = gameState.timeLeft + 's';
                if (gameState.timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
            
            gameLoop = setInterval(() => {
                if (gameState.isPlaying && !gameState.isPaused) {
                    gameUpdate();
                }
            }, 16);
            // Démarrer la boucle requestAnimationFrame
            animationFrameId = requestAnimationFrame(gameUpdate);
        }
    });
    
    function endGame() {
        gameState.isPlaying = false;
        clearInterval(gameLoop);
        clearInterval(timeInterval);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        let winner = '';
        if (gameState.score1 > gameState.score2) {
            winner = 'Joueur 1 gagne !';
        } else if (gameState.score2 > gameState.score1) {
            winner = gameState.isAI ? 'IA gagne !' : 'Joueur 2 gagne !';
        } else {
            winner = 'Match nul !';
        }
        
        showMessage(`⏰ Temps écoulé ! ${winner}`, 'score');
        startBtn.textContent = 'Commencer';
    }
    
    resetBtn.addEventListener('click', () => {
        gameState.isPlaying = false;
        gameState.isPaused = false;
        gameState.timeLeft = 60;
        gameState.score1 = 0;
        gameState.score2 = 0;
        scorePlayer1.textContent = '0';
        scorePlayer2.textContent = '0';
        gameTime.textContent = '60s';
        startBtn.textContent = 'Commencer';
        clearInterval(gameLoop);
        clearInterval(timeInterval);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        resetBall();
        gameMessage.classList.remove('show');
        initGame();
    });
    
    toggleModeBtn.addEventListener('click', () => {
        gameState.isAI = !gameState.isAI;
        modeText.textContent = gameState.isAI ? '1 Joueur' : '2 Joueurs';
    });
    
    // Initialisation
    initGame();
});









