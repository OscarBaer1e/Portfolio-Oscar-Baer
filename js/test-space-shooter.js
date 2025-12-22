/**
 * 🧪 VERSION DE TEST - Space Shooter
 * 
 * ⚠️ ATTENTION : Ce fichier est utilisé uniquement pour les tests
 * Modifiez ce fichier pour tester vos changements
 * Une fois validé, copiez les modifications vers js/space-shooter.js
 * 
 * Space Shooter - Mini-jeu
 * Contrôlez un vaisseau spatial et détruisez les astéroïdes
 */

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas non trouvé');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Contexte canvas non disponible');
        return;
    }
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
    const scoreMessage = document.getElementById('score-message');
    
    // Conteneur des icônes de buff
    const activeBuffsContainer = document.getElementById('active-buffs');
    
    // Mapping des buffs avec leurs emojis
    const buffEmojis = {
        rapidFire: '⚡',
        shrink: '🔽',
        bigBullets: '💥',
        tripleShot: '🎯',
        timeSlow: '⏱️',
        offensiveShield: '🛡️',
        magnet: '🧲',
        multiShot: '🌟',
        explosiveBullets: '💣',
        speedBoost: '🚀',
        scoreMultiplier: '💰',
        autoAim: '🎯'
    };
    
    // Système de thèmes qui change tous les 10 niveaux
    const themes = [
        // Thème 1 : Espace profond (niveaux 1-10)
        {
            name: 'Espace profond',
            background: { top: '#0a0a1a', bottom: '#000000' },
            stars: '#ffffff',
            bullets: '#00ffff',
            asteroids: ['#888888', '#666666', '#999999'],
            particles: ['#00ffff', '#0088ff', '#00aaff']
        },
        // Thème 2 : Nébuleuse bleue (niveaux 11-20)
        {
            name: 'Nébuleuse bleue',
            background: { top: '#1a0a2a', bottom: '#0a0a1a' },
            stars: '#aaccff',
            bullets: '#66ccff',
            asteroids: ['#4466aa', '#335599', '#5577bb'],
            particles: ['#66ccff', '#4488ff', '#66aaff']
        },
        // Thème 3 : Nébuleuse violette (niveaux 21-30)
        {
            name: 'Nébuleuse violette',
            background: { top: '#2a0a3a', bottom: '#1a0a2a' },
            stars: '#cc99ff',
            bullets: '#aa66ff',
            asteroids: ['#6644aa', '#553399', '#7755bb'],
            particles: ['#aa66ff', '#8844ff', '#aa88ff']
        },
        // Thème 4 : Nébuleuse rose (niveaux 31-40)
        {
            name: 'Nébuleuse rose',
            background: { top: '#3a0a2a', bottom: '#2a0a1a' },
            stars: '#ff99cc',
            bullets: '#ff66aa',
            asteroids: ['#aa4466', '#993355', '#bb5577'],
            particles: ['#ff66aa', '#ff4488', '#ff88aa']
        },
        // Thème 5 : Nébuleuse orange (niveaux 41-50)
        {
            name: 'Nébuleuse orange',
            background: { top: '#3a1a0a', bottom: '#2a0a0a' },
            stars: '#ffcc99',
            bullets: '#ffaa66',
            asteroids: ['#aa6644', '#995533', '#bb7755'],
            particles: ['#ffaa66', '#ff8844', '#ffcc88']
        },
        // Thème 6 : Nébuleuse verte (niveaux 51-60)
        {
            name: 'Nébuleuse verte',
            background: { top: '#0a2a1a', bottom: '#0a1a0a' },
            stars: '#99ffcc',
            bullets: '#66ffaa',
            asteroids: ['#44aa66', '#339955', '#55bb77'],
            particles: ['#66ffaa', '#44ff88', '#88ffcc']
        },
        // Thème 7 : Nébuleuse cyan (niveaux 61-70)
        {
            name: 'Nébuleuse cyan',
            background: { top: '#0a2a2a', bottom: '#0a1a1a' },
            stars: '#99ffff',
            bullets: '#66ffff',
            asteroids: ['#44aaaa', '#339999', '#55bbbb'],
            particles: ['#66ffff', '#44ffff', '#88ffff']
        },
        // Thème 8 : Nébuleuse rouge (niveaux 71-80)
        {
            name: 'Nébuleuse rouge',
            background: { top: '#2a0a0a', bottom: '#1a0000' },
            stars: '#ff9999',
            bullets: '#ff6666',
            asteroids: ['#aa4444', '#993333', '#bb5555'],
            particles: ['#ff6666', '#ff4444', '#ff8888']
        },
        // Thème 9 : Nébuleuse jaune (niveaux 81-90)
        {
            name: 'Nébuleuse jaune',
            background: { top: '#2a2a0a', bottom: '#1a1a00' },
            stars: '#ffff99',
            bullets: '#ffff66',
            asteroids: ['#aaaa44', '#999933', '#bbbb55'],
            particles: ['#ffff66', '#ffff44', '#ffff88']
        },
        // Thème 10 : Espace final (niveaux 91+)
        {
            name: 'Espace final',
            background: { top: '#1a1a2a', bottom: '#0a0a1a' },
            stars: '#ffffff',
            bullets: '#ffffff',
            asteroids: ['#ffffff', '#cccccc', '#dddddd'],
            particles: ['#ffffff', '#ffccff', '#ccffff']
        }
    ];
    
    // Fonction pour obtenir le thème actuel selon le niveau
    function getCurrentTheme() {
        const themeIndex = Math.floor((gameState.level - 1) / 10) % themes.length;
        return themes[themeIndex];
    }
    
    // État du jeu
    let gameState = {
        isPlaying: false,
        isPaused: false,
        score: 0,
        highScore: parseInt(localStorage.getItem('spaceShooterHighScore')) || 0,
        level: 1,
        lives: 3,
        maxLives: 3,
        gameSpeed: 2,
        gameMode: 'normal', // 'normal' ou 'infinite'
        bossActive: false
    };
    
    // Système de sons
    let audioContext = null;
    let audioContextInitialized = false;
    
    // Cache pour les fichiers audio
    const audioCache = {};
    
    function initAudioContext() {
        if (!audioContextInitialized) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContextInitialized = true;
            } catch (e) {
                // Audio context non disponible
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
    
    // Fonction pour jouer un fichier audio
    function playAudioFile(src, volume = 0.5) {
        try {
            // Vérifier si l'audio est déjà en cache
            if (!audioCache[src]) {
                const audio = new Audio(src);
                audio.volume = volume;
                audioCache[src] = audio;
            }
            
            const audio = audioCache[src].cloneNode();
            audio.volume = volume;
            audio.play().catch(e => {
                console.warn('Erreur lecture audio:', e);
            });
        } catch (e) {
            console.warn('Erreur création audio:', e);
        }
    }
    
    // Sons du jeu
    function playSound(type, frequency = 440, duration = 0.1) {
        const ctx = initAudioContext();
        if (!ctx) return;
        
        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            switch(type) {
                case 'shoot':
                    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.05);
                    break;
                case 'explosion':
                    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
                    oscillator.type = 'sawtooth';
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.3);
                    break;
                case 'powerup':
                    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;
                case 'hit':
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;
                case 'bossHit':
                    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
                    oscillator.type = 'sawtooth';
                    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;
                case 'bossShoot':
                    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.15);
                    break;
                case 'bossSpawn':
                    const notes = [200, 250, 300, 350];
                    notes.forEach((freq, i) => {
                        setTimeout(() => {
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.frequency.setValueAtTime(freq, ctx.currentTime);
                            osc.type = 'sine';
                            gain.gain.setValueAtTime(0.2, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.3);
                        }, i * 100);
                    });
                    break;
                case 'victory':
                    const victoryNotes = [523.25, 659.25, 783.99, 1046.50];
                    victoryNotes.forEach((freq, i) => {
                        setTimeout(() => {
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.frequency.setValueAtTime(freq, ctx.currentTime);
                            osc.type = 'sine';
                            gain.gain.setValueAtTime(0.3, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.4);
                        }, i * 150);
                    });
                    break;
            }
        } catch (e) {
            // Erreur lors de la lecture du son
        }
    }
    
    // Vaisseau
    const ship = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 5,
        baseSpeed: 5, // Vitesse de base pour le speedBoost
        color: '#00ffff'
    };
    
    // Projectiles
    let bullets = [];
    
    // Astéroïdes
    let asteroids = [];
    
    // Particules d'explosion
    let particles = [];
    
    // Boosts
    let powerUps = [];
    
    // État des boosts actifs
    let activePowerUps = {
        rapidFire: false,
        shield: false,
        shrink: false,
        bigBullets: false,
        tripleShot: false,
        timeSlow: false,
        offensiveShield: false,
        magnet: false,
        multiShot: false,
        explosiveBullets: false,
        speedBoost: false,
        scoreMultiplier: false,
        autoAim: false,
        rapidFireEndTime: 0,
        shieldEndTime: 0,
        shrinkEndTime: 0,
        bigBulletsEndTime: 0,
        tripleShotEndTime: 0,
        timeSlowEndTime: 0,
        offensiveShieldEndTime: 0,
        magnetEndTime: 0,
        multiShotEndTime: 0,
        explosiveBulletsEndTime: 0,
        speedBoostEndTime: 0,
        scoreMultiplierEndTime: 0,
        autoAimEndTime: 0
    };
    
    // Multiplicateur de ralentissement temporel
    let timeSlowMultiplier = 1.0;
    
    // Particules de traînée du vaisseau
    let shipTrail = [];
    
    // Effet de shake de l'écran
    let screenShake = { x: 0, y: 0, intensity: 0 };
    
    // Particules de score
    let scoreParticles = [];
    
    // Statistiques de partie
    let gameStats = {
        asteroidsDestroyed: 0,
        bulletsFired: 0,
        bulletsHit: 0,
        powerUpsCollected: 0,
        timePlayed: 0,
        startTime: 0
    };
    
    // Étoiles de fond
    let stars = [];
    
    // Animations de fond rares
    let backgroundEvents = [];
    
    // Animations visuelles pour les bonus (remplace les messages texte)
    let powerUpVisualAnimations = [];
    
    // Boss
    let boss = null;
    let bossBullets = [];
    let bossPhotos = {}; // Stocke les photos des boss (1-10)
    
    // Variables de tir
    let lastShotTime = 0;
    let baseFireRate = 300; // Temps entre les tirs en ms
    let currentFireRate = baseFireRate;
    
    // Vérifications de sécurité pour tous les éléments
    if (!canvas || !ctx) return;
    
    // Éléments UI
    const healthBarFill = document.getElementById('health-bar-fill');
    const shieldBarFill = document.getElementById('shield-bar-fill');
    const bossHealthContainer = document.getElementById('boss-health-container');
    const bossBarFill = document.getElementById('boss-bar-fill');
    const gameModeSelect = document.getElementById('game-mode-select');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const showLeaderboardBtn = document.getElementById('show-leaderboard');
    const closeLeaderboardBtn = document.getElementById('close-leaderboard');
    const leaderboardList = document.getElementById('leaderboard-list');
    const scoreRegister = document.getElementById('score-register');
    const scoreRegisterForm = document.getElementById('score-register-form');
    const playerNameInput = document.getElementById('player-name');
    const registerScoreValue = document.getElementById('register-score-value');
    const registerLevelValue = document.getElementById('register-level-value');
    const registerPositionValue = document.getElementById('register-position-value');
    const cancelRegisterBtn = document.getElementById('cancel-register');
    const registerScoreBtn = document.getElementById('register-score-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const gameWrapper = document.querySelector('.game-wrapper');
    const currentLevelDisplay = document.getElementById('current-level-display');
    
    
    // Leaderboard
    let leaderboard = [];
    const MAX_LEADERBOARD_ENTRIES = 10;
    
    let leaderboardSyncInterval = null;
    
    // Charger automatiquement les images de boss par défaut (même système que les images utilisateur)
    function loadDefaultBossImages() {
        const bossImagePaths = {
            1: '../ressources/images/Locked_in_alien.jpg',
            2: '../ressources/images/Goku_SSJ3.webp',
            3: '../ressources/images/Karism.jpg',
            4: '../ressources/images/Herobrine.avif',
            5: '../ressources/images/Goblinstein.jpg',
            6: '../ressources/images/Michael_Personne.avif',
            7: '../ressources/images/M_BAER.jpg',
            8: '../ressources/images/Sunshine.jpg',
            9: '../ressources/images/What_Sans.webp',
            10: '../ressources/images/IUT_GUSTAVE_EIFFEL.png'
        };
        
        Object.keys(bossImagePaths).forEach(bossNum => {
            // Utiliser le même système que les images utilisateur (FileReader + Image)
            fetch(bossImagePaths[bossNum])
                .then(response => {
                    if (!response.ok) {
                        console.warn(`Image boss ${bossNum} non trouvée: ${bossImagePaths[bossNum]}`);
                        return null;
                    }
                    return response.blob();
                })
                .then(blob => {
                    if (!blob) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            bossPhotos[parseInt(bossNum)] = img;
                            console.log(`✅ Image boss ${bossNum} chargée: ${bossImagePaths[bossNum]}`);
                        };
                        img.onerror = () => {
                            console.warn(`Erreur chargement image boss ${bossNum}`);
                        };
                        img.src = event.target.result;
                    };
                    reader.onerror = () => {
                        console.warn(`Erreur lecture image boss ${bossNum}`);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => {
                    console.warn(`Erreur fetch image boss ${bossNum}:`, error);
                });
        });
    }
    
    // Charger les images au démarrage
    loadDefaultBossImages();
    
    // Plein écran
    let isFullscreen = false;
    
    // Fonction pour activer le plein écran
    function enterFullscreen() {
        if (!gameWrapper) return;
        const element = gameWrapper;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { // Safari
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
    }
    
    // Fonction pour désactiver le plein écran
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
    
    // Fonction pour ajuster le canvas en plein écran (agrandissement proportionnel)
    function adjustCanvasForFullscreen() {
        if (!canvas) return;
        
        if (isFullscreen) {
            // En plein écran, agrandir proportionnellement (pas étendre)
            const baseWidth = 800;
            const baseHeight = 600;
            const scaleFactor = Math.min(
                window.innerWidth / baseWidth,
                window.innerHeight / baseHeight
            ) * 0.95; // 95% pour garder des marges
            
            canvas.width = baseWidth * scaleFactor;
            canvas.height = baseHeight * scaleFactor;
            
            // Réinitialiser la position du vaisseau
            if (canvas) ship.x = canvas.width / 2;
            ship.y = canvas.height - 80;
            
            // Redessiner
            if (gameState.isPlaying || gameState.isPaused) {
                draw();
            }
        } else {
            // Retour à la taille normale
            canvas.width = 800;
            canvas.height = 600;
            
            // Réinitialiser la position du vaisseau
            if (canvas) ship.x = canvas.width / 2;
            ship.y = canvas.height - 80;
            
            // Redessiner
            if (gameState.isPlaying || gameState.isPaused) {
                draw();
            }
        }
    }
    
    // Gestionnaire d'événements pour le plein écran
    function handleFullscreenChange() {
        isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        if (fullscreenBtn) {
            if (isFullscreen) {
                fullscreenBtn.textContent = '⛶ Quitter Plein Écran';
                fullscreenBtn.classList.add('active');
            } else {
                fullscreenBtn.textContent = '⛶ Plein Écran';
                fullscreenBtn.classList.remove('active');
            }
        }
        
        // Ajuster le canvas après un court délai pour s'assurer que la taille est correcte
        setTimeout(() => {
            adjustCanvasForFullscreen();
        }, 100);
    }
    
    // Écouter les changements de plein écran
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Gestionnaire pour le redimensionnement en plein écran
    window.addEventListener('resize', () => {
        if (isFullscreen) {
            adjustCanvasForFullscreen();
        }
    });
    
    // Charger le leaderboard depuis Supabase (ou localStorage en fallback)
    async function loadLeaderboard() {
        console.log('📥 loadLeaderboard() appelé');
        console.log('🔍 window.supabaseLeaderboard:', window.supabaseLeaderboard);
        
        // Utiliser Supabase si disponible, sinon localStorage
        if (window.supabaseLeaderboard && window.supabaseLeaderboard.load) {
            try {
                console.log('🔄 Tentative de chargement depuis Supabase...');
                const data = await window.supabaseLeaderboard.load();
                console.log('📊 Données reçues de Supabase:', data);
                
                if (data && Array.isArray(data) && data.length > 0) {
                    console.log('✅ Données valides reçues de Supabase');
                    leaderboard = data;
                    console.log(`✅ Leaderboard chargé depuis Supabase: ${leaderboard.length} scores`);
                    console.log('📋 Contenu leaderboard complet:', JSON.stringify(leaderboard, null, 2));
                    
                    // Mettre à jour l'affichage si le modal est ouvert
                    if (leaderboardModal && !leaderboardModal.classList.contains('hidden')) {
                        console.log('🔄 Modal ouvert, mise à jour de l\'affichage...');
                        updateLeaderboardDisplay();
                    }
                    return;
                } else {
                    console.log('📭 Aucune donnée valide dans Supabase');
                    console.log('📊 Type de data:', typeof data);
                    console.log('📊 Est un array?', Array.isArray(data));
                    console.log('📊 Longueur:', data ? data.length : 'data est null/undefined');
                }
            } catch (error) {
                console.error('❌ Erreur chargement Supabase:', error);
                console.warn('⚠️ Fallback vers localStorage');
            }
        } else {
            console.warn('⚠️ window.supabaseLeaderboard non disponible');
            console.warn('💡 Vérifiez que js/space-shooter-supabase.js est chargé');
        }
        
        // Fallback: Charger depuis localStorage
        const stored = localStorage.getItem('spaceShooterLeaderboard');
        if (stored) {
            try {
                leaderboard = JSON.parse(stored);
                console.log(`📦 Leaderboard chargé depuis localStorage: ${leaderboard.length} scores`);
                
                // Mettre à jour l'affichage si le modal est ouvert
                if (leaderboardModal && !leaderboardModal.classList.contains('hidden')) {
                    updateLeaderboardDisplay();
                }
            } catch (e) {
                console.error('Erreur parsing localStorage:', e);
                leaderboard = [];
            }
        } else {
            leaderboard = [];
            console.log('📭 Aucun leaderboard trouvé (ni Supabase ni localStorage)');
        }
    }
    
    async function saveLeaderboard() {
        localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(leaderboard));
    }
    
    // Synchroniser le leaderboard périodiquement avec Supabase
    function startLeaderboardSync() {
        // Supabase : rechargement périodique (pas de temps réel nécessaire pour un leaderboard simple)
        if (leaderboardSyncInterval) {
            clearInterval(leaderboardSyncInterval);
        }
        leaderboardSyncInterval = setInterval(() => {
            loadLeaderboard().then(() => {
                if (leaderboardModal && !leaderboardModal.classList.contains('hidden')) {
                    updateLeaderboardDisplay();
                }
            });
        }, 5000);
    }
    
    function stopLeaderboardSync() {
        if (leaderboardSyncInterval) {
            clearInterval(leaderboardSyncInterval);
            leaderboardSyncInterval = null;
        }
    }
    
    function canRegisterScore(score) {
        // Validation locale : vérifier si le score peut entrer dans le top 10
        if (!leaderboard || leaderboard.length === 0) return true;
        
        // Si le leaderboard n'est pas plein, on peut toujours enregistrer
        if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) return true;
        
        // Si le leaderboard est plein, vérifier si le score dépasse le dernier du top 10
        const lastScore = leaderboard[leaderboard.length - 1].score;
        return score > lastScore;
    }
    
    async function registerScore(name, score, level) {
        // Vérification locale : le score doit dépasser le dernier du top 10
        
        // Vérifier que le score peut entrer dans le top 10
        if (!canRegisterScore(score)) {
            throw new Error('Le score n\'est pas assez élevé pour entrer dans le top 10');
        }
        
        // Ajouter le score au leaderboard local
        leaderboard.push({ 
            name: name.substring(0, 20), 
            score: score, 
            level: level, 
            date: new Date().toISOString() 
        });
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Garder seulement le top 10
        if (leaderboard.length > MAX_LEADERBOARD_ENTRIES) {
            leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
        }
        
        // Sauvegarder localement
        saveLeaderboard();
        
        // Enregistrer dans Supabase en arrière-plan (sans bloquer)
        if (window.supabaseLeaderboard && window.supabaseLeaderboard.save) {
            try {
                console.log('🔄 Tentative d\'enregistrement dans Supabase...');
                const success = await window.supabaseLeaderboard.save(name, score, level);
                if (success) {
                    console.log('✅ Score enregistré dans Supabase avec succès');
                    // Recharger le leaderboard après enregistrement
                    setTimeout(async () => {
                        console.log('🔄 Rechargement du leaderboard après enregistrement...');
                        await loadLeaderboard();
                        updateLeaderboardDisplay();
                    }, 500);
                } else {
                    console.warn('⚠️ Score enregistré localement uniquement (Supabase a retourné false)');
                }
            } catch (error) {
                console.error('❌ Erreur enregistrement Supabase:', error);
                console.error('📝 Détails:', error.message, error.code);
                console.warn('⚠️ Score enregistré localement uniquement');
            }
        } else {
            console.warn('⚠️ Supabase non disponible, score enregistré uniquement en local');
            console.warn('💡 Vérifiez que Supabase est bien initialisé (voir SETUP_SUPABASE.md)');
        }
        
        updateLeaderboardDisplay();
    }
    
    function updateLeaderboardDisplay() {
        if (!leaderboardList) return;
        
        leaderboardList.innerHTML = '';
        
        const topScores = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
        
        if (topScores.length === 0) {
            leaderboardList.innerHTML = '<p class="no-scores">Aucun score enregistré. Soyez le premier !</p>';
            return;
        }
        
        topScores.forEach((entry, index) => {
            console.log(`📝 Affichage entrée ${index + 1}:`, entry);
            
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';
            
            const placeClasses = ['first-place', 'second-place', 'third-place', 'regular-place'];
            entryDiv.classList.add(placeClasses[Math.min(index, 3)]);
            
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            
            // Gérer les dates (peuvent être des strings ou des objets Date)
            let dateStr = '';
            try {
                const dateObj = entry.date ? new Date(entry.date) : new Date();
                dateStr = dateObj.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } catch (e) {
                console.warn('⚠️ Erreur formatage date:', e, entry.date);
                dateStr = 'Date inconnue';
            }
            
            // S'assurer que les valeurs sont bien définies
            const name = entry.name || 'Anonyme';
            const score = Number(entry.score) || 0;
            const level = Number(entry.level) || 1;
            
            entryDiv.innerHTML = `
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-name">${name}</div>
                <div class="leaderboard-score">${score.toLocaleString()}</div>
                <div class="leaderboard-level">Niv. ${level}</div>
            `;
            leaderboardList.appendChild(entryDiv);
        });
        
        console.log(`✅ ${topScores.length} entrées affichées dans le leaderboard`);
    }
    
    // Calcule la position qu'aura le score dans le leaderboard
    function calculateScorePosition(score) {
        loadLeaderboard();
        let position = leaderboard.length + 1;
        
        for (let i = 0; i < leaderboard.length; i++) {
            if (score > leaderboard[i].score) {
                position = i + 1;
                break;
            }
        }
        
        // Si on dépasse 10, on ne peut pas entrer
        if (position > MAX_LEADERBOARD_ENTRIES) {
            return null;
        }
        
        return position;
    }
    
    async function showLeaderboard() {
        console.log('📊 showLeaderboard() appelé');
        console.log('🔍 leaderboardModal:', leaderboardModal);
        console.log('🔍 leaderboardList:', leaderboardList);
        
        if (!leaderboardModal) {
            console.error('❌ leaderboardModal non trouvé');
            console.error('💡 Vérifiez que l\'élément #leaderboard-modal existe dans le HTML');
            return;
        }
        
        if (!leaderboardList) {
            console.error('❌ leaderboardList non trouvé');
            console.error('💡 Vérifiez que l\'élément #leaderboard-list existe dans le HTML');
            return;
        }
        
        console.log('🔄 Chargement du leaderboard...');
        await loadLeaderboard();
        
        console.log('📋 Leaderboard après chargement:', leaderboard);
        console.log('📊 Nombre de scores:', leaderboard.length);
        
        console.log('🔄 Mise à jour de l\'affichage...');
        updateLeaderboardDisplay();
        
        console.log('🔄 Suppression de la classe "hidden"...');
        leaderboardModal.classList.remove('hidden');
        
        console.log('🔍 Classes du modal après:', leaderboardModal.className);
        console.log('🔍 Display du modal:', window.getComputedStyle(leaderboardModal).display);
        
        startLeaderboardSync();
        
        console.log('✅ Leaderboard affiché');
    }
    
    function hideLeaderboard() {
        if (!leaderboardModal) return;
        leaderboardModal.classList.add('hidden');
        stopLeaderboardSync();
    }
    
    // Initialisation
    function init() {
        if (!canvas || !ctx) return;
        ship.x = canvas.width / 2;
        ship.speed = ship.baseSpeed; // Réinitialiser la vitesse
        bullets = [];
        asteroids = [];
        particles = [];
        powerUps = [];
        stars = [];
        backgroundEvents = [];
        shipTrail = [];
        scoreParticles = [];
        screenShake = { x: 0, y: 0, intensity: 0 };
        
        // Réinitialiser les statistiques
        gameStats = {
            asteroidsDestroyed: 0,
            bulletsFired: 0,
            bulletsHit: 0,
            powerUpsCollected: 0,
            timePlayed: 0,
            startTime: Date.now()
        };
        boss = null;
        bossBullets = [];
        gameState.score = 0;
        gameState.level = 1;
        gameState.lives = 3;
        gameState.maxLives = 3;
        gameState.gameSpeed = 2;
        gameState.bossActive = false;
        currentFireRate = baseFireRate;
        activePowerUps = {
            rapidFire: false,
            shield: false,
            shrink: false,
            bigBullets: false,
            tripleShot: false,
            timeSlow: false,
            offensiveShield: false,
            magnet: false,
            multiShot: false,
            explosiveBullets: false,
            speedBoost: false,
            scoreMultiplier: false,
            autoAim: false,
            rapidFireEndTime: 0,
            shieldEndTime: 0,
            shrinkEndTime: 0,
            bigBulletsEndTime: 0,
            tripleShotEndTime: 0,
            timeSlowEndTime: 0,
            offensiveShieldEndTime: 0,
            magnetEndTime: 0,
            multiShotEndTime: 0,
            explosiveBulletsEndTime: 0,
            speedBoostEndTime: 0,
            scoreMultiplierEndTime: 0,
            autoAimEndTime: 0
        };
        timeSlowMultiplier = 1.0;
        lastShotTime = 0;
        if (currentLevelDisplay) {
            currentLevelDisplay.textContent = gameState.level;
        }
        
        // Créer les étoiles
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.2
            });
        }
        
        updateHealthBars();
        updateHighScore();
        updateBuffIcons();
    }
    
    // Met à jour les icônes de buff actifs
    function updateBuffIcons() {
        if (!activeBuffsContainer) return;
        
        const now = Date.now();
        const WARNING_TIME = 2000; // Clignotement 2 secondes avant la fin
        
        // Liste des buffs actifs avec leurs temps restants
        const activeBuffs = [];
        
        // Vérifier chaque type de buff
        const buffTypes = ['rapidFire', 'shrink', 'bigBullets', 'tripleShot', 'timeSlow', 'offensiveShield', 'magnet', 'multiShot', 'explosiveBullets', 'speedBoost', 'scoreMultiplier', 'autoAim'];
        buffTypes.forEach(buffType => {
            const isActive = activePowerUps[buffType] && now < activePowerUps[`${buffType}EndTime`];
            if (isActive) {
                const endTime = activePowerUps[`${buffType}EndTime`];
                const timeLeft = endTime - now;
                activeBuffs.push({
                    type: buffType,
                    emoji: buffEmojis[buffType],
                    timeLeft: timeLeft,
                    isWarning: timeLeft < WARNING_TIME
                });
            }
        });
        
        // Vider le conteneur
        activeBuffsContainer.innerHTML = '';
        
        // Créer une icône pour chaque buff actif (sans doublons)
        const displayedTypes = new Set();
        activeBuffs.forEach(buff => {
            // Éviter les doublons
            if (!displayedTypes.has(buff.type)) {
                displayedTypes.add(buff.type);
                
                const buffIcon = document.createElement('div');
                buffIcon.className = 'buff-icon';
                buffIcon.id = `buff-${buff.type}`;
                
                // Pour le rétrécissement, créer une icône personnalisée (flèche verte identique au jeu)
                if (buff.type === 'shrink') {
                    // Flèche vers le bas verte : forme identique à drawPowerUp
                    buffIcon.innerHTML = '<svg width="24" height="24" viewBox="-8 -8 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 0 -8 L -6 0 L -3 0 L -3 8 L 3 8 L 3 0 L 6 0 Z" fill="#00ff00" stroke="#00aa00" stroke-width="1.5" stroke-linejoin="round"/></svg>';
                } else {
                    buffIcon.textContent = buff.emoji;
                }
                
                if (buff.isWarning) {
                    buffIcon.classList.add('warning');
                }
                
                activeBuffsContainer.appendChild(buffIcon);
            }
        });
    }
    
    // Met à jour les barres de vie et shield
    function updateHealthBars() {
        if (!healthBarFill || !shieldBarFill || !bossBarFill) return;
        
        const healthPercent = (gameState.lives / gameState.maxLives) * 100;
        healthBarFill.style.width = healthPercent + '%';
        
        if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
            const shieldPercent = ((activePowerUps.shieldEndTime - Date.now()) / 8000) * 100;
            shieldBarFill.style.width = Math.max(0, shieldPercent) + '%';
        } else {
            shieldBarFill.style.width = '0%';
        }
        
        if (boss && gameState.bossActive) {
            const bossPercent = (boss.health / boss.maxHealth) * 100;
            bossBarFill.style.width = bossPercent + '%';
            if (bossHealthContainer) {
                bossHealthContainer.style.display = 'block';
            }
        } else {
            if (bossHealthContainer) {
                bossHealthContainer.style.display = 'none';
            }
        }
    }
    
    function updateHighScore() {
        if (highScoreElement) highScoreElement.textContent = gameState.highScore;
        if (finalHighScore) finalHighScore.textContent = gameState.highScore;
    }
    
    // Dessin
    function draw() {
        if (!canvas || !ctx) return;
        
        // Appliquer le shake de l'écran
        ctx.save();
        ctx.translate(screenShake.x, screenShake.y);
        
        // Fond avec gradient selon le thème
        const currentTheme = getCurrentTheme();
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, currentTheme.background.top);
        gradient.addColorStop(1, currentTheme.background.bottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Effet de ralentissement temporel (distorsion visuelle)
        if (activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime) {
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        
        // Étoiles selon le thème
        stars.forEach(star => {
            ctx.fillStyle = currentTheme.stars;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Traînées de particules du vaisseau
        shipTrail.forEach((trail, index) => {
            ctx.save();
            ctx.globalAlpha = trail.alpha;
            ctx.fillStyle = ship.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = ship.color;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, 3 - (index / shipTrail.length) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Vaisseau
        if (gameState.isPlaying || gameState.isPaused) {
            drawShip(ship.x, ship.y);
        }
        
        // Bouclier offensif visuel
        if (activePowerUps.offensiveShield && Date.now() < activePowerUps.offensiveShieldEndTime) {
            ctx.save();
            ctx.translate(ship.x, ship.y);
            const pulse = Math.sin(Date.now() / 80) * 0.15 + 1;
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(0, 0, (ship.width / 2 + 12) * pulse, 0, Math.PI * 2);
            ctx.stroke();
            // Épée au centre
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(0, 10);
            ctx.moveTo(-4, -6);
            ctx.lineTo(4, -6);
            ctx.stroke();
            ctx.restore();
        }
        
        // Projectiles selon le thème
        bullets.forEach(bullet => {
            ctx.fillStyle = currentTheme.bullets;
            ctx.shadowBlur = 10;
            ctx.shadowColor = currentTheme.bullets;
            const bulletSize = bullet.size || 4;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bulletSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        // Astéroïdes
        asteroids.forEach(asteroid => {
            drawAsteroid(asteroid);
        });
        
        // Boosts
        powerUps.forEach(powerUp => {
            drawPowerUp(powerUp);
        });
        
        // Bouclier actif
        if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
            drawShield();
        }
        
        // Particules avec effets stylés selon le type
        particles.forEach(particle => {
            if (!particle) return;
            
            ctx.save();
            ctx.globalAlpha = particle.alpha || 1;
            
            if (particle.type === 'star') {
                // Étoile stylée avec 4 branches
            ctx.fillStyle = particle.color;
                ctx.shadowBlur = particle.size * 3;
                ctx.shadowColor = particle.color;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(Math.atan2(particle.vy || 0, particle.vx || 0));
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI / 2) * i;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle) * particle.size * 1.5, Math.sin(angle) * particle.size * 1.5);
                }
                ctx.closePath();
                ctx.fill();
            } else if (particle.type === 'sparkle') {
                // Étincelle brillante avec effet de lueur
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = particle.size * 4;
                ctx.shadowColor = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
                // Cœur brillant supplémentaire
                ctx.globalAlpha = particle.alpha * 0.5;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Particule normale avec effet de lueur amélioré
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = particle.size * 2.5;
                ctx.shadowColor = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
        
        // Animations de fond rares
        backgroundEvents.forEach(event => {
            drawBackgroundEvent(event);
        });
        
        // Animations visuelles des bonus
        drawPowerUpVisualAnimations();
        
        // Boss
        if (boss && gameState.bossActive) {
            try {
                drawBoss();
            } catch (e) {
                console.error('❌ Erreur drawBoss:', e);
            }
        } else if (gameState.bossActive && !boss) {
            // État incohérent détecté
            console.warn('⚠️ gameState.bossActive=true mais boss=null - reset');
            gameState.bossActive = false;
        }
        
        // Projectiles du boss
        bossBullets.forEach(bullet => {
            ctx.fillStyle = bullet.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = bullet.color;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        // Dessiner les particules de score
        drawScoreParticles();
        
        // Restaurer le contexte après le shake
        ctx.restore();
    }
    
    // Dessine les événements de fond
    function drawBackgroundEvent(event) {
        ctx.save();
        ctx.globalAlpha = event.alpha;
        
        if (event.type === 'rocket') {
            // Fusée
            ctx.fillStyle = '#ff8800';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff8800';
            ctx.beginPath();
            ctx.moveTo(event.x, event.y);
            ctx.lineTo(event.x - 10, event.y + 20);
            ctx.lineTo(event.x + 10, event.y + 20);
            ctx.closePath();
            ctx.fill();
            
            // Flamme
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(event.x, event.y + 20, 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (event.type === 'shootingStar') {
            // Étoile filante
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(event.x, event.y);
            ctx.lineTo(event.x - event.length, event.y + event.length);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // Dessine le boss
    function drawBoss() {
        if (!boss || !gameState.bossActive || !boss.bossNumber) return;
        
        // Vérifications de sécurité supplémentaires
        if (typeof boss.x !== 'number' || typeof boss.y !== 'number' || typeof boss.size !== 'number') {
            console.warn('Boss invalide, skip draw');
            return;
        }
        
        ctx.save();
        ctx.translate(boss.x, boss.y);
        
        const effect = getBossImageEffect(boss.bossNumber);
        const imageSize = boss.size * 2;
        
        // Dessiner l'effet autour du boss (toujours, même sans image)
        drawBossImageEffect(effect, imageSize);
        
        // Image du boss si disponible et chargée
        if (boss.image && boss.image.complete && boss.image.naturalWidth > 0) {
            try {
                // Créer un masque circulaire pour arrondir l'image
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, imageSize / 2, 0, Math.PI * 2);
                ctx.clip();
                
                // Dessiner l'image arrondie
                ctx.drawImage(boss.image, -imageSize / 2, -imageSize / 2, imageSize, imageSize);
                ctx.restore();
                
                // Contour de l'image arrondie
                ctx.strokeStyle = effect.color;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 10;
                ctx.shadowColor = effect.color;
                ctx.beginPath();
                ctx.arc(0, 0, imageSize / 2, 0, Math.PI * 2);
                ctx.stroke();
            } catch (e) {
                // Erreur lors du dessin de l'image - utiliser la forme par défaut
                console.warn('Erreur dessin image boss, utilisation forme par défaut:', e);
                // Continuer vers la forme par défaut
            }
        }
        
        // Forme par défaut si pas d'image, image non chargée, ou erreur (TOUJOURS affichée)
        if (!boss.image || !boss.image.complete || boss.image.naturalWidth === 0) {
            try {
                // Forme par défaut : boule colorée avec effets
                const gradient = ctx.createRadialGradient(0, -boss.size * 0.3, 0, 0, 0, boss.size);
                gradient.addColorStop(0, boss.color);
                gradient.addColorStop(0.5, boss.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
                
                // Ombre portée
                ctx.shadowBlur = 30;
                ctx.shadowColor = boss.color;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                
                // Cercle principal
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, boss.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Reflet lumineux
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(-boss.size * 0.3, -boss.size * 0.3, boss.size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Contour
                ctx.strokeStyle = boss.color;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 0, boss.size, 0, Math.PI * 2);
                ctx.stroke();
                
                // Particules autour du boss
                const time = Date.now() * 0.001;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + time;
                    const distance = boss.size + 10;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    ctx.fillStyle = boss.color;
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            } catch (e) {
                // Dernière solution : cercle simple si tout échoue
                console.error('Erreur dessin forme par défaut boss, fallback cercle simple:', e);
                ctx.fillStyle = boss.color;
                ctx.beginPath();
                ctx.arc(0, 0, boss.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
    
    function drawShip(x, y) {
        // Clignotement si invincible (1-2 secondes)
        if (ship.invincible) {
            const blinkSpeed = 150; // ms par clignotement
            const blinkTime = Date.now() % (blinkSpeed * 2);
            if (blinkTime < blinkSpeed) {
                // Ne pas dessiner pendant la moitié du temps (clignotement)
                return;
            }
        }
        
        ctx.save();
        ctx.translate(x, y);
        
        // Rétrécissement si bonus actif
        const shrinkScale = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? 0.6 : 1.0;
        ctx.scale(shrinkScale, shrinkScale);
        
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
    
    function drawPowerUp(powerUp) {
        ctx.save();
        ctx.translate(powerUp.x, powerUp.y);
        
        // Animation de pulsation
        const pulse = Math.sin(Date.now() / 200) * 0.2 + 1;
        ctx.scale(pulse, pulse);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = powerUp.color;
        
        // Dessine le boost selon son type
        if (powerUp.type === 'rapidFire') {
            // Boost vitesse de tir - éclair
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(-5, 0);
            ctx.lineTo(0, 5);
            ctx.lineTo(5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'shield') {
            // Boost protection - bouclier
            ctx.fillStyle = '#00ffff';
            ctx.strokeStyle = '#0088ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'life') {
            // Boost vie - cœur
            ctx.fillStyle = '#ff00ff';
            ctx.strokeStyle = '#ff0088';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.bezierCurveTo(0, 0, -8, 0, -8, 5);
            ctx.bezierCurveTo(-8, 8, 0, 12, 0, 12);
            ctx.bezierCurveTo(0, 12, 8, 8, 8, 5);
            ctx.bezierCurveTo(8, 0, 0, 0, 0, 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'shrink') {
            // Rétrécissement - flèche vers le bas
            ctx.fillStyle = '#00ff00';
            ctx.strokeStyle = '#00aa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(-6, 0);
            ctx.lineTo(-3, 0);
            ctx.lineTo(-3, 8);
            ctx.lineTo(3, 8);
            ctx.lineTo(3, 0);
            ctx.lineTo(6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'bigBullets') {
            // Munitions plus grandes - cercle avec étoile
            ctx.fillStyle = '#ff8800';
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const x = Math.cos(angle) * 5;
                const y = Math.sin(angle) * 5;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        } else if (powerUp.type === 'tripleShot') {
            // Tir triple - trois lignes
            ctx.fillStyle = '#ff00ff';
            ctx.strokeStyle = '#ff0088';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-8, -8);
            ctx.lineTo(0, 8);
            ctx.moveTo(0, -8);
            ctx.lineTo(0, 8);
            ctx.moveTo(8, -8);
            ctx.lineTo(0, 8);
            ctx.stroke();
        } else if (powerUp.type === 'timeSlow') {
            // Ralentissement temporel - horloge
            ctx.fillStyle = '#9b59b6';
            ctx.strokeStyle = '#7d3c98';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Aiguilles de l'horloge
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -5);
            ctx.moveTo(0, 0);
            ctx.lineTo(4, 0);
            ctx.stroke();
        } else if (powerUp.type === 'offensiveShield') {
            // Bouclier offensif - bouclier avec épée
            ctx.fillStyle = '#ff6b6b';
            ctx.strokeStyle = '#ee5a52';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Épée au centre
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(0, 8);
            ctx.moveTo(-3, -5);
            ctx.lineTo(3, -5);
            ctx.stroke();
        } else if (powerUp.type === 'magnet') {
            // Magnet - aimant
            ctx.fillStyle = '#e74c3c';
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 2;
            // Forme d'aimant en U
            ctx.beginPath();
            ctx.arc(-6, 0, 6, 0, Math.PI, false);
            ctx.arc(6, 0, 6, 0, Math.PI, false);
            ctx.lineTo(12, -8);
            ctx.lineTo(-12, -8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    function drawShield() {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        
        // Bouclier pulsant
        const pulse = Math.sin(Date.now() / 100) * 0.1 + 1;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ffff';
        
        ctx.beginPath();
        ctx.arc(0, 0, (ship.width / 2 + 10) * pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Mise à jour
    function update() {
        // Ne pas bloquer les animations et spawns - seul le bouton pause peut vraiment mettre en pause
        if (!gameState.isPlaying) return;
        
        // Si le jeu est en pause, on continue quand même les animations de fond (étoiles, particules)
        // mais on ne met pas à jour les entités actives
        if (gameState.isPaused) {
            // Continuer les animations de fond même en pause
            stars.forEach(star => {
                star.y += star.speed + gameState.gameSpeed * 0.3;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });
            return;
        }
        
        // Mise à jour des étoiles
        stars.forEach(star => {
            star.y += star.speed + gameState.gameSpeed * 0.3;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        
        // Événements de fond rares (1% de chance par frame)
        if (Math.random() < 0.01) {
            const eventType = Math.random();
            if (eventType < 0.5) {
                // Fusée (50% des événements)
                backgroundEvents.push({
                    type: 'rocket',
                    x: Math.random() * canvas.width,
                    y: canvas.height + 20,
                    speed: Math.random() * 3 + 2,
                    alpha: 0.7,
                    life: 200
                });
            } else {
                // Étoile filante (50% des événements)
                const startX = Math.random() * canvas.width;
                backgroundEvents.push({
                    type: 'shootingStar',
                    x: startX,
                    y: -20,
                    length: 30,
                    speed: Math.random() * 5 + 3,
                    alpha: 0.8,
                    life: 150
                });
            }
        }
        
        // Mise à jour des événements de fond (ralentissement temporel)
        const slowMultiplierEvents = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        backgroundEvents.forEach((event, index) => {
            if (event.type === 'rocket') {
                event.y -= event.speed * slowMultiplierEvents;
            } else if (event.type === 'shootingStar') {
                event.x += event.speed * 0.5 * slowMultiplierEvents;
                event.y += event.speed * slowMultiplierEvents;
            }
            event.life--;
            event.alpha = Math.max(0, event.alpha - 0.01);
            
            if (event.life <= 0 || event.y < -50 || event.y > canvas.height + 50 || event.x > canvas.width + 50) {
                backgroundEvents.splice(index, 1);
            }
        });
        
        // Mise à jour des animations visuelles des bonus
        updatePowerUpVisualAnimations();
        
        // Mise à jour des particules de score
        updateScoreParticles();
        
        // Mise à jour du boss
        updateBoss();
        
        // Mise à jour des statistiques
        if (gameState.isPlaying && !gameState.isPaused) {
            gameStats.timePlayed = Date.now() - gameStats.startTime;
        }
        
        // Mise à jour des projectiles
        const slowMultiplierBullets = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        bullets.forEach((bullet, index) => {
            if (bullet.vx !== undefined || bullet.vy !== undefined) {
                // Projectile avec direction personnalisée
                bullet.y += (bullet.vy !== undefined ? bullet.vy : -bullet.speed) * slowMultiplierBullets;
                bullet.x += (bullet.vx || 0) * slowMultiplierBullets;
            } else {
                // Projectile standard (vers le haut)
                bullet.y -= bullet.speed * slowMultiplierBullets;
            }
            // Supprimer si hors écran (haut ou bas)
            if (bullet.y < 0 || bullet.y > canvas.height) {
                bullets.splice(index, 1);
            }
        });
        
        // Traînées de particules du vaisseau
        if (gameState.isPlaying && !gameState.isPaused) {
            shipTrail.push({
                x: ship.x,
                y: ship.y,
                alpha: 0.6,
                life: 10
            });
            // Limiter le nombre de particules de traînée
            if (shipTrail.length > 15) {
                shipTrail.shift();
            }
        }
        
        // Mise à jour des traînées
        shipTrail.forEach((trail, index) => {
            trail.alpha -= 0.04;
            trail.life--;
            if (trail.alpha <= 0 || trail.life <= 0) {
                shipTrail.splice(index, 1);
            }
        });
        
        // Réduction du shake de l'écran
        screenShake.intensity *= 0.9;
        screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
        if (screenShake.intensity < 0.1) {
            screenShake.intensity = 0;
            screenShake.x = 0;
            screenShake.y = 0;
        }
        
        // Mise à jour des astéroïdes
        const slowMultiplier = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed * slowMultiplier;
            asteroid.rotation += asteroid.rotationSpeed * slowMultiplier;
            
            if (asteroid.y > canvas.height + 50) {
                asteroids.splice(index, 1);
            }
        });
        
        // Mise à jour des particules
        // Limiter le nombre de particules pour éviter les crashes
        if (particles.length > 200) {
            // Supprimer les particules les plus anciennes
            particles = particles.slice(-150);
        }
        
        particles.forEach((particle, index) => {
            if (!particle) {
                particles.splice(index, 1);
                return;
            }
            
            try {
                particle.x += particle.vx || 0;
                particle.y += particle.vy || 0;
                particle.vy = (particle.vy || 0) + 0.1; // Gravité
                particle.alpha = (particle.alpha || 1) - 0.02;
                particle.size = (particle.size || 1) - 0.1;
                
                if (particle.alpha <= 0 || particle.size <= 0 || isNaN(particle.x) || isNaN(particle.y)) {
                    particles.splice(index, 1);
                }
            } catch (e) {
                console.warn('Erreur particule:', e);
                particles.splice(index, 1);
            }
        });
        
        // Mise à jour des boosts
        const slowMultiplierPowerUps = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        powerUps.forEach((powerUp, index) => {
            // Effet magnet : attirer les bonus vers le vaisseau
            if (activePowerUps.magnet && Date.now() < activePowerUps.magnetEndTime) {
                const dx = ship.x - powerUp.x;
                const dy = ship.y - powerUp.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const magnetForce = 0.3;
                if (distance > 0) {
                    powerUp.x += (dx / distance) * magnetForce * 5 * slowMultiplierPowerUps;
                    powerUp.y += (dy / distance) * magnetForce * 5 * slowMultiplierPowerUps;
                }
            } else {
                powerUp.y += (powerUp.speed || 2) * slowMultiplierPowerUps;
            }
            powerUp.rotation += 0.05 * slowMultiplierPowerUps;
            
            if (powerUp.y > canvas.height + 20) {
                powerUps.splice(index, 1);
            }
        });
        
        // Vérifier l'expiration des boosts actifs
        const now = Date.now();
        if (activePowerUps.rapidFire && now > activePowerUps.rapidFireEndTime) {
            activePowerUps.rapidFire = false;
            currentFireRate = baseFireRate;
            // Réinitialiser l'intervalle de tir automatique
            if (autoShootInterval) {
                clearInterval(autoShootInterval);
                autoShootInterval = null;
                if (keys['Space']) {
                    // Redémarrer avec la nouvelle vitesse
                    autoShootInterval = setInterval(() => {
                        if (gameState.isPlaying && !gameState.isPaused && keys['Space']) {
                            shoot();
                        }
                    }, currentFireRate);
                }
            }
            // Pas de message de fin
        }
        if (activePowerUps.shield && now > activePowerUps.shieldEndTime) {
            activePowerUps.shield = false;
        }
        if (activePowerUps.shrink && now > activePowerUps.shrinkEndTime) {
            activePowerUps.shrink = false;
        }
        if (activePowerUps.bigBullets && now > activePowerUps.bigBulletsEndTime) {
            activePowerUps.bigBullets = false;
        }
        if (activePowerUps.tripleShot && now > activePowerUps.tripleShotEndTime) {
            activePowerUps.tripleShot = false;
        }
        if (activePowerUps.timeSlow && now > activePowerUps.timeSlowEndTime) {
            activePowerUps.timeSlow = false;
            timeSlowMultiplier = 1.0;
        }
        if (activePowerUps.offensiveShield && now > activePowerUps.offensiveShieldEndTime) {
            activePowerUps.offensiveShield = false;
        }
        if (activePowerUps.magnet && now > activePowerUps.magnetEndTime) {
            activePowerUps.magnet = false;
        }
        
        // Mettre à jour les icônes de buff
        updateBuffIcons();
        
        // Collision projectiles/astéroïdes
        bullets.forEach((bullet, bulletIndex) => {
            asteroids.forEach((asteroid, asteroidIndex) => {
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const bulletSize = bullet.size || 4;
                if (distance < asteroid.size + bulletSize) {
                    // Explosion améliorée
                    createEnhancedExplosion(asteroid.x, asteroid.y, asteroid.color, asteroid.size);
                    playSound('explosion');
                    
                    // Score avec multiplicateur
                    // Ne pas ajouter de score si un boss est actif
                    if (!gameState.bossActive) {
                        let points = Math.floor(asteroid.size / 5) * 10;
                        // Appliquer scoreMultiplier si actif
                        if (activePowerUps.scoreMultiplier && Date.now() < activePowerUps.scoreMultiplierEndTime) {
                            points *= 2;
                        }
                        gameState.score += points;
                        if (scoreElement) scoreElement.textContent = gameState.score;
                        // Particules de score
                        createScoreParticle(asteroid.x, asteroid.y, `+${points}`);
                    }
                    
                    // Explosion des projectiles explosifs
                    if (bullet.explosive) {
                        const explosionRadius = 60;
                        // Marquer les astéroïdes à détruire (pour éviter de modifier le tableau pendant l'itération)
                        const asteroidsToDestroy = [];
                        asteroids.forEach((otherAsteroid, otherIndex) => {
                            if (otherIndex === asteroidIndex) return; // Déjà détruit
                            const dx = otherAsteroid.x - asteroid.x;
                            const dy = otherAsteroid.y - asteroid.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < explosionRadius) {
                                asteroidsToDestroy.push({ index: otherIndex, asteroid: otherAsteroid });
                            }
                        });
                        
                        // Détruire les astéroïdes marqués (en ordre inverse pour éviter les problèmes d'index)
                        asteroidsToDestroy.sort((a, b) => b.index - a.index);
                        asteroidsToDestroy.forEach(({ index, asteroid }) => {
                            // Explosion supplémentaire
                            createEnhancedExplosion(asteroid.x, asteroid.y, asteroid.color, asteroid.size * 0.5);
                            
                            // Score pour les astéroïdes détruits par l'explosion
                            if (!gameState.bossActive) {
                                let points = Math.floor(asteroid.size / 5) * 10;
                                if (activePowerUps.scoreMultiplier && Date.now() < activePowerUps.scoreMultiplierEndTime) {
                                    points *= 2;
                                }
                                gameState.score += points;
                                if (scoreElement) scoreElement.textContent = gameState.score;
                                createScoreParticle(asteroid.x, asteroid.y, `+${points}`);
                            }
                            
                            gameStats.asteroidsDestroyed++;
                            asteroids.splice(index, 1);
                        });
                    }
                    gameStats.asteroidsDestroyed++;
                    gameStats.bulletsHit++;
                    
                    // Supprimer le projectile
                    bullets.splice(bulletIndex, 1);
                    
                    // Vérifier si l'astéroïde doit se séparer
                    const isLarge = asteroid.size > 25;
                    if (isLarge && Math.random() < 0.6) {
                        // 60% de chance de se séparer en 2-3 petits astéroïdes
                        const numPieces = Math.floor(Math.random() * 2) + 2; // 2 ou 3 pièces
                        for (let i = 0; i < numPieces; i++) {
                            const angle = (Math.PI * 2 / numPieces) * i;
                            const newSize = asteroid.size * 0.4;
                            asteroids.push({
                                x: asteroid.x + Math.cos(angle) * (asteroid.size / 2),
                                y: asteroid.y + Math.sin(angle) * (asteroid.size / 2),
                                size: newSize,
                                speed: asteroid.speed * 1.2,
                                rotation: 0,
                                rotationSpeed: (Math.random() - 0.5) * 0.15,
                                color: asteroid.color
                            });
                        }
                    }
                    
                    // Chance de faire apparaître un boost (équilibré selon l'impact)
                    const boostChance = Math.random();
                    if (boostChance < 0.05) {
                        // 5% - Tir rapide (fort impact)
                        spawnPowerUp(asteroid.x, asteroid.y, 'rapidFire');
                    } else if (boostChance < 0.08) {
                        // 3% - Bouclier (fort impact)
                        spawnPowerUp(asteroid.x, asteroid.y, 'shield');
                    } else if (boostChance < 0.09) {
                        // 1% - Vie (très fort impact, très rare)
                        spawnPowerUp(asteroid.x, asteroid.y, 'life');
                    } else if (boostChance < 0.11) {
                        // 2% - Rétrécissement (impact moyen)
                        spawnPowerUp(asteroid.x, asteroid.y, 'shrink');
                    } else if (boostChance < 0.13) {
                        // 2% - Munitions XL (impact moyen)
                        spawnPowerUp(asteroid.x, asteroid.y, 'bigBullets');
                    } else if (boostChance < 0.145) {
                        // 1.5% - Tir triple (fort impact, rare)
                        spawnPowerUp(asteroid.x, asteroid.y, 'tripleShot');
                    } else if (boostChance < 0.16) {
                        // 1.5% - Ralentissement temporel (fort impact)
                        spawnPowerUp(asteroid.x, asteroid.y, 'timeSlow');
                    } else if (boostChance < 0.175) {
                        // 1.5% - Bouclier offensif (fort impact)
                        spawnPowerUp(asteroid.x, asteroid.y, 'offensiveShield');
                    } else if (boostChance < 0.19) {
                        // 1.5% - Magnet (impact moyen, utile)
                        spawnPowerUp(asteroid.x, asteroid.y, 'magnet');
                    } else if (boostChance < 0.21) {
                        // 2% - MultiShot (nouveau - impact fort)
                        spawnPowerUp(asteroid.x, asteroid.y, 'multiShot');
                    } else if (boostChance < 0.23) {
                        // 2% - ExplosiveBullets (nouveau - impact fort)
                        spawnPowerUp(asteroid.x, asteroid.y, 'explosiveBullets');
                    } else if (boostChance < 0.25) {
                        // 2% - SpeedBoost (nouveau - impact moyen)
                        spawnPowerUp(asteroid.x, asteroid.y, 'speedBoost');
                    } else if (boostChance < 0.27) {
                        // 2% - ScoreMultiplier (nouveau - impact fort)
                        spawnPowerUp(asteroid.x, asteroid.y, 'scoreMultiplier');
                    } else if (boostChance < 0.29) {
                        // 2% - AutoAim (nouveau - impact fort)
                        spawnPowerUp(asteroid.x, asteroid.y, 'autoAim');
                    }
                    
                    // Supprimer l'astéroïde
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
            
            const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
            if (distance < asteroid.size + shipSize) {
                // Si le bouclier est actif, l'astéroïde est détruit sans perdre de vie
                if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
                    createEnhancedExplosion(asteroid.x, asteroid.y, asteroid.color, asteroid.size);
                    playSound('hit');
                    asteroids.splice(index, 1);
                    // Animation visuelle remplace le message texte
                } else {
                // Explosion
                    createEnhancedExplosion(ship.x, ship.y, ship.color, 30);
                    playSound('hit');
                
                // Perdre une vie
                gameState.lives--;
                    if (livesElement) livesElement.textContent = gameState.lives;
                    updateHealthBars();
                
                // Supprimer l'astéroïde
                asteroids.splice(index, 1);
                
                // Vérifier game over
                if (gameState.lives <= 0) {
                    endGame();
                } else {
                    // Invincibilité temporaire avec clignotement (2 secondes exactement)
                    ship.invincible = true;
                    setTimeout(() => {
                        ship.invincible = false;
                    }, 2000);
                    }
                }
            }
        });
        
        // Collision vaisseau/boosts
        powerUps.forEach((powerUp, index) => {
            const dx = ship.x - powerUp.x;
            const dy = ship.y - powerUp.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) {
                collectPowerUp(powerUp);
                powerUps.splice(index, 1);
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
    
    // Explosion stylée pour les bonus avec effets visuels améliorés
    function createSmallExplosion(x, y, color) {
        try {
            // Particules principales en étoile (8 directions)
            const starParticles = 8;
            for (let i = 0; i < starParticles; i++) {
                const angle = (Math.PI * 2 / starParticles) * i;
                const speed = Math.random() * 3 + 2;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 3 + 2,
                    color: color,
                    alpha: 1,
                    life: 1,
                    type: 'star'
                });
            }
            
            // Particules secondaires aléatoires avec couleurs variées
            const randomParticles = 6;
            const colorVariations = [
                color,
                lightenColor(color, 0.3),
                darkenColor(color, 0.2),
                '#ffffff',
                '#ffff00'
            ];
            
            for (let i = 0; i < randomParticles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.5 + 1;
                const particleColor = colorVariations[Math.floor(Math.random() * colorVariations.length)];
                
                particles.push({
                    x: x + (Math.random() - 0.5) * 10,
                    y: y + (Math.random() - 0.5) * 10,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 2 + 1,
                    color: particleColor,
                    alpha: 0.8,
                    life: 0.9,
                    type: 'spark'
                });
            }
            
            // Particules de brillance (petites et rapides)
            const sparkleParticles = 4;
            for (let i = 0; i < sparkleParticles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 3;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 1.5 + 0.5,
                    color: '#ffffff',
                    alpha: 1,
                    life: 0.6,
                    type: 'sparkle'
                });
            }
        } catch (e) {
            console.warn('Erreur createSmallExplosion:', e);
        }
    }
    
    // Fonction utilitaire pour éclaircir une couleur
    function lightenColor(color, amount) {
        if (color.startsWith('#')) {
            const num = parseInt(color.replace('#', ''), 16);
            const r = Math.min(255, ((num >> 16) & 0xFF) + Math.floor(255 * amount));
            const g = Math.min(255, ((num >> 8) & 0xFF) + Math.floor(255 * amount));
            const b = Math.min(255, (num & 0xFF) + Math.floor(255 * amount));
            return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        }
        return color;
    }
    
    // Fonction utilitaire pour assombrir une couleur
    function darkenColor(color, amount) {
        if (color.startsWith('#')) {
            const num = parseInt(color.replace('#', ''), 16);
            const r = Math.max(0, ((num >> 16) & 0xFF) - Math.floor(255 * amount));
            const g = Math.max(0, ((num >> 8) & 0xFF) - Math.floor(255 * amount));
            const b = Math.max(0, (num & 0xFF) - Math.floor(255 * amount));
            return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        }
        return color;
    }
    
    // Crée une animation visuelle pour le score (comme les bonus)
    // Crée une animation visuelle pour un bonus avec lumière et texte stylé
    function createPowerUpVisualAnimation(type, x, y) {
        // Définir les textes et couleurs selon le type
        let text = '';
        let glowColor = '#ffffff';
        
        if (type === 'rapidFire') {
            text = '⚡ Tir Rapide';
            glowColor = '#ffff00';
        } else if (type === 'shield') {
            text = '🛡️ Bouclier';
            glowColor = '#00ffff';
        } else if (type === 'life') {
            text = '❤️ +1 Vie';
            glowColor = '#ff00ff';
        } else if (type === 'lifeMax') {
            text = 'Vies Max';
            glowColor = '#ff0000';
        } else if (type === 'shrink') {
            text = '🔽 Rétrécissement';
            glowColor = '#00ff00';
        } else if (type === 'bigBullets') {
            text = '💥 Munitions XL';
            glowColor = '#ff8800';
        } else if (type === 'tripleShot') {
            text = '⚡ Tir Triple';
            glowColor = '#ff00ff';
        } else if (type === 'timeSlow') {
            text = '⏱️ Ralentissement';
            glowColor = '#9b59b6';
        } else if (type === 'offensiveShield') {
            text = '🛡️ Bouclier Offensif';
            glowColor = '#ff6b6b';
        } else if (type === 'magnet') {
            text = '🧲 Magnet';
            glowColor = '#e74c3c';
        } else if (type === 'multiShot') {
            text = '🌟 Multi-Tir';
            glowColor = '#ff00ff';
        } else if (type === 'explosiveBullets') {
            text = '💣 Munitions Explosives';
            glowColor = '#ff0000';
        } else if (type === 'speedBoost') {
            text = '🚀 Boost de Vitesse';
            glowColor = '#00ff00';
        } else if (type === 'scoreMultiplier') {
            text = '💰 Score x2';
            glowColor = '#ffd700';
        } else if (type === 'autoAim') {
            text = '🎯 Visée Auto';
            glowColor = '#00ffff';
        }
        
        // Position aléatoire pour le texte (à côté du vaisseau)
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 40; // Entre 60 et 100 pixels
        const textX = x + Math.cos(angle) * distance;
        const textY = y + Math.sin(angle) * distance;
        
        const animation = {
            type: type,
            shipX: x,
            shipY: y,
            textX: textX,
            textY: textY,
            text: text,
            glowColor: glowColor,
            life: 1.0,
            alpha: 1.0,
            glowIntensity: 1.0,
            textOffsetX: (Math.random() - 0.5) * 20, // Petit mouvement aléatoire
            textOffsetY: (Math.random() - 0.5) * 20
        };
        
        powerUpVisualAnimations.push(animation);
    }
    
    // Dessine les animations visuelles des bonus avec lumière et texte stylé
    function drawPowerUpVisualAnimations() {
        powerUpVisualAnimations.forEach((anim, index) => {
            if (!anim || anim.life <= 0 || anim.type === 'score') {
                if (anim && anim.type === 'score') {
                    powerUpVisualAnimations.splice(index, 1);
                }
                return;
            }
            
            ctx.save();
            ctx.globalAlpha = anim.alpha;
            
            // 1. Dessiner la lumière autour du vaisseau (glow)
            const glowRadius = 30 + Math.sin(Date.now() * 0.005) * 5; // Pulsation légère
            const gradient = ctx.createRadialGradient(
                anim.shipX, anim.shipY, 0,
                anim.shipX, anim.shipY, glowRadius
            );
            gradient.addColorStop(0, anim.glowColor + '80'); // 50% opacity
            gradient.addColorStop(0.5, anim.glowColor + '40'); // 25% opacity
            gradient.addColorStop(1, anim.glowColor + '00'); // Transparent
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(anim.shipX, anim.shipY, glowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // 2. Dessiner le trait qui relie le texte au vaisseau
            const currentTextX = anim.textX + anim.textOffsetX;
            const currentTextY = anim.textY + anim.textOffsetY;
            
            ctx.strokeStyle = anim.glowColor;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = anim.alpha * 0.6;
            ctx.shadowBlur = 5;
            ctx.shadowColor = anim.glowColor;
            ctx.setLineDash([3, 3]); // Ligne pointillée
            ctx.beginPath();
            ctx.moveTo(anim.shipX, anim.shipY);
            ctx.lineTo(currentTextX, currentTextY);
            ctx.stroke();
            ctx.setLineDash([]); // Réinitialiser
            
            // 3. Dessiner le texte stylé
            ctx.globalAlpha = anim.alpha;
            ctx.font = 'bold 14px "Anta", sans-serif';
            ctx.fillStyle = anim.glowColor;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = anim.glowColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Contour noir pour la lisibilité
            ctx.strokeText(anim.text, currentTextX, currentTextY);
            // Texte coloré
            ctx.fillText(anim.text, currentTextX, currentTextY);
            
            // Petit point lumineux à la position du texte
            ctx.fillStyle = anim.glowColor;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(currentTextX, currentTextY, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    // Fonction pour créer des particules de score
    function createScoreParticle(x, y, scoreText) {
        scoreParticles.push({
            x: x,
            y: y,
            text: scoreText,
            alpha: 1,
            life: 60,
            vy: -2
        });
    }
    
    // Mise à jour des particules de score
    function updateScoreParticles() {
        scoreParticles.forEach((particle, index) => {
            particle.y += particle.vy;
            particle.alpha -= 0.02;
            particle.life--;
            if (particle.alpha <= 0 || particle.life <= 0) {
                scoreParticles.splice(index, 1);
            }
        });
    }
    
    // Dessin des particules de score
    function drawScoreParticles() {
        scoreParticles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 20px Anta';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffff00';
            ctx.fillText(particle.text, particle.x, particle.y);
            ctx.restore();
        });
    }
    
    // Met à jour les animations visuelles des bonus
    function updatePowerUpVisualAnimations() {
        powerUpVisualAnimations.forEach((anim, index) => {
            if (!anim) {
                powerUpVisualAnimations.splice(index, 1);
                return;
            }
            
            if (anim.type !== 'score') {
                // Animation de bonus : suit le vaisseau
                // Mettre à jour la position du vaisseau (suivre le vaisseau)
                anim.shipX = ship.x;
                anim.shipY = ship.y;
                
                // Mettre à jour la position du texte (suivre avec petit mouvement)
                const angle = Math.atan2(anim.textY - anim.shipY, anim.textX - anim.shipX);
                const distance = 60 + Math.random() * 40;
                anim.textX = anim.shipX + Math.cos(angle) * distance;
                anim.textY = anim.shipY + Math.sin(angle) * distance;
                
                // Petit mouvement aléatoire pour le texte
                anim.textOffsetX += (Math.random() - 0.5) * 0.5;
                anim.textOffsetY += (Math.random() - 0.5) * 0.5;
                
                // Limiter le mouvement
                anim.textOffsetX = Math.max(-15, Math.min(15, anim.textOffsetX));
                anim.textOffsetY = Math.max(-15, Math.min(15, anim.textOffsetY));
                
                // Fade out progressif
                anim.life -= 0.015; // Plus lent pour laisser le temps de voir
                anim.alpha = Math.max(0, anim.life);
                anim.glowIntensity = Math.max(0, anim.life);
            }
            
            if (anim.life <= 0) {
                powerUpVisualAnimations.splice(index, 1);
            }
        });
    }
    
    // Explosion améliorée avec plus de particules et effets
    function createEnhancedExplosion(x, y, color, size) {
        try {
            // Limiter le nombre de particules pour éviter les crashes
            const maxParticleCount = Math.min(Math.floor(size / 2) + 20, 50); // Max 50 particules
            const particleCount = Math.min(maxParticleCount, 50);
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 / particleCount) * i;
                const speed = Math.random() * 6 + 2;
                const particleSize = Math.random() * (size / 5) + 2;
                
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: particleSize,
                    color: color,
                    alpha: 1,
                    life: 1
                });
            }
            
            // Ajoute des particules plus petites pour l'effet de fumée (limitées)
            const smokeCount = Math.min(Math.floor(particleCount / 2), 25); // Max 25 particules de fumée
            for (let i = 0; i < smokeCount; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * size,
                    y: y + (Math.random() - 0.5) * size,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1,
                    color: `rgba(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, 0.8)`,
                    alpha: 0.8,
                    life: 1
                });
            }
        } catch (e) {
            console.warn('Erreur createEnhancedExplosion:', e);
        }
    }
    
    // Fait apparaître un boost
    function spawnPowerUp(x, y, type) {
        let color = '#ff00ff';
        if (type === 'rapidFire') color = '#ffff00';
        else if (type === 'shield') color = '#00ffff';
        else if (type === 'shrink') color = '#00ff00';
        else if (type === 'bigBullets') color = '#ff8800';
        else if (type === 'tripleShot') color = '#ff00ff';
        else if (type === 'timeSlow') color = '#9b59b6';
        else if (type === 'offensiveShield') color = '#ff6b6b';
        else if (type === 'magnet') color = '#e74c3c';
        else if (type === 'multiShot') color = '#ff00ff';
        else if (type === 'explosiveBullets') color = '#ff0000';
        else if (type === 'speedBoost') color = '#00ff00';
        else if (type === 'scoreMultiplier') color = '#ffd700';
        else if (type === 'autoAim') color = '#00ffff';
        
        powerUps.push({
            x: x,
            y: y,
            type: type,
            speed: 2,
            rotation: 0,
            color: color
        });
    }
    
    // Collecte un boost
    function collectPowerUp(powerUp) {
        const now = Date.now();
        
        playSound('powerup');
        
        if (powerUp.type === 'rapidFire') {
            activePowerUps.rapidFire = true;
            activePowerUps.rapidFireEndTime = now + 10000; // 10 secondes
            currentFireRate = baseFireRate / 3; // 3x plus rapide
            createPowerUpVisualAnimation('rapidFire', ship.x, ship.y);
        } else if (powerUp.type === 'shield') {
            activePowerUps.shield = true;
            activePowerUps.shieldEndTime = now + 8000; // 8 secondes
            createPowerUpVisualAnimation('shield', ship.x, ship.y);
        } else if (powerUp.type === 'life') {
            if (gameState.lives < 5) { // Maximum 5 vies
                gameState.lives++;
                gameState.maxLives = Math.max(gameState.maxLives, gameState.lives);
                if (livesElement) livesElement.textContent = gameState.lives;
                createPowerUpVisualAnimation('life', ship.x, ship.y);
            } else {
                createPowerUpVisualAnimation('lifeMax', ship.x, ship.y);
            }
        } else if (powerUp.type === 'shrink') {
            activePowerUps.shrink = true;
            activePowerUps.shrinkEndTime = now + 12000; // 12 secondes
            createPowerUpVisualAnimation('shrink', ship.x, ship.y);
        } else if (powerUp.type === 'bigBullets') {
            activePowerUps.bigBullets = true;
            activePowerUps.bigBulletsEndTime = now + 15000; // 15 secondes
            createPowerUpVisualAnimation('bigBullets', ship.x, ship.y);
        } else if (powerUp.type === 'tripleShot') {
            activePowerUps.tripleShot = true;
            activePowerUps.tripleShotEndTime = now + 10000; // 10 secondes
            createPowerUpVisualAnimation('tripleShot', ship.x, ship.y);
        } else if (powerUp.type === 'timeSlow') {
            activePowerUps.timeSlow = true;
            activePowerUps.timeSlowEndTime = now + 12000; // 12 secondes
            timeSlowMultiplier = 0.5; // Ralentit à 50% de la vitesse
            createPowerUpVisualAnimation('timeSlow', ship.x, ship.y);
        } else if (powerUp.type === 'offensiveShield') {
            activePowerUps.offensiveShield = true;
            activePowerUps.offensiveShieldEndTime = now + 15000; // 15 secondes
            createPowerUpVisualAnimation('offensiveShield', ship.x, ship.y);
        } else if (powerUp.type === 'magnet') {
            activePowerUps.magnet = true;
            activePowerUps.magnetEndTime = now + 20000; // 20 secondes
            createPowerUpVisualAnimation('magnet', ship.x, ship.y);
        } else if (powerUp.type === 'multiShot') {
            activePowerUps.multiShot = true;
            activePowerUps.multiShotEndTime = now + 12000; // 12 secondes
            createPowerUpVisualAnimation('multiShot', ship.x, ship.y);
        } else if (powerUp.type === 'explosiveBullets') {
            activePowerUps.explosiveBullets = true;
            activePowerUps.explosiveBulletsEndTime = now + 15000; // 15 secondes
            createPowerUpVisualAnimation('explosiveBullets', ship.x, ship.y);
        } else if (powerUp.type === 'speedBoost') {
            activePowerUps.speedBoost = true;
            activePowerUps.speedBoostEndTime = now + 10000; // 10 secondes
            createPowerUpVisualAnimation('speedBoost', ship.x, ship.y);
        } else if (powerUp.type === 'scoreMultiplier') {
            activePowerUps.scoreMultiplier = true;
            activePowerUps.scoreMultiplierEndTime = now + 20000; // 20 secondes
            createPowerUpVisualAnimation('scoreMultiplier', ship.x, ship.y);
        } else if (powerUp.type === 'autoAim') {
            activePowerUps.autoAim = true;
            activePowerUps.autoAimEndTime = now + 18000; // 18 secondes
            createPowerUpVisualAnimation('autoAim', ship.x, ship.y);
        }
        
        gameStats.powerUpsCollected++;
        
        // Effet visuel de collecte (discret)
        try {
            createSmallExplosion(powerUp.x, powerUp.y, powerUp.color);
        } catch (e) {
            console.warn('Erreur animation bonus:', e);
        }
        
        try {
            updateHealthBars();
        } catch (e) {
            console.warn('Erreur updateHealthBars:', e);
        }
    }
    
    function spawnAsteroid() {
        const size = Math.random() * 30 + 15;
        const currentTheme = getCurrentTheme();
        const asteroidColors = currentTheme.asteroids;
        const randomColor = asteroidColors[Math.floor(Math.random() * asteroidColors.length)];
        
        asteroids.push({
            x: Math.random() * (canvas.width - size * 2) + size,
            y: -size,
            size: size,
            speed: Math.random() * 2 + gameState.gameSpeed,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            color: randomColor
        });
    }
    
    // Marque les astéroïdes comme "gros" (pour la séparation)
    function isLargeAsteroid(asteroid) {
        return asteroid.size > 25;
    }
    
    // Calcule l'augmentation de vitesse de manière progressive
    // Élevée au début (peu d'impact car vitesse faible) puis diminue (beaucoup d'impact car vitesse élevée)
    function getSpeedIncrease(level) {
        // Augmentation élevée au début, puis diminue progressivement
        // Niveau 1-30 : 0.3 → 0.2 (élevée au début)
        // Niveau 31-60 : 0.2 → 0.15 (diminue)
        // Niveau 61-90 : 0.15 → 0.1 (diminue encore)
        // Niveau 91+ : 0.1 → 0.05 (minimum, très faible car impact élevé)
        
        if (level <= 30) {
            // Niveaux 1-30 : de 0.3 à 0.2 (élevée au début car vitesse faible)
            return 0.3 - ((level - 1) / 30) * 0.1;
        } else if (level <= 60) {
            // Niveaux 31-60 : de 0.2 à 0.15 (diminue car vitesse augmente)
            return 0.2 - ((level - 31) / 30) * 0.05;
        } else if (level <= 90) {
            // Niveaux 61-90 : de 0.15 à 0.1 (diminue encore)
            return 0.15 - ((level - 61) / 30) * 0.05;
        } else {
            // Niveaux 91+ : de 0.1 à 0.05 (minimum, très faible car impact élevé)
            const extraLevels = level - 91;
            return Math.max(0.05, 0.1 - (extraLevels / 50) * 0.05);
        }
    }
    
    function checkLevel() {
        // Ne pas augmenter le niveau si un boss est actif
        if (gameState.bossActive && boss) {
            return;
        }
        
        if (gameState.gameMode === 'infinite') {
            // Mode infini : le niveau augmente continuellement
        const newLevel = Math.floor(gameState.score / 500) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            // Augmentation progressive de la vitesse
            const speedIncrease = getSpeedIncrease(gameState.level) * 0.6; // Un peu moins en mode infini
            gameState.gameSpeed += speedIncrease;
            if (levelElement) levelElement.textContent = gameState.level;
            if (currentLevelDisplay) currentLevelDisplay.textContent = gameState.level;
                // Animation de niveau supprimée
            }
            // Pas de boss en mode infini
            return;
        }
        
        // Mode normal : boss tous les 10 niveaux
        const newLevel = Math.floor(gameState.score / 500) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            // Augmentation progressive de la vitesse
            const speedIncrease = getSpeedIncrease(gameState.level);
            gameState.gameSpeed += speedIncrease;
            if (levelElement) levelElement.textContent = gameState.level;
            if (currentLevelDisplay) currentLevelDisplay.textContent = gameState.level;
            
            // Animation de niveau supprimée
            
            // Vérifier si un boss doit apparaître (tous les 10 niveaux)
            // Ne pas spawn si on dépasse le niveau 100 (tous les boss sont vaincus)
            if (gameState.level % 10 === 0 && !gameState.bossActive && !boss && gameState.level <= 100) {
                console.log(`🎯 Niveau ${gameState.level} atteint - Tentative spawn boss`);
                console.log('Conditions:', {
                    level: gameState.level,
                    levelMod10: gameState.level % 10,
                    bossActive: gameState.bossActive,
                    boss: boss,
                    levelUnder100: gameState.level <= 100
                });
                try {
                    spawnBoss();
                } catch (e) {
                    console.error('❌ Erreur spawnBoss:', e);
                    console.error('Stack:', e.stack);
                    gameState.bossActive = false;
                    boss = null;
                }
            }
        }
    }
    
    // Crée un boss
    function spawnBoss() {
        // Vérifications de sécurité
        if (gameState.bossActive || boss) {
            console.warn('Tentative de spawn boss alors qu\'un boss est déjà actif');
            return;
        }
        
        const bossNumber = Math.min(10, Math.floor(gameState.level / 10));
        
        // Vérifier que le bossNumber est valide
        if (bossNumber < 1 || bossNumber > 10) {
            console.error('Boss number invalide:', bossNumber, 'level:', gameState.level);
            return;
        }
        
        console.log('Spawning boss', bossNumber, 'at level', gameState.level);
        
        // Jouer le son d'arrivée du boss
        playAudioFile('../ressources/Sons/Arrivée Boss.mp3', 0.6);
        
        const baseHealth = 30 + (bossNumber * 15); // Réduit : était 50 + (bossNumber * 30)
        const baseSize = 60 + (bossNumber * 10);
        
        // Initialiser les propriétés spécifiques au pattern du boss
        let patternConfig = getBossPattern(bossNumber);
        
        // Vérifier que patternConfig est valide
        if (!patternConfig) {
            console.error('Pattern config invalide pour boss', bossNumber);
            patternConfig = getBossPattern(1); // Fallback sur boss 1
        }
        
        // Obtenir le nom du boss
        const bossName = getBossName(bossNumber);
        
        boss = {
            x: canvas.width / 2,
            y: 100,
            size: baseSize,
            maxSize: baseSize,
            health: baseHealth,
            maxHealth: baseHealth,
            speed: patternConfig.speed,
            direction: patternConfig.initialDirection,
            color: `hsl(${bossNumber * 36}, 70%, 50%)`,
            bossNumber: bossNumber,
            bossName: bossName,
            lastShot: Date.now(),
            shootInterval: patternConfig.shootInterval,
            image: null,
            pattern: bossNumber,
            patternTime: 0, // Temps écoulé pour le pattern
            patternPhase: 0, // Phase actuelle du pattern
            phase: 1, // Phase du boss (1 = normale, 2 = enragée)
            phaseChanged: false, // Indique si la phase 2 a été activée
            vy: 0, // Vitesse verticale pour certains patterns
            targetX: canvas.width / 2, // Position cible pour certains patterns
            targetY: 100
        };
        
        // Charger l'image du boss si disponible (mais ne pas bloquer si elle n'est pas là)
        if (bossPhotos[bossNumber] && bossPhotos[bossNumber].complete && bossPhotos[bossNumber].naturalWidth > 0) {
            boss.image = bossPhotos[bossNumber];
            console.log(`✅ Image boss ${bossNumber} assignée et chargée`);
        } else {
            // Pas d'image ou image non chargée - le boss s'affichera avec la forme par défaut
            boss.image = null;
            console.log(`ℹ️ Boss ${bossNumber} sans image - forme par défaut utilisée`);
        }
        
        gameState.bossActive = true;
        
        // Ne JAMAIS mettre le jeu en pause automatiquement (seulement si le joueur appuie sur le bouton)
        // Le jeu continue normalement même lors du spawn d'un boss
        
        // Sons et messages en arrière-plan pour ne pas bloquer le spawn
        try {
            setTimeout(() => {
                playSound('bossSpawn');
            }, 0);
        } catch (e) {
            console.warn('Erreur son bossSpawn:', e);
        }
        
        try {
            setTimeout(() => {
                showMessage(`${bossName} apparaît !`, 'boss');
            }, 0);
        } catch (e) {
            console.warn('Erreur message boss:', e);
        }
        
        try {
            updateHealthBars();
        } catch (e) {
            console.warn('Erreur updateHealthBars:', e);
        }
        
        console.log('✅ Boss spawné avec succès:', bossNumber, bossName, boss);
        console.log('Boss actif:', gameState.bossActive, 'Boss object:', boss);
    }
    
    // Retourne le nom d'un boss selon son numéro
    function getBossName(bossNumber) {
        const bossNames = {
            1: 'Locked in alien',
            2: 'Goku SSJ3',
            3: 'Karism',
            4: 'Herobrine',
            5: 'Goblinstein',
            6: 'Michael Personne',
            7: 'M. BAER',
            8: 'Sunshine',
            9: 'WhatSans',
            10: 'IUT GUSTAVE EIFFEL'
        };
        return bossNames[bossNumber] || `Boss ${bossNumber}`;
    }
    
    // Retourne l'effet visuel autour de l'image du boss selon son numéro
    function getBossImageEffect(bossNumber) {
        const effects = {
            1: { type: 'glow', color: '#00ff00', intensity: 20, pulse: true }, // Vert pulsant (Locked in alien)
            2: { type: 'aura', color: '#ffff00', intensity: 25, rotation: true }, // Aura dorée rotative (Goku SSJ3)
            3: { type: 'sparkles', color: '#ff00ff', intensity: 15, sparkle: true }, // Étincelles magenta (Karism)
            4: { type: 'shadow', color: '#ffffff', intensity: 30, flicker: true }, // Ombre blanche clignotante (Herobrine)
            5: { type: 'rings', color: '#ff8800', intensity: 20, rings: true }, // Anneaux orange (Goblinstein)
            6: { type: 'waves', color: '#00ffff', intensity: 18, waves: true }, // Vagues cyan (Michael Personne)
            7: { type: 'electric', color: '#ff0000', intensity: 22, electric: true }, // Électricité rouge (M. BAER)
            8: { type: 'sunshine', color: '#ffff00', intensity: 28, rays: true }, // Rayons de soleil (Sunshine)
            9: { type: 'void', color: '#ffffff', intensity: 25, void: true }, // Vide blanc avec particules (WhatSans)
            10: { type: 'institutional', color: '#0066cc', intensity: 20, grid: true } // Grille bleue institutionnelle (IUT)
        };
        return effects[bossNumber] || effects[1];
    }
    
    // Dessine l'effet visuel autour de l'image du boss
    function drawBossImageEffect(effect, imageSize) {
        const time = Date.now() * 0.001;
        const radius = imageSize / 2;
        
        ctx.save();
        
        switch(effect.type) {
            case 'glow':
                // Glow pulsant
                const pulseIntensity = effect.intensity * (1 + Math.sin(time * 3) * 0.3);
                const gradient = ctx.createRadialGradient(0, 0, radius, 0, 0, radius + pulseIntensity);
                gradient.addColorStop(0, effect.color + '00');
                gradient.addColorStop(0.5, effect.color + '40');
                gradient.addColorStop(1, effect.color + '00');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, radius + pulseIntensity, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'aura':
                // Aura rotative
                ctx.rotate(time * 2);
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = Math.cos(angle) * (radius + 15);
                    const y = Math.sin(angle) * (radius + 15);
                    ctx.fillStyle = effect.color;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = effect.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'sparkles':
                // Étincelles
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2 + time;
                    const distance = radius + 10 + Math.sin(time * 2 + i) * 5;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    ctx.fillStyle = effect.color;
                    ctx.globalAlpha = 0.7 + Math.sin(time * 4 + i) * 0.3;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = effect.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                break;
                
            case 'shadow':
                // Ombre clignotante
                const flicker = Math.sin(time * 5) > 0 ? 1 : 0.3;
                ctx.shadowBlur = effect.intensity * flicker;
                ctx.shadowColor = effect.color;
                ctx.strokeStyle = effect.color;
                ctx.lineWidth = 4;
                ctx.globalAlpha = flicker;
                ctx.beginPath();
                ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
                break;
                
            case 'rings':
                // Anneaux concentriques
                for (let i = 0; i < 3; i++) {
                    const ringRadius = radius + 15 + i * 10;
                    const ringAlpha = 0.6 - i * 0.2;
                    ctx.strokeStyle = effect.color;
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = ringAlpha;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = effect.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, ringRadius + Math.sin(time * 2 + i) * 3, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                break;
                
            case 'waves':
                // Vagues
                for (let i = 0; i < 6; i++) {
                    const waveRadius = radius + 8 + Math.sin(time * 2 + i) * 8;
                    ctx.strokeStyle = effect.color;
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.5;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = effect.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                break;
                
            case 'electric':
                // Électricité
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const startX = Math.cos(angle) * radius;
                    const startY = Math.sin(angle) * radius;
                    const endX = Math.cos(angle) * (radius + 20 + Math.random() * 10);
                    const endY = Math.sin(angle) * (radius + 20 + Math.random() * 10);
                    
                    ctx.strokeStyle = effect.color;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = effect.color;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
                break;
                
            case 'sunshine':
                // Rayons de soleil
                ctx.rotate(time);
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const rayLength = radius + 25;
                    ctx.strokeStyle = effect.color;
                    ctx.lineWidth = 3;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = effect.color;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                    ctx.lineTo(Math.cos(angle) * rayLength, Math.sin(angle) * rayLength);
                    ctx.stroke();
                }
                break;
                
            case 'void':
                // Vide avec particules
                const voidGradient = ctx.createRadialGradient(0, 0, radius, 0, 0, radius + effect.intensity);
                voidGradient.addColorStop(0, effect.color + '00');
                voidGradient.addColorStop(0.7, effect.color + '60');
                voidGradient.addColorStop(1, effect.color + '00');
                ctx.fillStyle = voidGradient;
                ctx.beginPath();
                ctx.arc(0, 0, radius + effect.intensity, 0, Math.PI * 2);
                ctx.fill();
                
                // Particules blanches
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + time;
                    const distance = radius + 12;
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = 0.8;
                    ctx.beginPath();
                    ctx.arc(Math.cos(angle) * distance, Math.sin(angle) * distance, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                break;
                
            case 'institutional':
                // Grille institutionnelle
                ctx.strokeStyle = effect.color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.6;
                const gridSize = radius + 20;
                for (let i = -2; i <= 2; i++) {
                    ctx.beginPath();
                    ctx.moveTo(-gridSize, i * 15);
                    ctx.lineTo(gridSize, i * 15);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(i * 15, -gridSize);
                    ctx.lineTo(i * 15, gridSize);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                break;
        }
        
        ctx.restore();
    }
    
    // Retourne la configuration du pattern pour un boss donné
    function getBossPattern(bossNumber) {
        const patterns = {
            1: { speed: 2, initialDirection: 1, shootInterval: 1500, type: 'horizontal' },
            2: { speed: 2.5, initialDirection: 1, shootInterval: 1200, type: 'zigzag' },
            3: { speed: 3, initialDirection: 1, shootInterval: 1000, type: 'circular' },
            4: { speed: 2.5, initialDirection: 1, shootInterval: 900, type: 'charge' },
            5: { speed: 3.5, initialDirection: 1, shootInterval: 800, type: 'teleport' },
            6: { speed: 3, initialDirection: 1, shootInterval: 700, type: 'spiral' },
            7: { speed: 4, initialDirection: 1, shootInterval: 600, type: 'aggressive' },
            8: { speed: 3.5, initialDirection: 1, shootInterval: 500, type: 'wave' },
            9: { speed: 4.5, initialDirection: 1, shootInterval: 400, type: 'chaos' },
            10: { speed: 5, initialDirection: 1, shootInterval: 300, type: 'final' }
        };
        
        return patterns[bossNumber] || patterns[1];
    }
    
    // Met à jour le boss
    function updateBoss() {
        if (!boss || !gameState.bossActive) return;
        
        // Le boss continue de bouger même si le jeu est en pause (pour éviter les bugs)
        // Seul le bouton pause peut vraiment mettre le jeu en pause
        
        // Vérifications de sécurité
        if (typeof boss.x !== 'number' || typeof boss.y !== 'number' || typeof boss.size !== 'number') {
            console.warn('Boss invalide, reset');
            boss = null;
            gameState.bossActive = false;
            return;
        }
        
        const now = Date.now();
        if (typeof boss.patternTime !== 'number') {
            boss.patternTime = 0;
        }
        boss.patternTime += 16; // ~60fps
        
        // Appliquer le pattern de mouvement selon le numéro du boss
        updateBossMovement();
        
        // Tir du boss
        if (now - boss.lastShot > boss.shootInterval) {
            bossShoot();
            boss.lastShot = now;
        }
        
        // Mise à jour des projectiles du boss (ralentissement temporel)
        const slowMultiplierBossBullets = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        bossBullets.forEach((bullet, index) => {
            bullet.y += (bullet.vy !== undefined ? bullet.vy : bullet.speed) * slowMultiplierBossBullets;
            bullet.x += (bullet.vx || 0) * slowMultiplierBossBullets;
            
            // Supprimer si hors écran
            if (bullet.y > canvas.height + 20 || bullet.y < -20 || bullet.x < -20 || bullet.x > canvas.width + 20) {
                bossBullets.splice(index, 1);
            }
        });
        
        // Vérifier les phases des boss (changement de pattern à mi-vie)
        if (boss && !boss.phaseChanged && boss.health <= boss.maxHealth / 2) {
            boss.phaseChanged = true;
            boss.phase = 2; // Phase 2 activée
            // Augmenter la vitesse de tir et changer le pattern
            boss.shootInterval = Math.max(300, boss.shootInterval * 0.7);
            console.log(`Boss ${boss.bossNumber} entre en phase 2 !`);
        }
        
        // Collision projectiles du joueur / boss
        if (boss && gameState.bossActive) {
            bullets.forEach((bullet, bulletIndex) => {
                // Vérifier que le boss existe toujours (peut être null si détruit par un autre projectile)
                if (!boss || !gameState.bossActive) return;
                
                const dx = bullet.x - boss.x;
                const dy = bullet.y - boss.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < boss.size + 5) {
                    boss.health--;
                    playSound('bossHit');
                    bullets.splice(bulletIndex, 1);
                    gameStats.bulletsHit++;
                    // Particules de score pour les dégâts au boss
                    createScoreParticle(bullet.x, bullet.y, '+1');
                    updateHealthBars();
                    
                    // Le boss rétrécit quand il prend des dégâts
                    const healthPercent = boss.health / boss.maxHealth;
                    boss.size = boss.maxSize * (0.5 + healthPercent * 0.5); // Entre 50% et 100% de la taille
                    
                    if (boss.health <= 0) {
                        // Sauvegarder le numéro du boss pour le score
                        const defeatedBossNumber = boss.bossNumber;
                        
                        // Calculer le score nécessaire pour passer au niveau suivant
                        // Exemple : niveau 10 → niveau 11, il faut 11 * 500 = 5500 points
                        const targetLevel = gameState.level + 1;
                        const targetScore = targetLevel * 500;
                        
                        // Donner juste assez de points pour passer au niveau suivant
                        let bossPoints = 0;
                        if (gameState.score < targetScore) {
                            bossPoints = targetScore - gameState.score;
                            gameState.score = targetScore;
                        } else {
                            // Si on a déjà assez de points, ajouter juste un peu pour le boss
                            bossPoints = defeatedBossNumber * 100;
                            gameState.score += bossPoints;
                        }
                        
                        // Appliquer scoreMultiplier si actif
                        if (activePowerUps.scoreMultiplier && Date.now() < activePowerUps.scoreMultiplierEndTime) {
                            const bonusPoints = bossPoints; // Points bonus
                            bossPoints += bonusPoints;
                            gameState.score += bonusPoints;
                        }
                        
                        if (scoreElement) scoreElement.textContent = gameState.score;
                        // Particules de score pour la défaite du boss
                        createScoreParticle(boss.x, boss.y, `+${bossPoints}`);
                        
                        // Nettoyer le boss IMMÉDIATEMENT pour éviter les accès après
                        boss = null;
                        gameState.bossActive = false;
                        bossBullets = [];
                        
                        try {
                            setTimeout(() => {
                                playSound('victory');
                            }, 0);
                        } catch (e) {
                            console.warn('Erreur son victory:', e);
                        }
                        
                        try {
                            updateHealthBars();
                        } catch (e) {
                            console.warn('Erreur updateHealthBars:', e);
                        }
                        
                        // Monter automatiquement au niveau juste au-dessus (ex: boss niveau 10 → niveau 11)
                        gameState.level += 1;
                        // Augmentation progressive de la vitesse
                        const speedIncrease = getSpeedIncrease(gameState.level);
                        gameState.gameSpeed += speedIncrease;
                        if (levelElement) levelElement.textContent = gameState.level;
                        if (currentLevelDisplay) currentLevelDisplay.textContent = gameState.level;
                        
                        // Rendre le joueur invincible pendant 2 secondes exactement
                        ship.invincible = true;
                        setTimeout(() => {
                            ship.invincible = false;
                        }, 2000);
                        
                        // Si on atteint le niveau 100, victoire finale
                        if (gameState.level >= 100) {
                            setTimeout(() => {
                                try {
                                    showMessage('VICTOIRE FINALE ! Vous avez vaincu tous les boss !', 'victory');
                                    playSound('victory');
                                } catch (e) {
                                    console.warn('Erreur victoire finale:', e);
                                }
                            }, 2000);
                        }
                        
                        // Sortir de la boucle pour éviter de traiter d'autres collisions
                        return;
                    }
                }
            });
        }
        
        // Collision vaisseau / projectiles du boss
        if (bossBullets && bossBullets.length > 0) {
            bossBullets.forEach((bullet, index) => {
                const dx = ship.x - bullet.x;
                const dy = ship.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
                if (distance < bullet.size + shipSize) {
                    if (activePowerUps.offensiveShield && Date.now() < activePowerUps.offensiveShieldEndTime) {
                        // Bouclier offensif : renvoie le projectile vers le boss
                        const bossDx = boss ? boss.x - bullet.x : 0;
                        const bossDy = boss ? boss.y - bullet.y : 0;
                        const bossDist = Math.sqrt(bossDx * bossDx + bossDy * bossDy);
                        if (bossDist > 0 && boss) {
                            // Transformer le projectile en projectile du joueur
                            bullets.push({
                                x: bullet.x,
                                y: bullet.y,
                                speed: 8,
                                vx: (bossDx / bossDist) * 3,
                                vy: (bossDy / bossDist) * 3,
                                size: bullet.size,
                                color: '#00ffff'
                            });
                        }
                        playSound('hit');
                        bossBullets.splice(index, 1);
                        createSmallExplosion(bullet.x, bullet.y, '#00ffff');
                    } else if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
                        playSound('hit');
                        bossBullets.splice(index, 1);
                        // Animation visuelle remplace le message texte
                    } else {
                        createEnhancedExplosion(ship.x, ship.y, ship.color, 30);
                        playSound('hit');
                        bossBullets.splice(index, 1);
                        
                        gameState.lives--;
                        if (livesElement) livesElement.textContent = gameState.lives;
                        updateHealthBars();
                        
                        if (gameState.lives <= 0) {
                            endGame();
                        } else {
                            // Invincibilité temporaire avec clignotement (1-2 secondes)
                            ship.invincible = true;
                            setTimeout(() => {
                                ship.invincible = false;
                            }, 2000); // 2 secondes exactement
                        }
                    }
                }
            });
        }
        
        // Collision vaisseau / boss
        if (boss && gameState.bossActive) {
            const dx = ship.x - boss.x;
            const dy = ship.y - boss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
            if (distance < boss.size + shipSize) {
                if (!ship.invincible) {
                    createEnhancedExplosion(ship.x, ship.y, ship.color, 30);
                    playSound('hit');
                    
                    gameState.lives--;
                    if (livesElement) livesElement.textContent = gameState.lives;
                    updateHealthBars();
                    
                    if (gameState.lives <= 0) {
                        endGame();
                    } else {
                        // Invincibilité temporaire avec clignotement (1-2 secondes)
                        ship.invincible = true;
                        setTimeout(() => {
                            ship.invincible = false;
                        }, 2000); // 2 secondes exactement
                    }
                }
            }
        }
    }
    
    // Met à jour le mouvement du boss selon son pattern
    function updateBossMovement() {
        if (!boss || !gameState.bossActive) return;
        
        const pattern = getBossPattern(boss.pattern);
        const time = boss.patternTime * 0.001; // Convertir en secondes
        
        switch(pattern.type) {
            case 'horizontal':
                // Boss 1 : Mouvement horizontal simple
                boss.x += boss.speed * boss.direction;
                if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                    boss.direction *= -1;
                }
                break;
                
            case 'zigzag':
                // Boss 2 : Zigzag
                boss.x += boss.speed * boss.direction;
                boss.y = 100 + Math.sin(time * 2) * 30;
                if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                    boss.direction *= -1;
                }
                break;
                
            case 'circular':
                // Boss 3 : Mouvement circulaire
                const radius = 100;
                boss.x = canvas.width / 2 + Math.cos(time) * radius;
                boss.y = 150 + Math.sin(time) * 50;
                break;
                
            case 'charge':
                // Boss 4 : Charge vers le joueur puis recule
                if (boss.patternPhase === 0) {
                    // Phase de charge
                    boss.targetX = ship.x;
                    const dx = boss.targetX - boss.x;
                    boss.x += Math.sign(dx) * boss.speed * 1.5;
                    if (Math.abs(dx) < 10) {
                        boss.patternPhase = 1;
                        boss.patternTime = 0;
                    }
                } else {
                    // Phase de recul
                    boss.x += (canvas.width / 2 - boss.x) * 0.1;
                    if (Math.abs(boss.x - canvas.width / 2) < 5) {
                        boss.patternPhase = 0;
                        boss.patternTime = 0;
                    }
                }
                break;
                
            case 'teleport':
                // Boss 5 : Téléportation aléatoire
                if (boss.patternTime % 2000 < 16) {
                    boss.x = Math.random() * (canvas.width - boss.size * 2) + boss.size;
                    boss.y = 50 + Math.random() * 100;
                }
                break;
                
            case 'spiral':
                // Boss 6 : Spirale
                const spiralRadius = 80 + Math.sin(time * 3) * 40;
                boss.x = canvas.width / 2 + Math.cos(time * 2) * spiralRadius;
                boss.y = 120 + Math.sin(time * 2) * 30;
                break;
                
            case 'aggressive':
                // Boss 7 : Suit le joueur agressivement
                const targetX = ship.x;
                const diffX = targetX - boss.x;
                boss.x += Math.sign(diffX) * Math.min(Math.abs(diffX) * 0.1, boss.speed);
                boss.y = 80 + Math.sin(time * 3) * 20;
                break;
                
            case 'wave':
                // Boss 8 : Vagues horizontales
                boss.x += boss.speed * boss.direction;
                boss.y = 100 + Math.sin(time * 4) * 50;
                if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                    boss.direction *= -1;
                }
                break;
                
            case 'chaos':
                // Boss 9 : Mouvement chaotique
                boss.x += (Math.random() - 0.5) * boss.speed * 2;
                boss.y += (Math.random() - 0.5) * 1;
                boss.x = Math.max(boss.size, Math.min(canvas.width - boss.size, boss.x));
                boss.y = Math.max(50, Math.min(200, boss.y));
                break;
                
            case 'final':
                // Boss 10 : Pattern complexe combinant plusieurs mouvements
                const phase = Math.floor(time) % 4;
                if (phase === 0) {
                    // Spirale
                    boss.x = canvas.width / 2 + Math.cos(time * 2) * 100;
                    boss.y = 120 + Math.sin(time * 2) * 40;
                } else if (phase === 1) {
                    // Charge
                    boss.targetX = ship.x;
                    const dx2 = boss.targetX - boss.x;
                    boss.x += Math.sign(dx2) * boss.speed * 1.2;
                } else if (phase === 2) {
                    // Zigzag rapide
                    boss.x += boss.speed * boss.direction * 1.5;
                    boss.y = 100 + Math.sin(time * 5) * 40;
                    if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                        boss.direction *= -1;
                    }
                } else {
                    // Téléportation
                    if (boss.patternTime % 1500 < 16) {
                        boss.x = Math.random() * (canvas.width - boss.size * 2) + boss.size;
                        boss.y = 60 + Math.random() * 80;
                    }
                }
                break;
        }
    }
    
    // Le boss tire
    function bossShoot() {
        if (!boss || !gameState.bossActive) return;
        
        playSound('bossShoot');
        
        const bossNumber = boss.bossNumber;
        
        // Patterns de tir différents pour chaque boss
        switch(bossNumber) {
            case 1:
                // Tir simple vers le bas
                bossBullets.push({
                    x: boss.x,
                    y: boss.y + boss.size,
                    speed: 3,
                    vx: 0,
                    size: 8,
                    color: '#ff0000'
                });
                break;
                
            case 2:
                // Tir double
                for (let i = -1; i <= 1; i += 2) {
                    bossBullets.push({
                        x: boss.x + i * 20,
                        y: boss.y + boss.size,
                        speed: 3.5,
                        vx: i * 0.3,
                        size: 7,
                        color: '#ff3300'
                    });
                }
                break;
                
            case 3:
                // Tir triple en éventail
                for (let i = -1; i <= 1; i++) {
                    bossBullets.push({
                        x: boss.x,
                        y: boss.y + boss.size,
                        speed: 3.5,
                        vx: i * 0.8,
                        size: 7,
                        color: '#ff6600'
                    });
                }
                break;
                
            case 4:
                // Tir ciblé vers le joueur
                const dx = ship.x - boss.x;
                const dy = ship.y - boss.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                bossBullets.push({
                    x: boss.x,
                    y: boss.y + boss.size,
                    speed: 4,
                    vx: (dx / dist) * 2,
                    size: 7,
                    color: '#ff9900'
                });
                break;
                
            case 5:
                // Tir en cercle (8 directions)
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    bossBullets.push({
                        x: boss.x,
                        y: boss.y,
                        speed: 0, // Pas de vitesse verticale directe
                        vx: Math.cos(angle) * 2,
                        vy: Math.sin(angle) * 2,
                        size: 6,
                        color: '#ffcc00'
                    });
                }
                break;
                
            case 6:
                // Tir en spirale
                const spiralAngle = boss.patternTime * 0.01;
                for (let i = 0; i < 3; i++) {
                    const angle = spiralAngle + (i * Math.PI * 2 / 3);
                    bossBullets.push({
                        x: boss.x,
                        y: boss.y,
                        speed: 0, // Pas de vitesse verticale directe
                        vx: Math.cos(angle) * 2.5,
                        vy: Math.sin(angle) * 2.5,
                        size: 6,
                        color: '#ffff00'
                    });
                }
                break;
                
            case 7:
                // Tir rapide en éventail (5 projectiles)
                for (let i = -2; i <= 2; i++) {
                    bossBullets.push({
                        x: boss.x + i * 12,
                        y: boss.y + boss.size,
                        speed: 4,
                        vx: i * 0.6,
                        size: 6,
                        color: '#ff00ff'
                    });
                }
                break;
                
            case 8:
                // Tir en vague
                for (let i = -2; i <= 2; i++) {
                    const waveOffset = Math.sin(boss.patternTime * 0.01 + i) * 10;
                    bossBullets.push({
                        x: boss.x + i * 15 + waveOffset,
                        y: boss.y + boss.size,
                        speed: 4.5,
                        vx: i * 0.7,
                        size: 6,
                        color: '#ff33ff'
                    });
                }
                break;
                
            case 9:
                // Tir chaotique (multiple directions aléatoires)
                for (let i = 0; i < 5; i++) {
                    const randomAngle = Math.random() * Math.PI * 2;
                    bossBullets.push({
                        x: boss.x,
                        y: boss.y,
                        speed: 0, // Pas de vitesse verticale directe
                        vx: Math.cos(randomAngle) * 3,
                        vy: Math.sin(randomAngle) * 3,
                        size: 5,
                        color: '#ff66ff'
                    });
                }
                break;
                
            case 10:
                // Boss final : Tir en étoile (12 directions) + tir ciblé
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    bossBullets.push({
                        x: boss.x,
                        y: boss.y,
                        speed: 0, // Pas de vitesse verticale directe
                        vx: Math.cos(angle) * 3,
                        vy: Math.sin(angle) * 3,
                        size: 6,
                        color: '#ffffff'
                    });
                }
                // Tir ciblé supplémentaire
                const dx2 = ship.x - boss.x;
                const dy2 = ship.y - boss.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 > 0) {
                    bossBullets.push({
                        x: boss.x,
                        y: boss.y + boss.size,
                        speed: 5,
                        vx: (dx2 / dist2) * 3,
                        vy: undefined, // Pas de vy pour ce projectile
                        size: 8,
                        color: '#ff0000'
                    });
                }
                break;
        }
    }
    
    function shoot() {
        gameStats.bulletsFired++;
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Vérifie le cooldown de tir
        const now = Date.now();
        if (now - lastShotTime < currentFireRate) {
            return;
        }
        
        lastShotTime = now;
        
        const bulletSize = activePowerUps.bigBullets ? 8 : 4;
        const isExplosive = activePowerUps.explosiveBullets && Date.now() < activePowerUps.explosiveBulletsEndTime;
        
        if (activePowerUps.multiShot && Date.now() < activePowerUps.multiShotEndTime) {
            // MultiShot : 5 projectiles en éventail
            for (let i = -2; i <= 2; i++) {
                const angle = (i * 0.3); // Angle en radians
                bullets.push({
                    x: ship.x,
                    y: ship.y - ship.height / 2,
                    speed: 8,
                    vx: Math.sin(angle) * 2,
                    vy: -Math.cos(angle) * 8,
                    size: bulletSize,
                    explosive: isExplosive
                });
            }
        } else if (activePowerUps.tripleShot) {
            // Tir triple : 3 projectiles en éventail
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: 8,
                vx: -0.5,
                vy: -8,
                size: bulletSize,
                explosive: isExplosive
            });
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: 8,
                vx: 0,
                vy: -8,
                size: bulletSize,
                explosive: isExplosive
            });
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: 8,
                vx: 0.5,
                vy: -8,
                size: bulletSize,
                explosive: isExplosive
            });
        } else {
            // Tir simple avec auto-aim si actif
            let vx = 0;
            let vy = -8;
            
            if (activePowerUps.autoAim && Date.now() < activePowerUps.autoAimEndTime) {
                // Trouver l'astéroïde le plus proche
                let closestAsteroid = null;
                let closestDistance = Infinity;
                
                asteroids.forEach(asteroid => {
                    const dx = asteroid.x - ship.x;
                    const dy = asteroid.y - ship.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < closestDistance && asteroid.y < ship.y) {
                        closestDistance = distance;
                        closestAsteroid = asteroid;
                    }
                });
                
                if (closestAsteroid) {
                    const dx = closestAsteroid.x - ship.x;
                    const dy = closestAsteroid.y - ship.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 0) {
                        vx = (dx / distance) * 2; // Légère déviation
                        vy = -8; // Vitesse verticale principale
                    }
                }
            }
            
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: 8,
                vx: vx,
                vy: vy,
                size: bulletSize,
                explosive: isExplosive
            });
        }
        
        playSound('shoot');
    }
    
    // Contrôles
    let keys = {};
    let autoShootInterval = null;
    
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState.isPlaying) {
                shoot();
                // Démarrer le tir automatique
                if (!autoShootInterval) {
                    const startAutoShoot = () => {
                        autoShootInterval = setInterval(() => {
                            if (gameState.isPlaying && !gameState.isPaused && keys['Space']) {
                                shoot();
                            }
                        }, currentFireRate);
                    };
                    startAutoShoot();
                }
            } else if (startScreen && !startScreen.classList.contains('hidden')) {
                startGame();
            } else if (gameOver && !gameOver.classList.contains('hidden')) {
                startGame();
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
        
        // Arrêter le tir automatique
        if (e.code === 'Space' && autoShootInterval) {
            clearInterval(autoShootInterval);
            autoShootInterval = null;
        }
    });
    
    // Mouvement du vaisseau
    function handleMovement() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Appliquer speedBoost si actif
        const currentSpeed = (activePowerUps.speedBoost && Date.now() < activePowerUps.speedBoostEndTime) 
            ? ship.baseSpeed * 1.8  // 80% plus rapide
            : ship.baseSpeed;
        ship.speed = currentSpeed;
        
        const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
        if (keys['ArrowLeft'] || keys['KeyA']) {
            ship.x = Math.max(shipSize, ship.x - ship.speed);
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            ship.x = Math.min(canvas.width - shipSize, ship.x + ship.speed);
        }
    }
    
    // Boucle de jeu
    function gameLoop() {
        handleMovement();
        update();
        draw();
        updateHealthBars(); // Mise à jour des barres de vie
        
        // Mise à jour du tir automatique si actif et que le boost de tir rapide change
        if (gameState.isPlaying && autoShootInterval && keys['Space']) {
            // Le tir automatique s'adapte à la vitesse de tir
            const intervalTime = activePowerUps.rapidFire ? currentFireRate : baseFireRate;
            // On ne recrée l'interval que si nécessaire (optimisation)
        }
        
        if (gameState.isPlaying) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    function startGame() {
        // Récupérer le mode de jeu sélectionné
        if (gameModeSelect) {
            gameState.gameMode = gameModeSelect.value;
        }
        
        init();
        gameState.isPlaying = true;
        gameState.isPaused = false;
        if (gameOver) gameOver.classList.add('hidden');
        if (startScreen) startScreen.classList.add('hidden');
        if (startBtn) startBtn.textContent = 'Pause';
        gameLoop();
    }
    
    function pauseGame() {
        gameState.isPaused = !gameState.isPaused;
        if (startBtn) startBtn.textContent = gameState.isPaused ? 'Reprendre' : 'Pause';
        if (!gameState.isPaused) {
            gameLoop();
        }
    }
    
    function endGame() {
        gameState.isPlaying = false;
        
        // Calculer les statistiques finales
        const accuracy = gameStats.bulletsFired > 0 ? ((gameStats.bulletsHit / gameStats.bulletsFired) * 100).toFixed(1) : 0;
        const timeMinutes = Math.floor(gameStats.timePlayed / 60000);
        const timeSeconds = Math.floor((gameStats.timePlayed % 60000) / 1000);
        const timeFormatted = `${timeMinutes}m ${timeSeconds}s`;
        
        // Sauvegarde du meilleur score
        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('spaceShooterHighScore', gameState.highScore);
            updateHighScore();
        }
        
        if (finalScore) finalScore.textContent = gameState.score;
        if (finalLevel) finalLevel.textContent = gameState.level;
        
        // Afficher les statistiques post-partie
        if (scoreMessage) {
            let statsText = '';
            if (gameState.score < 500) {
                statsText = '😅 Tu es nul ! Moins de 500 points, vraiment ?<br><br>';
            }
            statsText += `<strong>📊 Statistiques de partie:</strong><br>`;
            statsText += `🎯 Astéroïdes détruits: ${gameStats.asteroidsDestroyed}<br>`;
            statsText += `💥 Projectiles tirés: ${gameStats.bulletsFired}<br>`;
            statsText += `✅ Précision: ${accuracy}%<br>`;
            statsText += `🎁 Bonus collectés: ${gameStats.powerUpsCollected}<br>`;
            statsText += `⏱️ Temps de jeu: ${timeFormatted}`;
            scoreMessage.innerHTML = statsText;
            scoreMessage.style.color = '#00ffff';
            scoreMessage.style.fontWeight = 'normal';
            scoreMessage.style.fontSize = '0.9em';
            scoreMessage.style.marginTop = '15px';
            scoreMessage.style.textAlign = 'left';
            scoreMessage.style.lineHeight = '1.6';
        }
        
        if (gameOver) gameOver.classList.remove('hidden');
        startBtn.textContent = 'Commencer';
        
        // Vérifier si le score peut être enregistré dans le leaderboard
        // Utilisation du leaderboard local
        // Le leaderboard est déjà chargé au démarrage et synchronisé en arrière-plan
        if (canRegisterScore(gameState.score) && registerScoreBtn) {
            registerScoreBtn.classList.remove('hidden');
        } else if (registerScoreBtn) {
            registerScoreBtn.classList.add('hidden');
        }
        
        // Synchroniser le leaderboard en arrière-plan (sans bloquer)
        loadLeaderboard().catch(() => {
            // Ignorer les erreurs, on utilise le leaderboard local
        });
    }
    
    function resetGame() {
        gameState.isPlaying = false;
        gameState.isPaused = false;
        init();
        if (gameOver) gameOver.classList.add('hidden');
        if (startScreen) startScreen.classList.remove('hidden');
        if (startBtn) startBtn.textContent = 'Commencer';
        if (registerScoreBtn) registerScoreBtn.classList.add('hidden');
        draw();
    }
    
    function showMessage(text, type) {
        const message = document.getElementById('game-message');
        if (!message) return;
        
        message.textContent = text;
        message.className = 'game-message show ' + type;
        
        // Durée plus courte pour les powerups (plus discret)
        const duration = type === 'powerup' ? 1200 : 2000;
        
        setTimeout(() => {
            message.classList.remove('show');
        }, duration);
    }
    
    // Gestion des photos de boss
    document.querySelectorAll('.boss-photo-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const bossNum = parseInt(e.target.dataset.bossNum);
            
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        bossPhotos[bossNum] = img;
                        const preview = document.querySelector(`.boss-photo-preview[data-boss-num="${bossNum}"]`);
                        if (preview) {
                            preview.style.backgroundImage = `url(${event.target.result})`;
                            preview.style.backgroundSize = 'cover';
                            preview.style.backgroundPosition = 'center';
                            preview.innerHTML = '';
                        }
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });
    
    // Boutons
    if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (gameState.isPlaying) {
            pauseGame();
        } else {
            startGame();
        }
    });
    }
    
    if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
    }
    if (restartBtn) {
    restartBtn.addEventListener('click', startGame);
    }
    
    // Leaderboard
    if (showLeaderboardBtn) {
        console.log('✅ Bouton leaderboard trouvé, ajout de l\'event listener');
        showLeaderboardBtn.addEventListener('click', function(e) {
            console.log('🖱️ Clic sur le bouton leaderboard détecté');
            e.preventDefault();
            e.stopPropagation();
            showLeaderboard();
        });
    } else {
        console.error('❌ Bouton leaderboard non trouvé');
        console.error('💡 Vérifiez que l\'élément #show-leaderboard existe dans le HTML');
    }
    if (closeLeaderboardBtn) {
        console.log('✅ Bouton fermer leaderboard trouvé');
        closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
    } else {
        console.warn('⚠️ Bouton fermer leaderboard non trouvé');
    }
    
    // Fermer le leaderboard en cliquant à l'extérieur
    if (leaderboardModal) {
        leaderboardModal.addEventListener('click', (e) => {
            if (e.target === leaderboardModal) {
                hideLeaderboard();
            }
        });
    }
    
    // Formulaire d'enregistrement de score
    if (scoreRegisterForm && playerNameInput && registerScoreValue && registerLevelValue && registerPositionValue) {
        scoreRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = playerNameInput.value.trim();
            if (name && name.length > 0) {
                // Désactiver le bouton pendant l'enregistrement
                const submitBtn = scoreRegisterForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enregistrement...';
                }
                
                try {
                    await registerScore(name, gameState.score, gameState.level);
                    
                    // Fermer la fenêtre d'enregistrement
                    if (scoreRegister) {
                        scoreRegister.classList.add('hidden');
                    }
                    
                    // Masquer le bouton d'enregistrement après enregistrement réussi
                    if (registerScoreBtn) {
                        registerScoreBtn.classList.add('hidden');
                    }
                    
                    // Réinitialiser les champs
                    playerNameInput.value = '';
                    registerScoreValue.textContent = '0';
                    registerLevelValue.textContent = '1';
                    registerPositionValue.textContent = '-';
                    
                    showMessage(`Score enregistré ! Bien joué ${name} !`, 'powerup');
                    
                    // Mettre à jour le leaderboard si ouvert
                    if (leaderboardModal && !leaderboardModal.classList.contains('hidden')) {
                        await loadLeaderboard();
                        updateLeaderboardDisplay();
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'enregistrement:', error);
                    showMessage('Erreur lors de l\'enregistrement. Réessayez plus tard.', 'hit');
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span class="btn-icon">💾</span> Enregistrer dans le Leaderboard';
                    }
                }
            }
        });
    }
    
    if (cancelRegisterBtn && scoreRegister && playerNameInput) {
        cancelRegisterBtn.addEventListener('click', () => {
            scoreRegister.classList.add('hidden');
            playerNameInput.value = '';
        });
    }
    
    // Bouton pour ouvrir le formulaire d'enregistrement de score
    if (registerScoreBtn && scoreRegister && registerScoreValue && registerLevelValue && registerPositionValue) {
        registerScoreBtn.addEventListener('click', () => {
            // Utilisation du leaderboard local
            if (canRegisterScore(gameState.score)) {
                const position = calculateScorePosition(gameState.score);
                registerScoreValue.textContent = gameState.score.toLocaleString();
                registerLevelValue.textContent = gameState.level;
                registerPositionValue.textContent = position ? `#${position}` : '-';
                
                // Style spécial pour les 3 premières positions
                if (position === 1) {
                    registerPositionValue.style.color = '#ffd700';
                    registerPositionValue.style.textShadow = '0 0 10px #ffd700';
                } else if (position === 2) {
                    registerPositionValue.style.color = '#c0c0c0';
                    registerPositionValue.style.textShadow = '0 0 10px #c0c0c0';
                } else if (position === 3) {
                    registerPositionValue.style.color = '#cd7f32';
                    registerPositionValue.style.textShadow = '0 0 10px #cd7f32';
                } else {
                    registerPositionValue.style.color = 'var(--primary-color)';
                    registerPositionValue.style.textShadow = 'none';
                }
                
                scoreRegister.classList.remove('hidden');
                // Focus automatique sur le champ de nom
                if (playerNameInput) {
                    setTimeout(() => {
                        playerNameInput.focus();
                    }, 100);
                }
            }
        });
    }
    
    // Bouton plein écran
    if (fullscreenBtn && gameWrapper) {
        fullscreenBtn.addEventListener('click', () => {
            if (isFullscreen) {
                exitFullscreen();
            } else {
                enterFullscreen();
            }
        });
    }
    
    // Initialisation
    // Initialiser le jeu (utilise Supabase)
    loadLeaderboard().then(() => {
        console.log('✅ Leaderboard chargé à l\'initialisation');
        console.log('📊 Leaderboard:', leaderboard);
        init();
        draw();
    }).catch((error) => {
        console.error('❌ Erreur chargement leaderboard à l\'initialisation:', error);
        // En cas d'erreur, continuer quand même
    init();
    draw();
});
}); // Fin de document.addEventListener('DOMContentLoaded')

