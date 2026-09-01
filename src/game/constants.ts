export const ROOM = {
  minX: -2.25,
  maxX: 2.45,
  minZ: -3.2,
  maxZ: 2.1,
  height: 2.78,
  wall: 0.12,
  doorW: 0.9,
} as const;

export const DOORS = {
  entranceX: -0.9,
  balconyX: -0.22,
  windowX: 1.28,
  windowW: 1.42,
} as const;

export const HALL = {
  minX: -1.45,
  maxX: -0.35,
  minZ: 2.1,
  maxZ: 4.05,
} as const;

export const BALCONY = {
  minX: -1.55,
  maxX: 1.6,
  minZ: -5.55,
  maxZ: -3.2,
} as const;

export const SPAWN = {
  x: -0.9,
  y: 0,
  z: 3.25,
} as const;

export const PLAYER = {
  radius: 0.26,
  eye: 1.62,
  sitEye: 1.14,
  bedEye: 0.9,
  walk: 2.85,
  sprint: 4.55,
  accel: 14,
  jump: 4.4,
  gravity: 16,
  mouse: 0.0022,
} as const;

export const SPOTS = {
  bed: { x: 1.28, z: -1.35, r: 0.95 },
  desk: { x: -1.32, z: -1.82, r: 0.95 },
  balconyChair: { x: 0.15, z: -4.95, r: 0.95 },
  entrance: { x: -0.9, z: 2.1, r: 1.05 },
  balconyDoor: { x: -0.22, z: -3.15, r: 1.05 },
  lamp: { x: -1.35, z: -2.45, r: 0.9 },
} as const;

export const SIT = {
  bed: { x: 1.28, y: 0.82, z: -1.52, yaw: 0.35, pitch: -0.06 },
  desk: { x: -1.32, y: 1.12, z: -1.9, yaw: 0, pitch: 0.22 },
  balconyChair: { x: 0.12, y: 1.22, z: -5.05, yaw: 0.02, pitch: -0.1 },
} as const;
