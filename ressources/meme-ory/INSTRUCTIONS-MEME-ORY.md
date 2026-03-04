# Meme-ory : ce que tu dois faire pour que les images s’affichent

## 1. Format et noms des images

- **Format obligatoire : PNG** (pas JPG, pas WebP).
- **Nombre : 16 images.**
- **Noms exacts (minuscules, sans espace) :**
  - `meme1.png`
  - `meme2.png`
  - `meme3.png`
  - … jusqu’à …
  - `meme16.png`

Tu dois avoir **exactement** ces 16 fichiers dans le dossier  
`Portfolio-Oscar-Baer-main/ressources/meme-ory/`.

---

## 2. Où mettre les fichiers

Place tes 16 images ici :

```
Portfolio-Oscar-Baer-main/
  ressources/
    meme-ory/
      meme1.png
      meme2.png
      meme3.png
      ...
      meme16.png
```

Pas de tiret : **meme1** et non **meme-1**.  
Extension en minuscules : **.png**.

---

## 3. Régénérer le fichier JS (obligatoire)

Le jeu n’utilise pas les PNG directement : il charge un fichier JavaScript qui contient les images en base64. Il faut donc **régénérer** ce fichier après avoir mis tes 16 PNG au bon endroit.

À la **racine du projet** (dossier `Portfolio-Oscar-Baer-main`), ouvre un terminal et lance :

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'ressources/meme-ory';
const arr = [];
for (let i = 1; i <= 16; i++) {
  const p = path.join(dir, 'meme' + i + '.png');
  try {
    arr.push(fs.readFileSync(p).toString('base64'));
  } catch (e) {
    console.error('MANQUANT:', p);
    arr.push('');
  }
}
const out = 'const MEME_ORY_BASE64 = ' + JSON.stringify(arr) + ';\n';
fs.writeFileSync('js/meme-ory-images.js', out);
console.log('OK – js/meme-ory-images.js créé');
"
```

- Si tu vois `MANQUANT: ressources/meme-ory/memeX.png`, le fichier `memeX.png` n’est pas au bon endroit ou pas bien nommé.
- Si tu vois `OK – js/meme-ory-images.js créé`, c’est bon.

**Il faut avoir Node.js d’installé** (sinon installe-le depuis https://nodejs.org).

---

## 4. Résumé à faire à chaque fois que tu changes les images

1. Mettre **16 images PNG** dans `ressources/meme-ory/` avec les noms **meme1.png** … **meme16.png**.
2. Lancer la commande **node** ci-dessus à la racine du projet.
3. Vérifier que **js/meme-ory-images.js** a bien été mis à jour (et le commiter si tu utilises Git).

---

## 5. Si ça ne marche toujours pas

- Ouvre la page du jeu (Meme-ory), puis **F12** → onglet **Console**.
- Regarde s’il y a des erreurs en rouge.
- Vérifie que **js/meme-ory-images.js** est bien chargé : onglet **Réseau** (Network), recharge la page, et vérifie que `meme-ory-images.js` apparaît avec un statut 200.

Si tu suis ces étapes (format PNG, noms exacts, dossier `ressources/meme-ory/`, puis commande Node), les images sont censées s’afficher partout (local et en ligne).
