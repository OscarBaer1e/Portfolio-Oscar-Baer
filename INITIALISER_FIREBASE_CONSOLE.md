# 🔧 Initialiser Firebase dans la Console

## Erreur : `Cannot read properties of undefined (reading 'collection')`

Cette erreur signifie que `window.firebaseDb` est `undefined`. Firebase n'est pas initialisé.

## Solution : Copier-Coller dans la Console

Ouvrez la console (F12) et copiez-collez **EXACTEMENT** ceci :

```javascript
// Initialisation Firebase complète
(function() {
    const firebaseConfig = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };
    
    // Vérifier que Firebase est chargé
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK non chargé - Rechargez la page');
        return;
    }
    
    try {
        // Supprimer l'instance existante si elle existe
        if (firebase.apps.length > 0) {
            console.log('⚠️ Suppression de l\'instance Firebase existante...');
            firebase.app().delete();
        }
        
        // Initialiser Firebase
        console.log('🔄 Initialisation Firebase...');
        const app = firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        
        // Exposer pour les autres scripts
        window.firebaseApp = app;
        window.firebaseDb = db;
        window.firebaseTimestamp = firebase.firestore.Timestamp;
        window.firebaseInitialized = true;
        
        console.log('✅ Firebase initialisé avec succès !');
        console.log('✅ window.firebaseApp:', window.firebaseApp);
        console.log('✅ window.firebaseDb:', window.firebaseDb);
        console.log('✅ window.firebaseInitialized:', window.firebaseInitialized);
        
        // Tester la connexion
        console.log('🔍 Test de connexion...');
        db.collection('leaderboard').limit(1).get()
            .then(snapshot => {
                console.log('✅ Connexion OK - Documents trouvés:', snapshot.size);
                console.log('✅ Le leaderboard devrait maintenant fonctionner !');
            })
            .catch(error => {
                console.error('❌ Erreur de connexion:', error.code, error.message);
                if (error.code === 'permission-denied') {
                    console.error('🔒 Vérifiez les règles Firestore dans Firebase Console');
                }
            });
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        console.error('Stack:', error.stack);
    }
})();
```

## Vérification

Après avoir exécuté le script, testez :

```javascript
// Vérifier que Firebase est initialisé
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);

// Tester la lecture
window.firebaseDb.collection('leaderboard')
    .orderBy('score', 'desc')
    .limit(10)
    .get()
    .then(snapshot => {
        console.log('✅ LECTURE OK - Documents:', snapshot.size);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`  - ${data.name}: ${data.score} points`);
        });
    })
    .catch(error => {
        console.error('❌ ERREUR:', error.code, error.message);
    });
```

## Solution Permanente

Le code a été corrigé dans `basketball-game.html`. Après avoir rechargé la page, Firebase devrait s'initialiser automatiquement.

Si le problème persiste après rechargement :

1. **Videz le cache** : `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. **Testez en navigation privée**
3. **Utilisez** : `window.reinitFirebase()` dans la console

