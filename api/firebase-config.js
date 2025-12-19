// API Route pour Vercel - Retourne la configuration Firebase
// Cette route injecte les variables d'environnement Vercel dans le code client
// 
// Pour utiliser cette route :
// 1. Configurez les variables d'environnement dans Vercel Dashboard
// 2. Cette route les expose de manière sécurisée au client
// 
// Note: Les clés Firebase API sont publiques par design, donc c'est OK de les exposer

module.exports = function handler(req, res) {
    // Vérifier que c'est une requête GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Retourner la configuration Firebase depuis les variables d'environnement
    // Note: Les clés Firebase API sont publiques par design, donc c'est OK de les exposer
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json({
        apiKey: process.env.FIREBASE_API_KEY || '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.FIREBASE_APP_ID || ''
    });
};

