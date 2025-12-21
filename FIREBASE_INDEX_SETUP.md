# Configuration de l'index Firestore pour le Leaderboard

## ⚠️ Problème courant : Index manquant

Si vous voyez l'erreur : **"The query requires an index"** ou **"index not found"**, c'est parce que Firestore a besoin d'un index pour la requête `orderBy('score', 'desc')`.

## Solution automatique (Recommandé)

1. **Lancez le jeu** et essayez d'ouvrir le leaderboard
2. **Ouvrez la console** (F12)
3. Si vous voyez une erreur avec un **lien bleu**, cliquez dessus
4. Cela vous amènera directement à la page de création d'index dans Firebase Console
5. Cliquez sur **"Créer l'index"**
6. Attendez quelques minutes que l'index soit créé
7. Rechargez le jeu

## Solution manuelle

1. Allez dans **Firebase Console** > **Firestore Database** > **Indexes**
2. Cliquez sur **"Créer un index"**
3. Configurez l'index comme suit :
   - **Collection ID** : `leaderboard`
   - **Champs à indexer** :
     - `score` : Ordre décroissant (Descending)
   - **Mode de requête** : Collection
4. Cliquez sur **"Créer"**
5. Attendez que l'index soit créé (peut prendre quelques minutes)

## Vérification

Une fois l'index créé, vous devriez voir dans Firebase Console > Indexes :
- Collection: `leaderboard`
- Fields: `score (Descending)`
- Status: `Enabled` (vert)

## Alternative : Requête sans index

Si vous ne voulez pas créer d'index, vous pouvez modifier le code pour charger tous les scores et les trier côté client, mais c'est moins performant.




