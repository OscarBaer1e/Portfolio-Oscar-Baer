# 🔧 Fix définitif : YOUR_PROJECT_ID

## 🐛 Problème

L'erreur `YOUR_PROJECT_ID` persiste malgré toutes les corrections. Cela signifie qu'une instance Firebase est initialisée avec une mauvaise configuration.

## ✅ Solution : Script de réparation dans la console

### Étape 1 : Ouvrir la console du navigateur

1. Ouvrez votre site (localement ou sur Vercel)
2. Appuyez sur **F12** pour ouvrir les DevTools
3. Allez dans l'onglet **Console**

### Étape 2 : Copier-coller ce script COMPLET

Copiez-collez **TOUT** ce script dans la console :

```javascript
// ============================================
// SCRIPT DE RÉPARATION DÉFINITIF
// ============================================

console.log('🔧 Début de la réparation...');

// 1. Supprimer TOUTES les instances Firebase
if (typeof firebase !== 'undefined' && firebase.apps) {
    console.log('🗑️ Suppression de toutes les instances Firebase...');
    while (firebase.apps.length > 0) {
        try {
            const app = firebase.apps[0];
            const projectId = app.options?.projectId;
            console.log('   Suppression:', app.name, 'projectId:', projectId);
            app.delete();
        } catch (e) {
            console.warn('   Erreur:', e);
            break;
        }
    }
}

// 2. Attendre un peu
await new Promise(resolve => setTimeout(resolve, 500));

// 3. Réinitialiser toutes les variables window
console.log('🔄 Réinitialisation des variables window...');
window.firebaseApp = undefined;
window.firebaseDb = undefined;
window.firebaseTimestamp = undefined;
window.firebaseInitialized = false;
window.FIREBASE_CONFIG = undefined;

// 4. Attendre un peu
await new Promise(resolve => setTimeout(resolve, 200));

// 5. Configuration Firebase FORCÉE
console.log('⚙️ Configuration Firebase...');
const firebaseConfig = {
    apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
    authDomain: "oscar-baer.firebaseapp.com",
    projectId: "oscar-baer", // FORCÉ
    storageBucket: "oscar-baer.firebasestorage.app",
    messagingSenderId: "419618942184",
    appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};

// 6. Vérification CRITIQUE
if (firebaseConfig.projectId !== 'oscar-baer') {
    console.error('❌ ERREUR: projectId incorrect!');
    firebaseConfig.projectId = 'oscar-baer';
}

// 7. Initialiser Firebase
console.log('🚀 Initialisation Firebase...');
const app = firebase.initializeApp(firebaseConfig);

// 8. Vérification IMMÉDIATE
const actualProjectId = app.options.projectId;
console.log('🔍 Project ID après initialisation:', actualProjectId);

if (actualProjectId !== 'oscar-baer') {
    console.error('❌ ERREUR CRITIQUE: Project ID incorrect!');
    console.error('Attendu: oscar-baer, Reçu:', actualProjectId);
    throw new Error('Project ID incorrect: ' + actualProjectId);
}

// 9. Créer Firestore
const db = firebase.firestore();

// 10. Exposer sur window
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseTimestamp = firebase.firestore.Timestamp;
window.firebaseInitialized = true;
window.FIREBASE_CONFIG = firebaseConfig;

console.log('✅ Firebase initialisé avec succès !');
console.log('✅ Project ID:', app.options.projectId);
console.log('✅ window.firebaseDb:', window.firebaseDb);

// 11. Test de connexion
console.log('🧪 Test de connexion...');
db.collection('leaderboard').limit(1).get()
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

console.log('✅ Réparation terminée !');
```

### Étape 3 : Vérifier

Après avoir exécuté le script, testez :

```javascript
// Vérifier le projectId
console.log('projectId:', window.firebaseApp?.options?.projectId);
// Doit afficher : "oscar-baer"

// Diagnostic complet
window.diagnosticFirebase();
```

---

## 🔄 Solution alternative : Version sans async/await

Si le script ci-dessus ne fonctionne pas (erreur avec `await`), utilisez celui-ci :

```javascript
// Version sans async/await
console.log('🔧 Début de la réparation...');

// Supprimer toutes les instances
if (typeof firebase !== 'undefined' && firebase.apps) {
    while (firebase.apps.length > 0) {
        firebase.apps[0].delete();
    }
}

// Réinitialiser window
window.firebaseApp = undefined;
window.firebaseDb = undefined;
window.firebaseInitialized = false;

// Attendre puis initialiser
setTimeout(() => {
    const app = firebase.initializeApp({
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    });
    
    window.firebaseApp = app;
    window.firebaseDb = firebase.firestore();
    window.firebaseTimestamp = firebase.firestore.Timestamp;
    window.firebaseInitialized = true;
    
    console.log('✅ Firebase initialisé !');
    console.log('projectId:', app.options.projectId);
    
    // Test
    window.firebaseDb.collection('leaderboard').limit(1).get()
        .then(s => console.log('✅ OK - Documents:', s.size))
        .catch(e => console.error('❌ Erreur:', e.code));
}, 500);
```

---

## 🚨 Si ça ne fonctionne toujours pas

### 1. Vider le cache

**Chrome/Edge** :
- `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
- Cochez "Images et fichiers en cache"
- Cliquez sur "Effacer les données"

**Firefox** :
- `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
- Cochez "Cache"
- Cliquez sur "Effacer maintenant"

### 2. Recharger la page

Après avoir vidé le cache, rechargez avec :
- `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)

### 3. Désactiver les bloqueurs

Désactivez temporairement :
- uBlock Origin
- AdBlock
- Privacy Badger
- Tout autre bloqueur de publicité

### 4. Vérifier les scripts

Ouvrez l'onglet **Network** dans les DevTools et vérifiez que :
- `firebase-app-compat.js` se charge (statut 200)
- `firebase-firestore-compat.js` se charge (statut 200)
- `firebase-init-centralized.js` se charge (statut 200)

---

## 🔍 Diagnostic

Utilisez cette commande pour diagnostiquer :

```javascript
window.diagnosticFirebase();
```

Cela affichera l'état complet de Firebase.

---

## ✅ Vérification finale

Après avoir exécuté le script de réparation, vous devriez voir :

```
✅ Firebase initialisé avec succès !
✅ Project ID: oscar-baer
✅ window.firebaseDb: [object Object]
✅ Connexion OK - Documents: X
```

Si vous voyez encore `YOUR_PROJECT_ID`, il y a probablement un cache ou un script externe qui interfère.

---

**Dernière mise à jour** : 21 décembre 2025

