import { Group, type Mesh, MeshStandardMaterial, type Scene } from 'three';
import type { Actor, AnyActorLogic } from 'xstate';

import { createTextMesh } from '../lib/createTextMesh';
import { Resources } from '../utils/Resources';

export class StartScreen {
  #stageActor: Actor<AnyActorLogic>;
  #scene: Scene;
  #resources: Resources;

  #group: Group;
  #titleMesh: Mesh | null = null;
  #promptMesh: Mesh | null = null;
  #material: MeshStandardMaterial;

  constructor(stageActor: Actor<AnyActorLogic>, scene: Scene) {
    this.#stageActor = stageActor;
    this.#scene = scene;
    this.#resources = Resources.getInstance();

    this.#group = new Group();
    this.#scene.add(this.#group);

    this.#stageActor.subscribe((state) => {
      if (state.matches('Start')) {
        this.show();
      } else {
        this.hide();
      }
    });

    this.#material = new MeshStandardMaterial({
      color: '#FBD954',
      metalness: 0.3,
      roughness: 0.4,
    });

    this.createText();
  }

  private createText() {
    const font = this.#resources.getFontAsset('interFont');

    if (!font) {
      return;
    }

    this.#titleMesh = createTextMesh('BackTrack', font, {
      extrusionDepth: 0.1,
      size: 2,
      material: this.#material,
    });
    this.#titleMesh.position.set(0, 2, 0);
    this.#group.add(this.#titleMesh);

    this.#promptMesh = createTextMesh('Press any button to start', font, {
      extrusionDepth: 0.05,
      size: 0.8,
      material: this.#material,
    });
    this.#promptMesh.position.set(0, -1, 0);
    this.#group.add(this.#promptMesh);
  }

  private show() {
    this.#group.visible = true;
  }

  private hide() {
    this.#group.visible = false;
  }

  public update() {
    if (!this.#group.visible) return;
  }
}
