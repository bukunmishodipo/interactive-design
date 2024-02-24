// This holds some player information, like color and position.
// It also has some player methods for managing how a player moves.

class Player {
  constructor(_color, _position, _displaySize) {
    this.jumpColor = _color;
    this.originalColor = _color;
    this.playerColor = _color;
    this.midJump = false;
    this.position = _position;
    // this.score = 0;
    this.displaySize = _displaySize;
  }

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
    this.midJump = true;
    this.playerColor = this.jumpColor; // Change player color to jump color
    this.position = this.position + _direction * 2; // Move player position by 2 units in the specified direction
    display.setPixel(this.position, this.playerColor);
    this.playerColor = this.originalColor; // Restore original player color
    // display.setPixel(this.position, this.playerColor);
    this.midJump = false;

    // if player hits the edge of display, loop around
    if (this.position < 0) {
      this.position = this.displaySize + this.position;
    } else if (this.position >= this.displaySize) {
      this.position = this.position - this.displaySize;
    }
  }
}
