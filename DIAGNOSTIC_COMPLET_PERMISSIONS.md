# Diagnostic Complet - Permission Denied Malgré Règles Correctes

Si les règles Firestore sont identiques à celles données mais que vous obtenez toujours "permission denied", voici un diagnostic complet :

## 🔍 Vérifications à faire

### 1. Vérifier que les règles sont BIEN publiées

Dans Firebase Console → Firestore Database → Rules :

1. **Regardez en haut de l'éditeur** :
   - Y a-t-il un message "Règles publiées" ou "Rules published" ?
   - Y a-t-il une date de dernière publication ?
   - Y a-t-il une erreur rouge ?

2. **Cliquez sur "Publier" à nouveau** :
   - Même si les règles semblent déjà publiées
   - Parfois il faut republier pour forcer la propagation

3. **Vérifiez qu'il n'y a PAS d'erreur de syntaxe** :
   - Pas de message rouge en haut
   - Pas de soulignement rouge dans le code

### 2. Vérifier le mode de la base de données

Dans Firebase Console → Firestore Database :

1. **Regardez en haut de la page** :
   - Mode "Test" ou "Production" ?
   - Les règles s'appliquent dans les deux cas

2. **Si vous êtes en mode "Test"** :
   - Les règles par défaut permettent tout pendant 30 jours
   - Mais vos règles personnalisées doivent quand même s'appliquer

### 3. Vérifier le Project ID dans le code

Ouvrez la console du navigateur (F12) et tapez :

```javascript
// Vérifier le projectId utilisé
console.log('Project ID:', window.firebaseApp?.options?.projectId);
```

**Il DOIT afficher : `oscar-baer`**

Si ce n'est pas `oscar-baer`, c'est le problème !

### 4. Vérifier que Firestore est bien activé

Dans Firebase Console → Firestore Database :

1. **Regardez l'onglet "Data"** :
   - Y a-t-il des collections ?
   - Pouvez-vous voir la collection `leaderboard` ?

2. **Si vous ne voyez pas "Data"** :
   - Firestore n'est peut-être pas activé
   - Créez la base de données si nécessaire

### 5. Vérifier les logs Firebase

Dans Firebase Console → Firestore Database → Usage :

1. **Regardez les statistiques** :
   - Y a-t-il des tentatives de lecture/écriture ?
   - Les tentatives sont-elles bloquées ?

2. **Regardez les logs** :
   - Allez dans Firebase Console → Project Settings → Usage
   - Regardez s'il y a des erreurs de permissions

### 6. Test avec un autre nom de collection

Parfois le problème vient du nom de collection. Testez avec une collection différente :

Dans la console du navigateur :

```javascript
// Tester avec une collection "test" au lieu de "leaderboard"
const db = window.firebaseDb;
db.collection('test').add({ test: 'value' })
  .then(() => console.log('✅ Écriture OK avec collection "test"'))
  .catch(err => console.error('❌ Erreur:', err));
```

Si ça marche avec "test" mais pas avec "leaderboard", le problème vient du nom de collection.

### 7. Vérifier les règles avec le simulateur Firebase

Dans Firebase Console → Firestore Database → Rules :

1. **Cliquez sur "Simulateur"** (en haut à droite)
2. **Testez une lecture** :
   - Type: `get`
   - Location: `leaderboard/test123`
   - Cliquez sur "Run"
   - Regardez si ça passe ou échoue

3. **Testez une écriture** :
   - Type: `create`
   - Location: `leaderboard/test123`
   - Data: `{ name: "Test", score: 100, level: 1, date: request.time }`
   - Cliquez sur "Run"
   - Regardez si ça passe ou échoue

Si le simulateur échoue, les règles ne sont pas correctes malgré ce que vous voyez.

### 8. Vérifier qu'il n'y a pas de règles par défaut qui bloquent

Parfois il y a des règles par défaut qui s'appliquent avant vos règles. Vérifiez qu'il n'y a **RIEN d'autre** dans l'éditeur de règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // C'EST TOUT - Pas d'autres règles ici
    match /leaderboard/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

**Pas de règles pour d'autres collections, pas de règles par défaut, juste ça.**

### 9. Vérifier la région de la base de données

Dans Firebase Console → Firestore Database → Settings :

1. **Regardez la région** :
   - Quelle région est sélectionnée ?
   - Les règles s'appliquent quelle que soit la région

2. **Si vous avez plusieurs bases de données** :
   - Vérifiez que vous modifiez les règles de la bonne base de données
   - Le nom de la base de données est généralement `(default)`

### 10. Test avec un compte différent

Parfois le problème vient du cache ou des cookies :

1. **Ouvrez une fenêtre de navigation privée**
2. **Testez à nouveau**
3. Si ça marche en navigation privée → problème de cache

## 🔧 Solutions à essayer

### Solution 1 : Forcer la republication des règles

1. Dans Firebase Console → Firestore Database → Rules
2. **Ajoutez un espace** quelque part (n'importe où)
3. **Enlevez cet espace**
4. Cliquez sur **"Publier"**
5. Attendez 20 secondes
6. Testez à nouveau

### Solution 2 : Supprimer et recréer les règles

1. **Supprimez TOUT** dans l'éditeur de règles
2. **Collez les règles** à nouveau
3. Cliquez sur **"Publier"**
4. Attendez 20 secondes

### Solution 3 : Vérifier le projectId dans le code

Ouvrez `pages/basketball-game.html` et vérifiez que :

```javascript
projectId: "oscar-baer", // DOIT être exactement "oscar-baer"
```

**Pas de guillemets différents, pas d'espaces, exactement "oscar-baer".**

### Solution 4 : Utiliser les règles en mode test (temporaire)

Si rien ne fonctionne, essayez temporairement les règles en mode test :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

**⚠️ ATTENTION : Ces règles permettent TOUT pendant 30 jours. Utilisez-les uniquement pour tester, puis remettez les règles sécurisées.**

### Solution 5 : Vérifier les règles avec l'API REST

Testez directement avec l'API REST Firebase :

```bash
# Remplacez YOUR_API_KEY par votre vraie clé API
curl -X GET "https://firestore.googleapis.com/v1/projects/oscar-baer/databases/(default)/documents/leaderboard?pageSize=1" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Si ça échoue, le problème vient des règles.

## 📋 Checklist finale

Avant de dire que ça ne marche pas, vérifiez :

- [ ] Les règles sont **exactement** celles données (copier-coller, pas de modification)
- [ ] Les règles sont **publiées** (bouton "Publier" cliqué)
- [ ] **20 secondes** se sont écoulées après publication
- [ ] Pas d'erreur de syntaxe dans les règles
- [ ] Le `projectId` dans le code est **"oscar-baer"** (vérifié dans la console)
- [ ] Firestore est **activé** (onglet "Data" visible)
- [ ] Le simulateur Firebase **passe** les tests
- [ ] Testé en **navigation privée**
- [ ] Cache navigateur **vidé**
- [ ] Pas d'autres règles dans l'éditeur

## 🆘 Si rien ne fonctionne

Envoyez-moi :

1. **Une capture d'écran** de l'éditeur de règles dans Firebase Console
2. **Le résultat** de `console.log('Project ID:', window.firebaseApp?.options?.projectId);`
3. **Le résultat** du simulateur Firebase (lecture et écriture)
4. **Les erreurs exactes** de la console du navigateur

Avec ces informations, je pourrai identifier le problème exact.


