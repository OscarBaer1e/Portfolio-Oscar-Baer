# 🔥 Initialisation Firebase - Documentation

## 📋 Vue d'ensemble

Firebase est initialisé de manière centralisée dans le fichier `js/firebase-init-centralized.js`.

Ce fichier :
- ✅ Initialise Firebase automatiquement au chargement de la page
- ✅ Expose toutes les variables nécessaires sur `window`
- ✅ Fournit des fonctions de diagnostic et de réinitialisation
- ✅ Gère les erreurs avec des logs clairs dans la console

---

## 🔧 Variables exposées sur `window`

### Variables principales

| Variable | Type | Description |
|----------|------|-------------|
| `window.firebaseApp` | `FirebaseApp` | Instance Firebase App |
| `window.firebaseDb` | `Firestore` | Instance Firestore Database |
| `window.firebaseTimestamp` | `Timestamp` | Classe Timestamp Firestore |
| `window.firebaseInitialized` | `boolean` | Indique si Firebase est initialisé |

### Exemple d'utilisation

```javascript
// Vérifier si Firebase est initialisé
if (window.firebaseInitialized && window.firebaseDb) {
    // Utiliser Firestore
    window.firebaseDb.collection('leaderboard').get()
        .then(snapshot => {
            console.log('Documents:', snapshot.size);
        });
}
```

---

## 🛠️ Fonctions exposées sur `window`

### `window.diagnosticFirebase()`

Affiche un diagnostic complet de l'état de Firebase dans la console.

**Utilisation :**
```javascript
window.diagnosticFirebase();
```

**Affiche :**
- ✅ Si Firebase SDK est chargé
- ✅ Nombre d'instances Firebase
- ✅ Détails de chaque instance (nom, projectId, apiKey)
- ✅ État des variables `window`
- ✅ Test de connexion Firestore

**Exemple de sortie :**
```
🔍 ============================================
🔍 DIAGNOSTIC FIREBASE
🔍 ============================================
1. Firebase SDK chargé: true
2. Nombre d'instances Firebase: 1
3. Instances Firebase:
   Instance 1: {name: "[DEFAULT]", projectId: "oscar-baer", ...}
4. Variables window:
   - window.firebaseApp: [object Object]
   - window.firebaseDb: [object Object]
   - window.firebaseTimestamp: [function]
   - window.firebaseInitialized: true
5. Configuration: {projectId: "oscar-baer", ...}
6. Test de connexion Firestore...
   ✅ Connexion OK - Documents: 5
============================================
```

---

### `window.reinitFirebase()`

Réinitialise Firebase en supprimant toutes les instances existantes et en créant une nouvelle instance.

**Utilisation :**
```javascript
window.reinitFirebase();
```

**Ce que fait la fonction :**
1. Supprime toutes les instances Firebase existantes
2. Réinitialise les variables `window`
3. Crée une nouvelle instance Firebase avec la bonne configuration
4. Expose les nouvelles variables sur `window`

**Quand l'utiliser :**
- Si `window.firebaseDb` est `undefined`
- Si vous voyez des erreurs `YOUR_PROJECT_ID`
- Si Firebase ne se connecte pas correctement

---

## 📝 Configuration Firebase

La configuration Firebase est définie dans `js/firebase-init-centralized.js` :

```javascript
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
    authDomain: "oscar-baer.firebaseapp.com",
    projectId: "oscar-baer",
    storageBucket: "oscar-baer.firebasestorage.app",
    messagingSenderId: "419618942184",
    appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};
```

**⚠️ Important :** Le `projectId` est vérifié et forcé à `"oscar-baer"` pour éviter les erreurs `YOUR_PROJECT_ID`.

---

## 🚀 Initialisation automatique

Firebase s'initialise automatiquement au chargement de la page :

1. **Chargement des scripts Firebase** (CDN)
2. **Exécution de `firebase-init-centralized.js`**
3. **Nettoyage des instances existantes** (si nécessaire)
4. **Initialisation avec la bonne configuration**
5. **Exposition des variables sur `window`**

