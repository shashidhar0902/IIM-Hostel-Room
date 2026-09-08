import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { BALCONY, DOORS, HALL, ROOM } from "./constants";
import { useMats } from "./MatsContext";

function Wall({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  const m = useMats();
  return (
    <mesh position={position} castShadow receiveShadow material={m.wall}>
      <boxGeometry args={size} />
    </mesh>
  );
}

function CeilingFan() {
  const m = useMats();
  const blades = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (blades.current) blades.current.rotation.y += Math.min(delta, 0.1) * 3.2;
  });
  return (
    <group position={[0.15, ROOM.height - 0.08, -0.35]}>
      <mesh material={m.metal}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
      </mesh>
      <mesh position={[0, -0.12, 0]} material={m.metal}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
      </mesh>
      <group ref={blades} position={[0, -0.24, 0]}>
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          return (
          <mesh key={i} rotation={[0, -angle, 0]} position={[Math.cos(angle) * 0.28, 0, Math.sin(angle) * 0.28]} material={m.darkWood}>
            <boxGeometry args={[0.56, 0.02, 0.12]} />
          </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function Room() {
  const m = useMats();
  const h = ROOM.height;
  const t = ROOM.wall;
  const hy = h / 2;
  const half = ROOM.doorW / 2;
  const roomDepth = ROOM.maxZ - ROOM.minZ;
  const roomWidth = ROOM.maxX - ROOM.minX;
  const balconyCenterX = (BALCONY.minX + BALCONY.maxX) / 2;
  const hallDepth = HALL.maxZ - HALL.minZ;
  const hallWidth = HALL.maxX - HALL.minX;
  const e = DOORS.entranceX;
  const b = DOORS.balconyX;
  const wx = DOORS.windowX;
  const ww = DOORS.windowW;

  const southLeftW = e - half - ROOM.minX;
  const southRightW = ROOM.maxX - (e + half);
  const northLeftW = b - half - ROOM.minX;
  const betweenDoorWin = wx - ww / 2 - (b + half);
  const northRightW = ROOM.maxX - (wx + ww / 2);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (ROOM.minZ + ROOM.maxZ) / 2]} receiveShadow material={m.floor}>
        <planeGeometry args={[roomWidth + 0.3, roomDepth + 0.3]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[(HALL.minX + HALL.maxX) / 2, 0.002, (HALL.minZ + HALL.maxZ) / 2]}
        receiveShadow
        material={m.floorHall}
      >
        <planeGeometry args={[hallWidth + 0.15, hallDepth + 0.15]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[balconyCenterX, 0, (BALCONY.minZ + BALCONY.maxZ) / 2]}
        receiveShadow
        material={m.concrete}
      >
        <planeGeometry args={[BALCONY.maxX - BALCONY.minX + 0.3, BALCONY.maxZ - BALCONY.minZ + 0.2]} />
      </mesh>
      <mesh position={[0, h, (ROOM.minZ + ROOM.maxZ) / 2]} rotation={[Math.PI / 2, 0, 0]} material={m.ceil}>
        <planeGeometry args={[roomWidth + 0.3, roomDepth + 0.3]} />
      </mesh>
      <mesh
        position={[(HALL.minX + HALL.maxX) / 2, h, (HALL.minZ + HALL.maxZ) / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        material={m.ceil}
      >
        <planeGeometry args={[hallWidth + 0.15, hallDepth + 0.15]} />
      </mesh>

      <Wall position={[ROOM.minX - t / 2, hy, (ROOM.minZ + ROOM.maxZ) / 2]} size={[t, h, roomDepth + t]} />
      <Wall position={[ROOM.maxX + t / 2, hy, (ROOM.minZ + ROOM.maxZ) / 2]} size={[t, h, roomDepth + t]} />

      {/* South wall around entrance */}
      <Wall
        position={[ROOM.minX + southLeftW / 2, hy, ROOM.maxZ + t / 2]}
        size={[southLeftW, h, t]}
      />
      <Wall
        position={[e + half + southRightW / 2, hy, ROOM.maxZ + t / 2]}
        size={[southRightW, h, t]}
      />
      <Wall position={[e, h - 0.22, ROOM.maxZ + t / 2]} size={[ROOM.doorW + 0.08, 0.44, t]} />

      {/* North wall: desk side, balcony door, between, window hole, right */}
      <Wall
        position={[ROOM.minX + northLeftW / 2, hy, ROOM.minZ - t / 2]}
        size={[northLeftW, h, t]}
      />
      <Wall position={[b, h - 0.22, ROOM.minZ - t / 2]} size={[ROOM.doorW + 0.08, 0.44, t]} />
      <Wall
        position={[b + half + betweenDoorWin / 2, hy, ROOM.minZ - t / 2]}
        size={[Math.max(0.08, betweenDoorWin), h, t]}
      />
      <Wall position={[wx, h - 0.28, ROOM.minZ - t / 2]} size={[ww + 0.08, 0.56, t]} />
      <Wall
        position={[wx, 0.18, ROOM.minZ - t / 2]}
        size={[ww + 0.08, 0.36, t]}
      />
      <Wall
        position={[wx + ww / 2 + northRightW / 2, hy, ROOM.minZ - t / 2]}
        size={[northRightW, h, t]}
      />

      {/* Hallway */}
      <Wall position={[HALL.minX - t / 2, hy, (HALL.minZ + HALL.maxZ) / 2]} size={[t, h, hallDepth]} />
      <Wall position={[HALL.maxX + t / 2, hy, (HALL.minZ + HALL.maxZ) / 2]} size={[t, h, hallDepth]} />
      <Wall position={[(HALL.minX + HALL.maxX) / 2, hy, HALL.maxZ + t / 2]} size={[hallWidth + t * 2, h, t]} />

      {/* Skirting */}
      <mesh position={[ROOM.minX + 0.03, 0.05, (ROOM.minZ + ROOM.maxZ) / 2]} material={m.linen}>
        <boxGeometry args={[0.04, 0.1, roomDepth - 0.2]} />
      </mesh>
      <mesh position={[ROOM.maxX - 0.03, 0.05, (ROOM.minZ + ROOM.maxZ) / 2]} material={m.linen}>
        <boxGeometry args={[0.04, 0.1, roomDepth - 0.2]} />
      </mesh>

      {/* Window grille + glass */}
      <mesh position={[wx, 1.35, ROOM.minZ - 0.02]} material={m.glass}>
        <planeGeometry args={[ww - 0.08, 1.85]} />
      </mesh>
      {[-0.45, 0, 0.45].map((ox) => (
        <mesh key={ox} position={[wx + ox, 1.35, ROOM.minZ + 0.01]} material={m.metal}>
          <boxGeometry args={[0.018, 1.85, 0.018]} />
        </mesh>
      ))}
      {[0.7, 1.35, 2.0].map((oy) => (
        <mesh key={oy} position={[wx, oy, ROOM.minZ + 0.01]} material={m.metal}>
          <boxGeometry args={[ww - 0.1, 0.016, 0.016]} />
        </mesh>
      ))}

      {/* Curtains */}
      <mesh position={[wx - 0.34, 1.38, ROOM.minZ + 0.08]} material={m.curtain}>
        <planeGeometry args={[0.62, 2.05]} />
      </mesh>
      <mesh position={[wx + 0.34, 1.38, ROOM.minZ + 0.08]} material={m.curtain}>
        <planeGeometry args={[0.62, 2.05]} />
      </mesh>
      <mesh position={[wx, 2.38, ROOM.minZ + 0.1]} rotation={[0, 0, Math.PI / 2]} material={m.metal}>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 8]} />
      </mesh>

      <CeilingFan />
    </group>
  );
}
