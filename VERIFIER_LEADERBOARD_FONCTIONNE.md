# ✅ Vérifier que le Leaderboard Fonctionne

## Bonne Nouvelle !

D'après votre capture d'écran, Firestore fonctionne :
- ✅ La collection `leaderboard` existe
- ✅ Des documents ont été créés (écriture fonctionne)
- ✅ Les données sont correctes (name, score, level, date)

## Vérification Complète

### 1. Vérifier les Règles Firestore

Dans Firebase Console → Firestore Database → Rules, vous devez avoir **EXACTEMENT** :

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

**Important** : Les règles doivent être **publiées** (bouton "Publier" cliqué).

### 2. Tester la Lecture dans la Console

Ouvrez la console (F12) et testez :

```javascript
// Vérifier que Firebase est initialisé
if (!window.firebaseDb) {
    console.error('❌ Firebase non initialisé - Voir SOLUTION_IMMEDIATE_FIREBASE.md');
} else {
    // Tester la lecture
    window.firebaseDb.collection('leaderboard')
        .orderBy('score', 'desc')
        .limit(10)
        .get()
        .then(snapshot => {
            console.log('✅ LECTURE OK - Documents trouvés:', snapshot.size);
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log(`  - ${data.name}: ${data.score} points (niveau ${data.level})`);
            });
        })
        .catch(error => {
            console.error('❌ ERREUR LECTURE:', error.code, error.message);
            if (error.code === 'permission-denied') {
                console.error('🔒 Les règles bloquent la lecture - Vérifiez les règles Firestore');
            } else if (error.code === 'failed-precondition') {
                console.error('📊 Index manquant - Le leaderboard fonctionnera sans index');
            }
        });
}
```

### 3. Tester dans le Jeu

1. Ouvrez le jeu Space Shooter
2. Cliquez sur le bouton **"🏆 Leaderboard"**
3. Le leaderboard devrait s'afficher avec les scores

### 4. Tester l'Enregistrement d'un Score

1. Jouez au jeu et obtenez un score
2. Si votre score peut entrer dans le top 10, le bouton **"💾 Enregistrer mon Score"** apparaît
3. Cliquez dessus et entrez votre nom
4. Le score devrait être enregistré dans Firestore

## Problèmes Possibles

### Problème 1 : Le leaderboard ne s'affiche pas

**Cause** : Erreur de lecture ou Firebase non initialisé

**Solution** :
1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Si `firebaseDb` est `undefined`, voir `SOLUTION_IMMEDIATE_FIREBASE.md`

### Problème 2 : Erreur "permission-denied" à la lecture

**Cause** : Les règles Firestore bloquent la lecture

**Solution** :
1. Vérifiez que vous avez `allow read: if true;` dans les règles
2. Cliquez sur "Publier"
3. Attendez 20 secondes

### Problème 3 : Erreur "failed-precondition" (index manquant)

**Cause** : Index Firestore manquant pour `orderBy('score', 'desc')`

**Solution** :
- Le leaderboard fonctionnera quand même (tri côté client)
- OU cliquez sur le lien dans l'erreur pour créer l'index
- OU attendez quelques minutes (Firebase crée l'index automatiquement)

### Problème 4 : Les scores ne se mettent pas à jour en temps réel

**Cause** : Le listener Firestore n'est pas actif

**Solution** :
- Rechargez la page
- Le leaderboard se synchronise automatiquement toutes les 5 secondes

## Vérification Finale

Si tout fonctionne, vous devriez voir :

1. ✅ Dans la console : `✅ LECTURE OK - Documents trouvés: X`
2. ✅ Dans le jeu : Le leaderboard s'affiche avec les scores
3. ✅ Dans Firebase Console : Les nouveaux scores apparaissent dans la collection `leaderboard`

## Si Rien Ne Fonctionne

1. Ouvrez la console (F12)
2. Copiez toutes les erreurs
3. Testez le script de l'étape 2
4. Envoyez-moi les résultats

Avec ces informations, je pourrai identifier le problème exact.

