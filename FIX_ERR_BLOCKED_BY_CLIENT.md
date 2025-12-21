# 🔧 Fix : ERR_BLOCKED_BY_CLIENT et YOUR_PROJECT_ID

## 🐛 Problèmes identifiés

1. **`ERR_BLOCKED_BY_CLIENT`** : Bloqué par une extension de navigateur (bloqueur de pub, privacy, etc.)
2. **`YOUR_PROJECT_ID`** dans l'URL : Firebase n'est pas correctement initialisé
3. **`window.firebaseDb` est `undefined`** : Le module npm ne se charge pas

## ✅ Solution : Retour à CDN

Les modules ES6 npm ne fonctionnent pas correctement. On est revenu à **CDN** (plus fiable).

### Changements effectués :

1. ✅ Retour à Firebase CDN (v10.7.1 compat)
2. ✅ Suppression automatique des instances existantes avant initialisation
3. ✅ Vérification stricte du `projectId` avant et après initialisation
4. ✅ Meilleure gestion des erreurs

---

## 🔍 Vérification

### 1. Vider le cache du navigateur

**Chrome/Edge** :
- `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
- Cochez "Images et fichiers en cache"
- Cliquez sur "Effacer les données"

**Firefox** :
- `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
- Cochez "Cache"
- Cliquez sur "Effacer maintenant"

**Safari** :
- `Cmd+Option+E` (vider le cache)

### 2. Désactiver les bloqueurs

**Extensions à désactiver temporairement** :
- uBlock Origin
- AdBlock
- Privacy Badger
- Ghostery
- Tout autre bloqueur de publicité/tracking

**Comment** :
1. Ouvrez les extensions : `chrome://extensions/` (Chrome) ou `about:addons` (Firefox)
2. Désactivez temporairement les bloqueurs
3. Rechargez la page avec `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)

### 3. Tester dans la console

Ouvrez la console (F12) et testez :

```javascript
// Vérifier que Firebase est initialisé
console.log('firebaseApp:', window.firebaseApp);
console.log('firebaseDb:', window.firebaseDb);
console.log('firebaseInitialized:', window.firebaseInitialized);

// Si undefined, réinitialiser
if (!window.firebaseDb) {
    console.log('Réinitialisation Firebase...');
    window.reinitFirebase();
}

// Attendre un peu puis vérifier
setTimeout(() => {
    console.log('firebaseDb après réinit:', window.firebaseDb);
    if (window.firebaseDb) {
        window.firebaseDb.collection('leaderboard').limit(1).get()
            .then(s => console.log('✅ OK - Documents:', s.size))
            .catch(e => console.error('❌ Erreur:', e.code, e.message));
    }
}, 1000);
```

---

## 🚨 Si ERR_BLOCKED_BY_CLIENT persiste

### Solution 1 : Mode navigation privée

Testez en mode navigation privée (sans extensions) :
- Chrome : `Ctrl+Shift+N` (Windows) / `Cmd+Shift+N` (Mac)
- Firefox : `Ctrl+Shift+P` (Windows) / `Cmd+Shift+P` (Mac)

### Solution 2 : Désactiver les extensions une par une

1. Désactivez toutes les extensions
2. Testez si ça fonctionne
3. Réactivez-les une par une pour identifier le coupable

### Solution 3 : Ajouter une exception

Si vous utilisez uBlock Origin :
1. Cliquez sur l'icône uBlock
2. Cliquez sur l'icône de l'engrenage (paramètres)
3. Allez dans "Filtres personnalisés"
4. Ajoutez :
   ```
   @@||firestore.googleapis.com^$domain=your-domain.com
   @@||firebase.googleapis.com^$domain=your-domain.com
   ```

---

## ✅ Vérification finale

Après avoir vidé le cache et désactivé les bloqueurs :

1. Rechargez la page avec `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)
2. Ouvrez la console (F12)
3. Vous devriez voir :
   ```
   ✅ Firebase initialisé avec succès (CDN v10.7.1)
   ✅ Project ID vérifié: oscar-baer
   ✅ window.firebaseDb: [object Object]
   ```
4. Testez : `console.log(window.firebaseDb)` → Doit afficher un objet

---

## 📝 Notes

- **CDN vs npm** : CDN est plus simple et fonctionne partout, npm nécessite un bundler
- **ERR_BLOCKED_BY_CLIENT** : C'est presque toujours un bloqueur de pub/extension
- **YOUR_PROJECT_ID** : Signifie que Firebase n'a pas été initialisé avec la bonne config

---

**Dernière mise à jour** : 21 décembre 2025

