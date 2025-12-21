# 🔧 Configurer les Variables d'Environnement dans Vercel

## 📋 Étapes pour ajouter les variables dans Vercel

### 1. Allez dans Vercel Dashboard

1. **Connectez-vous** sur https://vercel.com/
2. **Sélectionnez votre projet** (Portfolio-Oscar-Baer)
3. **Allez dans** : **Settings** → **Environment Variables**

### 2. Ajoutez les variables

Cliquez sur **"Add New"** et ajoutez ces **2 variables** :

#### Variable 1 :
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://xqpsvwtcvoggbkcjuelq.supabase.co`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 2 :
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `sb_publishable_zpaJPneM812wOeCBs3uO-A_yhx693Vp`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

### 3. Redéployez

Après avoir ajouté les variables :

1. **Allez dans** : **Deployments**
2. **Cliquez sur** les **3 points** (⋯) du dernier déploiement
3. **Cliquez sur** **"Redeploy"**
4. **Cochez** "Use existing Build Cache" (optionnel)
5. **Cliquez sur** **"Redeploy"**

---

## ✅ Vérification

Après le redéploiement :

1. **Ouvrez votre site Vercel**
2. **Ouvrez la console** (F12)
3. **Testez** : `window.diagnosticSupabase()`
4. **Vous devriez voir** : `✅ Connexion OK`

---

## 📝 Notes importantes

### Pourquoi `NEXT_PUBLIC_` ?

Le préfixe `NEXT_PUBLIC_` est nécessaire pour que Vercel expose ces variables au client (navigateur). Sans ce préfixe, les variables ne seront pas accessibles dans le code JavaScript côté client.

### Valeurs par défaut

Le code utilise les variables d'environnement si disponibles, sinon il utilise les valeurs par défaut (déjà configurées dans le code). Donc même sans configurer les variables, ça fonctionne !

### Sécurité

Ces clés sont **publiques** et **sûres** pour le navigateur. C'est normal qu'elles soient visibles dans le code. Supabase utilise Row Level Security (RLS) pour protéger vos données.

---

## 🎯 Résumé

1. ✅ Vercel Dashboard → Settings → Environment Variables
2. ✅ Ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ✅ Redéployez
4. ✅ Testez avec `window.diagnosticSupabase()`

---

**Dernière mise à jour** : 21 décembre 2025

