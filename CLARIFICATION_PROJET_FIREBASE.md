# 📋 Clarification : Nom vs ID du projet Firebase

## ✅ Information importante

Le projet Firebase a été **renommé** mais l'**ID du projet** reste le même.

### Nom du projet (affichage)
- **Nom** : `Leaderboard`
- C'est le nom d'affichage dans Firebase Console
- Peut être changé à tout moment

### ID du projet (technique)
- **ID** : `oscar-baer`
- C'est l'identifiant technique utilisé dans le code
- **NE CHANGE JAMAIS** même si vous renommez le projet
- Utilisé dans les URLs, les domaines, etc.

---

## 🔧 Configuration actuelle

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
    authDomain: "oscar-baer.firebaseapp.com",
    projectId: "oscar-baer", // ← ID du projet (ne change pas)
    storageBucket: "oscar-baer.firebasestorage.app",
    messagingSenderId: "419618942184",
    appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};
```

**Note :** Le `projectId` est `oscar-baer` même si le nom du projet est "Leaderboard".

---

## 📝 Domaines Firebase

Les domaines Firebase sont basés sur l'**ID du projet**, pas le nom :

- `authDomain`: `oscar-baer.firebaseapp.com`
- `storageBucket`: `oscar-baer.firebasestorage.app`
- URLs Firestore: `https://firestore.googleapis.com/v1/projects/oscar-baer/...`

---

## ✅ Vérification

Dans Firebase Console :
- **Nom du projet** : Leaderboard ✅
- **ID du projet** : oscar-baer ✅

Dans le code :
- `projectId: "oscar-baer"` ✅

---

## 🚨 Important

**Ne changez JAMAIS le `projectId` dans le code** même si vous renommez le projet dans Firebase Console. L'ID du projet est permanent et ne peut pas être modifié.

---

**Dernière mise à jour** : 21 décembre 2025

