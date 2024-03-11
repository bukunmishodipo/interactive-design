// This holds some player information, like color and position.
// It also has some player methods for managing how a player moves.

class Player {
  constructor(_color, _position, _displaySize) {
    this.playerColor = _color;
    this.midJump = false;
    this.position = _position;
    this.currentFrameCount = -1;
    this.endReached = false;
    this.displaySize = _displaySize;
    this.score = 0;
  }

  // if player is jumping, change the color in the right position

  // Move player based on keyboard input
  move(_direction) {
    // increments or decrements player position
    this.position = this.position + _direction;

    // if player hits the edge of display, loop around
    if (this.position == -1) {
      this.position = this.displaySize - 1;
    } else if (this.position == this.displaySize) {
      this.position = 0;
    }
  }

  jump(_direction) {
    let number0fFrames = 4;

    // The animation mimics an explosion and this variable tracks where the wave is in the display
    let k = 0;

    for (let i = 0; i < number0fFrames; i++) {
      // Animate to the left for the next 3 frames

      // Increment animation pixel
      if (i % 2 == 1 && k < 2) {
        this.move(_direction);
        k = k + 1;
      }
    }

    // // if player hits the edge of display, loop around
    if (this.position < 0) {
      this.position = this.displaySize + this.position;
    } else if (this.position >= this.displaySize) {
      this.position = this.position - this.displaySize;
    }

    this.midJump = false;
  }

  updateColor(_color) {
    this.playerColor = _color;
  }

  // This function advances animation to next frame and returns current frame number
  currentFrame() {
    this.currentFrameCount = this.currentFrameCount + 1;

    if (this.currentFrameCount >= this.numberOfFrames) {
      this.currentFrameCount = 0;
    }

    return this.currentFrameCount;
  }
}
