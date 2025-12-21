/**
 * ============================================
 * FONCTIONS SUPABASE POUR LE LEADERBOARD
 * ============================================
 * 
 * Remplace les fonctions Firebase par Supabase
 * Beaucoup plus simple !
 */

// Constante pour le nombre maximum d'entrées dans le leaderboard
const MAX_LEADERBOARD_ENTRIES = 10;

// Fonction pour initialiser Supabase
function initSupabase() {
    if (window.supabaseClient && window.supabaseInitialized) {
        return window.supabaseClient;
    }
    
    console.warn('⚠️ Supabase non initialisé');
    console.warn('💡 Vérifiez que js/supabase-init.js est chargé');
    return null;
}

// Fonction pour charger le leaderboard depuis Supabase
async function loadLeaderboardFromSupabase() {
    const supabase = initSupabase();
    
    if (!supabase) {
        console.warn('⚠️ Supabase non disponible, chargement depuis localStorage');
        console.warn('💡 Vérifiez que Supabase est initialisé: window.diagnosticSupabase()');
        return loadLeaderboardFromLocalStorage();
    }
    
    try {
        console.log('📥 Chargement du leaderboard depuis Supabase...');
        console.log('🔗 URL:', window.supabaseClient?.supabaseUrl || 'Non disponible');
        console.log('🔑 Client Supabase:', window.supabaseClient);
        
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(MAX_LEADERBOARD_ENTRIES);
        
        console.log('📊 Réponse Supabase complète:', { data, error });
        console.log('📊 Type de data:', typeof data);
        console.log('📊 Est un array?', Array.isArray(data));
        console.log('📊 Nombre de données:', data ? data.length : 0);
        
        // Vérifier spécifiquement les erreurs RLS
        if (error) {
            console.error('❌ ERREUR Supabase détectée:', error);
            console.error('❌ Code erreur:', error.code);
            console.error('❌ Message:', error.message);
            console.error('❌ Détails:', error.details);
            console.error('❌ Hint:', error.hint);
            
            if (error.code === 'PGRST116') {
                console.error('❌ ERREUR RLS: Permission denied');
                console.error('💡 SOLUTION: Allez sur Supabase Dashboard → Table Editor → leaderboard → Policies');
                console.error('💡 Créez une policy SELECT avec "true" pour permettre la lecture');
            }
            throw error;
        }
        
        if (!data) {
            console.warn('⚠️ data est null ou undefined');
            console.log('📭 Fallback vers localStorage');
            return loadLeaderboardFromLocalStorage();
        }
        
        if (!Array.isArray(data)) {
            console.error('❌ data n\'est pas un array:', typeof data, data);
            console.log('📭 Fallback vers localStorage');
            return loadLeaderboardFromLocalStorage();
        }
        
        if (data.length === 0) {
            console.log('📭 Aucun score dans Supabase (table vide), chargement depuis localStorage');
            return loadLeaderboardFromLocalStorage();
        }
        
        console.log('✅ Données reçues de Supabase:', data.length, 'scores');
        
        console.log('📋 Données brutes Supabase:', data);
        
        // Convertir les données Supabase au format attendu
        const leaderboardData = data.map(entry => {
            const formatted = {
                id: entry.id,
                name: entry.name || 'Anonyme',
                score: Number(entry.score) || 0,
                level: Number(entry.level) || 1,
                date: entry.created_at || entry.date || new Date().toISOString()
            };
            console.log('📝 Entrée formatée:', formatted);
            return formatted;
        });
        
        console.log('✅ Données formatées:', leaderboardData);
        
        // Sauvegarder dans localStorage comme backup
        localStorage.setItem('spaceShooterLeaderboard', JSON.stringify(leaderboardData));
        
        console.log(`✅ Leaderboard chargé depuis Supabase: ${leaderboardData.length} scores`);
        return leaderboardData;
        
    } catch (error) {
        console.error('❌ Erreur chargement leaderboard Supabase:', error);
        console.error('📝 Message:', error.message);
        
        // Fallback vers localStorage
        return loadLeaderboardFromLocalStorage();
    }
}

// Fonction pour charger depuis localStorage (fallback)
function loadLeaderboardFromLocalStorage() {
    try {
        const stored = localStorage.getItem('spaceShooterLeaderboard');
        if (stored) {
            const data = JSON.parse(stored);
            console.log(`📦 Leaderboard chargé depuis localStorage: ${data.length} scores`);
            return data;
        }
    } catch (e) {
        console.error('Erreur chargement localStorage:', e);
    }
    return [];
}

