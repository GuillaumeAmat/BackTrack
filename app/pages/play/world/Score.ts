import { type Mesh, type Scene, DoubleSide, MeshStandardMaterial } from 'three';
// import { MOODS } from '../constants';
import { Debug } from '../utils/Debug';
import { Resources } from '../utils/Resources';
import { createTextMesh } from '../lib/createTextMesh';

export class Score {
  #resources: Resources;
  #scene: Scene;
  #mesh: Mesh | null = null;
  #material: MeshStandardMaterial;

  #debug: Debug;
  #debugProperties = {
    DisplayHelper: true,
  };

  public get mesh() {
    return this.#mesh;
  }

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#resources = Resources.getInstance();
    this.#debug = Debug.getInstance();

    this.#material = new MeshStandardMaterial({
      color: '#FBD954',
      // color: MOODS['mindaro-94'].value,
      metalness: 0.3,
      roughness: 0.4,
      side: DoubleSide,
    });

    this.createScore();
    this.setupHelpers();
  }

  private createScore() {
    const font = this.#resources.getFontAsset('interFont');
    this.#mesh = createTextMesh('20720', font, {
      extrusionDepth: 0.05,
      size: 1.2,
      material: this.#material,
    });
    this.#mesh.position.set(0, 5, -6);
    this.#mesh.rotation.y = Math.PI / 2;
    this.#scene.add(this.#mesh);
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Score';
      const guiFolder = this.#debug.gui.addFolder(folderName);

      this.#debugProperties = {
        ...this.#debugProperties,
        ...this.#debug.configFromLocaleStorage?.folders?.[folderName]?.controllers,
      };

      if (this.#mesh) {
        const { BoxHelper } = await import('three');
        const helper = new BoxHelper(this.#mesh, 0x0000ff);
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
