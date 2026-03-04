#!/usr/bin/env node
/**
 * Génère js/meme-ory-images.js à partir des images dans ressources/meme-ory/
 * Accepte JPG et PNG (priorité: JPG = format de base). Exclut les images > 150 Ko pour le web.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'ressources', 'meme-ory');
const OUT = path.join(__dirname, '..', 'js', 'meme-ory-images.js');
const MAX_BYTES = 150 * 1024; // 150 Ko max par image pour rester léger sur le web

// 1x1 PNG transparent (placeholder si image absente ou trop lourde)
const PLACEHOLDER_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const base64 = [];
const mime = [];

for (let i = 1; i <= 16; i++) {
  const base = 'meme' + i;
  let buf = null;
  let type = 'png';
  // Priorité: JPG (format de base) puis PNG
  for (const ext of ['jpg', 'jpeg', 'png']) {
    const p = path.join(DIR, base + '.' + ext);
    try {
      const stat = fs.statSync(p);
      if (stat.size > MAX_BYTES) continue; // trop lourd pour le web, on skip
      buf = fs.readFileSync(p);
      type = ext === 'png' ? 'png' : 'jpeg';
      break;
    } catch (e) {
      // fichier absent ou illisible
    }
  }
  if (buf && buf.length > 0) {
    base64.push(buf.toString('base64'));
    mime.push(type);
  } else {
    base64.push(PLACEHOLDER_B64);
    mime.push('png');
  }
}

const out = [
  '// Généré par scripts/build-meme-ory-images.js – ne pas éditer à la main',
  'const MEME_ORY_BASE64 = ' + JSON.stringify(base64) + ';',
  'const MEME_ORY_MIME = ' + JSON.stringify(mime) + ';',
  ''
].join('\n');

fs.writeFileSync(OUT, out);
console.log('OK: ' + OUT + ' (' + base64.filter(b => b !== PLACEHOLDER_B64).length + ' images incluses, ' + (16 - base64.filter(b => b !== PLACEHOLDER_B64).length) + ' placeholders)');
