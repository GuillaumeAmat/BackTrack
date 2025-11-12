import { Group, type Scene } from 'three';
import type { Actor, AnyActorLogic } from 'xstate';

import { Resources } from '../utils/Resources';
import { Floor } from '../world/Floor';
import { Obstacle } from '../world/Obstacle';
import { Score } from '../world/Score';
import { Vehicle } from '../world/Vehicle';

export class LevelScreen {
  #stageActor: Actor<AnyActorLogic>;
  #scene: Scene;
  #resources: Resources;

  #group: Group;
  #floor: Floor | null = null;
  #vehicle: Vehicle | null = null;
  #obstacle: Obstacle | null = null;
  #score: Score | null = null;

  constructor(stageActor: Actor<AnyActorLogic>, scene: Scene) {
    this.#stageActor = stageActor;
    this.#scene = scene;
    this.#resources = Resources.getInstance();

    // TODO Improve this naive implementation
    this.#stageActor.subscribe((state) => {
      if (state.matches('Level')) {
        this.show();
      } else {
        this.hide();
      }
    });

    this.#group = new Group();

    this.#floor = new Floor(this.#group);
    this.#vehicle = new Vehicle(this.#group, this.#scene);
    this.#obstacle = new Obstacle(this.#group, this.#scene);
    this.#score = new Score(this.#group, this.#scene);

    this.#scene.add(this.#group);

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

  private show() {
    this.#group.visible = true;
  }

  private hide() {
    this.#group.visible = false;
  }

  public update() {
    // TODO Improve this naive implementation
    if (!this.#group.visible) return;

    this.#floor?.update();
    this.#vehicle?.update();
    this.#obstacle?.update();
    this.#score?.update();
  }
}
