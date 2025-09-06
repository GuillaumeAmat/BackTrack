import { Mesh, type AnimationAction, type Scene, AnimationMixer } from 'three';
import { Resources } from '../utils/Resources';
import { Debug } from '../utils/Debug';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Time } from '../utils/Time';

export class Fox {
  #resources: Resources;
  #debug: Debug;
  #scene: Scene;
  #time: Time;
  #mixer: AnimationMixer | null = null;

  #asset: GLTF;
  #model: GLTF['scene'];
  #actions: Record<string, AnimationAction> = {};

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#time = new Time();

    this.#resources = Resources.getInstance();

    this.#asset = this.#resources.getGLTFAsset('foxModel');
    this.#model = this.#asset.scene;
    this.#model.scale.set(0.02, 0.02, 0.02);
    this.#model.position.set(0, 0, 0);

    this.#model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.#mixer = new AnimationMixer(this.#model);

    this.#actions.idle = this.#mixer.clipAction(this.#asset.animations[0]!);
    this.#actions.walking = this.#mixer.clipAction(this.#asset.animations[1]!);
    this.#actions.running = this.#mixer.clipAction(this.#asset.animations[2]!);
    this.#actions.current = this.#actions.idle;

    this.#actions.current.play();

    this.#scene.add(this.#model);

    this.#debug = Debug.getInstance();

    console.log(this.#debug.active);
    if (this.#debug.active) {
      const debugObject = {
        playIdle: () => {
          this.play('idle');
        },
        playWalking: () => {
          this.play('walking');
        },
        playRunning: () => {
          this.play('running');
        },
      };

      const foxFolder = this.#debug.gui.addFolder('Fox');

      foxFolder.add(debugObject, 'playIdle').name('Play Idle');
      foxFolder.add(debugObject, 'playWalking').name('Play Walking');
      foxFolder.add(debugObject, 'playRunning').name('Play Running');

      foxFolder.open();
    }
  }

  public update() {
    this.#mixer?.update(this.#time.delta * 0.001);
  }

  public play(name: string) {
    if (!this.#actions[name]) {
      return;
    }

    const newAction = this.#actions[name];
    newAction.reset().play();

    if (this.#actions.current) {
      newAction.crossFadeFrom(this.#actions.current, 1);
    }

    this.#actions.current = newAction;
  }
}
