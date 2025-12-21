# Configuration du Leaderboard Partagé

Le leaderboard du jeu Space Shooter utilise JSONBin.io pour être partagé en temps réel entre tous les joueurs.

## Étapes de configuration

### 1. Créer un compte sur JSONBin.io
1. Allez sur https://jsonbin.io/
2. Créez un compte gratuit
3. Obtenez votre clé API (Master Key)

### 2. Créer un nouveau bin
1. Dans votre dashboard JSONBin.io, créez un nouveau bin
2. Initialisez-le avec un tableau vide : `[]`
3. Copiez l'ID du bin (visible dans l'URL ou les détails du bin)

### 3. Configurer le code
Ouvrez `js/space-shooter.js` et modifiez ces lignes (vers la ligne 232-235) :

```javascript
const LEADERBOARD_BIN_ID = 'VOTRE_BIN_ID_ICI'; // Remplacez par votre bin ID
const LEADERBOARD_API_KEY = 'VOTRE_CLE_API_ICI'; // Remplacez par votre Master Key
```

### 4. Tester
1. Ouvrez le jeu Space Shooter
2. Jouez et obtenez un score
3. Enregistrez votre score dans le leaderboard
4. Vérifiez que le score apparaît dans JSONBin.io

## Fonctionnalités

- **Synchronisation automatique** : Le leaderboard se met à jour toutes les 5 secondes quand il est ouvert
- **Fallback local** : Si l'API échoue, le jeu utilise le cache local
- **Temps réel** : Tous les joueurs voient les mêmes scores

## Limites du plan gratuit JSONBin.io

- 10,000 requêtes par mois
- Suffisant pour un portfolio personnel

## Alternative : Firebase

Si vous préférez utiliser Firebase Realtime Database, contactez-moi pour l'implémentation.





