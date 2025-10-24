import type { Scene } from 'three';
import type { Environment } from './Environment';
import { Resources } from '../utils/Resources';
import { Floor } from './Floor';
import { Vehicle } from './Vehicle';
import { Obstacle } from './Obstacle';
import { Score } from './Score';

export class World {
  #resources: Resources;

  #environment: Environment;
  #scene: Scene;
  #floor: Floor | null = null;
  #vehicle: Vehicle | null = null;
  #obstacle: Obstacle | null = null;
  #score: Score | null = null;

  constructor(scene: Scene, environment: Environment) {
    this.#scene = scene;
    this.#environment = environment;
    this.#resources = Resources.getInstance();

    this.#floor = new Floor(this.#scene);
    this.#vehicle = new Vehicle(this.#scene);
    this.#obstacle = new Obstacle(this.#scene);
    this.#score = new Score(this.#scene);

    /**
     * Must be called after the meshes have been created,
     * as it traverses the scene to update the materials.
     * If called before, it won't find any meshes to update.
     */
    this.#environment.updateMeshesMaterial();

    let isPlaying = false;
    let music: HTMLAudioElement;

    window.addEventListener('keyup', (event) => {
      if (event.code !== 'Space') {
        return;
      }

      if (!music) {
        music = this.#resources.getAudioAsset('menuTrack');
        music.volume = 1;
        music.currentTime = 0;
      }

      if (!isPlaying) {
        isPlaying = true;
        music.play();
        return;
      }

      isPlaying = false;
      music.pause();
    });
  }

  public update() {
    this.#floor?.update();
    this.#vehicle?.update();
    this.#obstacle?.update();
    this.#score?.update();
  }
}
