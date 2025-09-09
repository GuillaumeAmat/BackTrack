import { MeshStandardMaterial, type Mesh, type Scene, DoubleSide } from 'three';
// import { MOODS } from '../constants';
import { Debug } from '../utils/Debug';
import { createRoundedPlaneMesh } from '../lib/createRoundedPlaneMesh';
import { OBSTACLE_VEHICLE_SIZE_DIFF, VEHICLE_SIZE } from '../constants';

const material = new MeshStandardMaterial({
  color: '#FC3BAB',
  // color: MOODS['mindaro-94'].value,
  metalness: 0.3,
  roughness: 0.4,
  side: DoubleSide,
});

export class Vehicle {
  #scene: Scene;
  #mesh: Mesh | null = null;

  #properties = {
    width: VEHICLE_SIZE,
    height: VEHICLE_SIZE,
    depth: VEHICLE_SIZE,
    radius: 0.4,
    minX: -VEHICLE_SIZE,
    maxX: VEHICLE_SIZE,
    minY: VEHICLE_SIZE / 2 + OBSTACLE_VEHICLE_SIZE_DIFF,
    maxY: VEHICLE_SIZE / 2 + OBSTACLE_VEHICLE_SIZE_DIFF + 2 * VEHICLE_SIZE,
  };

  #debug: Debug;
  #debugProperties = {
    DisplayHelper: true,
  };

  public get mesh() {
    return this.#mesh;
  }

  constructor(scene: Scene) {
    if (!window) {
      throw new Error('"Vehicle" can only be instanciated in a browser environment.');
    }

    this.#scene = scene;
    this.#debug = Debug.getInstance();

    this.createMesh();
    this.setupHelpers();

    window.addEventListener('keyup', (event) => this.#onKeyUp(event));
  }

  private createMesh() {
    const { width, height, radius, depth, minY } = this.#properties;

    this.#mesh = createRoundedPlaneMesh(width, height, radius, {
      extrusionDepth: depth,
      material,
    });

    this.#mesh.castShadow = true;
    this.#mesh.position.x = 0;
    this.#mesh.position.z = 0;
    this.#mesh.position.y = minY;

    this.#scene.add(this.#mesh);
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Vehicle';
      const guiFolder = this.#debug.gui.addFolder(folderName);

      this.#debugProperties = {
        ...this.#debugProperties,
        ...this.#debug.configFromLocaleStorage?.folders?.[folderName]?.controllers,
      };

      if (this.#mesh) {
        const { BoxHelper } = await import('three');
        const helper = new BoxHelper(this.#mesh, 0xffff00);
        helper.visible = this.#debugProperties.DisplayHelper;
        this.#scene.add(helper);

        guiFolder.add(this.#debugProperties, 'DisplayHelper').onChange((value: boolean) => {
          helper.visible = value;
          this.#debug.save();
        });
      }
    }
  }

  #onKeyUp(event: KeyboardEvent) {
    if (!this.#mesh) {
      return;
    }
    const { width, height, minX, maxX, minY, maxY } = this.#properties;

    if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(event.code)) {
      this.#mesh.position.x = Math.max(this.#mesh.position.x - width, minX);
    } else if (['ArrowRight', 'KeyD'].includes(event.code)) {
      this.#mesh.position.x = Math.min(this.#mesh.position.x + width, maxX);
    } else if (['ArrowUp', 'KeyW', 'KeyZ'].includes(event.code)) {
      this.#mesh.position.y = Math.min(this.#mesh.position.y + height, maxY);
    } else if (['ArrowDown', 'KeyS'].includes(event.code)) {
      this.#mesh.position.y = Math.max(this.#mesh.position.y - height, minY);
    }
  }

  public update() {}
}
