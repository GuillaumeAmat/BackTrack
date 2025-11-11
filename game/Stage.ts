import { Scene } from 'three';
import { type Actor, type AnyActorLogic, createActor, fromPromise } from 'xstate';

import { navigateTo } from '#app';

import { Camera } from './Camera';
import { stageMachine } from './Stage.machine';
import { Debug } from './utils/Debug';
import { Renderer } from './utils/Renderer';
import { Resources } from './utils/Resources';
import { Sizes } from './utils/Sizes';
import { Time } from './utils/Time';
import { Environment } from './world/Environment';
import { LoadingOverlay } from './world/LoadingOverlay';
import { World } from './world/World';

export class Stage {
  #actor: Actor<AnyActorLogic>;

  #world!: World;

  constructor(canvas: HTMLCanvasElement) {
    if (!window) {
      throw new Error('"Stage" can only be instanciated in a browser environment.');
    }

    new Debug();

    const scene = new Scene();
    const camera = new Camera(scene, canvas);
    const renderer = new Renderer(scene, canvas, camera);
    const loadingOverlay = new LoadingOverlay(scene);

    const sizes = new Sizes();
    sizes.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        camera.setSizesAndRatio();

        /**
         * Must be called after the camera has been resized,
         * as it updates the renderer's size and pixel ratio.
         * Also, it would take into account a re-positionning of the camera.
         */
        renderer.setSizesAndRatio();
      });
    });

    this.#actor = createActor(
      stageMachine.provide({
        actions: {
          hideLoadingOverlay: () => {
            loadingOverlay.hide();
          },
          navigateToLoadingErrorPage: () => {
            navigateTo('/loading-error');
          },
          renderWorld: () => {
            const environment = new Environment(scene);
            this.#world = new World(scene, environment);
          },
        },
        actors: {
          loadResources: fromPromise(() => this.loadResources()),
        },
      }),
      {
        input: {},
      },
    );

    // FIXME Debug only, to remove later
    this.#actor.subscribe((state) => {
      console.log({
        state: state.value,
        error: state.error,
        context: state.context,
      });
    });

    this.#actor.start();

    // this.#actor.send({ type: 'play' });

    const time = new Time();
    time.addEventListener('tick', () => {
      camera.update();
      loadingOverlay.update();

      this.#world?.update();

      renderer.update();
    });
  }

  private async loadResources() {
    const resources = new Resources({
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

    return new Promise<void>((resolve) => {
      resources.addEventListener('done', () => resolve());
      resources.load();
    });
  }
}
