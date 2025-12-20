# Ce que vous devez modifier - Firebase non initialisé

Si `window.firebaseApp` est `undefined`, voici ce que vous devez vérifier et modifier :

## 🔴 1. Vérifier les Règles Firestore dans Firebase Console

**C'est probablement la cause principale !**

### Actions à faire :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **oscar-baer**
3. Cliquez sur **Firestore Database** dans le menu de gauche
4. Cliquez sur l'onglet **Rules** (Règles)
5. **SUPPRIMEZ TOUT** ce qui est actuellement dans les règles
6. **COLLEZ EXACTEMENT** ceci :

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

7. Cliquez sur **Publier** (Publish)
8. **ATTENDEZ** 10-20 secondes pour que les règles se propagent

## 🔴 2. Vérifier que Firestore est activé

1. Dans Firebase Console, allez dans **Firestore Database**
2. Si vous voyez un bouton **"Créer une base de données"** ou **"Create database"**, cliquez dessus
3. Choisissez **"Démarrer en mode test"** ou **"Start in test mode"**
4. Sélectionnez une région (choisissez la plus proche de vous, ex: `europe-west`)
5. Cliquez sur **Activer** ou **Enable**

## 🔴 3. Vérifier la configuration de l'application Web

1. Dans Firebase Console, allez dans **Project settings** (⚙️ > Project settings)
2. Descendez jusqu'à **"Your apps"** (Vos applications)
3. Vérifiez que vous avez une application **Web** (icône `</>`)
4. Si vous n'en avez pas :
   - Cliquez sur l'icône Web `</>`
   - Donnez un nom (ex: "Portfolio Leaderboard")
   - **Ne cochez PAS** "Also set up Firebase Hosting"
   - Cliquez sur **Register app**
5. Vérifiez que le **projectId** affiché est bien **"oscar-baer"** (pas "YOUR_PROJECT_ID")

## 🔴 4. Vérifier dans la console du navigateur

Ouvrez la console (F12) et regardez les messages. Vous devriez voir :

### Messages attendus :
```
✅ Configuration Firebase FORCÉE et verrouillée: { projectId: "oscar-baer" }
✅ Firebase initialisé avec succès (v10.7.1 compat)
✅ Project ID vérifié: oscar-baer
✅ Firestore accessible
```

### Si vous voyez des erreurs :
- **"Firebase SDK non chargé"** → Les scripts Firebase ne se chargent pas
- **"Permission denied"** → Les règles Firestore bloquent l'accès
- **"Failed to fetch"** → Problème de connexion ou CORS

## 🔴 5. Vérifier que les scripts Firebase se chargent

Dans la console (F12), allez dans l'onglet **Network** (Réseau) :
1. Rechargez la page (F5)
2. Cherchez les requêtes vers `firebasejs`
3. Vérifiez que :
   - `firebase-app-compat.js` se charge (status 200)
   - `firebase-firestore-compat.js` se charge (status 200)
4. Si vous voyez des erreurs 404 ou failed, c'est un problème de chargement

## 🔴 6. Test dans la console

Après avoir rechargé la page, dans la console, tapez :

```javascript
// 1. Vérifier si Firebase est chargé
console.log('firebase:', typeof firebase);

// 2. Vérifier la configuration
console.log('FIREBASE_CONFIG:', window.FIREBASE_CONFIG);

// 3. Vérifier l'initialisation
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);
```

### Résultats attendus :
- `firebase` = `"object"` (pas "undefined")
- `FIREBASE_CONFIG.projectId` = `"oscar-baer"`
- `firebaseApp` = `[FirebaseApp object]` (pas undefined)
- `firebaseDb` = `[Firestore object]` (pas undefined)
- `firebaseInitialized` = `true`

## 🔴 7. Si Firebase n'est toujours pas chargé

Si `typeof firebase === "undefined"`, les scripts ne se chargent pas. Vérifiez :

1. **Bloqueur de publicité** : Désactivez-le temporairement
2. **Extension de navigateur** : Testez en navigation privée
3. **Connexion internet** : Vérifiez que vous pouvez accéder à `gstatic.com`
4. **Console erreurs** : Regardez s'il y a des erreurs de chargement de script

## 🔴 8. Vérifier les variables d'environnement Vercel

Si vous utilisez Vercel :

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. **SUPPRIMEZ** toutes les variables qui contiennent `YOUR_PROJECT_ID`
5. **OU** vérifiez que `FIREBASE_PROJECT_ID` = `oscar-baer` (pas `YOUR_PROJECT_ID`)

## 📋 Checklist complète

Avant de dire que ça ne marche pas, vérifiez :

- [ ] Firestore Database est **créé et activé** dans Firebase Console
- [ ] Les règles Firestore sont **publiées** avec `allow create: if true;`
- [ ] Une application **Web** existe dans Firebase Console
- [ ] Le **projectId** dans Firebase Console est **"oscar-baer"** (pas YOUR_PROJECT_ID)
- [ ] Les scripts Firebase se chargent (onglet Network)
- [ ] Pas de bloqueur de publicité actif
- [ ] Cache navigateur vidé complètement
- [ ] Testé en navigation privée

## 🆘 Diagnostic avancé

Si après tout ça, `window.firebaseApp` est toujours `undefined`, dans la console, tapez :

```javascript
// Vérifier l'ordre de chargement
console.log('Scripts chargés:', {
    firebaseSDK: typeof firebase,
    config: window.FIREBASE_CONFIG,
    app: window.firebaseApp,
    db: window.firebaseDb
});

// Vérifier les erreurs
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e);
});
```

Et envoyez-moi tous les messages de la console.

