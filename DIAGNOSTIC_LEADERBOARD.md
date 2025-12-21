# 🔍 Diagnostic Leaderboard - Identifier le Problème Exact

## Étape 1 : Ouvrir la Console du Navigateur

1. Ouvrez votre jeu Space Shooter
2. Appuyez sur **F12** (ou clic droit → Inspecter)
3. Allez dans l'onglet **Console**

## Étape 2 : Vérifier les Messages

Regardez les messages dans la console. Vous devriez voir :

### ✅ Si Firebase fonctionne :
```
✅ Firebase initialisé avec succès (v10.7.1 compat)
✅ Project ID vérifié: oscar-baer
✅ Firestore accessible
✅ window.firebaseApp: [FirebaseApp object]
✅ window.firebaseDb: [Firestore object]
```

### ❌ Si Firebase ne fonctionne PAS :
```
❌ Firebase SDK non chargé
⚠️ Firebase non initialisé après attente
```

## Étape 3 : Tester Manuellement

Dans la console, tapez **EXACTEMENT** ceci (copier-coller) :

```javascript
// Test 1: Vérifier Firebase
console.log('1. Firebase chargé:', typeof firebase);
console.log('2. firebaseApp:', window.firebaseApp);
console.log('3. firebaseDb:', window.firebaseDb);
console.log('4. firebaseInitialized:', window.firebaseInitialized);

// Test 2: Tester la lecture
if (window.firebaseDb) {
    window.firebaseDb.collection('leaderboard').limit(1).get()
        .then(snapshot => {
            console.log('✅ LECTURE OK - Documents:', snapshot.size);
        })
        .catch(error => {
            console.error('❌ ERREUR LECTURE:', error.code, error.message);
            if (error.code === 'permission-denied') {
                console.error('🔒 PROBLÈME: Règles Firestore bloquent la lecture');
            }
        });
} else {
    console.error('❌ firebaseDb est undefined');
}

// Test 3: Tester l'écriture
if (window.firebaseDb) {
    window.firebaseDb.collection('leaderboard').add({
        name: 'Test',
        score: 999,
        level: 1,
        date: firebase.firestore.Timestamp.now()
    })
    .then(docRef => {
        console.log('✅ ÉCRITURE OK - Document ID:', docRef.id);
        // Supprimer le document de test
        docRef.delete();
    })
    .catch(error => {
        console.error('❌ ERREUR ÉCRITURE:', error.code, error.message);
        if (error.code === 'permission-denied') {
            console.error('🔒 PROBLÈME: Règles Firestore bloquent l\'écriture');
        }
    });
} else {
    console.error('❌ firebaseDb est undefined');
}
```

## Étape 4 : Analyser les Résultats

### Scénario A : `firebaseDb` est `undefined`

**Problème** : Firebase n'est pas initialisé

**Solution** :
1. Vérifiez que les scripts Firebase se chargent (onglet Network → chercher `firebase`)
2. Vérifiez qu'il n'y a pas de bloqueur de publicité
3. Videz le cache du navigateur
4. Testez en navigation privée

### Scénario B : Erreur `permission-denied` à la lecture

**Problème** : Les règles Firestore bloquent la lecture

**Solution** :
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Projet **oscar-baer** → Firestore Database → Rules
3. Vérifiez que vous avez : `allow read: if true;`
4. Cliquez sur **"Publier"**
5. Attendez 20 secondes

### Scénario C : Erreur `permission-denied` à l'écriture

**Problème** : Les règles Firestore bloquent l'écriture

**Solution** :
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Projet **oscar-baer** → Firestore Database → Rules
3. Vérifiez que vous avez : `allow create: if true;`
4. Cliquez sur **"Publier"**
5. Attendez 20 secondes

### Scénario D : Erreur `failed-precondition` ou `index`

**Problème** : Index Firestore manquant

**Solution** :
1. Cliquez sur le lien dans l'erreur pour créer l'index
2. OU attendez quelques minutes (Firebase crée l'index automatiquement)
3. Le leaderboard fonctionnera sans index (tri côté client)

### Scénario E : Erreur `unavailable` ou `network-error`

**Problème** : Connexion internet ou Firebase indisponible

**Solution** :
1. Vérifiez votre connexion internet
2. Attendez quelques minutes et réessayez
3. Le leaderboard utilisera localStorage en attendant

## Étape 5 : Vérifier les Règles Firestore

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Projet **oscar-baer** → Firestore Database → Rules
3. Les règles DOIVENT être **exactement** :

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

4. **PAS d'autres règles**, **PAS de règles par défaut**, **JUSTE ça**
5. Cliquez sur **"Publier"**
6. Attendez 20 secondes

## Étape 6 : Utiliser le Simulateur Firebase

1. Dans Firebase Console → Firestore Database → Rules
2. Cliquez sur **"Simulateur"** (en haut à droite)
3. Testez une lecture :
   - Type: `get`
   - Location: `leaderboard/test123`
   - Cliquez sur **"Run"**
4. Testez une écriture :
   - Type: `create`
   - Location: `leaderboard/test123`
   - Data: `{ name: "Test", score: 100, level: 1, date: request.time }`
   - Cliquez sur **"Run"**

Si le simulateur échoue, les règles ne sont pas correctes.

## 🆘 Envoyer les Résultats

Si rien ne fonctionne, envoyez-moi :

1. **Les résultats des tests** (étape 3)
2. **Une capture d'écran** des règles Firestore
3. **Les erreurs exactes** de la console
4. **Le résultat du simulateur** Firebase

Avec ces informations, je pourrai identifier le problème exact.

