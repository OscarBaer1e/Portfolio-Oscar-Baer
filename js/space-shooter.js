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
        rapidFireEndTime: 0,
        shieldEndTime: 0
    };
    
    // Étoiles de fond
    let stars = [];
    
    // Animations de fond rares
    let backgroundEvents = [];
    
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
    
    // Configuration Firebase - Utilise window.FIREBASE_CONFIG si disponible (depuis Vercel), sinon valeurs par défaut
    // IMPORTANT: Les valeurs par défaut sont garanties pour éviter YOUR_PROJECT_ID
    let FIREBASE_CONFIG = window.FIREBASE_CONFIG;
    
    // Si pas de config ou config invalide, utiliser les valeurs par défaut
    if (!FIREBASE_CONFIG || 
        !FIREBASE_CONFIG.projectId || 
        FIREBASE_CONFIG.projectId === 'YOUR_PROJECT_ID' ||
        FIREBASE_CONFIG.projectId === 'votre-projet-id' ||
        FIREBASE_CONFIG.apiKey === 'VOTRE_API_KEY') {
        console.log('📌 Utilisation des valeurs par défaut (config directe)');
        FIREBASE_CONFIG = {
            apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
            authDomain: "leaderboard.firebaseapp.com",
            projectId: "leaderboard",
            storageBucket: "leaderboard.firebasestorage.app",
            messagingSenderId: "419618942184",
            appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
        };
        // Mettre à jour window.FIREBASE_CONFIG pour les autres scripts
        window.FIREBASE_CONFIG = FIREBASE_CONFIG;
    }
    
    console.log('🔧 Configuration Firebase finale:', {
        projectId: FIREBASE_CONFIG.projectId,
        apiKey: FIREBASE_CONFIG.apiKey ? FIREBASE_CONFIG.apiKey.substring(0, 15) + '...' : 'manquant',
        authDomain: FIREBASE_CONFIG.authDomain
    });
    
    let db = null;
    let firebaseInitialized = false;
    let firebaseInitAttempted = false;
    
    function initFirebase() {
        // Utiliser Firebase initialisé dans le HTML (version compat)
        if (window.firebaseDb && window.firebaseInitialized) {
            db = window.firebaseDb;
            firebaseInitialized = true;
            console.log('✅ Firebase déjà initialisé');
            return db;
        }
        
        if (firebaseInitialized && db) return db;
        
        // Vérifier si Firebase est disponible via window
        if (window.firebaseApp && window.firebaseDb) {
            db = window.firebaseDb;
            firebaseInitialized = true;
            console.log('✅ Firebase accessible via window');
            return db;
        }
        
        // Attendre que Firebase soit initialisé
        if (!window.firebaseInitialized) {
            console.log('⏳ Attente de l\'initialisation Firebase...');
            // Réessayer après un court délai
            setTimeout(() => {
                if (window.firebaseDb) {
                    db = window.firebaseDb;
                    firebaseInitialized = true;
                    console.log('✅ Firebase initialisé après attente');
                } else {
                    console.warn('⚠️ Firebase non initialisé après attente');
                }
            }, 1000);
            return null;
        }
        
        return null;
    }
    
    let leaderboardSyncInterval = null;
    let leaderboardUnsubscribe = null;
    
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
    
    // Fonction pour ajuster le canvas en plein écran
    function adjustCanvasForFullscreen() {
        if (!canvas) return;
        
        if (isFullscreen) {
            // En plein écran, utiliser toute la taille disponible
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            canvas.width = width;
            canvas.height = height;
            
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
    
    // Charger le leaderboard depuis Firebase Firestore
    async function loadLeaderboard() {
        const firestoreDb = initFirebase();
        
        if (!firestoreDb) {
            console.warn('⚠️ Firebase non disponible, chargement depuis localStorage');
            console.warn('💡 Diagnostic: Vérifiez que window.firebaseDb existe');
            console.warn('💡 Voir: DIAGNOSTIC_LEADERBOARD.md');
        }
        
        if (firestoreDb) {
            try {
                console.log('📥 Chargement du leaderboard depuis Firebase...');
                console.log('🔍 firestoreDb:', firestoreDb);
                
                // Essayer avec orderBy, si ça échoue (index manquant), charger tout et trier
                let snapshot;
                try {
                    snapshot = await firestoreDb.collection('leaderboard')
                        .orderBy('score', 'desc')
                        .limit(MAX_LEADERBOARD_ENTRIES)
                        .get();
                } catch (orderByError) {
                    // Si l'index n'existe pas, charger tous les scores et trier côté client
                    if (orderByError.code === 'failed-precondition' || orderByError.message.includes('index')) {
                        console.warn('Index manquant, chargement de tous les scores et tri côté client...');
                        const allSnapshot = await firestoreDb.collection('leaderboard').get();
                        const allScores = [];
                        allSnapshot.forEach(doc => {
                            const data = doc.data();
                            allScores.push({
                                id: doc.id,
                                name: data.name,
                                score: data.score || 0,
                                level: data.level || 1,
                                date: data.date ? data.date.toDate().toISOString() : new Date().toISOString()
                            });
                        });
                        // Trier par score décroissant
                        allScores.sort((a, b) => b.score - a.score);
                        // Prendre les top 10
                        leaderboard = allScores.slice(0, MAX_LEADERBOARD_ENTRIES);
                        
                        if (leaderboard.length > 0) {
                            localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(leaderboard));
                        }
                        console.log(`Leaderboard chargé (sans index): ${leaderboard.length} scores`);
                        return;
                    } else {
                        throw orderByError;
                    }
                }
                
                leaderboard = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    leaderboard.push({
                        id: doc.id,
                        name: data.name,
                        score: data.score,
                        level: data.level,
                        date: data.date ? data.date.toDate().toISOString() : new Date().toISOString()
                    });
                });
                
                console.log(`Leaderboard chargé: ${leaderboard.length} scores`);
                
                if (leaderboard.length > 0) {
                    localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(leaderboard));
                }
                return;
            } catch (error) {
                console.error('❌ Erreur chargement leaderboard Firebase:', error);
                console.error('📊 Code erreur:', error.code);
                console.error('📝 Message:', error.message);
                
                // Messages d'aide selon le type d'erreur
                if (error.code === 'permission-denied') {
                    console.error('');
                    console.error('🔒 ============================================');
                    console.error('🔒 PERMISSION DENIED - Règles Firestore');
                    console.error('🔒 ============================================');
                    console.error('');
                    console.error('📋 SOLUTION IMMÉDIATE:');
                    console.error('   1. Allez sur: https://console.firebase.google.com/');
                    console.error('   2. Projet leaderboard → Firestore Database → Rules');
                    console.error('   3. Vérifiez que vous avez EXACTEMENT:');
                    console.error('      allow read: if true;');
                    console.error('      allow create: if true;');
                    console.error('   4. Cliquez sur "Publier"');
                    console.error('   5. Attendez 20 secondes');
                    console.error('');
                    console.error('📖 Guides disponibles:');
                    console.error('   - DIAGNOSTIC_LEADERBOARD.md');
                    console.error('   - COPIER_COLLER_REGLES.md');
                    console.error('   - REPARER_PERMISSIONS_FIRESTORE.md');
                    console.error('');
                } else if (error.code === 'unavailable') {
                    console.error('🌐 Firebase indisponible - Vérifiez votre connexion internet');
                } else if (error.code === 'not-found') {
                    console.error('📦 Collection non trouvée - Normal si c\'est le premier score');
                } else if (error.code === 'failed-precondition') {
                    console.error('📊 Index manquant - Le leaderboard fonctionnera sans index (tri côté client)');
                }
                // Fallback sur localStorage
            }
        } else {
            console.warn('⚠️ Firebase non disponible, chargement depuis localStorage');
            console.warn('💡 Diagnostic: Vérifiez que window.firebaseDb existe');
            console.warn('💡 Voir: DIAGNOSTIC_LEADERBOARD.md');
        }
        
        // Charger depuis localStorage (toujours disponible, même sans Firebase)
        const stored = localStorage.getItem('spaceShooterLeaderboard');
        if (stored) {
            try {
                leaderboard = JSON.parse(stored);
                leaderboard.sort((a, b) => b.score - a.score);
                // Limiter à MAX_LEADERBOARD_ENTRIES
                if (leaderboard.length > MAX_LEADERBOARD_ENTRIES) {
                    leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
                }
            } catch (e) {
                leaderboard = [];
            }
        } else {
            leaderboard = [];
        }
    }
    
    async function saveLeaderboard() {
        localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(leaderboard));
    }
    
    // Synchroniser le leaderboard en temps réel avec Firebase
    function startLeaderboardSync() {
        const firestoreDb = initFirebase();
        
        if (!firestoreDb) {
            // Fallback: synchronisation périodique si Firebase n'est pas disponible
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
            return;
        }
        
        // Utiliser Firestore en temps réel
        if (leaderboardUnsubscribe) {
            leaderboardUnsubscribe(); // Désabonner l'ancien listener
        }
        
        leaderboardUnsubscribe = firestoreDb.collection('leaderboard')
            .orderBy('score', 'desc')
            .limit(MAX_LEADERBOARD_ENTRIES)
            .onSnapshot((snapshot) => {
                leaderboard = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    leaderboard.push({
                        id: doc.id,
                        name: data.name,
                        score: data.score,
                        level: data.level,
                        date: data.date ? data.date.toDate().toISOString() : new Date().toISOString()
                    });
                });
                
                localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(leaderboard));
                
                if (leaderboardModal && !leaderboardModal.classList.contains('hidden')) {
                    updateLeaderboardDisplay();
                }
            }, (error) => {
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
            });
    }
    
    function stopLeaderboardSync() {
        if (leaderboardUnsubscribe) {
            leaderboardUnsubscribe();
            leaderboardUnsubscribe = null;
        }
        if (leaderboardSyncInterval) {
            clearInterval(leaderboardSyncInterval);
            leaderboardSyncInterval = null;
        }
    }
    
    function canRegisterScore(score) {
        // Validation locale : vérifier si le score peut entrer dans le top 10
        // Pas de validation Firebase nécessaire
        if (!leaderboard || leaderboard.length === 0) return true;
        
        // Si le leaderboard n'est pas plein, on peut toujours enregistrer
        if (leaderboard.length < MAX_LEADERBOARD_ENTRIES) return true;
        
        // Si le leaderboard est plein, vérifier si le score dépasse le dernier du top 10
        const lastScore = leaderboard[leaderboard.length - 1].score;
        return score > lastScore;
    }
    
    async function registerScore(name, score, level) {
        // Vérification locale : le score doit dépasser le dernier du top 10
        // Pas de validation Firebase nécessaire - tout le monde peut créer un score
        // si la condition est remplie
        
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
        
        // Enregistrer dans Firebase en arrière-plan (sans bloquer)
        const firestoreDb = initFirebase();
        if (firestoreDb) {
            try {
                console.log('Tentative d\'enregistrement dans Firebase...');
                console.log('Données à enregistrer:', { name: name.substring(0, 20), score, level });
                
                // Utiliser Timestamp.now() de Firebase
                const timestamp = window.firebaseTimestamp ? window.firebaseTimestamp.now() : new Date();
                console.log('Timestamp créé:', timestamp);
                
                const dataToSave = {
                    name: name.substring(0, 20),
                    score: Number(score), // S'assurer que c'est un nombre
                    level: Number(level), // S'assurer que c'est un nombre
                    date: timestamp
                };
                
                console.log('Données formatées:', dataToSave);
                
                const docRef = await firestoreDb.collection('leaderboard').add(dataToSave);
                console.log('✅ Score enregistré dans Firebase avec ID:', docRef.id);
                
                // Recharger depuis Firebase pour synchroniser avec les autres joueurs
                setTimeout(() => {
                    loadLeaderboard().catch((err) => {
                        console.warn('Erreur rechargement leaderboard:', err);
                    });
                }, 1000);
            } catch (error) {
                console.error('❌ Erreur enregistrement Firebase:', error);
                console.error('Code erreur:', error.code);
                console.error('Message:', error.message);
                console.error('Stack:', error.stack);
                
                // Afficher un message à l'utilisateur
                if (error.code === 'permission-denied') {
                    console.error('🔒 PERMISSION DENIED - Les règles Firestore bloquent l\'écriture');
                    console.error('📋 Solution: Vérifiez les règles dans Firebase Console:');
                    console.error('   1. Allez dans Firestore Database → Rules');
                    console.error('   2. Assurez-vous d\'avoir: allow create: if true;');
                    console.error('   3. Cliquez sur "Publier" et attendez 10-20 secondes');
                    console.error('   4. Voir le guide: REPARER_PERMISSIONS_FIRESTORE.md');
                    
                    // Afficher une alerte à l'utilisateur
                    alert('❌ Erreur de permissions Firestore\n\n' +
                          'Votre score a été enregistré localement mais n\'a pas pu être sauvegardé en ligne.\n\n' +
                          'Vérifiez les règles Firestore dans Firebase Console.\n' +
                          'Voir: REPARER_PERMISSIONS_FIRESTORE.md');
                } else if (error.code === 'unavailable') {
                    console.error('🌐 Firebase indisponible - Vérifiez votre connexion');
                } else if (error.code === 'not-found') {
                    console.error('📦 Collection non trouvée - Normal si c\'est le premier score');
                }
                
                // Ne pas bloquer si Firebase échoue, le score est déjà enregistré localement
            }
        } else {
            console.warn('⚠️ Firebase non disponible, score enregistré uniquement en local');
            console.warn('Vérifiez que Firebase est bien initialisé');
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
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';
            
            const placeClasses = ['first-place', 'second-place', 'third-place', 'regular-place'];
            entryDiv.classList.add(placeClasses[Math.min(index, 3)]);
            
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            const date = new Date(entry.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            entryDiv.innerHTML = `
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-score">${entry.score.toLocaleString()}</div>
                <div class="leaderboard-level">Niveau ${entry.level}</div>
                <div class="leaderboard-date">${date}</div>
            `;
            leaderboardList.appendChild(entryDiv);
        });
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
        if (!leaderboardModal) return;
        await loadLeaderboard();
        updateLeaderboardDisplay();
        leaderboardModal.classList.remove('hidden');
        startLeaderboardSync();
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
            rapidFireEndTime: 0,
            shieldEndTime: 0
        };
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
        
        // Boosts
        powerUps.forEach(powerUp => {
            drawPowerUp(powerUp);
        });
        
        // Bouclier actif
        if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
            drawShield();
        }
        
        // Particules
        particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.shadowBlur = particle.size * 2;
            ctx.shadowColor = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        });
        
        // Animations de fond rares
        backgroundEvents.forEach(event => {
            drawBackgroundEvent(event);
        });
        
        // Boss
        if (boss && gameState.bossActive) {
            drawBoss();
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
        if (!boss || !gameState.bossActive) return;
        
        ctx.save();
        ctx.translate(boss.x, boss.y);
        
        // Image du boss si disponible
        if (boss.image && boss.image.complete && boss.image.naturalWidth > 0) {
            const size = boss.size * 2;
            ctx.drawImage(boss.image, -size / 2, -size / 2, size, size);
        } else {
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
        }
        
        ctx.restore();
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
        if (!gameState.isPlaying || gameState.isPaused) return;
        
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
        
        // Mise à jour des événements de fond
        backgroundEvents.forEach((event, index) => {
            if (event.type === 'rocket') {
                event.y -= event.speed;
            } else if (event.type === 'shootingStar') {
                event.x += event.speed * 0.5;
                event.y += event.speed;
            }
            event.life--;
            event.alpha = Math.max(0, event.alpha - 0.01);
            
            if (event.life <= 0 || event.y < -50 || event.y > canvas.height + 50 || event.x > canvas.width + 50) {
                backgroundEvents.splice(index, 1);
            }
        });
        
        // Mise à jour du boss
        updateBoss();
        
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
        
        // Mise à jour des boosts
        powerUps.forEach((powerUp, index) => {
            powerUp.y += powerUp.speed;
            powerUp.rotation += 0.05;
            
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
            showMessage('Tir rapide terminé', 'powerup');
        }
        if (activePowerUps.shield && now > activePowerUps.shieldEndTime) {
            activePowerUps.shield = false;
            showMessage('Bouclier terminé', 'powerup');
        }
        
        // Collision projectiles/astéroïdes
        bullets.forEach((bullet, bulletIndex) => {
            asteroids.forEach((asteroid, asteroidIndex) => {
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < asteroid.size + 5) {
                    // Explosion améliorée
                    createEnhancedExplosion(asteroid.x, asteroid.y, asteroid.color, asteroid.size);
                    playSound('explosion');
                    
                    // Score
                    gameState.score += Math.floor(asteroid.size / 5) * 10;
                    if (scoreElement) scoreElement.textContent = gameState.score;
                    
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
                    
                    // Chance de faire apparaître un boost (5% pour vitesse de tir, 3% pour bouclier, 1% pour vie)
                    const boostChance = Math.random();
                    if (boostChance < 0.05) {
                        spawnPowerUp(asteroid.x, asteroid.y, 'rapidFire');
                    } else if (boostChance < 0.08) {
                        spawnPowerUp(asteroid.x, asteroid.y, 'shield');
                    } else if (boostChance < 0.09) {
                        spawnPowerUp(asteroid.x, asteroid.y, 'life');
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
            
            if (distance < asteroid.size + ship.width / 2) {
                // Si le bouclier est actif, l'astéroïde est détruit sans perdre de vie
                if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
                    createEnhancedExplosion(asteroid.x, asteroid.y, asteroid.color, asteroid.size);
                    playSound('hit');
                    asteroids.splice(index, 1);
                    showMessage('Bouclier actif !', 'powerup');
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
                    // Invincibilité temporaire
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
    
    // Explosion améliorée avec plus de particules et effets
    function createEnhancedExplosion(x, y, color, size) {
        const particleCount = Math.floor(size / 2) + 20; // Plus de particules pour les gros astéroïdes
        
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
        
        // Ajoute des particules plus petites pour l'effet de fumée
        for (let i = 0; i < particleCount / 2; i++) {
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
    }
    
    // Fait apparaître un boost
    function spawnPowerUp(x, y, type) {
        powerUps.push({
            x: x,
            y: y,
            type: type,
            speed: 2,
            rotation: 0,
            color: type === 'rapidFire' ? '#ffff00' : type === 'shield' ? '#00ffff' : '#ff00ff'
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
            showMessage('⚡ Tir Rapide Activé !', 'powerup');
        } else if (powerUp.type === 'shield') {
            activePowerUps.shield = true;
            activePowerUps.shieldEndTime = now + 8000; // 8 secondes
            showMessage('🛡️ Bouclier Activé !', 'powerup');
        } else if (powerUp.type === 'life') {
            if (gameState.lives < 5) { // Maximum 5 vies
                gameState.lives++;
                gameState.maxLives = Math.max(gameState.maxLives, gameState.lives);
                if (livesElement) livesElement.textContent = gameState.lives;
                showMessage('❤️ Vie Bonus !', 'powerup');
            } else {
                showMessage('Vies au maximum !', 'powerup');
            }
        }
        
        // Effet visuel de collecte
        createExplosion(powerUp.x, powerUp.y, powerUp.color);
        updateHealthBars();
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
    
    // Marque les astéroïdes comme "gros" (pour la séparation)
    function isLargeAsteroid(asteroid) {
        return asteroid.size > 25;
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
            gameState.gameSpeed += 0.3;
            if (levelElement) levelElement.textContent = gameState.level;
            if (currentLevelDisplay) currentLevelDisplay.textContent = gameState.level;
                showMessage(`Niveau ${gameState.level} !`, 'level');
            }
            // Pas de boss en mode infini
            return;
        }
        
        // Mode normal : boss tous les 10 niveaux
        const newLevel = Math.floor(gameState.score / 500) + 1;
        if (newLevel > gameState.level) {
            gameState.level = newLevel;
            gameState.gameSpeed += 0.5;
            if (levelElement) levelElement.textContent = gameState.level;
            if (currentLevelDisplay) currentLevelDisplay.textContent = gameState.level;
            
            // Effet visuel
            showMessage(`Niveau ${gameState.level} !`, 'level');
            
            // Vérifier si un boss doit apparaître (tous les 10 niveaux)
            if (gameState.level % 10 === 0 && !gameState.bossActive && !boss) {
                spawnBoss();
            }
        }
    }
    
    // Crée un boss
    function spawnBoss() {
        const bossNumber = Math.min(10, Math.floor(gameState.level / 10));
        const baseHealth = 30 + (bossNumber * 15); // Réduit : était 50 + (bossNumber * 30)
        const baseSize = 60 + (bossNumber * 10);
        
        // Initialiser les propriétés spécifiques au pattern du boss
        let patternConfig = getBossPattern(bossNumber);
        
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
            lastShot: Date.now(),
            shootInterval: patternConfig.shootInterval,
            image: null,
            pattern: bossNumber,
            patternTime: 0, // Temps écoulé pour le pattern
            patternPhase: 0, // Phase actuelle du pattern
            vy: 0, // Vitesse verticale pour certains patterns
            targetX: canvas.width / 2, // Position cible pour certains patterns
            targetY: 100
        };
        
        // Charger l'image du boss si disponible
        if (bossPhotos[bossNumber]) {
            boss.image = bossPhotos[bossNumber];
        }
        
        gameState.bossActive = true;
        playSound('bossSpawn');
        showMessage(`BOSS ${bossNumber} !`, 'boss');
        updateHealthBars();
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
        
        const now = Date.now();
        boss.patternTime += 16; // ~60fps
        
        // Appliquer le pattern de mouvement selon le numéro du boss
        updateBossMovement();
        
        // Tir du boss
        if (now - boss.lastShot > boss.shootInterval) {
            bossShoot();
            boss.lastShot = now;
        }
        
        // Mise à jour des projectiles du boss
        bossBullets.forEach((bullet, index) => {
            bullet.y += (bullet.vy !== undefined ? bullet.vy : bullet.speed);
            bullet.x += bullet.vx;
            
            // Supprimer si hors écran
            if (bullet.y > canvas.height + 20 || bullet.y < -20 || bullet.x < -20 || bullet.x > canvas.width + 20) {
                bossBullets.splice(index, 1);
            }
        });
        
        // Collision projectiles du joueur / boss
        bullets.forEach((bullet, bulletIndex) => {
            const dx = bullet.x - boss.x;
            const dy = bullet.y - boss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < boss.size + 5) {
                boss.health--;
                playSound('bossHit');
                bullets.splice(bulletIndex, 1);
                updateHealthBars();
                
                // Le boss rétrécit quand il prend des dégâts
                const healthPercent = boss.health / boss.maxHealth;
                boss.size = boss.maxSize * (0.5 + healthPercent * 0.5); // Entre 50% et 100% de la taille
                
                if (boss.health <= 0) {
                    // Boss vaincu
                    createEnhancedExplosion(boss.x, boss.y, boss.color, boss.size);
                    playSound('victory');
                    gameState.score += boss.bossNumber * 1000;
                    if (scoreElement) scoreElement.textContent = gameState.score;
                    showMessage(`BOSS ${boss.bossNumber} VAINCU ! +${boss.bossNumber * 1000} points`, 'victory');
                    
                    boss = null;
                    gameState.bossActive = false;
                    bossBullets = [];
                    updateHealthBars();
                    
                    // Vérifier le niveau maintenant que le boss est vaincu
                    checkLevel();
                    
                    // Si on atteint le niveau 100, victoire finale
                    if (gameState.level >= 100) {
                        setTimeout(() => {
                            showMessage('VICTOIRE FINALE ! Vous avez vaincu tous les boss !', 'victory');
                            playSound('victory');
                        }, 2000);
                    }
                }
            }
        });
        
        // Collision vaisseau / projectiles du boss
        bossBullets.forEach((bullet, index) => {
            const dx = ship.x - bullet.x;
            const dy = ship.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bullet.size + ship.width / 2) {
                if (activePowerUps.shield && Date.now() < activePowerUps.shieldEndTime) {
                    playSound('hit');
                    bossBullets.splice(index, 1);
                    showMessage('Bouclier actif !', 'powerup');
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
                        ship.invincible = true;
                        setTimeout(() => {
                            ship.invincible = false;
                        }, 2000);
                    }
                }
            }
        });
        
        // Collision vaisseau / boss
        const dx = ship.x - boss.x;
        const dy = ship.y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < boss.size + ship.width / 2) {
            if (!ship.invincible) {
                createEnhancedExplosion(ship.x, ship.y, ship.color, 30);
                playSound('hit');
                
                gameState.lives--;
                if (livesElement) livesElement.textContent = gameState.lives;
                updateHealthBars();
                
                if (gameState.lives <= 0) {
                    endGame();
                } else {
                    ship.invincible = true;
                    setTimeout(() => {
                        ship.invincible = false;
                    }, 2000);
                }
            }
        }
    }
    
    // Met à jour le mouvement du boss selon son pattern
    function updateBossMovement() {
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
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        // Vérifie le cooldown de tir
        const now = Date.now();
        if (now - lastShotTime < currentFireRate) {
            return;
        }
        
        lastShotTime = now;
        
        bullets.push({
            x: ship.x,
            y: ship.y - ship.height / 2,
            speed: 8
        });
        
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
            } else if (!startScreen.classList.contains('hidden')) {
                startGame();
            } else if (!gameOver.classList.contains('hidden')) {
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
        
        if (finalScore) finalScore.textContent = gameState.score;
        if (finalLevel) finalLevel.textContent = gameState.level;
        
        // Message humoristique si le score est inférieur à 500
        if (scoreMessage) {
            if (gameState.score < 500) {
                scoreMessage.textContent = '😅 Tu es nul ! Moins de 500 points, vraiment ?';
                scoreMessage.style.color = '#ff6b6b';
                scoreMessage.style.fontWeight = 'bold';
                scoreMessage.style.fontSize = '1.2em';
                scoreMessage.style.marginTop = '15px';
            } else {
                scoreMessage.textContent = '';
                scoreMessage.style.color = '';
                scoreMessage.style.fontWeight = '';
                scoreMessage.style.fontSize = '';
                scoreMessage.style.marginTop = '';
            }
        }
        
        gameOver.classList.remove('hidden');
        startBtn.textContent = 'Commencer';
        
        // Vérifier si le score peut être enregistré dans le leaderboard
        // Utilisation du leaderboard local (pas besoin de recharger depuis Firebase)
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
        gameOver.classList.add('hidden');
        startScreen.classList.remove('hidden');
        startBtn.textContent = 'Commencer';
        if (registerScoreBtn) registerScoreBtn.classList.add('hidden');
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
        showLeaderboardBtn.addEventListener('click', showLeaderboard);
    }
    if (closeLeaderboardBtn) {
        closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
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
            // Utilisation du leaderboard local (pas besoin de recharger depuis Firebase)
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
    // Attendre que Firebase soit chargé avant d'initialiser
    function waitForFirebase(callback, maxAttempts = 30) {
        let attempts = 0;
        const checkFirebase = () => {
            // Vérifier si Firebase est initialisé via window (npm ou CDN)
            if (window.firebaseInitialized && window.firebaseDb) {
                callback();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkFirebase, 100);
            } else {
                // Firebase n'est pas disponible, continuer avec localStorage
                console.warn('⚠️ Firebase non initialisé après', maxAttempts, 'tentatives, utilisation de localStorage');
                callback();
            }
        };
        checkFirebase();
    }
    
    waitForFirebase(() => {
        loadLeaderboard();
        init();
        draw();
    });
});

