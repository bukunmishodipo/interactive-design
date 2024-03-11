// This is where your state machines and game logic lives

class Controller {
  // This is the state we start with.
  constructor() {
    this.gameState = "SHOW_MINES";
    this.frameCounter = 0; // Initialize the frame counter
    this.jumpDirection = null;
    this.currentLevelIndex = 0;
    this.addMine = false;
    this.currentLevel = levels[this.currentLevelIndex];
  }

  setUpMines() {}

  // This is called from draw() in sketch.js with every frame
  update() {
    switch (this.gameState) {
      // This is the main game state, where the playing actually happens
      case "SHOW_MINES":
        // clear screen at frame rate so we always start fresh
        display.clear();

        // now add the mines
        for (let i = 0; i < mines.length; i++) {
          display.setPixel(mines[i].position, mines[i].playerColor);
        }

        if (this.frameCounter >= this.currentLevel.framesForDelay) {
          this.gameState = "PLAY";
          this.frameCounter = 0; // Reset the frame counter
        } else {
          this.frameCounter++;
        }
        break;

      case "PLAY":
        // clear screen at frame rate so we always start fresh
        display.clear();

        // show all players in the right place, by adding them to display buffer
        display.setPixel(player.position, player.playerColor);

        // check if player has hit a mine
        for (let i = 0; i < mines.length; i++) {
          if (player.position == mines[i].position && !player.midJump) {
            this.gameState = "COLLISION"; // go to COLLISION state
          }
        }

        if (player.position == displaySize - 1) {
          player.endReached = true;
        }

        if (player.endReached && player.position == 0) {
          player.score++;
          if (this.currentLevelIndex < levels.length - 1) {
            this.gameState = "NEW_LEVEL";
          } else {
            this.gameState = "RESET";
          }
        }

        break;

      case "NEW_LEVEL":
        this.currentLevelIndex += 1;
        player.endReached = false;
        this.currentLevel = levels[this.currentLevelIndex];
        this.addMine = true;
        this.gameState = "RESET";
        break;

      // This state is used to play an animation, after a target has been caught by a player
      case "COLLISION":
        // clear screen at frame rate so we always start fresh
        display.clear();
        collisionSound.play();

        // play explosion animation one frame at a time.
        // first figure out what frame to show
        let frameToShow = collisionAnimation.currentFrame(); // this grabs number of current frame and increments it

        // then grab every pixel of frame and put it into the display buffer
        for (let i = 0; i < collisionAnimation.pixels; i++) {
          display.setPixel(i, collisionAnimation.animation[frameToShow][i]);
        }

        //check if animation is done and we should move on to another state
        if (frameToShow == collisionAnimation.animation.length - 1) {
          // We've reached a mine
          this.gameState = "RESET";
        }

        break;

      // This state is used to play an animation, after a target has been caught by a player
      case "JUMP":
        // clear screen at frame rate so we always start fresh
        display.clear();
        if (player.midJump) {
          // When the jump starts
          jumpSound.play(); // Play jump sound
        }
        player.midJump = true;
        // play explosion animation one frame at a time.
        // first figure out what frame to show
        let frame = player.currentFrame(); // this grabs number of current frame and increments it

        // then grab every pixel of frame and put it into the display buffer

        if (this.jumpDirection == -1) {
          display.setPixel(player.position + 1, color(100, 0, 164, 50));
        }

        if (this.jumpDirection == 1) {
          display.setPixel(player.position - 1, color(100, 0, 164, 50));
        }

        display.setPixel(player.position, color(100, 0, 164, 50));

        //check if animation is done and we should move on to another state
        if (frame == 2) {
          player.currentFrameCount = -1;
          player.midJump = false;
          this.gameState = "PLAY"; // play game
        }

        break;

      case "RESET":
        display.clear();
        player.endReached = false;
        this.frameCounter = 0;
        player.position = 0;

        if (!this.addMine) {
          this.currentLevelIndex = 0;
          this.currentLevel = levels[this.currentLevelIndex];
        } else {
          this.addMine = false;
        }

        let numberSet = new Set();
        for (let i = 1; i < displaySize - 1; i++) {
          numberSet.add(i);
        }

        let randomIndex = Math.floor(Math.random() * numberSet.size);
        let randomPos = [...numberSet][randomIndex];

        mines = [];
        for (let i = 0; i < this.currentLevel.numberOfMines; i++) {
          randomIndex = Math.floor(Math.random() * numberSet.size);
          randomPos = [...numberSet][randomIndex];
          numberSet.delete(randomPos);
          numberSet.delete(randomPos - 1);
          numberSet.delete(randomPos + 1);
          let mine = new Player(
            this.currentLevel.mineColor,
            randomPos,
            displaySize
          ); // Initializing mine using the Player class
          mines.push(mine);
        }

        this.gameState = "SHOW_MINES";
        break;

      // Not used, it's here just for code compliance
      default:
        break;
    }
  }
}

// This function gets called when a key on the keyboard is pressed
function keyPressed() {
  // Move player one to the left if letter A is pressed
  if (
    (key == "A" || key == "a") &&
    controller.gameState == "PLAY" &&
    player.endReached &&
    !player.midJump
  ) {
    player.move(-1);
  }

  // And so on...
  if (
    (key == "D" || key == "d") &&
    !player.endReached &&
    controller.gameState == "PLAY" &&
    !player.midJump
  ) {
    console.log("yessss");
    player.move(1);
  }

  if (
    (key == "W" || key == "w") &&
    !player.endReached &&
    player.position < displaySize - 2 &&
    controller.gameState == "PLAY"
  ) {
    controller.jumpDirection = 1;
    player.jump(controller.jumpDirection);
    controller.gameState = "JUMP";
  }

  if (
    (key == "Q" || key == "q") &&
    player.endReached &&
    player.position > 1 &&
    controller.gameState == "PLAY"
  ) {
    controller.jumpDirection = -1;
    player.jump(controller.jumpDirection);
    controller.gameState = "JUMP";
  }

  // When you press the letter R, the game resets back to the play state
  if (key == "R" || key == "r") {
    controller.addMine = false;
    controller.currentLevelIndex = 0;
    controller.gameState = "RESET";
  }
}
