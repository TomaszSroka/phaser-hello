// --- KONFIGURACJA GRY ---
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;

// --- PRELOAD ---
// ładowanie grafik i dźwięków
function preload() {}

// --- CREATE ---
// tworzenie obiektów w świecie
function create() {

    // Tworzymy kwadrat (grafika generowana w locie)
    player = this.add.rectangle(400, 300, 80, 80, 0x00ffcc);

    // Pozwala kliknąć na obiekt kwasratu
    player.setInteractive();

    // Obsługa kliknięcia – zmiana koloru
    player.on('pointerdown', () => {
        const randomColor = Phaser.Display.Color.RandomRGB().color;
        player.fillColor = randomColor;
    });

    // Obsługa klawiatury
    cursors = this.input.keyboard.createCursorKeys();
}

// --- UPDATE ---
// Wywoływane ~60 razy na sekundę
function update() {

    const speed = 4;

    if (cursors.left.isDown) {
        player.x -= speed;
    }
    if (cursors.right.isDown) {
        player.x += speed;
    }
    if (cursors.up.isDown) {
        player.y -= speed;
    }
    if (cursors.down.isDown) {
        player.y += speed;
    }
}
