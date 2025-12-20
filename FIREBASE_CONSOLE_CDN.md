# Comment obtenir la configuration Firebase CDN depuis Firebase Console

Ce guide vous explique comment obtenir la configuration Firebase pour CDN depuis l'interface web Firebase Console, même si npm est sélectionné par défaut.

## 📋 Étapes détaillées

### Étape 1 : Accéder à Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet **oscar-baer**

### Étape 2 : Accéder aux paramètres du projet

1. Cliquez sur l'**icône d'engrenage** ⚙️ en haut à gauche (à côté du nom du projet)
2. Cliquez sur **Project settings** (Paramètres du projet)

### Étape 3 : Trouver la section "Your apps"

1. Descendez dans la page jusqu'à la section **"Your apps"** (Vos applications)
2. Vous verrez la liste de vos applications web, iOS, Android, etc.

### Étape 4 : Sélectionner ou créer une application Web

**Si vous avez déjà une app web :**
- Cliquez sur l'icône Web `</>` de votre application existante

**Si vous n'avez pas d'app web :**
1. Cliquez sur l'icône Web `</>` dans la section "Your apps"
2. Donnez un nom à votre app (ex: "Portfolio Leaderboard")
3. **Ne cochez PAS** "Also set up Firebase Hosting" (si vous utilisez Vercel)
4. Cliquez sur **Register app** (Enregistrer l'application)

### Étape 5 : Obtenir la configuration CDN

Après avoir sélectionné/créé votre app web, Firebase affiche la configuration. **Par défaut, Firebase montre la configuration npm**, mais vous pouvez obtenir la configuration CDN :

#### Option A : Utiliser la configuration affichée (elle fonctionne pour CDN aussi)

Firebase affiche quelque chose comme :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
  authDomain: "oscar-baer.firebaseapp.com",
  projectId: "oscar-baer",
  storageBucket: "oscar-baer.firebasestorage.app",
  messagingSenderId: "419618942184",
  appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};
```

**Cette configuration fonctionne pour CDN aussi !** Vous n'avez qu'à l'utiliser avec les imports CDN.

#### Option B : Changer le format d'affichage

1. Dans la page de configuration, cherchez un menu déroulant ou des onglets
2. Cherchez des options comme :
   - **"CDN"** ou **"Script tags"**
   - **"npm"** (actuellement sélectionné)
   - **"Config"** ou **"Configuration"**

3. Si vous voyez un onglet **"CDN"** ou **"Script tags"**, cliquez dessus

#### Option C : Utiliser directement la configuration (Recommandé)

Même si Firebase affiche la configuration npm, vous pouvez utiliser cette configuration avec CDN. Voici comment :

**Configuration Firebase (identique pour npm et CDN) :**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
  authDomain: "oscar-baer.firebaseapp.com",
  projectId: "oscar-baer",
  storageBucket: "oscar-baer.firebasestorage.app",
  messagingSenderId: "419618942184",
  appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
};
```

**Utilisation avec CDN (modules ES6) :**
```html
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

    // Utilisez la configuration de Firebase Console
    const firebaseConfig = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
</script>
```

## 🔍 Où trouver les clés dans Firebase Console

Si vous ne voyez pas la configuration complète, voici où trouver chaque clé :

1. **apiKey** : Dans "Project settings" > "Your apps" > Votre app web
2. **authDomain** : Généralement `votre-project-id.firebaseapp.com`
3. **projectId** : En haut de la page "Project settings" (ex: `oscar-baer`)
4. **storageBucket** : Généralement `votre-project-id.firebasestorage.app`
5. **messagingSenderId** : Dans "Project settings" > "Your apps" > Votre app web
6. **appId** : Dans "Project settings" > "Your apps" > Votre app web

## ⚠️ Important

**La configuration Firebase est la MÊME pour npm et CDN !**

La seule différence est :
- **npm** : `import { initializeApp } from 'firebase/app'`
- **CDN** : `import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js'`

Les clés de configuration (`apiKey`, `projectId`, etc.) sont identiques dans les deux cas.

## ✅ Votre configuration actuelle

Votre projet utilise déjà la bonne configuration CDN dans `pages/basketball-game.html` :

```html
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
    import { getFirestore, Timestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM",
        authDomain: "oscar-baer.firebaseapp.com",
        projectId: "oscar-baer",
        storageBucket: "oscar-baer.firebasestorage.app",
        messagingSenderId: "419618942184",
        appId: "1:419618942184:web:60e8e58c6c3348a3fbad5d"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
</script>
```

## 📝 Note

Firebase Console affiche souvent npm par défaut car c'est la méthode la plus courante pour les applications modernes avec build tools. Mais la configuration fonctionne parfaitement avec CDN aussi !

## 🔗 URLs CDN Firebase

Pour utiliser Firebase via CDN, utilisez ces URLs :

- **Firebase App** : `https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js`
- **Firestore** : `https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js`
- **Auth** : `https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js`
- **Storage** : `https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js`

Remplacez `12.7.0` par la version que vous souhaitez utiliser.

