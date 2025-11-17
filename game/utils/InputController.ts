export class InputController {
  #callback: ((event: KeyboardEvent) => void) | null = null;
  #boundKeyUpHandler: (event: KeyboardEvent) => void;

  constructor() {
    if (!window) {
      throw new Error('"InputController" can only be instanciated in a browser environment.');
    }

    this.#boundKeyUpHandler = this.#handleKeyUp.bind(this);
    window.addEventListener('keyup', this.#boundKeyUpHandler);
  }

  public onKeyUp(callback: (event: KeyboardEvent) => void) {
    this.#callback = callback;
  }

  public cleanup() {
    window.removeEventListener('keyup', this.#boundKeyUpHandler);
    this.#callback = null;
  }

  #handleKeyUp(event: KeyboardEvent) {
    if (this.#callback) {
      this.#callback(event);
    }
  }
}