// Fonction pour sauvegarder un score dans Supabase
async function saveScoreToSupabase(name, score, level) {
    const supabase = initSupabase();
    
    if (!supabase) {
        console.warn('⚠️ Supabase non disponible, sauvegarde locale uniquement');
        return false;
    }
    
    try {
        console.log('💾 Sauvegarde du score dans Supabase...');
        console.log('🔗 URL:', window.supabaseClient?.supabaseUrl || 'Non disponible');
        console.log('📝 Données à enregistrer:', { 
            name: name.substring(0, 20), 
            score: Number(score), 
            level: Number(level) 
        });
        
        const scoreData = {
            name: name.substring(0, 20).trim(),
            score: Number(score),
            level: Number(level)
        };
        
        console.log('📦 Données formatées:', scoreData);
        
        // Méthode 1 : Utiliser la fonction SQL (recommandé)
        // Appeler la fonction PostgreSQL insert_leaderboard_score
        const { data: functionData, error: functionError } = await supabase.rpc('insert_leaderboard_score', {
            p_name: scoreData.name,
            p_score: scoreData.score,
            p_level: scoreData.level
        });
        
        if (functionError) {
            console.warn('⚠️ Fonction SQL non disponible, tentative insertion directe...', functionError);
            
            // Méthode 2 : Fallback vers insertion directe
            const { data, error } = await supabase
                .from('leaderboard')
                .insert([scoreData])
                .select();
            
            console.log('📊 Réponse Supabase (insert direct):', { data, error });
            
            if (error) {
                console.error('❌ Erreur lors de l\'insertion:', error);
                throw error;
            }
            
            console.log('✅ Score enregistré via insertion directe avec ID:', data[0]?.id);
            console.log('✅ Données enregistrées:', data[0]);
            return true;
        }
        
        // Vérifier le résultat de la fonction
        console.log('📊 Réponse fonction SQL:', functionData);
        
        if (functionData && functionData.success) {
            console.log('✅ Score enregistré via fonction SQL avec ID:', functionData.id);
            return true;
        } else {
            console.error('❌ Fonction SQL a retourné une erreur:', functionData);
            throw new Error(functionData?.message || 'Erreur inconnue');
        }
        
        console.log('✅ Score enregistré dans Supabase avec ID:', data[0]?.id);
        console.log('✅ Données enregistrées:', data[0]);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erreur sauvegarde Supabase:', error);
        console.error('📝 Message:', error.message);
        console.error('📝 Code:', error.code);
        console.error('📝 Détails:', error);
        
        if (error.code === 'PGRST116' || error.code === '42501') {
            console.error('');
            console.error('🔒 ============================================');
            console.error('🔒 PERMISSION DENIED - RLS Policies');
            console.error('🔒 ============================================');
            console.error('');
            console.error('📋 SOLUTION:');
            console.error('   1. Allez sur https://supabase.com/dashboard');
            console.error('   2. Votre projet → Table Editor → leaderboard');
            console.error('   3. Onglet "Policies"');
            console.error('   4. Créez 2 policies:');
            console.error('      - SELECT: Allow public read (true)');
            console.error('      - INSERT: Allow public insert (true)');
            console.error('   5. Voir SETUP_SUPABASE.md étape 6');
            console.error('');
        } else if (error.code === '42P01') {
            console.error('');
            console.error('📦 ============================================');
            console.error('📦 TABLE NON TROUVÉE');
            console.error('📦 ============================================');
            console.error('');
            console.error('📋 SOLUTION:');
            console.error('   1. Allez sur https://supabase.com/dashboard');
            console.error('   2. Votre projet → Table Editor');
            console.error('   3. Créez la table "leaderboard"');
            console.error('   4. Colonnes: id, name, score, level, created_at');
            console.error('   5. Voir SETUP_SUPABASE.md étape 3-4');
            console.error('');
        }
        
        return false;
    }
}

// Export des fonctions pour utilisation dans space-shooter.js
window.supabaseLeaderboard = {
    load: loadLeaderboardFromSupabase,
    save: saveScoreToSupabase,
    init: initSupabase
};

// Log pour vérifier que le module est bien chargé
console.log('✅ Module space-shooter-supabase.js chargé');
console.log('📦 window.supabaseLeaderboard:', window.supabaseLeaderboard);
console.log('🔍 load function:', typeof window.supabaseLeaderboard.load);
console.log('🔍 save function:', typeof window.supabaseLeaderboard.save);

console.log('✅ Module Supabase leaderboard chargé');
console.log('💡 Fonctions disponibles:');
console.log('   - window.supabaseLeaderboard.load() : Charger le leaderboard');
console.log('   - window.supabaseLeaderboard.save(name, score, level) : Sauvegarder un score');

