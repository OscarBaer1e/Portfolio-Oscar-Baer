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
    
    // Bloquer les imports dynamiques de Firebase
    const originalImport = window.import;
    if (window.import) {
        window.import = function(url) {
            if (typeof url === 'string' && url.includes('firebase')) {
                console.warn('🚫 Import Firebase bloqué:', url);
                return Promise.reject(new Error('Firebase bloqué'));
            }
            return originalImport(url);
        };
    }
    
    // Bloquer require() si disponible (Node.js style)
    if (typeof require !== 'undefined') {
        const originalRequire = require;
        window.require = function(module) {
            if (typeof module === 'string' && module.includes('firebase')) {
                console.warn('🚫 require() Firebase bloqué:', module);
                throw new Error('Firebase bloqué');
            }
            return originalRequire(module);
        };
    }
    
    // Intercepter les scripts qui se chargent
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT') {
                    // Vérifier src
                    if (node.src && node.src.includes('firebase')) {
                        console.warn('🚫 Script Firebase détecté et supprimé:', node.src);
                        node.remove();
                        deleteFirebase();
                        return;
                    }
                    // Vérifier le contenu inline
                    if (node.textContent && node.textContent.includes('firebase')) {
                        console.warn('🚫 Script inline Firebase détecté et supprimé');
                        node.remove();
                        deleteFirebase();
                        return;
                    }
                }
            });
        });
    });
    
    // Observer dès que possible
    if (document.head) {
        observer.observe(document.head, { childList: true, subtree: true });
    }
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Observer aussi le document lui-même
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // Intercepter aussi les appels à appendChild/insertBefore
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        if (child.tagName === 'SCRIPT' && child.src && child.src.includes('firebase')) {
            console.warn('🚫 appendChild Firebase bloqué:', child.src);
            deleteFirebase();
            return child; // Retourner l'élément mais ne pas l'ajouter
        }
        return originalAppendChild.call(this, child);
    };
    
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (newNode.tagName === 'SCRIPT' && newNode.src && newNode.src.includes('firebase')) {
            console.warn('🚫 insertBefore Firebase bloqué:', newNode.src);
            deleteFirebase();
            return newNode; // Retourner l'élément mais ne pas l'ajouter
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };
    
    console.log('✅ Blocage Firebase terminé');
})();

