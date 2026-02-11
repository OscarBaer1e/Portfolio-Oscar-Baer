# 🧪 Page de Test - Basketball Game

## 📋 Description

Cette page de test permet de valider les modifications du jeu de basketball avant de les appliquer au jeu principal. Elle est **non accessible** depuis le site principal pour éviter toute confusion.

## 🚀 Utilisation

### 1. Accéder à la page de test

Ouvrez directement le fichier `test-basketball.html` dans votre navigateur :
- **Localement** : Double-cliquez sur `test-basketball.html`
- **Via serveur local** : `http://localhost/test-basketball.html`

### 2. Tester vos modifications

1. **Modifiez le fichier de test** : `js/test-basketball-game.js`
2. **Rechargez la page** dans votre navigateur
3. **Testez les fonctionnalités** modifiées
4. **Validez** que tout fonctionne correctement

### 3. Appliquer les modifications au jeu principal

Une fois les tests validés :

1. **Copiez le contenu** de `js/test-basketball-game.js`
2. **Collez-le** dans `js/basketball-game.js`
3. **Vérifiez** que le jeu principal fonctionne toujours

## 📁 Fichiers concernés

- **Page de test** : `test-basketball.html`
- **Script de test** : `js/test-basketball-game.js`
- **Script principal** : `js/basketball-game.js` (à modifier uniquement après validation)

## ⚠️ Important

- **Ne modifiez JAMAIS** `js/basketball-game.js` directement sans avoir testé dans la version de test
- La page de test utilise les **mêmes CSS** que le jeu principal pour garantir la cohérence
- Cette page **n'est pas liée** à la navigation du site principal

## 🔄 Workflow recommandé

```
1. Modifier js/test-basketball-game.js
   ↓
2. Tester sur test-basketball.html
   ↓
3. Valider les modifications
   ↓
4. Copier vers js/basketball-game.js
   ↓
5. Tester le jeu principal
```

## 💡 Avantages

- ✅ Pas de risque de casser le jeu principal
- ✅ Tests rapides et itératifs
- ✅ Validation avant déploiement
- ✅ Environnement isolé pour les expérimentations









