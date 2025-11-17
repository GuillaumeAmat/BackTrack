import { Group, type Scene } from 'three';
import type { Actor, AnyActorLogic } from 'xstate';

import { Level } from '../world/Level';
import { Player } from '../world/Player';

export class LevelScreen {
  #stageActor: Actor<AnyActorLogic>;
  #scene: Scene;

  #group: Group;
  #player: Player | null = null;
  #level: Level | null = null;

  constructor(stageActor: Actor<AnyActorLogic>, scene: Scene) {
    this.#stageActor = stageActor;
    this.#scene = scene;

    // TODO Improve this naive implementation
    this.#stageActor.subscribe((state) => {
      if (state.matches('Level')) {
        this.show();
      } else {
        this.hide();
      }
    });

    this.#group = new Group();

    this.#player = new Player(this.#group, this.#scene);
    this.#level = new Level(this.#group, this.#scene);

    this.#scene.add(this.#group);
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

    this.#player?.update();
    this.#level?.update();
  }
}
