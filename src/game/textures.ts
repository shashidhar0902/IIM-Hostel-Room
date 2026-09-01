import { useEffect, useMemo } from "react";
import * as THREE from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d");
  return { c, g };
}

function tex(c: HTMLCanvasElement, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function noiseFill(color: string, speckle: string) {
  const { c, g } = canvas(256, 256);
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = speckle;
  for (let i = 0; i < 1400; i++) {
    g.globalAlpha = 0.04 + Math.random() * 0.08;
    g.fillRect(Math.random() * 256, Math.random() * 256, 1.2, 1.2);
  }
  g.globalAlpha = 1;
  return tex(c, 2);
}

function tiles() {
  const { c, g } = canvas(512, 512);
  g.fillStyle = "#d8d2c6";
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#c4bdb0";
  g.lineWidth = 3;
  for (let i = 0; i <= 512; i += 128) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i, 512);
    g.moveTo(0, i);
    g.lineTo(512, i);
    g.stroke();
  }
  g.fillStyle = "#efeae0";
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      g.globalAlpha = 0.25;
      g.fillRect(x * 128 + 6, y * 128 + 6, 116, 116);
    }
  }
  g.globalAlpha = 1;
  return tex(c, 6);
}

function felt() {
  const { c, g } = canvas(256, 256);
  g.fillStyle = "#8d939a";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 4000; i++) {
    g.fillStyle = i % 3 === 0 ? "#9aa0a6" : "#7c8288";
    g.globalAlpha = 0.15;
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  g.globalAlpha = 1;
  return tex(c, 2);
}

function curtain() {
  const { c, g } = canvas(256, 512);
  const grd = g.createLinearGradient(0, 0, 0, 512);
  grd.addColorStop(0, "#3d6a78");
  grd.addColorStop(0.45, "#2f5c6a");
  grd.addColorStop(1, "#1c3340");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 512);
  g.globalAlpha = 0.22;
  g.fillStyle = "#d5e6ea";
  for (let i = 0; i < 18; i++) {
    const x = 20 + (i % 6) * 38;
    const y = 30 + Math.floor(i / 6) * 90;
    g.beginPath();
    g.ellipse(x, y, 16, 28, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  return tex(c, 1);
}

function sheet() {
  const { c, g } = canvas(256, 256);
  g.fillStyle = "#9eb8c8";
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "#5d7a8a";
  g.lineWidth = 2;
  for (let y = 8; y < 256; y += 22) {
    for (let x = 8; x < 256; x += 22) {
      g.strokeRect(x, y, 14, 14);
      g.beginPath();
      g.moveTo(x + 7, y);
      g.lineTo(x + 7, y + 14);
      g.moveTo(x, y + 7);
      g.lineTo(x + 14, y + 7);
      g.stroke();
    }
  }
  return tex(c, 2);
}

function folkRug() {
  const { c, g } = canvas(256, 512);
  g.fillStyle = "#1f4a38";
  g.fillRect(0, 0, 256, 512);
  g.fillStyle = "#e8e0c8";
  const tree = (x: number, y: number, s: number) => {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - 18 * s, y + 40 * s);
    g.lineTo(x + 18 * s, y + 40 * s);
    g.closePath();
    g.fill();
    g.fillRect(x - 3 * s, y + 40 * s, 6 * s, 14 * s);
  };
  tree(70, 40, 1.1);
  tree(186, 70, 0.9);
  tree(80, 160, 1);
  tree(190, 200, 1.15);
  tree(70, 300, 0.95);
  tree(180, 340, 1.05);
  g.beginPath();
  g.ellipse(128, 455, 22, 12, 0, 0, Math.PI * 2);
  g.fill();
  g.fillRect(120, 455, 16, 28);
  g.fillRect(8, 8, 240, 6);
  g.fillRect(8, 498, 240, 6);
  return tex(c, 1);
}

function field() {
  const { c, g } = canvas(1024, 512);
  const sky = g.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, "#7ec4ef");
  sky.addColorStop(1, "#cfe8f6");
  g.fillStyle = sky;
  g.fillRect(0, 0, 1024, 280);
  g.fillStyle = "#d8c49a";
  g.fillRect(0, 280, 1024, 80);
  g.fillStyle = "#7a9a4a";
  g.fillRect(0, 330, 1024, 182);
  g.fillStyle = "#6b8c3e";
  g.fillRect(180, 300, 660, 90);
  g.strokeStyle = "#cfc8b8";
  g.lineWidth = 2;
  g.strokeRect(200, 310, 620, 70);
  g.fillStyle = "#e8e4dc";
  g.fillRect(40, 160, 160, 200);
  g.fillRect(820, 150, 150, 210);
  g.fillStyle = "#d4cfc6";
  g.fillRect(55, 175, 40, 50);
  g.fillRect(110, 175, 40, 50);
  g.fillRect(55, 240, 40, 50);
  g.fillRect(845, 170, 36, 46);
  g.fillRect(890, 170, 36, 46);
  g.fillStyle = "#2f4a28";
  for (let i = 0; i < 9; i++) {
    const x = 90 + i * 100;
    g.beginPath();
    g.arc(x, 355, 28 + (i % 3) * 8, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "#6a6a68";
  g.fillRect(508, 120, 6, 200);
  g.fillRect(492, 118, 38, 8);
  return tex(c, 1);
}

function sky() {
  const { c, g } = canvas(8, 256);
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, "#5eb0e0");
  grd.addColorStop(0.45, "#a8d6f0");
  grd.addColorStop(1, "#e7e2d4");
  g.fillStyle = grd;
  g.fillRect(0, 0, 8, 256);
  const t = tex(c, 1);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.repeat.set(1, 1);
  return t;
}

