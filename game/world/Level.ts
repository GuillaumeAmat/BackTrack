import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry, type Scene } from 'three';

import { LEVEL_1_MATRIX, TILE_SIZE, WALL_DEPTH, WALL_HEIGHT } from '../constants';
import { Debug } from '../utils/Debug';
import { Resources } from '../utils/Resources';

export class Level {
  #screenGroup: Group;
  #scene: Scene;
  #resources: Resources;
  #group: Group;

  #properties = {
    tileSize: TILE_SIZE,
    wallDepth: WALL_DEPTH,
    wallHeight: WALL_HEIGHT,
  };

  #debug: Debug;
  #debugProperties = {
    DisplayHelper: true,
  };

  constructor(screenGroup: Group, scene: Scene) {
    this.#screenGroup = screenGroup;
    this.#scene = scene;
    this.#resources = Resources.getInstance();
    this.#debug = Debug.getInstance();

    this.#group = new Group();
    this.#screenGroup.add(this.#group);

    this.createFloor();
    this.createBench();
    this.createWall();
    this.setupHelpers();
  }

  private createFloor() {
    const geometry = new PlaneGeometry(LEVEL_1_MATRIX[0]?.length, LEVEL_1_MATRIX.length, 1, 1);

    const material = new MeshStandardMaterial({
      color: '#83898E',
      // color: MOODS['mindaro-94'].value,
      metalness: 0.1,
      roughness: 0.5,
    });

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.y = 0;

    this.#group.add(mesh);
  }

  private createBench() {
    if (!Array.isArray(LEVEL_1_MATRIX) || !LEVEL_1_MATRIX[0]) {
      return;
    }

    const benchModel = this.#resources.getGLTFAsset('benchModel');

    if (!benchModel) {
      return;
    }

    benchModel.scene.position.y = 0;
    benchModel.scene.scale.setScalar(11);

    benchModel.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.#group.add(benchModel.scene);

    const levelWidth = LEVEL_1_MATRIX[0].length;
    const levelDepth = LEVEL_1_MATRIX.length;
    const meshes: Group[] = [];

    for (let xIndex = 0; xIndex < levelWidth; xIndex++) {
      for (let zIndex = 0; zIndex < levelDepth; zIndex++) {
        if (LEVEL_1_MATRIX[zIndex]?.[xIndex] === 0) {
          continue;
        }

        const mesh = benchModel.scene.clone();

        mesh.position.x = xIndex - Math.floor(levelWidth / 2);
        mesh.position.z = zIndex - Math.floor(levelDepth / 2);

        meshes.push(mesh);
      }
    }

    this.#group.add(...meshes);
  }

  private createWall() {
    const { tileSize, wallDepth, wallHeight } = this.#properties;

    if (!Array.isArray(LEVEL_1_MATRIX) || !LEVEL_1_MATRIX[0]) {
      return;
    }

    const material = new MeshStandardMaterial({
      color: '#C3A561',
      // color: MOODS['light-tangaroa-20'].value,
      metalness: 0.1,
      roughness: 0.5,
    });

    const meshReference = new Mesh(new BoxGeometry(tileSize, wallHeight, wallDepth), material);
    meshReference.castShadow = true;
    meshReference.receiveShadow = true;
    meshReference.position.y = wallHeight / 2;
    meshReference.geometry.scale(0.98, 0.98, 0.98);

    const levelWidth = LEVEL_1_MATRIX[0].length;
    const levelDepth = LEVEL_1_MATRIX.length;
    const meshes: Mesh[] = [];

    // Top side
    for (let xIndex = 0; xIndex < levelWidth; xIndex++) {
      const mesh = meshReference.clone();

      mesh.position.x = xIndex - Math.floor(levelWidth / 2);
      mesh.position.z = (Math.floor(levelDepth / 2) + tileSize / 2 + wallDepth / 2) * -1;

      meshes.push(mesh);
    }

    // Bottom side
    for (let xIndex = 0; xIndex < levelWidth; xIndex++) {
      const mesh = meshReference.clone();

      mesh.position.x = xIndex - Math.floor(levelWidth / 2);
      mesh.position.z = levelDepth - Math.floor(levelDepth / 2) - tileSize / 2 + wallDepth / 2;

      meshes.push(mesh);
    }

    // Left side
    for (let zIndex = 0; zIndex < levelDepth; zIndex++) {
      const mesh = meshReference.clone();

      mesh.rotation.y = Math.PI / 2;
      mesh.position.x = (Math.floor(levelWidth / 2) + tileSize / 2 + wallDepth / 2) * -1;
      mesh.position.z = zIndex - Math.floor(levelDepth / 2);

      meshes.push(mesh);
    }

    // Right side
    for (let zIndex = 0; zIndex < levelDepth; zIndex++) {
      const mesh = meshReference.clone();

      mesh.rotation.y = Math.PI / 2;
      mesh.position.x = levelWidth - Math.floor(levelWidth / 2) - tileSize / 2 + wallDepth / 2;
      mesh.position.z = zIndex - Math.floor(levelDepth / 2);

      meshes.push(mesh);
    }

    this.#group.add(...meshes);
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
