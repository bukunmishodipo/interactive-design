/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////

let displaySize = 10; // how many pixels are visible in the game
let pixelSize = 100; // how big each 'pixel' looks on screen

let jumpSound;
let collisionSound;

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

  levels = [
    new Level(color(51, 51, 51), 1, 200), // Level 1
    new Level(color(51, 51, 51), 2, 150), // Level 2
    new Level(color(51, 51, 51), 3, 150), // Level 3
    new Level(color(51, 51, 51), 4, 100), // Level 3
  ];

  player = new Player(color(115, 29, 216, 100), 0, displaySize); // Initializing player

  numberSet = new Set();
  for (let i = 1; i < displaySize - 1; i++) {
    numberSet.add(i);
  }

  let randomIndex = Math.floor(Math.random() * numberSet.size);
  let randomPos = [...numberSet][randomIndex];
  numberSet.delete(randomPos);
  numberSet.delete(randomPos - 1);
  numberSet.delete(randomPos + 1);

  num_mines = levels[0].numberOfMines;

  for (let i = 0; i < num_mines; i++) {
    randomIndex = Math.floor(Math.random() * numberSet.size);
    randomPos = [...numberSet][randomIndex];
    numberSet.delete(randomPos);
    let mine = new Player(levels[0].mineColor, randomPos, displaySize); // Initializing mine using the Player class
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

function preload() {
  jumpSound = loadSound("./sounds/jumpSound.wav");
  collisionSound = loadSound("./sounds/collisionSound2.mov");
}
