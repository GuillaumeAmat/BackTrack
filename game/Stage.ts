import { Scene } from 'three';

import { Sizes } from './utils/Sizes';
import { Time } from './utils/Time';
import { Camera } from './Camera';
import { Renderer } from './utils/Renderer';
import { World } from './world/World';
import { Debug } from './utils/Debug';
import { createActor, type Actor, type AnyActorLogic } from 'xstate';

import { machine } from './machine';

export class Stage {
  #actor: Actor<AnyActorLogic>;

  #canvas: HTMLCanvasElement;

  #renderer: Renderer;
  #sizes: Sizes;
  #time: Time;
  // eslint-disable-next-line no-unused-private-class-members
  #debug!: Debug;

  #scene: Scene;
  #camera: Camera;
  #world: World;

  constructor(canvas: HTMLCanvasElement) {
    if (!window) {
      throw new Error('"Stage" can only be instanciated in a browser environment.');
    }

    this.#actor = createActor(machine).start();

    this.#actor.subscribe((state) => {
      console.log(state.value);
    });

    // this.#actor.send({ type: 'play' });

    this.#scene = new Scene();
    this.#debug = new Debug();

    this.#sizes = new Sizes();
    this.#sizes.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        this.#camera.setSizesAndRatio();

        /**
         * Must be called after the camera has been resized,
         * as it updates the renderer's size and pixel ratio.
         * Also, it would take into account a re-positionning of the camera.
         */
        this.#renderer.setSizesAndRatio();
      });
    });

    this.#canvas = canvas;

    this.#camera = new Camera(this.#scene, this.#canvas);
    this.#renderer = new Renderer(this.#scene, this.#canvas, this.#camera);
    this.#world = new World(this.#scene);

    this.#time = new Time();
    this.#time.addEventListener('tick', () => {
      this.#camera.update();
      this.#world.update();
      this.#renderer.update();
    });
  }
}
