# Configuration Supabase pour la suppression automatique des scores

## Problème
La fonction de nettoyage automatique des scores en dessous du top 10 ne fonctionne pas car Supabase bloque les suppressions par défaut (RLS - Row Level Security).

## Solution : Créer une Policy DELETE

### Étape 1 : Aller sur Supabase Dashboard
1. Allez sur https://supabase.com/dashboard
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### Étape 2 : Accéder aux Policies
1. Dans le menu de gauche, cliquez sur **"Table Editor"**
2. Cliquez sur la table **"leaderboard"**
3. Cliquez sur l'onglet **"Policies"** (en haut de la page)

### Étape 3 : Créer une Policy DELETE
1. Cliquez sur le bouton **"New Policy"** ou **"Add Policy"**
2. Choisissez **"For full customization"** (option avancée)
3. Configurez la policy comme suit :

**Nom de la policy :**
```
Allow public delete for cleanup
```

**Type d'opération :**
- Cochez **DELETE**

**Policy definition (Target roles) :**
```
public
```

**Policy definition (USING expression) :**
```sql
true
```

**Policy definition (WITH CHECK expression) :**
```sql
true
```

4. Cliquez sur **"Review"** puis **"Save policy"**

### Étape 4 : Alternative - Créer une fonction SQL (Recommandé)

Si la policy ne fonctionne pas, créez une fonction SQL qui supprime les scores :

1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"**
3. Collez ce code SQL :

```sql
-- Fonction pour nettoyer les scores en dessous du top 10
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    min_score INTEGER;
BEGIN
    -- Récupérer le score minimum du top 10
    SELECT score INTO min_score
    FROM leaderboard
    ORDER BY score DESC
    LIMIT 1
    OFFSET 9; -- 10ème score (index 9)
    
    -- Si on a moins de 10 scores, ne rien faire
    IF min_score IS NULL THEN
        RETURN;
    END IF;
    
    -- Supprimer tous les scores en dessous du top 10
    DELETE FROM leaderboard
    WHERE score < min_score;
    
    -- Si on a exactement 10 scores ou moins, on garde tout
    -- Sinon, on supprime les scores en dessous du 10ème
END;
$$;
```

4. Cliquez sur **"Run"** pour exécuter la requête

### Étape 5 : Modifier la fonction insert_leaderboard_score

Modifiez votre fonction `insert_leaderboard_score` pour qu'elle appelle automatiquement le nettoyage :

1. Dans **"SQL Editor"**, créez une nouvelle requête
2. Remplacez votre fonction `insert_leaderboard_score` par ce code :

```sql
CREATE OR REPLACE FUNCTION insert_leaderboard_score(
    p_name TEXT,
    p_score INTEGER,
    p_level INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
    result JSON;
BEGIN
    -- Insérer le nouveau score
    INSERT INTO leaderboard (name, score, level)
    VALUES (p_name, p_score, p_level)
    RETURNING id INTO new_id;
    
    -- Nettoyer les anciens scores (garder seulement le top 10)
    PERFORM cleanup_old_scores();
    
    -- Retourner le résultat
    result := json_build_object(
        'success', true,
        'id', new_id
    );
    
    RETURN result;
END;
$$;
```

3. Cliquez sur **"Run"** pour exécuter

### Étape 6 : Vérifier que ça fonctionne

1. Allez dans **"Table Editor"** → **"leaderboard"**
2. Ajoutez manuellement quelques scores de test (plus de 10)
3. Exécutez cette requête dans **"SQL Editor"** :

```sql
SELECT cleanup_old_scores();
```

4. Vérifiez que seuls les 10 meilleurs scores restent

## Dépannage

### Erreur "permission denied"
- Vérifiez que la policy DELETE est bien créée
- Vérifiez que la policy a `USING true` et `WITH CHECK true`

### La fonction ne s'exécute pas
- Vérifiez que la fonction `cleanup_old_scores()` est bien créée
- Vérifiez que la fonction `insert_leaderboard_score` appelle bien `cleanup_old_scores()`

### Les scores ne sont pas supprimés
- Vérifiez dans la console du navigateur les logs de la fonction `cleanupOldScores`
- Vérifiez que vous avez plus de 10 scores dans la base
- Testez manuellement la fonction SQL dans Supabase

## Note importante

La fonction `cleanupOldScores()` dans le code JavaScript sera toujours appelée, mais si les permissions ne sont pas configurées, elle échouera silencieusement (avec un warning dans la console). C'est pourquoi il est recommandé d'utiliser la fonction SQL `cleanup_old_scores()` qui s'exécute côté serveur avec les bonnes permissions.

