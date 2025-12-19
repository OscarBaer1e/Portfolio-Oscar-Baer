// API Route pour Vercel - Retourne la configuration Firebase
// Cette route injecte les variables d'environnement Vercel dans le code client
// 
// IMPORTANT: Cette route retourne TOUJOURS les valeurs correctes par défaut
// pour éviter tout risque de YOUR_PROJECT_ID

export default function handler(req, res) {
    // Vérifier que c'est une requête GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Configuration Firebase garantie - Valeurs par défaut correctes
    // Les variables d'environnement Vercel sont optionnelles
    const config = {
        apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'oscar-baer.firebaseapp.com',
        projectId: process.env.FIREBASE_PROJECT_ID || 'oscar-baer',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'oscar-baer.firebasestorage.app',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '419618942184',
        appId: process.env.FIREBASE_APP_ID || '1:419618942184:web:60e8e58c6c3348a3fbad5d'
    };
    
    // Protection supplémentaire : jamais YOUR_PROJECT_ID
    if (config.projectId === 'YOUR_PROJECT_ID' || 
        config.projectId === 'votre-projet-id' ||
        !config.projectId) {
        config.projectId = 'oscar-baer';
    }
    if (config.apiKey === 'VOTRE_API_KEY' || !config.apiKey) {
        config.apiKey = 'AIzaSyCeZAZ6wQDqZ7ttzAt6VtvON5DDl1M5HSM';
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json(config);
}

