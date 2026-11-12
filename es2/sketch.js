/*
Quadro: Bruno Munari, "Curve di Peano", 1993
Fonte: https://findartinfo.com/artwork/curve-di-peano/D38FFA05E4ED4642B89D0DE1BBF61173

Regola cromatica: tre tinte principali (rosso, corallo e viola)
sono distribuite su una griglia 8x8, secondo una disposizione
prestabilita. I 16 rombi, collocati al centro dei blocchi 2x2,
utilizzano il bianco e il nero.
I colori sono definiti in OKLCH, con la luminosità e la crominanza
delle tinte originali.
Il movimento orizzontale del mouse modifica il tono della palette,
quello verticale la dimensione dei rombi.
Con il clic si genera una variante cromatica: il tono di base
diventa casuale e le altre tinte si ricavano da esso.
Lo spostamento del mouse conserva i rapporti fra le tinte.
*/


// Dimensioni tela
let canvasWidth = 600;
let canvasHeight = 600;

// Parametri dell'opera
let SQUARES_PER_SIDE = 8;
let DIAMOND_RADIUS_MIN = 0.01;
let DIAMOND_RADIUS_MAX = 1;

// Legenda dei colori:
// R = rosso
// S = corallo
// P = viola
// W = bianco
// D = nero

// Mappa quadrati (8x8)
let SQUARE_COLORS = [
  'RPSRRSPR', 'PPSPPSPP', 'SRSSRRRS', 'SRPPPPSS',
  'PRSSRSRP', 'PRPSPPPS', 'RSSRSSRR', 'SPRPSRPS'
];

// Mappa rombi (4x4)
let DIAMOND_COLORS = [
  'DWWD', 'WDWD', 'DWDW', 'WDWD'
];

// Colori OKLCH originali
let RED = { h: 25.15, c: 0.175, l: 0.587 };
let CORAL = { h: 19.77, c: 0.170, l: 0.683 };
let PURPLE = { h: 293.81, c: 0.090, l: 0.527 };
let WHITE = { h: 48.71, c: 0.003, l: 0.884 };
let BLACK = { h: 48.49, c: 0.007, l: 0.341 };

// Variazioni cromatiche
let PALETTE_VARIATIONS = [
  { red: 0, coral: 0, purple: 0 },
  { red: 65, coral: 45, purple: 35 },
  { red: 105, coral: 120, purple: 85 },
  { red: 205, coral: 190, purple: 220 },
  { red: 265, coral: 240, purple: 280 },
  { red: 45, coral: 145, purple: 110 },
  { red: 195, coral: 170, purple: 300 }
];

let colors;
let currentPalette = 0;
let variazioneCasuale = 0;
let diamondRadius = 1;
let initialHue;

// Inizializzazione
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(OKLCH, 1, 0.4, 360);
  noStroke();

  variazioneCasuale = random(-10, 10);
  initialHue = RED.h;
  colors = createColors();
}

// Disegno
function draw() {

  // Variazione cromatica in base alla posizione orizzontale
  initialHue = (
    RED.h + map(constrain(mouseX, 0, width), 0, width, -12, 12) + 360
  ) % 360;

  colors = createColors();

  // Dimensione dei rombi in base alla posizione verticale del mouse
  let mousePosition = constrain(mouseY, height * 0.20, height * 0.80);

  let movement = map(
    mousePosition,
    height * 0.20,
    height * 0.80,
    0,
    1
  );

  // Interpolazione morbida
  movement = movement * movement * (3 - 2 * movement);

  // I rombi si restringono e si ingrandiscono con il mouse
  diamondRadius = lerp(
    DIAMOND_RADIUS_MAX,
    DIAMOND_RADIUS_MIN,
    movement
  );

  background(colors.W);
  drawArtwork();
}

// Creazione palette
function createColors() {
  let variation = PALETTE_VARIATIONS[currentPalette];

  function makeColor(base, shift) {
    return color(
      base.l,
      base.c,
      (base.h + shift + initialHue - RED.h +
        variazioneCasuale + 360) % 360
    );
  }

  return {
    R: makeColor(RED, variation.red),
    S: makeColor(CORAL, variation.coral),
    P: makeColor(PURPLE, variation.purple),
    W: color(WHITE.l, WHITE.c, WHITE.h),
    D: color(BLACK.l, BLACK.c, BLACK.h)
  };
}

// Disegno quadrati e rombi
function drawArtwork() {
  let size = canvasWidth / SQUARES_PER_SIDE;

  // Disegno dei quadrati
  for (let r = 0; r < SQUARES_PER_SIDE; r++) {
    for (let c = 0; c < SQUARES_PER_SIDE; c++) {
      fill(colors[SQUARE_COLORS[r][c]]);
      rect(c * size, r * size, size, size);
    }
  }

  // Disegno dei rombi
  let radius = size * diamondRadius;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let x = (c * 2 + 1) * size;
      let y = (r * 2 + 1) * size;

      fill(colors[DIAMOND_COLORS[r][c]]);

      quad(
        x, y - radius,
        x + radius, y,
        x, y + radius,
        x - radius, y
      );
    }
  }
}

// Cambio palette con il clic
function mousePressed() {
  currentPalette = (currentPalette + 1) % PALETTE_VARIATIONS.length;
  colors = createColors();
}
