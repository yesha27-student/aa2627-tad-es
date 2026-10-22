/*
  Illusione: Eye Jitter – Perceive Your Eye Moments (Ouchi Illusion)
  (la pagina mostra proprio l'illusione di Ōuchi: il disco che si stacca e
   galleggia sullo sfondo, soprattutto muovendo gli occhi)
  Fonte: https://michaelbach.de/ot/mot-eyeJitter/index.html

  Regola:
    - Lo sfondo è una scacchiera di celle nere orizzontali, larghe 40 e alte
      16, alternate a celle bianche della stessa misura: il colore dipende
      dalla somma di riga e colonna.
    - Al centro c'è un disco di raggio 120 pixel riempito con una scacchiera
      che all'inizio ha le celle ruotate di 90 gradi: verticali, 16 x 40.
    - Che cosa cambia dall'uno all'altro è l'orientamento dei rettangoli:
      in orizzontale fuori dal disco, in verticale dentro. È la differenza
      di direzione delle linee a far percepire il disco come un oggetto
      separato, che galleggia sul fondo.
    - Movimento: la maschera circolare e lo sfondo restano fermi; le celle
      del disco cambiano progressivamente dimensione, finché diventano
      orizzontali come quelle dello sfondo. A quel punto l'effetto scompare,
      poi le celle tornano verticali e l'effetto riappare.

  Parametri critici:
    - BG_CELL_W / BG_CELL_H: forma dei moduli dello sfondo (40 x 16).
    - DISC_CELL_W / DISC_CELL_H: forma dei moduli del disco all'inizio
      (16 x 40), perpendicolari allo sfondo.
    - MORPH_SPEED: velocità del passaggio da una forma all'altra.
    - DISC_RADIUS: grandezza del disco.
    - Effetto più evidente con i moduli del disco perpendicolari allo sfondo;
      nessun effetto quando hanno la stessa forma e lo stesso orientamento.
*/

// ---------- tela ----------
const CANVAS_W = 800;
const CANVAS_H = 600;

// ---------- disco centrale ----------
const CENTER_X = CANVAS_W / 2; // 400
const CENTER_Y = CANVAS_H / 2; // 300
const DISC_RADIUS = 120;

// ---------- scacchiera dello sfondo: ferma, orizzontale ----------
const BG_CELL_W = 40; // larghezza di una cella
const BG_CELL_H = 16; // altezza di una cella

// ---------- scacchiera del disco: parte verticale, girata di 90 gradi ----------
const DISC_CELL_W = 16; // larghezza di una cella
const DISC_CELL_H = 40; // altezza di una cella

// velocità con cui le celle del disco passano da verticali a orizzontali
const MORPH_SPEED = 0.7; // radianti al secondo: più grande = cambiamento più rapido; un ciclo dura circa 9 s

// ---------- colori: solo bianco e nero ----------
const COLOR_WHITE = 255;
const COLOR_BLACK = 0;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  noStroke();
}

function draw() {
  background(COLOR_WHITE);

  drawBackground();

  // 0 = celle verticali come all'inizio, 1 = orizzontali come lo sfondo
  // millis() conta i millisecondi, non i fotogrammi: la velocità resta
  // la stessa anche se un browser disegna più o meno fotogrammi al secondo
  const phase = (1 - cos(millis() / 1000 * MORPH_SPEED)) / 2;
  const morph = smootherStep(phase);
  drawDisc(morph);
}

// curva di easing più morbida del coseno: parte e arriva senza scatti
function smootherStep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Scacchiera dello sfondo: celle nere orizzontali alternate a quelle bianche
function drawBackground() {
  // le celle in più ai bordi evitano che il motivo si interrompa sul bordo
  const cols = ceil(CANVAS_W / BG_CELL_W) + 2;
  const rows = ceil(CANVAS_H / BG_CELL_H) + 2;
  const startX = -BG_CELL_W;
  const startY = -BG_CELL_H;

  // lo sfondo resta fermo: le celle mantengono la forma originale
  const cellW = BG_CELL_W;
  const cellH = BG_CELL_H;

  rectMode(CENTER);
  fill(COLOR_BLACK);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // la somma di riga e colonna alterna le celle come in una scacchiera
      if ((row + col) % 2 === 0) {
        const cellCenterX = startX + col * BG_CELL_W + BG_CELL_W / 2;
        const cellCenterY = startY + row * BG_CELL_H + BG_CELL_H / 2;
        rect(cellCenterX, cellCenterY, cellW, cellH);
      }
    }
  }
}

// Scacchiera del disco: le celle cambiano dimensione fino a diventare
// orizzontali come quelle dello sfondo, poi tornano verticali
function drawDisc(morph) {
  // dimensione delle celle a metà strada fra disco e sfondo
  const cellW = lerp(DISC_CELL_W, BG_CELL_W, morph);
  const cellH = lerp(DISC_CELL_H, BG_CELL_H, morph);

  // quante celle servono per coprire il disco con questa dimensione
  const halfCols = ceil(DISC_RADIUS / cellW) + 1;
  const halfRows = ceil(DISC_RADIUS / cellH) + 1;

  // la maschera circolare resta ferma:
  // il clip del contesto basta, non servono beginClip()/endClip()
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(CENTER_X, CENTER_Y, DISC_RADIUS, 0, TWO_PI);
  drawingContext.clip();

  // il disco viene prima ricoperto di bianco
  fill(COLOR_WHITE);
  circle(CENTER_X, CENTER_Y, DISC_RADIUS * 2);

  fill(COLOR_BLACK);
  rectMode(CENTER);

  for (let row = -halfRows; row <= halfRows; row++) {
    for (let col = -halfCols; col <= halfCols; col++) {
      // la somma di riga e colonna alterna le celle come in una scacchiera
      if ((row + col) % 2 === 0) {
        // lo scarto fa combaciare le celle con lo sfondo quando hanno
        // la stessa dimensione, così il disco sparisce del tutto
        const cellCenterX = CENTER_X + (col + 0.5) * cellW;
        const cellCenterY = CENTER_Y + (row - 0.25) * cellH;
        rect(cellCenterX, cellCenterY, cellW, cellH);
      }
    }
  }

  drawingContext.restore();
}
