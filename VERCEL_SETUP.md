# Configuration Firebase sur Vercel

Ce guide vous explique comment configurer Firebase Firestore pour fonctionner avec Vercel.

## Méthode 1 : Variables d'environnement Vercel (Recommandé)

### 1. Configurer les variables dans Vercel

1. Allez sur votre projet dans [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez les variables suivantes :

```
FIREBASE_API_KEY = votre_api_key
FIREBASE_AUTH_DOMAIN = votre_project_id.firebaseapp.com
FIREBASE_PROJECT_ID = votre_project_id
FIREBASE_STORAGE_BUCKET = votre_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID = votre_messaging_sender_id
FIREBASE_APP_ID = votre_app_id
```

5. Sélectionnez **Production**, **Preview**, et **Development**
6. Cliquez sur **Save**
7. **Redéployez** votre projet pour que les variables prennent effet

### 2. Comment ça fonctionne

Le code est déjà configuré pour utiliser l'API route `/api/firebase-config` qui :
- Lit les variables d'environnement Vercel
- Les expose au client via une API route sécurisée
- Le client charge automatiquement cette configuration au chargement de la page

**Aucune modification de code nécessaire !** Il suffit de configurer les variables dans Vercel.

### 2. Modifier le code pour utiliser les variables

Le code dans `js/space-shooter.js` utilise déjà les variables d'environnement. Pour que ça fonctionne avec Vercel, vous devez créer un script de build qui injecte ces variables.

**Option A : Utiliser un fichier de configuration JavaScript**

Créez un fichier `js/firebase-config.js` :

```javascript
// Ce fichier sera généré automatiquement par Vercel
window.FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};
```

Puis ajoutez ce script dans `basketball-game.html` **AVANT** `space-shooter.js` :

```html
<script src="../js/firebase-config.js"></script>
```

**Option B : Utiliser un script inline (Plus simple pour Vercel)**

Modifiez `pages/basketball-game.html` pour injecter les variables directement :

```html
<script>
    // Configuration Firebase depuis les variables d'environnement Vercel
    window.FIREBASE_API_KEY = '<%= process.env.FIREBASE_API_KEY || "YOUR_API_KEY" %>';
    window.FIREBASE_AUTH_DOMAIN = '<%= process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com" %>';
    window.FIREBASE_PROJECT_ID = '<%= process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID" %>';
    window.FIREBASE_STORAGE_BUCKET = '<%= process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com" %>';
    window.FIREBASE_MESSAGING_SENDER_ID = '<%= process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID" %>';
    window.FIREBASE_APP_ID = '<%= process.env.FIREBASE_APP_ID || "YOUR_APP_ID" %>';
</script>
```

**Note** : Cette syntaxe nécessite un moteur de template. Pour un site statique, utilisez plutôt l'Option C.

**Option C : Configuration directe dans le code (Plus simple)**

Puisque Vercel sert des fichiers statiques, la meilleure approche est de :

1. Configurer les variables dans Vercel (comme décrit ci-dessus)
2. Créer un script de build qui remplace les valeurs dans le code
3. Ou simplement mettre les valeurs directement dans `js/space-shooter.js` (moins sécurisé mais fonctionne)

## Méthode 2 : Configuration directe (Simple mais moins sécurisé)

Si vous préférez ne pas utiliser de variables d'environnement, vous pouvez directement modifier `js/space-shooter.js` et remplacer les valeurs `YOUR_*` par vos vraies clés Firebase.

**⚠️ Attention** : Les clés Firebase API sont publiques par design (elles sont exposées dans le code client), mais il est tout de même recommandé d'utiliser les variables d'environnement pour une meilleure organisation.

## Déploiement sur Vercel

1. **Connectez votre dépôt GitHub à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre dépôt GitHub

2. **Configurez les variables d'environnement** (voir Méthode 1)

3. **Déployez** :
   - Vercel détectera automatiquement que c'est un site statique
   - Le déploiement se fera automatiquement

4. **Vérifiez** :
   - Ouvrez votre site déployé
   - Testez le jeu Space Shooter
   - Vérifiez que le leaderboard fonctionne

## Règles de sécurité Firestore

Assurez-vous que vos règles Firestore sont correctement configurées :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read: if true; // Lecture publique
      allow create: if request.resource.data.score is int 
                   && request.resource.data.name is string
                   && request.resource.data.name.size() <= 20
                   && request.resource.data.level is int
                   && request.resource.data.date is timestamp;
      allow update, delete: if false; // Pas de modification/suppression
    }
  }
}
```

## Dépannage

### Les variables d'environnement ne fonctionnent pas

- Vérifiez que les variables sont bien définies dans Vercel
- Vérifiez que vous avez redéployé après avoir ajouté les variables
- Utilisez la console du navigateur pour vérifier les valeurs

### Firebase ne se connecte pas

- Vérifiez que les clés sont correctes
- Vérifiez que Firestore est activé dans Firebase Console
- Vérifiez les règles de sécurité Firestore

### Le leaderboard ne se met pas à jour

- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que les règles Firestore permettent la lecture/écriture
- Vérifiez que Firebase est bien initialisé

## Support

Pour plus d'aide, consultez :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

