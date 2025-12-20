# Guide de Dépannage - Leaderboard Firebase

Si le leaderboard ne fonctionne pas, suivez ces étapes pour identifier le problème.

## 🔍 Vérifications de base

### 1. Ouvrir la console du navigateur

1. Ouvrez votre site
2. Appuyez sur **F12** (ou Cmd+Option+I sur Mac)
3. Allez dans l'onglet **Console**
4. Rechargez la page

### 2. Vérifier les messages dans la console

Vous devriez voir des messages comme :
- ✅ `Configuration Firebase chargée depuis Vercel` ou `Utilisation des valeurs par défaut`
- ✅ `Firebase initialisé avec succès` ou `Firebase déjà initialisé`
- ✅ `Chargement du leaderboard depuis Firebase...`
- ✅ `Leaderboard chargé: X scores`

### 3. Vérifier les erreurs

Si vous voyez des erreurs, notez-les :

#### Erreur : "Firebase SDK non chargé"
**Solution** : Vérifiez que les scripts Firebase sont bien chargés dans `pages/basketball-game.html` :
```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

#### Erreur : "Configuration Firebase invalide ou non configurée"
**Solution** : 
- Si vous utilisez Vercel : Vérifiez que les variables d'environnement sont bien configurées
- Sinon : Vérifiez que les clés dans `js/space-shooter.js` sont correctes (pas "VOTRE_API_KEY")

#### Erreur : "permission-denied" ou "Missing or insufficient permissions"
**Solution** : 
1. Allez dans Firebase Console > Firestore Database > Rules
2. Copiez-collez le contenu de `FIREBASE_RULES.txt`
3. Cliquez sur "Publier"

#### Erreur : "index not found" ou "The query requires an index"
**Solution** :
1. Cliquez sur le lien dans l'erreur pour créer l'index automatiquement
2. Ou créez l'index manuellement dans Firebase Console > Firestore > Indexes

## 🔧 Vérifications détaillées

### Vérifier la configuration Firebase

Dans la console du navigateur, tapez :
```javascript
window.FIREBASE_CONFIG
```

Vous devriez voir un objet avec vos clés Firebase. Si c'est `undefined`, la configuration n'est pas chargée.

### Vérifier l'initialisation Firebase

Dans la console, tapez :
```javascript
typeof firebase
```

Devrait retourner `"object"`. Si c'est `"undefined"`, Firebase SDK n'est pas chargé.

### Vérifier la connexion Firestore

Dans la console, tapez :
```javascript
firebase.firestore()
```

Ne devrait pas retourner d'erreur.

## 📋 Checklist de configuration

- [ ] Projet Firebase créé
- [ ] Firestore Database créée et activée
- [ ] Règles de sécurité copiées depuis `FIREBASE_RULES.txt` et publiées
- [ ] Clés de configuration obtenues depuis Firebase Console
- [ ] Variables d'environnement configurées dans Vercel (si vous utilisez Vercel)
- [ ] Clés mises à jour dans `js/space-shooter.js` (si vous n'utilisez pas Vercel)
- [ ] Site redéployé après configuration

## 🧪 Test manuel

### Test 1 : Vérifier que Firebase est initialisé

1. Ouvrez la console (F12)
2. Jouez au jeu
3. Regardez les messages dans la console
4. Vous devriez voir "Firebase initialisé avec succès"

### Test 2 : Vérifier l'enregistrement

1. Jouez et obtenez un score
2. Cliquez sur "💾 Enregistrer mon Score"
3. Entrez votre nom et enregistrez
4. Vérifiez la console pour les messages
5. Vérifiez dans Firebase Console > Firestore que le score apparaît

### Test 3 : Vérifier le chargement

1. Ouvrez le leaderboard
2. Vérifiez la console pour "Leaderboard chargé: X scores"
3. Les scores devraient apparaître

## 🐛 Problèmes courants et solutions

### Le leaderboard est vide

**Causes possibles** :
- Aucun score n'a été enregistré
- Les règles Firestore bloquent la lecture
- Firebase n'est pas initialisé

**Solutions** :
1. Vérifiez les règles Firestore (doivent avoir `allow read: if true`)
2. Vérifiez la console pour les erreurs
3. Essayez d'enregistrer un score

### Les scores ne s'enregistrent pas

**Causes possibles** :
- Le score n'est pas assez élevé (doit dépasser le dernier du top 10)
- Les règles Firestore bloquent l'écriture
- Firebase n'est pas initialisé

**Solutions** :
1. Vérifiez que votre score dépasse le dernier du top 10
2. Vérifiez les règles Firestore (doivent permettre `allow create`)
3. Vérifiez la console pour les erreurs

### Erreur "Failed to get document"

**Solution** : Vérifiez que Firestore est bien activé dans Firebase Console

### Erreur "Network request failed"

**Solution** : Vérifiez votre connexion internet et que Firebase est accessible

## 📞 Informations à fournir pour l'aide

Si le problème persiste, notez :
1. Les messages d'erreur dans la console
2. Le résultat de `window.FIREBASE_CONFIG` dans la console
3. Le résultat de `typeof firebase` dans la console
4. Si vous utilisez Vercel ou non
5. Les règles Firestore actuelles

## ✅ Vérification finale

Une fois tout configuré, vous devriez voir dans la console :
- ✅ Configuration Firebase chargée
- ✅ Firebase initialisé avec succès
- ✅ Leaderboard chargé: X scores
- ✅ Score enregistré dans Firebase avec ID: ...

Si vous voyez ces messages, tout fonctionne ! 🎉



