/**
 * ============================================
 * SUPABASE INITIALISATION - SIMPLE ET RAPIDE
 * ============================================
 * 
 * Supabase est beaucoup plus simple que Firebase !
 * 
 * Expose sur window :
 * - window.supabaseClient : Client Supabase
 * - window.supabaseInitialized : Boolean
 * - window.diagnosticSupabase() : Fonction de diagnostic
 * - window.reinitSupabase() : Fonction de réinitialisation
 */

(function() {
    'use strict';

    // Configuration Supabase
    // ⚠️ REMPLACEZ ces valeurs par les vôtres après avoir créé votre projet Supabase
    const SUPABASE_CONFIG = {
        url: 'VOTRE_URL_SUPABASE', // Exemple: 'https://xxxxx.supabase.co'
        anonKey: 'VOTRE_ANON_KEY'  // Exemple: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    };

    // Vérifier si Supabase est chargé
    function initSupabase() {
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase SDK non chargé');
            console.error('💡 Vérifiez que le script Supabase est chargé dans le HTML');
            return false;
        }

        // Vérifier que la config est définie
        if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'VOTRE_URL_SUPABASE' ||
            !SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.anonKey === 'VOTRE_ANON_KEY') {
            console.warn('⚠️ Configuration Supabase non définie');
            console.warn('💡 Créez un projet sur https://supabase.com/ puis mettez à jour SUPABASE_CONFIG');
            return false;
        }

        try {
            // Créer le client Supabase
            const client = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            
            // Exposer sur window
            window.supabaseClient = client;
            window.supabaseInitialized = true;

            console.log('✅ Supabase initialisé avec succès !');
            console.log('✅ URL:', SUPABASE_CONFIG.url);
            console.log('✅ window.supabaseClient:', window.supabaseClient);

            return true;
        } catch (error) {
            console.error('❌ Erreur initialisation Supabase:', error);
            return false;
        }
    }

    // Fonction de diagnostic
    window.diagnosticSupabase = function() {
        console.log('🔍 === DIAGNOSTIC SUPABASE ===');
        console.log('1. Supabase SDK chargé:', typeof supabase !== 'undefined');
        console.log('2. window.supabaseClient:', window.supabaseClient);
        console.log('3. window.supabaseInitialized:', window.supabaseInitialized);
        console.log('4. Configuration:', {
            url: SUPABASE_CONFIG.url,
            anonKey: SUPABASE_CONFIG.anonKey ? SUPABASE_CONFIG.anonKey.substring(0, 20) + '...' : 'Non définie'
        });
        
        if (window.supabaseClient) {
            console.log('5. Test de connexion...');
            window.supabaseClient
                .from('leaderboard')
                .select('*')
                .limit(1)
                .then(({ data, error }) => {
                    if (error) {
                        console.error('   ❌ Erreur:', error.message);
                    } else {
                        console.log('   ✅ Connexion OK - Documents:', data?.length || 0);
                    }
                });
        }
        console.log('========================');
    };

    // Fonction de réinitialisation
    window.reinitSupabase = function() {
        console.log('🔄 Réinitialisation Supabase...');
        window.supabaseClient = undefined;
        window.supabaseInitialized = false;
        return initSupabase();
    };

    // Initialiser Supabase
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initSupabase, 100);
        });
    } else {
        setTimeout(initSupabase, 100);
    }

    console.log('✅ Module Supabase initialisation chargé');
    console.log('💡 Fonctions disponibles:');
    console.log('   - window.diagnosticSupabase() : Diagnostic complet');
    console.log('   - window.reinitSupabase() : Réinitialiser Supabase');
})();

