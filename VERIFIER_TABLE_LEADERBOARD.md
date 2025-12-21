# 🔍 Vérifier la Table Leaderboard dans Supabase

## Méthode 1 : Via Supabase Dashboard (RECOMMANDÉ)

1. **Allez sur** https://supabase.com/dashboard
2. **Sélectionnez votre projet**
3. **Cliquez sur "Table Editor"** (menu gauche)
4. **Vérifiez la table `leaderboard`** :
   - Si elle n'existe pas, créez-la (voir SETUP_SUPABASE.md)
   - Si elle existe, vérifiez qu'elle contient des données

## Méthode 2 : Via psql (Connexion directe)

### Étape 1 : Récupérer votre mot de passe

1. Allez sur https://supabase.com/dashboard
2. Votre projet → **Settings** → **Database**
3. Section **Connection string** → **URI**
4. Copiez le mot de passe (il commence après `postgres:`)

### Étape 2 : Se connecter

```bash
psql "postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.xqpsvwtcvoggbkcjuelq.supabase.co:5432/postgres"
```

**Remplacez `[VOTRE-MOT-DE-PASSE]` par votre mot de passe réel.**

### Étape 3 : Vérifier la table

```sql
-- Voir toutes les tables
\dt

-- Voir la structure de la table leaderboard
\d leaderboard

-- Voir les données
SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10;

-- Compter les lignes
SELECT COUNT(*) FROM leaderboard;
```

### Étape 4 : Insérer des données de test

```sql
-- Insérer un score de test
INSERT INTO leaderboard (name, score, level, created_at)
VALUES ('Test Player', 1000, 5, NOW());

-- Vérifier que ça a été inséré
SELECT * FROM leaderboard ORDER BY score DESC;
```

## Méthode 3 : Vérifier les RLS Policies

1. **Allez sur** https://supabase.com/dashboard
2. Votre projet → **Authentication** → **Policies**
3. **Sélectionnez la table `leaderboard`**
4. **Vérifiez les policies** :
   - **SELECT (Read)** : Doit être `true` pour permettre la lecture
   - **INSERT** : Doit être `true` pour permettre l'insertion

### Si les policies n'existent pas, créez-les :

1. **Table Editor** → **leaderboard** → **Policies**
2. **New Policy** → **For full customization**
3. **Policy Name** : `Allow public read`
4. **Allowed operation** : `SELECT`
5. **Policy definition** : `true`
6. **Save**

4. **New Policy** → **For full customization**
5. **Policy Name** : `Allow public insert`
6. **Allowed operation** : `INSERT`
7. **Policy definition** : `true`
8. **Save**

## 🔴 Problème : Table vide

Si la table est vide, c'est normal si personne n'a encore enregistré de score.

**Solution :**
1. Jouez au jeu
2. Obtenez un score
3. Cliquez sur "Enregistrer mon Score"
4. Entrez un nom
5. Le score devrait apparaître dans le leaderboard

## 🔴 Problème : RLS bloque les requêtes

Si vous voyez une erreur `PGRST116` dans la console, c'est que les RLS policies bloquent les requêtes.

**Solution :**
1. Vérifiez les RLS policies (voir ci-dessus)
2. Assurez-vous que `SELECT` et `INSERT` sont à `true`

## 🔴 Problème : Données dans la table mais pas dans le leaderboard

1. **Ouvrez la console** (F12)
2. **Regardez les logs** :
   - `📥 Chargement du leaderboard depuis Supabase...`
   - `📊 Réponse Supabase: { data, error }`
3. **Si vous voyez une erreur**, partagez-la avec moi

