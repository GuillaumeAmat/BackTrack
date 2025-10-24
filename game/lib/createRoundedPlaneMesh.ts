import {
  type BufferGeometry,
  DoubleSide,
  ExtrudeGeometry,
  type Material,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
} from 'three';

type Options = {
  extrusionDepth?: number;
  material?: Material;
  width: number;
  height: number;
  radius: number;
  wireframe: boolean;
};

type ProvidedOptions = Partial<Options>;

const defaultOptions: Options = {
  wireframe: false,
  width: 1,
  height: 1,
  radius: 0.2,
};

/**
 * Creates a Three.js mesh from a plane with border radius.
 *
 * You can choose to extrude the shape by providing an extrusion depth.
 * If no extrusion depth is provided, the shapes will be flat.
 */
export function createRoundedPlaneMesh(
  width: number,
  height: number,
  radius: number,
  providedOptions?: ProvidedOptions,
) {
  const options: Options = {
    ...defaultOptions,
    ...providedOptions,
  };

  const x = 0;
  const y = 0;

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

  let geometry: BufferGeometry;

  if (options.extrusionDepth) {
    geometry = new ExtrudeGeometry([shape], {
      depth: options.extrusionDepth,
      bevelEnabled: false,
      curveSegments: 32,
    });
  } else {
    geometry = new ShapeGeometry([shape], 32);
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
