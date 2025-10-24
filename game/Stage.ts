import { Scene } from 'three';

import { Sizes } from './utils/Sizes';
import { Time } from './utils/Time';
import { Camera } from './Camera';
import { Renderer } from './utils/Renderer';
import { World } from './world/World';
import { Debug } from './utils/Debug';
import { createActor, type Actor, type AnyActorLogic } from 'xstate';

import { machine } from './machine';
import { LoadingOverlay } from './world/LoadingOverlay';
import { Resources } from './utils/Resources';
import { Environment } from './world/Environment';

export class Stage {
  #actor: Actor<AnyActorLogic>;

  #canvas: HTMLCanvasElement;

  #renderer: Renderer;
  #sizes: Sizes;

  #scene: Scene;
  #camera: Camera;
  #resources: Resources;
  #loadingOverlay: LoadingOverlay;
  #world!: World;

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

    new Debug();

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
    this.#loadingOverlay = new LoadingOverlay(this.#scene);

    this.#resources = new Resources({
      interFont: {
        type: 'font',
        path: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      },
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
      // bmLogo: {
      //   type: 'svg',
      //   path: '/game/svg/bmLogo.svg',
      // },
    });

    this.#resources.addEventListener('ready', () => {
      const environment = new Environment(this.#scene);
      this.#world = new World(this.#scene, environment);

      this.#loadingOverlay.hide();
    });

    const time = new Time();
    time.addEventListener('tick', () => {
      this.#camera.update();

      this.#loadingOverlay.update();

      this.#world?.update();

      this.#renderer.update();
    });
  }
}
