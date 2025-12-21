# 🚨 RÉPARATION IMMÉDIATE - Copiez-collez ce script

## ⚠️ Si `window.FIREBASE_CONFIG` est `undefined`

Cela signifie que les scripts ne se chargent pas. Utilisez ce script de réparation :

## 📋 Script complet - Copiez-collez TOUT dans la console

```javascript
// ============================================
// RÉPARATION IMMÉDIATE - COPIEZ-COLLEZ TOUT
// ============================================

console.log('🔧 === RÉPARATION IMMÉDIATE ===');

// 1. Configuration Firebase
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

// 3. Supprimer TOUTES les instances Firebase
if (typeof firebase !== 'undefined' && firebase.apps) {
    console.log('🗑️ Suppression de toutes les instances...');
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

// 5. Fonction diagnosticFirebase
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

// 6. Fonction reinitFirebase
window.reinitFirebase = function() {
    console.log('🔄 Réinitialisation Firebase...');
    
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK non chargé');
        return false;
    }
    
    // Supprimer toutes les instances
    console.log('🗑️ Suppression des instances...');
    while (firebase.apps && firebase.apps.length > 0) {
        try {
            const app = firebase.apps[0];
            console.log('   Suppression:', app.name, 'projectId:', app.options?.projectId);
            app.delete();
        } catch (e) {
            break;
        }
    }
    
    // Réinitialiser window
    window.firebaseApp = undefined;
    window.firebaseDb = undefined;
    window.firebaseInitialized = false;
    
    // Attendre un peu
    setTimeout(() => {
        try {
            console.log('🚀 Initialisation avec config:', CORRECT_CONFIG);
            const app = firebase.initializeApp(CORRECT_CONFIG);
            
            // Vérification IMMÉDIATE
            const actualProjectId = app.options.projectId;
            console.log('🔍 Project ID après init:', actualProjectId);
            
            if (actualProjectId !== 'oscar-baer') {
                console.error('❌ ERREUR: Project ID incorrect !', actualProjectId);
                // Supprimer et réessayer
                app.delete();
                setTimeout(() => {
                    const app2 = firebase.initializeApp(CORRECT_CONFIG);
                    console.log('✅ Réessai - Project ID:', app2.options.projectId);
                    window.firebaseApp = app2;
                    window.firebaseDb = firebase.firestore();
                    window.firebaseTimestamp = firebase.firestore.Timestamp;
                    window.firebaseInitialized = true;
                }, 100);
                return;
            }
            
            window.firebaseApp = app;
            window.firebaseDb = firebase.firestore();
            window.firebaseTimestamp = firebase.firestore.Timestamp;
            window.firebaseInitialized = true;
            
            console.log('✅ Firebase réinitialisé !');
            console.log('✅ projectId:', app.options.projectId);
            console.log('✅ window.firebaseDb:', window.firebaseDb);
            
            // Test de connexion
            window.firebaseDb.collection('leaderboard').limit(1).get()
                .then(snapshot => {
                    console.log('✅ Connexion OK - Documents:', snapshot.size);
                    console.log('✅ Le leaderboard devrait maintenant fonctionner !');
                })
                .catch(error => {
                    console.error('❌ Erreur connexion:', error.code, error.message);
                    if (error.code === 'permission-denied') {
                        console.error('💡 Vérifiez les règles Firestore dans Firebase Console');
                    }
                });
        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
            console.error('Message:', error.message);
        }
    }, 300);
    
    return true;
};

console.log('✅ Fonctions créées');
console.log('💡 Utilisez maintenant:');
console.log('   - window.diagnosticFirebase()');
console.log('   - window.reinitFirebase()');

// 7. Si Firebase SDK est chargé, initialiser immédiatement
if (typeof firebase !== 'undefined') {
    console.log('🚀 Firebase SDK détecté, initialisation automatique...');
    window.reinitFirebase();
} else {
    console.log('⏳ Firebase SDK pas encore chargé');
    console.log('💡 Attendez quelques secondes puis exécutez: window.reinitFirebase()');
}

console.log('✅ === RÉPARATION TERMINÉE ===');
```

---

## 🚀 Utilisation

1. **Ouvrez la console** : `Cmd + Option + I` (Mac) ou `F12`
2. **Copiez-collez TOUT le script ci-dessus** (de `// ============================================` jusqu'à la fin)
3. **Appuyez sur Entrée**
4. **Attendez les messages de confirmation**

---

## ✅ Vérification après exécution

Après avoir exécuté le script, testez :

```javascript
// Vérifier
console.log('FIREBASE_CONFIG:', window.FIREBASE_CONFIG);
console.log('firebaseApp:', window.firebaseApp?.options?.projectId);

// Diagnostic
window.diagnosticFirebase();

// Si nécessaire, réinitialiser
window.reinitFirebase();
```

---

## 🎯 Résultat attendu

Vous devriez voir :
```
✅ window.FIREBASE_CONFIG défini: {projectId: "oscar-baer", ...}
✅ Firebase réinitialisé !
✅ projectId: oscar-baer
✅ Connexion OK - Documents: X
```

**Plus JAMAIS de `YOUR_PROJECT_ID` !**

---

**Dernière mise à jour** : 21 décembre 2025

