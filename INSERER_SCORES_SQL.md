# 💾 Insérer des Scores via SQL

## 🎯 Méthode 1 : Via SQL Editor (RECOMMANDÉ)

### Étape 1 : Accéder au SQL Editor

1. Allez sur https://supabase.com/dashboard
2. Votre projet → **SQL Editor** (menu gauche)
3. Cliquez sur **"New query"**

### Étape 2 : Insérer un score

Copiez-collez cette requête et modifiez les valeurs :

```sql
-- Insérer un score de test
INSERT INTO public.leaderboard (name, score, level, created_at)
VALUES ('Test Player', 1000, 5, NOW());
```

### Étape 3 : Insérer plusieurs scores

```sql
-- Insérer plusieurs scores en une fois
INSERT INTO public.leaderboard (name, score, level, created_at)
VALUES 
    ('Alice', 5000, 10, NOW()),
    ('Bob', 3500, 8, NOW()),
    ('Charlie', 2000, 6, NOW()),
    ('Diana', 1500, 5, NOW()),
    ('Eve', 1000, 4, NOW());
```

### Étape 4 : Exécuter

1. Cliquez sur **"Run"** (ou `Cmd + Enter`)
2. Vous devriez voir : `Success. No rows returned`

---

## 🎯 Méthode 2 : Vérifier les données

```sql
-- Voir tous les scores
SELECT * FROM public.leaderboard 
ORDER BY score DESC;

-- Voir les 10 meilleurs scores
SELECT * FROM public.leaderboard 
ORDER BY score DESC 
LIMIT 10;

-- Compter les scores
SELECT COUNT(*) FROM public.leaderboard;
```

---

## 🎯 Méthode 3 : Supprimer des scores (si besoin)

```sql
-- Supprimer un score spécifique
DELETE FROM public.leaderboard 
WHERE id = 123;  -- Remplacez 123 par l'ID réel

-- Supprimer tous les scores
DELETE FROM public.leaderboard;

-- Supprimer les scores d'un joueur spécifique
DELETE FROM public.leaderboard 
WHERE name = 'Test Player';
```

---

## 🎯 Méthode 4 : Mettre à jour un score

```sql
-- Mettre à jour le score d'un joueur
UPDATE public.leaderboard 
SET score = 6000, level = 12 
WHERE name = 'Test Player';
```

---

## 🎯 Méthode 5 : Créer une fonction SQL pour insérer (avancé)

Si vous voulez créer une fonction qui contourne RLS (non recommandé pour la production) :

```sql
-- Créer une fonction qui insère sans RLS
CREATE OR REPLACE FUNCTION insert_score_public(
    p_name TEXT,
    p_score INTEGER,
    p_level INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO public.leaderboard (name, score, level, created_at)
    VALUES (p_name, p_score, p_level, NOW())
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;

-- Utiliser la fonction
SELECT insert_score_public('Test Player', 1000, 5);
```

**⚠️ Note** : Cette fonction utilise `SECURITY DEFINER` qui contourne RLS. Utilisez-la avec précaution !

---

## 🔍 Vérifier la structure de la table

```sql
-- Voir la structure de la table
\d public.leaderboard

-- Ou avec une requête
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'leaderboard' 
AND table_schema = 'public';
```

---

## 📝 Exemples de scores réalistes

```sql
-- Insérer des scores de test réalistes
INSERT INTO public.leaderboard (name, score, level, created_at)
VALUES 
    ('Master Gamer', 15000, 15, NOW() - INTERVAL '1 day'),
    ('Pro Player', 12000, 12, NOW() - INTERVAL '2 days'),
    ('Champion', 10000, 10, NOW() - INTERVAL '3 days'),
    ('Expert', 8000, 8, NOW() - INTERVAL '4 days'),
    ('Advanced', 6000, 6, NOW() - INTERVAL '5 days'),
    ('Intermediate', 4000, 4, NOW() - INTERVAL '6 days'),
    ('Beginner', 2000, 2, NOW() - INTERVAL '7 days'),
    ('Newbie', 1000, 1, NOW() - INTERVAL '8 days');
```

---

## ✅ Vérification après insertion

1. Allez sur **Table Editor** → **leaderboard**
2. Vous devriez voir les nouveaux scores
3. Rechargez votre site et ouvrez le leaderboard
4. Les scores devraient apparaître !

---

## 🐛 Si les scores n'apparaissent pas sur le site

1. **Vérifiez les policies RLS** :
   - Table Editor → leaderboard → Policies
   - Assurez-vous que SELECT est à `true`

2. **Vérifiez la console** (F12) :
   - Regardez les logs de chargement
   - Vérifiez s'il y a des erreurs

3. **Videz le cache** :
   - `Cmd + Shift + R` pour recharger

---

## 🎯 Commandes rapides

```sql
-- Insérer un score rapidement
INSERT INTO public.leaderboard (name, score, level) 
VALUES ('Mon Nom', 5000, 10);

-- Voir mes scores
SELECT * FROM public.leaderboard 
WHERE name = 'Mon Nom' 
ORDER BY score DESC;

-- Voir le top 10
SELECT * FROM public.leaderboard 
ORDER BY score DESC 
LIMIT 10;
```

