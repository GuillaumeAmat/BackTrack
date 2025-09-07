import { Mesh, PlaneGeometry, ShaderMaterial, type Scene } from 'three';
import { gsap } from 'gsap';
import { BACKGROUND_COLOR_R, BACKGROUND_COLOR_G, BACKGROUND_COLOR_B } from '../constants';

export class LoadingOverlay {
  #scene: Scene;
  #geometry: PlaneGeometry;
  #material: ShaderMaterial;
  #mesh: Mesh;

  constructor(scene: Scene) {
    this.#scene = scene;

    this.#geometry = new PlaneGeometry(2, 2, 1, 1);

    this.#material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: {
          value: 1,
        },
      },
      vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
      `,
      fragmentShader: `
      uniform float uAlpha;

      void main() {
        gl_FragColor = vec4(${BACKGROUND_COLOR_R}.0, ${BACKGROUND_COLOR_G}.0, ${BACKGROUND_COLOR_B}.0, uAlpha);
      }
      `,
    });

    this.#mesh = new Mesh(this.#geometry, this.#material);
    this.#scene.add(this.#mesh);
  }

  public hide() {
    if (this.#material.uniforms.uAlpha) {
      gsap.to(this.#material.uniforms.uAlpha, {
        value: 0,
        duration: 2,
      });
    }
  }

  public update() {}
}
