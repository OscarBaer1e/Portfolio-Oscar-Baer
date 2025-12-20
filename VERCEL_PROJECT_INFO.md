# Informations du projet Vercel

## Project ID Vercel
```
prj_3M3FDPbZ42b7B9RrCGpOlmoA67Hf
```

## Firebase Project ID
```
oscar-baer
```

## ⚠️ Différence importante

- **Vercel Project ID** (`prj_3M3FDPbZ42b7B9RrCGpOlmoA67Hf`) : Identifie votre projet sur Vercel
- **Firebase Project ID** (`oscar-baer`) : Identifie votre projet Firebase

Ce sont **deux choses différentes** et ne doivent pas être confondues.

## Configuration actuelle

### Firebase (pour le leaderboard)
- **Project ID** : `oscar-baer`
- **API Key** : `AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM`
- **Auth Domain** : `oscar-baer.firebaseapp.com`
- **Storage Bucket** : `oscar-baer.firebasestorage.app`
- **Messaging Sender ID** : `419618942184`
- **App ID** : `1:419618942184:web:60e8e58c6c3348a3fbad5d`

### Vercel
- **Project ID** : `prj_3M3FDPbZ42b7B9RrCGpOlmoA67Hf`
- **URL de déploiement** : (à vérifier dans Vercel Dashboard)

## 🔧 Utilisation

### Pour le leaderboard actuel
Le leaderboard utilise **uniquement** le Firebase Project ID (`oscar-baer`). Le Vercel Project ID n'est pas utilisé.

### Si vous créez une API route Vercel
Si vous créez une API route Vercel qui utilise Firebase Admin SDK, vous utiliserez :
- Le **Firebase Project ID** (`oscar-baer`) dans la configuration Firebase
- Le **Vercel Project ID** n'est pas nécessaire pour Firebase

## 📝 Variables d'environnement Vercel

Si vous voulez utiliser des variables d'environnement dans Vercel pour Firebase :

1. Allez dans [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet (ID: `prj_3M3FDPbZ42b7B9RrCGpOlmoA67Hf`)
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez (si nécessaire) :
   - `FIREBASE_PROJECT_ID` = `oscar-baer`
   - `FIREBASE_API_KEY` = `AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM`
   - etc.

**Note** : Pour le leaderboard actuel, ces variables ne sont **pas nécessaires** car la configuration Firebase est hardcodée dans `basketball-game.html`.

## 🆘 Problème actuel : `window.firebaseApp undefined`

Le problème `window.firebaseApp undefined` **n'est pas lié** au Vercel Project ID.

Causes possibles :
1. ❌ Règles Firestore qui bloquent l'accès
2. ❌ Firestore non activé dans Firebase Console
3. ❌ Scripts Firebase qui ne se chargent pas
4. ❌ Bloqueur de publicité ou extension de navigateur

**Solution** : Vérifiez les règles Firestore dans Firebase Console (voir `CE_QUE_VOUS_DEVEZ_MODIFIER.md`)

