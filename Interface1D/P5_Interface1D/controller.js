// This is where your state machines and game logic lives

class Controller {
  // This is the state we start with.
  constructor() {
    this.gameState = "SHOW_MINES";
    this.timer = null;
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

        // Set the timer for 5 seconds (10000 milliseconds)
        this.timer = setTimeout(timerCallback, 10000);

        break;

      case "PLAY":
        // clear screen at frame rate so we always start fresh
        display.clear();

        // show all players in the right place, by adding them to display buffer
        display.setPixel(player.position, player.playerColor);

        // check if player has hit a mine
        for (let i = 0; i < mines.length; i++) {
          if (player.position == mines[i].position) {
            this.gameState = "COLLISION"; // go to COLLISION state
          } else if (player.position == mines[i].position + 1) {
            player.score++; // increment score
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
          this.gameState = "SCORE"; // go to state that displays score
        } else {
          target.position = parseInt(random(0, displaySize)); // move the target to a new random position
          this.gameState = "PLAY"; // back to play state
        }

        break;

      // Game is over. Show winner and clean everything up so we can start a new game.
      case "SCORE":
        // reset everyone's score
        player.score = 0;

        // put the target somewhere else, so we don't restart the game with player and target in the same place
        target.position = parseInt(random(1, displaySize));

        //light up w/ winner color by populating all pixels in buffer with their color
        display.setAllPixels(score.winner);

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
  if (key == "A" || key == "a") {
    player.move(-1);
  }

  // And so on...
  if (key == "D" || key == "d") {
    player.move(1);
  }

  if (key == "W" || key == "w") {
    player.jump();
  }

  // When you press the letter R, the game resets back to the play state
  if (key == "R" || key == "r") {
    controller.gameState = "SHOW_MINES";
  }
}
