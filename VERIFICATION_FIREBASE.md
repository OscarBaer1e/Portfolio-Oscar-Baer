# Vérification Complète Firebase - Checklist

## ✅ Étape 1 : Vérifier les Règles Firestore

1. Allez dans **Firebase Console** : https://console.firebase.google.com/
2. Sélectionnez votre projet **oscar-baer**
3. Allez dans **Firestore Database** > **Rules**
4. **Copiez-collez** exactement ce contenu :

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
      allow update, delete: if false;
    }
  }
}
```

5. Cliquez sur **"Publier"**
6. Attendez que le message "Rules published" apparaisse

## ✅ Étape 2 : Vérifier que Firestore est activé

1. Dans Firebase Console, allez dans **Firestore Database**
2. Vérifiez que vous voyez "Firestore Database" avec un statut actif
3. Si vous voyez "Créer une base de données", créez-la en mode test

## ✅ Étape 3 : Tester l'enregistrement manuellement

1. Dans Firebase Console > Firestore Database > **Data**
2. Cliquez sur **"Ajouter une collection"**
3. Nom de la collection : `leaderboard`
4. Ajoutez un document avec ces champs :
   - `name` (string) : "Test"
   - `score` (number) : 1000
   - `level` (number) : 1
   - `date` (timestamp) : maintenant
5. Cliquez sur **"Enregistrer"**

Si ça fonctionne, Firestore est bien configuré.

## ✅ Étape 4 : Vérifier la console du navigateur

1. Ouvrez votre site
2. Appuyez sur **F12** (console)
3. Rechargez la page
4. Regardez les messages :

**Messages attendus :**
- ✅ `Configuration Firebase chargée depuis Vercel` OU `Utilisation des valeurs par défaut`
- ✅ `Firebase initialisé avec succès`
- ✅ `Chargement du leaderboard depuis Firebase...`
- ✅ `Leaderboard chargé: X scores`

**Messages d'erreur à vérifier :**
- ❌ `Firebase SDK non chargé` → Les scripts Firebase ne sont pas chargés
- ❌ `Configuration Firebase invalide` → Les clés sont incorrectes
- ❌ `permission-denied` → Les règles Firestore bloquent l'accès
- ❌ `index not found` → L'index n'existe pas (le code gère ça maintenant)

## ✅ Étape 5 : Tester l'enregistrement d'un score

1. Jouez au jeu Space Shooter
2. Obtenez un score
3. Cliquez sur **"💾 Enregistrer mon Score"**
4. Entrez votre nom
5. Cliquez sur **"Enregistrer"**
6. Vérifiez la console pour les messages
7. Vérifiez dans Firebase Console > Firestore > `leaderboard` que le score apparaît

## 🔍 Diagnostic des erreurs courantes

### Erreur : "permission-denied"
**Cause** : Les règles Firestore bloquent l'accès
**Solution** : Vérifiez les règles (Étape 1) et assurez-vous qu'elles sont publiées

### Erreur : "index not found" ou "The query requires an index"
**Cause** : L'index pour `orderBy('score', 'desc')` n'existe pas
**Solution** : 
- Le code gère maintenant ce cas automatiquement
- Ou créez l'index manuellement (voir `FIREBASE_INDEX_SETUP.md`)

### Erreur : "Firebase SDK non chargé"
**Cause** : Les scripts Firebase ne sont pas chargés
**Solution** : Vérifiez que ces lignes sont dans `pages/basketball-game.html` :
```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

### Le leaderboard est vide
**Causes possibles** :
- Aucun score n'a été enregistré
- Les règles bloquent la lecture
- Firebase n'est pas initialisé

**Solutions** :
1. Vérifiez les règles Firestore
2. Essayez d'enregistrer un score
3. Vérifiez la console pour les erreurs

## 📋 Checklist finale

- [ ] Règles Firestore copiées et publiées
- [ ] Firestore Database activée
- [ ] Test d'enregistrement manuel réussi
- [ ] Console du navigateur sans erreurs critiques
- [ ] Test d'enregistrement d'un score réussi
- [ ] Score visible dans Firebase Console

## 🆘 Si rien ne fonctionne

1. **Vérifiez la console** (F12) et notez TOUS les messages
2. **Vérifiez Firebase Console** > Firestore > Data pour voir si des documents existent
3. **Testez manuellement** en créant un document dans Firebase Console
4. **Vérifiez les règles** sont bien publiées
5. **Vérifiez que Firestore est en mode "Test"** (pas "Production" avec authentification)

## ✅ Test rapide dans la console

Ouvrez la console (F12) et tapez :

```javascript
// Vérifier la configuration
console.log(window.FIREBASE_CONFIG);

// Vérifier Firebase
console.log(typeof firebase);

// Tester la connexion
if (typeof firebase !== 'undefined') {
    const db = firebase.firestore();
    db.collection('leaderboard').get().then(snap => {
        console.log('Nombre de documents:', snap.size);
    });
}
```

Si tout fonctionne, vous devriez voir vos clés Firebase et le nombre de documents.



