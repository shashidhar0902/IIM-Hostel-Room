import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { DOORS, ROOM } from "./constants";
import { useMats } from "./MatsContext";
import { useGame } from "./store";

function DoorPanel({
  width,
  height,
  clothes = false,
}: {
  width: number;
  height: number;
  clothes?: boolean;
}) {
  const m = useMats();
  return (
    <group>
      <mesh position={[width / 2, height / 2, 0]} castShadow material={m.door}>
        <boxGeometry args={[width, height, 0.05]} />
      </mesh>
      <mesh position={[width - 0.08, height / 2, 0.03]} material={m.metal}>
        <sphereGeometry args={[0.028, 10, 8]} />
      </mesh>
      {clothes && (
        <group position={[width * 0.45, height * 0.72, 0.04]}>
          <mesh position={[-0.12, -0.18, 0]} material={m.black}>
            <boxGeometry args={[0.16, 0.55, 0.04]} />
          </mesh>
          <mesh position={[0.08, -0.12, 0.02]}>
            <boxGeometry args={[0.18, 0.48, 0.04]} />
            <meshStandardMaterial color="#2a6a8a" roughness={0.85} />
          </mesh>
          <mesh position={[0.22, -0.22, 0.01]}>
            <boxGeometry args={[0.14, 0.4, 0.03]} />
            <meshStandardMaterial color="#3d4a38" roughness={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function Doors() {
  const m = useMats();
  const entrance = useRef<THREE.Group>(null);
  const balcony = useRef<THREE.Group>(null);
  const half = ROOM.doorW / 2;
  const h = 2.35;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const k = 1 - Math.exp(-8 * dt);
    const s = useGame.getState();
    if (entrance.current) {
      const target = s.entranceOpen ? 1.85 : 0;
      entrance.current.rotation.y += (target - entrance.current.rotation.y) * k;
    }
    if (balcony.current) {
      const target = s.balconyOpen ? -1.85 : 0;
      balcony.current.rotation.y += (target - balcony.current.rotation.y) * k;
    }
  });

  return (
    <group>
      <mesh position={[DOORS.entranceX - half - 0.05, h / 2, ROOM.maxZ]} material={m.door}>
        <boxGeometry args={[0.08, h, 0.12]} />
      </mesh>
      <mesh position={[DOORS.entranceX + half + 0.05, h / 2, ROOM.maxZ]} material={m.door}>
        <boxGeometry args={[0.08, h, 0.12]} />
      </mesh>
      <mesh position={[DOORS.entranceX, h + 0.04, ROOM.maxZ]} material={m.door}>
        <boxGeometry args={[ROOM.doorW + 0.16, 0.08, 0.12]} />
      </mesh>
      <group ref={entrance} position={[DOORS.entranceX - half, 0, ROOM.maxZ]}>
        <DoorPanel width={ROOM.doorW - 0.04} height={h} clothes />
      </group>

      <mesh position={[DOORS.balconyX - half - 0.05, h / 2, ROOM.minZ]} material={m.door}>
        <boxGeometry args={[0.08, h, 0.12]} />
      </mesh>
      <mesh position={[DOORS.balconyX + half + 0.05, h / 2, ROOM.minZ]} material={m.door}>
        <boxGeometry args={[0.08, h, 0.12]} />
      </mesh>
      <mesh position={[DOORS.balconyX, h + 0.04, ROOM.minZ]} material={m.door}>
        <boxGeometry args={[ROOM.doorW + 0.16, 0.08, 0.12]} />
      </mesh>
      <group ref={balcony} position={[DOORS.balconyX - half, 0, ROOM.minZ]}>
        <DoorPanel width={ROOM.doorW - 0.04} height={h} />
      </group>

      {/* Branch hooks on balcony door wall */}
      <mesh position={[DOORS.balconyX + 0.55, 1.55, ROOM.minZ + 0.08]} rotation={[0, 0, 0.4]} material={m.darkWood}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
      </mesh>
      <mesh position={[DOORS.balconyX + 0.62, 1.62, ROOM.minZ + 0.08]} rotation={[0, 0, -0.5]} material={m.darkWood}>
        <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
      </mesh>
    </group>
  );
}
