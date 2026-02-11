# 🧪 Page de Test - Space Shooter

## 📋 Description

Cette page de test permet de valider les modifications du jeu Space Shooter avant de les appliquer au jeu principal. Elle est **non accessible** depuis le site principal pour éviter toute confusion.

## 🚀 Utilisation

### 1. Accéder à la page de test

Ouvrez directement le fichier `test-space-shooter.html` dans votre navigateur :
- **Localement** : Double-cliquez sur `test-space-shooter.html`
- **Via serveur local** : `http://localhost/test-space-shooter.html`

### 2. Tester vos modifications

1. **Modifiez le fichier de test** : `js/test-space-shooter.js`
2. **Rechargez la page** dans votre navigateur
3. **Testez les fonctionnalités** modifiées :
   - Gameplay général
   - Système de boss
   - Power-ups
   - Leaderboard (Supabase)
   - Physique et collisions
4. **Validez** que tout fonctionne correctement

### 3. Appliquer les modifications au jeu principal

Une fois les tests validés :

1. **Copiez le contenu** de `js/test-space-shooter.js`
2. **Collez-le** dans `js/space-shooter.js`
3. **Vérifiez** que le jeu principal fonctionne toujours

## 📁 Fichiers concernés

- **Page de test** : `test-space-shooter.html`
- **Script de test** : `js/test-space-shooter.js`
- **Script principal** : `js/space-shooter.js` (à modifier uniquement après validation)
- **Dépendances** (utilisées par les deux versions) :
  - `js/supabase-init.js`
  - `js/space-shooter-supabase.js`
  - `js/block-firebase.js`

## ⚠️ Important

- **Ne modifiez JAMAIS** `js/space-shooter.js` directement sans avoir testé dans la version de test
- La page de test utilise les **mêmes CSS et dépendances** que le jeu principal pour garantir la cohérence
- Cette page **n'est pas liée** à la navigation du site principal
- Les fonctionnalités Supabase (leaderboard) sont incluses pour un test complet

## 🔄 Workflow recommandé

```
1. Modifier js/test-space-shooter.js
   ↓
2. Tester sur test-space-shooter.html
   ↓
3. Valider les modifications
   - Gameplay
   - Boss
   - Power-ups
   - Leaderboard
   ↓
4. Copier vers js/space-shooter.js
   ↓
5. Tester le jeu principal
```

## 💡 Avantages

- ✅ Pas de risque de casser le jeu principal
- ✅ Tests rapides et itératifs
- ✅ Validation avant déploiement
- ✅ Environnement isolé pour les expérimentations
- ✅ Test complet avec toutes les dépendances (Supabase, etc.)

## 🎮 Fonctionnalités testables

- ✅ Système de jeu principal
- ✅ Gestion des boss (1-10)
- ✅ Power-ups (rapid fire, shield, shrink, big bullets, triple shot, time slow, offensive shield, magnet)
- ✅ Système de score et leaderboard
- ✅ Physique et collisions
- ✅ Animations et effets visuels
- ✅ Mode normal et infini

## 📝 Notes

- Le fichier de test est une copie exacte du fichier principal au moment de sa création
- Toutes les modifications doivent être testées avant d'être appliquées
- En cas de problème, vous pouvez toujours restaurer depuis le fichier principal









