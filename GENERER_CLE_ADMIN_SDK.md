# Comment générer une clé Firebase Admin SDK

## ⚠️ IMPORTANT : Vous n'avez PAS besoin d'Admin SDK pour le leaderboard !

Le leaderboard utilise le **Firebase Client SDK** (déjà configuré dans `basketball-game.html`).

**Firebase Admin SDK** est uniquement nécessaire pour :
- Backend Node.js/Express
- Fonctions serverless (Cloud Functions)
- Scripts d'administration

## Si vous voulez quand même générer une clé Admin SDK :

### Étape 1 : Aller dans Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **oscar-baer**
3. Cliquez sur l'icône ⚙️ (Settings) en haut à gauche
4. Allez dans **Project settings**
5. Cliquez sur l'onglet **Service accounts**

### Étape 2 : Générer la clé

1. Dans la section **Service accounts**, vous verrez :
   - **Node.js** (recommandé)
   - **Python**
   - **Java**
2. Cliquez sur **Generate new private key** (Générer une nouvelle clé privée)
3. Une alerte apparaîtra : "Are you sure you want to generate a new private key?"
4. Cliquez sur **Generate key**
5. Un fichier JSON sera téléchargé automatiquement (ex: `oscar-baer-firebase-adminsdk-xxxxx.json`)

### Étape 3 : Structure du fichier téléchargé

Le fichier JSON aura cette structure :

```json
{
  "type": "service_account",
  "project_id": "oscar-baer",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@oscar-baer.iam.gserviceaccount.com",
  "client_id": "xxxxxxxxxxxxxxxxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40oscar-baer.iam.gserviceaccount.com"
}
```

### Étape 4 : Sécuriser le fichier

⚠️ **CRITIQUE** : Ce fichier contient des clés secrètes !

1. **NE COMMITEZ JAMAIS** ce fichier dans Git
2. Renommez-le en `firebase-adminsdk.json` (ou `firebase-service-account.json`)
3. Placez-le dans un dossier sécurisé (hors du projet web)
4. Ajoutez-le au `.gitignore` :

```
# Firebase Admin SDK (NE JAMAIS COMMITER !)
firebase-adminsdk*.json
firebase-service-account.json
**/firebase-adminsdk*.json
```

### Étape 5 : Utiliser la clé (si nécessaire)

Si vous créez un backend Node.js, utilisez :

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
```

## 🔒 Sécurité

- ✅ **NE JAMAIS** partager ce fichier
- ✅ **NE JAMAIS** le commiter dans Git
- ✅ **NE JAMAIS** l'exposer publiquement
- ✅ Stockez-le dans un endroit sécurisé
- ✅ Utilisez des variables d'environnement en production

## 📝 Pour votre leaderboard actuel

**Vous n'avez PAS besoin de ce fichier !**

Votre leaderboard fonctionne avec le **Firebase Client SDK** qui est déjà configuré dans `pages/basketball-game.html` avec :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
  authDomain: "oscar-baer.firebaseapp.com",
  projectId: "oscar-baer",
  // ...
};
```

C'est suffisant pour lire/écrire dans Firestore depuis le navigateur.


