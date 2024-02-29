/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////

let displaySize = 10; // how many pixels are visible in the game
let pixelSize = 100; // how big each 'pixel' looks on screen

let player; // Adding a player to the game
let mines = []; // and one target for players to catch.

let display; // Aggregates our final visual output before showing it on the screen

let controller; // This is where the state machine and game logic lives

let collisionAnimation; // Where we store and manage the collision animation

// let score; // Where we keep track of score and winner

function setup() {
  createCanvas(displaySize * pixelSize, pixelSize); // dynamically sets canvas size
  // frameRate(120);
  display = new Display(displaySize, pixelSize); //Initializing the display

  numberSet = new Set();
  for (let i = 0; i < displaySize; i++) {
    numberSet.add(i);
  }

  let randomIndex = Math.floor(Math.random() * numberSet.size);
  let randomNumber = [...numberSet][randomIndex];
  numberSet.delete(randomNumber);

  player = new Player(color(241, 128, 126), randomNumber, displaySize); // Initializing players

  max = displaySize / 3;
  num_mines = Math.floor(Math.random() * max);
  if (num_mines == 0) {
    num_mines++;
  }

  for (let i = 0; i < num_mines; i++) {
    randomIndex = Math.floor(Math.random() * numberSet.size);
    randomNumber = [...numberSet][randomIndex];
    numberSet.delete(randomNumber);
    let mine = new Player(color(255, 255, 0), randomNumber, displaySize); // Initializing mine using the Player class
    mines.push(mine);
  }

  collisionAnimation = new Animation(); // Initializing animation

  controller = new Controller(); // Initializing controller

  // score = 0; // score stores the number of mines avoided
}

function draw() {
  // start with a blank screen
  background(0, 0, 0);

  // Runs state machine at determined framerate
  controller.update();

  // After we've updated our states, we show the current one
  display.show();
}
