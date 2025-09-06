import type { Scene } from 'three';
import { Environment } from './Environment';
import { Resources } from '../utils/Resources';
import { Floor } from './Floor';
import { Car } from './Car';
import { Score } from './Score';

export class World {
  #resources: Resources;
  // eslint-disable-next-line no-unused-private-class-members
  #environment!: Environment;
  #scene: Scene;
  #floor: Floor | null = null;
  #car: Car | null = null;
  #score: Score | null = null;

  constructor(scene: Scene) {
    this.#scene = scene;

    this.#resources = new Resources({
      menuTrack: {
        type: 'audio',
        path: '/game/audio/track/menu.opus',
      },
      levelTrack: {
        type: 'audio',
        path: '/game/audio/track/level.opus',
      },
      selectEffect: {
        type: 'audio',
        path: '/game/audio/effect/select.opus',
      },
      carShape: {
        type: 'svg',
        path: '/game/svg/car.svg',
      },
      interFont: {
        type: 'font',
        path: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      },
    });

    this.#resources.addEventListener('ready', () => {
      this.#floor = new Floor(this.#scene);
      this.#car = new Car(this.#scene);
      this.#score = new Score(this.#scene);

      /**
       * Must be called after the meshes have been created,
       * as it traverses the scene to update the materials.
       * If called before, it won't find any meshes to update.
       */
      this.#environment = new Environment(this.#scene);

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
    });
  }

  public update() {
    this.#floor?.update();
    this.#car?.update();
    this.#score?.update();
  }
}
