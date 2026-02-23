// --- KONFIGURACJA GRY ---
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    backgroundColor: GAME_CONFIG.backgroundColor,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Stan gry
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0 = puste, 1 = X, 2 = O
let currentPlayer = 1; // 1 = X, 2 = O
let gameWon = false;
let gameWinner = null; // 1 = X wygrał, 2 = O wygrał, 'draw' = remis
let cells = [];
let ui = {}; // Referencje do elementów UI
let gameScene = null; // Referencja do sceny
let winLineGraphics = null;
const HUMAN_PLAYER = 1;
const COMPUTER_PLAYER = 2;
let nextStartingPlayer = HUMAN_PLAYER;

const CELL_SIZE = BOARD_CONFIG.cellSize;
const BOARD_OFFSET_X = BOARD_CONFIG.offsetX;
const BOARD_OFFSET_Y = BOARD_CONFIG.offsetY;

// --- PRELOAD ---
function preload() {
    // Dynamicznie ładujemy wszystkie obrazki z konfiguracji
    Object.values(ASSETS.images).forEach(asset => {
        this.load.image(asset.key, asset.path);
    });
}

// --- CREATE ---
function create() {
    gameScene = this;
    initializeTrudnyModeMistakeState();
    applyStartingPlayerForNewGame();

    // Rysujemy planszę 3x3
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = BOARD_OFFSET_X + col * CELL_SIZE + CELL_SIZE / 2;
        const y = BOARD_OFFSET_Y + row * CELL_SIZE + CELL_SIZE / 2;

        // Tworzymy komórkę
        const cell = this.add.rectangle(x, y, CELL_SIZE, CELL_SIZE, 0x444444);
        cell.setStrokeStyle(2, 0xffffff);
        cell.setInteractive();
        cell.cellIndex = i;

        // Licznik kliknięć
        cell.clickCount = 0;

        // Obsługa double-click
        cell.on('pointerdown', (pointer) => {
            if (gameWon) {
                // Jeśli gra się skończyła, ignore clicks
                return;
            }

            if (currentPlayer !== HUMAN_PLAYER) {
                return;
            }

            // Jeśli pole jest już zajęte, nic nie robimy
            if (board[cell.cellIndex] !== 0) {
                return;
            }

            // Reset licznika jeśli minęło za dużo czasu
            if (cell.lastClickTime && pointer.downTime - cell.lastClickTime > GAME_RULES.double_click_timeout) {
                cell.clickCount = 1;
            } else {
                cell.clickCount++;
            }
            cell.lastClickTime = pointer.downTime;

            // Double-click w trakcie gry
            if (cell.clickCount === GAME_RULES.required_clicks) {
                board[cell.cellIndex] = currentPlayer;
                cell.clickCount = 0;

                // Rysujemy X lub O
                drawSymbol.call(this, cell.cellIndex);

                if (!handleMoveResult()) {
                    currentPlayer = switchPlayer(currentPlayer);
                    updateTurnDisplay(ui, currentPlayer);

                    if (currentPlayer === COMPUTER_PLAYER) {
                        makeComputerMove();
                    }
                }
            }
        });

        cells.push(cell);
    }

    // Tworzymy elementy UI
    ui = createUIElements(this);
    
    // Zaktualizuj nazwę gracza z wartości zapisanej w modalui
    if (ui.playerNameText && window.currentPlayerName) {
        ui.playerNameText.setText(window.currentPlayerName);
    }
    
    // Udostępnij ui globalnie
    window.ui = ui;

    // Obsługa kliknięcia przycisku
    ui.restartButton.on('pointerdown', () => {
        resetGame.call(this);
    });

    // Hover effect
    ui.restartButton.on('pointerover', () => {
        ui.restartButton.setBackgroundColor('#555555');
    });

    ui.restartButton.on('pointerout', () => {
        ui.restartButton.setBackgroundColor('#333333');
    });

    // Pokazujemy początkowy tekst turowy
    updateTurnDisplay(ui, currentPlayer);

    if (currentPlayer === COMPUTER_PLAYER) {
        makeComputerMove();
    }
}

// --- UPDATE ---
function update() {
    // Gra działa automatycznie na zdarzenia kliknięć
}

