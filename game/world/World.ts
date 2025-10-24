import type { Scene } from 'three';

import { Resources } from '../utils/Resources';
import type { Environment } from './Environment';
import { Floor } from './Floor';
import { Obstacle } from './Obstacle';
import { Score } from './Score';
import { Vehicle } from './Vehicle';

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
    const music = this.#resources.getAudioAsset('menuTrack');

    window.addEventListener('keyup', (event) => {
      if (event.code !== 'Space') {
        return;
      }

      if (music) {
        music.volume = 1;
        music.currentTime = 0;
      }

      if (!isPlaying) {
        isPlaying = true;
        music?.play();
        return;
      }

      isPlaying = false;
      music?.pause();
    });
  }

  public update() {
    this.#floor?.update();
    this.#vehicle?.update();
    this.#obstacle?.update();
    this.#score?.update();
  }
}
