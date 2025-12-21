# ✅ Checklist Vercel - Version Simple

**ID Projet** : `prj_3M3FDPbZ42b7B9RrCGpOlmoA67Hf`

## 🎯 Ce que vous DEVEZ vérifier dans Vercel

### 1. Settings → General

**Ouvrez** : https://vercel.com/dashboard → Votre projet → **Settings** → **General**

**Vérifiez** :

#### Node.js Version
- [ ] Doit être **`20.x`** ou **`18.x`** (recommandé : `20.x`)
- [ ] Si c'est vide, sélectionnez `20.x`

#### Build & Development Settings
- [ ] **Install Command** : Doit être `npm install` ou **vide** (Vercel détecte automatiquement)
- [ ] **Build Command** : Peut être **vide** (site statique) ou `npm run build`
- [ ] **Output Directory** : Doit être **`.`** (point) ou **vide**

#### Framework Preset
- [ ] Peut rester sur **"Other"** (c'est parfait pour un site statique)

---

### 2. Settings → Environment Variables (Optionnel)

**Note** : Les variables Firebase sont déjà hardcodées dans le code, donc **pas obligatoire**.

Si vous voulez les ajouter quand même :

- [ ] `FIREBASE_API_KEY` = `AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM`
- [ ] `FIREBASE_AUTH_DOMAIN` = `oscar-baer.firebaseapp.com`
- [ ] `FIREBASE_PROJECT_ID` = `oscar-baer`
- [ ] `FIREBASE_STORAGE_BUCKET` = `oscar-baer.firebasestorage.app`
- [ ] `FIREBASE_MESSAGING_SENDER_ID` = `419618942184`
- [ ] `FIREBASE_APP_ID` = `1:419618942184:web:60e8e58c6c3348a3fbad5d`

**Cochez** : ✅ Production, ✅ Preview, ✅ Development

---

### 3. Vérifier le déploiement

**Ouvrez** : **Deployments** → Cliquez sur le dernier déploiement

**Vérifiez dans les logs** :
- [ ] Vous voyez : `Installing dependencies...`
- [ ] Vous voyez : `npm install` qui s'exécute
- [ ] Vous voyez : `firebase` dans les packages installés
- [ ] **Pas d'erreurs** en rouge

---

## 🚨 Si les modules ES6 ne fonctionnent pas

### Option 1 : Vérifier que `node_modules` est bien installé

Dans les logs de build Vercel, vous devriez voir :
```
Installing dependencies...
npm install
```

Si vous ne voyez pas ça, Vercel n'installe pas les dépendances.

**Solution** : Vérifiez que `package.json` est bien à la racine du projet.

---

### Option 2 : Revenir à CDN (Solution de secours)

Si les modules npm ne fonctionnent toujours pas sur Vercel, on peut revenir à CDN (plus simple).

**Dites-moi** et je ferai le changement.

---

## ✅ Résumé rapide

**Actions obligatoires** :
1. ✅ Vérifier **Node.js Version** = `20.x` ou `18.x`
2. ✅ Vérifier **Install Command** = `npm install` ou vide
3. ✅ Vérifier que `package.json` existe à la racine

**Actions optionnelles** :
- Ajouter les variables d'environnement Firebase (déjà hardcodées)

**Vérification** :
- Regarder les logs de build pour voir si `npm install` s'exécute

---

## 🔍 Test après déploiement

1. Ouvrez votre site Vercel
2. F12 → Console
3. Vous devriez voir : `✅ Firebase initialisé avec succès (npm)`
4. Testez : `console.log(window.firebaseDb)` → Doit afficher un objet

---

**Besoin d'aide ?** Consultez `ACTIVER_VERCEL.md` pour plus de détails.

