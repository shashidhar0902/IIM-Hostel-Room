import { Armchair, DoorOpen, Keyboard, Lamp, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sfx } from "@/game/audio";
import { useGame } from "@/game/store";

function lockPointer() {
  const el = useGame.getState().lockEl;
  if (!el || useGame.getState().coarse) return;
  const req = el.requestPointerLock as (opts?: { unadjustedMovement?: boolean }) => Promise<void> | void;
  try {
    const p = req.call(el, { unadjustedMovement: true });
    if (p && typeof (p as Promise<void>).catch === "function") {
      void (p as Promise<void>).catch(() => {
        el.requestPointerLock();
      });
    }
  } catch {
    el.requestPointerLock();
  }
}

export function Overlay() {
  const phase = useGame((s) => s.phase);
  const prompt = useGame((s) => s.prompt);
  const place = useGame((s) => s.place);
  const pose = useGame((s) => s.pose);
  const muted = useGame((s) => s.muted);
  const coarse = useGame((s) => s.coarse);

  const placeLabel = place === "hallway" ? "Hallway" : place === "balcony" ? "Balcony" : "Room";
  const poseLabel =
    pose === "desk" ? "Working" : pose === "bed" ? "Resting" : pose === "balconyChair" ? "Looking out" : "On foot";

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {phase === "title" && (
        <div className="pointer-events-auto absolute inset-0 flex flex-col justify-end bg-bg/55 px-6 pb-10 pt-16 sm:justify-center sm:px-12">
          <div className="haven-stagger mx-auto w-full max-w-lg">
            <p className="font-sans text-xs font-medium tracking-[0.22em] text-muted uppercase">Your room</p>
            <h1 className="mt-3 font-display text-5xl font-medium tracking-[-0.03em] text-fg sm:text-6xl">Haven</h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
              Open the brown door, sit at the piano desk, rest on the bed under the blue curtains, or step onto the balcony over the field.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  void sfx.unlock();
                  sfx.startPad();
                  useGame.getState().enter();
                  lockPointer();
                }}
              >
                Enter the room
              </Button>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-subtle sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <Keyboard className="size-4" strokeWidth={1.75} />
                WASD move
              </li>
              <li className="flex items-center gap-2">
                <MousePointer2 className="size-4" strokeWidth={1.75} />
                Mouse look
              </li>
              <li className="flex items-center gap-2">
                <DoorOpen className="size-4" strokeWidth={1.75} />
                E interact
              </li>
              <li className="flex items-center gap-2">
                <Armchair className="size-4" strokeWidth={1.75} />
                Sit / stand
              </li>
              <li className="flex items-center gap-2">
                <Lamp className="size-4" strokeWidth={1.75} />
                Fairy lights + doors
              </li>
              <li className="text-subtle">Shift sprint · Esc pause</li>
            </ul>
          </div>
        </div>
      )}

      {phase === "paused" && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em]">Paused</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Pointer unlocked. Resume to keep walking the room.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                onClick={() => {
                  useGame.getState().resume();
                  lockPointer();
                }}
              >
                Resume
              </Button>
              <Button variant="ghost" onClick={() => useGame.getState().toggleMute()}>
                {muted ? "Unmute" : "Mute"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === "playing" && (
        <>
          {pose === "stand" && !coarse && (
            <div
              className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/80"
              aria-hidden
            />
          )}
          <div className="haven-hud absolute left-4 top-4 rounded-2xl border border-border bg-surface/80 px-3 py-2 text-xs text-muted backdrop-blur-sm sm:left-6 sm:top-6">
            <div className="font-medium text-fg">{placeLabel}</div>
            <div>{poseLabel}</div>
          </div>
          {prompt && (
            <div className="absolute inset-x-0 bottom-8 flex justify-center px-4 sm:bottom-10">
              <div className="rounded-full border border-border bg-surface/85 px-4 py-2 text-sm text-prompt backdrop-blur-sm">
                {prompt}
              </div>
            </div>
          )}
          {coarse && (
            <button
              type="button"
              className="pointer-events-auto absolute right-4 top-4 size-12 rounded-2xl border border-border bg-surface/85 text-sm text-fg"
              onClick={() => useGame.getState().pause()}
            >
              Pause
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function BootScreen() {
  return (
    <main className="flex h-dvh flex-col justify-end bg-bg px-6 pb-12 sm:justify-center sm:px-12">
      <p className="font-sans text-xs font-medium tracking-[0.22em] text-muted uppercase">Your room</p>
      <h1 className="mt-3 font-display text-5xl font-medium tracking-[-0.03em] text-fg">Haven</h1>
      <p className="mt-4 text-muted">Preparing the room…</p>
    </main>
  );
}

export function WebGLError() {
  return (
    <main className="flex h-dvh flex-col items-start justify-center bg-bg px-6">
      <h1 className="font-display text-3xl text-fg">Haven needs WebGL</h1>
      <p className="mt-3 max-w-md text-muted">This room is a 3D scene. Try another browser if the canvas cannot start.</p>
    </main>
  );
}
