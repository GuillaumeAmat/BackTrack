import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry, type Scene } from 'three';

import { LEVEL_1_MATRIX, MOODS } from '../constants';
import { Debug } from '../utils/Debug';

export class Level {
  #screenGroup: Group;
  #scene: Scene;
  #group: Group | null = null;
  #meshes: Mesh[] = [];

  #properties = {
    width: 1,
    height: 0.5,
    depth: 1,
  };

  #debug: Debug;
  #debugProperties = {
    DisplayHelper: true,
  };

  constructor(screenGroup: Group, scene: Scene) {
    this.#screenGroup = screenGroup;
    this.#scene = scene;
    this.#debug = Debug.getInstance();

    this.createFloor();
    this.createBench();
    this.setupHelpers();
  }

  private createFloor() {
    const geometry = new PlaneGeometry(LEVEL_1_MATRIX[0]?.length, LEVEL_1_MATRIX.length, 1, 1);

    const material = new MeshStandardMaterial({
      color: MOODS['mindaro-94'].value,
      metalness: 0.1,
      roughness: 0.5,
    });

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.y = 0;

    this.#screenGroup.add(mesh);
  }

  private createBench() {
    const { width, height, depth } = this.#properties;

    const material = new MeshStandardMaterial({
      color: MOODS['light-tangaroa-20'].value,
      metalness: 0.1,
      roughness: 0.5,
    });

    const meshReference = new Mesh(new BoxGeometry(width, height, depth), material);
    meshReference.castShadow = true;

    for (let xIndex = 0; xIndex < 13; xIndex++) {
      for (let zIndex = 0; zIndex < 9; zIndex++) {
        const mesh = meshReference.clone();

        if (LEVEL_1_MATRIX?.[zIndex]?.[xIndex] === 0) {
          continue;
        }

        mesh.position.x = xIndex - Math.floor(13 / 2);
        mesh.position.z = zIndex - Math.floor(9 / 2);

        this.#meshes.push(mesh);
      }
    }

    this.#group = new Group();
    this.#group.add(...this.#meshes);
    this.#screenGroup.add(this.#group);
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Level';
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
