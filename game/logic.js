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
 * Zwraca zwycięską kombinację pól dla danego gracza
 * @param {number[]} board - Tablica reprezentująca stan planszy
 * @param {number} player - ID gracza (1 lub 2)
 * @returns {number[]|null} Zwycięska kombinacja lub null
 */
function getWinningCombination(board, player) {
    const combo = GAME_RULES.winning_combinations.find(currentCombo => {
        return currentCombo.every(index => board[index] === player);
    });

    return combo || null;
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
    return currentPlayer === PLAYER_IDS.human ? PLAYER_IDS.computer : PLAYER_IDS.human;
}

/**
 * Pobiera informacje o graczu
 * @param {number} playerId - ID gracza (1 lub 2)
 * @returns {object} Konfiguracja gracza
 */
function getPlayerConfig(playerId) {
    return playerId === PLAYER_IDS.human ? PLAYERS.knight : PLAYERS.car;
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

/**
 * Zwraca dostępne ruchy na planszy
 * @param {number[]} boardState - Aktualny stan planszy
 * @returns {number[]} Lista indeksów pustych pól
 */
function getAvailableMoves(boardState) {
    const moves = [];
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === 0) {
            moves.push(i);
        }
    }
    return moves;
}

/**
 * Zwraca losowy ruch z dostępnych pól
 * @param {number[]} boardState - Aktualny stan planszy
 * @returns {number|null} Indeks pola lub null
 */
function getRandomMove(boardState) {
    const availableMoves = getAvailableMoves(boardState);
    if (availableMoves.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

function getRandomMoveFromList(moves) {
    if (!moves || moves.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
}

/**
 * MiniMax - zwraca ocenę pozycji
 * @param {number[]} boardState - Aktualny stan planszy
 * @param {number} depth - Obecna głębokość
 * @param {boolean} isMaximizing - Czy ruch wykonuje komputer
 * @param {number} maxDepth - Maksymalna głębokość (Infinity dla pełnej)
 * @returns {number} Ocena pozycji
 */
function minimax(boardState, depth, isMaximizing, maxDepth) {
    if (checkWin(boardState, PLAYER_IDS.computer)) {
        return 10 - depth;
    }

    if (checkWin(boardState, PLAYER_IDS.human)) {
        return depth - 10;
    }

    if (checkDraw(boardState)) {
        return 0;
    }

    if (depth >= maxDepth) {
        return 0;
    }

    const availableMoves = getAvailableMoves(boardState);

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (const move of availableMoves) {
            boardState[move] = PLAYER_IDS.computer;
            const score = minimax(boardState, depth + 1, false, maxDepth);
            boardState[move] = 0;
            if (score > bestScore) {
                bestScore = score;
            }
        }
        return bestScore;
    }

    let bestScore = Infinity;
    for (const move of availableMoves) {
        boardState[move] = PLAYER_IDS.human;
        const score = minimax(boardState, depth + 1, true, maxDepth);
        boardState[move] = 0;
        if (score < bestScore) {
            bestScore = score;
        }
    }
    return bestScore;
}

function getBestMoves(boardState, maxDepth) {
    const availableMoves = getAvailableMoves(boardState);
    let bestScore = -Infinity;
    let bestMoves = [];

    for (const move of availableMoves) {
        boardState[move] = PLAYER_IDS.computer;
        const score = minimax(boardState, 0, false, maxDepth);
        boardState[move] = 0;

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) {
            bestMoves.push(move);
        }
    }

    return { availableMoves, bestMoves };
}

/**
 * Wyznacza najlepszy ruch dla komputera zależnie od poziomu trudności
 * @param {number[]} boardState - Aktualny stan planszy
 * @param {string} difficulty - Poziom trudności: łatwy | średni | trudny
 * @returns {number|null} Indeks wybranego pola lub null
 */
function getComputerMove(boardState, difficulty) {
    if (difficulty === 'łatwy') {
        return getRandomMove(boardState);
    }

    if (difficulty === 'średni' && Math.random() < AI_CONFIG.medium_random_move_probability) {
        return getRandomMove(boardState);
    }

    const maxDepth = difficulty === 'średni' ? AI_CONFIG.medium_search_depth : Infinity;
    const { availableMoves, bestMoves } = getBestMoves(boardState, maxDepth);

    if (availableMoves.length === 0) {
        return null;
    }

    if (difficulty === 'trudny' && shouldUseTrudnyModeMistake()) {
        const nonBestMoves = availableMoves.filter(move => !bestMoves.includes(move));
        const mistakeMove = getRandomMoveFromList(nonBestMoves);

        if (mistakeMove !== null) {
            window.trudnyModeMistakeUsed = true;
            return mistakeMove;
        }
    }

    return getRandomMoveFromList(bestMoves) ?? availableMoves[0];
}

function shouldUseTrudnyModeMistake() {
    return Boolean(window.trudnyModeMistakeEligible) && !window.trudnyModeMistakeUsed;
}

/**
 * Zwraca ruchy, które dają natychmiastowe zwycięstwo wskazanemu graczowi
 * @param {number[]} boardState - Aktualny stan planszy
 * @param {number} player - ID gracza (1 lub 2)
 * @returns {number[]} Lista indeksów pól wygrywających w 1 ruchu
 */
function getImmediateWinningMoves(boardState, player) {
    const availableMoves = getAvailableMoves(boardState);
    const winningMoves = [];

    for (const move of availableMoves) {
        boardState[move] = player;
        if (checkWin(boardState, player)) {
            winningMoves.push(move);
        }
        boardState[move] = 0;
    }

    return winningMoves;
}
