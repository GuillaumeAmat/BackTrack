import { type Scene, ExtrudeGeometry, Mesh, MeshStandardMaterial, DoubleSide, Shape, type Group } from 'three';
// import { MOODS } from '../constants';
import { Debug } from '../utils/Debug';
import { Resources } from '../utils/Resources';
import { createMeshFromSVG } from '../lib/createMeshFromSVG';

export class Car {
  #resources: Resources;
  #scene: Scene;
  #group: Group | null = null;
  #material: MeshStandardMaterial;

  #debug: Debug;
  #debugProperties = {
    DisplayHelper: true,
  };

  public get group() {
    return this.#group;
  }

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#resources = Resources.getInstance();
    this.#debug = Debug.getInstance();

    this.#material = new MeshStandardMaterial({
      color: '#FC3BAB',
      // color: MOODS['mindaro-94'].value,
      metalness: 0.3,
      roughness: 0.4,
      side: DoubleSide,
    });

    this.createCar();
    this.createStuff();
    this.setupHelpers();
  }

  private createStuff() {
    const x = 0;
    const y = 0;
    const width = 2;
    const height = 2;
    const radius = 0.5;

    const shape = new Shape();
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);

    // const geometry = new ShapeGeometry(shape);
    const geometry = new ExtrudeGeometry([shape], {
      depth: 0.7,
      bevelEnabled: false,
      curveSegments: 32,
    });

    const mesh = new Mesh(geometry, this.#material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.x = -3;
    mesh.position.z = 2;
    mesh.position.y = 0;
    this.#scene.add(mesh);
  }

  private createCar() {
    const svgData = this.#resources.getSVGAsset('carShape');

    if (!svgData) {
      console.warn('No SVG data found for the car.');
      return;
    }

    this.#group = createMeshFromSVG(svgData, { extrusionDepth: 50, material: this.#material, scale: 0.015 });
    this.#group.position.x = 1;
    this.#group.position.z = 0;
    this.#group.rotation.z = -Math.PI / 2;
    this.#scene.add(this.#group);
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Car';
      const guiFolder = this.#debug.gui.addFolder(folderName);

      this.#debugProperties = {
        ...this.#debugProperties,
        ...this.#debug.configFromLocaleStorage?.folders?.[folderName]?.controllers,
      };

      if (this.#group) {
        const { BoxHelper } = await import('three');
        const carHelper = new BoxHelper(this.#group, 0xffff00);
        carHelper.visible = this.#debugProperties.DisplayHelper;
        this.#scene.add(carHelper);

        guiFolder.add(this.#debugProperties, 'DisplayHelper').onChange((value: boolean) => {
          carHelper.visible = value;
          this.#debug.save();
        });
      }
    }
  }

  public update() {}
}
