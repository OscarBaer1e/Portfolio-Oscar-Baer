# 🔧 Configuration Firebase avec npm

## ✅ Changements effectués

Firebase est maintenant installé via **npm** au lieu de CDN.

### Fichiers modifiés :

1. **`package.json`** : Firebase ajouté aux dépendances
2. **`js/firebase-init.js`** : Nouveau fichier d'initialisation Firebase (modules ES6)
3. **`pages/basketball-game.html`** : Utilise maintenant le module npm au lieu de CDN
4. **`js/space-shooter.js`** : Fonction `waitForFirebase` mise à jour pour npm

---

## 🚀 Installation

Les dépendances sont déjà installées. Si vous clonez le projet, exécutez :

```bash
npm install
```

---

## 🏃 Développement local

### Option 1 : Serveur simple (recommandé)

Pour que les modules ES6 fonctionnent, vous avez besoin d'un serveur HTTP :

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (avec http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000/pages/basketball-game.html`

### Option 2 : Vite (développement moderne)

Si vous voulez un serveur de développement plus avancé :

```bash
npm install -D vite
npx vite
```

---

## 📦 Déploiement sur Vercel

Vercel gère automatiquement les modules ES6 et npm. Aucune configuration supplémentaire n'est nécessaire.

**Important** : Assurez-vous que `node_modules` est bien dans votre dépôt Git (ou que Vercel peut installer les dépendances).

---

## 🔍 Vérification

### Dans la console du navigateur :

```javascript
// Vérifier que Firebase est initialisé
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);

// Test de connexion
window.firebaseDb.collection('leaderboard').limit(1).get()
    .then(s => console.log('✅ OK - Documents:', s.size))
    .catch(e => console.error('❌ Erreur:', e.code));
```

---

## 🔄 Différences avec CDN

### Avant (CDN) :
- Scripts chargés depuis `gstatic.com`
- Variable globale `firebase` disponible
- Compatible avec tous les navigateurs

### Maintenant (npm) :
- Modules ES6 importés depuis `node_modules`
- Pas de variable globale `firebase`
- Nécessite un serveur HTTP (pas de `file://`)
- Plus moderne et maintenable

---

## 🐛 Dépannage

### Erreur : `Cannot use import statement outside a module`

**Solution** : Utilisez un serveur HTTP (voir section "Développement local")

### Erreur : `Failed to resolve module 'firebase/app'`

**Solution** : 
```bash
npm install
```

### Erreur : `window.firebaseDb is undefined`

**Solution** : Vérifiez que `firebase-init.js` se charge correctement :
1. Ouvrez l'onglet **Network** dans les DevTools
2. Vérifiez que `firebase-init.js` se charge (statut 200)
3. Vérifiez la console pour les erreurs

---

## 📝 Structure

```
Portfolio-Oscar-Baer-main/
├── node_modules/
│   └── firebase/          ← Firebase installé via npm
├── js/
│   ├── firebase-init.js   ← Initialisation Firebase (nouveau)
│   └── space-shooter.js   ← Utilise window.firebaseDb
├── pages/
│   └── basketball-game.html ← Charge firebase-init.js
└── package.json           ← Dépendances npm
```

---

## ✅ Avantages de npm

1. **Version contrôlée** : Version exacte de Firebase dans `package.json`
2. **Pas de dépendance CDN** : Fonctionne hors ligne (après `npm install`)
3. **Tree-shaking** : Seulement les modules nécessaires sont importés
4. **Meilleure intégration** : Compatible avec les bundlers modernes
5. **Mises à jour** : Facile à mettre à jour avec `npm update firebase`

---

**Dernière mise à jour** : 20 décembre 2025

