/*
Obiettivo: riprodurre un quadro astratto geometrico semplice con tinte piatte,
introducendo poi elementi casuali e colori che cambiano nel tempo o con il mouse,
così da generare varianti diverse ma coerenti con l'estetica dell'opera.

Vincoli:
- tela di riferimento 800x600; se serve un rapporto diverso, solo uno dei due
  lati può essere inferiore (ad esempio 800x400 o 600x600, non 600x400);
- colori in HSL, HSB o OKLCH, impostati con colorMode();
- colori e altri parametri che variano in variabili dichiarate all'inizio del file;
- variazioni casuali dei colori con random(), limitate da una regola (intervalli
  ridotti, colori ricavati da un tono di base, scelta da una palette): tono,
  saturazione e luminosità del tutto casuali non bastano;
- un'animazione o un'interazione applicata ai colori o all'estensione delle aree
  colorate;
- anteprima "preview.png" con una variante rappresentativa.
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
let canvasWidth = 600, canvasHeight = 600;

// Parametri dell'opera
let SQUARES_PER_SIDE = 8;
let DIAMOND_RADIUS_ORIGINAL = 0.59;
let DIAMOND_RADIUS_MIN = 0.44;
let DIAMOND_RADIUS_MAX = 0.74;

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

let currentPalette = 0;
let tonoIniziale;
let variazioneCasuale = 0;

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

let colors;
let diamondRadius = DIAMOND_RADIUS_ORIGINAL;

// Inizializzazione
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(OKLCH, 1, 0.4, 360);
  noStroke();

  tonoIniziale = random(360);
  variazioneCasuale = map(tonoIniziale, 0, 360, -10, 10);

  colors = createColors();
  noLoop();
}

// Disegno
function draw() {
  background(colors.W);
  drawArtwork(colors);
}

// Creazione palette
function createColors() {
  let variation = PALETTE_VARIATIONS[currentPalette];

  // La palette originale non subisce variazioni casuali
  let randomShift = currentPalette === 0 ? 0 : variazioneCasuale;

  function makeColor(base, shift) {
    return color(
      base.l,
      base.c,
      (base.h + shift + randomShift + 360) % 360
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
function drawArtwork(palette) {
  let size = canvasWidth / SQUARES_PER_SIDE;

  // 64 quadrati
  for (let r = 0; r < SQUARES_PER_SIDE; r++) {
    for (let c = 0; c < SQUARES_PER_SIDE; c++) {
      fill(palette[SQUARE_COLORS[r][c]]);
      rect(c * size, r * size, size, size);
    }
  }

  // 16 rombi
  let radius = size * diamondRadius;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let x = (c * 2 + 1) * size;
      let y = (r * 2 + 1) * size;

      fill(palette[DIAMOND_COLORS[r][c]]);
      quad(
        x, y - radius,
        x + radius, y,
        x, y + radius,
        x - radius, y
      );
    }
  }
}

// Movimento verticale del mouse
function updateDiamondSize() {
  diamondRadius = map(
    constrain(mouseY, 0, height),
    0, height,
    DIAMOND_RADIUS_MIN, DIAMOND_RADIUS_MAX
  );
  redraw();
}

function mouseMoved() {
  updateDiamondSize();
}

function mouseDragged() {
  updateDiamondSize();
}

// Clic: cambia palette
function mousePressed() {
  currentPalette = (currentPalette + 1) % PALETTE_VARIATIONS.length;
  colors = createColors();
  redraw();
}

// Cursore
function mouseOver() {
  cursor(HAND);
}

function mouseOut() {
  cursor(ARROW);
}




