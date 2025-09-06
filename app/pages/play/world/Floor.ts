import { Mesh, type Scene, BoxGeometry, MeshStandardMaterial } from 'three';

export class Floor {
  #scene: Scene;
  #mesh: Mesh | null = null;
  #geometry: BoxGeometry;
  #material: MeshStandardMaterial;

  #properties = {
    width: 1_000,
    height: 10,
    depth: 0.5,
  };

  public get mesh() {
    return this.#mesh;
  }

  constructor(scene: Scene) {
    this.#scene = scene;

    this.#geometry = new BoxGeometry(this.#properties.width, this.#properties.height, this.#properties.depth);

    this.#material = new MeshStandardMaterial({
      color: '#D795C8',
      metalness: 0.3,
      roughness: 0.4,
    });

    this.#mesh = new Mesh(this.#geometry, this.#material);
    this.#mesh.receiveShadow = true;
    this.#mesh.rotation.x = -Math.PI * 0.5;
    this.#mesh.position.y = -this.#properties.depth / 2;

    this.#scene.add(this.#mesh);
  }

  public update() {}
}
