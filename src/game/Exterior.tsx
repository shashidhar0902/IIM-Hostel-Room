import { BALCONY, FLOOR_Y } from "./constants";
import { useMats } from "./MatsContext";

function Palm({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 3.2, 8]} />
        <meshStandardMaterial color="#6b5340" roughness={0.85} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i * Math.PI * 2) / 5) * 0.45,
            3.15,
            Math.cos((i * Math.PI * 2) / 5) * 0.45,
          ]}
          rotation={[0.6, (i * Math.PI * 2) / 5, 0]}
        >
          <sphereGeometry args={[0.32, 8, 6]} />
          <meshStandardMaterial color="#2f5a28" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Building({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#e6e2da" roughness={0.85} />
      </mesh>
      {[-0.35, 0.35].map((ox) =>
        [0.3, -0.35].map((oy) => (
          <mesh key={`${ox}${oy}`} position={[ox, oy, size[2] / 2 + 0.01]}>
            <planeGeometry args={[0.28, 0.38]} />
            <meshStandardMaterial color="#c5d0d8" roughness={0.3} />
          </mesh>
        )),
      )}
    </group>
  );
}

export function Exterior() {
  const m = useMats();
  const balconyCenterX = (BALCONY.minX + BALCONY.maxX) / 2;
  const zRail = BALCONY.minZ + 0.08;
  return (
    <group>
      <mesh material={m.sky}>
        <sphereGeometry args={[48, 24, 16]} />
      </mesh>
      <mesh position={[0, 5.2, -18]} material={m.city}>
        <planeGeometry args={[42, 16]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -14]} receiveShadow>
        <planeGeometry args={[40, 28]} />
        <meshStandardMaterial color="#7a9a4a" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -17]} receiveShadow>
        <planeGeometry args={[18, 11]} />
        <meshStandardMaterial color="#477a45" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -17]}>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#4f874b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.035, -17]}>
        <boxGeometry args={[16, 0.025, 0.035]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.035, -21.5]}>
        <boxGeometry args={[16, 0.025, 0.035]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.8} />
      </mesh>
      <mesh position={[-8, 0.035, -17]}>
        <boxGeometry args={[0.035, 0.025, 9]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.8} />
      </mesh>
      <mesh position={[8, 0.035, -17]}>
        <boxGeometry args={[0.035, 0.025, 9]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.035, -17]}>
        <boxGeometry args={[0.035, 0.025, 9]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -17]}>
        <torusGeometry args={[1.15, 0.025, 8, 32]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.8} />
      </mesh>

      <Building position={[-6.2, 2.8, -11]} size={[2.4, 5.6, 2.2]} />
      <Building position={[6.4, 2.8, -11.5]} size={[2.2, 5.6, 2]} />
      <Palm position={[-3.4, 0, -9.5]} />
      <Palm position={[0.2, 0, -12]} />
      <Palm position={[3.6, 0, -10]} />

      <mesh position={[0.4, 4.2, -14]}>
        <cylinderGeometry args={[0.06, 0.08, 8.4, 8]} />
        <meshStandardMaterial color="#8a8a88" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 8.3, -14]}>
        <boxGeometry args={[1.1, 0.12, 0.4]} />
        <meshStandardMaterial color="#6a6a68" />
      </mesh>

      {[-2.2, -0.7, 0.8, 2.2].map((x) => (
        <mesh key={x} position={[x, 0.55, -8.2]}>
          <sphereGeometry args={[0.55, 8, 6]} />
          <meshStandardMaterial color="#3d6a32" roughness={0.85} />
        </mesh>
      ))}

      {/* Railing */}
      <group position={[0, FLOOR_Y, 0]}>
      {[-1.4, -0.7, 0, 0.7, 1.4].map((x) => (
        <mesh key={x} position={[balconyCenterX + x, 0.55, zRail]} material={m.metal}>
          <boxGeometry args={[0.04, 1.1, 0.04]} />
        </mesh>
      ))}
      <mesh position={[balconyCenterX, 1.08, zRail]} material={m.metal}>
        <boxGeometry args={[3.1, 0.045, 0.045]} />
      </mesh>
      <mesh position={[balconyCenterX, 0.55, zRail]} material={m.metal}>
        <boxGeometry args={[3.1, 0.035, 0.035]} />
      </mesh>
      <mesh position={[BALCONY.minX + 0.04, 0.55, (BALCONY.minZ + BALCONY.maxZ) / 2]} material={m.metal}>
        <boxGeometry args={[0.04, 1.1, BALCONY.maxZ - BALCONY.minZ]} />
      </mesh>
      <mesh position={[BALCONY.maxX - 0.04, 0.55, (BALCONY.minZ + BALCONY.maxZ) / 2]} material={m.metal}>
        <boxGeometry args={[0.04, 1.1, BALCONY.maxZ - BALCONY.minZ]} />
      </mesh>
      <mesh position={[balconyCenterX, 0.08, zRail + 0.12]} material={m.concrete}>
        <boxGeometry args={[3.15, 0.16, 0.28]} />
      </mesh>
      <mesh position={[balconyCenterX + 0.85, 0.22, zRail + 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
        <meshStandardMaterial color="#3a5a9a" roughness={0.5} />
      </mesh>
      </group>
    </group>
  );
}
