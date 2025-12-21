/**
 * ============================================
 * FIREBASE SETUP INLINE - S'EXÉCUTE IMMÉDIATEMENT
 * ============================================
 * 
 * Ce script est INLINE dans le HTML pour garantir qu'il s'exécute
 * AVANT tout autre script et force la bonne configuration
 */

(function() {
    'use strict';
    
    console.log('🛡️ Firebase Setup Inline - Démarrage');
    
    // Configuration Firebase FORCÉE
    const CORRECT_CONFIG = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };
    
    // FORCER window.FIREBASE_CONFIG
    window.FIREBASE_CONFIG = CORRECT_CONFIG;
    Object.freeze(window.FIREBASE_CONFIG);
    Object.defineProperty(window, 'FIREBASE_CONFIG', {
        value: CORRECT_CONFIG,
        writable: false,
        configurable: false
    });
    
    console.log('✅ window.FIREBASE_CONFIG défini:', window.FIREBASE_CONFIG);
    
    // Fonction de diagnostic simple (toujours disponible)
    window.diagnosticFirebase = function() {
        console.log('🔍 === DIAGNOSTIC FIREBASE ===');
        console.log('1. window.FIREBASE_CONFIG:', window.FIREBASE_CONFIG);
        console.log('2. firebase SDK chargé:', typeof firebase !== 'undefined');
        if (typeof firebase !== 'undefined') {
            console.log('3. Nombre d\'instances:', firebase.apps?.length || 0);
            if (firebase.apps && firebase.apps.length > 0) {
                firebase.apps.forEach((app, i) => {
                    console.log(`   Instance ${i + 1}:`, {
                        name: app.name,
                        projectId: app.options?.projectId
                    });
                });
            }
        }
        console.log('4. window.firebaseApp:', window.firebaseApp);
        console.log('5. window.firebaseDb:', window.firebaseDb);
        console.log('6. window.firebaseInitialized:', window.firebaseInitialized);
        console.log('========================');
    };
    
    // Fonction de réinitialisation simple
    window.reinitFirebase = function() {
        console.log('🔄 Réinitialisation Firebase...');
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK non chargé');
            return false;
        }
        
        // Supprimer toutes les instances
        while (firebase.apps && firebase.apps.length > 0) {
            try {
                firebase.apps[0].delete();
            } catch (e) {
                break;
            }
        }
        
        // Réinitialiser window
        window.firebaseApp = undefined;
        window.firebaseDb = undefined;
        window.firebaseInitialized = false;
        
        // Initialiser avec la bonne config
        setTimeout(() => {
            try {
                const app = firebase.initializeApp(CORRECT_CONFIG);
                window.firebaseApp = app;
                window.firebaseDb = firebase.firestore();
                window.firebaseTimestamp = firebase.firestore.Timestamp;
                window.firebaseInitialized = true;
                console.log('✅ Firebase réinitialisé !');
                console.log('projectId:', app.options.projectId);
            } catch (e) {
                console.error('❌ Erreur:', e);
            }
        }, 200);
        
        return true;
    };
    
    console.log('✅ Fonctions diagnosticFirebase() et reinitFirebase() disponibles');
    console.log('✅ Setup inline terminé');
})();

