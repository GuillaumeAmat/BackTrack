import { type Group, Mesh, MeshBasicMaterial, PlaneGeometry, type Scene, SRGBColorSpace } from 'three';

import { Debug } from '../utils/Debug';
import { InputController } from '../utils/InputController';
import { Resources } from '../utils/Resources';

export class Player {
  #screenGroup: Group;
  #scene: Scene;
  #resources: Resources;

  #mesh: Mesh | null = null;

  #properties = {
    width: 1,
    height: 1,
    depth: 0.1,
    radius: 0.4,
    minX: -10,
    maxX: 10,
    minZ: -10,
    maxZ: 10,
  };

  #debug: Debug;
  #inputController: InputController;
  #debugProperties = {
    DisplayHelper: true,
  };

  public get mesh() {
    return this.#mesh;
  }

  constructor(screenGroup: Group, scene: Scene) {
    this.#screenGroup = screenGroup;
    this.#scene = scene;
    this.#resources = Resources.getInstance();

    this.#debug = Debug.getInstance();
    this.#inputController = new InputController();

    this.createMesh();
    this.setupHelpers();

    this.#inputController.onKeyUp((event) => this.#onKeyUp(event));
  }

  private createMesh() {
    const { width, height } = this.#properties;

    const playerTexture = this.#resources.getTextureAsset('playerTexture');

    if (!playerTexture) {
      return;
    }

    playerTexture.colorSpace = SRGBColorSpace;

    const material = new MeshBasicMaterial({
      map: playerTexture,
      alphaTest: 0.5,
    });

    const geometry = new PlaneGeometry(width, height, 10, 10);
    geometry.translate(0, height / 2, 0);
    this.#mesh = new Mesh(geometry, material);

    this.#mesh.position.x = 0;
    this.#mesh.position.y = 0;
    this.#mesh.position.z = 2;
    this.#mesh.rotation.x = Math.PI * -0.25;

    this.#screenGroup.add(this.#mesh);
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Player';
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
    const { width, height, minX, maxX, minZ, maxZ } = this.#properties;

    if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(event.code)) {
      this.#mesh.position.x = Math.max(this.#mesh.position.x - width, minX);
    } else if (['ArrowRight', 'KeyD'].includes(event.code)) {
      this.#mesh.position.x = Math.min(this.#mesh.position.x + width, maxX);
    } else if (['ArrowUp', 'KeyW', 'KeyZ'].includes(event.code)) {
      this.#mesh.position.z = Math.min(this.#mesh.position.z - height, maxZ);
    } else if (['ArrowDown', 'KeyS'].includes(event.code)) {
      this.#mesh.position.z = Math.max(this.#mesh.position.z + height, minZ);
    }
  }

  public update() {}
}