function whiteboard() {
  const { c, g } = canvas(256, 320);
  g.fillStyle = "#eef3f6";
  g.fillRect(0, 0, 256, 320);
  g.strokeStyle = "#3a6a8a";
  g.lineWidth = 2;
  g.strokeRect(8, 8, 240, 304);
  g.fillStyle = "#2c4a5c";
  g.font = "16px ui-sans-serif, sans-serif";
  g.fillText("notes", 24, 40);
  g.strokeStyle = "#6a8aa0";
  g.beginPath();
  g.moveTo(24, 70);
  g.lineTo(200, 78);
  g.moveTo(24, 100);
  g.lineTo(180, 92);
  g.moveTo(24, 130);
  g.lineTo(210, 140);
  g.stroke();
  return tex(c, 1);
}

export type Mats = {
  wall: THREE.MeshStandardMaterial;
  wallHall: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  floorHall: THREE.MeshStandardMaterial;
  ceil: THREE.MeshStandardMaterial;
  darkWood: THREE.MeshStandardMaterial;
  lightWood: THREE.MeshStandardMaterial;
  linen: THREE.MeshStandardMaterial;
  duvet: THREE.MeshStandardMaterial;
  pillow: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  black: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  plant: THREE.MeshStandardMaterial;
  pot: THREE.MeshStandardMaterial;
  rug: THREE.MeshStandardMaterial;
  city: THREE.MeshBasicMaterial;
  art: THREE.MeshStandardMaterial;
  sky: THREE.MeshBasicMaterial;
  concrete: THREE.MeshStandardMaterial;
  lampShade: THREE.MeshStandardMaterial;
  screen: THREE.MeshBasicMaterial;
  felt: THREE.MeshStandardMaterial;
  curtain: THREE.MeshStandardMaterial;
  desk: THREE.MeshStandardMaterial;
  door: THREE.MeshStandardMaterial;
  screenTex: THREE.CanvasTexture;
  screenCanvas: HTMLCanvasElement;
  screenCtx: CanvasRenderingContext2D;
  dispose: () => void;
};

