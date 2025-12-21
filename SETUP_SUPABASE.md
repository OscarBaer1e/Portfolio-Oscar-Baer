# 🚀 Setup Supabase - Guide Complet (5 minutes)

## ✅ Pourquoi Supabase ?

- ✅ **Plus simple** que Firebase
- ✅ **Gratuit** sans carte bancaire
- ✅ **API REST** très simple
- ✅ **Interface intuitive**

---

## 📋 Étapes de Setup

### 1. Créer un compte Supabase (2 minutes)

1. Allez sur **https://supabase.com/**
2. Cliquez sur **"Start your project"** ou **"Sign up"**
3. Connectez-vous avec votre compte GitHub (ou créez un compte)
4. C'est gratuit ! 🎉

### 2. Créer un projet (1 minute)

1. Cliquez sur **"New project"**
2. Remplissez :
   - **Name** : `portfolio-leaderboard` (ou ce que vous voulez)
   - **Database Password** : Choisissez un mot de passe (notez-le !)
   - **Region** : Choisissez la région la plus proche (Europe pour la France)
3. Cliquez sur **"Create new project"**
4. Attendez 2-3 minutes que le projet soit créé

### 3. Créer la table `leaderboard` (1 minute)

1. Dans votre projet Supabase, allez dans **"Table Editor"** (menu de gauche)
2. Cliquez sur **"New table"**
3. Remplissez :
   - **Name** : `leaderboard`
   - **Description** : `Scores du jeu Space Shooter`
4. Cliquez sur **"Save"**

### 4. Ajouter les colonnes (1 minute)

Dans la table `leaderboard`, ajoutez ces colonnes :

| Name | Type | Default | Nullable |
|------|------|---------|----------|
| `id` | `int8` | Auto (Primary Key) | ❌ |
| `name` | `text` | - | ❌ |
| `score` | `int8` | - | ❌ |
| `level` | `int8` | - | ❌ |
| `created_at` | `timestamptz` | `now()` | ❌ |

**Comment ajouter une colonne** :
1. Cliquez sur **"Add column"**
2. Remplissez le nom et le type
3. Cliquez sur **"Save"**

### 5. Récupérer les clés API (30 secondes)

1. Allez dans **"Settings"** (icône ⚙️) → **"API"**
2. Vous verrez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Copiez ces deux valeurs** (vous en aurez besoin)

### 6. Configurer les Row Level Security (RLS) (1 minute)

**⚠️ IMPORTANT : Ne désactivez PAS le RLS !** Gardez-le activé et créez des politiques qui permettent tout.

#### Pourquoi garder le RLS activé ?

- ✅ **Plus sécurisé** : Le RLS reste actif pour protéger votre base de données
- ✅ **Meilleure pratique** : Même si les politiques permettent tout, c'est mieux que de désactiver complètement
- ✅ **Flexibilité** : Vous pourrez facilement modifier les règles plus tard si besoin

#### Étapes :

1. Allez dans **"Table Editor"** → Table `leaderboard`
2. **Vérifiez que RLS est activé** (bouton "Enable RLS" doit être activé)
3. Cliquez sur l'onglet **"Policies"**
4. Cliquez sur **"New policy"**
5. **IMPORTANT** : Choisissez **"For full customization"** (pas les options pré-définies)
6. Pour la lecture (SELECT) :
   - Nom : `Allow public read`
   - Allowed operation : **SELECT**
   - Policy definition : 
     ```sql
     true
     ```
   - Cliquez sur **"Save"**
7. Pour l'insertion (INSERT) :
   - Cliquez sur **"New policy"** à nouveau
   - Nom : `Allow public insert`
   - Allowed operation : **INSERT**
   - Policy definition : 
     ```sql
     true
     ```
   - Cliquez sur **"Save"**

**⚠️ Ne choisissez PAS** les options pré-définies comme "Enable insert for authenticated users only" car elles nécessitent une authentification. Pour un leaderboard public, utilisez "For full customization" avec `true`.

**✅ Résultat** : Le RLS est activé mais les politiques permettent tout (lecture et écriture publiques).

### 7. Configurer le code (30 secondes)

1. Ouvrez `js/supabase-init.js`
2. Remplacez :
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'VOTRE_URL_SUPABASE',
       anonKey: 'VOTRE_ANON_KEY'
   };
   ```
   
   Par :
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://xxxxx.supabase.co', // Votre Project URL
       anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Votre anon public key
   };
   ```

---

## ✅ Vérification

1. Ouvrez votre site
2. Ouvrez la console (F12)
3. Tapez : `window.diagnosticSupabase()`
4. Vous devriez voir : `✅ Connexion OK`

---

## 🎉 C'est tout !

Votre leaderboard fonctionne maintenant avec Supabase ! 🚀

---

## 📝 Commandes utiles

### Dans la console du navigateur :

```javascript
// Diagnostic
window.diagnosticSupabase();

// Réinitialiser
window.reinitSupabase();

// Tester une requête
window.supabaseClient
    .from('leaderboard')
    .select('*')
    .limit(5)
    .then(({ data, error }) => {
        if (error) {
            console.error('Erreur:', error);
        } else {
            console.log('Scores:', data);
        }
    });
```

---

## 🐛 Problèmes courants

### "Supabase SDK non chargé"
- Vérifiez que le script Supabase est chargé dans `basketball-game.html`

### "Configuration Supabase non définie"
- Vérifiez que vous avez bien rempli `SUPABASE_CONFIG` dans `js/supabase-init.js`

### "Permission denied"
- Vérifiez que les policies RLS sont bien créées (étape 6)

---

**Dernière mise à jour** : 21 décembre 2025

