# 📋 Variables d'Environnement Vercel - Guide Simple

## ⚠️ IMPORTANT : C'est optionnel !

**Les clés Supabase sont déjà dans le code** et fonctionnent parfaitement. Vous n'avez **PAS besoin** de configurer les variables d'environnement pour que ça fonctionne.

---

## ✅ Option 1 : Ne rien faire (Recommandé)

**Le site fonctionne déjà !** Les clés sont dans `js/supabase-init.js` et c'est suffisant.

---

## 🔧 Option 2 : Ajouter les variables dans Vercel (Optionnel)

Si vous voulez utiliser les variables d'environnement Vercel :

### 1. Allez dans Vercel Dashboard

1. **Connectez-vous** sur https://vercel.com/
2. **Sélectionnez votre projet**
3. **Settings** → **Environment Variables**
4. **Cliquez sur "Add New"**

### 2. Ajoutez ces 2 variables :

#### Variable 1 :
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://xqpsvwtcvoggbkcjuelq.supabase.co`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 2 :
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `sb_publishable_zpaJPneM812wOeCBs3uO-A_yhx693Vp`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

### 3. Redéployez

1. **Deployments** → **3 points** (⋯) → **Redeploy**
2. **C'est tout !**

---

## 📝 Fichier de référence

Voir `VERCEL_ENV_VARIABLES.txt` pour copier-coller les valeurs.

---

## 🎯 Résumé

- ✅ **Option 1** : Ne rien faire → Ça fonctionne déjà !
- 🔧 **Option 2** : Ajouter les variables → Pour plus de flexibilité

**Les deux options fonctionnent !** Choisissez celle que vous préférez.

---

**Dernière mise à jour** : 21 décembre 2025

