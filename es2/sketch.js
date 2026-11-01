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
I colori sono definiti in HSL. Il movimento del mouse modifica
gradualmente il tono della palette e la dimensione dei rombi.
Con il clic si genera una variante cromatica: il tono cambia
secondo valori casuali prestabiliti, mentre saturazione e
luminosità subiscono piccole variazioni casuali.
I rapporti tra le tinte originali vengono mantenuti.
*/

// Dimensioni della tela
let canvasWidth = 600;
let canvasHeight = 600;

// --- parametri dell'opera ---
let SQUARES_PER_SIDE = 8;
let DIAMOND_RADIUS_ORIGINAL = 0.59;
let DIAMOND_RADIUS_MIN = 0.44;
let DIAMOND_RADIUS_MAX = 0.74;

// --- colori HSL originali ---
let RED = { h: 1, s: 60, l: 54 };
let CORAL = { h: 357, s: 82, l: 67 };
let PURPLE = { h: 254, s: 23, l: 49 };
let WHITE = { h: 20, s: 5, l: 85 };
let BLACK = { h: 20, s: 6, l: 22 };

// --- mappe e legenda dei colori ---
// R = Rosso, S = Corallo, P = Viola
let SQUARE_COLORS = [
  'RPSRRSPR', 'PPSPPSPP', 'SRSSRRRS', 'SRPPPPSS',
  'PRSSRSRP', 'PRPSPPPS', 'RSSRSSRR', 'SPRPSRPS'
];

// D = Nero, W = Bianco
let DIAMOND_COLORS = ['DWWD', 'WDWD', 'DWDW', 'WDWD'];

let initialHue, colors;
let diamondRadius = DIAMOND_RADIUS_ORIGINAL;

// --- inizializzazione ---
function setup() {
  createCanvas(600, 600);
  colorMode(HSL, 360, 100, 100);
  noStroke();
  initialHue = RED.h;
  colors = createColors();
  noLoop();
}

// --- disegno ---
function draw() {
  background(colors.W);
  drawArtwork(colors);
}

// --- creazione della palette ---
function createColors() {
  function makeColor(base) {
    return color(
      (base.h + initialHue - RED.h + 360) % 360,
      base.s, base.l
    );
  }

  return {
    R: makeColor(RED),
    S: makeColor(CORAL),
    P: makeColor(PURPLE),
    W: makeColor(WHITE),
    D: makeColor(BLACK)
  };
}

// --- disegno dei quadrati e dei rombi ---
function drawArtwork(palette) {
  let size = 600 / SQUARES_PER_SIDE;

  // Disegna i 64 quadrati
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      fill(palette[SQUARE_COLORS[r][c]]);
      rect(c * 600 / 8, r * 600 / 8, 600 / 8, 600 / 8);
    }
  }

  // Disegna i 16 rombi
  let radius = size * diamondRadius;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let x = (c * 2 + 1) * size;
      let y = (r * 2 + 1) * size;

      fill(palette[DIAMOND_COLORS[r][c]]);
      quad(x, y - radius, x + radius, y,
        x, y + radius, x - radius, y);
    }
  }
}

// --- il mouse modifica tonalità e dimensione ---
function mouseMoved() {
  initialHue = (RED.h + map(mouseX, 0, 600, -30, 30) + 360) % 360;
  diamondRadius = map(mouseX, 0, 600,
    DIAMOND_RADIUS_MIN, DIAMOND_RADIUS_MAX, true);

  colors = createColors();
  redraw();
}

// --- clic: genera una nuova palette casuale ---
function mousePressed() {
  RED.h = random(360);
  CORAL.h = (RED.h + 25) % 360;
  PURPLE.h = (RED.h + 55) % 360;

  initialHue = RED.h;
  colors = createColors();
  redraw();
}

// --- trascinamento: modifica tonalità e dimensione dei rombi ---
function mouseDragged() {
  initialHue = (RED.h + map(mouseX, 0, width, -30, 30) + 360) % 360;
  diamondRadius = map(mouseX, 0, width,
    DIAMOND_RADIUS_MIN, DIAMOND_RADIUS_MAX, true);

  colors = createColors();
  redraw();
}