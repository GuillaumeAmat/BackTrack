import { Scene } from 'three';
import { type Actor, type AnyActorLogic, createActor } from 'xstate';

import { Camera } from './Camera';
import { uxMachine } from './machines/ux';
import { Debug } from './utils/Debug';
import { Renderer } from './utils/Renderer';
import { Resources } from './utils/Resources';
import { Sizes } from './utils/Sizes';
import { Time } from './utils/Time';
import { Environment } from './world/Environment';
import { LoadingOverlay } from './world/LoadingOverlay';
import { World } from './world/World';

export class Stage {
  #uxActor: Actor<AnyActorLogic>;

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

    this.#uxActor = createActor(uxMachine).start();

    this.#uxActor.subscribe((state) => {
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
        priority: 'high',
      },
      menuTrack: {
        type: 'audio',
        path: '/game/audio/track/menu.opus',
        priority: 'low',
      },
      levelTrack: {
        type: 'audio',
        path: '/game/audio/track/level.opus',
        priority: 'low',
      },
      selectEffect: {
        type: 'audio',
        path: '/game/audio/effect/select.opus',
        priority: 'low',
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

      // Wait for the resources' _done_ event, which ensures all assets are loaded
      // before enabling any CTA and move forward with the game.
      // Also check on `this.#resources.isDone` in case the event has been
      // dispatched before reaching this point.
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
