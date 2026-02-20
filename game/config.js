// Konfiguracja stylów czcionek dla gry Kółko i Krzyżyk

const FONTS = {
    title: {
        fontSize: 48,
        fontFamily: 'Georgia, serif',
        fill: '#ffffff',
        fontStyle: 'normal',
        letterSpacing: 2
    },
    message: {
        fontSize: 24,
        fontFamily: 'Georgia, serif',
        fill: '#ffffff',
        fontStyle: 'bold'
    },
    button: {
        fontSize: 24,
        fontFamily: 'Georgia, serif',
        fill: '#ffffff',
        fontStyle: 'bold',
        backgroundColor: '#333333',
        stroke: '#000000',
        strokeThickness: 2,
        padding: { x: 20, y: 10 },
        lineSpacing: 2
    },
    symbol: {
        fontSize: 60,
        fontFamily: 'Georgia, serif',
        fontStyle: 'bold'
    },
    player_name: {
        fontSize: 20,
        fontFamily: 'Georgia, serif',
        fill: '#ffffff',
        fontStyle: 'bold'
    }
};

// Stałe gry
const GAME_CONFIG = {
    width: 800,
    height: 500,
    backgroundColor: '#444444'
};

const BOARD_CONFIG = {
    cellSize: 100,
    offsetX: 250,
    offsetY: 64
};

// Konfiguracja zasobów (obrazków)
const ASSETS = {
    images: {
        'x_symbol': {
            key: 'x-sword',
            path: 'assets/images/x_sword.svg'
        },
        'o_symbol': {
            key: 'o-circle',
            path: 'assets/images/o_circle.svg'
        },
        'knight_player': {
            key: 'knight-player',
            path: 'assets/images/knight_player.png'
        },
        'car_player': {
            key: 'car-computer',
            path: 'assets/images/car_computer.webp'
        }
    }
};

// Konfiguracja pozycji elementów UI
const UI_POSITIONS = {
    knight_turn_text: { x: 40, y: 20 },
    car_turn_text: { x: 760, y: 20 },
    knight_icon: { x: 125, y: 294, scale: 0.24 },
    car_icon: { x: 675, y: 294, scale: 0.105 },
    message_text: { x: 400, y: 384 },
    restart_button: { x: 400, y: 451 }
};

// Konfiguracja tekstów gry
const GAME_MESSAGES = {
    knight_turn: 'Teraz kolej Krzyżyka ...',
    car_turn: 'Teraz kolej Kółka ...',
    knight_wins: 'Wygrywa Krzyżyk !!!',
    car_wins: 'Wygrywa Kółko !!!',
    draw: 'Koniec - remis',
    restart_button: 'Restart gry'
};

// Konfiguracja gracze zajęcia
const PLAYERS = {
    knight: {
        id: 1,
        name: 'Krzyżyk',
        symbol_key: 'x-sword',
        icon_key: 'knight-player',
        turn_text_key: 'knight_turn'
    },
    car: {
        id: 2,
        name: 'Kółko',
        symbol_key: 'o-circle',
        icon_key: 'car-computer',
        turn_text_key: 'car_turn'
    }
};

// Reguły gry
const GAME_RULES = {
    double_click_timeout: 300,      // ms - timeout między klikami dla double-click
    required_clicks: 2,             // Ilość kliknięć wymagana do zagrania
    winning_combinations: [
        // Wiersze
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Kolumny
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Przekątne
        [0, 4, 8],
        [2, 4, 6]
    ]
};
