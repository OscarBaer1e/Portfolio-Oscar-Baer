# 🔧 Script de Diagnostic Firebase - Console

## 🐛 Problème : `YOUR_PROJECT_ID` persiste

Si vous voyez encore `YOUR_PROJECT_ID` dans les erreurs, copiez-collez ce script dans la console :

## 📋 Script complet de diagnostic et réparation

```javascript
// === SCRIPT DE DIAGNOSTIC ET RÉPARATION FIREBASE ===

console.log('🔍 === DIAGNOSTIC FIREBASE ===');

// 1. Vérifier l'état actuel
console.log('1. firebase SDK chargé:', typeof firebase !== 'undefined');
if (typeof firebase !== 'undefined') {
    console.log('2. Nombre d\'instances:', firebase.apps.length);
    firebase.apps.forEach((app, index) => {
        console.log(`   Instance ${index}:`, {
            name: app.name,
            projectId: app.options?.projectId,
            apiKey: app.options?.apiKey?.substring(0, 10) + '...'
        });
    });
}
console.log('3. window.firebaseApp:', window.firebaseApp);
console.log('4. window.firebaseDb:', window.firebaseDb);
console.log('5. window.firebaseInitialized:', window.firebaseInitialized);
console.log('6. window.FIREBASE_CONFIG:', window.FIREBASE_CONFIG);

// 2. Supprimer TOUTES les instances Firebase
console.log('\n🗑️ Suppression de toutes les instances Firebase...');
if (typeof firebase !== 'undefined') {
    while (firebase.apps.length > 0) {
        try {
            const app = firebase.app();
            const projectId = app.options?.projectId;
            console.log(`   Suppression: ${app.name} (projectId: ${projectId})`);
            app.delete();
        } catch (e) {
            console.warn('   Erreur:', e);
            break;
        }
    }
}

// 3. Attendre un peu
await new Promise(resolve => setTimeout(resolve, 200));

// 4. Réinitialiser avec la bonne configuration
console.log('\n🔄 Réinitialisation Firebase avec la bonne config...');
const firebaseConfig = {
    apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
    authDomain: "oscar-baer.firebaseapp.com",
    projectId: "oscar-baer",
    storageBucket: "oscar-baer.firebasestorage.app",
    messagingSenderId: "419618942184",
    appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};

try {
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    
    window.firebaseApp = app;
    window.firebaseDb = db;
    window.firebaseTimestamp = firebase.firestore.Timestamp;
    window.firebaseInitialized = true;
    
    console.log('✅ Firebase initialisé !');
    console.log('✅ Project ID:', app.options.projectId);
    console.log('✅ window.firebaseDb:', window.firebaseDb);
    
    // 5. Test de connexion
    console.log('\n🧪 Test de connexion...');
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
} catch (error) {
    console.error('❌ Erreur initialisation:', error.message);
}

console.log('\n========================');
```

## 🚀 Version simplifiée (sans async/await)

Si le script ci-dessus ne fonctionne pas (erreur avec `await`), utilisez celui-ci :

```javascript
// Version simple sans async/await
console.log('🔍 Diagnostic Firebase...');

// Supprimer toutes les instances
if (typeof firebase !== 'undefined') {
    while (firebase.apps.length > 0) {
        firebase.apps[0].delete();
    }
}

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
    console.log('firebaseDb:', window.firebaseDb);
    
    // Test
    window.firebaseDb.collection('leaderboard').limit(1).get()
        .then(s => console.log('✅ OK - Documents:', s.size))
        .catch(e => console.error('❌ Erreur:', e.code));
}, 200);
```

## 🔍 Vérification après exécution

Après avoir exécuté le script, testez :

```javascript
// Vérifier que tout est OK
console.log('firebaseDb:', window.firebaseDb);
console.log('projectId:', window.firebaseApp?.options?.projectId);

// Doit afficher "oscar-baer" et un objet pour firebaseDb
```

## ⚠️ Si ça ne fonctionne toujours pas

1. **Videz le cache** : `Ctrl+Shift+Delete` → Cochez "Cache" → Effacer
2. **Rechargez** : `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)
3. **Désactivez les bloqueurs** : uBlock, AdBlock, etc.
4. **Testez en navigation privée** : Sans extensions

---

**Dernière mise à jour** : 21 décembre 2025

