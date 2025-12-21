# 💻 Comment utiliser la Console du navigateur

## 🎯 Où exécuter `window.reinitFirebase()`

Vous devez exécuter cette commande dans la **Console du navigateur** (DevTools).

---

## 🖥️ Sur Mac (votre cas)

### Méthode 1 : Raccourci clavier (le plus rapide)

1. **Ouvrez votre site** dans le navigateur (Chrome, Firefox, Safari, etc.)
2. **Appuyez sur** : `Cmd + Option + I` (ou `F12` si activé)
3. La console s'ouvre en bas ou sur le côté

### Méthode 2 : Menu du navigateur

**Chrome/Edge** :
1. Clic droit sur la page → **Inspecter** (ou **Inspect Element**)
2. Ou menu : **Affichage** → **Outils de développement** → **Console JavaScript**

**Firefox** :
1. Clic droit sur la page → **Examiner l'élément**
2. Ou menu : **Outils** → **Outils de développement web** → **Console**

**Safari** :
1. Menu : **Développement** → **Afficher la console JavaScript**
2. (Si le menu Développement n'apparaît pas : Préférences → Avancé → Cocher "Afficher le menu Développement")

---

## 📋 Étapes détaillées

### 1. Ouvrir la console

1. Ouvrez votre site : `http://localhost:8000/pages/basketball-game.html` (local) ou votre URL Vercel
2. Appuyez sur **`Cmd + Option + I`** (Mac) ou **`F12`**
3. Cliquez sur l'onglet **Console** en haut de la fenêtre qui s'ouvre

### 2. Voir la console

Vous devriez voir quelque chose comme :

```
┌─────────────────────────────────────────┐
│ Console                                 │
├─────────────────────────────────────────┤
│ 🛡️ Firebase Setup Inline - Démarrage   │
│ ✅ window.FIREBASE_CONFIG défini: ...   │
│                                         │
│ > _                                    │
└─────────────────────────────────────────┘
```

Le `>` à la fin est l'endroit où vous tapez les commandes.

### 3. Taper la commande

1. Cliquez dans la zone après le `>`
2. Tapez : `window.reinitFirebase()`
3. Appuyez sur **Entrée**

### 4. Voir le résultat

Vous devriez voir des messages comme :

```
🔄 Réinitialisation Firebase...
🗑️ Suppression des instances existantes...
✅ Firebase réinitialisé ! projectId: oscar-baer
```

---

## 🎬 Exemple complet

Voici à quoi ça ressemble :

```
> window.reinitFirebase()
🔄 Réinitialisation Firebase...
🗑️ Suppression des instances existantes...
✅ Firebase réinitialisé ! projectId: oscar-baer
true
```

---

## 🔍 Autres commandes utiles

Une fois la console ouverte, vous pouvez aussi tester :

```javascript
// Vérifier la configuration
console.log('FIREBASE_CONFIG:', window.FIREBASE_CONFIG);

// Diagnostic complet
window.diagnosticFirebase();

// Vérifier Firebase
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
```

---

## 🖱️ Copier-coller dans la console

### Sur Mac :

1. **Copier** : `Cmd + C`
2. **Coller** : `Cmd + V`

**Astuce :** Vous pouvez copier-coller les commandes directement depuis ce guide !

---

## ✅ Vérification

Après avoir exécuté `window.reinitFirebase()`, vous devriez voir :

- ✅ Des messages de succès dans la console
- ✅ `window.firebaseApp` n'est plus `undefined`
- ✅ `window.firebaseDb` n'est plus `undefined`
- ✅ Le projectId est `oscar-baer` (pas `YOUR_PROJECT_ID`)

---

## 🐛 Si la console ne s'ouvre pas

### Chrome/Edge :
- Essayez `Cmd + Shift + J` (Mac)
- Ou `Ctrl + Shift + J` (Windows)

### Firefox :
- Essayez `Cmd + Shift + K` (Mac)
- Ou `Ctrl + Shift + K` (Windows)

### Safari :
- Activez d'abord le menu Développement (voir ci-dessus)

---

## 📸 Aperçu visuel

```
┌─────────────────────────────────────────────────┐
│  Navigateur (Chrome)                            │
├─────────────────────────────────────────────────┤
│  [Votre site web]                               │
│                                                 │
├─────────────────────────────────────────────────┤
│  Console (F12 ou Cmd+Option+I)                  │
│  ────────────────────────────────────────────  │
│  🛡️ Firebase Setup Inline - Démarrage          │
│  ✅ window.FIREBASE_CONFIG défini: ...          │
│                                                 │
│  > window.reinitFirebase()  ← Tapez ici         │
│    [Entrée]                                     │
│                                                 │
│  🔄 Réinitialisation Firebase...                │
│  ✅ Firebase réinitialisé !                     │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Résumé rapide

1. **Ouvrez votre site** dans le navigateur
2. **Appuyez sur** `Cmd + Option + I` (ou `F12`)
3. **Cliquez sur l'onglet Console**
4. **Tapez** : `window.reinitFirebase()`
5. **Appuyez sur Entrée**

C'est tout ! 🎉

---

**Dernière mise à jour** : 21 décembre 2025

