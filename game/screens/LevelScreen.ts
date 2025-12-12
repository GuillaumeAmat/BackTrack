import { Group, type Scene } from 'three';
import type { Actor, AnyActorLogic } from 'xstate';

import { Physics } from '../utils/Physics';
import { Level } from '../world/Level';
import { Player } from '../world/Player';

export class LevelScreen {
  #stageActor: Actor<AnyActorLogic>;
  #scene: Scene;
  #physics: Physics;

  #group: Group;
  #player: Player | null = null;
  #level: Level | null = null;
  #physicsInitialized = false;

  constructor(stageActor: Actor<AnyActorLogic>, scene: Scene) {
    this.#stageActor = stageActor;
    this.#scene = scene;
    this.#physics = Physics.getInstance();

    // TODO Improve this naive implementation
    this.#stageActor.subscribe((state) => {
      if (state.matches('Level')) {
        this.show();
      } else {
        this.hide();
      }
    });

    this.#group = new Group();

    this.initPhysics().then(() => {
      this.#player = new Player(this.#group, this.#scene);
      this.#level = new Level(this.#group, this.#scene);

      this.#scene.add(this.#group);
    });
  }

  private async initPhysics() {
    await this.#physics.init(this.#scene);
    this.#physicsInitialized = true;
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

    if (!this.#physicsInitialized) return;

    this.#physics.update();
    this.#player?.update();
    this.#level?.update();
  }
}
