import type { Scene } from 'three';
import { OrthographicCamera } from 'three';
import { Sizes } from './utils/Sizes';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Debug } from './utils/Debug';

export class Camera {
  #canvas: HTMLCanvasElement;
  #camera: OrthographicCamera;
  #scene: Scene;
  #sizes: Sizes;
  #debug: Debug;

  #properties = {
    frustumSize: 30,
  };

  #controls?: OrbitControls;

  public get camera() {
    return this.#camera;
  }

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
    this.#scene = scene;
    this.#sizes = new Sizes();
    this.#debug = Debug.getInstance();

    // this.#camera = new PerspectiveCamera(35, this.#sizes.width / this.#sizes.height, 0.1, 100);
    const aspect = this.#sizes.width / this.#sizes.height;

    this.#camera = new OrthographicCamera(
      (this.#properties.frustumSize * aspect) / -2,
      (this.#properties.frustumSize * aspect) / 2,
      this.#properties.frustumSize / 2,
      this.#properties.frustumSize / -2,
      0.1,
      100,
    );
    this.#camera.position.set(-30, 30, 30);
    this.#camera.lookAt(0, 0, 0);
    this.#scene.add(this.#camera);

    this.setupControls();
    this.setSizesAndRatio();
  }

  private async setupControls() {
    if (this.#debug.active) {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

      this.#controls = new OrbitControls(this.#camera, this.#canvas);
      this.#controls.enableDamping = true;
    }
  }

  public setSizesAndRatio() {
    // For perspective camera
    // this.#camera.aspect = this.#sizes.width / this.#sizes.height;
    // End perspective camera

    // For orthographic camera
    const aspect = this.#sizes.width / this.#sizes.height;
    this.#camera.left = (-this.#properties.frustumSize * aspect) / 2;
    this.#camera.right = (this.#properties.frustumSize * aspect) / 2;
    this.#camera.top = this.#properties.frustumSize / 2;
    this.#camera.bottom = -this.#properties.frustumSize / 2;
    // End orthographic camera

    this.#camera.updateProjectionMatrix();
  }

  public update() {
    if (this.#debug.active) {
      this.#controls?.update();
    }
  }
}
