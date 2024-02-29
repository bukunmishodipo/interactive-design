// This is where your state machines and game logic lives

class Controller {
  // This is the state we start with.
  constructor() {
    this.gameState = "SHOW_MINES";
    this.timer = null;
    this.jumpDirection = null;
  }

  // This is called from draw() in sketch.js with every frame
  update() {
    // STATE MACHINE ////////////////////////////////////////////////
    // This is where your game logic lives
    /////////////////////////////////////////////////////////////////
    switch (this.gameState) {
      // This is the main game state, where the playing actually happens
      case "SHOW_MINES":
        // clear screen at frame rate so we always start fresh
        display.clear();

        // now add the mines
        for (let i = 0; i < mines.length; i++) {
          display.setPixel(mines[i].position, mines[i].playerColor);
        }

        const timerCallback = () => {
          // display.setAllPixels(mines[0].playerColor);
          // this.timer = setTimeout(timerCallback, 3000);
          this.gameState = "PLAY";
        };

        // clearTimeout(this.timer);

        // Set the timer for 5 seconds (10000 milliseconds)
        this.timer = setTimeout(timerCallback, 5000);

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

        break;

      // This state is used to play an animation, after a target has been caught by a player
      case "COLLISION":
        // clear screen at frame rate so we always start fresh
        display.clear();

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
          this.gameState = "RESET"; // go to state that displays score
        }

        break;

      // This state is used to play an animation, after a target has been caught by a player
      case "JUMP":
        // clear screen at frame rate so we always start fresh
        display.clear();
        player.midJump = true;
        // play explosion animation one frame at a time.
        // first figure out what frame to show
        let frame = player.currentFrame(); // this grabs number of current frame and increments it

        // then grab every pixel of frame and put it into the display buffer

        if (this.jumpDirection == -1) {
          display.setPixel(player.position + 1, color(180, 64, 63));
        }

        if (this.jumpDirection == 1) {
          display.setPixel(player.position - 1, color(180, 64, 63));
        }

        display.setPixel(player.position, color(180, 64, 63));

        //check if animation is done and we should move on to another state
        if (frame == 2) {
          player.currentFrameCount = -1;
          this.gameState = "PLAY"; // play game
        }

        break;

      case "RESET":
        display.clear();
        let numberSet = new Set();
        for (let i = 0; i < displaySize; i++) {
          numberSet.add(i);
        }

        let randomIndex = Math.floor(Math.random() * numberSet.size);
        let randomNumber = [...numberSet][randomIndex];

        numberSet.delete(randomNumber);
        player.position = randomNumber;

        for (let i = 0; i < mines.length; i++) {
          randomIndex = Math.floor(Math.random() * numberSet.size);
          randomNumber = [...numberSet][randomIndex];
          numberSet.delete(randomNumber);
          mines[i].position = randomNumber;
        }

        this.gameState = "SHOW_MINES";
        break;

      // // Game is over. Show winner and clean everything up so we can start a new game.
      // case "SCORE":
      //   // reset everyone's score
      //   player.score = 0;

      //   // put the target somewhere else, so we don't restart the game with player and target in the same place
      //   target.position = parseInt(random(1, displaySize));

      //   //light up w/ winner color by populating all pixels in buffer with their color
      //   display.setAllPixels(score.winner);

      //   break;

      // Not used, it's here just for code compliance
      default:
        break;
    }
  }
}

// This function gets called when a key on the keyboard is pressed
function keyPressed() {
  // Move player one to the left if letter A is pressed
  if ((key == "A" || key == "a") && !player.midJump) {
    player.move(-1);
  }

  // And so on...
  if ((key == "D" || key == "d") && !player.midJump) {
    player.move(1);
  }

  if (key == "W" || key == "w") {
    controller.jumpDirection = 1;
    player.jump(controller.jumpDirection);
    controller.gameState = "JUMP";
  }

  if (key == "Q" || key == "q") {
    controller.jumpDirection = -1;
    player.jump(controller.jumpDirection);
    controller.gameState = "JUMP";
  }

  // When you press the letter R, the game resets back to the play state
  if (key == "R" || key == "r") {
    clearTimeout(controller.timer);
    controller.gameState = "RESET";
  }
}
