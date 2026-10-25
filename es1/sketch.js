/*
  Illusione: Ōuchi Illusion celebre effetto ottico statico creato nel 1977 dall'artista giapponese Hajime Ouchi
  Sito: https://michaelbach.de/ot/mot-eyeJitter/index.html

  Regola: griglia di rettangoli alternati; nel cerchio le celle passano da
  verticali a orizzontali e ritornano verticali.

  Parametri critici:
    CELL_W = 40, CELL_H = 16
    CIRCLE_CELL_W = 16, CIRCLE_CELL_H = 40
    pause verticali = 0.8 s, pausa orizzontale = 0.7 s
    trasformazione verso l'orizzontale = 1.5 s, ritorno = 3 s
    effect = 0: celle verticali; effect = 1: illusione assente
*/

const WIDTH = 800;
const HEIGHT = 600;
const WHITE = 255;
const BLACK = 0;
const CELL_W = 40;
const CELL_H = 16;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADIUS = 120;
const CIRCLE_CELL_W = 16;
const CIRCLE_CELL_H = 40;

const FPS = 30;
const VERTICAL_PAUSE = 0.8;
const TO_HORIZONTAL_DURATION = 1.5;
const TO_VERTICAL_DURATION = 3;
const HORIZONTAL_PAUSE = 0.7;
const CYCLE_DURATION =
  VERTICAL_PAUSE +
  TO_HORIZONTAL_DURATION +
  HORIZONTAL_PAUSE +
  TO_VERTICAL_DURATION;

let backgroundLayer;
let circleLayer;

function setup() {
  pixelDensity(1);
  createCanvas(WIDTH, HEIGHT);
  frameRate(FPS);
  noStroke();

  backgroundLayer = createGraphics(WIDTH, HEIGHT);
  backgroundLayer.pixelDensity(1);
  backgroundLayer.noStroke();
  backgroundLayer.rectMode(CENTER);
  backgroundLayer.background(WHITE);
  backgroundLayer.fill(BLACK);

  let columns = ceil(WIDTH / CELL_W) + 2;
  let rows = ceil(HEIGHT / CELL_H) + 2;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if ((row + column) % 2 === 0) {
        let x = -CELL_W / 2 + column * CELL_W;
        let y = -CELL_H / 2 + row * CELL_H;
        backgroundLayer.rect(x, y, CELL_W, CELL_H);
      }
    }
  }

  circleLayer = createGraphics(RADIUS * 2, RADIUS * 2);
  circleLayer.pixelDensity(1);
}

function draw() {
  background(WHITE);
  image(backgroundLayer, 0, 0);

  let elapsedTime = (frameCount / FPS) % CYCLE_DURATION;
  let horizontalStart = VERTICAL_PAUSE + TO_HORIZONTAL_DURATION;
  let verticalStart = horizontalStart + HORIZONTAL_PAUSE;
  let effect = 0;

  if (elapsedTime >= VERTICAL_PAUSE && elapsedTime < horizontalStart) {
    effect = smoothTransition(
      elapsedTime - VERTICAL_PAUSE,
      TO_HORIZONTAL_DURATION,
      0,
      1
    );
  } else if (elapsedTime >= horizontalStart && elapsedTime < verticalStart) {
    effect = 1;
  } else if (elapsedTime >= verticalStart) {
    effect = smoothTransition(
      elapsedTime - verticalStart,
      TO_VERTICAL_DURATION,
      1,
      0
    );
  }
  drawCircle(effect);
}

function smoothTransition(time, duration, from, to) {
  let progress = time / duration;
  let easedProgress = (1 - cos(progress * PI)) / 2;
  return lerp(from, to, easedProgress);
}

function drawCircle(effect) {
  let cellW = CIRCLE_CELL_W + (CELL_W - CIRCLE_CELL_W) * effect;
  let cellH = CIRCLE_CELL_H + (CELL_H - CIRCLE_CELL_H) * effect;

  let halfColumns = ceil(RADIUS / cellW) + 2;
  let halfRows = ceil(RADIUS / cellH) + 2;

  circleLayer.clear();
  circleLayer.noStroke();
  circleLayer.rectMode(CENTER);

  // beginClip/endClip definiscono il cerchio come maschera per le forme successive.
  // push/pop limitano il ritaglio a questo disegno.
  circleLayer.push();
  circleLayer.beginClip();
  circleLayer.circle(RADIUS, RADIUS, RADIUS * 2);
  circleLayer.endClip();

  circleLayer.fill(WHITE);
  circleLayer.circle(RADIUS, RADIUS, RADIUS * 2);
  circleLayer.fill(BLACK);

  for (let row = -halfRows; row <= halfRows; row++) {
    for (let column = -halfColumns; column <= halfColumns; column++) {
      if ((row + column) % 2 === 0) {
        let x = RADIUS + (column + 0.5) * cellW;
        let y = RADIUS + (row - 0.25) * cellH;
        circleLayer.rect(x, y, cellW, cellH);
      }
    }
  }

  circleLayer.pop();

  image(circleLayer, CENTER_X - RADIUS, CENTER_Y - RADIUS);
}
