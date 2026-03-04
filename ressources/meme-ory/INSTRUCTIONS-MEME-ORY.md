# Meme-ory : images

## Format de base

- **Formats acceptés : JPG ou PNG** (priorité au JPG).
- **16 images** : `meme1.jpg`, `meme2.jpg`, … `meme16.jpg` (ou `.png`).
- **Taille max : 150 Ko par fichier** — les images plus lourdes sont ignorées (pour que ça charge bien sur le web).

Noms exacts : **meme1**, **meme2**, … **meme16** (sans tiret), extension **.jpg** ou **.png**.

## Où les mettre

Dans le dossier :  
`ressources/meme-ory/`

## Régénérer le jeu après avoir changé les images

À la **racine du projet**, dans un terminal :

```bash
node scripts/build-meme-ory-images.js
```

Cela met à jour `js/meme-ory-images.js`. Les images trop lourdes (> 150 Ko) sont remplacées par une image placeholder.

## En résumé

1. Mettre 16 images (JPG ou PNG, max 150 Ko chacune) nommées `meme1` … `meme16` dans `ressources/meme-ory/`.
2. Lancer `node scripts/build-meme-ory-images.js`.
3. Recharger la page du jeu (et faire un push si tu utilises Git).
