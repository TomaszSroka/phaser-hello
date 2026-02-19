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
let messageText;
let restartButton;
let gameScene = null; // Referencja do sceny

const CELL_SIZE = BOARD_CONFIG.cellSize;
const BOARD_OFFSET_X = BOARD_CONFIG.offsetX;
const BOARD_OFFSET_Y = BOARD_CONFIG.offsetY;

// --- PRELOAD ---
function preload() {}

// --- CREATE ---
function create() {
    gameScene = this;

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

            // Jeśli pole jest już zajęte, nic nie robimy
            if (board[cell.cellIndex] !== 0) {
                return;
            }

            // Reset licznika jeśli minęło za dużo czasu
            if (cell.lastClickTime && pointer.downTime - cell.lastClickTime > 300) {
                cell.clickCount = 1;
            } else {
                cell.clickCount++;
            }
            cell.lastClickTime = pointer.downTime;

            // Double-click w trakcie gry
            if (cell.clickCount === 2) {
                board[cell.cellIndex] = currentPlayer;
                cell.clickCount = 0;

                // Rysujemy X lub O
                drawSymbol.call(this, cell.cellIndex);

                // Sprawdzamy zwycięstwo
                if (checkWin()) {
                    gameWon = true;
                    gameWinner = currentPlayer;
                    updateGameMessage();
                    showRestartButton();
                    return;
                }

                // Sprawdzamy remis
                if (checkDraw()) {
                    gameWon = true;
                    gameWinner = 'draw';
                    updateGameMessage();
                    showRestartButton();
                    return;
                }

                // Zmieniamy gracza
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }
        });

        cells.push(cell);
    }

    // Tekst wiadomości poniżej planszy
    messageText = this.add.text(200, 380, '', FONTS.message);
    messageText.setOrigin(0.5, 0);

    // Przycisk restart
    restartButton = this.add.text(200, 460, 'Restart gry', FONTS.button);
    restartButton.setOrigin(0.5, 0.5);
    restartButton.setInteractive();
    restartButton.setVisible(false);

    // Obsługa kliknięcia przycisku
    restartButton.on('pointerdown', () => {
        resetGame.call(this);
    });

    // Hover effect
    restartButton.on('pointerover', () => {
        restartButton.setBackgroundColor('#555555');
    });

    restartButton.on('pointerout', () => {
        restartButton.setBackgroundColor('#333333');
    });
}

// --- UPDATE ---
function update() {
    // Gra działa automatycznie na zdarzenia kliknięć
}

// Rysowanie symbolu X lub O
function drawSymbol(cellIndex) {
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;
    const x = BOARD_OFFSET_X + col * CELL_SIZE + CELL_SIZE / 2;
    const y = BOARD_OFFSET_Y + row * CELL_SIZE + CELL_SIZE / 2;

    const symbol = board[cellIndex] === 1 ? 'X' : 'O';
    const color = board[cellIndex] === 1 ? '#ff6666' : '#66ff66';

    const symbolConfig = {
        ...FONTS.symbol,
        fill: color
    };

    const text = this.add.text(x, y, symbol, symbolConfig);
    text.setOrigin(0.5, 0.5);
}

// Sprawdzanie zwycięstwa
function checkWin() {
    // Kombinacje wygrywające: wiersze, kolumny, przekątne
    const winningCombos = [
        [0, 1, 2], // wiersz 1
        [3, 4, 5], // wiersz 2
        [6, 7, 8], // wiersz 3
        [0, 3, 6], // kolumna 1
        [1, 4, 7], // kolumna 2
        [2, 5, 8], // kolumna 3
        [0, 4, 8], // przekątna
        [2, 4, 6]  // przekątna
    ];

    for (let combo of winningCombos) {
        if (board[combo[0]] !== 0 &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[1]] === board[combo[2]]) {
            return true;
        }
    }
    return false;
}

// Sprawdzanie remisu
function checkDraw() {
    // Remis jeśli wszystkie pola są zajęte (brak 0 w tablicy)
    return board.every(cell => cell !== 0);
}

// Aktualizacja komunikatu o wyniku gry
function updateGameMessage() {
    if (gameWinner === 1) {
        messageText.setText('Koniec - wygrywa krzyżyk');
    } else if (gameWinner === 2) {
        messageText.setText('Koniec - wygrywa kółko');
    } else if (gameWinner === 'draw') {
        messageText.setText('Koniec - remis');
    }
}

// Pokazywanie przycisku restart
function showRestartButton() {
    restartButton.setVisible(true);
}

// Reset gry
function resetGame() {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    currentPlayer = 1;
    gameWon = false;
    gameWinner = null;
    messageText.setText('');
    restartButton.setVisible(false);

    // Usuwamy stare symbole - kopiujemy listę aby uniknąć problemów z modyfikacją podczas iteracji
    const textObjects = gameScene.children.list.slice();
    textObjects.forEach(child => {
        if (child instanceof Phaser.GameObjects.Text && child !== messageText && child !== restartButton) {
            child.destroy();
        }
    });

    // Resetujemy liczniki kliknięć
    cells.forEach(cell => {
        cell.clickCount = 0;
    });
}