function getCurrentDifficulty() {
    const difficulty = window.currentDifficulty;
    if (difficulty === 'średni' || difficulty === 'trudny') {
        return difficulty;
    }
    return 'łatwy';
}

function handleMoveResult() {
    if (checkWin(board, currentPlayer)) {
        gameWon = true;
        gameWinner = currentPlayer;
        const winningCombo = getWinningCombination(board, currentPlayer);
        drawWinningLine(winningCombo);
        updateGameMessage(ui, gameWinner);
        showRestartButton(ui);

        saveGameResult(gameWinner === HUMAN_PLAYER ? 'gracz' : 'komputer');
        return true;
    }

    if (checkDraw(board)) {
        gameWon = true;
        gameWinner = 'draw';
        updateGameMessage(ui, gameWinner);
        showRestartButton(ui);

        saveGameResult('remis');
        return true;
    }

    return false;
}

function makeComputerMove() {
    gameScene.time.delayedCall(250, () => {
        if (gameWon || currentPlayer !== COMPUTER_PLAYER) {
            return;
        }

        const moveIndex = getComputerMove(board, getCurrentDifficulty());
        if (moveIndex === null || board[moveIndex] !== 0) {
            return;
        }

        board[moveIndex] = COMPUTER_PLAYER;
        drawSymbol.call(gameScene, moveIndex);

        if (!handleMoveResult()) {
            currentPlayer = switchPlayer(currentPlayer);
            updateTurnDisplay(ui, currentPlayer);
        }
    });
}

// Rysowanie symbolu X lub O
function drawSymbol(cellIndex) {
    const pos = calculateSymbolPosition(cellIndex);
    const symbolKey = board[cellIndex] === 1 ? 'x-sword' : 'o-circle';
    const image = gameScene.add.image(pos.x, pos.y, symbolKey);
    image.setScale(0.7);
}

function resetGame() {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    applyStartingPlayerForNewGame();
    gameWon = false;
    gameWinner = null;
    initializeTrudnyModeMistakeState();

    clearWinningLine();

    // Usuwamy stare symbole
    const childObjects = gameScene.children.list.slice();
    childObjects.forEach(child => {
        if ((child instanceof Phaser.GameObjects.Text || child instanceof Phaser.GameObjects.Image) && 
            child !== ui.messageText && child !== ui.restartButton && child !== ui.knightTurnText && child !== ui.carTurnText &&
            child !== ui.knightIcon && child !== ui.carIcon && child !== ui.playerNameText && child !== ui.computerNameText) {
            child.destroy();
        }
    });

    // Resetujemy liczniki kliknięć
    cells.forEach(cell => {
        cell.clickCount = 0;
    });

    // Resetujemy UI
    resetUIForNewGame(ui);
    updateTurnDisplay(ui, currentPlayer);

    if (currentPlayer === COMPUTER_PLAYER) {
        makeComputerMove();
    }
}

function initializeTrudnyModeMistakeState() {
    window.trudnyModeMistakeEligible = Math.random() < 0.5;
    window.trudnyModeMistakeUsed = false;
}

function applyStartingPlayerForNewGame() {
    currentPlayer = nextStartingPlayer;
    window.currentStartingPlayer = currentPlayer === HUMAN_PLAYER ? 'gracz' : 'komputer';
    nextStartingPlayer = switchPlayer(nextStartingPlayer);
}

function drawWinningLine(winningCombo) {
    if (!winningCombo || winningCombo.length !== 3) {
        return;
    }

    clearWinningLine();

    const startPos = calculateSymbolPosition(winningCombo[0]);
    const endPos = calculateSymbolPosition(winningCombo[2]);

    winLineGraphics = gameScene.add.graphics();
    winLineGraphics.lineStyle(8, 0xffff00, 1);
    winLineGraphics.beginPath();
    winLineGraphics.moveTo(startPos.x, startPos.y);
    winLineGraphics.lineTo(endPos.x, endPos.y);
    winLineGraphics.strokePath();
    winLineGraphics.setDepth(150);
}

function clearWinningLine() {
    if (winLineGraphics) {
        winLineGraphics.destroy();
        winLineGraphics = null;
    }
}
