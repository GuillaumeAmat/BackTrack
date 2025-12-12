export class InputController {
  #keyUpCallback: ((event: KeyboardEvent) => void) | null = null;
  #boundKeyUpHandler: (event: KeyboardEvent) => void;
  #boundKeyDownHandler: (event: KeyboardEvent) => void;

  #keysPressed = new Set<string>();

  constructor() {
    if (!window) {
      throw new Error('"InputController" can only be instanciated in a browser environment.');
    }

    this.#boundKeyUpHandler = this.#handleKeyUp.bind(this);
    this.#boundKeyDownHandler = this.#handleKeyDown.bind(this);

    window.addEventListener('keyup', this.#boundKeyUpHandler);
    window.addEventListener('keydown', this.#boundKeyDownHandler);
  }

  public onKeyUp(callback: (event: KeyboardEvent) => void) {
    this.#keyUpCallback = callback;
  }

  public isKeyPressed(key: string): boolean {
    return this.#keysPressed.has(key);
  }

  public cleanup() {
    window.removeEventListener('keyup', this.#boundKeyUpHandler);
    window.removeEventListener('keydown', this.#boundKeyDownHandler);
    this.#keyUpCallback = null;
    this.#keysPressed.clear();
  }

  #handleKeyUp(event: KeyboardEvent) {
    this.#keysPressed.delete(event.code);

    if (this.#keyUpCallback) {
      this.#keyUpCallback(event);
    }
  }

  #handleKeyDown(event: KeyboardEvent) {
    this.#keysPressed.add(event.code);
  }
}
