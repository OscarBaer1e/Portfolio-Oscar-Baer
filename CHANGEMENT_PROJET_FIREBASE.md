# 🔄 Changement de projet Firebase

## ✅ Changement effectué

Le projet Firebase a été changé de **"oscar-baer"** à **"Leaderboard"**.

### ProjectId mis à jour : `leaderboard`

**Note :** Le projectId Firebase est en minuscules (`leaderboard`) même si le nom d'affichage du projet est "Leaderboard".

---

## 📝 Fichiers modifiés

1. ✅ `js/firebase-init-centralized.js` - Configuration principale
2. ✅ `pages/basketball-game.html` - Configuration dans le HTML
3. ✅ `js/space-shooter.js` - Configuration de fallback

---

## ⚠️ Important : Vérifier les autres valeurs

Si vous avez créé un **nouveau projet Firebase** (pas juste renommé), vous devez aussi mettre à jour :

### 1. API Key
- Allez sur [Firebase Console](https://console.firebase.google.com/)
- Sélectionnez le projet **Leaderboard**
- Project Settings → General → Your apps → Web app
- Copiez la **API Key**

### 2. Auth Domain
- Généralement : `leaderboard.firebaseapp.com`
- Vérifiez dans Project Settings → General

### 3. Storage Bucket
- Généralement : `leaderboard.firebasestorage.app`
- Vérifiez dans Project Settings → General

### 4. Messaging Sender ID
- Vérifiez dans Project Settings → General → Your apps

### 5. App ID
- Vérifiez dans Project Settings → General → Your apps → Web app

---

## 🔧 Comment mettre à jour les valeurs

### Option 1 : Via Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet **Leaderboard**
3. Cliquez sur l'icône ⚙️ (Settings) → **Project settings**
4. Allez dans l'onglet **General**
5. Dans la section **Your apps**, sélectionnez votre app web
6. Copiez les valeurs de configuration

### Option 2 : Via le code

Modifiez `js/firebase-init-centralized.js` :

```javascript
const FIREBASE_CONFIG = {
    apiKey: "VOTRE_NOUVELLE_API_KEY",
    authDomain: "leaderboard.firebaseapp.com",
    projectId: "leaderboard",
    storageBucket: "leaderboard.firebasestorage.app",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
```

---

## ✅ Vérification

Après avoir mis à jour les valeurs :

1. **Videz le cache** : `Ctrl+Shift+Delete` → Cache → Effacer
2. **Rechargez la page** : `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)
3. **Ouvrez la console** (F12) et testez :

```javascript
// Vérifier le projectId
console.log('projectId:', window.firebaseApp?.options?.projectId);
// Doit afficher : "leaderboard"

// Diagnostic complet
window.diagnosticFirebase();

// Test de connexion
window.firebaseDb?.collection('leaderboard').limit(1).get()
    .then(s => console.log('✅ OK - Documents:', s.size))
    .catch(e => console.error('❌ Erreur:', e.code));
```

---

## 🚨 Si vous avez des erreurs

### Erreur : `permission-denied`

**Solution :** Vérifiez les règles Firestore dans Firebase Console :
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet **Leaderboard**
3. Firestore Database → Rules
4. Assurez-vous que les règles permettent la lecture/écriture

### Erreur : `YOUR_PROJECT_ID`

**Solution :** Réinitialisez Firebase :
```javascript
window.reinitFirebase();
```

### Erreur : `project not found`

**Solution :** Vérifiez que :
1. Le projectId est bien `leaderboard` (minuscules)
2. Le projet existe dans Firebase Console
3. Firestore est activé dans le projet

---

## 📋 Checklist

- [ ] ProjectId mis à jour à `leaderboard` ✅
- [ ] API Key mise à jour (si nouveau projet)
- [ ] Auth Domain mis à jour (si nouveau projet)
- [ ] Storage Bucket mis à jour (si nouveau projet)
- [ ] Messaging Sender ID mis à jour (si nouveau projet)
- [ ] App ID mis à jour (si nouveau projet)
- [ ] Règles Firestore configurées
- [ ] Test de connexion réussi

---

**Dernière mise à jour** : 21 décembre 2025

