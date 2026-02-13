/**
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
        prism: '💎',
        seeker: '🎯',
        overdrive: '🔶',
        slowTarget: '🔮',
        mirrorShield: '🪞'
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
    // Détection mobile pour optimisations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isLowEndDevice = isMobile && (navigator.hardwareConcurrency <= 4 || /Android.*Chrome/i.test(navigator.userAgent));
    
    let gameState = {
        isPlaying: false,
        isPaused: false,
        score: 0,
        highScore: (() => {
            try {
                const stored = localStorage.getItem('spaceShooterHighScore');
                if (stored === null || stored === undefined) return 0;
                const parsed = parseInt(stored, 10);
                return isNaN(parsed) ? 0 : parsed;
            } catch (e) {
                console.error('Erreur lors du chargement du high score:', e);
                return 0;
            }
        })(),
        level: 1,
        lives: 3,
        maxLives: 3,
        gameSpeed: 2.0, // Plus nerveux dès le début, augmente avec le niveau
        gameMode: 'normal', // 'normal' ou 'infinite'
        bossActive: false,
        deltaTime: 1.0, // Multiplicateur de vitesse normalisé (1.0 = 60fps)
        isSavingScore: false, // Flag pour empêcher le démarrage pendant l'enregistrement
        isMobile: isMobile, // Flag pour optimisations mobile
        isLowEndDevice: isLowEndDevice // Flag pour optimisations appareils bas de gamme
    };
    
    // Système de sons
    let audioContext = null;
    let audioContextInitialized = false;
    
    // Cache pour les fichiers audio
    const audioCache = {};
    
    // Système de contrôle de volume global
    let globalVolume = parseFloat(localStorage.getItem('spaceShooterVolume')) || 0.7; // Volume par défaut à 70%
    let previousVolume = globalVolume; // Pour le bouton mute/unmute
    let volumeManuallyModified = localStorage.getItem('volumeManuallyModified') === 'true'; // Flag pour désactiver les raccourcis clavier
    
    // Fonction pour définir le volume global
    function setGlobalVolume(volume) {
        globalVolume = Math.max(0, Math.min(1, volume)); // Limiter entre 0 et 1
        localStorage.setItem('spaceShooterVolume', globalVolume.toString());
        
        // Sauvegarder le volume précédent si on n'est pas en mute
        if (globalVolume > 0) {
            previousVolume = globalVolume;
        }
        
        // Adapter le volume des musiques secrètes (Broly, Beerus)
        if (brolyAudio) brolyAudio.volume = 0.7 * globalVolume;
        if (beerusAudio) beerusAudio.volume = 0.7 * globalVolume;
        
        // Mettre à jour l'affichage
        updateVolumeUI();
    }
    
    // Fonction pour mettre à jour l'interface du volume
    function updateVolumeUI() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        const volumeIcon = document.getElementById('volume-icon');
        const volumeSliderFill = document.getElementById('volume-slider-fill');
        
        if (volumeSlider) {
            volumeSlider.value = globalVolume;
        }
        
        if (volumeValue) {
            volumeValue.textContent = Math.round(globalVolume * 100) + '%';
        }
        
        if (volumeSliderFill) {
            volumeSliderFill.style.width = (globalVolume * 100) + '%';
        }
        
        // Mettre à jour l'icône selon le volume
        if (volumeIcon) {
            if (globalVolume === 0) {
                volumeIcon.className = 'fas fa-volume-mute';
                volumeIcon.style.color = 'var(--secondary-color)';
            } else if (globalVolume < 0.3) {
                volumeIcon.className = 'fas fa-volume-down';
                volumeIcon.style.color = 'var(--primary-color)';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
                volumeIcon.style.color = 'var(--primary-color)';
            }
        }
    }
    
    // Fonction pour mute/unmute
    function toggleMute() {
        if (globalVolume > 0) {
            // Mute : sauvegarder le volume actuel et mettre à 0
            previousVolume = globalVolume;
            setGlobalVolume(0);
        } else {
            // Unmute : restaurer le volume précédent
            setGlobalVolume(previousVolume > 0 ? previousVolume : 0.7);
        }
    }
    
    // Fonction pour obtenir le volume global
    function getGlobalVolume() {
        return globalVolume;
    }
    
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
    
    // Fonction pour jouer un fichier audio (volume relatif multiplié par le volume global)
    function playAudioFile(src, volume = 0.5) {
        try {
            // Appliquer le volume global
            const finalVolume = volume * globalVolume;
            
            // Vérifier si l'audio est déjà en cache
            if (!audioCache[src]) {
                const audio = new Audio(src);
                audio.volume = finalVolume;
                audioCache[src] = audio;
            }
            
            const audio = audioCache[src].cloneNode();
            audio.volume = finalVolume;
            audio.play().catch(e => {
                console.warn('Erreur lecture audio:', e);
            });
        } catch (e) {
            console.warn('Erreur création audio:', e);
        }
    }
    
    // Sons du jeu (avec application du volume global)
    function playSound(type, frequency = 440, duration = 0.1) {
        const ctx = initAudioContext();
        if (!ctx) return;
        
        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            switch(type) {
                case 'shoot': {
                    // Tir type blaster : attaque nette + chute de fréquence
                    const t0 = ctx.currentTime;
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const g1 = ctx.createGain();
                    const g2 = ctx.createGain();
                    osc1.type = 'square';
                    osc2.type = 'triangle';
                    osc1.frequency.setValueAtTime(1100, t0);
                    osc1.frequency.exponentialRampToValueAtTime(400, t0 + 0.06);
                    osc2.frequency.setValueAtTime(2200, t0);
                    osc2.frequency.exponentialRampToValueAtTime(800, t0 + 0.04);
                    g1.gain.setValueAtTime(0, t0);
                    g1.gain.linearRampToValueAtTime(0.14 * globalVolume, t0 + 0.008);
                    g1.gain.exponentialRampToValueAtTime(0.001 * globalVolume, t0 + 0.07);
                    g2.gain.setValueAtTime(0.06 * globalVolume, t0);
                    g2.gain.exponentialRampToValueAtTime(0.001 * globalVolume, t0 + 0.045);
                    osc1.connect(g1);
                    osc2.connect(g2);
                    g1.connect(ctx.destination);
                    g2.connect(ctx.destination);
                    osc1.start(t0);
                    osc2.start(t0);
                    osc1.stop(t0 + 0.07);
                    osc2.stop(t0 + 0.045);
                    break;
                }
                case 'explosion': {
                    // Explosion astéroïde : basse + crunch + décroissance
                    const t0 = ctx.currentTime;
                    const dur = 0.38;
                    // Basse (rumble)
                    const oscLow = ctx.createOscillator();
                    const gLow = ctx.createGain();
                    oscLow.type = 'sawtooth';
                    oscLow.frequency.setValueAtTime(140, t0);
                    oscLow.frequency.exponentialRampToValueAtTime(35, t0 + dur);
                    gLow.gain.setValueAtTime(0.22 * globalVolume, t0);
                    gLow.gain.exponentialRampToValueAtTime(0.001 * globalVolume, t0 + dur);
                    oscLow.connect(gLow);
                    gLow.connect(ctx.destination);
                    oscLow.start(t0);
                    oscLow.stop(t0 + dur);
                    // Crunch (attaque médium)
                    const oscMid = ctx.createOscillator();
                    const gMid = ctx.createGain();
                    oscMid.type = 'square';
                    oscMid.frequency.setValueAtTime(180, t0);
                    oscMid.frequency.exponentialRampToValueAtTime(60, t0 + 0.18);
                    gMid.gain.setValueAtTime(0.12 * globalVolume, t0);
                    gMid.gain.exponentialRampToValueAtTime(0.001 * globalVolume, t0 + 0.18);
                    oscMid.connect(gMid);
                    gMid.connect(ctx.destination);
                    oscMid.start(t0);
                    oscMid.stop(t0 + 0.18);
                    // Haut (crack initial)
                    const oscHigh = ctx.createOscillator();
                    const gHigh = ctx.createGain();
                    oscHigh.type = 'sawtooth';
                    oscHigh.frequency.setValueAtTime(400, t0);
                    oscHigh.frequency.exponentialRampToValueAtTime(100, t0 + 0.08);
                    gHigh.gain.setValueAtTime(0.08 * globalVolume, t0);
                    gHigh.gain.exponentialRampToValueAtTime(0.001 * globalVolume, t0 + 0.08);
                    oscHigh.connect(gHigh);
                    gHigh.connect(ctx.destination);
                    oscHigh.start(t0);
                    oscHigh.stop(t0 + 0.08);
                    break;
                }
                case 'powerup':
                    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.15 * globalVolume, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01 * globalVolume, ctx.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;
                case 'hit':
                    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.15 * globalVolume, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01 * globalVolume, ctx.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.1);
                    break;
                case 'bossHit':
                    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
                    oscillator.type = 'sawtooth';
                    gainNode.gain.setValueAtTime(0.25 * globalVolume, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01 * globalVolume, ctx.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(ctx.currentTime + 0.2);
                    break;
                case 'bossShoot':
                    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
                    oscillator.type = 'square';
                    gainNode.gain.setValueAtTime(0.2 * globalVolume, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01 * globalVolume, ctx.currentTime + 0.15);
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
                            gain.gain.setValueAtTime(0.2 * globalVolume, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01 * globalVolume, ctx.currentTime + 0.3);
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
                            gain.gain.setValueAtTime(0.3 * globalVolume, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01 * globalVolume, ctx.currentTime + 0.4);
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
    
    // Jingle court quand on change de thème visuel (tous les 10 niveaux)
    function playThemeTransitionJingle(themeIndex) {
        const ctx = initAudioContext();
        if (!ctx) return;
        try {
            const root = 261.63 + (themeIndex % 8) * 35;
            const notes = [root, root * 1.25, root * 1.5, root * 2];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    try {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, ctx.currentTime);
                        gain.gain.setValueAtTime(0.12 * globalVolume, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001 * globalVolume, ctx.currentTime + 0.12);
                        osc.start(ctx.currentTime);
                        osc.stop(ctx.currentTime + 0.12);
                    } catch (e) { /* ignore */ }
                }, i * 120);
            });
        } catch (e) { /* ignore */ }
    }
    
    // Vaisseau
    const ship = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 8,
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
        prism: false,
        seeker: false,
        overdrive: false,
        slowTarget: false,
        mirrorShield: false,
        rapidFireEndTime: 0,
        shieldEndTime: 0,
        shrinkEndTime: 0,
        bigBulletsEndTime: 0,
        tripleShotEndTime: 0,
        timeSlowEndTime: 0,
        offensiveShieldEndTime: 0,
        magnetEndTime: 0,
        prismEndTime: 0,
        seekerEndTime: 0,
        overdriveEndTime: 0,
        slowTargetEndTime: 0,
        mirrorShieldEndTime: 0
    };
    
    // Astéroïdes renvoyés par le bouclier miroir (se déplacent comme des projectiles, apparence + hitbox astéroïde)
    let reflectedAsteroids = [];
    
    // Multiplicateur de ralentissement temporel
    let timeSlowMultiplier = 1.0;
    
    // Particules de traînée du vaisseau
    let shipTrail = [];
    
    // Effet de shake de l'écran
    let screenShake = { x: 0, y: 0, intensity: 0 };
    const BROLY_MUSIC_SRC = '../ressources/Sons/Broly-Transformation.mp3';
    const BEERUS_MUSIC_SRC = '../ressources/Sons/Beerus-Goku.mp3';
    let brolyAudio = null;
    let beerusAudio = null;
    
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
    
    // Météorites d'ambiance (lentes, fond)
    let ambientMeteors = [];
    
    // Animations visuelles pour les bonus (remplace les messages texte)
    let powerUpVisualAnimations = [];
    
    // Boss
    let boss = null;
    let bossBullets = [];
    let bossPhotos = {}; // Stocke les photos des boss (1-10)
    
    // Variables de tir
    let lastShotTime = 0;
    let baseFireRate = 220; // Temps entre les tirs en ms (plus nerveux)
    let currentFireRate = baseFireRate;
    
    // Vérifications de sécurité pour tous les éléments
    if (!canvas || !ctx) return;
    
    // Éléments UI
    const healthBarFill = document.getElementById('health-bar-fill');
    const shieldBarFill = document.getElementById('shield-bar-fill');
    // Barre de vie du boss supprimée - maintenant dessinée directement sur le canvas au-dessus du boss
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
                    
                    // Si pas de données côté Supabase, on nettoie le cache local
                    leaderboard = [];
                    localStorage.removeItem('spaceShooterLeaderboard');
                    if (leaderboardModal && !leaderboardModal.classList.contains('hidden')) {
                        updateLeaderboardDisplay();
                    }
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
                localStorage.removeItem('spaceShooterLeaderboard');
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
    
    function sanitizePlayerName(rawName) {
        // Conserver les caractères saisis mais supprimer les contrôles, normaliser et limiter à 15 chars
        const base = (rawName ?? '').toString().normalize('NFKC');
        const withoutControl = base.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        const collapsed = withoutControl.replace(/\s+/g, ' ').trim();
        const limited = collapsed.substring(0, 15);
        return limited || 'Anonyme';
    }
    
    function sanitizeNumeric(value, defaultValue = 0) {
        const num = Number(value);
        if (!Number.isFinite(num) || num < 0) return defaultValue;
        return Math.floor(num);
    }
    
    async function registerScore(name, score, level) {
        // Vérification locale : le score doit dépasser le dernier du top 10
        
        // Vérifier que le score peut entrer dans le top 10
        if (!canRegisterScore(score)) {
            throw new Error('Le score n\'est pas assez élevé pour entrer dans le top 10');
        }
        
        const safeName = sanitizePlayerName(name);
        const safeScore = sanitizeNumeric(score, 0);
        const safeLevel = sanitizeNumeric(level, 1);
        
        // Ajouter le score au leaderboard local
        leaderboard.push({ 
            name: safeName, 
            score: safeScore, 
            level: safeLevel, 
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
        bullets = [];
        asteroids = [];
        particles = [];
        powerUps = [];
        stars = [];
        backgroundEvents = [];
        ambientMeteors = [];
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
        gameState.gameSpeed = 1.35;
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
            prism: false,
            seeker: false,
            overdrive: false,
            slowTarget: false,
            mirrorShield: false,
            rapidFireEndTime: 0,
            shieldEndTime: 0,
            shrinkEndTime: 0,
            bigBulletsEndTime: 0,
            tripleShotEndTime: 0,
            timeSlowEndTime: 0,
            offensiveShieldEndTime: 0,
            magnetEndTime: 0,
            prismEndTime: 0,
            seekerEndTime: 0,
            overdriveEndTime: 0,
            slowTargetEndTime: 0,
            mirrorShieldEndTime: 0
        };
        reflectedAsteroids = [];
        timeSlowMultiplier = 1.0;
        lastShotTime = 0;
        if (currentLevelDisplay) {
            currentLevelDisplay.textContent = gameState.level;
        }
        
        // Créer les étoiles (moins sur mobile pour les performances)
        const maxStars = gameState.isMobile ? (gameState.isLowEndDevice ? 30 : 50) : 100;
        for (let i = 0; i < maxStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 1.0 + 0.5
            });
        }
        
        // Météorites d'ambiance (lentes, traversent l'écran)
        const maxMeteors = gameState.isMobile ? (gameState.isLowEndDevice ? 8 : 15) : 25;
        for (let i = 0; i < maxMeteors; i++) {
            ambientMeteors.push({
                x: Math.random() * (canvas.width + 100) - 50,
                y: Math.random() * (canvas.height + 50) - 50,
                speed: 0.5 + Math.random() * 0.8,
                size: 1 + Math.random() * 1.5,
                alpha: 0.12 + Math.random() * 0.2
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
        const buffTypes = ['rapidFire', 'shrink', 'bigBullets', 'tripleShot', 'timeSlow', 'offensiveShield', 'magnet', 'prism', 'seeker', 'overdrive', 'slowTarget', 'mirrorShield'];
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
                } else if (buff.charges != null) {
                    buffIcon.textContent = buff.emoji + '×' + buff.charges;
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
        if (!healthBarFill || !shieldBarFill) return;
        
        const healthPercent = (gameState.lives / gameState.maxLives) * 100;
        healthBarFill.style.width = healthPercent + '%';
        
        if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
            const shieldPercent = ((activePowerUps.shieldEndTime - Date.now()) / 8000) * 100;
            shieldBarFill.style.width = Math.max(0, shieldPercent) + '%';
        } else {
            shieldBarFill.style.width = '0%';
        }
        
        // Barre de vie du boss supprimée - maintenant dessinée directement sur le canvas au-dessus du boss
    }
    
    function updateHighScore() {
        // S'assurer que highScore est un nombre
        if (typeof gameState.highScore !== 'number' || isNaN(gameState.highScore)) {
            gameState.highScore = 0;
        }
        
        if (highScoreElement) highScoreElement.textContent = gameState.highScore;
        if (finalHighScore) finalHighScore.textContent = gameState.highScore;
    }
    
    // Fonction pour mettre à jour le high score en temps réel
    function checkAndUpdateHighScore() {
        // S'assurer que le score et le highScore sont des nombres
        const currentScore = Number(gameState.score) || 0;
        const currentHighScore = Number(gameState.highScore) || 0;
        
        if (currentScore > currentHighScore) {
            gameState.highScore = currentScore;
            // Sauvegarder immédiatement dans localStorage
            try {
                localStorage.setItem('spaceShooterHighScore', String(gameState.highScore));
                updateHighScore();
            } catch (e) {
                console.error('Erreur lors de la sauvegarde du high score:', e);
            }
        }
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
        
        // Nébuleuse pulsée (ambiance)
        if (!gameState.isLowEndDevice) {
            const pulse = 0.02 + 0.025 * Math.sin(Date.now() / 400);
            const nebula = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.3, 0, canvas.width / 2, canvas.height * 0.3, canvas.width * 0.8);
            nebula.addColorStop(0, 'transparent');
            nebula.addColorStop(0.5, 'rgba(80,120,200,' + pulse + ')');
            nebula.addColorStop(1, 'transparent');
            ctx.fillStyle = nebula;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Effet de ralentissement temporel (distorsion visuelle)
        if (activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime) {
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
        
        // Étoiles selon le thème (optimisé pour mobile)
        if (gameState.isLowEndDevice) {
            // Sur appareils bas de gamme, dessiner seulement une étoile sur deux
            for (let i = 0; i < stars.length; i += 2) {
                const star = stars[i];
                ctx.fillStyle = currentTheme.stars;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            stars.forEach(star => {
                ctx.fillStyle = currentTheme.stars;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        if (!gameState.isLowEndDevice && ambientMeteors.length > 0) {
            ambientMeteors.forEach(m => {
                ctx.save();
                ctx.globalAlpha = m.alpha;
                ctx.fillStyle = currentTheme.stars;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
        
        // Traînées de particules du vaisseau (réduites sur mobile) — arc-en-ciel si bonus actif
        if (!gameState.isLowEndDevice) {
            const trailStep = gameState.isMobile ? 2 : 1;
            const trailPrism = activePowerUps.prism && Date.now() < activePowerUps.prismEndTime;
            shipTrail.forEach((trail, index) => {
                if (index % trailStep === 0) {
                    ctx.save();
                    ctx.globalAlpha = trail.alpha;
                    if (trailPrism) {
                        const hue = (Date.now() / 40 + index * 35) % 360;
                        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
                        ctx.shadowBlur = gameState.isMobile ? 8 : 12;
                    } else {
                        ctx.fillStyle = ship.color;
                        ctx.shadowBlur = gameState.isMobile ? 5 : 10;
                    }
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.beginPath();
                    ctx.arc(trail.x, trail.y, 3 - (index / shipTrail.length) * 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
        }
        
        // Aura style Super Saiyan (Broly = vert, Beerus/Goku = doré)
        if (gameState.isPlaying || gameState.isPaused) {
            if (brolyAudio && !brolyAudio.paused) {
                drawSaiyanAura(ship.x, ship.y, ['#00ff88', '#00cc66', '#009944'], '#00ff88', 28);
            }
            if (beerusAudio && !beerusAudio.paused) {
                drawSaiyanAuraDivin(ship.x, ship.y);
            }
        }
        
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
        
        // Projectiles : fusion des bonus (tous les effets actifs se cumulent visuellement)
        const now = Date.now();
        const prismActive = activePowerUps.prism && now < activePowerUps.prismEndTime;
        const brolyAuraActive = brolyAudio && !brolyAudio.paused;
        const beerusAuraActive = beerusAudio && !beerusAudio.paused;
        const overdriveActive = activePowerUps.overdrive && now < activePowerUps.overdriveEndTime;
        function hslToRgb(h, s, l) {
            h = h / 360;
            let r, g, b;
            if (s === 0) { r = g = b = l; } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
            }
            return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
        }
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        bullets.forEach((bullet, bulletIndex) => {
            const bulletSize = bullet.size || 4;
            const anyVisual = prismActive || brolyAuraActive || beerusAuraActive || overdriveActive;
            if (!anyVisual) {
                ctx.save();
                ctx.translate(bullet.x, bullet.y);
                ctx.fillStyle = currentTheme.bullets;
                ctx.shadowBlur = gameState.isMobile ? 5 : 10;
                ctx.shadowColor = currentTheme.bullets;
                ctx.beginPath();
                ctx.arc(0, 0, bulletSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
                return;
            }
            const colors = [];
            if (prismActive) colors.push(hslToRgb((Date.now() / 25 + bulletIndex * 50) % 360, 1, 0.6));
            if (brolyAuraActive) colors.push([0, 255, 136]);
            if (beerusAuraActive) colors.push([255, 68, 102]);
            if (overdriveActive) colors.push([255, 102, 0]);
            let r = 0, g = 0, b = 0;
            colors.forEach(([rr, gg, bb]) => { r += rr; g += gg; b += bb; });
            r = Math.min(255, Math.round(r / colors.length));
            g = Math.min(255, Math.round(g / colors.length));
            b = Math.min(255, Math.round(b / colors.length));
            const blend = `rgb(${r},${g},${b})`;
            const shape = prismActive ? 'bar' : 'circle';
            const shadowBlur = gameState.isMobile ? 10 : 14;
            ctx.save();
            ctx.translate(bullet.x, bullet.y);
            if (shape === 'bar') ctx.rotate((Date.now() * 0.008 + bulletIndex) * 0.02);
            ctx.fillStyle = blend;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowColor = blend;
            if (shape === 'bar') {
                const barW = bulletSize * 1.2, barH = bulletSize * 8;
                ctx.fillRect(-barW/2, -barH/2, barW, barH);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, bulletSize, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.restore();
        });
        
        // Astéroïdes
        asteroids.forEach(asteroid => {
            drawAsteroid(asteroid);
        });
        // Astéroïdes renvoyés par le bouclier miroir (même apparence, même hitbox)
        reflectedAsteroids.forEach(r => drawAsteroid(r));
        
        // Boosts
        powerUps.forEach(powerUp => {
            drawPowerUp(powerUp);
        });
        
        // Bouclier actif
        if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
            drawShield();
        }
        // Bouclier miroir actif (visuel distinct)
        if (activePowerUps.mirrorShield && Date.now() < activePowerUps.mirrorShieldEndTime) {
            drawMirrorShield();
        }
        
        // Particules avec effets stylés selon le type (optimisé pour mobile)
        const particleStep = gameState.isLowEndDevice ? 2 : 1; // Dessiner une particule sur deux sur appareils bas de gamme
        particles.forEach((particle, index) => {
            if (!particle) return;
            if (gameState.isLowEndDevice && index % particleStep !== 0) return; // Skip certaines particules
            
            ctx.save();
            ctx.globalAlpha = particle.alpha || 1;
            
            if (particle.type === 'star') {
                // Étoile stylée avec 4 branches
            ctx.fillStyle = particle.color;
                ctx.shadowBlur = gameState.isMobile ? particle.size * 1.5 : particle.size * 3;
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
                // Étincelle brillante avec effet de lueur (réduit sur mobile)
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = gameState.isMobile ? particle.size * 2 : particle.size * 4;
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
                // Particule normale avec effet de lueur amélioré (réduit sur mobile)
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = gameState.isMobile ? particle.size * 1.5 : particle.size * 2.5;
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
        
        if (!gameState.isLowEndDevice) {
            const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.2, canvas.width / 2, canvas.height / 2, canvas.width * 0.8);
            vig.addColorStop(0, 'transparent');
            vig.addColorStop(0.6, 'rgba(0,0,0,0)');
            vig.addColorStop(1, 'rgba(0,0,0,0.12)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
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
        
        // Dessiner la barre de vie au-dessus du boss
        drawBossHealthBar();
    }
    
    // Dessine la barre de vie du boss au-dessus de lui
    function drawBossHealthBar() {
        if (!boss || !gameState.bossActive) return;
        
        const barWidth = 150;
        const barHeight = 12;
        const barX = boss.x - barWidth / 2;
        const barY = boss.y - boss.size - 30;
        
        const healthPercent = boss.health / boss.maxHealth;
        
        // Fond de la barre (noir avec bordure)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        ctx.strokeStyle = boss.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Barre de vie (dégradé selon la santé)
        const fillWidth = barWidth * healthPercent;
        let fillColor;
        if (healthPercent > 0.6) {
            fillColor = '#00ff00'; // Vert si > 60%
        } else if (healthPercent > 0.3) {
            fillColor = '#ffaa00'; // Orange si entre 30% et 60%
        } else {
            fillColor = '#ff0000'; // Rouge si < 30%
        }
        
        // Dégradé pour la barre de vie
        const gradient = ctx.createLinearGradient(barX, barY, barX + fillWidth, barY);
        gradient.addColorStop(0, fillColor);
        gradient.addColorStop(1, fillColor + '88');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, fillWidth, barHeight);
        
        // Effet de brillance
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(barX, barY, fillWidth, barHeight / 2);
        
        // Texte avec le nom du boss et les PV
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${boss.bossName} - ${boss.health}/${boss.maxHealth}`, boss.x, barY - 10);
        
        // Ombre du texte
        ctx.shadowBlur = 5;
        ctx.shadowColor = boss.color;
        ctx.fillText(`${boss.bossName} - ${boss.health}/${boss.maxHealth}`, boss.x, barY - 10);
        ctx.shadowBlur = 0;
    }
    
    function drawSaiyanAura(x, y, colorStops, glowColor, baseRadius) {
        ctx.save();
        ctx.translate(x, y);
        const t = Date.now() * 0.002;
        const pulse = Math.sin(t) * 0.12 + 1;
        const h = baseRadius * 1.4 * pulse;
        const w = baseRadius * 1.1 * (0.9 + Math.sin(t * 2) * 0.1);
        const tipY = -h;
        const leftX = -w;
        const rightX = w;
        const baseY = h * 0.5;
        const grad = ctx.createLinearGradient(0, tipY, 0, baseY);
        grad.addColorStop(0, colorStops[0] + '00');
        grad.addColorStop(0.2, colorStops[0] + '66');
        grad.addColorStop(0.5, colorStops[1] + '99');
        grad.addColorStop(0.85, colorStops[2] + 'cc');
        grad.addColorStop(1, colorStops[2] + '44');
        ctx.shadowBlur = 35;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, tipY);
        ctx.lineTo(leftX, baseY);
        ctx.lineTo(0, baseY * 0.7);
        ctx.lineTo(rightX, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 18;
        ctx.strokeStyle = glowColor + 'ee';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, tipY * 0.3);
        ctx.lineTo(0, baseY);
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    
    function drawSaiyanAuraDivin(x, y) {
        ctx.save();
        ctx.translate(x, y);
        const t = Date.now() * 0.0018;
        const pulse = Math.sin(t) * 0.1 + 1;
        const h = 38 * pulse;
        const w = 32 * (0.92 + Math.sin(t * 2.5) * 0.08);
        const tipY = -h;
        const baseY = h * 0.55;
        const grad = ctx.createLinearGradient(0, tipY, 0, baseY);
        grad.addColorStop(0, 'rgba(255, 240, 255, 0.5)');
        grad.addColorStop(0.15, 'rgba(255, 150, 180, 0.6)');
        grad.addColorStop(0.45, 'rgba(255, 60, 100, 0.7)');
        grad.addColorStop(0.8, 'rgba(200, 20, 50, 0.5)');
        grad.addColorStop(1, 'rgba(160, 10, 40, 0.3)');
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#ff3366';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, tipY);
        ctx.lineTo(-w, baseY);
        ctx.lineTo(0, baseY * 0.65);
        ctx.lineTo(w, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.strokeStyle = 'rgba(255, 100, 140, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, tipY * 0.2);
        ctx.lineTo(0, baseY);
        ctx.strokeStyle = 'rgba(255, 220, 240, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
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
        
        let shipColor = ship.color;
        let detailColor = '#00ffff';
        if (brolyAudio && !brolyAudio.paused) {
            shipColor = '#00ff88';
            detailColor = '#00ffcc';
        } else if (beerusAudio && !beerusAudio.paused) {
            shipColor = '#ff4466';
            detailColor = '#ffaacc';
        } else if (activePowerUps.overdrive && Date.now() < activePowerUps.overdriveEndTime) {
            shipColor = '#ff6600';
            detailColor = '#ff9933';
        }
        
        // Corps du vaisseau
        ctx.fillStyle = shipColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = shipColor;
        
        // Forme du vaisseau (triangle)
        ctx.beginPath();
        ctx.moveTo(0, -ship.height / 2);
        ctx.lineTo(-ship.width / 2, ship.height / 2);
        ctx.lineTo(0, ship.height / 2 - 10);
        ctx.lineTo(ship.width / 2, ship.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Détails
        ctx.fillStyle = detailColor;
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
        ctx.shadowBlur = asteroid.size >= 48 ? 12 : 5;
        ctx.shadowColor = asteroid.color;
        
        const sides = asteroid.size >= 48 ? 12 : 8;
        const irregularity = asteroid.size >= 48 ? 8 : 5;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const radius = asteroid.size + Math.sin(angle * 3) * irregularity;
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
        } else if (powerUp.type === 'prism') {
            // Prisme — cristal dégradé RGB
            const gradient = ctx.createLinearGradient(-10, -10, 10, 10);
            gradient.addColorStop(0, '#ff3366');
            gradient.addColorStop(0.5, '#33ff99');
            gradient.addColorStop(1, '#3366ff');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(8, 8);
            ctx.lineTo(-8, 8);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.7)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else if (powerUp.type === 'seeker') {
            ctx.fillStyle = '#00dd88';
            ctx.strokeStyle = '#00aa66';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.quadraticCurveTo(9, 0, 0, 10);
            ctx.quadraticCurveTo(-9, 0, 0, -10);
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'overdrive') {
            ctx.fillStyle = '#ff6600';
            ctx.strokeStyle = '#cc4400';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'slowTarget') {
            ctx.fillStyle = '#9b59b6';
            ctx.strokeStyle = '#6c3483';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(6, 8);
            ctx.lineTo(0, 4);
            ctx.lineTo(-6, 8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (powerUp.type === 'mirrorShield') {
            ctx.strokeStyle = '#00ccff';
            ctx.fillStyle = 'rgba(0, 200, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(8, 0);
            ctx.moveTo(0, -8);
            ctx.lineTo(0, 8);
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
    
    function drawMirrorShield() {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        const pulse = Math.sin(Date.now() / 120) * 0.08 + 1;
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00aacc';
        ctx.beginPath();
        ctx.arc(0, 0, (ship.width / 2 + 10) * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
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
                star.y += (star.speed + gameState.gameSpeed * 0.65) * gameState.deltaTime;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });
            return;
        }
        
        // Mise à jour des étoiles (normalisé par delta time) — plus rapides pour plus de mouvement
        stars.forEach(star => {
            star.y += (star.speed + gameState.gameSpeed * 0.65) * gameState.deltaTime;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        
        // Événements de fond plus fréquents et plus rapides (2% par frame)
        if (Math.random() < 0.022) {
            const eventType = Math.random();
            if (eventType < 0.5) {
                // Fusée (50% des événements)
                backgroundEvents.push({
                    type: 'rocket',
                    x: Math.random() * canvas.width,
                    y: canvas.height + 20,
                    speed: Math.random() * 4 + 4,
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
                    length: 40,
                    speed: Math.random() * 5 + 6,
                    alpha: 0.8,
                    life: 150
                });
            }
        }
        
        // Mise à jour des événements de fond (ralentissement temporel + delta time)
        const slowMultiplierEvents = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        backgroundEvents.forEach((event, index) => {
            if (event.type === 'rocket') {
                event.y -= event.speed * slowMultiplierEvents * gameState.deltaTime;
            } else if (event.type === 'shootingStar') {
                event.x += event.speed * 0.5 * slowMultiplierEvents * gameState.deltaTime;
                event.y += event.speed * slowMultiplierEvents * gameState.deltaTime;
            }
            event.life--;
            event.alpha = Math.max(0, event.alpha - 0.01);
            
            if (event.life <= 0 || event.y < -50 || event.y > canvas.height + 50 || event.x > canvas.width + 50) {
                backgroundEvents.splice(index, 1);
            }
        });
        
        const slowMulAmbient = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        ambientMeteors.forEach(m => {
            m.y += m.speed * slowMulAmbient * gameState.deltaTime;
            if (m.y > canvas.height + 10) {
                m.y = -5;
                m.x = Math.random() * (canvas.width + 80) - 40;
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
        
        // Mise à jour des projectiles (normalisé par delta time) — Chercheur (homing) si actif
        const slowMultiplierBullets = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        const seekerActive = activePowerUps.seeker && Date.now() < activePowerUps.seekerEndTime;
        bullets.forEach((bullet, index) => {
            if (seekerActive && asteroids.length > 0) {
                bullet.vx = bullet.vx ?? 0;
                bullet.vy = bullet.vy ?? -bullet.speed;
                let nearest = null;
                let nearestDist = Infinity;
                asteroids.forEach(a => {
                    if (a.y > bullet.y + 150) return;
                    const dx = a.x - bullet.x;
                    const dy = a.y - bullet.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < nearestDist) {
                        nearestDist = d;
                        nearest = a;
                    }
                });
                if (nearest && nearestDist > 0) {
                    const dx = (nearest.x - bullet.x) / nearestDist;
                    const dy = (nearest.y - bullet.y) / nearestDist;
                    const pull = 4 * gameState.deltaTime;
                    bullet.vx += dx * pull;
                    bullet.vy += dy * pull;
                    const len = Math.sqrt(bullet.vx * bullet.vx + bullet.vy * bullet.vy);
                    if (len > 0.01) {
                        const s = bullet.speed || 8;
                        bullet.vx = (bullet.vx / len) * s;
                        bullet.vy = (bullet.vy / len) * s;
                    }
                }
                bullet.x += bullet.vx * slowMultiplierBullets * gameState.deltaTime;
                bullet.y += bullet.vy * slowMultiplierBullets * gameState.deltaTime;
            } else if (bullet.vx !== undefined || bullet.vy !== undefined) {
                bullet.y += (bullet.vy !== undefined ? bullet.vy : -bullet.speed) * slowMultiplierBullets * gameState.deltaTime;
                bullet.x += (bullet.vx || 0) * slowMultiplierBullets * gameState.deltaTime;
            } else {
                bullet.y -= bullet.speed * slowMultiplierBullets * gameState.deltaTime;
            }
            if (bullet.y < 0 || bullet.y > canvas.height || bullet.x < -20 || bullet.x > canvas.width + 20) {
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
        
        // Mise à jour des astéroïdes (normalisé par delta time)
        const slowMultiplier = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        const slowTargetActive = activePowerUps.slowTarget && Date.now() < activePowerUps.slowTargetEndTime;
        const CONE_DIST = 350;
        const CONE_COS = 0.7; // ~45° devant le vaisseau
        asteroids.forEach((asteroid, index) => {
            let mul = slowMultiplier;
            if (slowTargetActive && asteroid.y < ship.y) {
                const dx = asteroid.x - ship.x;
                const dy = asteroid.y - ship.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0 && dist < CONE_DIST && (ship.y - asteroid.y) / dist >= CONE_COS) {
                    mul *= 0.35;
                }
            }
            asteroid.y += asteroid.speed * mul * gameState.deltaTime;
            if (asteroid.vx !== undefined) {
                asteroid.x += asteroid.vx * mul * gameState.deltaTime;
                if (asteroid.x < -asteroid.size * 2 || asteroid.x > canvas.width + asteroid.size * 2) asteroid.vx *= -0.8;
            }
            asteroid.rotation += asteroid.rotationSpeed * mul * gameState.deltaTime;
            
            if (asteroid.y > canvas.height + 50) {
                asteroids.splice(index, 1);
            }
        });
        
        // Mise à jour des astéroïdes renvoyés par le bouclier miroir (montent comme des projectiles)
        const slowMulReflected = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        reflectedAsteroids.forEach((r, idx) => {
            r.y += r.vy * slowMulReflected * gameState.deltaTime;
            r.x += (r.vx || 0) * slowMulReflected * gameState.deltaTime;
            r.rotation += (r.rotationSpeed || 0) * slowMulReflected * gameState.deltaTime;
            if (r.y < -50 || r.y > canvas.height + 50 || r.x < -50 || r.x > canvas.width + 50) {
                reflectedAsteroids.splice(idx, 1);
            }
        });
        
        // Mise à jour des particules (normalisé par delta time)
        // Limiter le nombre de particules pour éviter les crashes (moins sur mobile)
        const maxParticles = gameState.isMobile ? (gameState.isLowEndDevice ? 50 : 100) : 200;
        const particleLimit = gameState.isMobile ? (gameState.isLowEndDevice ? 30 : 75) : 150;
        if (particles.length > maxParticles) {
            // Supprimer les particules les plus anciennes
            particles = particles.slice(-particleLimit);
        }
        
        particles.forEach((particle, index) => {
            if (!particle) {
                particles.splice(index, 1);
                return;
            }
            
            try {
                particle.x += (particle.vx || 0) * gameState.deltaTime;
                particle.y += (particle.vy || 0) * gameState.deltaTime;
                particle.vy = (particle.vy || 0) + 0.1 * gameState.deltaTime; // Gravité
                particle.alpha = (particle.alpha || 1) - 0.02 * gameState.deltaTime;
                particle.size = (particle.size || 1) - 0.1 * gameState.deltaTime;
                
                if (particle.alpha <= 0 || particle.size <= 0 || isNaN(particle.x) || isNaN(particle.y)) {
                    particles.splice(index, 1);
                }
            } catch (e) {
                console.warn('Erreur particule:', e);
                particles.splice(index, 1);
            }
        });
        
        // Mise à jour des boosts (normalisé par delta time)
        const slowMultiplierPowerUps = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        powerUps.forEach((powerUp, index) => {
            // Effet magnet : attirer les bonus vers le vaisseau
            if (activePowerUps.magnet && Date.now() < activePowerUps.magnetEndTime) {
                const dx = ship.x - powerUp.x;
                const dy = ship.y - powerUp.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const magnetForce = 0.3;
                if (distance > 0) {
                    powerUp.x += (dx / distance) * magnetForce * 5 * slowMultiplierPowerUps * gameState.deltaTime;
                    powerUp.y += (dy / distance) * magnetForce * 5 * slowMultiplierPowerUps * gameState.deltaTime;
                }
            } else {
                powerUp.y += (powerUp.speed || 2) * slowMultiplierPowerUps * gameState.deltaTime;
            }
            powerUp.rotation += 0.05 * slowMultiplierPowerUps * gameState.deltaTime;
            
            if (powerUp.y > canvas.height + 20) {
                powerUps.splice(index, 1);
            }
        });
        
        // Vérifier l'expiration des boosts actifs
        const now = Date.now();
            if (activePowerUps.rapidFire && now > activePowerUps.rapidFireEndTime) {
            activePowerUps.rapidFire = false;
            currentFireRate = baseFireRate;
            if (autoShootInterval) {
                clearInterval(autoShootInterval);
                autoShootInterval = null;
                if (keys['Space']) {
                    autoShootInterval = setInterval(() => {
                        if (gameState.isPlaying && !gameState.isPaused && keys['Space']) shoot();
                    }, getEffectiveFireRate());
                }
            }
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
        if (activePowerUps.prism && now > activePowerUps.prismEndTime) {
            activePowerUps.prism = false;
        }
        if (activePowerUps.seeker && now > activePowerUps.seekerEndTime) {
            activePowerUps.seeker = false;
        }
        if (activePowerUps.overdrive && now > activePowerUps.overdriveEndTime) {
            activePowerUps.overdrive = false;
        }
        if (activePowerUps.slowTarget && now > activePowerUps.slowTargetEndTime) {
            activePowerUps.slowTarget = false;
        }
        if (activePowerUps.mirrorShield && now > activePowerUps.mirrorShieldEndTime) {
            activePowerUps.mirrorShield = false;
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
                    
                    // Score
                    // Ne pas ajouter de score si un boss est actif
                    if (!gameState.bossActive) {
                        const points = Math.floor(asteroid.size / 5) * 10;
                        gameState.score += points;
                        if (scoreElement) scoreElement.textContent = gameState.score;
                        // Vérifier et mettre à jour le high score en temps réel
                        checkAndUpdateHighScore();
                        // Particules de score
                        createScoreParticle(asteroid.x, asteroid.y, `+${points}`);
                    }
                    gameStats.asteroidsDestroyed++;
                    gameStats.bulletsHit++;
                    
                    // Perceur (prism) : projectile perçant, ne pas le supprimer
                    if (!(activePowerUps.prism && Date.now() < activePowerUps.prismEndTime)) {
                        bullets.splice(bulletIndex, 1);
                    }
                    
                    // Vérifier si l'astéroïde doit se séparer
                    const isBigType = asteroid.size >= 48;  // Gros type : toujours se divise en gros morceaux
                    const isLargeNormal = asteroid.size > 25 && asteroid.size < 48;
                    const baseSpeedFromParent = asteroid.speed * asteroid.size / ASTEROID_SIZE_REF;
                    
                    const parentVx = asteroid.vx !== undefined ? asteroid.vx : 0;
                    if (isBigType) {
                        // Gros astéroïde : se divise en 2–3 gros morceaux (plus gros = plus lents)
                        const numPieces = Math.floor(Math.random() * 2) + 2;
                        const sizeRatio = 0.5 + Math.random() * 0.15;
                        for (let i = 0; i < numPieces; i++) {
                            const angle = (Math.PI * 2 / numPieces) * i + Math.random() * 0.5;
                            const newSize = asteroid.size * sizeRatio;
                            const childSpeed = getAsteroidSpeedForSize(baseSpeedFromParent, newSize);
                            asteroids.push({
                                x: asteroid.x + Math.cos(angle) * (asteroid.size / 2),
                                y: asteroid.y + Math.sin(angle) * (asteroid.size / 2),
                                size: newSize,
                                speed: childSpeed,
                                vx: parentVx + (Math.random() - 0.5) * 1.2,
                                rotation: 0,
                                rotationSpeed: (Math.random() - 0.5) * 0.28,
                                color: asteroid.color
                            });
                        }
                    } else if (isLargeNormal && Math.random() < 0.45) {
                        // Astéroïde normal gros : 45% de chance de se séparer en 2–3 morceaux
                        const numPieces = Math.floor(Math.random() * 2) + 2;
                        for (let i = 0; i < numPieces; i++) {
                            const angle = (Math.PI * 2 / numPieces) * i;
                            const newSize = asteroid.size * 0.4;
                            const childSpeed = getAsteroidSpeedForSize(baseSpeedFromParent, newSize);
                            asteroids.push({
                                x: asteroid.x + Math.cos(angle) * (asteroid.size / 2),
                                y: asteroid.y + Math.sin(angle) * (asteroid.size / 2),
                                size: newSize,
                                speed: childSpeed,
                                vx: parentVx + (Math.random() - 0.5) * 1.2,
                                rotation: 0,
                                rotationSpeed: (Math.random() - 0.5) * 0.28,
                                color: asteroid.color
                            });
                        }
                    }
                    
                    // Chance de faire apparaître un boost — raretés pour limiter le stacking et équilibrer
                    const DROP_RATE = 0.055;
                    const BONUS_RARITY = {
                        common:   { chance: 0.58, types: ['rapidFire', 'shield', 'shrink', 'bigBullets', 'tripleShot'] },
                        uncommon: { chance: 0.26, types: ['timeSlow', 'magnet', 'seeker'] },
                        rare:     { chance: 0.12, types: ['offensiveShield', 'prism', 'overdrive', 'slowTarget'] },
                        epic:     { chance: 0.04, types: ['life', 'mirrorShield'] }
                    };
                    if (Math.random() < DROP_RATE) {
                        const r = Math.random();
                        let tier = 'common';
                        if (r < BONUS_RARITY.common.chance) tier = 'common';
                        else if (r < BONUS_RARITY.common.chance + BONUS_RARITY.uncommon.chance) tier = 'uncommon';
                        else if (r < BONUS_RARITY.common.chance + BONUS_RARITY.uncommon.chance + BONUS_RARITY.rare.chance) tier = 'rare';
                        else tier = 'epic';
                        const list = BONUS_RARITY[tier].types;
                        const type = list[Math.floor(Math.random() * list.length)];
                        spawnPowerUp(asteroid.x, asteroid.y, type);
                    }
                    
                    // Supprimer l'astéroïde
                    asteroids.splice(asteroidIndex, 1);
                    
                    // Vérifier le niveau
                    checkLevel();
                }
            });
        });
        
        // Collision astéroïdes renvoyés (miroir) vs astéroïdes normaux
        for (let ri = reflectedAsteroids.length - 1; ri >= 0; ri--) {
            const ref = reflectedAsteroids[ri];
            for (let ai = asteroids.length - 1; ai >= 0; ai--) {
                const a = asteroids[ai];
                const dx = ref.x - a.x;
                const dy = ref.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < ref.size + a.size) {
                    createEnhancedExplosion(a.x, a.y, a.color, a.size);
                    playSound('explosion');
                    if (!gameState.bossActive) {
                        const points = Math.floor(a.size / 5) * 10;
                        gameState.score += points;
                        if (scoreElement) scoreElement.textContent = gameState.score;
                        checkAndUpdateHighScore();
                        createScoreParticle(a.x, a.y, `+${points}`);
                    }
                    gameStats.asteroidsDestroyed++;
                    asteroids.splice(ai, 1);
                    reflectedAsteroids.splice(ri, 1);
                    checkLevel();
                    break;
                }
            }
        }
        
        // Collision vaisseau/astéroïdes
        asteroids.forEach((asteroid, index) => {
            const dx = ship.x - asteroid.x;
            const dy = ship.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
            const shieldRadius = ship.width / 2 + 10;
            if (distance < asteroid.size + shipSize) {
                // Bouclier miroir : renvoyer l'astéroïde dans l'autre sens (il devient un "projectile" à l'apparence d'astéroïde)
                if (activePowerUps.mirrorShield && Date.now() < activePowerUps.mirrorShieldEndTime && distance < asteroid.size + shieldRadius) {
                    playSound('hit');
                    reflectedAsteroids.push({
                        x: asteroid.x,
                        y: asteroid.y,
                        vx: 0,
                        vy: -10,
                        size: asteroid.size,
                        color: asteroid.color,
                        rotation: asteroid.rotation,
                        rotationSpeed: asteroid.rotationSpeed || (Math.random() - 0.5) * 0.1
                    });
                    asteroids.splice(index, 1);
                } else if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
                    // Si le bouclier normal est actif, l'astéroïde est détruit sans perdre de vie
                    createEnhancedExplosion(asteroid.x, asteroid.y, asteroid.color, asteroid.size);
                    playSound('hit');
                    asteroids.splice(index, 1);
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
        
        // Spawn : plus d'astéroïdes, rythme plus nerveux
        const lvl = gameState.level;
        const spawnRate = lvl <= 80
            ? 0.025 + ((lvl - 1) / 79) * 0.095
            : 0.12 + (lvl - 80) * 0.0015;
        if (Math.random() < Math.min(0.20, spawnRate)) {
            spawnAsteroid();
        }
    }
    
    function createExplosion(x, y, color) {
        // Réduire le nombre de particules sur mobile
        const particleCount = gameState.isMobile ? (gameState.isLowEndDevice ? 5 : 10) : 15;
        for (let i = 0; i < particleCount; i++) {
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
            // Particules principales en étoile (réduites sur mobile)
            const starParticles = gameState.isMobile ? (gameState.isLowEndDevice ? 4 : 6) : 8;
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
            
            // Particules secondaires aléatoires avec couleurs variées (réduites sur mobile)
            const randomParticles = gameState.isMobile ? (gameState.isLowEndDevice ? 2 : 4) : 6;
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
            
            // Particules de brillance (petites et rapides) - réduites sur mobile
            const sparkleParticles = gameState.isMobile ? (gameState.isLowEndDevice ? 1 : 2) : 4;
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
        } else if (type === 'prism') {
            text = '💎 Perceur (arc-en-ciel)';
            glowColor = '#aa66ff';
        } else if (type === 'seeker') {
            text = '🎯 Chercheur';
            glowColor = '#00dd88';
        } else if (type === 'overdrive') {
            text = '🔶 Survolt';
            glowColor = '#ff6600';
        } else if (type === 'slowTarget') {
            text = '🎯 Ralenti cible';
            glowColor = '#9b59b6';
        } else if (type === 'mirrorShield') {
            text = '🪞 Bouclier miroir';
            glowColor = '#00ccff';
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
            // Limiter le nombre de particules pour éviter les crashes (réduit sur mobile)
            const maxParticles = gameState.isMobile ? (gameState.isLowEndDevice ? 15 : 25) : 50;
            const maxParticleCount = Math.min(Math.floor(size / 2) + 20, maxParticles);
            const particleCount = Math.min(maxParticleCount, maxParticles);
            
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
            // Réduire les particules de fumée sur mobile
            const maxSmoke = gameState.isMobile ? (gameState.isLowEndDevice ? 5 : 10) : 25;
            const smokeCount = Math.min(Math.floor(particleCount / 2), maxSmoke);
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
        else if (type === 'prism') color = '#aa66ff';
        else if (type === 'seeker') color = '#00dd88';
        else if (type === 'overdrive') color = '#ff6600';
        else if (type === 'slowTarget') color = '#9b59b6';
        else if (type === 'mirrorShield') color = '#00ccff';
        
        powerUps.push({
            x: x,
            y: y,
            type: type,
            speed: 2,
            rotation: 0,
            color: color
        });
    }
    
    // Durées de base pour le stack (stack = durée uniquement)
    const BONUS_DURATIONS = { rapidFire: 10000, shield: 8000, shrink: 12000, bigBullets: 15000, tripleShot: 10000, timeSlow: 12000, offensiveShield: 15000, magnet: 20000, prism: 12000, seeker: 10000, overdrive: 10000, slowTarget: 10000, mirrorShield: 12000 };
    
    const TIMED_BONUS_TYPES = ['rapidFire', 'shield', 'shrink', 'bigBullets', 'tripleShot', 'timeSlow', 'offensiveShield', 'magnet', 'prism', 'seeker', 'overdrive', 'slowTarget', 'mirrorShield'];
    
    function applyTimedBonus(type, endTimeKey) {
        const now = Date.now();
        const duration = BONUS_DURATIONS[type] || 10000;
        if (activePowerUps[type] && now < activePowerUps[endTimeKey]) {
            activePowerUps[endTimeKey] += duration; // Stack = durée seulement
        } else {
            activePowerUps[type] = true;
            activePowerUps[endTimeKey] = now + duration;
            if (type === 'rapidFire') currentFireRate = baseFireRate / 3;
            if (type === 'timeSlow') timeSlowMultiplier = 0.5;
        }
        createPowerUpVisualAnimation(type, ship.x, ship.y);
    }
    
    // Collecte un boost (tous compatibles en combo, stack = durée uniquement)
    function collectPowerUp(powerUp) {
        const now = Date.now();
        
        playSound('powerup');
        
        if (powerUp.type === 'rapidFire') {
            applyTimedBonus('rapidFire', 'rapidFireEndTime');
        } else if (powerUp.type === 'shield') {
            applyTimedBonus('shield', 'shieldEndTime');
        } else if (powerUp.type === 'life') {
            if (gameState.lives < 5) {
                gameState.lives++;
                gameState.maxLives = Math.max(gameState.maxLives, gameState.lives);
                if (livesElement) livesElement.textContent = gameState.lives;
                createPowerUpVisualAnimation('life', ship.x, ship.y);
            } else {
                createPowerUpVisualAnimation('lifeMax', ship.x, ship.y);
            }
        } else if (powerUp.type === 'shrink') {
            applyTimedBonus('shrink', 'shrinkEndTime');
        } else if (powerUp.type === 'bigBullets') {
            applyTimedBonus('bigBullets', 'bigBulletsEndTime');
        } else if (powerUp.type === 'tripleShot') {
            applyTimedBonus('tripleShot', 'tripleShotEndTime');
        } else if (powerUp.type === 'timeSlow') {
            applyTimedBonus('timeSlow', 'timeSlowEndTime');
        } else if (powerUp.type === 'offensiveShield') {
            applyTimedBonus('offensiveShield', 'offensiveShieldEndTime');
        } else if (powerUp.type === 'magnet') {
            applyTimedBonus('magnet', 'magnetEndTime');
        } else if (powerUp.type === 'prism') {
            applyTimedBonus('prism', 'prismEndTime');
        } else if (powerUp.type === 'seeker') {
            applyTimedBonus('seeker', 'seekerEndTime');
        } else if (powerUp.type === 'overdrive') {
            applyTimedBonus('overdrive', 'overdriveEndTime');
        } else if (powerUp.type === 'slowTarget') {
            applyTimedBonus('slowTarget', 'slowTargetEndTime');
        } else if (powerUp.type === 'mirrorShield') {
            applyTimedBonus('mirrorShield', 'mirrorShieldEndTime');
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
    
    // Vitesse inversement proportionnelle à la taille : plus gros = plus lent
    const ASTEROID_SIZE_REF = 25;
    function getAsteroidSpeedForSize(baseSpeed, size) {
        return baseSpeed * ASTEROID_SIZE_REF / Math.max(size, 12);
    }
    
    function spawnAsteroid() {
        const currentTheme = getCurrentTheme();
        const asteroidColors = currentTheme.asteroids;
        const randomColor = asteroidColors[Math.floor(Math.random() * asteroidColors.length)];
        const baseSpeed = Math.random() * 3 + gameState.gameSpeed * 1.2;
        
        // Gros astéroïdes : peu en début (1-10), montée jusqu'à 30, stable 30-80, plus après 80
        const l = gameState.level;
        let bigChance = 0.15;
        if (l <= 10) bigChance = 0.05;
        else if (l <= 30) bigChance = 0.05 + ((l - 10) / 20) * 0.10;
        else if (l > 80) bigChance = 0.18;
        const isBigType = Math.random() < bigChance;
        const size = isBigType
            ? Math.random() * 22 + 50   // 50–72 : gros
            : Math.random() * 30 + 15;  // 15–45 : normal
        
        const speed = getAsteroidSpeedForSize(baseSpeed, size);
        const vx = (Math.random() - 0.5) * 1.8;
        
        asteroids.push({
            x: Math.random() * (canvas.width - size * 2) + size,
            y: -size,
            size: size,
            speed: speed,
            vx: vx,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.28,
            color: randomColor
        });
    }
    
    // Marque les astéroïdes comme "gros" (pour la séparation)
    function isLargeAsteroid(asteroid) {
        return asteroid.size > 25;
    }
    
    // Vitesse : montée plus marquée pour un jeu plus nerveux
    function getSpeedIncrease(level) {
        if (level <= 80) {
            return 0.04 + ((level - 1) / 79) * 0.04;
        }
        return Math.max(0.045, 0.06 - (level - 81) * 0.0002);
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
            const previousLevel = gameState.level;
            gameState.level = newLevel;
            const prevTheme = Math.floor((previousLevel - 1) / 10);
            const newTheme = Math.floor((gameState.level - 1) / 10);
            if (newTheme > prevTheme) playThemeTransitionJingle(newTheme);
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
            const previousLevel = gameState.level;
            gameState.level = newLevel;
            const prevTheme = Math.floor((previousLevel - 1) / 10);
            const newTheme = Math.floor((gameState.level - 1) / 10);
            if (newTheme > prevTheme) playThemeTransitionJingle(newTheme);
            // Augmentation progressive de la vitesse
            const speedIncrease = getSpeedIncrease(gameState.level);
            gameState.gameSpeed += speedIncrease;
            if (levelElement) levelElement.textContent = gameState.level;
            if (currentLevelDisplay) currentLevelDisplay.textContent = gameState.level;
            
            // Animation de niveau supprimée
            
            // Vérifier si un boss doit apparaître (tous les 10 niveaux)
            // Vérifier aussi si on vient de passer d'un niveau non-multiple de 10 à un multiple de 10
            // (pour gérer le cas où le niveau saute de 9 à 11 par exemple)
            const shouldSpawnBoss = (gameState.level % 10 === 0) && 
                                    (previousLevel % 10 !== 0 || previousLevel === 0) &&
                                    !gameState.bossActive && 
                                    !boss && 
                                    gameState.level <= 100;
            
            if (shouldSpawnBoss) {
                console.log(`🎯 Niveau ${gameState.level} atteint - Tentative spawn boss`);
                console.log('Conditions:', {
                    level: gameState.level,
                    previousLevel: previousLevel,
                    levelMod10: gameState.level % 10,
                    previousLevelMod10: previousLevel % 10,
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
        
        // Calcul du numéro du boss : niveau 10 = boss 1, niveau 20 = boss 2, etc.
        const bossNumber = Math.min(10, Math.floor(gameState.level / 10));
        
        // Vérifier que le bossNumber est valide
        if (bossNumber < 1 || bossNumber > 10) {
            console.error('❌ Boss number invalide:', bossNumber, 'level:', gameState.level);
            return;
        }
        
        // Vérifier que le niveau est bien un multiple de 10
        if (gameState.level % 10 !== 0) {
            console.warn('⚠️ Tentative de spawn boss à un niveau non-multiple de 10:', gameState.level);
            // Ne pas empêcher le spawn, mais logger pour debug
        }
        
        console.log(`✅ Spawning boss ${bossNumber} (${getBossName(bossNumber)}) at level ${gameState.level}`);
        
        // Jouer le son d'arrivée du boss (chaque boss a sa musique)
        const bossMusicPaths = [
            '../ressources/Sons/Boss1.mp3',  // Locked in alien
            '../ressources/Sons/Boss2.mp3',  // Goku SSJ3
            '../ressources/Sons/Boss3.mp3',  // Karism
            '../ressources/Sons/Boss4.mp3',  // Herobrine
            '../ressources/Sons/Boss5.mp3',  // Goblinstein
            '../ressources/Sons/Boss6.mp3',  // Michael Personne
            '../ressources/Sons/Boss7.mp3',  // M. BAER
            '../ressources/Sons/Boss8.mp3',  // Sunshine
            '../ressources/Sons/Boss9.mp3',  // WhatSans
            '../ressources/Sons/Boss10.mp3'  // IUT GUSTAVE EIFFEL
        ];
        const bossTrack = bossMusicPaths[bossNumber - 1];
        if (bossTrack) playAudioFile(bossTrack, 0.6);
        
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
        // Mise à jour du patternTime normalisé par delta time (16ms = 1 frame à 60fps)
        boss.patternTime += 16 * gameState.deltaTime;
        
        // Appliquer le pattern de mouvement selon le numéro du boss
        updateBossMovement();
        
        // Tir du boss
        if (now - boss.lastShot > boss.shootInterval) {
            bossShoot();
            boss.lastShot = now;
        }
        
        // Mise à jour des projectiles du boss (ralentissement temporel + delta time)
        const slowMultiplierBossBullets = activePowerUps.timeSlow && Date.now() < activePowerUps.timeSlowEndTime ? timeSlowMultiplier : 1.0;
        bossBullets.forEach((bullet, index) => {
            bullet.y += (bullet.vy !== undefined ? bullet.vy : bullet.speed) * slowMultiplierBossBullets * gameState.deltaTime;
            bullet.x += (bullet.vx || 0) * slowMultiplierBossBullets * gameState.deltaTime;
            
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
                        
                        if (scoreElement) scoreElement.textContent = gameState.score;
                        // Vérifier et mettre à jour le high score en temps réel
                        checkAndUpdateHighScore();
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
        // Le boss inflige des dégâts même avec le bouclier actif (c'est un boss puissant)
        if (boss && gameState.bossActive) {
            const dx = ship.x - boss.x;
            const dy = ship.y - boss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
            // Zone de collision légèrement augmentée pour une meilleure détection
            const collisionDistance = boss.size + shipSize;
            
            if (distance < collisionDistance) {
                // Le boss ignore l'invincibilité temporaire et le bouclier - il est trop puissant
                if (!ship.invincible) {
                    createEnhancedExplosion(ship.x, ship.y, ship.color, 40);
                    playSound('hit');
                    
                    // Le boss inflige des dégâts (perte d'une vie)
                    gameState.lives--;
                    if (livesElement) livesElement.textContent = gameState.lives;
                    updateHealthBars();
                    
                    if (gameState.lives <= 0) {
                        endGame();
                    } else {
                        // Invincibilité temporaire avec clignotement (2 secondes)
                        // Plus longue que pour les astéroïdes car le boss est plus dangereux
                        ship.invincible = true;
                        setTimeout(() => {
                            ship.invincible = false;
                        }, 2000);
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
                // Boss 1 : Mouvement horizontal simple (normalisé par delta time)
                boss.x += boss.speed * boss.direction * gameState.deltaTime;
                if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                    boss.direction *= -1;
                }
                break;
                
            case 'zigzag':
                // Boss 2 : Zigzag (normalisé par delta time)
                boss.x += boss.speed * boss.direction * gameState.deltaTime;
                boss.y = 100 + Math.sin(time * 2) * 30;
                if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                    boss.direction *= -1;
                }
                break;
                
            case 'circular':
                // Boss 3 : Mouvement circulaire (pas besoin de delta time, basé sur le temps)
                const radius = 100;
                boss.x = canvas.width / 2 + Math.cos(time) * radius;
                boss.y = 150 + Math.sin(time) * 50;
                break;
                
            case 'charge':
                // Boss 4 : Charge vers le joueur puis recule (normalisé par delta time)
                if (boss.patternPhase === 0) {
                    // Phase de charge
                    boss.targetX = ship.x;
                    const dx = boss.targetX - boss.x;
                    boss.x += Math.sign(dx) * boss.speed * 1.5 * gameState.deltaTime;
                    if (Math.abs(dx) < 10) {
                        boss.patternPhase = 1;
                        boss.patternTime = 0;
                    }
                } else {
                    // Phase de recul
                    boss.x += (canvas.width / 2 - boss.x) * 0.1 * gameState.deltaTime;
                    if (Math.abs(boss.x - canvas.width / 2) < 5) {
                        boss.patternPhase = 0;
                        boss.patternTime = 0;
                    }
                }
                break;
                
            case 'teleport':
                // Boss 5 : Téléportation aléatoire (pas besoin de delta time)
                if (boss.patternTime % 2000 < 16) {
                    boss.x = Math.random() * (canvas.width - boss.size * 2) + boss.size;
                    boss.y = 50 + Math.random() * 100;
                }
                break;
                
            case 'spiral':
                // Boss 6 : Spirale (pas besoin de delta time, basé sur le temps)
                const spiralRadius = 80 + Math.sin(time * 3) * 40;
                boss.x = canvas.width / 2 + Math.cos(time * 2) * spiralRadius;
                boss.y = 120 + Math.sin(time * 2) * 30;
                break;
                
            case 'aggressive':
                // Boss 7 : Suit le joueur agressivement (normalisé par delta time)
                const targetX = ship.x;
                const diffX = targetX - boss.x;
                boss.x += Math.sign(diffX) * Math.min(Math.abs(diffX) * 0.1, boss.speed) * gameState.deltaTime;
                boss.y = 80 + Math.sin(time * 3) * 20;
                break;
                
            case 'wave':
                // Boss 8 : Vagues horizontales (normalisé par delta time)
                boss.x += boss.speed * boss.direction * gameState.deltaTime;
                boss.y = 100 + Math.sin(time * 4) * 50;
                if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                    boss.direction *= -1;
                }
                break;
                
            case 'chaos':
                // Boss 9 : Mouvement chaotique (normalisé par delta time)
                boss.x += (Math.random() - 0.5) * boss.speed * 2 * gameState.deltaTime;
                boss.y += (Math.random() - 0.5) * 1 * gameState.deltaTime;
                boss.x = Math.max(boss.size, Math.min(canvas.width - boss.size, boss.x));
                boss.y = Math.max(50, Math.min(200, boss.y));
                break;
                
            case 'final':
                // Boss 10 : Pattern complexe combinant plusieurs mouvements (normalisé par delta time)
                const phase = Math.floor(time) % 4;
                if (phase === 0) {
                    // Spirale (pas besoin de delta time, basé sur le temps)
                    boss.x = canvas.width / 2 + Math.cos(time * 2) * 100;
                    boss.y = 120 + Math.sin(time * 2) * 40;
                } else if (phase === 1) {
                    // Charge (normalisé par delta time)
                    boss.targetX = ship.x;
                    const dx2 = boss.targetX - boss.x;
                    boss.x += Math.sign(dx2) * boss.speed * 1.2 * gameState.deltaTime;
                } else if (phase === 2) {
                    // Zigzag rapide (normalisé par delta time)
                    boss.x += boss.speed * boss.direction * 1.5 * gameState.deltaTime;
                    boss.y = 100 + Math.sin(time * 5) * 40;
                    if (boss.x <= boss.size || boss.x >= canvas.width - boss.size) {
                        boss.direction *= -1;
                    }
                } else {
                    // Téléportation (pas besoin de delta time)
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
    
    // Cadence effective : tous les bonus de tir se cumulent (fusion)
    function getEffectiveFireRate() {
        const now = Date.now();
        let rate = currentFireRate;
        // Prisme n'augmente plus la cadence : il ajoute 3 projectiles RGB par tir (dans shoot())
        if (activePowerUps.overdrive && now < activePowerUps.overdriveEndTime) rate *= 0.45;
        return rate;
    }
    
    function shoot() {
        gameStats.bulletsFired++;
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        const effectiveFireRate = getEffectiveFireRate();
        if (Date.now() - lastShotTime < effectiveFireRate) return;
        lastShotTime = Date.now();
        
        const bulletSize = activePowerUps.bigBullets ? 8 : 4;
        
        const bulletSpeed = 12;
        if (activePowerUps.tripleShot) {
            // Tir triple : 3 projectiles en éventail
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: bulletSpeed,
                vx: -0.8,
                vy: -bulletSpeed,
                size: bulletSize
            });
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: bulletSpeed,
                vx: 0,
                vy: -bulletSpeed,
                size: bulletSize
            });
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: bulletSpeed,
                vx: 0.8,
                vy: -bulletSpeed,
                size: bulletSize
            });
        } else {
            bullets.push({
                x: ship.x,
                y: ship.y - ship.height / 2,
                speed: bulletSpeed,
                size: bulletSize
            });
        }
        
        playSound('shoot');
    }
    
    // Contrôles
    let keys = {};
    let autoShootInterval = null;
    
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        
        // Raccourcis clavier pour le volume (désactivés si modifié manuellement)
        if (!volumeManuallyModified) {
            if (e.code === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const newVolume = Math.min(1, globalVolume + 0.1);
                setGlobalVolume(newVolume);
                return;
            }
            if (e.code === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const newVolume = Math.max(0, globalVolume - 0.1);
                setGlobalVolume(newVolume);
                return;
            }
            if (e.code === 'Equal' && (e.ctrlKey || e.metaKey) || e.code === 'NumpadAdd' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const newVolume = Math.min(1, globalVolume + 0.1);
                setGlobalVolume(newVolume);
                return;
            }
            if (e.code === 'Minus' && (e.ctrlKey || e.metaKey) || e.code === 'NumpadSubtract' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const newVolume = Math.max(0, globalVolume - 0.1);
                setGlobalVolume(newVolume);
                return;
            }
        }
        
        // Empêcher le défilement de la page avec les flèches haut/bas pendant le jeu
        if (gameState.isPlaying && !gameState.isPaused) {
            if ((e.code === 'ArrowUp' || e.code === 'ArrowDown') && !(e.ctrlKey || e.metaKey)) {
                e.preventDefault();
            }
            if (e.code === 'KeyF') {
                e.preventDefault();
                if (typeof window._spaceShooterRadioPause === 'function') window._spaceShooterRadioPause();
                if (!brolyAudio) {
                    brolyAudio = new Audio(BROLY_MUSIC_SRC);
                    brolyAudio.addEventListener('ended', () => {
                        brolyAudio.pause();
                        brolyAudio.currentTime = 0;
                    });
                }
                brolyAudio.pause();
                brolyAudio.currentTime = 0;
                brolyAudio.volume = 0.7 * globalVolume;
                brolyAudio.play().catch(e => console.warn('Broly audio:', e));
            }
            if (e.code === 'KeyG') {
                e.preventDefault();
                if (typeof window._spaceShooterRadioPause === 'function') window._spaceShooterRadioPause();
                if (!beerusAudio) {
                    beerusAudio = new Audio(BEERUS_MUSIC_SRC);
                    beerusAudio.addEventListener('ended', () => {
                        beerusAudio.pause();
                        beerusAudio.currentTime = 0;
                    });
                }
                beerusAudio.pause();
                beerusAudio.currentTime = 0;
                beerusAudio.volume = 0.7 * globalVolume;
                beerusAudio.play().catch(e => console.warn('Beerus audio:', e));
            }
        }
        
        if (e.code === 'Space') {
            // Vérifier si le formulaire d'enregistrement est ouvert
            const isRegisterFormOpen = scoreRegister && !scoreRegister.classList.contains('hidden');
            
            // Si le formulaire est ouvert ou qu'un enregistrement est en cours, ne pas démarrer le jeu
            if (isRegisterFormOpen || gameState.isSavingScore) {
                // Permettre seulement le tir si le jeu est déjà en cours
                if (gameState.isPlaying) {
                    e.preventDefault();
                    shoot();
                    // Démarrer le tir automatique
                    if (!autoShootInterval) {
                        const startAutoShoot = () => {
                            autoShootInterval = setInterval(() => {
                                if (gameState.isPlaying && !gameState.isPaused && keys['Space']) {
                                    shoot();
                                }
                            }, getEffectiveFireRate());
                        };
                        startAutoShoot();
                    }
                }
                // Sinon, empêcher le démarrage du jeu
                return;
            }
            
            e.preventDefault();
            if (gameState.isPlaying) {
                shoot();
                // Démarrer le tir automatique (cadence = fusion des bonus)
                if (!autoShootInterval) {
                    const startAutoShoot = () => {
                        autoShootInterval = setInterval(() => {
                            if (gameState.isPlaying && !gameState.isPaused && keys['Space']) {
                                shoot();
                            }
                        }, getEffectiveFireRate());
                    };
                    startAutoShoot();
                }
            } else if (startScreen && !startScreen.classList.contains('hidden') && !gameState.isSavingScore) {
                startGame();
            } else if (gameOver && !gameOver.classList.contains('hidden') && !gameState.isSavingScore) {
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
    
    // Mouvement du vaisseau (normalisé par delta time)
    function handleMovement() {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        const shipSize = activePowerUps.shrink && Date.now() < activePowerUps.shrinkEndTime ? ship.width / 2 * 0.6 : ship.width / 2;
        const shipHeight = ship.height / 2;
        
        // Mouvement horizontal (gauche/droite)
        if (keys['ArrowLeft'] || keys['KeyA']) {
            ship.x = Math.max(shipSize, ship.x - ship.speed * gameState.deltaTime);
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            ship.x = Math.min(canvas.width - shipSize, ship.x + ship.speed * gameState.deltaTime);
        }
        
        // Mouvement vertical (avancer/reculer) - vitesse légèrement réduite pour l'équilibre
        const verticalSpeed = ship.speed * 0.8; // 80% de la vitesse horizontale pour l'équilibre
        if (keys['ArrowUp'] || keys['KeyW']) {
            // Avancer (vers le haut) - limite à 20% du haut de l'écran
            const minY = canvas.height * 0.2;
            ship.y = Math.max(minY, ship.y - verticalSpeed * gameState.deltaTime);
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            // Reculer (vers le bas) - limite à 90% du bas de l'écran
            const maxY = canvas.height - 80;
            ship.y = Math.min(maxY, ship.y + verticalSpeed * gameState.deltaTime);
        }
    }
    
    // Système de delta time pour normaliser la vitesse (compatible Firefox)
    // Fallback pour performance.now() si non disponible
    const getTime = (function() {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now.bind(performance);
        } else {
            return Date.now;
        }
    })();
    
    let lastFrameTime = getTime();
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS; // Temps par frame à 60fps (16.67ms)
    
    // Boucle de jeu
    function gameLoop(currentTime) {
        // Firefox peut ne pas passer currentTime, utiliser getTime() comme fallback
        const now = currentTime || getTime();
        
        // Calcul du delta time normalisé (1.0 = 60fps, 2.0 = 30fps, 0.5 = 120fps)
        // Protection contre les valeurs invalides
        let deltaTime = 1.0;
        if (lastFrameTime && now && !isNaN(now) && !isNaN(lastFrameTime)) {
            const timeDiff = now - lastFrameTime;
            if (timeDiff > 0 && timeDiff < 1000) { // Protection contre les sauts anormaux
                deltaTime = timeDiff / frameTime;
            }
        }
        lastFrameTime = now;
        
        // Limiter le delta time pour éviter les sauts trop importants (cap à 2x la vitesse normale)
        // Sur mobile, limiter plus strictement pour éviter les lag
        const maxDelta = gameState.isMobile ? 1.5 : 2.0;
        const normalizedDelta = Math.min(Math.max(deltaTime, 0.1), maxDelta);
        
        // Stocker le delta normalisé globalement pour l'utiliser dans update()
        gameState.deltaTime = normalizedDelta;
        
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
    
    // Initialisation du contrôleur de volume
    function initVolumeControl() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumeMuteBtn = document.getElementById('volume-mute-btn');
        
        // Initialiser l'interface
        updateVolumeUI();
        
        if (volumeSlider) {
            // Mettre à jour le slider avec la valeur sauvegardée
            volumeSlider.value = globalVolume;
            
            // Événement pour le slider - marquer comme modifié manuellement
            volumeSlider.addEventListener('input', (e) => {
                volumeManuallyModified = true;
                localStorage.setItem('volumeManuallyModified', 'true');
                setGlobalVolume(parseFloat(e.target.value));
            });
            
            // Mettre à jour la barre de remplissage en temps réel
            volumeSlider.addEventListener('input', (e) => {
                const volumeSliderFill = document.getElementById('volume-slider-fill');
                if (volumeSliderFill) {
                    volumeSliderFill.style.width = (parseFloat(e.target.value) * 100) + '%';
                }
            });
            
            // Marquer comme modifié manuellement au changement (mouseup pour être sûr)
            volumeSlider.addEventListener('change', () => {
                volumeManuallyModified = true;
                localStorage.setItem('volumeManuallyModified', 'true');
            });
        }
        
        if (volumeMuteBtn) {
            volumeMuteBtn.addEventListener('click', () => {
                volumeManuallyModified = true;
                localStorage.setItem('volumeManuallyModified', 'true');
                toggleMute();
            });
        }
    }
    
    function startGame() {
        // Empêcher le démarrage si un score est en cours d'enregistrement
        if (gameState.isSavingScore) {
            console.log('⏸️ Démarrage du jeu bloqué : enregistrement de score en cours');
            return;
        }
        
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
        if (typeof window._spaceShooterRadioTryPlayOnGameStart === 'function') window._spaceShooterRadioTryPlayOnGameStart();
    }
    
    // Initialiser le contrôleur de volume au chargement
    initVolumeControl();
    
    function pauseGame() {
        gameState.isPaused = !gameState.isPaused;
        if (startBtn) startBtn.textContent = gameState.isPaused ? 'Reprendre' : 'Pause';
        if (!gameState.isPaused) {
            gameLoop();
        }
    }
    
    // Note de partie (grade) selon score, précision, vies, niveau
    function getGameGrade(score, accuracyNum, lives, level) {
        let rank = 0; // 0=D, 1=C, 2=B, 3=A, 4=S
        if (score >= 15000) rank = 4;
        else if (score >= 7000) rank = 3;
        else if (score >= 3000) rank = 2;
        else if (score >= 1000) rank = 1;
        if (accuracyNum >= 75 && rank < 4) rank++;
        if (accuracyNum < 35 && rank > 0) rank--;
        if (lives >= 2 && rank < 4) rank++;
        if (level >= 20 && rank < 4) rank++;
        return ['D', 'C', 'B', 'A', 'S'][Math.min(4, Math.max(0, rank))];
    }
    
    function endGame() {
        gameState.isPlaying = false;
        if (brolyAudio) {
            brolyAudio.pause();
            brolyAudio.currentTime = 0;
        }
        if (beerusAudio) {
            beerusAudio.pause();
            beerusAudio.currentTime = 0;
        }
        
        // Calculer les statistiques finales
        const accuracyNum = gameStats.bulletsFired > 0 ? (gameStats.bulletsHit / gameStats.bulletsFired) * 100 : 0;
        const accuracy = gameStats.bulletsFired > 0 ? accuracyNum.toFixed(1) : 0;
        const timeMinutes = Math.floor(gameStats.timePlayed / 60000);
        const timeSeconds = Math.floor((gameStats.timePlayed % 60000) / 1000);
        const timeFormatted = `${timeMinutes}m ${timeSeconds}s`;
        
        // Sauvegarde du meilleur score (vérification finale)
        // S'assurer que les valeurs sont des nombres
        const finalScoreValue = Number(gameState.score) || 0;
        const currentHighScore = Number(gameState.highScore) || 0;
        
        if (finalScoreValue > currentHighScore) {
            gameState.highScore = finalScoreValue;
            try {
                localStorage.setItem('spaceShooterHighScore', String(gameState.highScore));
                updateHighScore();
            } catch (e) {
                console.error('Erreur lors de la sauvegarde finale du high score:', e);
            }
        }
        
        if (finalScore) finalScore.textContent = gameState.score;
        if (finalLevel) finalLevel.textContent = gameState.level;
        
        const grade = getGameGrade(finalScoreValue, accuracyNum, gameState.lives, gameState.level);
        const finalGradeEl = document.getElementById('final-grade');
        if (finalGradeEl) {
            finalGradeEl.textContent = grade;
            finalGradeEl.className = 'final-grade-letter grade-' + grade;
        }
        
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
        if (brolyAudio) {
            brolyAudio.pause();
            brolyAudio.currentTime = 0;
        }
        if (beerusAudio) {
            beerusAudio.pause();
            beerusAudio.currentTime = 0;
        }
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
                // Activer le flag d'enregistrement pour bloquer le démarrage du jeu
                gameState.isSavingScore = true;
                
                // Désactiver le bouton pendant l'enregistrement
                const submitBtn = scoreRegisterForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enregistrement...';
                }
                
                // Désactiver les boutons de démarrage du jeu
                if (startBtn) startBtn.disabled = true;
                if (restartBtn) restartBtn.disabled = true;
                
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
                    // Réactiver les boutons et le flag après l'enregistrement
                    gameState.isSavingScore = false;
                    
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span class="btn-icon">💾</span> Enregistrer dans le Leaderboard';
                    }
                    
                    if (startBtn) startBtn.disabled = false;
                    if (restartBtn) restartBtn.disabled = false;
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
    
    // ----- Radio musique de fond (style rétro) — Stream, YouTube -----
    (function initRadioWidget() {
        const radioPlayBtn = document.getElementById('radio-play');
        const radioPlayIcon = document.getElementById('radio-play-icon');
        const radioSearch = document.getElementById('radio-search');
        const radioPresets = document.getElementById('radio-presets');
        const radioVolume = document.getElementById('radio-volume');
        const embedContainer = document.getElementById('radio-embed-container');
        if (!radioPlayBtn || !radioPresets) return;
        
        const bgMusic = new Audio();
        bgMusic.loop = true;
        let radioPlaying = false;
        let currentStation = null;
        let radioMode = 'stream'; // 'stream' | 'youtube'
        let ytPlayer = null;
        let ytReady = false;
        
        function getYouTubeVideoId(url) {
            if (!url || !/^https?:\/\//i.test(url)) return null;
            try {
                const u = new URL(url.trim());
                const host = u.hostname.replace(/^www\./, '');
                if (host === 'youtu.be') {
                    const id = (u.pathname.slice(1).split('/')[0] || '').split('?')[0].split('#')[0].trim();
                    return id.length >= 10 ? id : null;
                }
                if (host === 'youtube.com' || host === 'm.youtube.com') {
                    let id = u.searchParams.get('v');
                    if (id) {
                        id = id.split('?')[0].split('#')[0].trim();
                        return id.length >= 10 ? id : null;
                    }
                    const m = u.pathname.match(/^\/(?:embed|v)\/([a-zA-Z0-9_-]{10,})/);
                    return m ? m[1] : null;
                }
            } catch (_) {}
            return null;
        }
        
        function stopOtherMusics() {
            if (brolyAudio) { brolyAudio.pause(); brolyAudio.currentTime = 0; }
            if (beerusAudio) { beerusAudio.pause(); beerusAudio.currentTime = 0; }
        }
        
        function clearEmbed() {
            if (embedContainer) {
                embedContainer.classList.add('hidden');
                embedContainer.classList.remove('radio-embed-audio-only');
                embedContainer.innerHTML = '';
            }
            if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
                try { ytPlayer.stopVideo(); } catch (_) {}
                ytPlayer = null;
            }
        }
        
        function stopRadio() {
            bgMusic.pause();
            bgMusic.src = '';
            clearEmbed();
            radioPlaying = false;
            radioMode = 'stream';
            if (radioPlayIcon) radioPlayIcon.className = 'fas fa-play';
        }
        
        window._spaceShooterRadioPause = stopRadio;
        
        function playStream(url) {
            clearEmbed();
            radioMode = 'stream';
            bgMusic.src = url;
            bgMusic.volume = parseFloat(radioVolume?.value || 0.5);
            bgMusic.play().then(() => {
                radioPlaying = true;
                radioPlayIcon.className = 'fas fa-pause';
            }).catch(() => {
                radioPlaying = false;
                radioPlayIcon.className = 'fas fa-play';
            });
        }
        
        function playYouTube(videoId) {
            bgMusic.pause();
            bgMusic.src = '';
            radioMode = 'youtube';
            if (!embedContainer) return;
            embedContainer.innerHTML = '<div id="radio-yt-player" class="radio-yt-audio-only"></div>';
            embedContainer.classList.remove('hidden');
            embedContainer.classList.add('radio-embed-audio-only');
            
            function createPlayer() {
                if (!document.getElementById('radio-yt-player')) return;
                const vol = Math.round(parseFloat(radioVolume?.value || 0.5) * 100);
                ytPlayer = new window.YT.Player('radio-yt-player', {
                    height: 1,
                    width: 1,
                    videoId: videoId,
                    playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0 },
                    events: {
                        onReady: function(e) {
                            e.target.setVolume(vol);
                            e.target.playVideo();
                            radioPlaying = true;
                            if (radioPlayIcon) radioPlayIcon.className = 'fas fa-pause';
                        }
                    }
                });
            }
            if (window.YT && window.YT.Player) {
                createPlayer();
            } else {
                const prevReady = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = function() {
                    if (prevReady) prevReady();
                    createPlayer();
                };
                if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://www.youtube.com/iframe_api';
                    document.head.appendChild(script);
                }
            }
            radioPlaying = true;
            radioPlayIcon.className = 'fas fa-pause';
        }
        
        function playRadioSource(url) {
            url = (url || '').trim();
            bgMusic.pause();
            bgMusic.src = '';
            clearEmbed();
            if (!url) {
                currentStation = null;
                radioPlaying = false;
                radioPlayIcon.className = 'fas fa-play';
                return;
            }
            currentStation = url;
            offBtn.classList.remove('active');
            stopOtherMusics();
            const ytId = getYouTubeVideoId(url);
            if (ytId) {
                playYouTube(ytId);
            } else {
                playStream(url);
            }
        }
        
        window._spaceShooterRadioTryPlayOnGameStart = function() {
            const url = (currentStation || (radioSearch && radioSearch.value.trim()) || '').trim();
            if (url && /^https?:\/\//i.test(url)) {
                currentStation = url;
                playRadioSource(url);
            }
        };
        
        const offBtn = document.createElement('button');
        offBtn.type = 'button';
        offBtn.className = 'radio-preset-btn active';
        offBtn.textContent = 'Off';
        offBtn.addEventListener('click', () => {
            stopRadio();
            radioSearch.placeholder = 'URL YouTube ou stream MP3…';
            offBtn.classList.add('active');
        });
        radioPresets.appendChild(offBtn);
        
        radioPlayBtn.addEventListener('click', () => {
            if (radioPlaying) {
                stopRadio();
                return;
            }
            if (currentStation) {
                playRadioSource(currentStation);
            } else {
                const url = radioSearch.value.trim();
                if (url) {
                    currentStation = url;
                    playRadioSource(url);
                }
            }
        });
        
        radioSearch.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            const url = radioSearch.value.trim();
            if (!url) return;
            if (!/^https?:\/\//i.test(url)) {
                radioSearch.placeholder = 'Entre une URL complète (https://...)';
                return;
            }
            currentStation = url;
            document.querySelectorAll('.radio-preset-btn').forEach(b => b.classList.remove('active'));
            playRadioSource(url);
        });
        
        if (radioVolume) {
            radioVolume.addEventListener('input', () => {
                const v = parseFloat(radioVolume.value);
                if (radioMode === 'stream') bgMusic.volume = v;
                if (radioMode === 'youtube' && ytPlayer && typeof ytPlayer.setVolume === 'function') {
                    try { ytPlayer.setVolume(Math.round(v * 100)); } catch (_) {}
                }
            });
        }
        
        bgMusic.addEventListener('ended', () => {
            radioPlaying = false;
            radioPlayIcon.className = 'fas fa-play';
        });
        bgMusic.addEventListener('error', () => {
            radioPlaying = false;
            radioPlayIcon.className = 'fas fa-play';
        });
    })();
    
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

