import { useEffect, useRef } from "react";
import { input } from "@/game/input";
import { useGame } from "@/game/store";

export function TouchControls() {
  const coarse = useGame((s) => s.coarse);
  const phase = useGame((s) => s.phase);
  const stick = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const pid = useRef<number | null>(null);

  useEffect(() => {
    if (!coarse || phase !== "playing") return;
    const lookEl = document.getElementById("haven-look");
    if (!lookEl) return;
    let lookId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    const down = (e: PointerEvent) => {
      if (lookId !== null) return;
      lookId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      lookEl.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== lookId) return;
      input.addLook((e.clientX - lastX) * 1.6, (e.clientY - lastY) * 1.6);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== lookId) return;
      lookId = null;
    };
    lookEl.addEventListener("pointerdown", down);
    lookEl.addEventListener("pointermove", move);
    lookEl.addEventListener("pointerup", up);
    lookEl.addEventListener("pointercancel", up);
    return () => {
      lookEl.removeEventListener("pointerdown", down);
      lookEl.removeEventListener("pointermove", move);
      lookEl.removeEventListener("pointerup", up);
      lookEl.removeEventListener("pointercancel", up);
    };
  }, [coarse, phase]);

  if (!coarse || phase !== "playing") return null;

  const onStickDown = (e: React.PointerEvent) => {
    pid.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveStick(e);
  };
  const moveStick = (e: React.PointerEvent) => {
    if (pid.current !== e.pointerId || !stick.current || !knob.current) return;
    const r = stick.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = r.width / 2 - 18;
    const m = Math.hypot(dx, dy);
    if (m > max) {
      dx = (dx / m) * max;
      dy = (dy / m) * max;
    }
    knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
    input.setTouchMove(dx / max, -dy / max);
  };
  const onStickUp = (e: React.PointerEvent) => {
    if (pid.current !== e.pointerId) return;
    pid.current = null;
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
    input.setTouchMove(0, 0);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div id="haven-look" className="pointer-events-auto absolute inset-y-0 right-0 w-1/2 touch-none" />
      <div
        ref={stick}
        className="pointer-events-auto absolute bottom-8 left-6 size-[120px] touch-none rounded-full border border-border bg-surface/50"
        onPointerDown={onStickDown}
        onPointerMove={moveStick}
        onPointerUp={onStickUp}
        onPointerCancel={onStickUp}
      >
        <div
          ref={knob}
          className="absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/90"
        />
      </div>
      <button
        type="button"
        className="pointer-events-auto absolute bottom-8 right-6 flex size-14 touch-none items-center justify-center rounded-full border border-border bg-surface/80 text-sm font-medium text-fg"
        onPointerDown={(e) => {
          e.preventDefault();
          input.pulse("KeyE");
        }}
      >
        E
      </button>
    </div>
  );
}
