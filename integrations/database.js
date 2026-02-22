// Integracja z bazą danych Supabase

// Inicjalizacja klienta Supabase
const supabaseClient = supabase.createClient(DATABASE_CONFIG.url, DATABASE_CONFIG.anonKey);

/**
 * Zapisuje wynik gry do bazy danych
 * @param {string} result - Wynik gry (komunikat końcowy)
 * @returns {Promise<object>} Odpowiedź z bazy danych
 */
async function saveGameResult(result) {
    try {
        const playerName = window.currentPlayerName || 'Anonim';
        if (!isValidresult(result)) {
            const error = new Error(`Nieprawidłowy wynik gry: ${result}`);
            console.error('Błąd zapisu do Supabase:', error);
            return { success: false, error };
        }

        const movesCount = getMovesCount();
        const finalBoard = getFinalBoardState();

        const { data, error } = await supabaseClient
            .schema('ttt')
            .from('games')
            .insert([
                {
                    player_x: playerName,
                    player_o: 'komputer',
                    result: result,
                    moves_count: movesCount,
                    final_board: finalBoard
                }
            ])
            .select();

        if (error) {
            console.error('Błąd zapisu do Supabase:', error);
            return { success: false, error };
        }

        console.log('Wynik zapisany do bazy:', data);
        loadUserHistory(playerName);
        loadTopPlayers();
        return { success: true, data };
    } catch (err) {
        console.error('Błąd podczas zapisu:', err);
        return { success: false, error: err };
    }
}

function isValidresult(result) {
    return result === 'gracz' || result === 'komputer' || result === 'remis';
}

function getMovesCount() {
    if (typeof board === 'undefined' || !Array.isArray(board)) {
        return 0;
    }

    return board.filter(cell => cell !== 0).length;
}

function getFinalBoardState() {
    if (typeof board === 'undefined' || !Array.isArray(board) || board.length !== 9) {
        return null;
    }

    return board.map(cell => {
        if (cell === 1) return 'X';
        if (cell === 2) return 'O';
        return '_';
    }).join('');
}

/**
 * Pobiera ostatnie gry dla gracza ze względu na widok bazy danych
 * @param {string} playerName - Nazwa gracza
 * @returns {Promise<object>} Odpowiedź z bazy danych
 */
async function loadUserHistory(playerName) {
    try {
        const { data, error } = await supabaseClient
            .schema('ttt')
            .rpc('get_user_history', { p_player_name: playerName });

        if (error) {
            console.error('Błąd pobierania historii użytkownika:', error);
            return { success: false, error };
        }

        const limitedData = (data || []).slice(0, 12);
        displayUserHistory(limitedData);
        return { success: true, data: limitedData };
    } catch (err) {
        console.error('Błąd podczas pobierania historii użytkownika:', err);
        return { success: false, error: err };
    }
}

/**
 * Pobiera topowych graczy (po liczbie wygranych) ze widoku bazy danych - top 12
 * @returns {Promise<object>} Odpowiedź z bazy danych
 */
async function loadTopPlayers() {
    try {
        const { data, error } = await supabaseClient
            .schema('ttt')
            .from('top_players')
            .select('player_name, wins')

        if (error) {
            console.error('Błąd pobierania topowych graczy:', error);
            return { success: false, error };
        }

        displayTopPlayers(data || []);
        return { success: true, data };
    } catch (err) {
        console.error('Błąd podczas pobierania topowych graczy:', err);
        return { success: false, error: err };
    }
}

/**
 * Wyświetla historię użytkownika w tabeli
 * @param {array} games - Tablica rekordów gier
 */
function displayUserHistory(games) {
    const tbody = document.getElementById('gamesTableBody');
    
    if (!tbody) return;
    
    if (!games || games.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">Brak gier</td></tr>';
        return;
    }
    
    tbody.innerHTML = games.map(game => {
        const date = new Date(game.created_at).toLocaleDateString('pl-PL');
        const result = game.game_result ?? game.result;
        return `
            <tr>
                <td>${result}</td>
                <td>${date}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Wyświetla topowych graczy w tabeli
 * @param {array} topPlayers - Tablica topowych graczy z liczbą wygranych
 */
function displayTopPlayers(topPlayers) {
    const tbody = document.getElementById('statsTableBody');
    
    if (!tbody) return;
    
    if (!topPlayers || topPlayers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">Brak danych</td></tr>';
        return;
    }
    
    tbody.innerHTML = topPlayers.map(player => {
        return `
        <tr>
            <td>${player.player_name}</td>
            <td>${player.wins}</td>
        </tr>
    `;
    }).join('');
}
