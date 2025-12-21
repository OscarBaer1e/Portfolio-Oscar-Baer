/**
 * ============================================
 * FIREBASE INITIALISATION CENTRALISÉE
 * ============================================
 * 
 * Ce fichier initialise Firebase et expose toutes les fonctions nécessaires sur window
 * 
 * Expose sur window :
 * - window.firebaseApp : Instance Firebase App
 * - window.firebaseDb : Instance Firestore
 * - window.firebaseTimestamp : Timestamp Firestore
 * - window.firebaseInitialized : Boolean indiquant si Firebase est initialisé
 * - window.diagnosticFirebase() : Fonction de diagnostic
 * - window.reinitFirebase() : Fonction de réinitialisation
 */

(function() {
    'use strict';

    // Configuration Firebase FORCÉE - projectId garanti
    // IMPORTANT: Le nom du projet est "Leaderboard" mais l'ID du projet reste "oscar-baer"
    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer", // ID du projet (ne change pas même si le nom change)
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };

    // Vérification CRITIQUE avant initialisation
    if (!FIREBASE_CONFIG.projectId || 
        FIREBASE_CONFIG.projectId === 'YOUR_PROJECT_ID' || 
        FIREBASE_CONFIG.projectId === 'votre-projet-id' ||
        FIREBASE_CONFIG.projectId !== 'oscar-baer') {
        console.error('❌ ERREUR CRITIQUE: projectId invalide!');
        console.error('projectId détecté:', FIREBASE_CONFIG.projectId);
        FIREBASE_CONFIG.projectId = 'oscar-baer';
        console.log('✅ projectId corrigé à:', FIREBASE_CONFIG.projectId);
    }

    /**
     * Fonction d'initialisation Firebase
     * @returns {boolean} true si l'initialisation a réussi, false sinon
     */
    function initFirebaseNow() {
        // Vérifier que Firebase SDK est chargé
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK non chargé - Vérifiez que les scripts se chargent');
            return false;
        }

        try {
            // Supprimer TOUTES les instances existantes pour éviter les conflits
            console.log('🔄 Nettoyage FORCÉ de toutes les instances Firebase existantes...');
            let deletedCount = 0;
            while (firebase.apps.length > 0) {
                try {
                    const app = firebase.apps[0]; // Toujours prendre la première
                    const projectId = app.options?.projectId;
                    const appName = app.name;
                    console.log(`   Suppression instance: ${appName}, projectId: ${projectId}`);
                    
                    // Supprimer l'instance
                    app.delete();
                    deletedCount++;
                    
                    // Attendre un peu pour que la suppression soit effective
                    // (on ne peut pas utiliser await ici)
                } catch (e) {
                    console.warn('⚠️ Erreur lors de la suppression d\'une instance:', e);
                    // Forcer la suppression en vidant le tableau (si possible)
                    try {
                        if (firebase.apps.length > 0) {
                            // Essayer de supprimer toutes les instances d'un coup
                            const appsToDelete = Array.from(firebase.apps);
                            appsToDelete.forEach(app => {
                                try {
                                    app.delete();
                                } catch (err) {
                                    // Ignorer
                                }
                            });
                        }
                    } catch (err2) {
                        // Ignorer
                    }
                    break;
                }
            }
            console.log(`✅ ${deletedCount} instance(s) supprimée(s)`);
            
            // Attendre un peu pour que la suppression soit effective
            // (on utilise setTimeout car on ne peut pas utiliser await)
            if (deletedCount > 0) {
                console.log('⏳ Attente de la suppression effective...');
                // On va réessayer après un délai
                setTimeout(() => {
                    if (firebase.apps.length > 0) {
                        console.warn('⚠️ Des instances persistent encore, nouvelle tentative...');
                        while (firebase.apps.length > 0) {
                            try {
                                firebase.apps[0].delete();
                            } catch (e) {
                                break;
                            }
                        }
                    }
                }, 100);
            }
            
            // Attendre un peu pour que la suppression soit effective
            // (on ne peut pas utiliser await ici car ce n'est pas async)
            
            // Initialize Firebase
            const app = firebase.initializeApp(FIREBASE_CONFIG);
            
            // Vérification IMMÉDIATE après initialisation
            const actualProjectId = app.options.projectId;
            console.log('🔍 Project ID après initialisation:', actualProjectId);
            
            if (actualProjectId !== 'oscar-baer') {
                console.error('❌ ERREUR CRITIQUE: Project ID incorrect!');
                console.error('Attendu: oscar-baer, Reçu:', actualProjectId);
                throw new Error('Project ID incorrect: ' + actualProjectId);
            }
            
            const db = firebase.firestore();
            
            // Exposer Firebase pour les autres scripts
            window.firebaseApp = app;
            window.firebaseDb = db;
            window.firebaseTimestamp = firebase.firestore.Timestamp;
            window.firebaseInitialized = true;
            
            console.log('✅ Firebase initialisé avec succès (CDN v10.7.1)');
            console.log('✅ Project ID vérifié:', app.options.projectId);
            console.log('✅ Firestore accessible');
            console.log('✅ window.firebaseApp:', window.firebaseApp);
            console.log('✅ window.firebaseDb:', window.firebaseDb);
            console.log('✅ window.firebaseInitialized:', window.firebaseInitialized);
            
            // Vérification finale
            if (!window.firebaseApp || !window.firebaseDb) {
                throw new Error('Firebase exposé mais variables window non définies');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erreur initialisation Firebase:', error);
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
            
            // Réinitialiser les variables window en cas d'erreur
            window.firebaseApp = undefined;
            window.firebaseDb = undefined;
            window.firebaseTimestamp = undefined;
            window.firebaseInitialized = false;
            
            return false;
        }
    }

    /**
     * Essayer d'initialiser Firebase
     * @returns {boolean} true si l'initialisation a réussi, false sinon
     */
    function tryInitFirebase() {
        if (typeof firebase !== 'undefined') {
            const result = initFirebaseNow();
            if (result) {
                console.log('✅ Firebase initialisé avec succès');
            } else {
                console.error('❌ Échec de l\'initialisation Firebase');
            }
            return result;
        }
        return false;
    }

    /**
     * Fonction de diagnostic Firebase
     * Affiche l'état actuel de Firebase dans la console
     */
    window.diagnosticFirebase = function() {
        console.log('🔍 ============================================');
        console.log('🔍 DIAGNOSTIC FIREBASE');
        console.log('🔍 ============================================');
        
        // 1. Vérifier si Firebase SDK est chargé
        console.log('1. Firebase SDK chargé:', typeof firebase !== 'undefined');
        
        if (typeof firebase !== 'undefined') {
            // 2. Nombre d'instances Firebase
            console.log('2. Nombre d\'instances Firebase:', firebase.apps.length);
            
            // 3. Détails de chaque instance
            if (firebase.apps.length > 0) {
                console.log('3. Instances Firebase:');
                firebase.apps.forEach((app, index) => {
                    console.log(`   Instance ${index + 1}:`, {
                        name: app.name,
                        projectId: app.options?.projectId,
                        apiKey: app.options?.apiKey ? app.options.apiKey.substring(0, 10) + '...' : 'N/A',
                        authDomain: app.options?.authDomain || 'N/A'
                    });
                });
            } else {
                console.log('3. Aucune instance Firebase');
            }
        }
        
        // 4. Variables window
        console.log('4. Variables window:');
        console.log('   - window.firebaseApp:', window.firebaseApp);
        console.log('   - window.firebaseDb:', window.firebaseDb);
        console.log('   - window.firebaseTimestamp:', window.firebaseTimestamp);
        console.log('   - window.firebaseInitialized:', window.firebaseInitialized);
        
        // 5. Configuration
        console.log('5. Configuration:');
        console.log('   - window.FIREBASE_CONFIG:', window.FIREBASE_CONFIG);
        
        // 6. Test de connexion si Firebase est initialisé
        if (window.firebaseDb) {
            console.log('6. Test de connexion Firestore...');
            window.firebaseDb.collection('leaderboard').limit(1).get()
                .then(snapshot => {
                    console.log('   ✅ Connexion OK - Documents:', snapshot.size);
                })
                .catch(error => {
                    console.error('   ❌ Erreur connexion:', error.code, error.message);
                });
        } else {
            console.log('6. Firebase non initialisé - Test de connexion impossible');
        }
        
        console.log('============================================');
    };

    /**
     * Fonction de réinitialisation Firebase
     * Supprime toutes les instances et réinitialise Firebase
     * @returns {boolean} true si la réinitialisation a réussi, false sinon
     */
    window.reinitFirebase = function() {
        console.log('🔄 Réinitialisation Firebase...');
        
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK non chargé');
            return false;
        }
        
        try {
            // Supprimer toutes les instances existantes
            console.log('🗑️ Suppression des instances existantes...');
            while (firebase.apps.length > 0) {
                try {
                    const app = firebase.app();
                    console.log('   Suppression:', app.name, 'projectId:', app.options?.projectId);
                    app.delete();
                } catch (e) {
                    console.warn('   ⚠️ Erreur lors de la suppression:', e);
                    break;
                }
            }
            
            // Réinitialiser les variables window
            window.firebaseApp = undefined;
            window.firebaseDb = undefined;
            window.firebaseTimestamp = undefined;
            window.firebaseInitialized = false;
            
            // Attendre un peu pour que la suppression soit effective
            setTimeout(() => {
                const result = tryInitFirebase();
                if (result) {
                    console.log('✅ Firebase réinitialisé avec succès');
                } else {
                    console.error('❌ Échec de la réinitialisation Firebase');
                }
            }, 200);
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la réinitialisation:', error);
            return false;
        }
    };

    // Initialiser Firebase automatiquement
    // IMPORTANT: S'assurer que Firebase SDK est chargé AVANT d'initialiser
    function waitForFirebaseSDK() {
        if (typeof firebase !== 'undefined' && typeof firebase.initializeApp !== 'undefined') {
            // Firebase SDK est chargé, initialiser
            console.log('✅ Firebase SDK détecté, initialisation...');
            
            // Supprimer TOUTES les instances existantes AVANT d'initialiser
            if (firebase.apps && firebase.apps.length > 0) {
                console.log('🗑️ Suppression de toutes les instances existantes avant initialisation...');
                while (firebase.apps.length > 0) {
                    try {
                        const app = firebase.apps[0];
                        const projectId = app.options?.projectId;
                        console.log('   Suppression instance:', app.name, 'projectId:', projectId);
                        app.delete();
                    } catch (e) {
                        break;
                    }
                }
            }
            
            // Attendre un peu puis initialiser
            setTimeout(() => {
                if (tryInitFirebase()) {
                    console.log('✅ Firebase initialisé avec succès');
                } else {
                    console.error('❌ Échec de l\'initialisation Firebase');
                }
            }, 100);
        } else {
            // Firebase SDK pas encore chargé, réessayer
            console.log('⏳ Attente du chargement de Firebase SDK...');
            setTimeout(waitForFirebaseSDK, 100);
        }
    }
    
    // Démarrer l'attente
    waitForFirebaseSDK();

    // Exécuter un diagnostic automatique après 3 secondes si Firebase n'est pas initialisé
    setTimeout(() => {
        if (!window.firebaseInitialized || !window.firebaseDb) {
            console.warn('⚠️ Firebase non initialisé après 3 secondes');
            console.warn('💡 Utilisez window.diagnosticFirebase() pour diagnostiquer le problème');
            console.warn('💡 Utilisez window.reinitFirebase() pour réinitialiser');
        }
    }, 3000);

    console.log('✅ Module Firebase initialisation chargé');
    console.log('💡 Fonctions disponibles:');
    console.log('   - window.diagnosticFirebase() : Diagnostic complet');
    console.log('   - window.reinitFirebase() : Réinitialiser Firebase');
})();

