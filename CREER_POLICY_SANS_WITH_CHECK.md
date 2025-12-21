# 🔧 Créer une Policy INSERT sans "with check"

## ✅ Note importante

**Le `with check (true)` est CORRECT et fonctionne parfaitement !** Vous n'êtes pas obligé de l'enlever. Mais si vous voulez vraiment le supprimer, voici comment :

---

## Méthode 1 : Via l'interface Supabase (RECOMMANDÉ)

### Étape 1 : Supprimer l'ancienne policy

1. Allez sur https://supabase.com/dashboard
2. Votre projet → **Table Editor** → **leaderboard**
3. Cliquez sur l'onglet **"Policies"** (en haut)
4. Trouvez la policy **"Allow public insert"**
5. Cliquez sur les **3 points** (⋯) à droite
6. Cliquez sur **"Delete"**

### Étape 2 : Créer une nouvelle policy sans "with check"

1. Cliquez sur **"New Policy"**
2. Sélectionnez **"For full customization"**
3. Remplissez :
   - **Policy name** : `Allow public insert`
   - **Allowed operation** : `INSERT`
   - **Policy definition** : `true`
   - **WITH CHECK** : **LAISSEZ VIDE** (ne mettez rien)
4. Cliquez sur **"Save"**

---

## Méthode 2 : Via SQL Editor

1. Allez sur **SQL Editor** (menu gauche)
2. Exécutez cette commande :

```sql
-- Supprimer l'ancienne policy
DROP POLICY IF EXISTS "Allow public insert" ON "public"."leaderboard";

-- Créer la nouvelle policy sans "with check"
CREATE POLICY "Allow public insert"
ON "public"."leaderboard"
FOR INSERT
TO public
WITH CHECK (true);
```

**Note** : Même avec cette commande SQL, Supabase peut ajouter automatiquement `WITH CHECK (true)`. C'est normal et ça fonctionne !

---

## ⚠️ Important

**Le `WITH CHECK (true)` est OBLIGATOIRE pour les policies INSERT dans PostgreSQL/Supabase.** C'est une contrainte de sécurité de PostgreSQL.

- **`USING`** : Détermine quelles lignes peuvent être lues/modifiées
- **`WITH CHECK`** : Détermine quelles lignes peuvent être insérées/mises à jour

Pour une policy INSERT publique, vous **DEVEZ** avoir `WITH CHECK (true)` pour permettre l'insertion.

---

## ✅ Vérification

Après avoir créé/modifié la policy :

1. Testez l'enregistrement d'un score dans votre jeu
2. Vérifiez dans la console (F12) qu'il n'y a pas d'erreur `PGRST116`
3. Vérifiez que le score apparaît dans le leaderboard

---

## 🎯 Conclusion

**Vous n'avez PAS besoin d'enlever `with check (true)` !** C'est la configuration correcte pour permettre l'insertion publique. Si votre enregistrement ne fonctionne pas, le problème vient d'ailleurs (vérifiez les logs dans la console).

