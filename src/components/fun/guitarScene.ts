/**
 * Violão em 3D montado só com formas do three.js (sem arquivos de modelo).
 * Recebe o módulo `three` já carregado para que ele só seja baixado
 * quando o card aparece na tela.
 */
import type * as T from "three";

type Three = typeof import("three");
type RoomEnvironmentCtor = typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment;

export type GuitarScene = {
  pluck: (index: number) => void;
  dispose: () => void;
};

// Distância nut → rastilho (escala), em unidades da cena
const NUT_X = -5.0;
const SADDLE_X = 3.5;
const SCALE = SADDLE_X - NUT_X;

const BASE_ROT = { x: -0.42, y: -0.2, z: 0.05 };

export function createGuitarScene(
  THREE: Three,
  RoomEnvironment: RoomEnvironmentCtor,
  container: HTMLElement,
  onPluck: (index: number) => void,
): GuitarScene {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- renderer, cena, câmera, luz ---------------- */

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x241433, 0.8));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.6);
  key.position.set(3, 6, 9);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa855f7, 3.2);
  rim.position.set(-7, -5, -2);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x7c3aed, 2.2);
  rim2.position.set(8, 5, -3);
  scene.add(rim2);

  const textures: T.Texture[] = [];

  /** Textura de madeira procedural (veios horizontais). */
  const wood = (base: string, grain: string, lines: number, repeat: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < lines; i++) {
      const y = Math.random() * 512;
      g.strokeStyle = grain;
      g.globalAlpha = 0.06 + Math.random() * 0.18;
      g.lineWidth = 0.5 + Math.random() * 2.4;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.012 + i) * 3);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.anisotropy = 4;
    textures.push(tex);
    return tex;
  };

  /* ---------------- materiais ---------------- */

  const spruce = new THREE.MeshPhysicalMaterial({
    map: wood("#d29a55", "#8a5527", 160, 0.22),
    roughness: 0.45,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
  });
  const rosewood = new THREE.MeshPhysicalMaterial({
    map: wood("#5a2f17", "#1f0d05", 120, 0.35),
    roughness: 0.45,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  });
  const mahogany = new THREE.MeshStandardMaterial({ map: wood("#6b3d20", "#2a140a", 100, 0.3), roughness: 0.55 });
  const ebony = new THREE.MeshStandardMaterial({ color: 0x1b120c, roughness: 0.65 });
  const headFace = new THREE.MeshPhysicalMaterial({ color: 0x120b08, roughness: 0.3, clearcoat: 1 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.6 });
  const hole = new THREE.MeshBasicMaterial({ color: 0x0a0503 });
  const rosetteDark = new THREE.MeshStandardMaterial({ color: 0x3a2312, roughness: 0.6 });
  const rosetteLight = new THREE.MeshStandardMaterial({ color: 0xd8b07a, roughness: 0.5 });
  const rosetteAccent = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x7c3aed, emissiveIntensity: 0.6 });
  const bone = new THREE.MeshStandardMaterial({ color: 0xf1ead8, roughness: 0.45 });
  const pearl = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.25, metalness: 0.1 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd5d9e0, metalness: 1, roughness: 0.18 });
  const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });

  const guitar = new THREE.Group();

  /* ---------------- corpo ---------------- */

  const outline = new THREE.Shape();
  outline.moveTo(-0.22, 0.45);
  outline.bezierCurveTo(-0.22, 1.2, 0.2, 1.4, 0.75, 1.4);
  outline.bezierCurveTo(1.3, 1.4, 1.42, 1.06, 1.78, 1.06);
  outline.bezierCurveTo(2.14, 1.06, 2.3, 1.8, 3.2, 1.8);
  outline.bezierCurveTo(4.2, 1.8, 4.62, 1.2, 4.62, 0);
  outline.bezierCurveTo(4.62, -1.2, 4.2, -1.8, 3.2, -1.8);
  outline.bezierCurveTo(2.3, -1.8, 2.14, -1.06, 1.78, -1.06);
  outline.bezierCurveTo(1.42, -1.06, 1.3, -1.4, 0.75, -1.4);
  outline.bezierCurveTo(0.2, -1.4, -0.22, -1.2, -0.22, -0.45);
  outline.bezierCurveTo(-0.34, -0.2, -0.34, 0.2, -0.22, 0.45);

  const bodyDepth = 0.85;
  const bodyBevel = 0.07;
  const bodyGeo = new THREE.ExtrudeGeometry(outline, {
    depth: bodyDepth,
    bevelEnabled: true,
    bevelThickness: bodyBevel,
    bevelSize: bodyBevel,
    bevelSegments: 4,
    curveSegments: 64,
  });
  bodyGeo.translate(0, 0, -(bodyDepth + bodyBevel)); // tampo em z = 0
  guitar.add(new THREE.Mesh(bodyGeo, [spruce, rosewood]));

  // boca + roseta (com um anel roxo, assinatura do site)
  const holeX = 1.0;
  const flat = (geo: T.BufferGeometry, mat: T.Material, x: number, z: number) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, 0, z);
    guitar.add(m);
    return m;
  };
  flat(new THREE.CircleGeometry(0.48, 64), hole, holeX, 0.004);
  flat(new THREE.RingGeometry(0.5, 0.67, 64), rosetteDark, holeX, 0.003);
  flat(new THREE.RingGeometry(0.55, 0.6, 64), rosetteLight, holeX, 0.005);
  flat(new THREE.RingGeometry(0.7, 0.725, 64), rosetteAccent, holeX, 0.004);

  // cavalete, rastilho e pinos
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.3, 0.12), darkWood);
  bridge.position.set(SADDLE_X + 0.06, 0, 0.06);
  guitar.add(bridge);
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.05, 0.08), bone);
  saddle.position.set(SADDLE_X, 0, 0.15);
  guitar.add(saddle);

  /* ---------------- braço e escala ---------------- */

  const trapezoid = (x0: number, x1: number, hw0: number, hw1: number) => {
    const s = new THREE.Shape();
    s.moveTo(x0, hw0);
    s.lineTo(x1, hw1);
    s.lineTo(x1, -hw1);
    s.lineTo(x0, -hw0);
    s.closePath();
    return s;
  };

  const neckGeo = new THREE.ExtrudeGeometry(trapezoid(-5.06, -0.15, 0.29, 0.35), {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  neckGeo.translate(0, 0, -0.25);
  guitar.add(new THREE.Mesh(neckGeo, mahogany));

  const boardStart = -5.06;
  const boardEnd = 0.3;
  const hw = (x: number) => 0.27 + ((x - boardStart) / (boardEnd - boardStart)) * (0.37 - 0.27);
  const boardGeo = new THREE.ExtrudeGeometry(trapezoid(boardStart, boardEnd, hw(boardStart), hw(boardEnd)), {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  boardGeo.translate(0, 0, 0.09);
  guitar.add(new THREE.Mesh(boardGeo, ebony));

  // trastes (regra do 12º traste) e marcações
  const fretX: number[] = [NUT_X];
  for (let n = 1; n <= 20; n++) {
    const x = NUT_X + (SCALE - SCALE / Math.pow(2, n / 12));
    if (x > boardEnd - 0.05) break;
    fretX.push(x);
    const fret = new THREE.Mesh(new THREE.BoxGeometry(0.035, hw(x) * 2, 0.035), chrome);
    fret.position.set(x, 0, 0.17);
    guitar.add(fret);
  }
  const dot = new THREE.CircleGeometry(0.05, 24);
  for (const n of [3, 5, 7, 9, 12, 15]) {
    if (!fretX[n]) continue;
    const mid = (fretX[n - 1] + fretX[n]) / 2;
    const ys = n === 12 ? [-0.13, 0.13] : [0];
    for (const y of ys) {
      const d = new THREE.Mesh(dot, pearl);
      d.position.set(mid, y, 0.162);
      guitar.add(d);
    }
  }

  const nut = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.58, 0.12), bone);
  nut.position.set(NUT_X - 0.03, 0, 0.17);
  guitar.add(nut);

  /* ---------------- mão (headstock) e tarraxas ---------------- */

  const head = new THREE.Group();
  head.position.set(NUT_X - 0.06, 0, 0.05);
  head.rotation.y = -0.2; // inclinada para trás
  guitar.add(head);

  const headShape = new THREE.Shape();
  headShape.moveTo(0, 0.31);
  headShape.lineTo(-1.35, 0.46);
  headShape.quadraticCurveTo(-1.62, 0.46, -1.62, 0.2);
  headShape.lineTo(-1.62, -0.2);
  headShape.quadraticCurveTo(-1.62, -0.46, -1.35, -0.46);
  headShape.lineTo(0, -0.31);
  headShape.closePath();
  const headGeo = new THREE.ExtrudeGeometry(headShape, {
    depth: 0.13,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  headGeo.translate(0, 0, -0.1);
  head.add(new THREE.Mesh(headGeo, [headFace, mahogany]));

  const postGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 16);
  postGeo.rotateX(Math.PI / 2);
  const shaftGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.26, 12);
  const buttonGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.035, 20);
  buttonGeo.rotateX(Math.PI / 2);

  const postX = [-0.38, -0.74, -1.1];
  const postLocal: T.Vector3[] = [];
  for (const side of [1, -1]) {
    postX.forEach((x) => {
      const post = new THREE.Mesh(postGeo, chrome);
      post.position.set(x, side * 0.22, 0.09);
      head.add(post);
      const shaft = new THREE.Mesh(shaftGeo, chrome);
      shaft.position.set(x, side * 0.56, -0.02);
      head.add(shaft);
      const button = new THREE.Mesh(buttonGeo, pearl);
      button.position.set(x, side * 0.72, -0.02);
      head.add(button);
    });
  }
  // cordas 0..2 (E, A, D) no lado de cima, da mais longe para a mais perto; 3..5 embaixo
  [2, 1, 0].forEach((p, i) => postLocal[i] = new THREE.Vector3(postX[p], 0.22, 0.15));
  [0, 1, 2].forEach((p, i) => postLocal[3 + i] = new THREE.Vector3(postX[p], -0.22, 0.15));
  head.updateMatrix();

  /* ---------------- cordas ---------------- */

  const Y = new THREE.Vector3(0, 1, 0);
  const cylinderBetween = (a: T.Vector3, b: T.Vector3, radius: number, mat: T.Material) => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const geo = new THREE.CylinderGeometry(radius, radius, dir.length(), 8);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(Y, dir.normalize());
    return mesh;
  };

  type StringState = { mesh: T.Mesh; material: T.MeshStandardMaterial; amp: number };
  const strings: StringState[] = [];
  const hitMeshes: T.Mesh[] = [];
  const radii = [0.026, 0.022, 0.019, 0.016, 0.012, 0.01];

  for (let i = 0; i < 6; i++) {
    const nutPoint = new THREE.Vector3(NUT_X, 0.21 - i * 0.084, 0.235);
    const saddlePoint = new THREE.Vector3(SADDLE_X, 0.34 - i * 0.136, 0.2);
    const wound = i <= 3;
    const material = new THREE.MeshStandardMaterial({
      color: wound ? 0xc9a36a : 0xdfe3ea,
      metalness: 1,
      roughness: wound ? 0.35 : 0.2,
      emissive: 0xa855f7,
      emissiveIntensity: 0,
    });
    const mesh = cylinderBetween(nutPoint, saddlePoint, radii[i], material);
    guitar.add(mesh);
    strings.push({ mesh, material, amp: 0 });

    const hit = cylinderBetween(nutPoint, saddlePoint, 0.075, hitMaterial);
    hit.userData.stringIndex = i;
    guitar.add(hit);
    hitMeshes.push(hit);

    // trecho decorativo nut → tarraxa
    const post = postLocal[i].clone().applyMatrix4(head.matrix);
    guitar.add(cylinderBetween(nutPoint, post, radii[i] * 0.9, material));
  }

  /* ---------------- enquadramento ---------------- */

  const localBox = new THREE.Box3().setFromObject(guitar);
  const center = localBox.getCenter(new THREE.Vector3());
  guitar.position.sub(center);

  const root = new THREE.Group();
  root.add(guitar);
  root.rotation.set(BASE_ROT.x, BASE_ROT.y, BASE_ROT.z);
  scene.add(root);

  const fit = () => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;

    root.rotation.set(BASE_ROT.x, BASE_ROT.y, BASE_ROT.z);
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distV = size.y / 2 / tanV;
    const distH = size.x / 2 / (tanV * camera.aspect);
    camera.position.set(0, 0, Math.max(distV, distH) * 0.98);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  fit();

  /* ---------------- interação ---------------- */

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pressed = false;
  let lastString: number | null = null;
  let prevNdc: T.Vector2 | null = null;
  const tilt = { x: 0, y: 0 };
  const tiltTarget = { x: 0, y: 0 };

  const pluck = (i: number) => {
    onPluck(i);
    strings[i].amp = 1;
  };

  const toNdc = (event: PointerEvent, out: T.Vector2) => {
    const rect = canvas.getBoundingClientRect();
    out.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    return out;
  };

  const stringAt = (point: T.Vector2): number | null => {
    raycaster.setFromCamera(point, camera);
    const hit = raycaster.intersectObjects(hitMeshes, false)[0];
    return hit ? (hit.object.userData.stringIndex as number) : null;
  };

  const onDown = (event: PointerEvent) => {
    pressed = true;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // alguns navegadores recusam a captura; o dedilhado funciona mesmo assim
    }
    canvas.style.cursor = "grabbing";
    const p = toNdc(event, new THREE.Vector2());
    const i = stringAt(p);
    if (i !== null) pluck(i);
    lastString = i;
    prevNdc = p;
  };

  const onMove = (event: PointerEvent) => {
    const p = toNdc(event, ndc.clone());
    tiltTarget.y = p.x * 0.28;
    tiltTarget.x = -p.y * 0.2;
    if (!pressed || !prevNdc) return;
    // amostra o caminho entre os dois eventos para não pular cordas
    const steps = 10;
    const sample = new THREE.Vector2();
    for (let s = 1; s <= steps; s++) {
      sample.lerpVectors(prevNdc, p, s / steps);
      const i = stringAt(sample);
      if (i !== null && i !== lastString) pluck(i);
      if (i !== null) lastString = i;
    }
    prevNdc = p;
  };

  const onUp = () => {
    pressed = false;
    lastString = null;
    prevNdc = null;
    canvas.style.cursor = "grab";
  };

  const onLeave = () => {
    tiltTarget.x = 0;
    tiltTarget.y = 0;
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  /* ---------------- loop ---------------- */

  const timer = new THREE.Timer();
  let raf = 0;
  let visible = false;

  const frame = (time: number) => {
    raf = requestAnimationFrame(frame);
    timer.update(time);
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();

    tilt.x += (tiltTarget.x - tilt.x) * Math.min(1, dt * 6);
    tilt.y += (tiltTarget.y - tilt.y) * Math.min(1, dt * 6);
    const sway = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.035;
    root.rotation.set(BASE_ROT.x + tilt.x, BASE_ROT.y + tilt.y + sway, BASE_ROT.z);
    root.position.y = reducedMotion ? 0 : Math.sin(t * 1.2) * 0.06;

    strings.forEach((s, i) => {
      if (s.amp < 0.001) {
        if (s.amp !== 0) {
          s.amp = 0;
          s.mesh.scale.set(1, 1, 1);
          s.material.emissiveIntensity = 0;
        }
        return;
      }
      s.amp *= Math.exp(-dt * 2.6);
      const wobble = 1 + s.amp * 2.4 * (0.5 + 0.5 * Math.sin(t * 90 + i * 1.7));
      s.mesh.scale.set(wobble, 1, wobble);
      s.material.emissiveIntensity = s.amp * 2.2;
    });

    renderer.render(scene, camera);
  };

  const start = () => {
    if (raf) return;
    timer.reset();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(container);

  const ro = new ResizeObserver(() => {
    fit();
    if (!visible) renderer.render(scene, camera);
  });
  ro.observe(container);

  renderer.render(scene, camera);

  return {
    pluck,
    dispose: () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      scene.traverse((obj) => {
        const mesh = obj as T.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      textures.forEach((tex) => tex.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
