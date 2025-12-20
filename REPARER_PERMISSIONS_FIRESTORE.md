# Réparer les permissions Firestore

## 🔴 Problème : Les permissions ne marchent pas

Si vous obtenez des erreurs `Permission denied` ou si vous ne pouvez pas lire/écrire dans Firestore, suivez ces étapes :

## ✅ Solution étape par étape

### 1. Vérifier que Firestore est activé

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **oscar-baer**
3. Cliquez sur **Firestore Database** dans le menu de gauche
4. Si vous voyez un message "Créer une base de données" :
   - Cliquez dessus
   - Choisissez **"Démarrer en mode test"**
   - Sélectionnez une région (ex: `europe-west`)
   - Cliquez sur **Activer**
5. Attendez que la base de données soit créée (quelques secondes)

### 2. Copier les règles EXACTES dans Firebase Console

1. Dans Firebase Console, allez dans **Firestore Database** → **Rules** (Règles)
2. **SUPPRIMEZ TOUT** ce qui est actuellement dans l'éditeur
3. **COLLEZ EXACTEMENT** ceci (sans modification) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

4. Cliquez sur **Publier** (Publish)
5. **ATTENDEZ 10-20 secondes** pour que les règles se propagent

### 3. Vérifier qu'il n'y a pas d'erreurs de syntaxe

Après avoir publié, vérifiez :
- ✅ Pas de message d'erreur rouge en haut
- ✅ Le bouton "Publier" est grisé (règles déjà publiées)
- ✅ Un message de confirmation apparaît

### 4. Vérifier le mode de la base de données

1. Dans Firebase Console, allez dans **Firestore Database**
2. Regardez en haut de la page
3. Si vous voyez **"Mode production"** :
   - C'est normal, les règles s'appliquent quand même
4. Si vous voyez **"Mode test"** :
   - C'est aussi OK, les règles s'appliquent

### 5. Tester les permissions dans la console du navigateur

Ouvrez votre jeu dans le navigateur (F12 pour la console) et testez :

```javascript
// 1. Vérifier que Firebase est initialisé
console.log('Firebase:', typeof firebase);
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);

// 2. Tester la lecture
if (window.firebaseDb) {
  window.firebaseDb.collection('leaderboard')
    .limit(1)
    .get()
    .then((snapshot) => {
      console.log('✅ Lecture OK - Documents trouvés:', snapshot.size);
    })
    .catch((error) => {
      console.error('❌ Erreur lecture:', error.code, error.message);
    });
}

// 3. Tester l'écriture
if (window.firebaseDb) {
  window.firebaseDb.collection('leaderboard')
    .add({
      name: 'Test',
      score: 999,
      level: 1,
      date: firebase.firestore.Timestamp.now()
    })
    .then(() => {
      console.log('✅ Écriture OK');
    })
    .catch((error) => {
      console.error('❌ Erreur écriture:', error.code, error.message);
    });
}
```

### 6. Erreurs courantes et solutions

#### Erreur : "Permission denied"
**Cause** : Les règles ne sont pas publiées ou sont incorrectes
**Solution** : Revoir l'étape 2, vérifier qu'il n'y a pas d'erreur de syntaxe

#### Erreur : "Missing or insufficient permissions"
**Cause** : Les règles bloquent l'accès
**Solution** : Vérifier que `allow read: if true;` et `allow create: if true;` sont bien présents

#### Erreur : "Collection not found"
**Cause** : La collection n'existe pas encore (normal, elle sera créée au premier ajout)
**Solution** : Pas de problème, essayez d'ajouter un score

#### Erreur : "Project not found" ou "YOUR_PROJECT_ID"
**Cause** : Mauvaise configuration Firebase
**Solution** : Vérifier que `projectId: "oscar-baer"` est correct dans `basketball-game.html`

### 7. Vérifier les règles dans Firebase Console

Après avoir publié, vérifiez que les règles sont bien sauvegardées :

1. Dans Firebase Console → Firestore Database → Rules
2. Vous devriez voir exactement :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

3. Si c'est différent, **remplacez tout** et republiez

### 8. Vider le cache du navigateur

Parfois, le navigateur cache les anciennes règles :

1. **Chrome/Edge** : `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. Cochez **"Images et fichiers en cache"**
3. Cliquez sur **Effacer les données**
4. Rechargez la page (F5)

### 9. Tester en navigation privée

Pour éviter les problèmes de cache :

1. Ouvrez une fenêtre de navigation privée
2. Allez sur votre jeu
3. Testez le leaderboard
4. Si ça marche en navigation privée → problème de cache

### 10. Vérifier les logs Firebase

1. Dans Firebase Console, allez dans **Firestore Database** → **Usage** (Utilisation)
2. Regardez les statistiques :
   - Si vous voyez des **lectures** → les règles de lecture fonctionnent
   - Si vous voyez des **écritures** → les règles d'écriture fonctionnent
   - Si vous voyez **0** partout → les règles bloquent tout

## 📋 Checklist complète

Avant de dire que ça ne marche pas, vérifiez :

- [ ] Firestore Database est **créé et activé**
- [ ] Les règles sont **exactement** celles du fichier `FIREBASE_RULES.txt`
- [ ] Les règles sont **publiées** (bouton "Publier" cliqué)
- [ ] **10-20 secondes** se sont écoulées après la publication
- [ ] Pas d'erreur de syntaxe dans les règles
- [ ] Le `projectId` dans le code est **"oscar-baer"** (pas YOUR_PROJECT_ID)
- [ ] Cache navigateur vidé
- [ ] Testé en navigation privée
- [ ] Console navigateur vérifiée (pas d'erreur Firebase)

## 🆘 Si rien ne fonctionne

1. **Vérifiez les logs dans Firebase Console** :
   - Firestore Database → Usage
   - Regardez s'il y a des tentatives d'accès

2. **Vérifiez les logs dans la console du navigateur** :
   - Ouvrez F12 → Console
   - Regardez les messages Firebase
   - Copiez toutes les erreurs

3. **Testez avec un nouveau document** :
   - Dans Firebase Console → Firestore Database → Data
   - Cliquez sur "Ajouter une collection"
   - Nom : `test`
   - Ajoutez un document avec un champ `test: "value"`
   - Si ça marche → le problème vient des règles spécifiques à `leaderboard`

4. **Contactez-moi avec** :
   - Les erreurs de la console
   - Une capture d'écran des règles dans Firebase Console
   - Le résultat du test dans la console (étape 5)

## 🔧 Règles alternatives (si les règles simples ne marchent pas)

Si `allow create: if true;` ne fonctionne pas, essayez avec validation :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read: if true;
      allow create: if request.resource.data.score is int 
                   && request.resource.data.name is string
                   && request.resource.data.level is int;
      allow update, delete: if false;
    }
  }
}
```

Mais normalement, `allow create: if true;` devrait fonctionner.

