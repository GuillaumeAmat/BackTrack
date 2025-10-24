import {
  type BufferGeometry,
  DoubleSide,
  ExtrudeGeometry,
  type Material,
  Mesh,
  MeshBasicMaterial,
  ShapeGeometry,
} from 'three';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';

type Options = {
  extrusionDepth?: number;
  material?: Material;
  size: number;
  wireframe: boolean;
};

type ProvidedOptions = Partial<Options>;

const defaultOptions: Options = {
  wireframe: false,
  size: 1,
};

/**
 * Creates a Three.js mesh from a string and a font.
 *
 * You can choose to extrude the shapes by providing an extrusion depth.
 * If no extrusion depth is provided, the shapes will be flat.
 */
export function createTextMesh(text: string, font: Font, providedOptions?: ProvidedOptions) {
  const options: Options = {
    ...defaultOptions,
    ...providedOptions,
  };

  const shapes = font.generateShapes(text, options.size);

  let geometry: BufferGeometry;

  if (options.extrusionDepth) {
    geometry = new ExtrudeGeometry(shapes, {
      depth: options.extrusionDepth,
      bevelEnabled: false,
      curveSegments: 32,
    });
  } else {
    geometry = new ShapeGeometry(shapes, 32);
  }

  geometry.computeBoundingBox();

  if (geometry.boundingBox) {
    const xCenter = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    const yCenter = -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);

    geometry.translate(xCenter, yCenter, 0);
  }

  const material = options.material
    ? options.material
    : new MeshBasicMaterial({
        color: '#ffffff',
        side: DoubleSide,
        depthWrite: false,
        wireframe: options.wireframe,
      });

  return new Mesh(geometry, material);
}
