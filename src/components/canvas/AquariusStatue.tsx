import { useEffect, useMemo, useState, type RefObject } from "react";
import {
  AdditiveBlending, BufferGeometry, Float32BufferAttribute, Material, Matrix3, Matrix4, Mesh, ShaderMaterial,
  Vector3, type Group,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import statueUrl from "../../assets/hebe.glb?url";
import type { SharedUniforms } from "./aquariusLayers";
import { STATUE, STATUE_DURATION, STATUE_START, STATUE_Z } from "./aquariusData";
import { statueOccluderFragment, statueOccluderVertex, statuePointVertex } from "./statueShaders";
import { riverFragment } from "./riverShaders";
import { seededRandom } from "./River";

// Bertel Thorvaldsen, Hebe, 1816 (plaster cast KAS 2918), SMK – Statens Museum for Kunst,
// open.smk.dk/artwork/image/KAS2918, Public Domain Mark; 3D scan by SMK.
const DESKTOP_POINTS = 240000;
const MOBILE_POINTS = 36000;

const occluderMaterial = (shared: SharedUniforms, nodeToRoot: Matrix4) =>
  new ShaderMaterial({
    uniforms: {
      uObjectTransform: { value: nodeToRoot },
      uTime: shared.uTime,
      uSettled: shared.uSettled,
      uScrollDissolve: shared.uScrollDissolve,
      uReadyAt: { value: STATUE_START + STATUE_DURATION * 0.75 },
    },
    vertexShader: statueOccluderVertex,
    fragmentShader: statueOccluderFragment,
    colorWrite: false,
    depthWrite: true,
    depthTest: true,
  });

const recomputeQuantizedNormals = (geometry: BufferGeometry) => {
  const position = geometry.getAttribute("position");
  if (!position) return;
  const currentNormal = geometry.getAttribute("normal");
  const normalArray = currentNormal?.array;
  if (currentNormal && !currentNormal.normalized && normalArray instanceof Float32Array) return;

  // BufferAttribute accessors denormalize KHR_mesh_quantization values before copying.
  const decodedPositions = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i++) {
    decodedPositions[i * 3] = position.getX(i);
    decodedPositions[i * 3 + 1] = position.getY(i);
    decodedPositions[i * 3 + 2] = position.getZ(i);
  }
  geometry.setAttribute("position", new Float32BufferAttribute(decodedPositions, 3));
  geometry.deleteAttribute("normal");
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
};

interface StatueSample {
  position: Float32Array;
  normal: Float32Array;
  seed: Float32Array;
  scatter: Float32Array;
  size: Float32Array;
}

// Area-weighted surface sampling in statue-root space.
const sampleStatue = (root: Group, count: number): StatueSample => {
  root.updateMatrixWorld(true);
  const rootInverse = root.matrixWorld.clone().invert();
  const meshes: Mesh[] = [];
  root.traverse((object) => {
    if (object instanceof Mesh && object.geometry.getAttribute("position")) meshes.push(object);
  });
  let triTotal = 0;
  meshes.forEach((mesh) => {
    const geometry = mesh.geometry as BufferGeometry;
    const index = geometry.getIndex();
    triTotal += Math.floor((index ? index.count : geometry.getAttribute("position").count) / 3);
  });
  const tri = new Float32Array(triTotal * 9);
  const triNormal = new Float32Array(triTotal * 9);
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const e1 = new Vector3();
  const e2 = new Vector3();
  const n = new Vector3();
  let t = 0;
  meshes.forEach((mesh) => {
    const geometry = mesh.geometry as BufferGeometry;
    const pos = geometry.getAttribute("position");
    const nor = geometry.getAttribute("normal");
    const index = geometry.getIndex();
    const toRoot = rootInverse.clone().multiply(mesh.matrixWorld);
    const normalToRoot = new Matrix3().getNormalMatrix(toRoot);
    const count = Math.floor((index ? index.count : pos.count) / 3);
    for (let k = 0; k < count; k++, t++) {
      const ids = [0, 1, 2].map((j) => (index ? index.getX(k * 3 + j) : k * 3 + j));
      a.fromBufferAttribute(pos, ids[0]).applyMatrix4(toRoot);
      b.fromBufferAttribute(pos, ids[1]).applyMatrix4(toRoot);
      c.fromBufferAttribute(pos, ids[2]).applyMatrix4(toRoot);
      tri.set([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z], t * 9);
      if (nor) {
        ids.forEach((id, j) => {
          n.fromBufferAttribute(nor, id).applyMatrix3(normalToRoot).normalize();
          triNormal.set([n.x, n.y, n.z], t * 9 + j * 3);
        });
      } else {
        n.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a)).normalize();
        for (let j = 0; j < 3; j++) triNormal.set([n.x, n.y, n.z], t * 9 + j * 3);
      }
    }
  });
  const cumulative = new Float64Array(triTotal);
  let total = 0;
  for (let i = 0; i < triTotal; i++) {
    const o = i * 9;
    a.set(tri[o], tri[o + 1], tri[o + 2]);
    e1.set(tri[o + 3] - a.x, tri[o + 4] - a.y, tri[o + 5] - a.z);
    e2.set(tri[o + 6] - a.x, tri[o + 7] - a.y, tri[o + 8] - a.z);
    total += e1.cross(e2).length() * 0.5;
    cumulative[i] = total;
  }
  const random = seededRandom(2918 + count);
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const scatter = new Float32Array(count * 3);
  const size = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const target = random() * total;
    let lo = 0;
    let hi = triTotal - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const o = lo * 9;
    let u = random();
    let v = random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    for (let k = 0; k < 3; k++) {
      position[i * 3 + k] = tri[o + k] * w + tri[o + 3 + k] * u + tri[o + 6 + k] * v;
      normal[i * 3 + k] = triNormal[o + k] * w + triNormal[o + 3 + k] * u + triNormal[o + 6 + k] * v;
    }
    n.set(normal[i * 3], normal[i * 3 + 1], normal[i * 3 + 2]).normalize();
    normal.set([n.x, n.y, n.z], i * 3);
    seed[i] = random();
    const theta = random() * Math.PI * 2;
    const z = random() * 2 - 1;
    const r = 0.15 + random() * 0.5;
    const s = Math.sqrt(1 - z * z);
    scatter.set([Math.cos(theta) * s * r, z * r + 0.06, Math.sin(theta) * s * r], i * 3);
    size[i] = 1.0 + random() * 0.5;
  }
  return { position, normal, seed, scatter, size };
};

