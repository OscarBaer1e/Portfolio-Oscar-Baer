/**
 * Pacman Game - Mini-jeu classique
 * Mangez tous les points et évitez les fantômes !
 */

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const startBtn = document.getElementById('start-game');
    const resetBtn = document.getElementById('reset-game');
    const restartBtn = document.getElementById('restart-btn');
    const gameOver = document.getElementById('game-over');
    const finalScore = document.getElementById('final-score');
    const finalHighScore = document.getElementById('final-high-score');
    const finalLevel = document.getElementById('final-level');
    
    // Constantes
    const TILE_SIZE = 20;
    const COLS = 30;
    const ROWS = 30;
    const PACMAN_SPEED = 2;
    const GHOST_SPEED = 1.5;
    
    // État du jeu
    let gameState = {
        isPlaying: false,
        isPaused: false,
        score: 0,
        highScore: parseInt(localStorage.getItem('pacmanHighScore')) || 0,
        lives: 3,
        level: 1,
        powerPelletActive: false,
        powerPelletTimer: 0
    };
    
    // Labyrinthe (1 = mur, 0 = chemin, 2 = point, 3 = super-point)
    let maze = [];
    
    // Pacman
    let pacman = {
        x: 0,
        y: 0,
        tileX: 0,
        tileY: 0,
        direction: 0, // 0: droite, 1: bas, 2: gauche, 3: haut
        nextDirection: 0,
        mouthOpen: true,
        mouthAngle: 0
    };
    
    // Fantômes
    let ghosts = [];
    
    // Initialisation du labyrinthe (simple mais vrai labyrinthe)
    function initMaze() {
        maze = [];
        
        // Initialiser avec des murs partout
        for (let y = 0; y < ROWS; y++) {
            maze[y] = [];
            for (let x = 0; x < COLS; x++) {
                maze[y][x] = 1;
            }
        }
        
        // Créer des chemins en grille (labyrinthe simple)
        // Chemins horizontaux
        for (let y = 2; y < ROWS - 2; y += 4) {
            for (let x = 1; x < COLS - 1; x++) {
                maze[y][x] = 0;
            }
        }
        
        // Chemins verticaux
        for (let x = 2; x < COLS - 2; x += 4) {
            for (let y = 1; y < ROWS - 1; y++) {
                maze[y][x] = 0;
            }
        }
        
        // Ajouter des connexions entre les chemins
        for (let y = 4; y < ROWS - 4; y += 4) {
            for (let x = 4; x < COLS - 4; x += 4) {
                // Ouvrir quelques passages
                if (Math.random() > 0.4) {
                    maze[y][x - 1] = 0;
                    maze[y][x + 1] = 0;
                }
                if (Math.random() > 0.4) {
                    maze[y - 1][x] = 0;
                    maze[y + 1][x] = 0;
                }
            }
        }
        
        // Ajouter des points dans les chemins
        for (let y = 1; y < ROWS - 1; y++) {
            for (let x = 1; x < COLS - 1; x++) {
                if (maze[y][x] === 0) {
                    // Super-points aux coins
                    if ((x === 2 && y === 2) || (x === COLS - 3 && y === 2) || 
                        (x === 2 && y === ROWS - 3) || (x === COLS - 3 && y === ROWS - 3)) {
                        maze[y][x] = 3;
                    } else {
                        maze[y][x] = 2; // Points normaux
                    }
                }
            }
        }
        
        // Bordures = murs
        for (let y = 0; y < ROWS; y++) {
            maze[y][0] = 1;
            maze[y][COLS - 1] = 1;
        }
        for (let x = 0; x < COLS; x++) {
            maze[0][x] = 1;
            maze[ROWS - 1][x] = 1;
        }
        
        // Position de départ de Pacman (centre bas)
        pacman.tileX = Math.floor(COLS / 2);
        pacman.tileY = ROWS - 3;
        pacman.x = pacman.tileX * TILE_SIZE;
        pacman.y = pacman.tileY * TILE_SIZE;
        pacman.direction = 0;
        pacman.nextDirection = 0;
        
        // Fantômes
        ghosts = [];
        const ghostColors = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb851'];
        for (let i = 0; i < 4; i++) {
            ghosts.push({
                x: (COLS / 2 - 2 + i) * TILE_SIZE,
                y: (ROWS / 2) * TILE_SIZE,
                tileX: Math.floor(COLS / 2) - 2 + i,
                tileY: Math.floor(ROWS / 2),
                direction: Math.floor(Math.random() * 4),
                color: ghostColors[i],
                scared: false
            });
        }
        
        // S'assurer que la position de départ est libre
        maze[pacman.tileY][pacman.tileX] = 0;
    }
    
    function updateHighScore() {
        highScoreElement.textContent = gameState.highScore;
        finalHighScore.textContent = gameState.highScore;
    }
    
    // Dessin
    function draw() {
        // Fond noir
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Labyrinthe
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const tile = maze[y][x];
                const screenX = x * TILE_SIZE;
                const screenY = y * TILE_SIZE;
                
                if (tile === 1) {
                    // Mur
                    ctx.fillStyle = '#0000ff';
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                } else if (tile === 2) {
                    // Point
                    ctx.fillStyle = '#ffff00';
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 3) {
                    // Super-point
                    ctx.fillStyle = '#ffff00';
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        // Fantômes
        ghosts.forEach(ghost => {
            drawGhost(ghost);
        });
        
        // Pacman
        drawPacman();
    }
    
    function drawPacman() {
        ctx.save();
        ctx.translate(pacman.x + TILE_SIZE / 2, pacman.y + TILE_SIZE / 2);
        
        // Rotation selon la direction
        const rotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
        ctx.rotate(rotations[pacman.direction]);
        
        // Animation de la bouche
        pacman.mouthAngle += 0.2;
        const mouthOpen = Math.sin(pacman.mouthAngle) > 0;
        const mouthAngle = mouthOpen ? Math.PI / 4 : 0;
        
        // Corps de Pacman
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, TILE_SIZE / 2 - 2, mouthAngle, Math.PI * 2 - mouthAngle);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        
        // Œil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-3, -5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawGhost(ghost) {
        ctx.save();
        ctx.translate(ghost.x + TILE_SIZE / 2, ghost.y + TILE_SIZE / 2);
        
        // Couleur selon l'état
        if (gameState.powerPelletActive) {
            ctx.fillStyle = '#0000ff'; // Bleu quand vulnérable
        } else {
            ctx.fillStyle = ghost.color;
        }
        
        // Corps du fantôme
        ctx.beginPath();
        ctx.arc(0, -5, TILE_SIZE / 2 - 2, Math.PI, 0, false);
        ctx.rect(-TILE_SIZE / 2 + 2, -5, TILE_SIZE - 4, TILE_SIZE / 2);
        ctx.fill();
        
        // Pattes
        const legWidth = (TILE_SIZE - 4) / 3;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-TILE_SIZE / 2 + 2 + legWidth / 2 + i * legWidth, TILE_SIZE / 2 - 2, legWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Yeux
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5, -3, 3, 0, Math.PI * 2);
        ctx.arc(5, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-5, -3, 1.5, 0, Math.PI * 2);
        ctx.arc(5, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Mise à jour
    function update() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Timer du super-point
        if (gameState.powerPelletActive) {
            gameState.powerPelletTimer--;
            if (gameState.powerPelletTimer <= 0) {
                gameState.powerPelletActive = false;
            }
        }
        
        // Mouvement de Pacman
        movePacman();
        
        // Mouvement des fantômes
        ghosts.forEach(ghost => {
            moveGhost(ghost);
        });
        
        // Vérification des collisions
        checkCollisions();
        
        // Vérification de la victoire
        checkWin();
    }
    
    function movePacman() {
        // Essayer de changer de direction
        const nextTile = getNextTile(pacman.tileX, pacman.tileY, pacman.nextDirection);
        if (nextTile !== 1) {
            pacman.direction = pacman.nextDirection;
        }
        
        // Mouvement
        const nextPos = getNextPosition(pacman.x, pacman.y, pacman.direction, PACMAN_SPEED);
        const nextTilePos = getNextTile(pacman.tileX, pacman.tileY, pacman.direction);
        
        if (nextTilePos !== 1) {
            pacman.x = nextPos.x;
            pacman.y = nextPos.y;
            
            // Mise à jour de la tile
            const newTileX = Math.floor(pacman.x / TILE_SIZE);
            const newTileY = Math.floor(pacman.y / TILE_SIZE);
            
            if (newTileX !== pacman.tileX || newTileY !== pacman.tileY) {
                pacman.tileX = newTileX;
                pacman.tileY = newTileY;
                
                // Manger un point
                if (maze[pacman.tileY][pacman.tileX] === 2) {
                    maze[pacman.tileY][pacman.tileX] = 0;
                    gameState.score += 10;
                    scoreElement.textContent = gameState.score;
                } else if (maze[pacman.tileY][pacman.tileX] === 3) {
                    maze[pacman.tileY][pacman.tileX] = 0;
                    gameState.score += 50;
                    gameState.powerPelletActive = true;
                    gameState.powerPelletTimer = 300; // 5 secondes à 60fps
                    scoreElement.textContent = gameState.score;
                }
            }
        }
        
        // Téléportation (tunnels)
        if (pacman.x < 0) pacman.x = canvas.width;
        if (pacman.x > canvas.width) pacman.x = 0;
    }
    
    function moveGhost(ghost) {
        // IA simple : aller vers Pacman
        const dx = pacman.tileX - ghost.tileX;
        const dy = pacman.tileY - ghost.tileY;
        
        // Si le super-point est actif, fuir
        if (gameState.powerPelletActive) {
            const directions = [
                { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }
            ];
            let bestDir = ghost.direction;
            let maxDist = 0;
            
            directions.forEach((dir, index) => {
                const nextTile = getNextTile(ghost.tileX, ghost.tileY, index);
                if (nextTile !== 1) {
                    const dist = Math.abs(pacman.tileX - (ghost.tileX + dir.x)) + 
                                Math.abs(pacman.tileY - (ghost.tileY + dir.y));
                    if (dist > maxDist) {
                        maxDist = dist;
                        bestDir = index;
                    }
                }
            });
            ghost.direction = bestDir;
        } else {
            // Aller vers Pacman
            if (Math.abs(dx) > Math.abs(dy)) {
                ghost.direction = dx > 0 ? 0 : 2;
            } else {
                ghost.direction = dy > 0 ? 1 : 3;
            }
        }
        
        const nextTile = getNextTile(ghost.tileX, ghost.tileY, ghost.direction);
        if (nextTile !== 1) {
            const nextPos = getNextPosition(ghost.x, ghost.y, ghost.direction, GHOST_SPEED);
            ghost.x = nextPos.x;
            ghost.y = nextPos.y;
            
            const newTileX = Math.floor(ghost.x / TILE_SIZE);
            const newTileY = Math.floor(ghost.y / TILE_SIZE);
            
            if (newTileX !== ghost.tileX || newTileY !== ghost.tileY) {
                ghost.tileX = newTileX;
                ghost.tileY = newTileY;
            }
        }
        
        // Téléportation
        if (ghost.x < 0) ghost.x = canvas.width;
        if (ghost.x > canvas.width) ghost.x = 0;
    }
    
    function getNextTile(tileX, tileY, direction) {
        const directions = [
            { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }
        ];
        const dir = directions[direction];
        const nextX = tileX + dir.x;
        const nextY = tileY + dir.y;
        
        if (nextX < 0 || nextX >= COLS || nextY < 0 || nextY >= ROWS) {
            return 0; // Permettre la téléportation
        }
        
        return maze[nextY][nextX];
    }
    
    function getNextPosition(x, y, direction, speed) {
        const directions = [
            { x: speed, y: 0 }, { x: 0, y: speed }, { x: -speed, y: 0 }, { x: 0, y: -speed }
        ];
        const dir = directions[direction];
        return { x: x + dir.x, y: y + dir.y };
    }
    
    function checkCollisions() {
        ghosts.forEach((ghost, index) => {
            const dx = pacman.x - ghost.x;
            const dy = pacman.y - ghost.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < TILE_SIZE) {
                if (gameState.powerPelletActive) {
                    // Manger le fantôme
                    gameState.score += 200;
                    scoreElement.textContent = gameState.score;
                    // Réinitialiser le fantôme
                    ghost.x = (COLS / 2 - 2 + index) * TILE_SIZE;
                    ghost.y = (ROWS / 2) * TILE_SIZE;
                    ghost.tileX = Math.floor(COLS / 2) - 2 + index;
                    ghost.tileY = Math.floor(ROWS / 2);
                } else {
                    // Perdre une vie
                    gameState.lives--;
                    livesElement.textContent = gameState.lives;
                    
                    if (gameState.lives <= 0) {
                        endGame();
                    } else {
                        // Réinitialiser la position
                        pacman.tileX = Math.floor(COLS / 2);
                        pacman.tileY = ROWS - 3;
                        pacman.x = pacman.tileX * TILE_SIZE;
                        pacman.y = pacman.tileY * TILE_SIZE;
                    }
                }
            }
        });
    }
    
    function checkWin() {
        let hasPoints = false;
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (maze[y][x] === 2 || maze[y][x] === 3) {
                    hasPoints = true;
                    break;
                }
            }
            if (hasPoints) break;
        }
        
        if (!hasPoints) {
            // Niveau suivant
            gameState.level++;
            levelElement.textContent = gameState.level;
            initMaze();
            showMessage(`Niveau ${gameState.level} !`, 'level');
        }
    }
    
    // Contrôles
    let keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        // Empêche le comportement par défaut des flèches (scroll, etc.)
        if (e.code === 'ArrowRight' || e.code === 'ArrowLeft' || 
            e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            e.preventDefault();
        }
        
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            pacman.nextDirection = 0;
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
            pacman.nextDirection = 1;
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            pacman.nextDirection = 2;
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
            pacman.nextDirection = 3;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
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
        initMaze();
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameState.score = 0;
        gameState.lives = 3;
        gameState.level = 1;
        gameState.powerPelletActive = false;
        gameOver.classList.add('hidden');
        startBtn.textContent = 'Pause';
        scoreElement.textContent = '0';
        livesElement.textContent = '3';
        levelElement.textContent = '1';
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
        
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('pacmanHighScore', gameState.highScore);
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
        initMaze();
        gameOver.classList.add('hidden');
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
    initMaze();
    draw();
    updateHighScore();
});

