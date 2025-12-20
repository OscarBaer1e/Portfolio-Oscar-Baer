# 🔴 URGENT : Copier-Coller les Règles Firestore

## Le problème : Permission Denied

Si vous obtenez "permission denied", c'est que les règles Firestore ne sont **pas correctement publiées** dans Firebase Console.

## ✅ Solution en 3 étapes (2 minutes)

### Étape 1 : Ouvrir Firebase Console

1. Allez sur : https://console.firebase.google.com/
2. Cliquez sur votre projet **oscar-baer**

### Étape 2 : Aller dans les Règles

1. Dans le menu de gauche, cliquez sur **Firestore Database**
2. Cliquez sur l'onglet **Rules** (en haut, à côté de "Data")

### Étape 3 : Copier-Coller et Publier

1. **SUPPRIMEZ TOUT** ce qui est dans l'éditeur de règles
2. **COLLEZ EXACTEMENT** ceci (sans rien modifier) :

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

3. Cliquez sur le bouton **"Publier"** (en haut à droite, bouton bleu)
4. **ATTENDEZ 10-20 secondes** (les règles doivent se propager)

### Étape 4 : Vérifier

1. Après 10-20 secondes, rechargez votre page de test
2. Les tests devraient maintenant passer ✅

## ⚠️ Points importants

- ✅ **Ne modifiez RIEN** dans le code collé
- ✅ Cliquez bien sur **"Publier"** (pas juste "Enregistrer")
- ✅ **Attendez 10-20 secondes** après avoir publié
- ✅ Vérifiez qu'il n'y a **pas d'erreur rouge** en haut de la page

## 🔍 Vérification visuelle

Après avoir collé, vous devriez voir exactement ceci dans l'éditeur :

```
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

**Pas de commentaires supplémentaires, pas de règles supplémentaires, juste ça.**

## 🆘 Si ça ne marche toujours pas

1. **Vérifiez que Firestore est activé** :
   - Dans Firestore Database, vous devriez voir "Data" et "Rules"
   - Si vous voyez "Créer une base de données", créez-la d'abord

2. **Videz le cache du navigateur** :
   - Chrome/Edge : `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Cochez "Images et fichiers en cache"
   - Cliquez sur "Effacer les données"

3. **Testez en navigation privée** :
   - Ouvrez une fenêtre de navigation privée
   - Testez à nouveau

4. **Vérifiez les logs dans Firebase Console** :
   - Firestore Database → Usage
   - Regardez s'il y a des tentatives d'accès

## 📸 Capture d'écran de référence

L'éditeur de règles devrait ressembler à ça :

```
┌─────────────────────────────────────────┐
│ Rules                                    │
├─────────────────────────────────────────┤
│ rules_version = '2';                     │
│ service cloud.firestore {                │
│   match /databases/{database}/documents {│
│     match /leaderboard/{document=**} {   │
│       allow read: if true;               │
│       allow create: if true;             │
│       allow update, delete: if false;    │
│     }                                    │
│   }                                      │
│ }                                        │
└─────────────────────────────────────────┘
```

**C'est exactement ce que vous devez avoir, rien de plus, rien de moins.**

