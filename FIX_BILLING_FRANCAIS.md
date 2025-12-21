# 🔧 Fix : Erreur Facturation Google Cloud (Version Française)

## 🐛 Erreur

```
Write access to project '419618942184' was denied: 
please check billing account associated and retry
```

En français : "Accès en écriture au projet refusé : vérifiez le compte de facturation associé et réessayez"

---

## 📋 Solution : Associer un compte de facturation

### Méthode 1 : Via Firebase Console (en français)

1. **Allez sur Firebase Console** : https://console.firebase.google.com/
2. **Sélectionnez votre projet** : **oscar-baer** (nom : Leaderboard)
3. **Cliquez sur l'icône ⚙️** (Paramètres) en haut à gauche
4. **Cliquez sur "Paramètres du projet"**
5. **Allez dans l'onglet "Utilisation et facturation"** (ou "Usage and billing")
6. **Cliquez sur "Modifier le plan"** ou **"Mettre à niveau le projet"**
7. **Sélectionnez le plan "Spark"** (gratuit)
8. **Associez un compte de facturation** :
   - Si vous n'avez pas de compte de facturation, cliquez sur **"Créer un compte de facturation"**
   - Suivez les étapes pour créer un compte
   - **Important** : Le plan Spark est gratuit, vous ne serez pas facturé
   - Mais Firebase nécessite un compte de facturation associé

---

### Méthode 2 : Via Google Cloud Console (en français)

1. **Allez sur Google Cloud Console** : https://console.cloud.google.com/
2. **Sélectionnez le projet** : **oscar-baer** (ID: 419618942184)
   - Si le projet n'apparaît pas, cliquez sur le sélecteur de projet en haut
3. **Menu hamburger** (☰) en haut à gauche
4. **Cliquez sur "Facturation"** (ou "Billing")
5. **Cliquez sur "Gestion des comptes"** (ou "Account management")
6. **Cliquez sur "Lier un compte de facturation"** (ou "Link billing account")
7. **Sélectionnez ou créez un compte de facturation**

---

## 🔍 Où trouver "Utilisation et facturation" dans Firebase

Si vous ne trouvez pas l'onglet "Utilisation et facturation" :

1. **Firebase Console** → Votre projet
2. **Paramètres** (⚙️) → **Paramètres du projet**
3. Cherchez les onglets en haut :
   - **Général**
   - **Utilisation et facturation** ← C'est celui-là
   - **Comptes de service**
   - etc.

---

## 🔍 Où trouver "Facturation" dans Google Cloud

Si vous ne trouvez pas "Facturation" :

1. **Google Cloud Console** → Votre projet
2. **Menu hamburger** (☰) en haut à gauche
3. Cherchez dans le menu :
   - **Facturation** (ou "Billing") ← C'est celui-là
   - Il est généralement vers le bas du menu

---

## ⚠️ Important : Plan Spark (gratuit)

Le plan **Spark** (gratuit) de Firebase :

- ✅ **50 000 lectures** Firestore par jour
- ✅ **20 000 écritures** Firestore par jour
- ✅ **1 GB de stockage**
- ✅ **100% gratuit** (pas de facturation)

**Mais** : Firebase nécessite quand même un compte de facturation associé, même si vous restez sur le plan gratuit.

---

## 📝 Étapes détaillées (Firebase Console)

### Étape 1 : Ouvrir les paramètres

1. Allez sur : https://console.firebase.google.com/
2. Cliquez sur votre projet **oscar-baer**
3. En haut à gauche, cliquez sur l'icône **⚙️** (roue dentée)
4. Cliquez sur **"Paramètres du projet"**

### Étape 2 : Aller dans "Utilisation et facturation"

1. Vous voyez plusieurs onglets en haut
2. Cliquez sur **"Utilisation et facturation"** (ou "Usage and billing")
3. Si vous voyez un message comme "Aucun compte de facturation", c'est normal

### Étape 3 : Modifier le plan

1. Cliquez sur **"Modifier le plan"** ou **"Mettre à niveau"**
2. Sélectionnez **"Spark"** (plan gratuit)
3. Suivez les instructions pour associer un compte de facturation

---

## 📝 Étapes détaillées (Google Cloud Console)

### Étape 1 : Ouvrir Google Cloud Console

1. Allez sur : https://console.cloud.google.com/
2. En haut, cliquez sur le **sélecteur de projet**
3. Sélectionnez **oscar-baer** (ou cherchez par ID: 419618942184)

### Étape 2 : Ouvrir le menu Facturation

1. En haut à gauche, cliquez sur le **menu hamburger** (☰)
2. Faites défiler jusqu'à trouver **"Facturation"** (ou "Billing")
3. Cliquez dessus

### Étape 3 : Lier un compte

1. Cliquez sur **"Gestion des comptes"** (ou "Account management")
2. Cliquez sur **"Lier un compte de facturation"** (ou "Link billing account")
3. Suivez les instructions

---

## ✅ Vérification

Après avoir associé un compte de facturation :

1. **Revenez dans Firebase Console**
2. **Firestore Database** → **Données**
3. **Essayez de créer un document** manuellement
4. Si ça fonctionne, le problème est résolu !

---

## 🚨 Si vous ne trouvez toujours pas

### Option A : Recherche dans Firebase Console

1. Dans Firebase Console, utilisez la **barre de recherche** en haut
2. Tapez : **"facturation"** ou **"billing"**
3. Cliquez sur le résultat

### Option B : URL directe

Essayez d'aller directement sur :
- **Firebase** : https://console.firebase.google.com/project/oscar-baer/settings/usage
- **Google Cloud** : https://console.cloud.google.com/billing?project=419618942184

---

## 📞 Besoin d'aide ?

Si vous ne trouvez toujours pas les options :

1. **Faites une capture d'écran** de ce que vous voyez
2. **Dites-moi** quels menus vous voyez
3. Je pourrai vous guider plus précisément

---

**Dernière mise à jour** : 21 décembre 2025

