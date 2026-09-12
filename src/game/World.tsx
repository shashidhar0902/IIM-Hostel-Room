import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Doors } from "./Doors";
import { Exterior } from "./Exterior";
import { Furniture } from "./Furniture";
import { MatsProvider } from "./MatsContext";
import { Player } from "./Player";
import { Room } from "./Room";
import { useMaterials } from "./textures";
import { FLOOR_Y } from "./constants";
import { useGame } from "./store";

function Dust() {
  const positions = useMemo(() => {
    const n = 80;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = 0.4 + Math.random() * 2.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8dcc8" size={0.018} transparent opacity={0.28} depthWrite={false} />
    </points>
  );
}

function SceneFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog("#c5d8e6", 18, 48);
    scene.background = new THREE.Color("#9ecce8");
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  return null;
}

export function World() {
  const mats = useMaterials();
  const roomLightOn = useGame((s) => s.roomLightOn);
  return (
    <MatsProvider value={mats}>
      <SceneFog />
      <hemisphereLight args={["#d7eef8", "#c8b898", 0.85]} />
      <ambientLight intensity={0.45} color="#f2ebe0" />
      <directionalLight
        position={[4, 10, -8]}
        intensity={1.35}
        color="#fff4d8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {roomLightOn && (
        <pointLight position={[0.2, FLOOR_Y + 2.5, -0.3]} intensity={1.4} distance={8} decay={2} color="#fff6e8" />
      )}
      <group position={[0, FLOOR_Y, 0]}>
        <Room />
        <Doors />
        <Furniture />
      </group>
      <Exterior />
      <Dust />
      <Player />
    </MatsProvider>
  );
}
