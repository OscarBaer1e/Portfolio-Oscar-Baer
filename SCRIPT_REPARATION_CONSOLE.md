# 🔧 Script de réparation à copier-coller dans la console

## ⚠️ Si `window.FIREBASE_CONFIG` est `undefined`

Cela signifie que les scripts ne se chargent pas. Utilisez ce script de réparation :

## 📋 Script complet - Copiez-collez TOUT

```javascript
// ============================================
// SCRIPT DE RÉPARATION COMPLÈTE
// ============================================

console.log('🔧 Début de la réparation...');

// 1. Configuration Firebase FORCÉE
const CORRECT_CONFIG = {
    apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
    authDomain: "oscar-baer.firebaseapp.com",
    projectId: "oscar-baer",
    storageBucket: "oscar-baer.firebasestorage.app",
    messagingSenderId: "419618942184",
    appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};

// 2. Définir window.FIREBASE_CONFIG
window.FIREBASE_CONFIG = CORRECT_CONFIG;
Object.freeze(window.FIREBASE_CONFIG);
console.log('✅ window.FIREBASE_CONFIG défini:', window.FIREBASE_CONFIG);

// 3. Supprimer toutes les instances Firebase existantes
if (typeof firebase !== 'undefined' && firebase.apps) {
    console.log('🗑️ Suppression des instances existantes...');
    while (firebase.apps.length > 0) {
        try {
            const app = firebase.apps[0];
            console.log('   Suppression:', app.name, 'projectId:', app.options?.projectId);
            app.delete();
        } catch (e) {
            break;
        }
    }
}

// 4. Réinitialiser window
window.firebaseApp = undefined;
window.firebaseDb = undefined;
window.firebaseInitialized = false;

// 5. Fonction de diagnostic
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

// 6. Fonction de réinitialisation
window.reinitFirebase = function() {
    console.log('🔄 Réinitialisation Firebase...');
    
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK non chargé');
        console.error('💡 Vérifiez que les scripts Firebase se chargent dans l\'onglet Network');
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
            console.log('✅ projectId:', app.options.projectId);
            console.log('✅ window.firebaseDb:', window.firebaseDb);
            
            // Test de connexion
            window.firebaseDb.collection('leaderboard').limit(1).get()
                .then(s => console.log('✅ Connexion OK - Documents:', s.size))
                .catch(e => console.error('❌ Erreur connexion:', e.code, e.message));
        } catch (e) {
            console.error('❌ Erreur initialisation:', e);
        }
    }, 200);
    
    return true;
};

console.log('✅ Fonctions diagnosticFirebase() et reinitFirebase() créées');
console.log('💡 Maintenant vous pouvez utiliser:');
console.log('   - window.diagnosticFirebase()');
console.log('   - window.reinitFirebase()');

// 7. Si Firebase SDK est chargé, initialiser immédiatement
if (typeof firebase !== 'undefined') {
    console.log('🚀 Firebase SDK détecté, initialisation...');
    window.reinitFirebase();
} else {
    console.log('⏳ Firebase SDK pas encore chargé');
    console.log('💡 Attendez quelques secondes puis exécutez: window.reinitFirebase()');
}

console.log('✅ Réparation terminée !');
```

---

## 🚀 Utilisation

1. **Ouvrez la console** : `Cmd + Option + I` (Mac) ou `F12`
2. **Copiez-collez TOUT le script ci-dessus**
3. **Appuyez sur Entrée**
4. **Attendez les messages de confirmation**

---

## ✅ Vérification après exécution

Après avoir exécuté le script, testez :

```javascript
// Vérifier la configuration
console.log('FIREBASE_CONFIG:', window.FIREBASE_CONFIG);

// Diagnostic complet
window.diagnosticFirebase();

// Réinitialiser si nécessaire
window.reinitFirebase();
```

---

## 🐛 Si Firebase SDK n'est pas chargé

Si vous voyez "Firebase SDK non chargé", vérifiez :

1. **Onglet Network** dans les DevTools
2. Cherchez `firebase-app-compat.js` et `firebase-firestore-compat.js`
3. Vérifiez qu'ils se chargent (statut 200)
4. Si erreur 404 ou bloqué, il y a un problème de chargement

---

**Dernière mise à jour** : 21 décembre 2025

