# Configuration Firebase pour le Leaderboard

Ce guide vous explique comment configurer Firebase Firestore pour stocker le leaderboard du jeu Space Shooter.

## Étapes de configuration

### 1. Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet" ou "Add project"
3. Donnez un nom à votre projet (ex: "portfolio-leaderboard" ou "oscar-baer")
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

### 2. Créer une base de données Firestore

1. Dans votre projet Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Démarrer en mode test" (pour le développement)
4. Sélectionnez une région (choisissez la plus proche de vous, ex: europe-west)
5. Cliquez sur "Activer"

### 3. Configurer les règles de sécurité

Dans l'onglet "Règles" de Firestore, remplacez les règles par le contenu du fichier `FIREBASE_RULES.txt` :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leaderboard - lecture publique, écriture limitée
    match /leaderboard/{document=**} {
      // Tout le monde peut lire le leaderboard
      allow read: if true;
      
      // Tout le monde peut créer un score (avec validation)
      allow create: if request.resource.data.score is int 
                   && request.resource.data.name is string
                   && request.resource.data.name.size() <= 20
                   && request.resource.data.level is int
                   && request.resource.data.date is timestamp;
      
      // Pas de modification ou suppression (sécurité)
      allow update, delete: if false;
    }
  }
}
```

**Important** : Cliquez sur "Publier" pour appliquer les règles.

### 4. Obtenir les clés de configuration

1. Allez dans "Paramètres du projet" (icône d'engrenage en haut à gauche)
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Donnez un nom à votre app (ex: "Portfolio Leaderboard")
5. **Ne cochez PAS** "Configurer Firebase Hosting"
6. Cliquez sur "Enregistrer l'application"
7. **Copiez les clés de configuration** qui apparaissent. Vous aurez besoin de :
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 5. Configurer sur Vercel (Recommandé)

Si vous déployez sur Vercel, suivez ces étapes :

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez les 6 variables suivantes avec les valeurs que vous avez copiées :

```
FIREBASE_API_KEY = votre_api_key
FIREBASE_AUTH_DOMAIN = votre_project_id.firebaseapp.com
FIREBASE_PROJECT_ID = votre_project_id
FIREBASE_STORAGE_BUCKET = votre_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID = votre_messaging_sender_id
FIREBASE_APP_ID = votre_app_id
```

5. Sélectionnez **Production**, **Preview**, et **Development** pour chaque variable
6. Cliquez sur **Save**
7. **Redéployez** votre projet pour que les variables prennent effet

### 6. Configuration alternative (sans Vercel)

Si vous n'utilisez pas Vercel, vous pouvez mettre les clés directement dans le code :

1. Ouvrez `js/space-shooter.js`
2. Trouvez les lignes 238-245 avec `FIREBASE_CONFIG`
3. Remplacez les valeurs par défaut par vos vraies clés :

```javascript
const FIREBASE_CONFIG = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

⚠️ **Note** : Les clés Firebase API sont publiques par design (elles sont exposées dans le code client), mais il est recommandé d'utiliser les variables d'environnement Vercel pour une meilleure organisation.

### 7. Vérifier que le SDK Firebase est chargé

Le SDK Firebase est déjà configuré dans `pages/basketball-game.html`. Vérifiez que ces lignes sont présentes :

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

## Structure de la base de données

Les scores seront stockés dans Firestore avec cette structure :

```
leaderboard/
  └── {auto-generated-id}/
      ├── name: string (max 20 caractères)
      ├── score: number
      ├── level: number
      └── date: timestamp
```

## Fonctionnalités

- ✅ **Temps réel** : Les scores se mettent à jour automatiquement entre tous les joueurs
- ✅ **Sécurisé** : Validation des données côté serveur avec les règles Firestore
- ✅ **Gratuit** : Plan gratuit généreux (50K lectures/jour)
- ✅ **Scalable** : Peut gérer des milliers de joueurs
- ✅ **Fonctionne sans Firebase** : Le système utilise localStorage en fallback si Firebase n'est pas disponible

## Limites du plan gratuit Firebase

- 50,000 lectures par jour
- 20,000 écritures par jour
- 20,000 suppressions par jour
- 1 GB de stockage

Suffisant pour un portfolio personnel avec des centaines de joueurs par jour.

## Test

1. Ouvrez le jeu Space Shooter sur votre site
2. Jouez et obtenez un score
3. Cliquez sur "💾 Enregistrer mon Score" si votre score est éligible
4. Entrez votre nom et enregistrez
5. Vérifiez dans Firebase Console > Firestore Database que le score apparaît dans la collection `leaderboard`
6. Ouvrez le leaderboard pour voir votre score

## Dépannage

### Les variables d'environnement ne fonctionnent pas sur Vercel

- Vérifiez que les variables sont bien définies dans Vercel Dashboard
- Vérifiez que vous avez redéployé après avoir ajouté les variables
- Vérifiez que les noms des variables sont exactement : `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc.
- Utilisez la console du navigateur (F12) pour vérifier si les valeurs sont chargées

### Firebase ne se connecte pas

- Vérifiez que les clés sont correctes (copiez-collez exactement depuis Firebase Console)
- Vérifiez que Firestore est bien activé dans Firebase Console
- Vérifiez les règles de sécurité Firestore (elles doivent être publiées)
- Vérifiez la console du navigateur pour les erreurs

### Le leaderboard ne se met pas à jour

- Vérifiez la console du navigateur (F12) pour les erreurs
- Vérifiez que les règles Firestore permettent la lecture (`allow read: if true`)
- Vérifiez que les règles Firestore permettent la création avec validation
- Vérifiez que Firebase est bien initialisé (regardez les messages dans la console)

### Les scores ne s'enregistrent pas

- Vérifiez que votre score dépasse le dernier du top 10 (condition locale)
- Vérifiez que les règles Firestore permettent la création
- Vérifiez que le champ `date` est bien un timestamp (géré automatiquement par le code)
- Vérifiez la console du navigateur pour les erreurs Firebase

## Support

Pour plus d'aide, consultez :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## Résumé rapide

1. ✅ Créer un projet Firebase
2. ✅ Créer une base Firestore
3. ✅ Copier les règles de `FIREBASE_RULES.txt` dans Firebase Console
4. ✅ Obtenir les clés de configuration
5. ✅ Ajouter les variables d'environnement dans Vercel (ou dans le code)
6. ✅ Redéployer sur Vercel
7. ✅ Tester le jeu et vérifier que les scores s'enregistrent

Une fois configuré, le leaderboard sera partagé en temps réel entre tous les joueurs ! 🎮



