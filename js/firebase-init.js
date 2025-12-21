// Initialisation Firebase avec npm
// Ce fichier utilise les modules npm installés

import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';

// Configuration Firebase FORCÉE - projectId garanti
const firebaseConfig = {
    apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
    authDomain: "oscar-baer.firebaseapp.com",
    projectId: "oscar-baer", // FORCÉ : jamais YOUR_PROJECT_ID
    storageBucket: "oscar-baer.firebasestorage.app",
    messagingSenderId: "419618942184",
    appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};

// Vérification CRITIQUE avant initialisation
if (!firebaseConfig.projectId || 
    firebaseConfig.projectId === 'YOUR_PROJECT_ID' || 
    firebaseConfig.projectId === 'votre-projet-id' ||
    firebaseConfig.projectId !== 'oscar-baer') {
    console.error('❌ ERREUR CRITIQUE: projectId invalide!');
    console.error('projectId détecté:', firebaseConfig.projectId);
    firebaseConfig.projectId = 'oscar-baer';
    console.log('✅ projectId corrigé à:', firebaseConfig.projectId);
}

// Fonction d'initialisation Firebase
function initFirebaseNow() {
    try {
        // Vérifier si Firebase est déjà initialisé
        let app;
        const apps = getApps();
        if (apps.length > 0) {
            console.log('⚠️ Firebase déjà initialisé, utilisation de l\'instance existante');
            app = apps[0];
        } else {
            // Initialize Firebase
            app = initializeApp(firebaseConfig);
        }
        
        // Vérification IMMÉDIATE après initialisation
        const actualProjectId = app.options.projectId;
        console.log('🔍 Project ID après initialisation:', actualProjectId);
        
        if (actualProjectId !== 'oscar-baer') {
            console.error('❌ ERREUR CRITIQUE: Project ID incorrect!');
            console.error('Attendu: oscar-baer, Reçu:', actualProjectId);
            throw new Error('Project ID incorrect: ' + actualProjectId);
        }
        
        const db = getFirestore(app);
        
        // Exposer Firebase pour les autres scripts (compatibilité avec l'ancien code)
        window.firebaseApp = app;
        window.firebaseDb = db;
        window.firebaseTimestamp = Timestamp;
        window.firebaseInitialized = true;
        
        console.log('✅ Firebase initialisé avec succès (npm)');
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
        console.error('Stack:', error.stack);
        return false;
    }
}

// Initialiser Firebase
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebaseNow);
} else {
    // DOM déjà chargé
    initFirebaseNow();
}

// Exposer une fonction globale pour réinitialiser si nécessaire
window.reinitFirebase = function() {
    console.log('🔄 Réinitialisation Firebase...');
    try {
        const apps = getApps();
        // Supprimer toutes les instances existantes
        apps.forEach(app => {
            try {
                deleteApp(app);
            } catch (e) {
                // Ignorer les erreurs
            }
        });
    } catch (e) {
        // Ignorer les erreurs
    }
    return initFirebaseNow();
};