const disposeModel = (root: Group) => {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    meshMaterials.forEach((material: Material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
};

const StatuePoints = ({ sample, shared }: { sample: StatueSample; shared: SharedUniforms }) => {
  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    next.setAttribute("position", new Float32BufferAttribute(sample.position, 3));
    next.setAttribute("aNormal", new Float32BufferAttribute(sample.normal, 3));
    next.setAttribute("aSeed", new Float32BufferAttribute(sample.seed, 1));
    next.setAttribute("aScatter", new Float32BufferAttribute(sample.scatter, 3));
    next.setAttribute("aSize", new Float32BufferAttribute(sample.size, 1));
    return next;
  }, [sample]);
  const uniforms = useMemo(() => ({
    uTime: shared.uTime,
    uSettled: shared.uSettled,
    uHeroDim: shared.uHeroDim,
    uScrollDissolve: shared.uScrollDissolve,
    uPointer: shared.uPointer,
    uPointerStrength: shared.uPointerStrength,
    uAspect: shared.uAspect,
    uDpr: shared.uDpr,
    uAssembleStart: { value: STATUE_START - 0.2 },
    uAssembleDuration: { value: STATUE_DURATION },
  }), [shared]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points frustumCulled={false} renderOrder={1}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        transparent
        depthTest
        depthWrite={false}
        premultipliedAlpha
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={statuePointVertex}
        fragmentShader={riverFragment}
      />
    </points>
  );
};

const AquariusStatue = ({
  shared,
  statueRef,
  onLoaded,
}: {
  shared: SharedUniforms;
  statueRef: RefObject<Group>;
  onLoaded: () => void;
}) => {
  const [model, setModel] = useState<{ root: Group; sample: StatueSample } | null>(null);

  useEffect(() => {
    let active = true;
    let loadedModel: Group | null = null;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(statueUrl, (gltf) => {
      const root = gltf.scene;
      root.updateMatrixWorld(true);
      const rootInverse = root.matrixWorld.clone().invert();
      root.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        recomputeQuantizedNormals(object.geometry);
        const oldMaterials = Array.isArray(object.material) ? object.material : [object.material];
        oldMaterials.forEach((material) => material.dispose());
        const nodeToRoot = rootInverse.clone().multiply(object.matrixWorld);
        object.material = occluderMaterial(shared, nodeToRoot);
        object.renderOrder = -1;
      });
      const sample = sampleStatue(root, window.innerWidth <= 768 ? MOBILE_POINTS : DESKTOP_POINTS);
      if (!active) {
        disposeModel(root);
        return;
      }
      loadedModel = root;
      setModel({ root, sample });
      onLoaded();
    }, undefined, (error) => {
      if (active) console.error("Unable to load the Aquarius statue", error);
    });

    return () => {
      active = false;
      if (loadedModel) disposeModel(loadedModel);
    };
  }, [onLoaded, shared]);

  if (!model) return null;
  return (
    <group ref={statueRef} position={[STATUE.x, STATUE.baseY, STATUE_Z]} rotation-y={STATUE.rotY} scale={STATUE.height}>
      <primitive object={model.root} />
      <StatuePoints sample={model.sample} shared={shared} />
    </group>
  );
};

export default AquariusStatue;