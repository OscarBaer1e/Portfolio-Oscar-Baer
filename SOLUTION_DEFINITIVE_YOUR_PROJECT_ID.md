# Solution Définitive - Erreur YOUR_PROJECT_ID

Si l'erreur `Permission denied on resource project YOUR_PROJECT_ID` persiste après toutes les corrections, suivez ces étapes dans l'ordre :

## 🔴 Étape 1 : Vérifier les Règles Firestore (CRITIQUE)

L'erreur peut venir des règles Firestore mal configurées dans Firebase Console.

### Actions :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **oscar-baer**
3. Allez dans **Firestore Database** > **Rules**
4. **COPIEZ et COLLEZ exactement** ces règles :

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

5. Cliquez sur **Publier** (Publish)
6. Attendez le message de confirmation

## 🔴 Étape 2 : Vider TOUS les caches

### A. Cache du navigateur (OBLIGATOIRE)

1. **Chrome/Edge** :
   - `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Sélectionnez **"Tout le temps"** ou **"All time"**
   - Cochez **"Images et fichiers en cache"** / **"Cached images and files"**
   - Cliquez sur **"Effacer les données"** / **"Clear data"**

2. **Ou utilisez la navigation privée** :
   - `Ctrl+Shift+N` (Windows) ou `Cmd+Shift+N` (Mac)
   - Testez dans cette fenêtre

### B. Cache Vercel (OBLIGATOIRE)

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Deployments**
4. Cliquez sur les **3 points** (⋯) à côté du dernier déploiement
5. Cliquez sur **Redeploy**
6. **DÉCOCHEZ** "Use existing Build Cache" (très important !)
7. Cliquez sur **Redeploy**
8. Attendez la fin du déploiement

## 🔴 Étape 3 : Vérifier la console du navigateur

Après avoir vidé les caches et redéployé :

1. Ouvrez votre site sur Vercel
2. Ouvrez la console (F12)
3. Rechargez la page (Ctrl+F5 ou Cmd+Shift+R)
4. Regardez les messages dans la console

### Messages attendus (dans l'ordre) :

```
✅ Configuration Firebase FORCÉE et verrouillée: { projectId: "oscar-baer" }
✅ Vérification: projectId correct = oscar-baer
✅ Firebase initialisé avec succès (v12.7.0)
✅ Project ID vérifié: oscar-baer
✅ Firestore accessible
```

### Si vous voyez encore "YOUR_PROJECT_ID" :

1. **Copiez TOUS les messages de la console** (sélectionnez tout, Ctrl+C)
2. Vérifiez à quelle ligne apparaît "YOUR_PROJECT_ID"
3. Vérifiez si c'est dans un message d'erreur Firebase ou dans votre code

## 🔴 Étape 4 : Vérifier les variables d'environnement Vercel

Si vous avez configuré des variables d'environnement dans Vercel :

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. **SUPPRIMEZ** toutes les variables qui contiennent `YOUR_PROJECT_ID` ou `votre-projet-id`
5. **OU** vérifiez que `FIREBASE_PROJECT_ID` = `oscar-baer` (pas `YOUR_PROJECT_ID`)

## 🔴 Étape 5 : Test direct dans la console

Dans la console du navigateur (F12), tapez ces commandes une par une :

```javascript
// 1. Vérifier la configuration
console.log('FIREBASE_CONFIG:', window.FIREBASE_CONFIG);
console.log('projectId:', window.FIREBASE_CONFIG?.projectId);

// 2. Vérifier Firebase initialisé
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);

// 3. Vérifier le projectId de l'app
if (window.firebaseApp) {
    console.log('App projectId:', window.firebaseApp.options.projectId);
}
```

### Résultats attendus :

- `FIREBASE_CONFIG.projectId` = `"oscar-baer"`
- `window.firebaseApp.options.projectId` = `"oscar-baer"`
- `window.firebaseInitialized` = `true`

## 🔴 Étape 6 : Vérifier les règles Firestore (encore une fois)

Parfois les règles ne sont pas bien sauvegardées. Vérifiez :

1. Firebase Console > Firestore Database > Rules
2. Assurez-vous que les règles sont **exactement** :

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

3. Cliquez sur **Publier**
4. Attendez 10-20 secondes pour que les règles se propagent

## 🔴 Étape 7 : Vérifier l'index Firestore

Si vous utilisez `orderBy('score', 'desc')`, vous devez créer un index :

1. Firebase Console > Firestore Database > Indexes
2. Cliquez sur **Create Index**
3. Collection ID : `leaderboard`
4. Fields to index :
   - `score` : Descending
5. Cliquez sur **Create**

**OU** le code chargera automatiquement tous les scores et triera côté client (déjà implémenté).

## 🔴 Étape 8 : Solution de contournement temporaire

Si rien ne fonctionne, le code utilise maintenant un **fallback automatique** vers la version compat (v10.7.1) qui devrait fonctionner même si le module ES6 échoue.

## 📋 Checklist finale

Avant de dire que ça ne marche pas, vérifiez que vous avez fait :

- [ ] Règles Firestore publiées avec `allow create: if true;`
- [ ] Cache navigateur vidé complètement
- [ ] Redéploiement Vercel **SANS cache**
- [ ] Variables d'environnement Vercel vérifiées (pas de YOUR_PROJECT_ID)
- [ ] Console du navigateur vérifiée (pas d'erreurs avant Firebase)
- [ ] Test dans navigation privée
- [ ] Index Firestore créé (si nécessaire)

## 🆘 Si ça ne marche toujours pas

1. **Copiez TOUS les messages de la console** (du début au moment de l'erreur)
2. **Faites une capture d'écran** de la console
3. **Vérifiez la date/heure** du dernier déploiement Vercel
4. **Testez dans un autre navigateur** (Firefox, Safari)

Le code est maintenant **ultra-protégé** contre YOUR_PROJECT_ID. Si l'erreur persiste, c'est probablement :
- Un cache très persistant
- Des règles Firestore non publiées
- Une variable d'environnement Vercel incorrecte


