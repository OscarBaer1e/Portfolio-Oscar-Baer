# Dépannage Firebase - Erreur YOUR_PROJECT_ID

Si vous voyez toujours l'erreur `Permission denied on resource project YOUR_PROJECT_ID`, suivez ces étapes :

## ✅ Solution 1 : Vider le cache Vercel (IMPORTANT)

Le problème vient probablement d'une version en cache sur Vercel.

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Deployments**
4. Cliquez sur les **3 points** à côté du dernier déploiement
5. Cliquez sur **Redeploy**
6. Cochez **"Use existing Build Cache"** → **DÉCOCHEZ** cette option
7. Cliquez sur **Redeploy**

Cela va forcer Vercel à reconstruire complètement votre projet avec le nouveau code.

## ✅ Solution 2 : Vider le cache du navigateur

1. **Chrome/Edge** : `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. Cochez **"Images et fichiers en cache"**
3. Cliquez sur **Effacer les données**
4. Ou utilisez **Navigation privée** (`Ctrl+Shift+N` ou `Cmd+Shift+N`)

## ✅ Solution 3 : Vérifier les variables d'environnement Vercel

Si vous avez configuré des variables d'environnement dans Vercel, vérifiez qu'elles ne contiennent pas `YOUR_PROJECT_ID` :

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Vérifiez que **AUCUNE** variable ne contient `YOUR_PROJECT_ID` ou `votre-projet-id`
5. Si c'est le cas, **SUPPRIMEZ** ces variables (le code utilise maintenant des valeurs par défaut garanties)

## ✅ Solution 4 : Vérifier la console du navigateur

1. Ouvrez la page du jeu
2. Appuyez sur `F12` pour ouvrir la console
3. Regardez les messages. Vous devriez voir :
   ```
   ✅ Configuration Firebase définie par défaut: { projectId: "oscar-baer" }
   🔧 Configuration Firebase finale: { projectId: "oscar-baer" }
   ✅ Firebase initialisé avec succès
   ✅ Project ID vérifié: oscar-baer
   ```

4. Si vous voyez `YOUR_PROJECT_ID` dans les logs, c'est que le cache n'a pas été vidé.

## ✅ Solution 5 : Vérifier les règles Firestore

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet **oscar-baer**
3. Allez dans **Firestore Database** > **Rules**
4. Assurez-vous que les règles sont :
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
5. Cliquez sur **Publier**

## ✅ Solution 6 : Test direct dans la console

Dans la console du navigateur (F12), tapez :

```javascript
console.log(window.FIREBASE_CONFIG);
```

Vous devriez voir :
```javascript
{
  apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
  authDomain: "oscar-baer.firebaseapp.com",
  projectId: "oscar-baer",
  ...
}
```

Si vous voyez `projectId: "YOUR_PROJECT_ID"`, le cache n'a pas été vidé.

## 🔍 Diagnostic

Si après toutes ces étapes l'erreur persiste :

1. Ouvrez la console (F12)
2. Copiez **TOUS** les messages d'erreur
3. Vérifiez la date/heure du dernier déploiement Vercel
4. Vérifiez que vous êtes bien sur la dernière version du code (GitHub)

## ⚠️ Important

Le code est maintenant configuré pour **NE JAMAIS** utiliser `YOUR_PROJECT_ID`. Il utilise toujours les valeurs par défaut garanties (`oscar-baer`). Si vous voyez encore cette erreur, c'est **100% un problème de cache**.



