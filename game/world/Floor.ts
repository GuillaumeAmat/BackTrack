import { BoxGeometry, type Group, Mesh, MeshStandardMaterial } from 'three';

import { OBSTACLE_VEHICLE_SIZE_DIFF } from '../constants';

export class Floor {
  #mesh: Mesh | null = null;
  #geometry: BoxGeometry;
  #material: MeshStandardMaterial;

  #properties = {
    width: 9,
    height: 1_000,
    depth: OBSTACLE_VEHICLE_SIZE_DIFF,
  };

  public get mesh() {
    return this.#mesh;
  }

  constructor(screenGroup: Group) {
    this.#geometry = new BoxGeometry(this.#properties.width, this.#properties.height, this.#properties.depth);

    this.#material = new MeshStandardMaterial({
      color: '#D795C8',
      metalness: 0.3,
      roughness: 0.4,
    });

    this.#mesh = new Mesh(this.#geometry, this.#material);
    this.#mesh.receiveShadow = true;
    this.#mesh.rotation.x = Math.PI * 0.5;
    this.#mesh.position.y = -this.#properties.depth / 2;

    screenGroup.add(this.#mesh);
  }

  public update() {}
}
