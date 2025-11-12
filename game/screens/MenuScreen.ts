import { Group, type Mesh, MeshStandardMaterial, type Scene } from 'three';
import type { Actor, AnyActorLogic } from 'xstate';

import { createTextMesh } from '../lib/createTextMesh';
import { Resources } from '../utils/Resources';

export class MenuScreen {
  #stageActor: Actor<AnyActorLogic>;
  #scene: Scene;
  #resources: Resources;

  #group: Group;
  #titleMesh: Mesh | null = null;
  #playMesh: Mesh | null = null;
  #leaderboardMesh: Mesh | null = null;
  #material: MeshStandardMaterial;

  #menuTrack: HTMLAudioElement | null = null;

  constructor(stageActor: Actor<AnyActorLogic>, scene: Scene) {
    this.#stageActor = stageActor;
    this.#scene = scene;
    this.#resources = Resources.getInstance();

    this.#group = new Group();
    this.#scene.add(this.#group);

    this.#stageActor.subscribe((state) => {
      if (state.matches('Menu')) {
        this.show();
      } else {
        this.hide();
      }
    });

    this.#menuTrack = this.#resources.getAudioAsset('menuTrack');

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

    this.#titleMesh = createTextMesh('Main Menu', font, {
      extrusionDepth: 0.1,
      size: 1.5,
      material: this.#material,
    });
    this.#titleMesh.position.set(0, 3, 0);
    this.#group.add(this.#titleMesh);

    this.#playMesh = createTextMesh('> Play', font, {
      extrusionDepth: 0.05,
      size: 1,
      material: this.#material,
    });
    this.#playMesh.position.set(0, 1, 0);
    this.#group.add(this.#playMesh);

    this.#leaderboardMesh = createTextMesh('  Leaderboard', font, {
      extrusionDepth: 0.05,
      size: 1,
      material: this.#material,
    });
    this.#leaderboardMesh.position.set(0, -1, 0);
    this.#group.add(this.#leaderboardMesh);
  }

  private playMenuTrack() {
    if (!this.#menuTrack) return;

    this.#menuTrack.loop = true;
    this.#menuTrack.volume = 1;
    this.#menuTrack.currentTime = 0;
    this.#menuTrack.play();
  }

  private pauseMenuTrack() {
    if (!this.#menuTrack) return;

    this.#menuTrack.pause();
  }

  private show() {
    this.#group.visible = true;
    this.playMenuTrack();
  }

  private hide() {
    this.#group.visible = false;
    this.pauseMenuTrack();
  }

  public update() {
    if (!this.#group.visible) return;
  }
}
