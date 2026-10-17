/*
  Illusione: Ōuchi (Ouchi illusion), Hajime Ōuchi, 1977
  Fonte: https://michaelbach.de/ot/mot-rmi/
  Regola (consigliata):
    - Lo sfondo è una griglia di rettangoli bianchi e neri più larghi che alti,
      disposti in file regolari.
    - Al centro c'è un disco tagliato sullo sfondo, riempito con la stessa
      griglia girata di 90 gradi: le celle del disco sono più alte che larghe.
    - Gli elementi si ripetono in righe e colonne con cicli for; il colore di
      ogni cella dipende dalla somma degli indici (scacchiera), quindi cambia
      da una cella all'altra e torna uguale dopo due celle.
    - Ciò che cambia dall'uno all'altro è l'orientamento: file orizzontali
      fuori, file verticali dentro. È la direzione diversa delle linee a far
      percepire il disco come un oggetto separato che galleggia.
    - Il movimento: il motivo del disco scorre orizzontalmente dentro il
      bordo fisso, mentre lo sfondo resta immobile; lo scostamento riparte da
      zero a intervalli regolari, per un movimento continuo e ciclico.

  Parametri critici:
    - BG_CELL_W / BG_CELL_H: allungamento delle celle dello sfondo.
      Effetto più evidente con rapporto 4 (40 x 10), nessun effetto con
      rapporto 1 (celle quadrate 10 x 10).
    - DISC_CELL_W / DISC_CELL_H: orientamento delle celle del disco.
      Effetto più evidente con le celle girate di 90 gradi (10 x 40),
      nessun effetto con lo stesso orientamento dello sfondo (40 x 10).
    - SPEED: pixel spostati dal motivo del disco per fotogramma.
      Effetto più evidente con 0.1 (lento e discreto), nessun effetto con
      valori alti (da 2 in su il disco scivola troppo in fretta) o con 0
      (nessun movimento).
    - DISC_RADIUS: il disco deve essere abbastanza grande da contenere parecchie
      celle; sotto circa 60 pixel l'effetto sparisce.
*/

// ---------- sizes ----------
const CANVAS_W = 800;
const CANVAS_H = 400;

// ---------- background cells: horizontal rectangles ----------
const BG_CELL_W = 40;
const BG_CELL_H = 10;

// ---------- disc cells: the same sizes rotated by 90 degrees ----------
const DISC_CELL_W = 10;
const DISC_CELL_H = 40;

// the shift returns to zero every two cells: the checkerboard repeats
// every double cell, so the movement loop has no jumps
const SHIFT_PERIOD = DISC_CELL_W * 2;

// ---------- disc ----------
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2;
const DISC_RADIUS = 140;

// ---------- movement ----------
// multiplies frameCount: the higher the value, the faster the disc scrolls
const SPEED = 0.1;

// ---------- style: greys only ----------
const COLOR_WHITE = 255;
const COLOR_BLACK = 0;
const COLOR_GRAY = 128;
const BORDER_WEIGHT = 4;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  // starting frameRate: only needed to keep the slow movement smooth
  frameRate(60);
  blendMode(BLEND);
}

function draw() {
  background(COLOR_GRAY);
  circle(CENTER_X, CENTER_Y, DISC_RADIUS * 2);
  drawBackground();

  // the disc moves, the background does not: the difference between the two
  // produces the effect. The modulo brings the shift back to zero and closes the loop
  const shift = (frameCount * SPEED) % SHIFT_PERIOD;

  drawDisc(shift);
}

// Background grid: rows of alternating white and black rectangles
function drawBackground() {
  noStroke();

  const columns = ceil(CANVAS_W / BG_CELL_W);
  const rows = ceil(CANVAS_H / BG_CELL_H);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // the sum of the indices alternates the two colours like a checkerboard
      fill((row + col) % 2 === 0 ? COLOR_WHITE : COLOR_BLACK);
      rect(col * BG_CELL_W, row * BG_CELL_H, BG_CELL_W, BG_CELL_H);
    }
  }
}

// Disc grid, clipped on the circle and shifted horizontally
function drawDisc(shift) {
  push();

  // the circular mask of drawingContext clips everything outside the disc
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(CENTER_X, CENTER_Y, DISC_RADIUS, 0, TWO_PI);
  drawingContext.clip();

  noStroke();

  // cells start beyond the edge, so the shift never leaves anything uncovered
  const margin = SHIFT_PERIOD;
  const firstCellX = CENTER_X - DISC_RADIUS - margin;
  const firstCellY = CENTER_Y - DISC_RADIUS - DISC_CELL_H;
  const columns = ceil((DISC_RADIUS * 2 + margin * 2) / DISC_CELL_W);
  const rows = ceil((DISC_RADIUS * 2 + DISC_CELL_H * 2) / DISC_CELL_H);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      fill((row + col) % 2 === 0 ? COLOR_WHITE : COLOR_BLACK);
      rect(
        firstCellX + shift + col * DISC_CELL_W,
        firstCellY + row * DISC_CELL_H,
        DISC_CELL_W,
        DISC_CELL_H
      );
    }
  }

  drawingContext.restore();
  pop();

  // border separating the disc from the background
  noFill();
  stroke(COLOR_GRAY);
  strokeWeight(BORDER_WEIGHT);
  circle(CENTER_X, CENTER_Y, DISC_RADIUS * 2);
}
