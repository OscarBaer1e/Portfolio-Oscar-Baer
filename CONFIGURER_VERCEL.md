# Configuration des variables d'environnement sur Vercel

Ce guide vous explique comment configurer les variables d'environnement Firebase sur Vercel.

## 📋 Méthode 1 : Via le Dashboard Vercel (Recommandé)

### Étape 1 : Ouvrir le Dashboard Vercel

1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Connectez-vous si nécessaire
3. Sélectionnez votre projet **Portfolio-Oscar-Baer**

### Étape 2 : Ajouter les variables d'environnement

1. Cliquez sur **Settings** (Paramètres) dans le menu de gauche
2. Cliquez sur **Environment Variables** (Variables d'environnement)
3. Cliquez sur **Add New** (Ajouter)

### Étape 3 : Ajouter chaque variable

Ajoutez les variables suivantes **une par une** :

#### Variable 1 :
- **Key (Clé)** : `FIREBASE_API_KEY`
- **Value (Valeur)** : `AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM`
- **Environments** : Cochez ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Cliquez sur **Save**

#### Variable 2 :
- **Key (Clé)** : `FIREBASE_AUTH_DOMAIN`
- **Value (Valeur)** : `oscar-baer.firebaseapp.com`
- **Environments** : Cochez ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Cliquez sur **Save**

#### Variable 3 :
- **Key (Clé)** : `FIREBASE_PROJECT_ID`
- **Value (Valeur)** : `oscar-baer`
- **Environments** : Cochez ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Cliquez sur **Save**

#### Variable 4 :
- **Key (Clé)** : `FIREBASE_STORAGE_BUCKET`
- **Value (Valeur)** : `oscar-baer.firebasestorage.app`
- **Environments** : Cochez ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Cliquez sur **Save**

#### Variable 5 :
- **Key (Clé)** : `FIREBASE_MESSAGING_SENDER_ID`
- **Value (Valeur)** : `419618942184`
- **Environments** : Cochez ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Cliquez sur **Save**

#### Variable 6 :
- **Key (Clé)** : `FIREBASE_APP_ID`
- **Value (Valeur)** : `1:419618942184:web:60e8e58c6c3348a3fbad5d`
- **Environments** : Cochez ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Cliquez sur **Save**

### Étape 4 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) à côté du dernier déploiement
3. Cliquez sur **Redeploy**
4. **DÉCOCHEZ** "Use existing Build Cache" (important pour forcer le rebuild)
5. Cliquez sur **Redeploy**

## 📋 Méthode 2 : Via Vercel CLI (Avancé)

Si vous avez installé Vercel CLI, vous pouvez utiliser :

```bash
vercel env add FIREBASE_API_KEY
# Entrez la valeur quand demandé
# Répétez pour chaque variable
```

## ⚠️ Important

- **Ne commitez JAMAIS un fichier `.env`** dans Git (il est déjà dans `.gitignore`)
- Les valeurs sont déjà hardcodées dans le code comme valeurs par défaut
- Les variables Vercel permettent de les surcharger si besoin
- **Même sans ces variables, le site fonctionnera** grâce aux valeurs par défaut

## ✅ Vérification

Après le redéploiement :

1. Ouvrez votre site sur Vercel
2. Ouvrez la console du navigateur (F12)
3. Vous devriez voir :
   ```
   ✅ Configuration Firebase définie par défaut: { projectId: "oscar-baer" }
   ✅ Firebase initialisé avec succès
   ```

## 🔍 Si ça ne marche pas

1. Vérifiez que toutes les variables sont bien ajoutées dans Vercel
2. Vérifiez que vous avez redéployé **sans cache**
3. Videz le cache de votre navigateur
4. Consultez `TROUBLESHOOTING_FIREBASE.md` pour plus d'aide



