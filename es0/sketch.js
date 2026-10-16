/*
  Obiettivo:
  - E0. Il primo sketch con p5.js
    Realizzare un primo sketch seguendo una guida passo passo, e modificarlo poi
    con l'assistenza di un agente di programmazione.

  Vincoli (ricavati dalle specifiche):
  - p5.js versione 2 (cdn.jsdelivr.net/npm/p5@2.3.3/lib/p5.min.js)
  - Scrivere codice a mano in sketch.js, seguendo la guida passo passo
  - Usare Live Server per verificare il risultato a ogni passaggio
  - Modifiche descritte una per volta all'agente, codice verificato prima di applicarlo
  - Le modifiche possono riguardare forme, colori, movimento o reazione al mouse
  - Nessun risultato predeterminato richiesto: esercitazione per provare interazione con l'agente
*/
// 
let tono; // variabile globale per il colore

function setup() {
  createCanvas(800, 600);
  colorMode (HSL, 360, 100, 100, 1);
  tono = random (360);
  background(20); 
}

function draw() {
  if (mouseIsPressed) { 
    stroke (100); 
    fill (tono, 200, 50); 
    let x = mouseX; 
    let y = mouseY; 
    let dx = 2;
    let dy = 2;
    for (let i = 0; i < 50; i = i + 1) { // ripeti 50 volte
        x = x + dx
        y = y + dy
    square (x, y, (50 - i) / 2); 
    if (random(1) < 0.1) {
        dx = random(-10, 10);
        dy = random(-10, 10);
      }
    }
    if (random(1) < 0.02) {
      tono = random (300);
    }
  }
}




