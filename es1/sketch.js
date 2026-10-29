/*
Illusione: Ōuchi Illusion
Fonte: https://michaelbach.de/ot/mot-eyeJitter/index.html
Descrizione: Griglia di rettangoli alternati. All'interno del cerchio centrale, le celle passano da verticali a orizzontali e poi tornano verticali.
*/

// Dimensioni della tela
let canvasWidth = 800;
let canvasHeight = 592;

// Colori
let white = 255;
let black = 0;

// Parametri della griglia di sfondo
let bgCellWidth = 40;
let bgCellHeight = 16;

// Parametri del cerchio centrale
let circleRadius = 120;
let circleCellWidth = 16;
let circleCellHeight = 40;

// Parametri dell'animazione
let frameRateValue = 30;
let verticalPause = 0.8;        // secondi con celle verticali
let toHorizontalDuration = 1.5; // secondi per passare a celle orizzontali
let horizontalPause = 0.7;      // secondi con celle orizzontali
let toVerticalDuration = 3;    // secondi per tornare a celle verticali

// Valori calcolati
let cycleDuration;
let centerX;
let centerY;
let bgCenterParity;
let bgGridOffsetX;
let bgGridOffsetY;

// Livelli grafici
let bgLayer;
let circleLayer;

function setup() {
  pixelDensity(1);
  createCanvas(canvasWidth, canvasHeight);
  frameRate(frameRateValue);
  noStroke();

  centerX = width / 2;
  centerY = height / 2;
  cycleDuration = verticalPause + toHorizontalDuration + horizontalPause + toVerticalDuration;

  // Crea la griglia di sfondo
  bgLayer = createGraphics(canvasWidth, canvasHeight);
  bgLayer.pixelDensity(1);
  bgLayer.noStroke();
  bgLayer.rectMode(CENTER);
  bgLayer.background(white);
  bgLayer.fill(black);

  let bgCols = ceil(canvasWidth / bgCellWidth) + 1;
  let bgRows = ceil(canvasHeight / bgCellHeight) + 1;
  let bgCenterCol = floor((bgCols - 1) / 2);
  let bgCenterRow = floor((bgRows - 1) / 2);
  bgCenterParity = (bgCenterCol + bgCenterRow) % 2;
  bgGridOffsetX = bgCenterCol - (bgCols - 1) / 2;
  bgGridOffsetY = bgCenterRow - (bgRows - 1) / 2;

  for (let row = 0; row < bgRows; row++) {
    for (let col = 0; col < bgCols; col++) {
      if ((row + col) % 2 === 0) {
        let x = canvasWidth / 2 + (col - (bgCols - 1) / 2) * bgCellWidth;
        let y = canvasHeight / 2 + (row - (bgRows - 1) / 2) * bgCellHeight;
        bgLayer.rect(x, y, bgCellWidth, bgCellHeight);
      }
    }
  }

  // Crea il livello per il cerchio centrale
  circleLayer = createGraphics(circleRadius * 2, circleRadius * 2);
  circleLayer.pixelDensity(1);
}

function draw() {
  background(white);
  image(bgLayer, 0, 0);

  let elapsedTime = (frameCount / frameRateValue) % cycleDuration;
  let horizontalStart = verticalPause + toHorizontalDuration;
  let verticalStart = horizontalStart + horizontalPause;
  let effect = 0;

  // effect = 0 -> celle verticali (come lo sfondo)
  // effect = 1 -> celle orizzontali (massimo contrasto)
  if (elapsedTime >= verticalPause && elapsedTime < horizontalStart) {
    effect = smoothTransition(
      elapsedTime - verticalPause,
      toHorizontalDuration,
      0,
      1
    );
  } else if (elapsedTime >= horizontalStart && elapsedTime < verticalStart) {
    effect = 1;
  } else if (elapsedTime >= verticalStart) {
    effect = smoothTransition(
      elapsedTime - verticalStart,
      toVerticalDuration,
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
  // Interpola le dimensioni delle celle tra quelle del cerchio e quelle dello sfondo
  let cellWidth = circleCellWidth + (bgCellWidth - circleCellWidth) * effect;
  let cellHeight = circleCellHeight + (bgCellHeight - circleCellHeight) * effect;

  let halfCols = ceil(circleRadius / cellWidth) + 2;
  let halfRows = ceil(circleRadius / cellHeight) + 2;

  circleLayer.clear();
  circleLayer.noStroke();
  circleLayer.rectMode(CENTER);

  // Limita il disegno alla forma del cerchio
  circleLayer.push();
  circleLayer.beginClip();
  circleLayer.circle(circleRadius, circleRadius, circleRadius * 2);
  circleLayer.endClip();

  circleLayer.fill(white);
  circleLayer.circle(circleRadius, circleRadius, circleRadius * 2);
  circleLayer.fill(black);

  // Disegna la griglia a scacchi all'interno del cerchio
  for (let row = -halfRows; row <= halfRows; row++) {
    for (let col = -halfCols; col <= halfCols; col++) {
      if ((row + col + bgCenterParity) % 2 === 0) {
        let x = circleRadius + (col + bgGridOffsetX) * cellWidth;
        let y = circleRadius + (row + bgGridOffsetY) * cellHeight;
        circleLayer.rect(x, y, cellWidth, cellHeight);
      }
    }
  }

  circleLayer.pop();

  image(circleLayer, centerX - circleRadius, centerY - circleRadius);
}
