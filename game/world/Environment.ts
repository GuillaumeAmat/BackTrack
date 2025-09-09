import type { CubeTexture, Scene } from 'three';
import { AmbientLight, Color, DirectionalLight, Mesh, MeshStandardMaterial } from 'three';
import { Debug } from '../utils/Debug';
import { BACKGROUND_COLOR, FRUSTUM } from '../constants';

type EnvironmentMap = {
  intensity: number;
  texture: CubeTexture | null;
};

export class Environment {
  #scene: Scene;
  #sunLight: DirectionalLight | null = null;
  #environmentMap: EnvironmentMap = {
    intensity: 0.4,
    texture: null,
  };

  #debug: Debug;
  #debugProperties = {
    DisplayAxesHelper: true,
    DisplayGridHelper: true,
    DisplayLightsHelpers: true,
  };

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#debug = Debug.getInstance();

    this.setupLights();
    this.setupEnvironment();
    this.setupHelpers();
  }

  private setupLights() {
    const ambientLight = new AmbientLight('#ffffff', 1);
    this.#scene.add(ambientLight);

    this.#sunLight = new DirectionalLight('#ffffff', 4);
    this.#sunLight.castShadow = true;
    this.#sunLight.shadow.camera.left = -FRUSTUM;
    this.#sunLight.shadow.camera.right = FRUSTUM;
    this.#sunLight.shadow.camera.top = FRUSTUM / 2;
    this.#sunLight.shadow.camera.bottom = -FRUSTUM / 2;
    this.#sunLight.shadow.camera.far = 1_000;
    this.#sunLight.shadow.mapSize.set(2048, 2048);
    this.#sunLight.shadow.normalBias = 0.05;
    this.#sunLight.position.set(20, 30, 20);

    this.#scene.add(this.#sunLight);
  }

  private setupEnvironment() {
    this.#scene.background = new Color(BACKGROUND_COLOR);

    // this.#environmentMap.intensity = 0.4;
    // this.#environmentMap.texture = this.#resources.assets.environmentMapTexture as CubeTexture;
    // this.#environmentMap.texture.colorSpace = SRGBColorSpace;
    // this.#scene.environment = this.#environmentMap.texture;
    // this.updateMaterial();
  }

  private updateMaterial() {
    this.#scene.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMap = this.#environmentMap.texture;
        child.material.envMapIntensity = this.#environmentMap.intensity;
        child.material.needsUpdate = true;
      }
    });
  }

  private async setupHelpers() {
    if (this.#debug.active) {
      const folderName = 'Environment';
      const guiFolder = this.#debug.gui.addFolder(folderName);

      this.#debugProperties = {
        ...this.#debugProperties,
        ...this.#debug.configFromLocaleStorage?.folders?.[folderName]?.controllers,
      };

      const { AxesHelper, GridHelper } = await import('three');
      const axesHelper = new AxesHelper(5);
      axesHelper.visible = this.#debugProperties.DisplayAxesHelper;
      this.#scene.add(axesHelper);

      guiFolder.add(this.#debugProperties, 'DisplayAxesHelper').onChange((value: boolean) => {
        axesHelper.visible = value;
        this.#debug.save();
      });

      const gridHelper = new GridHelper(100, 100);
      gridHelper.visible = this.#debugProperties.DisplayGridHelper;
      this.#scene.add(gridHelper);

      guiFolder.add(this.#debugProperties, 'DisplayGridHelper').onChange((value: boolean) => {
        gridHelper.visible = value;
        this.#debug.save();
      });

      if (this.#sunLight) {
        const { DirectionalLightHelper } = await import('three');
        const directionalLightHelper = new DirectionalLightHelper(this.#sunLight, 5, 'red');
        directionalLightHelper.visible = this.#debugProperties.DisplayLightsHelpers;
        this.#scene.add(directionalLightHelper);

        guiFolder.add(this.#debugProperties, 'DisplayLightsHelpers').onChange((value: boolean) => {
          directionalLightHelper.visible = value;
          this.#debug.save();
        });
      }
    }
  }
}
