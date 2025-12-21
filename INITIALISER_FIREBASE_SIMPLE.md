# 🔧 Initialiser Firebase - Version Simple (Sans Async)

## Erreur : `Firebase App named '[DEFAULT]' already exists`

Firebase est déjà initialisé avec une autre configuration. Il faut le supprimer d'abord.

## Solution : Script Simple

Copiez-collez **EXACTEMENT** ceci dans la console :

```javascript
// Supprimer toutes les instances Firebase existantes
if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    console.log('🔄 Suppression des instances Firebase existantes...');
    firebase.apps.forEach(app => {
        try {
            app.delete();
            console.log('  ✓ Supprimé:', app.name);
        } catch (e) {
            console.warn('  ⚠ Erreur:', e);
        }
    });
}

// Attendre un peu
setTimeout(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };
    
    try {
        console.log('🔄 Initialisation Firebase...');
        const app = firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        
        window.firebaseApp = app;
        window.firebaseDb = db;
        window.firebaseTimestamp = firebase.firestore.Timestamp;
        window.firebaseInitialized = true;
        
        console.log('✅ Firebase initialisé avec succès !');
        console.log('✅ window.firebaseDb:', window.firebaseDb);
        
        // Test automatique
        db.collection('leaderboard').limit(1).get()
            .then(s => {
                console.log('✅ Connexion OK - Documents:', s.size);
                console.log('✅ Le leaderboard devrait maintenant fonctionner !');
            })
            .catch(e => {
                console.error('❌ Erreur connexion:', e.code, e.message);
            });
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}, 200);
```

## Alternative : Version Encore Plus Simple

Si le script ci-dessus ne fonctionne pas, utilisez celui-ci (supprime et réinitialise immédiatement) :

```javascript
// Version ultra-simple
try {
    // Supprimer toutes les instances
    if (firebase && firebase.apps) {
        while (firebase.apps.length > 0) {
            firebase.apps[0].delete();
        }
    }
    
    // Initialiser
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
    console.log('firebaseDb:', window.firebaseDb);
} catch (e) {
    console.error('❌ Erreur:', e.message);
    // Si erreur, réessayer après 500ms
    setTimeout(() => {
        const app = firebase.app();
        window.firebaseApp = app;
        window.firebaseDb = firebase.firestore();
        window.firebaseTimestamp = firebase.firestore.Timestamp;
        window.firebaseInitialized = true;
        console.log('✅ Firebase récupéré depuis instance existante');
    }, 500);
}
```

## Vérification

Après avoir exécuté le script, testez :

```javascript
console.log('firebaseDb:', window.firebaseDb);
window.firebaseDb.collection('leaderboard').limit(1).get()
    .then(s => console.log('✅ OK - Documents:', s.size))
    .catch(e => console.error('❌ Erreur:', e.code));
```

