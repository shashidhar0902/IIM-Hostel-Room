import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resolveCircle, worldColliders } from "./colliders";
import { PLAYER, SIT, SPAWN, SPOTS } from "./constants";
import { input } from "./input";
import { sfx } from "./audio";
import { useGame, type Pose } from "./store";

const PITCH_LIM = Math.PI / 2 - 0.08;
const tmp = new THREE.Vector3();

function dist2(ax: number, az: number, bx: number, bz: number) {
  const dx = ax - bx;
  const dz = az - bz;
  return dx * dx + dz * dz;
}

function nearestSpot(x: number, z: number): keyof typeof SPOTS | null {
  let best: keyof typeof SPOTS | null = null;
  let bestD = Infinity;
  for (const id of Object.keys(SPOTS) as (keyof typeof SPOTS)[]) {
    const s = SPOTS[id];
    const d = dist2(x, z, s.x, s.z);
    if (d <= s.r * s.r && d < bestD) {
      best = id;
      bestD = d;
    }
  }
  return best;
}

function placeOf(x: number, z: number) {
  if (z > 2.12) return "hallway" as const;
  if (z < -3.2) return "balcony" as const;
  return "loft" as const;
}

function promptFor(
  id: ReturnType<typeof nearestSpot>,
  open: { entranceOpen: boolean; balconyOpen: boolean; lampOn: boolean },
  pose: Pose,
) {
  if (pose !== "stand") return "E or move to stand";
  if (!id) return null;
  if (id === "bed") return "E sit on the bed";
  if (id === "desk") return "E sit and work";
  if (id === "balconyChair") return "E sit and look out";
  if (id === "entrance") return open.entranceOpen ? "E close the door" : "E open the door";
  if (id === "balconyDoor") return open.balconyOpen ? "E close the balcony" : "E open the balcony";
  if (id === "lamp") return open.lampOn ? "E turn the fairy lights off" : "E turn the fairy lights on";
  return null;
}

