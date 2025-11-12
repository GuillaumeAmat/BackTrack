import { DoubleSide, Group, type Mesh, MeshStandardMaterial, type Scene } from 'three';

import { OBSTACLE_VEHICLE_SIZE_DIFF, VEHICLE_SIZE } from '../constants';
import { createRoundedPlaneMesh } from '../lib/createRoundedPlaneMesh';
// import { MOODS } from '../constants';
import { Debug } from '../utils/Debug';

const material = new MeshStandardMaterial({
  color: '#6FFCDC',
  // color: MOODS['mindaro-94'].value,
  metalness: 0.3,
  roughness: 0.4,
  side: DoubleSide,
});

export class Obstacle {
  #screenGroup: Group;
  #scene: Scene;
  #group: Group | null = null;
  #meshes: Mesh[] = [];

  #properties = {
    width: VEHICLE_SIZE - OBSTACLE_VEHICLE_SIZE_DIFF,
    height: VEHICLE_SIZE - OBSTACLE_VEHICLE_SIZE_DIFF,
    depth: VEHICLE_SIZE - OBSTACLE_VEHICLE_SIZE_DIFF,
    radius: 0.4,
  };

  #debug: Debug;
  #debugProperties = {
    DisplayHelper: true,
  };

  constructor(screenGroup: Group, scene: Scene) {
    this.#screenGroup = screenGroup;
    this.#scene = scene;
    this.#debug = Debug.getInstance();

    this.createGroup();
    this.setupHelpers();
  }

  private createGroup() {
    const { width, height, radius, depth } = this.#properties;

    const meshReference = createRoundedPlaneMesh(width, height, radius, {
      extrusionDepth: depth,
      material,
    });

    meshReference.castShadow = true;
    meshReference.position.z = -15;

    for (let xIndex = 0; xIndex < 3; xIndex++) {
      for (let yIndex = 0; yIndex < 3; yIndex++) {
        const mesh = meshReference.clone();
        mesh.position.x = xIndex * VEHICLE_SIZE - VEHICLE_SIZE;
        mesh.position.y = yIndex * VEHICLE_SIZE + (VEHICLE_SIZE / 2 + OBSTACLE_VEHICLE_SIZE_DIFF);

        this.#meshes.push(mesh);
      }
    }

    this.#group = new Group();
    this.#group.add(...this.#meshes);
    this.#screenGroup.add(this.#group);
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Obstacle';
      const guiFolder = this.#debug.gui.addFolder(folderName);

      this.#debugProperties = {
        ...this.#debugProperties,
        ...this.#debug.configFromLocaleStorage?.folders?.[folderName]?.controllers,
      };

      if (this.#group) {
        const { BoxHelper } = await import('three');
        const helper = new BoxHelper(this.#group, 0xffff00);
        helper.visible = this.#debugProperties.DisplayHelper;
        this.#scene.add(helper);

        guiFolder.add(this.#debugProperties, 'DisplayHelper').onChange((value: boolean) => {
          helper.visible = value;
          this.#debug.save();
        });
      }
    }
  }

  public update() {}
}
