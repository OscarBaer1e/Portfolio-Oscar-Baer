# 🔧 Solution Immédiate - Firebase Non Initialisé

## Problème Identifié

Firebase SDK est chargé (`typeof firebase === 'object'`), mais l'initialisation n'a pas été exécutée :
- `window.firebaseApp` = `undefined`
- `window.firebaseDb` = `undefined`
- `window.firebaseInitialized` = `undefined`

## Solution Immédiate (Dans la Console)

Ouvrez la console (F12) et copiez-collez **EXACTEMENT** ceci :

```javascript
// Initialisation Firebase manuelle
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
    console.error('❌ Firebase SDK non chargé');
} else {
    try {
        // Supprimer l'instance existante si elle existe
        if (firebase.apps.length > 0) {
            firebase.app().delete();
        }
        
        // Initialiser Firebase
        const app = firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        
        // Exposer pour les autres scripts
        window.firebaseApp = app;
        window.firebaseDb = db;
        window.firebaseTimestamp = firebase.firestore.Timestamp;
        window.firebaseInitialized = true;
        
        console.log('✅ Firebase initialisé manuellement');
        console.log('✅ window.firebaseApp:', window.firebaseApp);
        console.log('✅ window.firebaseDb:', window.firebaseDb);
        
        // Tester la connexion
        db.collection('leaderboard').limit(1).get()
            .then(snapshot => {
                console.log('✅ Test connexion OK - Documents:', snapshot.size);
            })
            .catch(error => {
                console.error('❌ Erreur test:', error.code, error.message);
            });
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
    }
}
```

## Solution Permanente

Le code a été corrigé dans `basketball-game.html`. Après avoir rechargé la page, Firebase devrait s'initialiser automatiquement.

Si le problème persiste après rechargement :

1. **Videz le cache du navigateur** :
   - Chrome/Edge : `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Cochez "Images et fichiers en cache"
   - Cliquez sur "Effacer les données"

2. **Testez en navigation privée** :
   - Ouvrez une fenêtre de navigation privée
   - Allez sur votre jeu
   - Vérifiez si Firebase s'initialise

3. **Utilisez la fonction de réinitialisation** :
   - Dans la console, tapez : `window.reinitFirebase()`
   - Cela forcera la réinitialisation de Firebase

## Vérification

Après avoir exécuté la solution immédiate, testez à nouveau :

```javascript
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);
```

Tous devraient maintenant avoir des valeurs (pas `undefined`).