export function createMaterials(): Mats {
  const tileMap = tiles();
  const plaster = noiseFill("#efe8dc", "#c8bba8");
  const hallPlaster = noiseFill("#efe8dc", "#c8bba8");
  const linenMap = noiseFill("#e6ddd0", "#8a7c6c");
  const sheetMap = sheet();
  const rugMap = folkRug();
  const fieldMap = field();
  const artMap = whiteboard();
  const skyMap = sky();
  const feltMap = felt();
  const curtainMap = curtain();
  const { c: sc, g: sg } = canvas(512, 320);
  const screenTex = tex(sc, 1);
  screenTex.wrapS = screenTex.wrapT = THREE.ClampToEdgeWrapping;
  screenTex.repeat.set(1, 1);

  const wall = new THREE.MeshStandardMaterial({ map: plaster, roughness: 0.92, color: "#f3eee6" });
  const wallHall = new THREE.MeshStandardMaterial({ map: hallPlaster, roughness: 0.9, color: "#f3eee6" });
  const floor = new THREE.MeshStandardMaterial({ map: tileMap, roughness: 0.28, metalness: 0.08 });
  const floorHall = new THREE.MeshStandardMaterial({ map: tileMap, roughness: 0.3 });
  const ceil = new THREE.MeshStandardMaterial({ color: "#f6f1e8", roughness: 0.95 });
  const darkWood = new THREE.MeshStandardMaterial({ color: "#5a3a32", roughness: 0.7 });
  const lightWood = new THREE.MeshStandardMaterial({ color: "#c4a078", roughness: 0.65 });
  const linen = new THREE.MeshStandardMaterial({ map: linenMap, roughness: 0.9 });
  const duvet = new THREE.MeshStandardMaterial({ map: sheetMap, roughness: 0.88 });
  const pillow = new THREE.MeshStandardMaterial({ color: "#c45a48", roughness: 0.85 });
  const metal = new THREE.MeshStandardMaterial({ color: "#c5c8cc", roughness: 0.35, metalness: 0.65 });
  const black = new THREE.MeshStandardMaterial({ color: "#1a1c20", roughness: 0.4, metalness: 0.3 });
  const glass = new THREE.MeshStandardMaterial({
    color: "#c5d8e6",
    transparent: true,
    opacity: 0.28,
    roughness: 0.08,
    metalness: 0.12,
    depthWrite: false,
  });
  const plant = new THREE.MeshStandardMaterial({ color: "#3d6a40", roughness: 0.7 });
  const pot = new THREE.MeshStandardMaterial({ color: "#d2b48c", roughness: 0.8 });
  const rugMat = new THREE.MeshStandardMaterial({ map: rugMap, roughness: 0.95 });
  const cityMat = new THREE.MeshBasicMaterial({ map: fieldMap });
  const art = new THREE.MeshStandardMaterial({ map: artMap, roughness: 0.8 });
  const skyMat = new THREE.MeshBasicMaterial({ map: skyMap, side: THREE.BackSide, depthWrite: false });
  const concrete = new THREE.MeshStandardMaterial({ color: "#c8c2b8", roughness: 0.9 });
  const lampShade = new THREE.MeshStandardMaterial({
    color: "#f4e2a8",
    emissive: "#f0d078",
    emissiveIntensity: 0.55,
    roughness: 0.6,
  });
  const screen = new THREE.MeshBasicMaterial({ map: screenTex });
  const feltMat = new THREE.MeshStandardMaterial({ map: feltMap, roughness: 0.95, color: "#9aa0a6" });
  const curtainMat = new THREE.MeshStandardMaterial({
    map: curtainMap,
    roughness: 0.9,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const desk = new THREE.MeshStandardMaterial({ color: "#b7bcc2", roughness: 0.55 });
  const door = new THREE.MeshStandardMaterial({ color: "#4a302c", roughness: 0.72 });

  const maps = [tileMap, plaster, hallPlaster, linenMap, sheetMap, rugMap, fieldMap, artMap, skyMap, feltMap, curtainMap, screenTex];
  const mats = [
    wall, wallHall, floor, floorHall, ceil, darkWood, lightWood, linen, duvet, pillow, metal, black, glass, plant, pot,
    rugMat, cityMat, art, skyMat, concrete, lampShade, screen, feltMat, curtainMat, desk, door,
  ];

  return {
    wall, wallHall, floor, floorHall, ceil, darkWood, lightWood, linen, duvet, pillow, metal, black, glass, plant, pot,
    rug: rugMat, city: cityMat, art, sky: skyMat, concrete, lampShade, screen, felt: feltMat, curtain: curtainMat, desk, door,
    screenTex, screenCanvas: sc, screenCtx: sg,
    dispose() {
      for (const m of maps) m.dispose();
      for (const m of mats) m.dispose();
    },
  };
}

const CODE = [
  "notes.md",
  "",
  "practice, then the field.",
  "keys on the left, laptop right.",
  "blue curtains, green rug.",
  "",
  "sit. work. look out.",
];

export function paintLaptop(ctx: CanvasRenderingContext2D, texMap: THREE.CanvasTexture, t: number, working: boolean) {
  const w = 512;
  const h = 320;
  ctx.fillStyle = "#1a2330";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#243044";
  ctx.fillRect(0, 0, 44, h);
  ctx.fillStyle = "#e7eef4";
  ctx.font = "600 22px ui-sans-serif, sans-serif";
  ctx.fillText("Haven", 64, 42);
  ctx.font = "16px ui-monospace, monospace";
  const typed = working ? Math.min(CODE.length, 2 + Math.floor((t * 1.4) % (CODE.length + 2))) : CODE.length;
  for (let i = 0; i < typed && i < CODE.length; i++) {
    ctx.fillStyle = i === 0 ? "#e7eef4" : "#9ec4b0";
    ctx.fillText(CODE[i] ?? "", 64, 84 + i * 28);
  }
  if (working && Math.sin(t * 6) > 0) {
    ctx.fillStyle = "#e7eef4";
    ctx.fillRect(64, 84 + Math.min(typed, CODE.length - 1) * 28 + 4, 10, 16);
  }
  ctx.fillStyle = "#2a3544";
  ctx.fillRect(0, h - 28, w, 28);
  ctx.fillStyle = "#8aa0b0";
  ctx.font = "13px ui-sans-serif, sans-serif";
  ctx.fillText(working ? "editing · notes.md" : "idle", 16, h - 10);
  texMap.needsUpdate = true;
}

export function useMaterials(): Mats {
  const mats = useMemo(() => createMaterials(), []);
  useEffect(() => () => mats.dispose(), [mats]);
  return mats;
}
