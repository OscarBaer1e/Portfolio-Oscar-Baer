/**
 * ============================================
 * FIREBASE INTERCEPTOR - S'EXÉCUTE EN PREMIER
 * ============================================
 * 
 * Ce script s'exécute AVANT Firebase SDK pour intercepter et corriger
 * toute tentative d'initialisation avec YOUR_PROJECT_ID
 */

(function() {
    'use strict';
    
    console.log('🛡️ Firebase Interceptor chargé - Protection activée');
    
    // Configuration Firebase FORCÉE - À utiliser absolument
    const CORRECT_CONFIG = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };
    
    // Forcer window.FIREBASE_CONFIG AVANT tout
    window.FIREBASE_CONFIG = CORRECT_CONFIG;
    Object.freeze(window.FIREBASE_CONFIG);
    Object.defineProperty(window, 'FIREBASE_CONFIG', {
        value: CORRECT_CONFIG,
        writable: false,
        configurable: false
    });
    
    console.log('✅ Configuration Firebase FORCÉE:', {
        projectId: CORRECT_CONFIG.projectId,
        authDomain: CORRECT_CONFIG.authDomain
    });
    
    // Intercepter firebase.initializeApp si Firebase SDK est déjà chargé
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
        console.log('🔄 Interception de firebase.initializeApp...');
        
        const originalInitializeApp = firebase.initializeApp;
        
        firebase.initializeApp = function(config, name) {
            console.log('🔍 Interception: Tentative d\'initialisation Firebase détectée');
            console.log('   Config reçue:', config);
            
            // Vérifier et corriger le projectId
            if (!config || !config.projectId || 
                config.projectId === 'YOUR_PROJECT_ID' || 
                config.projectId === 'votre-projet-id' ||
                config.projectId !== 'oscar-baer') {
                console.warn('⚠️ projectId invalide détecté:', config?.projectId);
                console.warn('   Correction automatique...');
                
                // Remplacer par la bonne config
                config = {
                    ...config,
                    ...CORRECT_CONFIG
                };
                
                console.log('✅ Config corrigée:', config);
            }
            
            // Supprimer toutes les instances existantes
            if (firebase.apps && firebase.apps.length > 0) {
                console.log('🗑️ Suppression des instances existantes...');
                while (firebase.apps.length > 0) {
                    try {
                        firebase.apps[0].delete();
                    } catch (e) {
                        break;
                    }
                }
            }
            
            // Appeler la fonction originale avec la config corrigée
            return originalInitializeApp.call(this, config, name);
        };
        
        console.log('✅ Intercepteur installé');
    } else {
        // Firebase SDK pas encore chargé, on l'interceptera quand il sera chargé
        console.log('⏳ Firebase SDK pas encore chargé, intercepteur sera installé au chargement');
        
        // Surveiller l'apparition de firebase
        const checkFirebase = setInterval(() => {
            if (typeof firebase !== 'undefined' && firebase.initializeApp) {
                clearInterval(checkFirebase);
                
                console.log('🔄 Firebase SDK détecté, installation de l\'intercepteur...');
                
                const originalInitializeApp = firebase.initializeApp;
                
                firebase.initializeApp = function(config, name) {
                    console.log('🔍 Interception: Tentative d\'initialisation Firebase');
                    
                    // Vérifier et corriger
                    if (!config || !config.projectId || 
                        config.projectId === 'YOUR_PROJECT_ID' || 
                        config.projectId !== 'oscar-baer') {
                        console.warn('⚠️ Correction projectId:', config?.projectId, '→ oscar-baer');
                        config = { ...config, ...CORRECT_CONFIG };
                    }
                    
                    // Supprimer instances existantes
                    while (firebase.apps && firebase.apps.length > 0) {
                        try {
                            firebase.apps[0].delete();
                        } catch (e) {
                            break;
                        }
                    }
                    
                    return originalInitializeApp.call(this, config, name);
                };
                
                console.log('✅ Intercepteur installé');
            }
        }, 50);
        
        // Arrêter après 10 secondes
        setTimeout(() => {
            clearInterval(checkFirebase);
        }, 10000);
    }
    
    // Protéger window.FIREBASE_CONFIG contre les modifications
    let configCheckInterval = setInterval(() => {
        if (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId !== 'oscar-baer') {
            console.warn('⚠️ window.FIREBASE_CONFIG modifié ! Correction...');
            window.FIREBASE_CONFIG = CORRECT_CONFIG;
        }
    }, 100);
    
    // Arrêter après 30 secondes
    setTimeout(() => {
        clearInterval(configCheckInterval);
    }, 30000);
    
})();

