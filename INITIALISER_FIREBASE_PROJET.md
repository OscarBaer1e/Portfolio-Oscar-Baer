# 🚀 Initialiser le projet Firebase

## 📋 Étapes à suivre

### 1. Se connecter à Firebase

Ouvrez un terminal et exécutez :

```bash
npm run firebase:login
```

Cela ouvrira votre navigateur pour vous authentifier avec votre compte Google (oscarbaer524@gmail.com).

---

### 2. Vérifier le projet

Après la connexion, vérifiez que le projet est bien sélectionné :

```bash
npx firebase use oscar-baer
```

---

### 3. Initialiser Firestore (si pas déjà fait)

```bash
npx firebase init firestore
```

**Réponses aux questions :**
- **What file should be used for Firestore Rules?** : `firestore.rules` (déjà créé)
- **What file should be used for Firestore indexes?** : `firestore.indexes.json` (déjà créé)

---

### 4. Déployer les règles Firestore

```bash
npx firebase deploy --only firestore:rules
```

---

### 5. Déployer les index Firestore

```bash
npx firebase deploy --only firestore:indexes
```

---

## 📁 Fichiers créés

J'ai créé les fichiers suivants :

### `.firebaserc`
Configuration du projet Firebase (projet : `oscar-baer`)

### `firebase.json`
Configuration Firebase (Firestore + Hosting)

### `firestore.rules`
Règles de sécurité Firestore pour le leaderboard :
- ✅ Lecture publique
- ✅ Création libre
- ❌ Pas de modification/suppression

### `firestore.indexes.json`
Index pour optimiser les requêtes :
- Tri par `score` (descendant)
- Tri par `date` (descendant)

---

## 🗄️ Structure de la base de données

### Collection : `leaderboard`

Chaque document contient :

```javascript
{
  name: "Nom du joueur",        // string (max 20 caractères)
  score: 1234,                   // number
  level: 5,                      // number
  date: Timestamp,               // Firestore Timestamp
  // Optionnel :
  platform: "web",               // string
  gameMode: "normal"            // string
}
```

---

## ✅ Vérification

### Vérifier les règles

```bash
npx firebase firestore:rules:get
```

### Vérifier les index

```bash
npx firebase firestore:indexes
```

### Tester dans Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet **oscar-baer** (nom : Leaderboard)
3. Firestore Database → Data
4. Vous devriez voir la collection `leaderboard` (vide au début)

---

## 🚀 Commandes utiles

```bash
# Voir l'état actuel
npx firebase projects:list

# Utiliser un projet spécifique
npx firebase use oscar-baer

# Déployer tout
npx firebase deploy

# Déployer uniquement les règles
npx firebase deploy --only firestore:rules

# Déployer uniquement les index
npx firebase deploy --only firestore:indexes

# Voir les logs
npx firebase firestore:rules:get
```

---

## 📝 Prochaines étapes

1. ✅ Se connecter : `npm run firebase:login`
2. ✅ Déployer les règles : `npx firebase deploy --only firestore:rules`
3. ✅ Déployer les index : `npx firebase deploy --only firestore:indexes`
4. ✅ Tester le leaderboard dans votre jeu

---

## 🐛 Dépannage

### Erreur : "Project not found"

**Solution :** Vérifiez que vous êtes connecté et que le projet existe :

```bash
npx firebase projects:list
npx firebase use oscar-baer
```

### Erreur : "Permission denied"

**Solution :** Vérifiez que vous avez les droits sur le projet dans Firebase Console.

### Erreur : "Rules file not found"

**Solution :** Les fichiers `firestore.rules` et `firestore.indexes.json` sont déjà créés dans le projet.

---

**Dernière mise à jour** : 21 décembre 2025

