/**
 * ============================================
 * FONCTIONS SUPABASE POUR LE LEADERBOARD
 * ============================================
 * 
 * Remplace les fonctions Firebase par Supabase
 * Beaucoup plus simple !
 */

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
        
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(MAX_LEADERBOARD_ENTRIES);
        
        if (error) {
            throw error;
        }
        
        if (!data || data.length === 0) {
            console.log('📭 Aucun score dans Supabase, chargement depuis localStorage');
            return loadLeaderboardFromLocalStorage();
        }
        
        // Convertir les données Supabase au format attendu
        const leaderboardData = data.map(entry => ({
            id: entry.id,
            name: entry.name,
            score: entry.score,
            level: entry.level,
            date: entry.created_at || new Date().toISOString()
        }));
        
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
        console.log('Données:', { name: name.substring(0, 20), score, level });
        
        const { data, error } = await supabase
            .from('leaderboard')
            .insert([
                {
                    name: name.substring(0, 20),
                    score: Number(score),
                    level: Number(level)
                }
            ])
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Score enregistré dans Supabase avec ID:', data[0]?.id);
        
        // Recharger le leaderboard après un court délai
        setTimeout(() => {
            loadLeaderboardFromSupabase().then(newLeaderboard => {
                if (newLeaderboard) {
                    leaderboard = newLeaderboard;
                    updateLeaderboardDisplay();
                }
            }).catch(err => {
                console.warn('Erreur rechargement leaderboard:', err);
            });
        }, 1000);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erreur sauvegarde Supabase:', error);
        console.error('📝 Message:', error.message);
        
        if (error.code === 'PGRST116') {
            console.error('🔒 PERMISSION DENIED - Vérifiez les policies RLS dans Supabase');
            console.error('📋 Solution: Voir SETUP_SUPABASE.md étape 6');
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

console.log('✅ Module Supabase leaderboard chargé');
console.log('💡 Fonctions disponibles:');
console.log('   - window.supabaseLeaderboard.load() : Charger le leaderboard');
console.log('   - window.supabaseLeaderboard.save(name, score, level) : Sauvegarder un score');

