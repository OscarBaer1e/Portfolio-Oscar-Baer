# 🔧 Créer une Fonction SQL pour Insérer des Scores

## 🎯 Objectif

Créer une fonction PostgreSQL qui peut être appelée depuis JavaScript pour insérer des scores directement, en contournant les problèmes de RLS.

---

## 📝 Étape 1 : Créer la Fonction SQL

1. Allez sur https://supabase.com/dashboard
2. Votre projet → **SQL Editor** (menu gauche)
3. Cliquez sur **"New query"**
4. Copiez-collez cette requête :

```sql
-- Créer une fonction qui insère un score en contournant RLS
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
    -- Insérer le score
    INSERT INTO public.leaderboard (name, score, level, created_at)
    VALUES (p_name, p_score, p_level, NOW())
    RETURNING id INTO new_id;
    
    -- Retourner le résultat
    SELECT json_build_object(
        'success', true,
        'id', new_id,
        'message', 'Score inséré avec succès'
    ) INTO result;
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, retourner un JSON d'erreur
        SELECT json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Erreur lors de l''insertion'
        ) INTO result;
        
        RETURN result;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION insert_leaderboard_score(TEXT, INTEGER, INTEGER) TO authenticated;
```

5. Cliquez sur **"Run"** (ou `Cmd + Enter`)

---

## 📝 Étape 2 : Tester la Fonction

Dans le SQL Editor, testez la fonction :

```sql
-- Tester la fonction
SELECT insert_leaderboard_score('Test Player', 1000, 5);
```

Vous devriez voir un résultat JSON comme :
```json
{"success": true, "id": 123, "message": "Score inséré avec succès"}
```

---

## 📝 Étape 3 : Modifier le Code JavaScript

Maintenant, modifiez `js/space-shooter-supabase.js` pour utiliser cette fonction au lieu de l'insertion directe.

