# 🚀 Configuration Firebase Hosting

## 📋 Installation Firebase CLI

### Option 1 : Installation globale (nécessite sudo)

```bash
sudo npm install -g firebase-tools
```

### Option 2 : Installation locale (recommandé, pas besoin de sudo)

```bash
npm install --save-dev firebase-tools
```

Puis utilisez `npx firebase` au lieu de `firebase`.

---

## 🔐 Connexion à Firebase

Après l'installation, connectez-vous :

```bash
firebase login
```

Ou si installation locale :

```bash
npx firebase login
```

Cela ouvrira votre navigateur pour vous authentifier.

---

## 🏗️ Initialisation Firebase Hosting

Dans le répertoire de votre projet :

```bash
firebase init hosting
```

Ou si installation locale :

```bash
npx firebase init hosting
```

### Questions posées :

1. **Select a default Firebase project** : Choisissez `oscar-baer` (ou le projet que vous voulez)
2. **What do you want to use as your public directory?** : `.` (point) ou `dist` si vous avez un build
3. **Configure as a single-page app?** : `No` (ou `Yes` si vous utilisez un router SPA)
4. **Set up automatic builds and deploys with GitHub?** : `No` (vous utilisez déjà Vercel)

---

## 📝 Fichiers créés

Après l'initialisation, Firebase créera :

- `.firebaserc` : Configuration du projet
- `firebase.json` : Configuration de Hosting

---

## ⚙️ Configuration `firebase.json`

Exemple de configuration pour un site statique :

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## 🚀 Déploiement

### Déploiement initial

```bash
firebase deploy --only hosting
```

Ou si installation locale :

```bash
npx firebase deploy --only hosting
```

### Déploiements suivants

```bash
firebase deploy
```

---

## 🔍 Vérification

Après le déploiement, vous obtiendrez une URL comme :
- `https://oscar-baer.web.app`
- `https://oscar-baer.firebaseapp.com`

---

## ⚠️ Important : Vercel vs Firebase Hosting

Vous utilisez actuellement **Vercel** pour l'hébergement. Vous avez deux options :

### Option 1 : Continuer avec Vercel (recommandé)
- ✅ Déploiement automatique depuis GitHub
- ✅ Fonctionnalités serverless (API routes)
- ✅ Pas besoin de Firebase Hosting

### Option 2 : Migrer vers Firebase Hosting
- ✅ Intégration native avec Firebase
- ✅ CDN global
- ⚠️ Pas de support pour les API routes serverless (sauf Cloud Functions)

---

## 📋 Commandes utiles

```bash
# Voir la liste des projets
firebase projects:list

# Voir les sites déployés
firebase hosting:sites:list

# Voir l'historique des déploiements
firebase hosting:channel:list

# Ouvrir le site dans le navigateur
firebase open hosting:site
```

---

## 🐛 Dépannage

### Erreur : Permission denied

**Solution :** Utilisez `sudo` ou installez localement :

```bash
npm install --save-dev firebase-tools
npx firebase login
```

### Erreur : Project not found

**Solution :** Vérifiez que vous êtes connecté et que le projet existe :

```bash
firebase projects:list
firebase use oscar-baer
```

### Erreur : Site not found

**Solution :** Créez un site dans Firebase Console :
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Hosting → Commencer

---

## 📚 Documentation

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

**Note :** Si vous continuez avec Vercel, vous n'avez pas besoin de configurer Firebase Hosting. Firebase Hosting est utile si vous voulez héberger directement sur Firebase.

---

**Dernière mise à jour** : 21 décembre 2025

