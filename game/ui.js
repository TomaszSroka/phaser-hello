// Obsługa interfejsu użytkownika (UI)

/**
 * Tworzy i konfiguruje wszystkie elementy UI
 * @param {Phaser.Scene} scene - Scena Phasera
 * @returns {object} Referencje do wszystkich elementów UI
 */
function createUIElements(scene) {
    const ui = {};

    // Tekst informujący o kolei Krzyżyka (lewo)
    const knightPos = UI_POSITIONS.knight_turn_text;
    ui.knightTurnText = scene.add.text(knightPos.x, knightPos.y, GAME_MESSAGES.knight_turn, FONTS.message);
    ui.knightTurnText.setOrigin(0, 0);
    ui.knightTurnText.setAlign('left');

    // Tekst informujący o kolei Kółka (prawo)
    const carTurnPos = UI_POSITIONS.car_turn_text;
    ui.carTurnText = scene.add.text(carTurnPos.x, carTurnPos.y, GAME_MESSAGES.car_turn, FONTS.message);
    ui.carTurnText.setOrigin(1, 0);
    ui.carTurnText.setAlign('right');
    ui.carTurnText.setVisible(false);

    // Ikona gracza (rycerzyk) po lewej stronie
    const knightIconPos = UI_POSITIONS.knight_icon;
    ui.knightIcon = scene.add.image(knightIconPos.x, knightIconPos.y, 'knight-player');
    ui.knightIcon.setScale(knightIconPos.scale);
    ui.knightIcon.setDepth(100);
    
    // Nazwa gracza poniżej ikony rycerza
    ui.playerNameText = scene.add.text(knightIconPos.x, knightIconPos.y + 85, window.currentPlayerName || 'Gracz', FONTS.player_name);
    ui.playerNameText.setOrigin(0.5, 1);
    ui.playerNameText.setDepth(100);

    // Ikona computera (samochodzik) po prawej stronie
    const carIconPos = UI_POSITIONS.car_icon;
    ui.carIcon = scene.add.image(carIconPos.x, carIconPos.y, 'car-computer');
    ui.carIcon.setScale(carIconPos.scale);
    ui.carIcon.setDepth(100);
    
    // Napis "Komputer" poniżej ikony samochodu
    ui.computerNameText = scene.add.text(carIconPos.x, carIconPos.y + 70, getComputerLabelWithDifficulty(), FONTS.player_name);
    ui.computerNameText.setOrigin(0.5, 1);
    ui.computerNameText.setDepth(100);

    // Dymek komputera nad ikoną samochodzika
    const speechBubbleY = carIconPos.y + COMPUTER_SPEECH_CONFIG.y_offset;
    ui.computerSpeechBg = scene.add.rectangle(
        carIconPos.x,
        speechBubbleY,
        COMPUTER_SPEECH_CONFIG.width,
        COMPUTER_SPEECH_CONFIG.height,
        COMPUTER_SPEECH_CONFIG.background_color,
        COMPUTER_SPEECH_CONFIG.background_alpha
    );
    ui.computerSpeechBg.setStrokeStyle(COMPUTER_SPEECH_CONFIG.border_width, COMPUTER_SPEECH_CONFIG.border_color);
    ui.computerSpeechBg.setDepth(COMPUTER_SPEECH_CONFIG.bubble_depth);

    ui.computerSpeechTail = scene.add.triangle(
        carIconPos.x + COMPUTER_SPEECH_CONFIG.tail_offset_x,
        speechBubbleY + COMPUTER_SPEECH_CONFIG.tail_offset_y,
        COMPUTER_SPEECH_CONFIG.tail_points.x1,
        COMPUTER_SPEECH_CONFIG.tail_points.y1,
        COMPUTER_SPEECH_CONFIG.tail_points.x2,
        COMPUTER_SPEECH_CONFIG.tail_points.y2,
        COMPUTER_SPEECH_CONFIG.tail_points.x3,
        COMPUTER_SPEECH_CONFIG.tail_points.y3,
        COMPUTER_SPEECH_CONFIG.background_color,
        COMPUTER_SPEECH_CONFIG.background_alpha
    );
    ui.computerSpeechTail.setStrokeStyle(COMPUTER_SPEECH_CONFIG.border_width, COMPUTER_SPEECH_CONFIG.border_color);
    ui.computerSpeechTail.setDepth(COMPUTER_SPEECH_CONFIG.bubble_depth);

    ui.computerSpeechText = scene.add.text(carIconPos.x, speechBubbleY, '', FONTS.computer_speech);
    ui.computerSpeechText.setOrigin(0.5, 0.5);
    ui.computerSpeechText.setDepth(COMPUTER_SPEECH_CONFIG.text_depth);

    // Tekst wiadomości poniżej planszy
    const messagePos = UI_POSITIONS.message_text;
    ui.messageText = scene.add.text(messagePos.x, messagePos.y, '', FONTS.message);
    ui.messageText.setOrigin(0.5, 0);

    // Przycisk restart
    const restartPos = UI_POSITIONS.restart_button;
    ui.restartButton = scene.add.text(restartPos.x, restartPos.y, GAME_MESSAGES.restart_button, FONTS.button);
    ui.restartButton.setOrigin(0.5, 0.5);
    ui.restartButton.setInteractive();
    ui.restartButton.setVisible(false);

    return ui;
}

