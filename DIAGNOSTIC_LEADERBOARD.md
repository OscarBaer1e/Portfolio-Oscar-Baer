# 🔍 Diagnostic Leaderboard Supabase

## 🚨 Problème : Le leaderboard ne reçoit aucune information

### ✅ Étapes de diagnostic

#### 1. Vérifier que Supabase est initialisé

Ouvrez la console (F12) et tapez :

```javascript
window.diagnosticSupabase();
```

**Vous devriez voir :**
- ✅ `Supabase SDK chargé: true`
- ✅ `window.supabaseClient: [object]`
- ✅ `window.supabaseInitialized: true`
- ✅ `Connexion OK - Documents: X`

**Si vous voyez des erreurs :**
- ❌ `Supabase SDK non chargé` → Vérifiez que le script Supabase est chargé
- ❌ `Configuration Supabase non définie` → Vérifiez `js/supabase-init.js`

---

#### 2. Vérifier la table dans Supabase

1. **Allez sur** https://supabase.com/dashboard
2. **Votre projet** → **Table Editor**
3. **Vérifiez** que la table `leaderboard` existe

**Si la table n'existe pas :**
- Créez-la (voir `SETUP_SUPABASE.md` étape 3-4)
- Colonnes nécessaires : `id`, `name`, `score`, `level`, `created_at`

---

#### 3. Vérifier les politiques RLS (Row Level Security)

1. **Table Editor** → Table `leaderboard` → Onglet **"Policies"**
2. **Vérifiez** que vous avez **2 policies** :

   **Policy 1 : SELECT (Lecture)**
   - Nom : `Allow public read`
   - Operation : `SELECT`
   - Policy definition : `true`

   **Policy 2 : INSERT (Écriture)**
   - Nom : `Allow public insert`
   - Operation : `INSERT`
   - Policy definition : `true`

**Si les policies n'existent pas :**
- Créez-les (voir `SETUP_SUPABASE.md` étape 6)
- **IMPORTANT** : RLS doit être **activé** mais avec des policies qui permettent tout

---

#### 4. Tester manuellement la sauvegarde

Dans la console, tapez :

```javascript
// Tester la sauvegarde
window.supabaseLeaderboard.save('Test', 1000, 1).then(success => {
    console.log('Résultat:', success);
});
```

**Si vous voyez une erreur :**
- Notez le code d'erreur (ex: `PGRST116`, `42501`, `42P01`)
- Voir les solutions ci-dessous

---

#### 5. Tester manuellement le chargement

Dans la console, tapez :

```javascript
// Tester le chargement
window.supabaseLeaderboard.load().then(data => {
    console.log('Scores chargés:', data);
});
```

**Si vous voyez une erreur :**
- Notez le message d'erreur
- Vérifiez les politiques RLS (étape 3)

---

## 🔧 Solutions selon l'erreur

### Erreur `PGRST116` ou `42501` : Permission Denied

**Cause** : Les politiques RLS bloquent l'accès

**Solution** :
1. Supabase Dashboard → Table Editor → `leaderboard` → Policies
2. Créez les 2 policies (SELECT et INSERT avec `true`)
3. Vérifiez que RLS est activé mais les policies permettent tout

---

### Erreur `42P01` : Table non trouvée

**Cause** : La table `leaderboard` n'existe pas

**Solution** :
1. Supabase Dashboard → Table Editor → New Table
2. Nom : `leaderboard`
3. Ajoutez les colonnes : `id`, `name`, `score`, `level`, `created_at`
4. Voir `SETUP_SUPABASE.md` étape 3-4

---

### Erreur : Supabase non initialisé

**Cause** : Le script Supabase n'est pas chargé

**Solution** :
1. Vérifiez que `js/supabase-init.js` est chargé dans le HTML
2. Vérifiez la console pour les erreurs de chargement
3. Vérifiez que l'URL et la clé API sont correctes

---

## ✅ Vérification finale

Après avoir corrigé le problème :

1. **Rechargez la page** : `Cmd + Shift + R`
2. **Ouvrez la console** : `Cmd + Option + I`
3. **Testez** : `window.diagnosticSupabase()`
4. **Vous devriez voir** : `✅ Connexion OK`

---

## 📝 Checklist

- [ ] Supabase initialisé (`window.diagnosticSupabase()` fonctionne)
- [ ] Table `leaderboard` existe dans Supabase
- [ ] Colonnes correctes : `id`, `name`, `score`, `level`, `created_at`
- [ ] 2 policies RLS créées (SELECT et INSERT avec `true`)
- [ ] RLS activé mais policies permettent tout
- [ ] Test de sauvegarde fonctionne
- [ ] Test de chargement fonctionne

---

**Dernière mise à jour** : 21 décembre 2025

