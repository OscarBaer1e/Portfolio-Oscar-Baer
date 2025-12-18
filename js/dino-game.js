/**
 * Jeu du Dinosaure - Copie du jeu Google Chrome
 * Course infinie avec obstacles
 */

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const speedElement = document.getElementById('speed');
    const startBtn = document.getElementById('start-game');
    const resetBtn = document.getElementById('reset-game');
    const restartBtn = document.getElementById('restart-btn');
    const gameOver = document.getElementById('game-over');
    const finalScore = document.getElementById('final-score');
    const finalHighScore = document.getElementById('final-high-score');
    
    // État du jeu
    let gameState = {
        isPlaying: false,
        isPaused: false,
        score: 0,
        highScore: parseInt(localStorage.getItem('dinoHighScore')) || 0,
        speed: 1,
        gameSpeed: 5
    };
    
    // Dinosaure
    const dino = {
        x: 50,
        y: 0,
        width: 40,
        height: 40,
        yVelocity: 0,
        isJumping: false,
        isDucking: false,
        groundY: 0
    };
    
    // Obstacles
    let obstacles = [];
    let clouds = [];
    let groundX = 0;
    
    // Constantes
    const GRAVITY = 0.8;
    const JUMP_FORCE = -15;
    const GROUND_HEIGHT = 30;
    const OBSTACLE_SPAWN_RATE = 0.005;
    const CLOUD_SPAWN_RATE = 0.003;
    
    // Initialisation
    function init() {
        dino.groundY = canvas.height - GROUND_HEIGHT - dino.height;
        dino.y = dino.groundY;
        obstacles = [];
        clouds = [];
        groundX = 0;
        gameState.score = 0;
        gameState.speed = 1;
        gameState.gameSpeed = 5;
        dino.isJumping = false;
        dino.isDucking = false;
        dino.yVelocity = 0;
        updateHighScore();
    }
    
    function updateHighScore() {
        highScoreElement.textContent = gameState.highScore;
        finalHighScore.textContent = gameState.highScore;
    }
    
    // Dessin
    function draw() {
        // Fond
        ctx.fillStyle = '#f7f7f7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Nuages
        clouds.forEach(cloud => {
            ctx.fillStyle = '#e0e0e0';
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2);
            ctx.arc(cloud.x + 20, cloud.y, 20, 0, Math.PI * 2);
            ctx.arc(cloud.x + 40, cloud.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Sol
        ctx.fillStyle = '#535353';
        ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
        
        // Ligne du sol
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
        ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
        ctx.stroke();
        
        // Obstacles
        obstacles.forEach(obstacle => {
            if (obstacle.type === 'cactus') {
                // Cactus
                ctx.fillStyle = '#535353';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Détails du cactus
                ctx.fillRect(obstacle.x + 5, obstacle.y - 10, 8, 10);
                ctx.fillRect(obstacle.x + 15, obstacle.y - 8, 8, 8);
            } else if (obstacle.type === 'bird') {
                // Oiseau/Ptérodactyle
                ctx.fillStyle = '#535353';
                ctx.beginPath();
                ctx.arc(obstacle.x, obstacle.y, 15, 0, Math.PI * 2);
                ctx.fill();
                // Ailes
                ctx.beginPath();
                ctx.ellipse(obstacle.x - 10, obstacle.y, 8, 12, 0, 0, Math.PI * 2);
                ctx.ellipse(obstacle.x + 10, obstacle.y, 8, 12, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Dinosaure
        ctx.fillStyle = '#535353';
        if (dino.isDucking) {
            // Position accroupie
            ctx.fillRect(dino.x, dino.y + 20, dino.width, dino.height - 20);
            // Tête
            ctx.beginPath();
            ctx.arc(dino.x + 20, dino.y + 20, 12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Position normale
            ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
            // Tête
            ctx.beginPath();
            ctx.arc(dino.x + 20, dino.y, 12, 0, Math.PI * 2);
            ctx.fill();
            // Œil
            ctx.fillStyle = '#f7f7f7';
            ctx.beginPath();
            ctx.arc(dino.x + 25, dino.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#535353';
            // Pattes
            ctx.fillRect(dino.x + 5, dino.y + dino.height, 8, 10);
            ctx.fillRect(dino.x + 25, dino.y + dino.height, 8, 10);
        }
    }
    
    // Mise à jour
    function update() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Score
        gameState.score += 1;
        scoreElement.textContent = Math.floor(gameState.score / 10);
        
        // Augmentation de la vitesse
        if (gameState.score % 500 === 0) {
            gameState.speed += 0.1;
            gameState.gameSpeed += 0.5;
            speedElement.textContent = gameState.speed.toFixed(1) + 'x';
        }
        
        // Physique du dinosaure
        if (dino.isJumping) {
            dino.y += dino.yVelocity;
            dino.yVelocity += GRAVITY;
            
            if (dino.y >= dino.groundY) {
                dino.y = dino.groundY;
                dino.yVelocity = 0;
                dino.isJumping = false;
            }
        }
        
        // Sol qui défile
        groundX -= gameState.gameSpeed;
        if (groundX <= -canvas.width) {
            groundX = 0;
        }
        
        // Nuages
        clouds.forEach(cloud => {
            cloud.x -= gameState.gameSpeed * 0.5;
        });
        clouds = clouds.filter(cloud => cloud.x > -50);
        
        if (Math.random() < CLOUD_SPAWN_RATE) {
            clouds.push({
                x: canvas.width,
                y: Math.random() * 80 + 20
            });
        }
        
        // Obstacles
        obstacles.forEach(obstacle => {
            obstacle.x -= gameState.gameSpeed;
        });
        obstacles = obstacles.filter(obstacle => obstacle.x > -50);
        
        // Spawn d'obstacles
        if (Math.random() < OBSTACLE_SPAWN_RATE * (1 + gameState.speed * 0.1)) {
            if (Math.random() < 0.7) {
                // Cactus
                obstacles.push({
                    x: canvas.width,
                    y: canvas.height - GROUND_HEIGHT - 40,
                    width: 20,
                    height: 40,
                    type: 'cactus'
                });
            } else {
                // Oiseau (seulement après un certain score)
                if (gameState.score > 500) {
                    obstacles.push({
                        x: canvas.width,
                        y: canvas.height - GROUND_HEIGHT - 60 - Math.random() * 30,
                        width: 30,
                        height: 20,
                        type: 'bird'
                    });
                }
            }
        }
        
        // Collision
        obstacles.forEach(obstacle => {
            if (checkCollision(dino, obstacle)) {
                endGame();
            }
        });
    }
    
    function checkCollision(dino, obstacle) {
        const dinoRect = {
            x: dino.x,
            y: dino.isDucking ? dino.y + 20 : dino.y,
            width: dino.width,
            height: dino.isDucking ? dino.height - 20 : dino.height
        };
        
        return dinoRect.x < obstacle.x + obstacle.width &&
               dinoRect.x + dinoRect.width > obstacle.x &&
               dinoRect.y < obstacle.y + obstacle.height &&
               dinoRect.y + dinoRect.height > obstacle.y;
    }
    
    function jump() {
        if (!dino.isJumping && !dino.isDucking) {
            dino.isJumping = true;
            dino.yVelocity = JUMP_FORCE;
        }
    }
    
    function duck() {
        if (!dino.isJumping) {
            dino.isDucking = true;
        }
    }
    
    function stopDuck() {
        dino.isDucking = false;
    }
    
    // Contrôles
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (gameState.isPlaying) {
                jump();
            } else if (!gameState.isPlaying && !gameOver.classList.contains('hidden')) {
                startGame();
            }
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (gameState.isPlaying) {
                duck();
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowDown') {
            stopDuck();
        }
    });
    
    // Boucle de jeu
    function gameLoop() {
        update();
        draw();
        if (gameState.isPlaying) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    function startGame() {
        init();
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameOver.classList.add('hidden');
        startBtn.textContent = 'Pause';
        gameLoop();
    }
    
    function pauseGame() {
        gameState.isPaused = !gameState.isPaused;
        startBtn.textContent = gameState.isPaused ? 'Reprendre' : 'Pause';
        if (!gameState.isPaused) {
            gameLoop();
        }
    }
    
    function endGame() {
        gameState.isPlaying = false;
        
        // Sauvegarde du meilleur score
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('dinoHighScore', gameState.highScore);
            updateHighScore();
        }
        
        finalScore.textContent = Math.floor(gameState.score / 10);
        gameOver.classList.remove('hidden');
        startBtn.textContent = 'Commencer';
    }
    
    function resetGame() {
        gameState.isPlaying = false;
        gameState.isPaused = false;
        init();
        gameOver.classList.add('hidden');
        startBtn.textContent = 'Commencer';
        draw();
    }
    
    // Boutons
    startBtn.addEventListener('click', () => {
        if (gameState.isPlaying) {
            pauseGame();
        } else {
            startGame();
        }
    });
    
    resetBtn.addEventListener('click', resetGame);
    restartBtn.addEventListener('click', startGame);
    
    // Initialisation
    init();
    draw();
});

