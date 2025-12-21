# 🔧 Fix : Erreur Google Cloud Billing

## 🐛 Erreur

```
Write access to project '419618942184' was denied: 
please check billing account associated and retry
```

## 📋 Solutions

### Solution 1 : Activer la facturation (même pour le plan gratuit)

Firebase nécessite un compte de facturation associé, **même pour utiliser le plan gratuit (Spark)**.

#### Étapes :

1. **Allez sur Firebase Console** : https://console.firebase.google.com/
2. **Sélectionnez votre projet** : oscar-baer (nom : Leaderboard)
3. **Cliquez sur l'icône ⚙️** (Settings) → **Project settings**
4. **Allez dans l'onglet "Usage and billing"**
5. **Cliquez sur "Modify plan"** ou **"Upgrade project"**
6. **Sélectionnez le plan "Spark" (gratuit)**
7. **Associez un compte de facturation** :
   - Si vous n'avez pas de compte de facturation, créez-en un
   - **Important** : Le plan Spark est gratuit, vous ne serez pas facturé
   - Mais Firebase nécessite un compte de facturation associé pour activer certains services

#### Alternative : Via Google Cloud Console

1. **Allez sur Google Cloud Console** : https://console.cloud.google.com/
2. **Sélectionnez le projet** : oscar-baer (ID: 419618942184)
3. **Menu** → **Billing** → **Account management**
4. **Liez un compte de facturation** au projet

---

### Solution 2 : Vérifier les permissions IAM

Assurez-vous que votre compte a les bonnes permissions :

1. **Google Cloud Console** : https://console.cloud.google.com/
2. **Sélectionnez le projet** : oscar-baer
3. **Menu** → **IAM & Admin** → **IAM**
4. **Vérifiez que votre compte** (oscarbaer524@gmail.com) a le rôle :
   - **Firebase Admin** ou
   - **Owner** ou
   - **Editor**

---

### Solution 3 : Vérifier que Firestore est activé

1. **Firebase Console** : https://console.firebase.google.com/
2. **Sélectionnez votre projet** : oscar-baer
3. **Firestore Database**
4. **Vérifiez que Firestore est activé** (pas juste "Créer une base de données")

---

## ⚠️ Important : Plan Spark (gratuit)

Le plan **Spark** (gratuit) de Firebase inclut :
- ✅ 50,000 lectures Firestore par jour
- ✅ 20,000 écritures Firestore par jour
- ✅ 1 GB de stockage
- ✅ **Gratuit** (pas de facturation)

**Mais** : Firebase nécessite quand même un compte de facturation associé, même si vous restez sur le plan gratuit.

---

## 🔍 Vérification

Après avoir associé un compte de facturation :

1. **Testez dans Firebase Console** :
   - Allez dans **Firestore Database** → **Data**
   - Essayez de créer un document manuellement
   - Si ça fonctionne, le problème est résolu

2. **Testez dans votre site** :
   - Utilisez le script de réparation dans la console
   - Essayez d'enregistrer un score
   - Vérifiez que ça fonctionne

---

## 🚨 Si vous ne voulez pas associer de facturation

Si vous ne voulez pas associer de compte de facturation, vous pouvez :

1. **Créer un nouveau projet Firebase** (sans facturation requise pour le démarrage)
2. **Ou utiliser une autre solution** pour le leaderboard (localStorage, API externe, etc.)

Mais pour utiliser Firestore, Firebase nécessite généralement un compte de facturation associé (même pour le plan gratuit).

---

## 📝 Note sur la facturation

- ✅ Le plan **Spark** est **100% gratuit**
- ✅ Vous ne serez **jamais facturé** tant que vous restez dans les limites du plan gratuit
- ✅ Firebase nécessite juste un compte de facturation pour activer certains services
- ✅ C'est une mesure de sécurité pour éviter les abus

---

## ✅ Checklist

- [ ] Compte de facturation associé au projet Firebase
- [ ] Plan Spark (gratuit) sélectionné
- [ ] Permissions IAM correctes
- [ ] Firestore activé
- [ ] Règles Firestore déployées

---

**Dernière mise à jour** : 21 décembre 2025

