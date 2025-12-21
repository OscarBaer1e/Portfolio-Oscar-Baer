# 🔧 Corriger la Fonction SQL qui retourne success: false

## 🔍 Diagnostic

Si la fonction retourne `success: false`, voici comment corriger :

---

## ✅ Solution 1 : Vérifier et Corriger la Fonction SQL

### Étape 1 : Vérifier si la fonction existe

Dans SQL Editor, exécutez :

```sql
-- Vérifier si la fonction existe
SELECT 
    routine_name, 
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'insert_leaderboard_score';
```

### Étape 2 : Supprimer et Recréer la Fonction

Si la fonction existe mais retourne `success: false`, supprimez-la et recréez-la :

```sql
-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS insert_leaderboard_score(TEXT, INTEGER, INTEGER);

-- Recréer la fonction avec une meilleure gestion d'erreurs
CREATE OR REPLACE FUNCTION insert_leaderboard_score(
    p_name TEXT,
    p_score INTEGER,
    p_level INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_id INTEGER;
    result JSON;
BEGIN
    -- Validation des paramètres
    IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Le nom ne peut pas être vide',
            'message', 'Erreur de validation'
        );
    END IF;
    
    IF p_score IS NULL OR p_score < 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Le score doit être un nombre positif',
            'message', 'Erreur de validation'
        );
    END IF;
    
    IF p_level IS NULL OR p_level < 1 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Le niveau doit être au moins 1',
            'message', 'Erreur de validation'
        );
    END IF;
    
    -- Insérer le score
    INSERT INTO public.leaderboard (name, score, level, created_at)
    VALUES (TRIM(p_name), p_score, p_level, NOW())
    RETURNING id INTO new_id;
    
    -- Retourner le résultat
    RETURN json_build_object(
        'success', true,
        'id', new_id,
        'message', 'Score inséré avec succès'
    );
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Violation de contrainte unique',
            'message', SQLERRM
        );
    WHEN foreign_key_violation THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Violation de clé étrangère',
            'message', SQLERRM
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'sqlstate', SQLSTATE,
            'message', 'Erreur lors de l''insertion'
        );
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO service_role;
```

### Étape 3 : Tester la Fonction

```sql
-- Tester avec des données valides
SELECT insert_leaderboard_score('Test Player', 1000, 5);

-- Tester avec des données invalides (devrait retourner success: false)
SELECT insert_leaderboard_score('', 1000, 5);
SELECT insert_leaderboard_score('Test', -100, 5);
```

---

## ✅ Solution 2 : Utiliser Insertion Directe (Plus Simple)

Si la fonction SQL pose problème, le code JavaScript utilise automatiquement l'insertion directe en fallback.

**Assurez-vous juste que les policies RLS sont correctes :**

1. Allez sur **Table Editor** → **leaderboard** → **Policies**
2. Vérifiez que vous avez :
   - **SELECT** : `true` (Allow public read)
   - **INSERT** : `true` (Allow public insert)

---

## 🔍 Diagnostic dans la Console

Ouvrez la console (F12) et regardez les logs :

1. `📊 Réponse fonction SQL complète:` - Voir ce que retourne la fonction
2. `📊 Résultat parsé:` - Voir le résultat après parsing
3. `❌ Fonction SQL a retourné success: false` - Si vous voyez ça, la fonction a échoué

---

## ✅ Solution 3 : Fonction SQL Simplifiée

Si vous voulez une fonction encore plus simple :

```sql
CREATE OR REPLACE FUNCTION insert_leaderboard_score(
    p_name TEXT,
    p_score INTEGER,
    p_level INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO public.leaderboard (name, score, level, created_at)
    VALUES (TRIM(p_name), p_score, p_level, NOW())
    RETURNING id INTO new_id;
    
    RETURN new_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erreur insertion: %', SQLERRM;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO authenticated;
```

Cette version retourne directement l'ID (un nombre) au lieu d'un JSON, ce qui est plus simple.

**Mais il faut aussi modifier le code JavaScript** pour gérer un retour INTEGER au lieu de JSON.

---

## 🎯 Recommandation

**Utilisez la Solution 2** (insertion directe) qui est plus simple et fonctionne bien si les policies RLS sont correctes. La fonction SQL est utile si vous avez des problèmes de permissions, mais l'insertion directe est plus standard.

