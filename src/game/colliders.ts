import { BALCONY, DOORS, HALL, PLAYER, ROOM } from "./constants";

export type AABB = { minX: number; maxX: number; minZ: number; maxZ: number };

function box(minX: number, maxX: number, minZ: number, maxZ: number): AABB {
  return { minX, maxX, minZ, maxZ };
}

export function worldColliders(open: {
  entranceOpen: boolean;
  balconyOpen: boolean;
}): AABB[] {
  const w = ROOM.wall;
  const half = ROOM.doorW / 2;
  const e0 = DOORS.entranceX - half;
  const e1 = DOORS.entranceX + half;
  const b0 = DOORS.balconyX - half;
  const b1 = DOORS.balconyX + half;
  const walls: AABB[] = [
    box(ROOM.minX - w, ROOM.minX, ROOM.minZ, ROOM.maxZ),
    box(ROOM.maxX, ROOM.maxX + w, ROOM.minZ, ROOM.maxZ),
    box(ROOM.minX - w, e0, ROOM.maxZ, ROOM.maxZ + w),
    box(e1, ROOM.maxX + w, ROOM.maxZ, ROOM.maxZ + w),
    box(ROOM.minX - w, b0, ROOM.minZ - w, ROOM.minZ),
    box(b1, ROOM.maxX + w, ROOM.minZ - w, ROOM.minZ),
    box(HALL.minX - w, HALL.minX, HALL.minZ, HALL.maxZ),
    box(HALL.maxX, HALL.maxX + w, HALL.minZ, HALL.maxZ),
    box(HALL.minX - w, HALL.maxX + w, HALL.maxZ, HALL.maxZ + w),
    box(BALCONY.minX - w, BALCONY.minX, BALCONY.minZ, BALCONY.maxZ),
    box(BALCONY.maxX, BALCONY.maxX + w, BALCONY.minZ, BALCONY.maxZ),
    box(BALCONY.minX - w, BALCONY.maxX + w, BALCONY.minZ - w, BALCONY.minZ),
    box(-2.13, -1.5, -1.64, -0.36), // desk
    box(0.78, 1.78, -2.7, -0.72), // bed
    box(1.9, 2.5, -0.25, 1.35), // wardrobe
    box(-2.2, -1.85, -2.25, -1.85), // bucket
  ];
  if (!open.entranceOpen) {
    walls.push(box(e0 + 0.04, e1 - 0.04, ROOM.maxZ - 0.08, ROOM.maxZ + 0.08));
  }
  if (!open.balconyOpen) {
    walls.push(box(b0 + 0.04, b1 - 0.04, ROOM.minZ - 0.08, ROOM.minZ + 0.08));
  }
  return walls;
}

export function resolveCircle(
  x: number,
  z: number,
  boxes: AABB[],
  radius = PLAYER.radius,
): { x: number; z: number } {
  for (const b of boxes) {
    const cx = Math.max(b.minX, Math.min(x, b.maxX));
    const cz = Math.max(b.minZ, Math.min(z, b.maxZ));
    let dx = x - cx;
    let dz = z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 === 0) {
      const left = x - b.minX;
      const right = b.maxX - x;
      const down = z - b.minZ;
      const up = b.maxZ - z;
      const m = Math.min(left, right, down, up);
      if (m === left) x = b.minX - radius;
      else if (m === right) x = b.maxX + radius;
      else if (m === down) z = b.minZ - radius;
      else z = b.maxZ + radius;
      continue;
    }
    if (d2 < radius * radius) {
      const d = Math.sqrt(d2);
      const k = (radius - d) / d;
      x += dx * k;
      z += dz * k;
    }
  }
  return { x, z };
}
