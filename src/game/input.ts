const GAME_CODES = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyE",
  "KeyF",
  "Space",
  "ShiftLeft",
  "ShiftRight",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Escape",
]);

export type Actions = {
  moveX: number;
  moveY: number;
  sprint: boolean;
  jump: boolean;
  interact: boolean;
  pause: boolean;
  lookX: number;
  lookY: number;
};

const keys = new Set<string>();
const edges = new Set<string>();
let lookX = 0;
let lookY = 0;
let touchX = 0;
let touchY = 0;
let lookSens = 1;
let bound = false;

function onKeyDown(e: KeyboardEvent) {
  if (e.repeat) {
    keys.add(e.code);
    return;
  }
  keys.add(e.code);
  edges.add(e.code);
  if (GAME_CODES.has(e.code)) e.preventDefault();
}

function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.code);
}

function onBlur() {
  keys.clear();
  edges.clear();
  touchX = 0;
  touchY = 0;
  dragging = false;
}

let dragging = false;

function onMouseMove(e: MouseEvent) {
  if (document.pointerLockElement || dragging) {
    lookX += e.movementX;
    lookY += e.movementY;
  }
}

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0 || document.pointerLockElement) return;
  const t = e.target as HTMLElement | null;
  if (t?.closest("button, a, input, [role='button']")) return;
  dragging = true;
}

function onMouseUp() {
  dragging = false;
}

export const input = {
  bind() {
    if (bound || typeof window === "undefined") return;
    bound = true;
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onBlur);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
  },
  unbind() {
    if (!bound) return;
    bound = false;
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onBlur);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    keys.clear();
    edges.clear();
  },
  setTouchMove(x: number, y: number) {
    touchX = x;
    touchY = y;
  },
  addLook(dx: number, dy: number) {
    lookX += dx;
    lookY += dy;
  },
  setKeys(codes: string[]) {
    keys.clear();
    edges.clear();
    for (const c of codes) keys.add(c);
  },
  pulse(code: string) {
    keys.add(code);
    edges.add(code);
    queueMicrotask(() => keys.delete(code));
  },
  has(code: string) {
    return keys.has(code);
  },
  poll(): Actions {
    let moveX = 0;
    let moveY = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) moveY += 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) moveY -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) moveX += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) moveX -= 1;
    moveX += touchX;
    moveY += touchY;
    const m = Math.hypot(moveX, moveY);
    if (m > 1) {
      moveX /= m;
      moveY /= m;
    }
    const interact = edges.has("KeyE") || edges.has("KeyF");
    const jump = edges.has("Space");
    const pause = edges.has("Escape");
    edges.clear();
    const lx = lookX * lookSens;
    const ly = lookY * lookSens;
    lookX = 0;
    lookY = 0;
    return {
      moveX,
      moveY,
      sprint: keys.has("ShiftLeft") || keys.has("ShiftRight"),
      jump,
      interact,
      pause,
      lookX: lx,
      lookY: ly,
    };
  },
};
