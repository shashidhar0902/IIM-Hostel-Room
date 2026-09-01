import { Canvas } from "@react-three/fiber";
import { Component, type ReactNode, Suspense, useEffect, useState } from "react";
import { Overlay, WebGLError } from "@/components/game/Overlay";
import { TouchControls } from "@/components/game/TouchControls";
import { World } from "./World";

class GLBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    if (this.state.err) return <WebGLError />;
    return this.props.children;
  }
}

function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: 72, near: 0.08, far: 70, position: [-0.9, 1.62, 3.25] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#9ecce8");
        gl.shadowMap.enabled = true;
      }}
    >
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  );
}

export function HavenGame() {
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);

  return (
    <GLBoundary>
      <div className="relative h-dvh w-full overflow-hidden bg-bg touch-none">
        {client ? <Scene /> : <div className="absolute inset-0 bg-bg" />}
        <Overlay />
        {client ? <TouchControls /> : null}
      </div>
    </GLBoundary>
  );
}
