/**
 * Space Shooter Cyberpunk - Mini-jeu original
 * Contrôlez un vaisseau spatial et détruisez les astéroïdes !
 */

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const levelElement = document.getElementById('level');
    const livesElement = document.getElementById('lives');
    const startBtn = document.getElementById('start-game');
    const resetBtn = document.getElementById('reset-game');
    const restartBtn = document.getElementById('restart-btn');
    const gameOver = document.getElementById('game-over');
    const startScreen = document.getElementById('start-screen');
    const finalScore = document.getElementById('final-score');
    const finalHighScore = document.getElementById('final-high-score');
    const finalLevel = document.getElementById('final-level');
    
    // État du jeu
    let gameState = {
        isPlaying: false,
        isPaused: false,
        score: 0,
        highScore: parseInt(localStorage.getItem('spaceShooterHighScore')) || 0,
        level: 1,
        lives: 3,
        gameSpeed: 2
    };
    
    // Vaisseau
    const ship = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 5,
        color: '#00ffff'
    };
    
    // Projectiles
    let bullets = [];
    
    // Astéroïdes
    let asteroids = [];
    
    // Particules d'explosion
    let particles = [];
    
    // Étoiles de fond
    let stars = [];
    
    // Initialisation
    function init() {
        ship.x = canvas.width / 2;
        bullets = [];
        asteroids = [];
        particles = [];
        stars = [];
        gameState.score = 0;
        gameState.level = 1;
        gameState.lives = 3;
        gameState.gameSpeed = 2;
        
        // Créer les étoiles
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.2
            });
        }
        
        updateHighScore();
    }
    
    function updateHighScore() {
        highScoreElement.textContent = gameState.highScore;
        finalHighScore.textContent = gameState.highScore;
    }
    
    // Dessin
    function draw() {
        // Fond noir avec dégradé
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Étoiles
        stars.forEach(star => {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Vaisseau
        if (gameState.isPlaying || gameState.isPaused) {
            drawShip(ship.x, ship.y);
        }
        
        // Projectiles
        bullets.forEach(bullet => {
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        // Astéroïdes
        asteroids.forEach(asteroid => {
            drawAsteroid(asteroid);
        });
        
        // Particules
        particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }
    
    function drawShip(x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // Corps du vaisseau
        ctx.fillStyle = ship.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ship.color;
        
        // Forme du vaisseau (triangle)
        ctx.beginPath();
        ctx.moveTo(0, -ship.height / 2);
        ctx.lineTo(-ship.width / 2, ship.height / 2);
        ctx.lineTo(0, ship.height / 2 - 10);
        ctx.lineTo(ship.width / 2, ship.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Détails
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawAsteroid(asteroid) {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        ctx.fillStyle = asteroid.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = asteroid.color;
        
        // Forme irrégulière d'astéroïde
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = asteroid.size + Math.sin(angle * 3) * 5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // Mise à jour
    function update() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Mise à jour des étoiles
        stars.forEach(star => {
            star.y += star.speed + gameState.gameSpeed * 0.3;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        
        // Mise à jour des projectiles
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });
        
        // Mise à jour des astéroïdes
        asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed;
            asteroid.rotation += asteroid.rotationSpeed;
            
            if (asteroid.y > canvas.height + 50) {
                asteroids.splice(index, 1);
            }
        });
        
        // Mise à jour des particules
        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravité
            particle.alpha -= 0.02;
            particle.size -= 0.1;
            
            if (particle.alpha <= 0 || particle.size <= 0) {
                particles.splice(index, 1);
            }
        });
        
        // Collision projectiles/astéroïdes
        bullets.forEach((bullet, bulletIndex) => {
            asteroids.forEach((asteroid, asteroidIndex) => {
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroid.size + 5) {
                    // Explosion
                    createExplosion(asteroid.x, asteroid.y, asteroid.color);
                    
                    // Score
                    gameState.score += Math.floor(asteroid.size / 5) * 10;
                    scoreElement.textContent = gameState.score;
                    
                    // Supprimer
                    bullets.splice(bulletIndex, 1);
                    asteroids.splice(asteroidIndex, 1);
                    
                    // Vérifier le niveau
                    checkLevel();
                }
            });
        });
        
        // Collision vaisseau/astéroïdes
        asteroids.forEach((asteroid, index) => {
            const dx = ship.x - asteroid.x;
            const dy = ship.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < asteroid.size + ship.width / 2) {
                // Explosion
                createExplosion(ship.x, ship.y, ship.color);
                
                // Perdre une vie
                gameState.lives--;
                livesElement.textContent = gameState.lives;
                
                // Supprimer l'astéroïde
                asteroids.splice(index, 1);
                
                // Vérifier game over
                if (gameState.lives <= 0) {
                    endGame();
                } else {
                    // Invincibilité temporaire
                    ship.invincible = true;
                    setTimeout(() => {
                        ship.invincible = false;
                    }, 2000);
                }
            }
        });
        
        // Spawn d'astéroïdes
        const spawnRate = 0.02 + (gameState.level * 0.005);
        if (Math.random() < spawnRate) {
            spawnAsteroid();
        }
    }
    
    function createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 5 + 2,
                color: color,
                alpha: 1
            });
        }
    }
    
    function spawnAsteroid() {
        const size = Math.random() * 30 + 15;
        asteroids.push({
            x: Math.random() * (canvas.width - size * 2) + size,
            y: -size,
            size: size,
            speed: Math.random() * 2 + gameState.gameSpeed,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            color: `hsl(${Math.random() * 60 + 200}, 70%, 50%)` // Couleurs cyan/magenta
        });
    }
    
    function checkLevel() {
        const newLevel = Math.floor(gameState.score / 500) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            gameState.gameSpeed += 0.5;
            levelElement.textContent = gameState.level;
            
            // Effet visuel
            showMessage(`Niveau ${gameState.level} !`, 'level');
        }
    }
    
    function shoot() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        bullets.push({
            x: ship.x,
            y: ship.y - ship.height / 2,
            speed: 8
        });
    }
    
    // Contrôles
    let keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState.isPlaying) {
                shoot();
            } else if (!startScreen.classList.contains('hidden')) {
                startGame();
            } else if (!gameOver.classList.contains('hidden')) {
                startGame();
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
    
    // Mouvement du vaisseau
    function handleMovement() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        if (keys['ArrowLeft'] || keys['KeyA']) {
            ship.x = Math.max(ship.width / 2, ship.x - ship.speed);
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            ship.x = Math.min(canvas.width - ship.width / 2, ship.x + ship.speed);
        }
    }
    
    // Boucle de jeu
    function gameLoop() {
        handleMovement();
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
        startScreen.classList.add('hidden');
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
            localStorage.setItem('spaceShooterHighScore', gameState.highScore);
            updateHighScore();
        }
        
        finalScore.textContent = gameState.score;
        finalLevel.textContent = gameState.level;
        gameOver.classList.remove('hidden');
        startBtn.textContent = 'Commencer';
    }
    
    function resetGame() {
        gameState.isPlaying = false;
        gameState.isPaused = false;
        init();
        gameOver.classList.add('hidden');
        startScreen.classList.remove('hidden');
        startBtn.textContent = 'Commencer';
        draw();
    }
    
    function showMessage(text, type) {
        const message = document.getElementById('game-message');
        message.textContent = text;
        message.className = 'game-message show ' + type;
        setTimeout(() => {
            message.classList.remove('show');
        }, 2000);
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

