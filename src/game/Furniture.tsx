import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { useMats } from "./MatsContext";
import { useGame } from "./store";
import { paintLaptop } from "./textures";

function Ivy({ origin }: { origin: [number, number, number] }) {
  const pts = useMemo(() => {
    const a: [number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      a.push([
        (i % 7) * 0.16 - 0.48,
        0.15 + Math.floor(i / 7) * 0.28 + (i % 3) * 0.04,
        (i % 2) * 0.02,
      ]);
    }
    return a;
  }, []);
  return (
    <group position={origin} rotation={[0, Math.PI*0.5, 0]}>
      {pts.map((p, i) => (
        <mesh key={i} position={p} rotation={[0.4, i * 0.3, 0.2]}>
          <sphereGeometry args={[0.045, 6, 5]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#4a7a3c" : "#2f5a32"} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Piano() {
  const keys = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  return (
    <group>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.78, 0.08, 0.22]} />
        <meshStandardMaterial color="#1a1a1c" roughness={0.45} />
      </mesh>
      {keys.map((i) => (
        <mesh key={i} position={[-0.35 + i * 0.03, 0.085, 0.02]}>
          <boxGeometry args={[0.026, 0.012, 0.16]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.4} />
        </mesh>
      ))}
      {[1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20, 22].map((i) => (
        <mesh key={`b${i}`} position={[-0.335 + i * 0.03, 0.095, -0.02]}>
          <boxGeometry args={[0.016, 0.014, 0.1]} />
          <meshStandardMaterial color="#111113" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Laptop() {
  const m = useMats();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (Math.floor(t * 12) % 2 === 0) return;
    paintLaptop(m.screenCtx, m.screenTex, t, useGame.getState().pose === "desk");
  });
  return (
    <group>
      <mesh castShadow material={m.black}>
        <boxGeometry args={[0.32, 0.014, 0.22]} />
      </mesh>
      <mesh position={[0, 0.12, -0.1]} rotation={[-0.2, 0, 0]} castShadow material={m.black}>
        <boxGeometry args={[0.32, 0.2, 0.012]} />
      </mesh>
      <mesh position={[0, 0.12, -0.093]} rotation={[-0.2, 0, 0]} material={m.screen}>
        <planeGeometry args={[0.28, 0.16]} />
      </mesh>
    </group>
  );
}

function OfficeChair({ position }: { position: [number, number, number] }) {
  const m = useMats();
  return (
    <group position={position} rotation={[0, Math.PI*-0.5 , 0]}>
      <mesh position={[0, 0.5, 0]} castShadow material={m.black}>
        <boxGeometry args={[0.46, 0.08, 0.46]} />
      </mesh>
      <mesh position={[0, 0.88, -0.18]} castShadow material={m.black}>
        <boxGeometry args={[0.46, 0.7, 0.08]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={m.metal}>
        <cylinderGeometry args={[0.04, 0.04, 0.36, 8]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} material={m.black}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 10]} />
      </mesh>
    </group>
  );
}

export function Furniture() {
  const m = useMats();
  const lampOn = useGame((s) => s.lampOn);
  const atDesk = useGame((s) => s.pose === "desk");

  useFrame(() => {
    m.lampShade.emissiveIntensity = useGame.getState().lampOn ? 0.7 : 0.04;
  });

  return (
    <group>
      {/* Grey desk + drawers */}
      <group position={[-1.82, 0, -1]} rotation={[0, Math.PI*0.5, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow material={m.desk}>
          <boxGeometry args={[1.28, 0.05, 0.62]} />
        </mesh>
        <mesh position={[-0.42, 0.36, 0]} castShadow material={m.desk}>
          <boxGeometry args={[0.42, 0.72, 0.6]} />
        </mesh>
        {[0.18, 0.36, 0.54].map((y) => (
          <mesh key={y} position={[-0.22, y, 0.31]} material={m.metal}>
            <boxGeometry args={[0.12, 0.018, 0.02]} />
          </mesh>
        ))}
        <mesh position={[0.5, 0.36, -0.26]} material={m.desk}>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
        </mesh>
        <mesh position={[0.5, 0.36, 0.26]} material={m.desk}>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
        </mesh>
        <group position={[-0.28, 0.8, 0.02]}>
          <Piano />
        </group>
        <group position={[0.38, 0.79, 0.06]} rotation={[0, 0.08, 0]}>
          <Laptop />
        </group>
        <mesh position={[0.02, 0.86, 0.08]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.2, 12]} />
          <meshStandardMaterial color="#c5c8cc" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0.79, 0.18]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.28, 0.03, 0.18]} />
          <meshStandardMaterial color="#c8c4bc" roughness={0.9} />
        </mesh>
        <mesh position={[0.48, 0.84, -0.12]}>
          <boxGeometry args={[0.16, 0.12, 0.12]} />
          <meshStandardMaterial color="#d8c8a8" roughness={0.8} />
        </mesh>
        <mesh position={[-0.58, 0.82, 0.2]}>
          <cylinderGeometry args={[0.035, 0.04, 0.12, 10]} />
          <meshStandardMaterial color="#7aaf4a" roughness={0.6} />
        </mesh>
      </group>
      {atDesk && (
        <pointLight position={[-0.95, 1.05, -2.45]} intensity={1.8} distance={3.2} decay={2} color="#e3e6e9" />
      )}
      <OfficeChair position={[-1., 0, -1]} />
      
      {/* Felt pinboard + shelves + fairy lights */}
      <mesh position={[-2.2, 1.55, -1]} rotation={[0, Math.PI*0.5, 0]} material={m.felt}>
        <planeGeometry args={[1.45, 1.35]} />
      </mesh>
      <mesh position={[-2.2, 2.28, -0.65]}  rotation={[0, Math.PI*0.5, 0]} material={m.metal}>
        <boxGeometry args={[0.79, 0.04, 0.22]} />
      </mesh>
      <mesh position={[-2.2, 2.28, -1.4]}  rotation={[0, Math.PI*0.5, 0]} material={m.metal}>
        <boxGeometry args={[0.7, 0.04, 0.22]} />
      </mesh>
      <Ivy origin={[-2.1, 1., -1.]} />
      {lampOn &&
        [
          [-1.5, 1.98],
          [-1.5, 2.05],
          [-1.28, 1.85],
          [-1.08, 2.1],
          [-0.88, 1.92],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -3.06]} material={m.lampShade}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
        ))}
      {lampOn && (
        <pointLight position={[-2, 1.5, -1]} intensity={4.2} distance={5.5} decay={2} color="#f3e0a8" />
      )}
      {/* sockets */}
      <mesh position={[-2, 1.2, -0.7]} rotation={[0, Math.PI*0.5, 0]} >
        <boxGeometry args={[0.12, 0.08, 0.02]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>
      <mesh position={[-2, 1.2, -0.8]} rotation={[0, Math.PI*0.5, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.02]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>

      {/* Bucket */}
      <mesh position={[-2.02, 0.18, -0]} castShadow>
        <cylinderGeometry args={[0.16, 0.14, 0.36, 14]} />
        <meshStandardMaterial color="#e0c8b0" roughness={0.7} />
      </mesh>

      {/* Jute mat under chair */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.15, 0.012, -1.85]} receiveShadow>
        <circleGeometry args={[0.32, 16]} />
        <meshStandardMaterial color="#c4b08a" roughness={0.95} />
      </mesh>

      {/* Bed */}
      <group position={[1.28, 0, -1.72]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.12, 1.92]} />
          <meshStandardMaterial color="#e8e4dc" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow material={m.duvet}>
          <boxGeometry args={[0.88, 0.1, 1.86]} />
        </mesh>
        <mesh position={[-0.4, 0.38, 0]} material={m.linen}>
          <boxGeometry args={[0.06, 0.42, 1.92]} />
        </mesh>
        <mesh position={[0.4, 0.38, 0]} material={m.linen}>
          <boxGeometry args={[0.06, 0.42, 1.92]} />
        </mesh>
        <mesh position={[0, 0.38, 0.93]} material={m.linen}>
          <boxGeometry args={[0.92, 0.42, 0.06]} />
        </mesh>
        <mesh position={[-0.12, 0.58, -0.72]} rotation={[0.2, 0.3, 0]} material={m.pillow} castShadow>
          <boxGeometry args={[0.38, 0.14, 0.28]} />
        </mesh>
        <mesh position={[0.2, 0.56, -0.68]} rotation={[0.15, -0.2, 0]} castShadow>
          <boxGeometry args={[0.36, 0.12, 0.26]} />
          <meshStandardMaterial color="#d4a07a" roughness={0.85} />
        </mesh>
        <mesh position={[0.18, 0.5, 0.15]} rotation={[0.1, 0.4, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.7]} />
          <meshStandardMaterial color="#6b3a32" roughness={0.9} />
        </mesh>
        <mesh position={[0.42, 0.55, 0.55]} rotation={[0.2, 0, 0.15]}>
          <boxGeometry args={[0.22, 0.08, 0.7]} />
          <meshStandardMaterial color="#2a3038" roughness={0.9} />
        </mesh>
      </group>

      {/* Folk rug beside bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.52, 0.014, -1.55]} receiveShadow material={m.rug}>
        <planeGeometry args={[0.78, 1.55]} />
      </mesh>

      {/* Wardrobe */}
      <group position={[2.22, 0, 0.55]}>
        <mesh position={[0, 1.08, 0]} castShadow receiveShadow material={m.desk}>
          <boxGeometry args={[0.52, 2.16, 1.55]} />
        </mesh>
        <mesh position={[-0.27, 1.1, -0.02]} material={m.metal}>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
        </mesh>
        <mesh position={[-0.27, 1.1, 0.12]} material={m.metal}>
          <boxGeometry args={[0.02, 0.08, 0.02]} />
        </mesh>
      </group>

      {/* Mirror */}
      <mesh position={[2.38, 1.35, -0.55]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 1.15]} />
        <meshStandardMaterial color="#b8c8d4" metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[2.36, 1.35, -0.55]} rotation={[0, -Math.PI / 2, 0]} material={m.linen}>
        <boxGeometry args={[0.6, 1.22, 0.03]} />
      </mesh>

      {/* Whiteboard near entrance */}
      <mesh position={[-0, 1.5, 2]} rotation={[0, Math.PI , 0]} material={m.art}>
        <planeGeometry args={[0.7, 0.95]} />
      </mesh>

      {/* Wall decorations */}
      <mesh position={[1.55, 1.7, -3.12]} >
        <circleGeometry args={[0.08, 10]} />
        <meshStandardMaterial color="#3a3a38" roughness={0.6} />
      </mesh>
      <mesh position={[2.0, 1.55, 1.7]} rotation={[0, -Math.PI / 2, 0.35]} material={m.darkWood}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
      </mesh>
      <mesh position={[2.0, 1.62, 1.78]} rotation={[0, -Math.PI / 2, -0.5]} material={m.darkWood}>
        <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
      </mesh>

      {/* Plant near wardrobe */}
      <group position={[1.85, 0, 1.85]}>
        <mesh position={[0, 0.14, 0]} material={m.pot}>
          <cylinderGeometry args={[0.1, 0.08, 0.28, 10]} />
        </mesh>
        <mesh position={[0, 0.42, 0]} material={m.plant}>
          <sphereGeometry args={[0.2, 10, 8]} />
        </mesh>
      </group>
    </group>
  );
}
