/**
 * ============================================
 * BLOCAGE FIREBASE - Empêche tout chargement Firebase
 * ============================================
 * 
 * Ce script bloque toute tentative de chargement Firebase
 * pour éviter les erreurs dans la console
 */

(function() {
    'use strict';
    
    console.log('🛡️ Blocage Firebase activé');
    
    // Bloquer le chargement de Firebase SDK AVANT qu'il ne se charge
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute.bind(element);
            element.setAttribute = function(name, value) {
                if (name === 'src' && typeof value === 'string' && value.includes('firebase')) {
                    console.warn('🚫 Tentative de chargement Firebase bloquée:', value);
                    // Ne pas charger le script
                    return;
                }
                return originalSetAttribute(name, value);
            };
            
            // Intercepter aussi addEventListener pour les scripts dynamiques
            const originalAddEventListener = element.addEventListener.bind(element);
            element.addEventListener = function(type, listener, options) {
                if (type === 'load' && element.src && element.src.includes('firebase')) {
                    console.warn('🚫 Event listener Firebase bloqué');
                    return;
                }
                return originalAddEventListener(type, listener, options);
            };
        }
        
        return element;
    };
    
    // Supprimer toute instance Firebase existante IMMÉDIATEMENT
    function deleteFirebase() {
        try {
            if (typeof window.firebase !== 'undefined') {
                console.log('🗑️ Suppression des instances Firebase existantes...');
                if (window.firebase.apps) {
                    while (window.firebase.apps.length > 0) {
                        try {
                            window.firebase.apps[0].delete();
                        } catch (e) {
                            break;
                        }
                    }
                }
                delete window.firebase;
            }
        } catch (e) {
            // Ignorer
        }
        
        // Supprimer les variables Firebase
        delete window.firebaseApp;
        delete window.firebaseDb;
        delete window.firebaseInitialized;
        delete window.FIREBASE_CONFIG;
    }
    
    // Supprimer immédiatement
    deleteFirebase();
    
    // Supprimer périodiquement (au cas où Firebase se charge après)
    setInterval(deleteFirebase, 1000);
    
    // Supprimer quand Firebase essaie de s'initialiser
    Object.defineProperty(window, 'firebase', {
        set: function(value) {
            console.warn('🚫 Tentative d\'initialisation Firebase bloquée');
            deleteFirebase();
        },
        get: function() {
            return undefined;
        },
        configurable: true
    });
    
    console.log('✅ Blocage Firebase terminé');
})();