---

## 🔍 Vérification dans la console

### Test rapide

Ouvrez la console du navigateur (F12) et testez :

```javascript
// 1. Vérifier les variables
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);

// 2. Diagnostic complet
window.diagnosticFirebase();

// 3. Test de connexion
if (window.firebaseDb) {
    window.firebaseDb.collection('leaderboard').limit(1).get()
        .then(s => console.log('✅ OK - Documents:', s.size))
        .catch(e => console.error('❌ Erreur:', e.code));
}
```

### Résultats attendus

✅ **Si tout fonctionne :**
- `window.firebaseApp` : `[object Object]`
- `window.firebaseDb` : `[object Object]`
- `window.firebaseInitialized` : `true`
- `window.diagnosticFirebase()` : Affiche un diagnostic complet
- `window.reinitFirebase()` : Réinitialise sans erreur

❌ **Si ça ne fonctionne pas :**
- `window.firebaseDb` : `undefined`
- `window.firebaseInitialized` : `false`
- Utilisez `window.diagnosticFirebase()` pour diagnostiquer
- Utilisez `window.reinitFirebase()` pour réinitialiser

---

## 🐛 Dépannage

### Problème : `window.firebaseDb` est `undefined`

**Solution 1 :** Vérifier que les scripts Firebase se chargent
```javascript
window.diagnosticFirebase();
// Vérifiez "1. Firebase SDK chargé: true"
```

**Solution 2 :** Réinitialiser Firebase
```javascript
window.reinitFirebase();
```

**Solution 3 :** Vérifier les bloqueurs de publicité
- Désactivez uBlock Origin, AdBlock, etc.
- Rechargez la page avec `Ctrl+F5`

---

### Problème : Erreur `YOUR_PROJECT_ID`

**Solution :** Réinitialiser Firebase
```javascript
window.reinitFirebase();
```

Le code force automatiquement `projectId` à `"oscar-baer"`, mais si une ancienne instance existe, elle peut causer des problèmes.

---

### Problème : `window.diagnosticFirebase is not a function`

**Solution :** Vérifier que `firebase-init-centralized.js` est chargé
1. Ouvrez l'onglet **Network** dans les DevTools
2. Vérifiez que `firebase-init-centralized.js` se charge (statut 200)
3. Vérifiez la console pour les erreurs de chargement

---

## 📂 Structure des fichiers

```
Portfolio-Oscar-Baer-main/
├── js/
│   ├── firebase-init-centralized.js  ← Initialisation Firebase (NOUVEAU)
│   └── space-shooter.js              ← Utilise window.firebaseDb
├── pages/
│   └── basketball-game.html          ← Charge firebase-init-centralized.js
└── FIREBASE_INITIALISATION.md        ← Cette documentation
```

---

## ✅ Checklist de vérification

Avant de considérer que Firebase fonctionne :

- [ ] `window.firebaseApp` n'est pas `undefined`
- [ ] `window.firebaseDb` n'est pas `undefined`
- [ ] `window.firebaseInitialized` est `true`
- [ ] `window.diagnosticFirebase()` s'exécute sans erreur
- [ ] `window.reinitFirebase()` s'exécute sans erreur
- [ ] Test de connexion Firestore fonctionne

---

## 📞 Commandes utiles dans la console

```javascript
// Diagnostic complet
window.diagnosticFirebase();

// Réinitialiser Firebase
window.reinitFirebase();

// Vérifier l'état
console.log({
    app: window.firebaseApp,
    db: window.firebaseDb,
    initialized: window.firebaseInitialized
});

// Test de connexion
window.firebaseDb?.collection('leaderboard').limit(1).get()
    .then(s => console.log('✅ OK:', s.size))
    .catch(e => console.error('❌ Erreur:', e));
```

---

**Dernière mise à jour** : 21 décembre 2025

