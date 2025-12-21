# ⚡ Firebase CLI - Démarrage rapide

## ✅ Installation terminée

Firebase CLI est maintenant installé **localement** dans votre projet.

---

## 🚀 Commandes disponibles

Toutes les commandes utilisent `npx firebase` au lieu de `firebase` :

### 1. Se connecter à Firebase

```bash
npm run firebase:login
```

Ou directement :

```bash
npx firebase login
```

Cela ouvrira votre navigateur pour vous authentifier.

---

### 2. Initialiser Firebase Hosting (si vous voulez l'utiliser)

```bash
npm run firebase:init
```

Ou directement :

```bash
npx firebase init hosting
```

**Note :** Vous utilisez actuellement Vercel, donc cette étape est **optionnelle**.

---

### 3. Déployer sur Firebase Hosting (si configuré)

```bash
npm run firebase:deploy
```

Ou directement :

```bash
npx firebase deploy --only hosting
```

---

## 📋 Scripts npm ajoutés

J'ai ajouté ces scripts dans `package.json` :

- `npm run firebase:login` - Se connecter à Firebase
- `npm run firebase:init` - Initialiser Firebase Hosting
- `npm run firebase:deploy` - Déployer sur Firebase Hosting
- `npm run firebase:serve` - Tester localement

---

## ⚠️ Important : Vercel vs Firebase Hosting

Vous utilisez actuellement **Vercel** pour l'hébergement. Vous n'avez **pas besoin** de Firebase Hosting sauf si vous voulez :

- ✅ Héberger directement sur Firebase
- ✅ Utiliser les fonctionnalités spécifiques à Firebase Hosting
- ✅ Avoir une URL `*.web.app` ou `*.firebaseapp.com`

**Recommandation :** Continuez avec Vercel si ça fonctionne bien. Firebase Hosting est utile pour les projets qui utilisent beaucoup de services Firebase.

---

## 🔍 Vérification

Testez que Firebase CLI fonctionne :

```bash
npx firebase --version
```

Vous devriez voir la version installée.

---

## 📚 Documentation complète

Consultez `FIREBASE_HOSTING_SETUP.md` pour plus de détails.

---

**Dernière mise à jour** : 21 décembre 2025

