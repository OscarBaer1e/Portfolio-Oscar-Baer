# Utilisation de la clé Firebase Admin SDK

## ⚠️ SÉCURITÉ CRITIQUE

**Cette clé contient des informations secrètes !**

- ✅ **NE JAMAIS** commiter dans Git
- ✅ **NE JAMAIS** partager publiquement
- ✅ **NE JAMAIS** l'exposer dans le code client
- ✅ Stocker dans un endroit sécurisé

## 📍 Où placer la clé

### Option 1 : Dans le projet (recommandé pour développement local)

1. **Déplacez** le fichier depuis `~/Downloads/` vers le projet :

```bash
mv ~/Downloads/oscar-baer-37a3b82b6f42.json ~/Desktop/Portfolio/Portfolio-Oscar-Baer-main/firebase-adminsdk.json
```

2. Le fichier sera automatiquement ignoré par Git (grâce au `.gitignore`)

### Option 2 : En dehors du projet (plus sécurisé)

Gardez-le dans un dossier sécurisé en dehors du projet, par exemple :
- `~/Documents/firebase-keys/oscar-baer-adminsdk.json`
- `~/.config/firebase/oscar-baer-adminsdk.json`

## 🔧 Utilisation de la clé

### Pour un backend Node.js

Si vous créez un backend (API route, Cloud Functions, etc.) :

```javascript
// backend/server.js ou api/leaderboard.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json'); // ou chemin absolu

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Exemple : fonction pour valider un score côté serveur
async function validateAndSaveScore(name, score, level) {
  const leaderboardRef = db.collection('leaderboard');
  
  // Récupérer les 10 meilleurs scores
  const topScores = await leaderboardRef
    .orderBy('score', 'desc')
    .limit(10)
    .get();
  
  // Vérifier si le score peut entrer dans le top 10
  const minTopScore = topScores.docs[topScores.docs.length - 1]?.data()?.score || 0;
  
  if (score > minTopScore) {
    await leaderboardRef.add({
      name: name,
      score: score,
      level: level,
      date: admin.firestore.Timestamp.now()
    });
    return true;
  }
  return false;
}
```

### Pour Vercel (variables d'environnement)

**NE METTEZ JAMAIS la clé complète dans les variables d'environnement Vercel !**

À la place, utilisez les variables individuelles :

1. Allez dans Vercel Dashboard → Settings → Environment Variables
2. Ajoutez ces variables (sans les guillemets) :

```
FIREBASE_PROJECT_ID=oscar-baer
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@oscar-baer.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCiFALMg11f/S4x\n... (toute la clé privée sur une seule ligne avec \n pour les retours à la ligne)
FIREBASE_PRIVATE_KEY_ID=37a3b82b6f42daf08dcc7116ee6efc3703991a9a
```

3. Dans votre code Vercel :

```javascript
// api/leaderboard.js (Vercel serverless function)
const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default async function handler(req, res) {
  // Votre logique serveur ici
}
```

## ❌ IMPORTANT : Vous n'avez PAS besoin de cette clé pour le leaderboard actuel !

Votre leaderboard dans `space-shooter.js` utilise le **Firebase Client SDK** qui fonctionne directement depuis le navigateur avec la configuration dans `basketball-game.html`.

Cette clé Admin SDK est uniquement nécessaire si vous voulez :
- Créer un backend serveur (Node.js, Express, etc.)
- Créer des Cloud Functions Firebase
- Faire des opérations administratives (supprimer des scores, valider côté serveur, etc.)

## 🔒 Vérification de sécurité

Vérifiez que la clé est bien ignorée par Git :

```bash
cd ~/Desktop/Portfolio/Portfolio-Oscar-Baer-main
git status
```

Le fichier `firebase-adminsdk.json` (ou `oscar-baer-37a3b82b6f42.json`) **NE DOIT PAS** apparaître dans `git status`.

Si il apparaît, c'est qu'il n'est pas ignoré → **NE COMMITEZ PAS !**

## 📝 Résumé

1. ✅ Clé téléchargée : `oscar-baer-37a3b82b6f42.json`
2. ✅ Renommez-la en `firebase-adminsdk.json` (optionnel)
3. ✅ Déplacez-la dans le projet (ou gardez-la ailleurs)
4. ✅ Vérifiez qu'elle est ignorée par Git
5. ⚠️ **NE COMMITEZ JAMAIS** cette clé
6. ℹ️ Pour le leaderboard actuel, cette clé n'est **pas nécessaire**


