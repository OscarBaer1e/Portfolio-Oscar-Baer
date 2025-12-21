# 💻 Comment utiliser le Terminal pour Firebase

## 🎯 Où entrer les commandes ?

Vous devez entrer les commandes dans le **Terminal** (ou **Console**) de votre ordinateur.

---

## 🖥️ Sur Mac (votre cas)

### Option 1 : Terminal intégré

1. **Ouvrez le Finder**
2. Allez dans **Applications** → **Utilitaires**
3. Double-cliquez sur **Terminal**

### Option 2 : Depuis VS Code / Cursor

1. Ouvrez votre projet dans **Cursor** (ou VS Code)
2. Appuyez sur **`Ctrl + ù`** (ou **`Cmd + ù`** sur Mac) pour ouvrir le terminal intégré
3. Ou allez dans le menu : **Terminal** → **New Terminal**

### Option 3 : Raccourci clavier

- **`Cmd + Espace`** → Tapez "Terminal" → Entrée

---

## 📋 Étapes détaillées

### 1. Ouvrir le Terminal

Une fois le Terminal ouvert, vous verrez quelque chose comme :

```bash
oscar@Mac ~ %
```

### 2. Aller dans le dossier du projet

Tapez cette commande et appuyez sur **Entrée** :

```bash
cd /Users/oscar/Desktop/Portfolio/Portfolio-Oscar-Baer-main
```

Vous devriez voir le chemin changer dans le terminal.

### 3. Vérifier que vous êtes au bon endroit

Tapez :

```bash
pwd
```

Cela affiche le chemin actuel. Vous devriez voir :
```
/Users/oscar/Desktop/Portfolio/Portfolio-Oscar-Baer-main
```

### 4. Exécuter les commandes Firebase

Maintenant vous pouvez exécuter les commandes :

```bash
npm run firebase:login
```

---

## 🎬 Exemple complet

Voici à quoi ressemble le terminal avec toutes les commandes :

```bash
# 1. Aller dans le dossier du projet
cd /Users/oscar/Desktop/Portfolio/Portfolio-Oscar-Baer-main

# 2. Vérifier que vous êtes au bon endroit
pwd
# Affiche : /Users/oscar/Desktop/Portfolio/Portfolio-Oscar-Baer-main

# 3. Se connecter à Firebase
npm run firebase:login
# Ouvre votre navigateur pour vous authentifier

# 4. Déployer les règles Firestore
npx firebase deploy --only firestore:rules

# 5. Déployer les index Firestore
npx firebase deploy --only firestore:indexes
```

---

## 🖱️ Copier-coller dans le Terminal

### Sur Mac :

1. **Copier** : `Cmd + C`
2. **Coller** : `Cmd + V`

**Astuce :** Vous pouvez copier-coller les commandes directement depuis ce guide !

---

## ✅ Vérification

Pour vérifier que tout fonctionne, tapez :

```bash
npx firebase --version
```

Vous devriez voir : `13.35.1` (ou une version similaire)

---

## 🐛 Si ça ne marche pas

### Erreur : "command not found"

**Solution :** Vérifiez que vous êtes dans le bon dossier :

```bash
pwd
ls
```

Vous devriez voir les fichiers du projet (package.json, firebase.json, etc.)

### Erreur : "npm: command not found"

**Solution :** Node.js n'est pas installé. Installez-le depuis [nodejs.org](https://nodejs.org/)

### Erreur : "Permission denied"

**Solution :** Vous n'êtes peut-être pas dans le bon dossier. Utilisez :

```bash
cd /Users/oscar/Desktop/Portfolio/Portfolio-Oscar-Baer-main
```

---

## 📸 Aperçu visuel

```
┌─────────────────────────────────────────┐
│ Terminal                                │
├─────────────────────────────────────────┤
│ oscar@Mac ~ %                           │
│ cd /Users/oscar/Desktop/Portfolio/...   │
│ oscar@Mac Portfolio-Oscar-Baer-main %   │
│ npm run firebase:login                  │
│                                         │
│ > firebase login                        │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## 🎯 Résumé rapide

1. **Ouvrez Terminal** (Applications → Utilitaires → Terminal)
2. **Tapez** : `cd /Users/oscar/Desktop/Portfolio/Portfolio-Oscar-Baer-main`
3. **Appuyez sur Entrée**
4. **Tapez** : `npm run firebase:login`
5. **Appuyez sur Entrée**

C'est tout ! 🎉

---

**Dernière mise à jour** : 21 décembre 2025

