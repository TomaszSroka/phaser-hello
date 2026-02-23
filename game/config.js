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
    },
    computer_speech: {
        fontSize: 16,
        fontFamily: 'Georgia, serif',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 165 }
    }
};

const DIFFICULTY_CONFIG = {
    default: 'łatwy',
    values: ['łatwy', 'średni', 'trudny'],
    labels: {
        'łatwy': 'Łatwy',
        'średni': 'Średni',
        'trudny': 'Trudny'
    }
};

const PLAYER_IDS = {
    human: 1,
    computer: 2
};

const AI_CONFIG = {
    medium_search_depth: 1,
    medium_random_move_probability: 1 / 3,
    speech_read_delay_ms: 2000,
    hard_mode_mistake_probability: 0.5
};

const GAME_VISUAL_CONFIG = {
    board_cell_fill: 0x444444,
    board_cell_stroke: 0xffffff,
    board_cell_stroke_width: 2,
    symbol_scale: 0.7,
    win_line_color: 0xffff00,
    win_line_width: 8,
    win_line_depth: 150
};

const COMPUTER_SPEECH_CONFIG = {
    y_offset: -120,
    width: 190,
    height: 84,
    background_color: 0x111111,
    background_alpha: 0.92,
    border_color: 0xffffff,
    border_width: 2,
    tail_offset_x: 5,
    tail_offset_y: 48,
    tail_points: { x1: -12, y1: 0, x2: 12, y2: 0, x3: 0, y3: 18 },
    bubble_depth: 120,
    text_depth: 121,
    fallback_text: '...'
};

const COMPUTER_DIALOGS = {
    start_player: [
        'Zaczynaj, mistrzu dwukliku.',
        'Pierwszy ruch Twój. Ja notuję.',
        'No to dawaj, ja mam pasy zapięte.',
        'Scena jest Twoja. Ja tylko trąbię.',
        'Startuj śmiało, kierowco strategii.',
        'Ty pierwszy, ja sekunduję z humorem.',
        'Jedziemy! Ruch należy do Ciebie.',
        'Masz pierwszy ruch, nie spal sprzęgła.',
        'Dawaj krzyżyka, ja już patrzę.',
        'Pierwszeństwo przejazdu dla Ciebie.'
    ],
    start_computer: [
        'Zaczynam ja. Czas na rozgrzewkę.',
        'Silnik odpalony. Pierwszy ruch mój.',
        'Startuję! Nie mrugaj.',
        'Pierwszy zakręt biorę ja.',
        'Mój start. Będzie trochę kurzu.',
        'Uwaga, komputer rusza z pola.',
        'Kółko bierze pierwszy ruch, zapraszam.',
        'Ja zaczynam. Ty szykuj kontrę.',
        'Rozpędzam się. Pierwszy ruch mój.',
        'Ruszam pierwszy, oby bez stłuczki.'
    ],
    computer_turn: [
        'Moja tura. Proszę o ciszę na torze.',
        'Chwila, liczę... i już jadę.',
        'Kółko wjeżdża na planszę.',
        'Teraz moja kolej na manewr.',
        'Obliczenia skończone. Wjeżdżam.',
        'Mój ruch. Trzymaj kierownicę prosto.',
        'Kółko zgłasza gotowość do ruchu.',
        'Włączam kierunkowskaz i gram.',
        'Moja tura, bez paniki.',
        'Ruszam. Oby bez korków.'
    ],
    player_turn: [
        'Twoja kolej. Pokaż klasę.',
        'Teraz Ty. Ja tylko lekko się śmieję.',
        'Ruch gracza! Patrzę podejrzliwie.',
        'Twoja tura, mistrzu taktyki.',
        'Oddaję kierownicę. Twój manewr.',
        'Ruch po Twojej stronie planszy.',
        'Teraz Ty. Ja analizuję minę.',
        'Jesteś na ruchu, nie naciskam.',
        'Twoja kolej, pokaż co umiesz.',
        'Twój ruch. Ja robię popcorn.'
    ],
    computer_blocked: [
        'Stop! Tu był Twój plan, prawda?',
        'Blokada założona. Remont strategii?',
        'Ten skrót był zamknięty przeze mnie.',
        'Tu postawiłem pachołki bezpieczeństwa.',
        'Przejazd zamknięty. Objazd, proszę.',
        'Ten ruch właśnie zneutralizowałem.',
        'Blok! Kontrola trakcji działa.',
        'Zakaz wjazdu na zwycięską linię.',
        'A to Ci zablokowałem elegancko.',
        'Plan A zablokowany, czas na B.'
    ],
    computer_win: [
        'Bip-bip! Wygrana komputera.',
        'Kółko melduje zwycięstwo.',
        'GG! Dziś asfalt był po mojej stronie.',
        'Meta moja. Dzięki za wyścig!',
        'Wygrana! Silnik mruczy z radości.',
        'Dziś komputer bierze puchar.',
        'No i po sprawie. Punkt dla mnie.',
        'Kółko triumfuje. Brawa dla obu stron.',
        'To była dobra partia, ale moja.',
        'Finisz! Wygrałem o pół maski.'
    ],
    player_win: [
        'No dobra, tym razem mnie ograłeś.',
        'Szacunek. To był dobry manewr.',
        'Auć, pięknie to rozegrałeś.',
        'Przyjmuję porażkę jak zawodowiec.',
        'Trafiony, zatopiony. Dobra robota.',
        'Masz to! Punkt dla Ciebie.',
        'Wygrałeś. Ja idę kalibrować algorytm.',
        'Dziś byłeś szybszy na zakrętach.',
        'Elegancka wygrana, gratulacje.',
        'No i pięknie. Rewanż?'
    ],
    draw: [
        'Remis. Nikt nie stracił zderzaka.',
        'Sprawiedliwie. Plansza bez zwycięzcy.',
        'Remis! Rewanż?',
        'Podział punktów. Bardzo sportowo.',
        'Napięcie było, zwycięzcy brak.',
        'Remis jak z podręcznika.',
        'Żadnych ofiar, tylko remis.',
        'Równo! Każdy zabiera punkt.',
        'Bilans idealny: zero porażek, zero zwycięstw.',
        'Remis. To była partia na żyletki.'
    ]
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
    knight_icon: { x: 125, y: 279, scale: 0.24 },
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
