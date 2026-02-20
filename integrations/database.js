// Integracja z bazą danych Supabase

// Inicjalizacja klienta Supabase
const supabaseClient = supabase.createClient(DATABASE_CONFIG.url, DATABASE_CONFIG.anonKey);

/**
 * Zapisuje wynik gry do bazy danych
 * @param {string} gameResult - Wynik gry (komunikat końcowy)
 * @returns {Promise<object>} Odpowiedź z bazy danych
 */
async function saveGameResult(gameResult) {
    try {
        const playerName = window.currentPlayerName || 'Anonim';
        
        const { data, error } = await supabaseClient
            .schema('ttt')
            .from('games_history')
            .insert([
                {
                    player_name: playerName,
                    game_result: gameResult,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Błąd zapisu do Supabase:', error);
            return { success: false, error };
        }

        console.log('Wynik zapisany do bazy:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Błąd podczas zapisu:', err);
        return { success: false, error: err };
    }
}
