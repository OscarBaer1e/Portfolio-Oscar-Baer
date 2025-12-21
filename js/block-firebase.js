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
    
    // Bloquer le chargement de Firebase SDK
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute.bind(element);
            element.setAttribute = function(name, value) {
                if (name === 'src' && typeof value === 'string' && value.includes('firebase')) {
                    console.warn('🚫 Tentative de chargement Firebase bloquée:', value);
                    return; // Ne pas charger
                }
                return originalSetAttribute(name, value);
            };
        }
        
        return element;
    };
    
    // Supprimer toute instance Firebase existante
    if (typeof window.firebase !== 'undefined') {
        console.log('🗑️ Suppression des instances Firebase existantes...');
        try {
            if (window.firebase.apps) {
                while (window.firebase.apps.length > 0) {
                    try {
                        window.firebase.apps[0].delete();
                    } catch (e) {
                        break;
                    }
                }
            }
        } catch (e) {
            // Ignorer les erreurs
        }
        delete window.firebase;
    }
    
    // Supprimer les variables Firebase
    if (window.firebaseApp) {
        delete window.firebaseApp;
    }
    if (window.firebaseDb) {
        delete window.firebaseDb;
    }
    if (window.firebaseInitialized) {
        delete window.firebaseInitialized;
    }
    if (window.FIREBASE_CONFIG) {
        delete window.FIREBASE_CONFIG;
    }
    
    console.log('✅ Blocage Firebase terminé');
})();

