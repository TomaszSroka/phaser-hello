// Logika gry Kółko i Krzyżyk

/**
 * Sprawdza czy gracz wygrał
 * @param {number} board - Tablica reprezentująca stan planszy [0,0,0,0,0,0,0,0,0]
 * @param {number} player - ID gracza (1 lub 2)
 * @returns {boolean} True jeśli gracz wygrał
 */
function checkWin(board, player) {
    return GAME_RULES.winning_combinations.some(combo => {
        return combo.every(index => board[index] === player);
    });
}

/**
 * Sprawdza czy gra skończyła się remisem
 * @param {number[]} board - Tablica reprezentująca stan planszy
 * @returns {boolean} True jeśli wszystkie pola są zajęte
 */
function checkDraw(board) {
    return board.every(cell => cell !== 0);
}

/**
 * Zmienia turę na następnego gracza
 * @param {number} currentPlayer - Obecny gracz (1 lub 2)
 * @returns {number} ID następnego gracza
 */
function switchPlayer(currentPlayer) {
    return currentPlayer === 1 ? 2 : 1;
}

/**
 * Pobiera informacje o graczu
 * @param {number} playerId - ID gracza (1 lub 2)
 * @returns {object} Konfiguracja gracza
 */
function getPlayerConfig(playerId) {
    return playerId === 1 ? PLAYERS.knight : PLAYERS.car;
}

/**
 * Oblicza pozycję symbolu na planszy
 * @param {number} cellIndex - Index komórki (0-8)
 * @param {boolean} isX - True dla X, False dla O
 * @returns {object} Pozycja {x, y}
 */
function calculateSymbolPosition(cellIndex) {
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;
    
    return {
        x: BOARD_CONFIG.offsetX + col * BOARD_CONFIG.cellSize + BOARD_CONFIG.cellSize / 2,
        y: BOARD_CONFIG.offsetY + row * BOARD_CONFIG.cellSize + BOARD_CONFIG.cellSize / 2
    };
}
