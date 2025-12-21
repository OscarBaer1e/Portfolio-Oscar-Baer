# 🧪 Test d'Insertion dans la Console

## ✅ Code de Test Corrigé

Copiez-collez ce code dans la console (F12) :

```javascript
// Test d'insertion directe (version corrigée)
(function() {
    const supabaseClient = window.supabaseClient;
    if (!supabaseClient) {
        console.error('❌ Supabase non initialisé');
        console.error('💡 Vérifiez que js/supabase-init.js est chargé');
        return;
    }
    
    console.log('✅ Supabase initialisé, test insertion...');
    console.log('🔗 URL:', supabaseClient.supabaseUrl);
    
    supabaseClient
        .from('leaderboard')
        .insert([{
            name: 'Test Console Direct',
            score: 9999,
            level: 10
        }])
        .select()
        .then(({ data, error }) => {
            console.log('📊 ============================================');
            console.log('📊 RÉSULTAT DU TEST');
            console.log('📊 ============================================');
            console.log('📊 Data:', data);
            console.log('📊 Error:', error);
            
            if (error) {
                console.error('❌ ERREUR:', error);
                console.error('❌ Code:', error.code);
                console.error('❌ Message:', error.message);
                console.error('❌ Détails:', error.details);
                console.error('❌ Hint:', error.hint);
                
                if (error.code === 'PGRST116' || error.code === '42501') {
                    console.error('');
                    console.error('🔒 ============================================');
                    console.error('🔒 PROBLÈME DE PERMISSIONS RLS');
                    console.error('🔒 ============================================');
                    console.error('');
                    console.error('📋 SOLUTION:');
                    console.error('1. Allez sur https://supabase.com/dashboard');
                    console.error('2. Table Editor → leaderboard → Policies');
                    console.error('3. Supprimez toutes les policies');
                    console.error('4. Créez 2 nouvelles:');
                    console.error('   - SELECT: true');
                    console.error('   - INSERT: with check (true)');
                }
            } else {
                console.log('✅ SUCCÈS! Score inséré avec ID:', data[0]?.id);
                console.log('✅ Données:', data[0]);
                console.log('');
                console.log('🎉 Si vous voyez ce message, Supabase fonctionne !');
                console.log('💡 Le problème vient peut-être du code du jeu.');
            }
        })
        .catch(err => {
            console.error('❌ Erreur catch:', err);
        });
})();
```

## 🔍 Alternative : Test Simple

Si le code ci-dessus ne fonctionne pas, essayez cette version encore plus simple :

```javascript
window.supabaseClient
    .from('leaderboard')
    .insert([{name: 'Test', score: 1000, level: 5}])
    .select()
    .then(r => console.log('Résultat:', r));
```

## 📝 Vérification des Données

Après le test, vérifiez dans Supabase :

1. Allez sur **Table Editor** → **leaderboard**
2. Vous devriez voir le score "Test Console Direct" avec 9999 points

Si vous le voyez, Supabase fonctionne et le problème vient du code du jeu.