export function Player() {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const x = useRef<number>(SPAWN.x);
  const y = useRef<number>(SPAWN.y);
  const z = useRef<number>(SPAWN.z);
  const vy = useRef(0);
  const grounded = useRef(true);
  const vx = useRef(0);
  const vz = useRef(0);
  const bob = useRef(0);
  const dist = useRef(0);
  const lastStep = useRef(0);
  const typeAcc = useRef(0);
  const camYaw = useRef(0);
  const camPitch = useRef(0);
  const lastPose = useRef<Pose>("stand");
  const savedYaw = useRef(0);
  const savedPitch = useRef(0);
  const fromTitle = useRef(true);

  useEffect(() => {
    input.bind();
    useGame.getState().setLockEl(gl.domElement);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    useGame.getState().setCoarse(coarse);

    const probe = {
      getYaw: () => yaw.current,
      getSpeed: () => Math.hypot(vx.current, vz.current),
      getPos: () => ({ x: x.current, y: y.current, z: z.current }),
      getPose: () => useGame.getState().pose,
      setKeys: (codes: string[]) => input.setKeys(codes),
      setYaw: (v: number) => {
        yaw.current = v;
      },
      startGame: () => useGame.getState().enter(),
    };
    window.__controlsTest = probe;

    let heldLock = false;
    const onLockChange = () => {
      if (document.pointerLockElement) {
        heldLock = true;
        if (useGame.getState().phase === "paused") useGame.getState().resume();
        return;
      }
      if (heldLock && useGame.getState().phase === "playing" && !useGame.getState().coarse) {
        heldLock = false;
        useGame.getState().pause();
      }
    };
    document.addEventListener("pointerlockchange", onLockChange);
    return () => {
      input.unbind();
      document.removeEventListener("pointerlockchange", onLockChange);
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, [gl]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const g = useGame.getState();
    sfx.tickAmbient(dt);

    if (g.phase === "title") {
      const t = state.clock.elapsedTime;
      camera.position.set(Math.sin(t * 0.15) * 3.4, 1.45 + Math.sin(t * 0.22) * 0.1, 1.6 + Math.cos(t * 0.15) * 1.6);
      camera.lookAt(-0.2, 1.0, -1.2);
      fromTitle.current = true;
      return;
    }

    const act = input.poll();
    if (g.phase === "paused") return;

    if (fromTitle.current) {
      fromTitle.current = false;
      yaw.current = 0;
      pitch.current = 0;
      x.current = SPAWN.x;
      y.current = SPAWN.y;
      z.current = SPAWN.z;
      camera.position.set(SPAWN.x, PLAYER.eye, SPAWN.z);
      camera.rotation.order = "YXZ";
      camera.rotation.set(0, 0, 0);
    }

    if (act.pause) {
      g.pause();
      document.exitPointerLock();
      return;
    }

    yaw.current -= act.lookX * PLAYER.mouse;
    pitch.current -= act.lookY * PLAYER.mouse;
    if (pitch.current > PITCH_LIM) pitch.current = PITCH_LIM;
    if (pitch.current < -PITCH_LIM) pitch.current = -PITCH_LIM;

    const sitting = g.pose !== "stand";
    if (sitting && (act.interact || act.moveX !== 0 || act.moveY !== 0 || act.jump)) {
      g.stand();
      sfx.stand();
    } else if (!sitting && act.interact) {
      const id = nearestSpot(x.current, z.current);
      if (id === "bed") {
        g.sit("bed");
        sfx.sit();
      } else if (id === "desk") {
        g.sit("desk");
        sfx.sit();
      } else if (id === "balconyChair") {
        g.sit("balconyChair");
        sfx.sit();
      } else if (id === "entrance") {
        g.toggleEntrance();
        sfx.door();
      } else if (id === "balconyDoor") {
        g.toggleBalcony();
        sfx.door();
      } else if (id === "lamp") {
        g.toggleLamp();
        sfx.lamp();
      }
    }

    const pose = useGame.getState().pose;
    if (pose !== lastPose.current) {
      if (pose !== "stand" && lastPose.current === "stand") {
        savedYaw.current = yaw.current;
        savedPitch.current = pitch.current;
        yaw.current = 0;
        pitch.current = 0;
      }
      if (pose === "stand" && lastPose.current !== "stand") {
        yaw.current = savedYaw.current;
        pitch.current = savedPitch.current;
      }
      lastPose.current = pose;
    }
    const moving = pose === "stand";

    if (moving) {
      const speed = act.sprint ? PLAYER.sprint : PLAYER.walk;
      const fx = -Math.sin(yaw.current);
      const fz = -Math.cos(yaw.current);
      const rx = Math.cos(yaw.current);
      const rz = -Math.sin(yaw.current);
      const wishX = (act.moveY * fx + act.moveX * rx) * speed;
      const wishZ = (act.moveY * fz + act.moveX * rz) * speed;
      const a = 1 - Math.exp(-PLAYER.accel * dt);
      vx.current += (wishX - vx.current) * a;
      vz.current += (wishZ - vz.current) * a;

      if (act.jump && grounded.current) {
        vy.current = PLAYER.jump;
        grounded.current = false;
      }
      vy.current -= PLAYER.gravity * dt;
      y.current += vy.current * dt;
      if (y.current <= 0) {
        y.current = 0;
        vy.current = 0;
        grounded.current = true;
      }

      let nx = x.current + vx.current * dt;
      let nz = z.current + vz.current * dt;
      const boxes = worldColliders({
        entranceOpen: useGame.getState().entranceOpen,
        balconyOpen: useGame.getState().balconyOpen,
      });
      const resolved = resolveCircle(nx, nz, boxes);
      x.current = resolved.x;
      z.current = resolved.z;

      const spd = Math.hypot(vx.current, vz.current);
      if (spd > 0.4 && grounded.current) {
        dist.current += spd * dt;
        bob.current = Math.sin(dist.current * 9.5) * 0.028 * Math.min(1, spd / PLAYER.walk);
        if (dist.current - lastStep.current > 1.35) {
          lastStep.current = dist.current;
          sfx.foot(Math.floor(dist.current));
        }
      } else {
        bob.current *= Math.exp(-8 * dt);
      }
    } else {
      vx.current = 0;
      vz.current = 0;
      bob.current *= Math.exp(-8 * dt);
      if (pose === "desk") {
        typeAcc.current += dt;
        if (typeAcc.current > 0.22) {
          typeAcc.current = 0;
          sfx.type();
        }
      }
    }

    const id = nearestSpot(x.current, z.current);
    const nextPrompt = promptFor(id, useGame.getState(), pose);
    if (nextPrompt !== g.prompt) useGame.getState().setPrompt(nextPrompt);
    const pl = placeOf(x.current, z.current);
    if (pl !== g.place) useGame.getState().setPlace(pl);

    let eye = PLAYER.eye + y.current + bob.current;
    tmp.set(x.current, eye, z.current);
    camYaw.current = yaw.current;
    camPitch.current = pitch.current;

    if (pose === "bed") {
      tmp.set(SIT.bed.x, SIT.bed.y, SIT.bed.z);
      camYaw.current = SIT.bed.yaw + yaw.current;
      camPitch.current = SIT.bed.pitch + pitch.current;
    } else if (pose === "desk") {
      tmp.set(SIT.desk.x, SIT.desk.y, SIT.desk.z);
      camYaw.current = SIT.desk.yaw + yaw.current;
      camPitch.current = SIT.desk.pitch + pitch.current;
    } else if (pose === "balconyChair") {
      tmp.set(SIT.balconyChair.x, SIT.balconyChair.y, SIT.balconyChair.z);
      camYaw.current = SIT.balconyChair.yaw + yaw.current;
      camPitch.current = SIT.balconyChair.pitch + pitch.current;
    }

    const k = 1 - Math.exp(-10 * dt);
    camera.position.lerp(tmp, pose === "stand" ? Math.min(1, k * 1.4) : k);
    camera.rotation.order = "YXZ";
    camera.rotation.y += (camYaw.current - camera.rotation.y) * (pose === "stand" ? 1 : k);
    camera.rotation.x += (camPitch.current - camera.rotation.x) * (pose === "stand" ? 1 : k);
    camera.rotation.z = 0;
    if (pose === "stand") {
      camera.rotation.y = camYaw.current;
      camera.rotation.x = camPitch.current;
    }
  });

  return null;
}
