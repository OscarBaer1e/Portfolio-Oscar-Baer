# 🔍 Diagnostic Complet - Insertion dans la Base de Données

## 🎯 Vérifications à Faire

### 1. Ouvrir la Console (F12)

Quand vous enregistrez un score, vous DEVEZ voir ces logs dans l'ordre :

```
💾 Sauvegarde du score dans Supabase...
📝 Données à enregistrer: {name: "...", score: ..., level: ...}
📦 Données formatées: {...}
📊 Réponse fonction SQL complète: {...}
```

**OU**

```
🔄 Fallback vers insertion directe...
📊 Réponse Supabase (insert direct): {data: [...], error: ...}
```

---

## 🔴 Si vous ne voyez AUCUN log

**Problème** : La fonction `registerScore()` n'est pas appelée.

**Vérifications** :
1. Le bouton "Enregistrer mon Score" apparaît-il après un game over ?
2. Cliquez-vous bien sur "Enregistrer dans le Leaderboard" ?
3. Y a-t-il des erreurs JavaScript dans la console ?

---

## 🔴 Si vous voyez les logs mais `error` n'est pas null

### Erreur `PGRST116` ou `42501` (Permission denied)

**Solution** :
1. Allez sur https://supabase.com/dashboard
2. Votre projet → **Table Editor** → **leaderboard**
3. Onglet **"Policies"**
4. **Supprimez toutes les policies existantes**
5. **Créez 2 nouvelles policies** :

**Policy 1 - SELECT (Lecture)** :
- **Policy name** : `Allow public read`
- **Allowed operation** : `SELECT`
- **Policy definition** : `true`
- **WITH CHECK** : (laissez vide)

**Policy 2 - INSERT (Insertion)** :
- **Policy name** : `Allow public insert`
- **Allowed operation** : `INSERT`
- **Policy definition** : (laissez vide)
- **WITH CHECK** : `true`

6. **Activez RLS** : Onglet **"Settings"** → Cochez **"Enable Row Level Security"**

---

## 🔴 Si vous voyez `data: []` (tableau vide)

**Problème** : L'insertion semble réussir mais ne retourne rien.

**Solution** : Vérifiez la structure de la table :

```sql
-- Dans SQL Editor, exécutez :
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leaderboard' 
AND table_schema = 'public';
```

La table doit avoir ces colonnes :
- `id` (bigint, auto-increment, PRIMARY KEY)
- `name` (text)
- `score` (integer ou bigint)
- `level` (integer)
- `created_at` (timestamp, default NOW())

---

## 🔴 Test Direct dans la Console

Ouvrez la console (F12) et exécutez ce code pour tester directement :

```javascript
// Test d'insertion directe
const supabase = window.supabaseClient;
if (!supabase) {
    console.error('❌ Supabase non initialisé');
} else {
    console.log('✅ Supabase initialisé, test insertion...');
    
    supabase
        .from('leaderboard')
        .insert([{
            name: 'Test Console',
            score: 9999,
            level: 10
        }])
        .select()
        .then(({ data, error }) => {
            console.log('📊 Résultat:', { data, error });
            if (error) {
                console.error('❌ Erreur:', error);
            } else {
                console.log('✅ Succès! Données:', data);
            }
        });
}
```

**Si ça fonctionne** : Le problème vient du code du jeu.
**Si ça ne fonctionne pas** : Le problème vient de Supabase (policies ou structure).

---

## 🔴 Vérifier les Policies RLS

Dans SQL Editor, exécutez :

```sql
-- Voir toutes les policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'leaderboard';
```

Vous devriez voir 2 policies :
1. Une pour `SELECT` avec `qual = 'true'`
2. Une pour `INSERT` avec `with_check = 'true'`

---

## 🔴 Vérifier si RLS est Activé

```sql
-- Vérifier si RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leaderboard';
```

`rowsecurity = true` signifie que RLS est activé.

---

## 🔴 Désactiver RLS Temporairement (TEST UNIQUEMENT)

**⚠️ ATTENTION** : Ne faites ça QUE pour tester, puis réactivez RLS !

```sql
-- Désactiver RLS temporairement
ALTER TABLE public.leaderboard DISABLE ROW LEVEL SECURITY;

-- Tester l'insertion
-- Si ça fonctionne, le problème vient des policies

-- RÉACTIVER RLS après le test
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
```

---

## 🔴 Vérifier les Données dans la Table

```sql
-- Voir tous les scores
SELECT * FROM public.leaderboard ORDER BY created_at DESC LIMIT 10;

-- Compter les scores
SELECT COUNT(*) FROM public.leaderboard;
```

---

## 📝 Checklist Complète

- [ ] La console affiche les logs d'insertion
- [ ] Les policies SELECT et INSERT existent et sont à `true`
- [ ] RLS est activé sur la table
- [ ] La table a les bonnes colonnes (id, name, score, level, created_at)
- [ ] Le test dans la console fonctionne
- [ ] Aucune erreur JavaScript dans la console
- [ ] Le bouton "Enregistrer" est bien cliqué

---

## 🎯 Solution Rapide : Recréer les Policies

Si rien ne fonctionne, supprimez tout et recréez :

```sql
-- Supprimer toutes les policies
DROP POLICY IF EXISTS "Allow public read" ON public.leaderboard;
DROP POLICY IF EXISTS "Allow public insert" ON public.leaderboard;

-- Recréer SELECT
CREATE POLICY "Allow public read"
ON public.leaderboard
FOR SELECT
TO public
USING (true);

-- Recréer INSERT
CREATE POLICY "Allow public insert"
ON public.leaderboard
FOR INSERT
TO public
WITH CHECK (true);
```

---

## 📞 Partagez ces Informations

Si le problème persiste, partagez :
1. Les logs complets de la console quand vous enregistrez un score
2. Le résultat de `SELECT * FROM pg_policies WHERE tablename = 'leaderboard';`
3. Le résultat du test dans la console (code JavaScript ci-dessus)

