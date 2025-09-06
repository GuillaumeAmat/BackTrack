import { type CubeTexture, type Texture, type CubeTextureLoader, EventDispatcher, type TextureLoader } from 'three';
import type { Font, FontLoader } from 'three/addons/loaders/FontLoader.js';
import type { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { SVGResult, SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

type AssetName = string;
type Asset =
  | {
      type: 'audio' | 'font' | 'gltf' | 'svg' | 'texture';
      path: string;
    }
  | {
      type: 'cubeTexture';
      path: string[];
    };

type Assets = Record<AssetName, HTMLAudioElement | Font | GLTF | SVGResult | Texture | CubeTexture>;
type AssetsToLoad = Record<AssetName, Asset>;

type LoadedEvent = {
  type: 'loaded';
  name: AssetName;
};

type ReadyEvent = {
  type: 'ready';
};

type ResourcesEvents = {
  loaded: LoadedEvent;
  ready: ReadyEvent;
};

export class Resources extends EventDispatcher<ResourcesEvents> {
  static #instance: Resources;

  #assets: Assets = {};
  #assetsToLoad: AssetsToLoad = {};

  #fontLoader: FontLoader | null = null;
  #gltfLoader: GLTFLoader | null = null;
  #svgLoader: SVGLoader | null = null;
  #textureLoader: TextureLoader | null = null;
  #cubeTextureLoader: CubeTextureLoader | null = null;

  get assets() {
    return this.#assets;
  }

  constructor(assets: AssetsToLoad) {
    super();

    Resources.#instance = this;

    this.#assetsToLoad = assets;

    this.loadAssets();
  }

  static getInstance() {
    return Resources.#instance;
  }

  private async loadAssets() {
    const assetsToLoad = Object.values(this.#assetsToLoad);
    const hasFonts = assetsToLoad.some((asset) => asset.type === 'font');
    const hasGLTF = assetsToLoad.some((asset) => asset.type === 'gltf');
    const hasSVGs = assetsToLoad.some((asset) => asset.type === 'svg');
    const hasTextures = assetsToLoad.some((asset) => asset.type === 'texture');
    const hasCubeTextures = assetsToLoad.some((asset) => asset.type === 'cubeTexture');

    if (hasFonts && !this.#fontLoader) {
      const { FontLoader } = await import('three/addons/loaders/FontLoader.js');
      this.#fontLoader = new FontLoader();
    }

    if (hasGLTF && !this.#gltfLoader) {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      this.#gltfLoader = new GLTFLoader();
    }

    if (hasSVGs && !this.#svgLoader) {
      const { SVGLoader } = await import('three/examples/jsm/loaders/SVGLoader.js');
      this.#svgLoader = new SVGLoader();
    }

    if (hasTextures && !this.#textureLoader) {
      const { TextureLoader } = await import('three');
      this.#textureLoader = new TextureLoader();
    }

    if (hasCubeTextures && !this.#cubeTextureLoader) {
      const { CubeTextureLoader } = await import('three');
      this.#cubeTextureLoader = new CubeTextureLoader();
    }

    Object.entries(this.#assetsToLoad).forEach(([assetName, asset]) => {
      if (asset.type === 'audio') {
        this.onAssetLoaded(assetName, new Audio(asset.path));
      } else if (asset.type === 'font') {
        this.#fontLoader?.load(asset.path, (file) => {
          this.onAssetLoaded(assetName, file);
        });
      } else if (asset.type === 'gltf') {
        this.#gltfLoader?.load(asset.path, (file) => {
          this.onAssetLoaded(assetName, file);
        });
      } else if (asset.type === 'svg') {
        this.#svgLoader?.load(asset.path, (file) => {
          this.onAssetLoaded(assetName, file);
        });
      } else if (asset.type === 'texture') {
        this.#textureLoader?.load(asset.path, (file) => {
          this.onAssetLoaded(assetName, file);
        });
      } else if (asset.type === 'cubeTexture') {
        this.#cubeTextureLoader?.load(asset.path, (file) => {
          this.onAssetLoaded(assetName, file);
        });
      }
    });
  }

  private onAssetLoaded(name: AssetName, file: HTMLAudioElement | Font | GLTF | SVGResult | Texture | CubeTexture) {
    this.#assets[name] = file;

    this.dispatchEvent({ type: 'loaded', name });

    if (Object.keys(this.#assets).length === Object.keys(this.#assetsToLoad).length) {
      setTimeout(() => {
        this.dispatchEvent({ type: 'ready' });
      }, 0);
    }
  }

  public getAudioAsset(name: string) {
    return this.#assets[name] as HTMLAudioElement;
  }

  public getFontAsset(name: string) {
    return this.#assets[name] as Font;
  }

  public getGLTFAsset(name: string) {
    return this.#assets[name] as GLTF;
  }

  public getSVGAsset(name: string) {
    return this.#assets[name] as SVGResult;
  }

  public getTextureAsset(name: string) {
    return this.#assets[name] as Texture;
  }

  public getCubeTextureAsset(name: string) {
    return this.#assets[name] as CubeTexture;
  }
}
