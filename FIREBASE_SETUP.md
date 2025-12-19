# Configuration Firebase pour le Leaderboard

Ce guide vous explique comment configurer Firebase Firestore pour stocker le leaderboard du jeu Space Shooter.

## Étapes de configuration

### 1. Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet" ou "Add project"
3. Donnez un nom à votre projet (ex: "portfolio-leaderboard")
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

### 2. Créer une base de données Firestore

1. Dans votre projet Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Démarrer en mode test" (pour le développement)
4. Sélectionnez une région (choisissez la plus proche de vous)
5. Cliquez sur "Activer"

### 3. Configurer les règles de sécurité

Dans l'onglet "Règles" de Firestore, remplacez les règles par :

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

Cliquez sur "Publier"

### 4. Obtenir les clés de configuration

1. Allez dans "Paramètres du projet" (icône d'engrenage)
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Donnez un nom à votre app (ex: "Portfolio Leaderboard")
5. **Ne cochez PAS** "Configurer Firebase Hosting"
6. Cliquez sur "Enregistrer l'application"
7. **Copiez les clés de configuration** qui apparaissent (elles ressemblent à ça) :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 5. Configurer le code

1. Ouvrez `js/space-shooter.js`
2. Trouvez les lignes avec `LEADERBOARD_BIN_ID` et `LEADERBOARD_API_KEY`
3. Remplacez-les par votre configuration Firebase (voir les modifications dans le code)

### 6. Ajouter le SDK Firebase

Le SDK Firebase sera chargé automatiquement dans le HTML. Vérifiez que ces lignes sont présentes dans `pages/basketball-game.html` :

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

- ✅ **Temps réel** : Les scores se mettent à jour automatiquement
- ✅ **Sécurisé** : Validation des données côté serveur
- ✅ **Gratuit** : Plan gratuit généreux (50K lectures/jour)
- ✅ **Scalable** : Peut gérer des milliers de joueurs

## Limites du plan gratuit

- 50,000 lectures par jour
- 20,000 écritures par jour
- 20,000 suppressions par jour
- 1 GB de stockage

Suffisant pour un portfolio personnel avec des centaines de joueurs par jour.

## Test

1. Ouvrez le jeu Space Shooter
2. Jouez et obtenez un score
3. Enregistrez votre score
4. Vérifiez dans Firebase Console > Firestore que le score apparaît

## Alternative : Mode test vs Production

Pour la production, modifiez les règles de sécurité pour être plus strictes :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read: if true;
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

