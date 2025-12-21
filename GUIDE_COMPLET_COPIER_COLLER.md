# 📋 GUIDE COMPLET - Tout ce que vous devez copier-coller

## 🎯 Vue d'ensemble

Ce guide vous indique **exactement** quoi copier-coller et **où**, dans chaque logiciel/service.

---

## 1️⃣ FIREBASE CONSOLE - Règles de sécurité Firestore

### Où aller :
1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet **oscar-baer**
3. Dans le menu de gauche : **Firestore Database**
4. Cliquez sur l'onglet **Règles** (en haut)
5. Cliquez sur **Modifier** ou le bouton d'édition

### Ce qu'il faut copier-coller :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leaderboard - lecture publique, écriture libre
    match /leaderboard/{document=**} {
      // Tout le monde peut lire le leaderboard
      allow read: if true;
      
      // Tout le monde peut créer un score (sans validation stricte)
      // La validation est faite côté client, on fait confiance aux données
      allow create: if true;
      
      // Pas de modification ou suppression (sécurité)
      allow update, delete: if false;
    }
  }
}
```

### Étapes :
1. **Supprimez TOUT** le contenu actuel dans l'éditeur
2. **Copiez-collez** le code ci-dessus
3. Cliquez sur **Publier** (bouton en haut à droite)
4. Attendez le message de confirmation "Règles publiées"

### ✅ Vérification :
- Vous devriez voir un message vert "Règles publiées"
- Rechargez la page pour voir les nouvelles règles

---

## 2️⃣ CONSOLE NAVIGATEUR - Script d'initialisation Firebase

### Où aller :
1. Ouvrez votre site (en local ou sur Vercel)
2. Ouvrez la **Console du navigateur** :
   - **Chrome/Edge** : `F12` ou `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox** : `F12` ou `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - **Safari** : `Cmd+Option+C` (Mac)
3. Allez dans l'onglet **Console**

### Ce qu'il faut copier-coller :

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

// Attendre un peu puis initialiser
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

### Étapes :
1. **Copiez TOUT** le script ci-dessus (de `// Supprimer` jusqu'à `}, 200);`)
2. **Collez-le** dans la console du navigateur
3. Appuyez sur **Entrée**
4. Regardez les messages dans la console

### ✅ Vérification :
Vous devriez voir :
- `✅ Firebase initialisé avec succès !`
- `✅ window.firebaseDb: [object Object]`
- `✅ Connexion OK - Documents: X`

Si vous voyez des erreurs, passez à la section **Dépannage** ci-dessous.

---

## 3️⃣ VÉRIFICATION - Test du leaderboard

### Dans la console du navigateur :

Copiez-collez ceci pour tester :

```javascript
// Test 1 : Vérifier que Firebase est initialisé
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);

// Test 2 : Lire le leaderboard
window.firebaseDb.collection('leaderboard')
    .orderBy('score', 'desc')
    .limit(5)
    .get()
    .then(snapshot => {
        console.log('✅ Leaderboard lu avec succès !');
        console.log('Nombre de documents:', snapshot.size);
        snapshot.forEach(doc => {
            console.log('-', doc.data().name, ':', doc.data().score, 'points');
        });
    })
    .catch(error => {
        console.error('❌ Erreur lecture leaderboard:', error.code, error.message);
    });

// Test 3 : Écrire un score de test
window.firebaseDb.collection('leaderboard').add({
    name: 'Test Permissions',
    score: 999,
    level: 1,
    date: window.firebaseTimestamp.now()
})
.then(() => {
    console.log('✅ Score de test enregistré avec succès !');
})
.catch(error => {
    console.error('❌ Erreur écriture:', error.code, error.message);
});
```

### ✅ Résultats attendus :
- **Test 1** : Doit afficher des objets (pas `undefined`)
- **Test 2** : Doit afficher la liste des scores
- **Test 3** : Doit afficher "✅ Score de test enregistré"

---

## 4️⃣ DÉPANNAGE - Si ça ne marche pas

### Problème : `firebaseDb is undefined`

**Solution :** Le script d'initialisation n'a pas fonctionné. Réessayez :

```javascript
// Version ultra-simple
while (firebase.apps.length > 0) {
    firebase.apps[0].delete();
}

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
```

### Problème : `permission-denied`

**Solutions :**
1. **Vérifiez les règles Firebase** (section 1️⃣)
2. **Videz le cache du navigateur** :
   - Chrome : `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
   - Cochez "Images et fichiers en cache"
   - Cliquez sur "Effacer les données"
3. **Rechargez la page** avec `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)

### Problème : `Firebase App named '[DEFAULT]' already exists`

**Solution :** Utilisez le script de la section 2️⃣ qui supprime d'abord les instances existantes.

### Problème : `YOUR_PROJECT_ID`

**Solution :** 
1. Vérifiez que le `projectId` dans le script est bien `"oscar-baer"` (pas `"YOUR_PROJECT_ID"`)
2. Videz le cache du navigateur
3. Rechargez la page

---

## 5️⃣ RÉCAPITULATIF - Checklist

Avant de tester le leaderboard, vérifiez :

- [ ] **Firebase Console** : Les règles Firestore sont publiées (section 1️⃣)
- [ ] **Console navigateur** : Le script d'initialisation a été exécuté (section 2️⃣)
- [ ] **Vérification** : `window.firebaseDb` n'est pas `undefined` (section 3️⃣)
- [ ] **Test lecture** : Le leaderboard se lit sans erreur (section 3️⃣)
- [ ] **Test écriture** : Un score de test peut être enregistré (section 3️⃣)

---

## 6️⃣ ORDRE D'EXÉCUTION RECOMMANDÉ

1. **D'abord** : Configurez les règles Firebase (section 1️⃣)
2. **Ensuite** : Ouvrez votre site et la console du navigateur
3. **Puis** : Exécutez le script d'initialisation (section 2️⃣)
4. **Enfin** : Testez avec les scripts de vérification (section 3️⃣)

---

## 📞 BESOIN D'AIDE ?

Si après avoir suivi ce guide, ça ne fonctionne toujours pas :

1. **Copiez les messages d'erreur** de la console
2. **Vérifiez** que vous avez bien suivi toutes les étapes
3. **Vérifiez** que le `projectId` est bien `"oscar-baer"` partout

---

## 🔒 SÉCURITÉ

⚠️ **Important** : Les clés Firebase dans ce guide sont **publiques** et **sécurisées** pour un usage client-side. Elles sont conçues pour être exposées dans le code JavaScript. Ne les confondez pas avec les clés privées du Firebase Admin SDK (qui ne doivent JAMAIS être exposées).

---

**Dernière mise à jour** : 20 décembre 2025

