import RAPIER from '@dimforge/rapier3d-compat';
import { type Group, Mesh, MeshBasicMaterial, PlaneGeometry, type Scene, SRGBColorSpace, Vector3 } from 'three';

import { MOVEMENT_SPEED, PLAYER_SIZE } from '../constants';
import { Debug } from '../utils/Debug';
import { InputController } from '../utils/InputController';
import { Physics } from '../utils/Physics';
import { Resources } from '../utils/Resources';

export class Player {
  #screenGroup: Group;
  #scene: Scene;
  #resources: Resources;
  #physics: Physics;

  #mesh: Mesh | null = null;
  #rigidBody: RAPIER.RigidBody | null = null;

  #properties = {
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    movementSpeed: MOVEMENT_SPEED,
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
    this.#physics = Physics.getInstance();

    this.#debug = Debug.getInstance();
    this.#inputController = new InputController();

    this.createMesh();
    this.createPhysicsBody();
    this.setupHelpers();
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

  private createPhysicsBody() {
    if (!this.#mesh) return;

    const initialPosition = new Vector3(0, 0.5, 2);
    this.#rigidBody = this.#physics.createDynamicRigidBody(initialPosition);

    const radius = this.#properties.width / 2;
    const halfHeight = this.#properties.height / 4;
    this.#physics.createCapsuleCollider(this.#rigidBody, halfHeight, radius, 0.3);

    this.#rigidBody.lockRotations(true, true);
    this.#rigidBody.setLinearDamping(8.0);
    this.#rigidBody.setAngularDamping(1.0);
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

  private updateMovement() {
    if (!this.#rigidBody) return;

    const { movementSpeed } = this.#properties;

    // Determine movement direction based on input
    let x = 0;
    let z = 0;

    if (
      this.#inputController.isKeyPressed('ArrowLeft') ||
      this.#inputController.isKeyPressed('KeyA') ||
      this.#inputController.isKeyPressed('KeyQ')
    ) {
      x = -1;
    } else if (this.#inputController.isKeyPressed('ArrowRight') || this.#inputController.isKeyPressed('KeyD')) {
      x = 1;
    }

    if (
      this.#inputController.isKeyPressed('ArrowUp') ||
      this.#inputController.isKeyPressed('KeyW') ||
      this.#inputController.isKeyPressed('KeyZ')
    ) {
      z = -1;
    } else if (this.#inputController.isKeyPressed('ArrowDown') || this.#inputController.isKeyPressed('KeyS')) {
      z = 1;
    }

    // Get current velocity to preserve Y component
    const currentVel = this.#rigidBody.linvel();

    // Calculate desired velocity
    const desiredVelX = x * movementSpeed;
    const desiredVelZ = z * movementSpeed;

    // Apply velocity with smoother control
    const forceVector = new RAPIER.Vector3(desiredVelX, currentVel.y, desiredVelZ);
    this.#rigidBody.setLinvel(forceVector, true);
  }

  private syncMeshWithPhysics() {
    if (!this.#mesh || !this.#rigidBody) return;

    const position = this.#rigidBody.translation();
    this.#mesh.position.set(position.x, position.y - 0.5, position.z);
  }

  public update() {
    this.updateMovement();
    this.syncMeshWithPhysics();
  }
}
