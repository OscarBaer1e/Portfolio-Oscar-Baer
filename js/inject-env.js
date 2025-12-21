/**
 * ============================================
 * INJECTION DES VARIABLES D'ENVIRONNEMENT
 * ============================================
 * 
 * Ce script injecte les variables d'environnement Vercel
 * dans window pour qu'elles soient accessibles dans le code
 */

(function() {
    'use strict';
    
    // Injecter les variables d'environnement Vercel dans window
    // Vercel expose les variables avec NEXT_PUBLIC_ dans le build
    if (typeof window !== 'undefined') {
        // Les variables sont injectées par Vercel au build time
        // On les expose sur window pour qu'elles soient accessibles
        window.SUPABASE_URL = window.SUPABASE_URL || 
            (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
            null;
            
        window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 
            (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
            null;
    }
    
    console.log('🔧 Variables d\'environnement chargées:', {
        hasUrl: !!window.SUPABASE_URL,
        hasKey: !!window.SUPABASE_ANON_KEY
    });
})();

