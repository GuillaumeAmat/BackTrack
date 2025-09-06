import {
  type BufferGeometry,
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShapeGeometry,
  type Material,
} from 'three';
import { SVGLoader, type SVGResult } from 'three/examples/jsm/loaders/SVGLoader.js';

type Options = {
  extrusionDepth?: number;
  material?: Material;
  scale: number;
  wireframe: boolean;
};

type ProvidedOptions = Partial<Options>;

const defaultOptions: Options = {
  wireframe: false,
  scale: 1,
};

/**
 * Creates a Three.js mesh from SVG data.
 *
 * By default, the mesh fill & stroke colors are taken from the SVG,
 * but you can provide a material to override the fill color.
 *
 * You can also choose to extrude the shapes by providing an extrusion depth.
 * If no extrusion depth is provided, the shapes will be flat.
 */
export function createMeshFromSVG(svgData: SVGResult, providedOptions?: ProvidedOptions) {
  const options: Options = {
    ...defaultOptions,
    ...providedOptions,
  };

  const group = new Group();

  group.scale.multiplyScalar(options.scale);
  group.rotation.x = -Math.PI / 2;
  group.position.x = 0;
  group.position.z = 0;
  group.position.y = 0;

  svgData.paths.forEach((path) => {
    const fillColor = path.userData?.style.fill;

    if (path.userData && fillColor !== undefined && fillColor !== 'none') {
      const material = options.material
        ? options.material
        : new MeshBasicMaterial({
            color: new Color().setStyle(fillColor),
            opacity: path.userData.style.fillOpacity,
            transparent: path.userData.style.fillOpacity < 1,
            side: DoubleSide,
            depthWrite: false,
            wireframe: options.wireframe,
          });

      const shapes = SVGLoader.createShapes(path);

      shapes.forEach((shape) => {
        let geometry: BufferGeometry;

        if (options.extrusionDepth) {
          geometry = new ExtrudeGeometry(shape, {
            depth: options.extrusionDepth,
            bevelEnabled: false,
          });
        } else {
          geometry = new ShapeGeometry(shape);
        }

        const mesh = new Mesh(geometry, material);

        group.add(mesh);
      });
    }

    const strokeColor = path.userData?.style.stroke;

    if (path.userData && strokeColor !== undefined && strokeColor !== 'none') {
      const material = new MeshBasicMaterial({
        color: new Color().setStyle(strokeColor),
        opacity: path.userData.style.strokeOpacity,
        transparent: path.userData.style.strokeOpacity < 1,
        side: DoubleSide,
        depthWrite: false,
        wireframe: options.wireframe,
      });

      path.subPaths.forEach((subPath) => {
        const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData!.style);

        if (geometry) {
          const mesh = new Mesh(geometry, material);

          group.add(mesh);
        }
      });
    }
  });

  return group;
}