function getRandomDialogLine(lines) {
    if (!lines || lines.length === 0) {
        return '';
    }

    const randomIndex = Math.floor(Math.random() * lines.length);
    return lines[randomIndex];
}

function setComputerSpeech(ui, text) {
    if (!ui || !ui.computerSpeechText) {
        return;
    }

    ui.computerSpeechText.setText(text || COMPUTER_SPEECH_CONFIG.fallback_text);
}

function speakComputer(ui, contextKey) {
    const lines = COMPUTER_DIALOGS[contextKey] || [];
    setComputerSpeech(ui, getRandomDialogLine(lines));
}

function getDifficultyLabel() {
    const difficulty = window.currentDifficulty;
    return DIFFICULTY_CONFIG.labels[difficulty] || DIFFICULTY_CONFIG.labels[DIFFICULTY_CONFIG.default];
}

function getComputerLabelWithDifficulty() {
    return `Komputer (${getDifficultyLabel()})`;
}

function updateComputerDifficultyLabel(ui) {
    if (!ui || !ui.computerNameText) {
        return;
    }

    ui.computerNameText.setText(getComputerLabelWithDifficulty());
}

/**
 * Aktualizuje widoczność tekstów turowych
 * @param {object} ui - Referencje do elementów UI
 * @param {number} currentPlayer - ID aktualnego gracza
 */
function updateTurnDisplay(ui, currentPlayer) {
    if (currentPlayer === 1) {
        ui.knightTurnText.setVisible(true);
        ui.carTurnText.setVisible(false);
    } else {
        ui.knightTurnText.setVisible(false);
        ui.carTurnText.setVisible(true);
    }
}

/**
 * Wyświetla komunikat o wyniku gry
 * @param {object} ui - Referencje do elementów UI
 * @param {number|string} gameWinner - ID zwycięzcy (1, 2) lub 'draw'
 */
function updateGameMessage(ui, gameWinner) {
    ui.knightTurnText.setVisible(false);
    ui.carTurnText.setVisible(false);
    
    if (gameWinner === 1) {
        ui.messageText.setText(GAME_MESSAGES.knight_wins);
    } else if (gameWinner === 2) {
        ui.messageText.setText(GAME_MESSAGES.car_wins);
    } else if (gameWinner === 'draw') {
        ui.messageText.setText(GAME_MESSAGES.draw);
    }
}

/**
 * Pokazuje przycisk restartu
 * @param {object} ui - Referencje do elementów UI
 */
function showRestartButton(ui) {
    ui.restartButton.setVisible(true);
}

/**
 * Czyści wiadomość i resetuje widoczność tekstów
 * @param {object} ui - Referencje do elementów UI
 */
function resetUIForNewGame(ui) {
    ui.messageText.setText('');
    ui.knightTurnText.setVisible(true);
    ui.carTurnText.setVisible(false);
    ui.restartButton.setVisible(false);
}
