# Configuration Firebase en CDN

Ce guide explique comment utiliser Firebase via CDN (Content Delivery Network) au lieu de npm.

## ✅ Méthode actuelle : Modules ES6 via CDN (Recommandé)

Votre projet utilise déjà Firebase v12.7.0 via CDN avec les modules ES6. Voici comment c'est configuré :

### Dans `pages/basketball-game.html` :

```html
<!-- Firebase SDK v12.7.0 - Modules ES6 -->
<script type="module">
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
    import { getFirestore, Timestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Exposer Firebase pour les autres scripts
    window.firebaseApp = app;
    window.firebaseDb = db;
    window.firebaseTimestamp = Timestamp;
    window.firebaseInitialized = true;
    
    console.log('✅ Firebase initialisé avec succès (v12.7.0)');
    console.log('✅ Project ID:', app.options.projectId);
</script>
```

## 📚 Autres méthodes CDN disponibles

### Méthode 1 : Modules ES6 (Actuelle - Recommandée)

**Avantages :**
- ✅ Syntaxe moderne
- ✅ Tree-shaking (charge uniquement ce dont vous avez besoin)
- ✅ Meilleures performances
- ✅ Compatible avec les navigateurs modernes

**URLs disponibles :**
- `https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js`
- `https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js`
- `https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js`
- `https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js`
- etc.

### Méthode 2 : Compatibilité (Legacy)

Si vous avez besoin de la compatibilité avec l'ancienne syntaxe :

```html
<!-- Firebase SDK Compat -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<script>
    // Configuration Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
</script>
```

### Méthode 3 : Bundle complet (Non recommandé - Trop lourd)

```html
<!-- Firebase SDK Bundle complet (tous les services) -->
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
    // ... autres imports
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
</script>
```

## 🔧 Comment obtenir votre configuration Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet (oscar-baer)
3. Cliquez sur l'icône d'engrenage ⚙️ > **Project settings**
4. Descendez jusqu'à **Your apps**
5. Cliquez sur l'icône Web `</>`
6. Copiez la configuration qui apparaît

## 📦 Différence entre CDN et npm

### CDN (Actuel)
- ✅ Pas besoin d'installer des packages
- ✅ Pas de build nécessaire
- ✅ Fonctionne directement dans le navigateur
- ✅ Mise à jour facile (changer la version dans l'URL)
- ✅ Cache du navigateur pour de meilleures performances

### npm (Alternative)
```bash
npm install firebase
```

```javascript
// Dans votre code
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
```

- ❌ Nécessite un bundler (webpack, vite, etc.)
- ❌ Plus complexe à configurer
- ❌ Taille du bundle plus importante

## ✅ Votre configuration actuelle

Votre projet utilise **Firebase v12.7.0 via CDN avec modules ES6**, ce qui est la meilleure approche pour un site statique.

**Fichiers concernés :**
- `pages/basketball-game.html` : Script Firebase en module ES6
- `js/space-shooter.js` : Utilise `window.firebaseDb` pour accéder à Firestore

## 🚀 Mise à jour de la version

Pour mettre à jour Firebase, changez simplement le numéro de version dans les URLs :

```html
<!-- Ancienne version -->
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

<!-- Nouvelle version -->
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
```

## 📝 Notes importantes

1. **Modules ES6** : Nécessite un navigateur moderne (tous les navigateurs récents le supportent)
2. **Type de script** : Utilisez `type="module"` pour les imports ES6
3. **Ordre de chargement** : Le script Firebase doit être chargé AVANT `space-shooter.js`
4. **Exposition globale** : Les variables sont exposées via `window.*` pour être accessibles aux autres scripts

## 🔍 Vérification

Pour vérifier que Firebase est bien chargé, ouvrez la console du navigateur (F12) et vous devriez voir :

```
✅ Firebase initialisé avec succès (v12.7.0)
✅ Project ID: oscar-baer
```

