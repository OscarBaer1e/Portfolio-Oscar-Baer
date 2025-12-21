# ✅ Guide : Activer les fonctionnalités dans Vercel

**ID Projet Vercel** : `prj_3M3FDPbZ42b7B9RrCGpOlmoA67Hf`

## 🎯 Ce qu'il faut activer dans Vercel

### 1️⃣ **Installation automatique des dépendances npm**

**Où** : Settings → General → Build & Development Settings

**À vérifier** :
- ✅ **Install Command** : Doit être `npm install` (ou laisser vide pour auto-détection)
- ✅ **Build Command** : Peut être vide (site statique) ou `npm run build` si vous avez un script
- ✅ **Output Directory** : `.` (racine) ou laisser vide

**Action** :
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **Portfolio-Oscar-Baer**
3. Cliquez sur **Settings**
4. Dans **General**, vérifiez **Build & Development Settings**
5. Si "Install Command" est vide, Vercel détectera automatiquement `npm install` grâce à `package.json`

---

### 2️⃣ **Support des modules ES6 (Important !)**

**Problème** : Les modules ES6 (`import`) nécessitent un serveur qui les résout.

**Solution** : Vercel doit servir les fichiers avec les bons headers.

**Où** : Le fichier `vercel.json` est déjà configuré, mais vérifiez :

**Action** :
1. Vérifiez que `vercel.json` existe dans votre projet
2. Si vous modifiez `vercel.json`, redéployez

**Alternative** : Si les modules ES6 ne fonctionnent pas, on peut revenir à CDN (voir section 5)

---

### 3️⃣ **Variables d'environnement (Optionnel)**

**Où** : Settings → Environment Variables

**Note** : Les variables Firebase sont déjà hardcodées dans le code, donc **pas obligatoire**. Mais si vous voulez les configurer :

**Variables à ajouter** (si vous le souhaitez) :
- `FIREBASE_API_KEY` = `AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM`
- `FIREBASE_AUTH_DOMAIN` = `oscar-baer.firebaseapp.com`
- `FIREBASE_PROJECT_ID` = `oscar-baer`
- `FIREBASE_STORAGE_BUCKET` = `oscar-baer.firebasestorage.app`
- `FIREBASE_MESSAGING_SENDER_ID` = `419618942184`
- `FIREBASE_APP_ID` = `1:419618942184:web:60e8e58c6c3348a3fbad5d`

**Cochez** : ✅ Production, ✅ Preview, ✅ Development

---

### 4️⃣ **Node.js Version**

**Où** : Settings → General → Node.js Version

**À vérifier** :
- ✅ **Node.js Version** : `18.x` ou `20.x` (recommandé)
- Si vide, Vercel utilisera la dernière LTS

**Action** :
1. Settings → General
2. Vérifiez "Node.js Version"
3. Si vide, sélectionnez `20.x` (recommandé)

---

### 5️⃣ **Framework Preset (Optionnel)**

**Où** : Settings → General → Framework Preset

**À vérifier** :
- Peut être laissé sur **"Other"** ou **"Vite"** si vous utilisez Vite
- Pour un site statique simple, **"Other"** est parfait

---

### 6️⃣ **Headers HTTP (Déjà configuré)**

**Où** : Le fichier `vercel.json` contient déjà les headers

**Vérification** : Les headers suivants sont déjà configurés :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

**Action** : Aucune action nécessaire, c'est déjà fait ✅

---

## 🔧 Configuration actuelle dans `vercel.json`

Votre `vercel.json` actuel :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [...],
  "headers": [...]
}
```

**Problème potentiel** : `@vercel/static` sert les fichiers statiquement, mais ne résout pas les modules ES6.

---

## ⚠️ Solution : Mettre à jour `vercel.json` pour les modules ES6

Pour que les modules npm fonctionnent, il faut que Vercel :
1. Installe les dépendances (`npm install`)
2. Sert les fichiers avec les bons MIME types

**Option A : Configuration automatique (Recommandé)**

Vercel détecte automatiquement `package.json` et installe les dépendances. Mais pour servir les modules ES6, il faut un serveur qui les résout.

**Option B : Utiliser un bundler (Meilleure solution)**

Créer un script de build qui bundle les modules.

**Option C : Revenir à CDN (Solution simple)**

Si les modules ES6 posent problème, on peut revenir à CDN (voir section suivante).

---

## 🚀 Checklist avant déploiement

Avant de déployer, vérifiez :

- [ ] **package.json** contient `firebase` dans les dépendances ✅
- [ ] **vercel.json** existe et est correct ✅
- [ ] **Node.js Version** est définie (18.x ou 20.x) dans Vercel
- [ ] **Install Command** est `npm install` ou vide (auto-détection)
- [ ] **Build Command** est vide ou `npm run build` (si vous avez un script)
- [ ] **Output Directory** est `.` ou vide

---

## 🐛 Si les modules ES6 ne fonctionnent pas sur Vercel

### Symptômes :
- Erreur : `Cannot use import statement outside a module`
- Erreur : `Failed to resolve module 'firebase/app'`
- `window.firebaseDb` est `undefined`

### Solutions :

#### Solution 1 : Vérifier que `node_modules` est installé

Vercel doit installer les dépendances. Vérifiez dans les logs de build :
1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Regardez les logs de build
4. Vous devriez voir : `Installing dependencies...` et `npm install`

#### Solution 2 : Ajouter un script de build

Créez un `package.json` avec un script de build (optionnel) :

```json
{
  "scripts": {
    "build": "echo 'Build complete'"
  },
  "dependencies": {
    "firebase": "^12.7.0",
    "gsap": "^3.14.2"
  }
}
```

#### Solution 3 : Revenir à CDN (Solution de secours)

Si les modules ES6 ne fonctionnent toujours pas, on peut revenir à CDN. Dites-moi et je ferai le changement.

---

## 📝 Résumé des actions à faire

### Actions obligatoires :
1. ✅ Vérifier que `package.json` contient `firebase` (déjà fait)
2. ✅ Vérifier que `vercel.json` existe (déjà fait)
3. ⚠️ **Vérifier Node.js Version** dans Vercel Settings → General
4. ⚠️ **Vérifier Install Command** dans Vercel Settings → General

### Actions optionnelles :
- Ajouter les variables d'environnement Firebase (déjà hardcodées dans le code)
- Configurer un Framework Preset (pas nécessaire pour site statique)

---

## 🔍 Vérification après déploiement

1. Allez sur votre site Vercel
2. Ouvrez la console du navigateur (F12)
3. Vérifiez les messages :
   - ✅ `Firebase initialisé avec succès (npm)`
   - ✅ `window.firebaseDb: [object Object]`
4. Testez le leaderboard

---

## 📞 Si ça ne marche toujours pas

1. **Vérifiez les logs de build** dans Vercel :
   - Allez dans **Deployments** → Cliquez sur le dernier déploiement
   - Regardez s'il y a des erreurs lors de `npm install`

2. **Vérifiez la console du navigateur** :
   - Ouvrez F12 → Console
   - Regardez les erreurs

3. **Testez en local** :
   - `npm install`
   - `python3 -m http.server 8000`
   - Ouvrez `http://localhost:8000/pages/basketball-game.html`

4. **Si rien ne fonctionne** : On peut revenir à CDN (plus simple mais moins moderne)

---

**Dernière mise à jour** : 21 décembre 2025

