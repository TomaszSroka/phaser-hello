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
    }
};

// Stałe gry
const GAME_CONFIG = {
    width: 400,
    height: 500,
    backgroundColor: '#444444'
};

const BOARD_CONFIG = {
    cellSize: 100,
    offsetX: 50,
    offsetY: 64
};
