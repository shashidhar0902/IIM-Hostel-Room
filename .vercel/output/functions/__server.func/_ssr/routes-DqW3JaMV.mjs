import { i as __toESM } from "../_runtime.mjs";
import { a as CanvasTexture, c as Fog, d as RepeatWrapping, f as SRGBColorSpace, g as require_react, h as require_jsx_runtime, l as MeshBasicMaterial, n as useFrame, o as ClampToEdgeWrapping, p as Vector3, r as useThree, s as Color, t as Canvas, u as MeshStandardMaterial } from "../_libs/@react-three/fiber+[...].mjs";
import { a as DoorOpen, i as Keyboard, n as MousePointer2, o as Armchair, r as Lamp } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DqW3JaMV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90 border border-transparent",
			ghost: "bg-transparent text-fg border border-border hover:bg-surface-2",
			quiet: "bg-surface-2 text-fg border border-border hover:bg-surface"
		},
		size: {
			lg: "h-12 px-6 text-sm rounded-[20px]",
			md: "h-11 px-5 text-sm rounded-xl",
			icon: "size-12 rounded-2xl"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "lg"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
Button.displayName = "Button";
var useGame = create((set, get) => ({
	phase: "title",
	pose: "stand",
	place: "hallway",
	prompt: null,
	entranceOpen: false,
	balconyOpen: false,
	lampOn: true,
	muted: false,
	coarse: false,
	lockEl: null,
	setLockEl: (el) => set({ lockEl: el }),
	setCoarse: (v) => set({ coarse: v }),
	setPrompt: (v) => set({ prompt: v }),
	setPlace: (v) => set({ place: v }),
	enter: () => set({
		phase: "playing",
		pose: "stand"
	}),
	pause: () => {
		if (get().phase === "playing") set({ phase: "paused" });
	},
	resume: () => {
		if (get().phase === "paused") set({ phase: "playing" });
	},
	sit: (pose) => set({
		pose,
		prompt: "E or movement to stand"
	}),
	stand: () => set({ pose: "stand" }),
	toggleEntrance: () => set({ entranceOpen: !get().entranceOpen }),
	toggleBalcony: () => set({ balconyOpen: !get().balconyOpen }),
	toggleLamp: () => set({ lampOn: !get().lampOn }),
	toggleMute: () => set({ muted: !get().muted })
}));
var ctx = null;
var master = null;
var ambient = null;
var ambTimer = 0;
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
		master = ctx.createGain();
		master.gain.value = .7;
		master.connect(ctx.destination);
	}
	return ctx;
}
function out() {
	if (!ac() || !master) return null;
	master.gain.value = useGame.getState().muted ? 0 : .7;
	return master;
}
function beep(freq, dur, type, gain = .08, when = 0, filterHz) {
	const c = ac();
	const dest = out();
	if (!c || !dest) return;
	const t = c.currentTime + when;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(gain, t + .02);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	if (filterHz) {
		const f = c.createBiquadFilter();
		f.type = "lowpass";
		f.frequency.value = filterHz;
		osc.connect(f);
		f.connect(g);
	} else osc.connect(g);
	g.connect(dest);
	osc.start(t);
	osc.stop(t + dur + .02);
}
var sfx = {
	async unlock() {
		const c = ac();
		if (c && c.state === "suspended") await c.resume();
	},
	door() {
		beep(140, .28, "square", .05, 0, 600);
		beep(90, .4, "sawtooth", .04, .02, 400);
	},
	sit() {
		beep(180, .18, "sine", .06, 0, 700);
		beep(110, .22, "triangle", .04, .04, 500);
	},
	stand() {
		beep(220, .12, "sine", .05, 0, 900);
	},
	lamp() {
		beep(520, .08, "sine", .04);
	},
	type() {
		beep(640 + Math.random() * 80, .04, "square", .025, 0, 1800);
	},
	foot(step) {
		beep(step % 2 === 0 ? 90 : 110, .09, "triangle", .05, 0, 280);
	},
	tickAmbient(dt) {
		ambTimer += dt;
		if (ambTimer < 4.5) return;
		ambTimer = 0;
		if (useGame.getState().phase === "title") return;
		beep(48 + Math.random() * 8, 1.6, "sine", .02, 0, 120);
	},
	startPad() {
		const c = ac();
		const dest = out();
		if (!c || !dest || ambient) return;
		ambient = c.createGain();
		ambient.gain.value = .03;
		const osc = c.createOscillator();
		osc.type = "sine";
		osc.frequency.value = 55;
		const f = c.createBiquadFilter();
		f.type = "lowpass";
		f.frequency.value = 180;
		osc.connect(f);
		f.connect(ambient);
		ambient.connect(dest);
		osc.start();
	}
};
function lockPointer() {
	const el = useGame.getState().lockEl;
	if (!el || useGame.getState().coarse) return;
	const req = el.requestPointerLock;
	try {
		const p = req.call(el, { unadjustedMovement: true });
		if (p && typeof p.catch === "function") p.catch(() => {
			el.requestPointerLock();
		});
	} catch {
		el.requestPointerLock();
	}
}
function Overlay() {
	const phase = useGame((s) => s.phase);
	const prompt = useGame((s) => s.prompt);
	const place = useGame((s) => s.place);
	const pose = useGame((s) => s.pose);
	const muted = useGame((s) => s.muted);
	const coarse = useGame((s) => s.coarse);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10",
		children: [
			phase === "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0 flex flex-col justify-end bg-bg/55 px-6 pb-10 pt-16 sm:justify-center sm:px-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "haven-stagger mx-auto w-full max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-xs font-medium tracking-[0.22em] text-muted uppercase",
							children: "Your room"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-5xl font-medium tracking-[-0.03em] text-fg sm:text-6xl",
							children: "Haven"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-sm text-base leading-relaxed text-muted",
							children: "Open the brown door, sit at the piano desk, rest on the bed under the blue curtains, or step onto the balcony over the field."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									sfx.unlock();
									sfx.startPad();
									useGame.getState().enter();
									lockPointer();
								},
								children: "Enter the room"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-subtle sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, {
										className: "size-4",
										strokeWidth: 1.75
									}), "WASD move"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, {
										className: "size-4",
										strokeWidth: 1.75
									}), "Mouse look"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, {
										className: "size-4",
										strokeWidth: 1.75
									}), "E interact"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Armchair, {
										className: "size-4",
										strokeWidth: 1.75
									}), "Sit / stand"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamp, {
										className: "size-4",
										strokeWidth: 1.75
									}), "Fairy lights + doors"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-subtle",
									children: "Shift sprint · Esc pause"
								})
							]
						})
					]
				})
			}),
			phase === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-medium tracking-[-0.03em]",
							children: "Paused"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "Pointer unlocked. Resume to keep walking the room."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									useGame.getState().resume();
									lockPointer();
								},
								children: "Resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => useGame.getState().toggleMute(),
								children: muted ? "Unmute" : "Mute"
							})]
						})
					]
				})
			}),
			phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				pose === "stand" && !coarse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/80",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "haven-hud absolute left-4 top-4 rounded-2xl border border-border bg-surface/80 px-3 py-2 text-xs text-muted backdrop-blur-sm sm:left-6 sm:top-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium text-fg",
						children: place === "hallway" ? "Hallway" : place === "balcony" ? "Balcony" : "Room"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: pose === "desk" ? "Working" : pose === "bed" ? "Resting" : pose === "balconyChair" ? "Looking out" : "On foot" })]
				}),
				prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-8 flex justify-center px-4 sm:bottom-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border border-border bg-surface/85 px-4 py-2 text-sm text-prompt backdrop-blur-sm",
						children: prompt
					})
				}),
				coarse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pointer-events-auto absolute right-4 top-4 size-12 rounded-2xl border border-border bg-surface/85 text-sm text-fg",
					onClick: () => useGame.getState().pause(),
					children: "Pause"
				})
			] })
		]
	});
}
function WebGLError() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col items-start justify-center bg-bg px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl text-fg",
			children: "Haven needs WebGL"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-md text-muted",
			children: "This room is a 3D scene. Try another browser if the canvas cannot start."
		})]
	});
}
var GAME_CODES = /* @__PURE__ */ new Set([
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
	"ArrowRight"
]);
var keys = /* @__PURE__ */ new Set();
var edges = /* @__PURE__ */ new Set();
var lookX = 0;
var lookY = 0;
var touchX = 0;
var touchY = 0;
var lookSens = 1;
var bound = false;
function onKeyDown(e) {
	if (e.repeat) {
		keys.add(e.code);
		return;
	}
	keys.add(e.code);
	edges.add(e.code);
	if (GAME_CODES.has(e.code)) e.preventDefault();
}
function onKeyUp(e) {
	keys.delete(e.code);
}
function onBlur() {
	keys.clear();
	edges.clear();
	touchX = 0;
	touchY = 0;
	dragging = false;
}
var dragging = false;
function onMouseMove(e) {
	if (document.pointerLockElement || dragging) {
		lookX += e.movementX;
		lookY += e.movementY;
	}
}
function onMouseDown(e) {
	if (e.button !== 0 || document.pointerLockElement) return;
	if (e.target?.closest("button, a, input, [role='button']")) return;
	dragging = true;
}
function onMouseUp() {
	dragging = false;
}
var input = {
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
	setTouchMove(x, y) {
		touchX = x;
		touchY = y;
	},
	addLook(dx, dy) {
		lookX += dx;
		lookY += dy;
	},
	setKeys(codes) {
		keys.clear();
		edges.clear();
		for (const c of codes) keys.add(c);
	},
	pulse(code) {
		keys.add(code);
		edges.add(code);
		queueMicrotask(() => keys.delete(code));
	},
	has(code) {
		return keys.has(code);
	},
	poll() {
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
			lookX: lx,
			lookY: ly
		};
	}
};
function TouchControls() {
	const coarse = useGame((s) => s.coarse);
	const phase = useGame((s) => s.phase);
	const stick = (0, import_react.useRef)(null);
	const knob = (0, import_react.useRef)(null);
	const pid = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!coarse || phase !== "playing") return;
		const lookEl = document.getElementById("haven-look");
		if (!lookEl) return;
		let lookId = null;
		let lastX = 0;
		let lastY = 0;
		const down = (e) => {
			if (lookId !== null) return;
			lookId = e.pointerId;
			lastX = e.clientX;
			lastY = e.clientY;
			lookEl.setPointerCapture(e.pointerId);
		};
		const move = (e) => {
			if (e.pointerId !== lookId) return;
			input.addLook((e.clientX - lastX) * 1.6, (e.clientY - lastY) * 1.6);
			lastX = e.clientX;
			lastY = e.clientY;
		};
		const up = (e) => {
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
	const onStickDown = (e) => {
		pid.current = e.pointerId;
		e.currentTarget.setPointerCapture(e.pointerId);
		moveStick(e);
	};
	const moveStick = (e) => {
		if (pid.current !== e.pointerId || !stick.current || !knob.current) return;
		const r = stick.current.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;
		let dx = e.clientX - cx;
		let dy = e.clientY - cy;
		const max = r.width / 2 - 18;
		const m = Math.hypot(dx, dy);
		if (m > max) {
			dx = dx / m * max;
			dy = dy / m * max;
		}
		knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
		input.setTouchMove(dx / max, -dy / max);
	};
	const onStickUp = (e) => {
		if (pid.current !== e.pointerId) return;
		pid.current = null;
		if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
		input.setTouchMove(0, 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "haven-look",
				className: "pointer-events-auto absolute inset-y-0 right-0 w-1/2 touch-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: stick,
				className: "pointer-events-auto absolute bottom-8 left-6 size-[120px] touch-none rounded-full border border-border bg-surface/50",
				onPointerDown: onStickDown,
				onPointerMove: moveStick,
				onPointerUp: onStickUp,
				onPointerCancel: onStickUp,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: knob,
					className: "absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/90"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pointer-events-auto absolute bottom-8 right-6 flex size-14 touch-none items-center justify-center rounded-full border border-border bg-surface/80 text-sm font-medium text-fg",
				onPointerDown: (e) => {
					e.preventDefault();
					input.pulse("KeyE");
				},
				children: "E"
			})
		]
	});
}
var ROOM = {
	minX: -2.25,
	maxX: 2.45,
	minZ: -3.2,
	maxZ: 2.1,
	height: 2.78,
	wall: .12,
	doorW: .9
};
var DOORS = {
	entranceX: -.9,
	balconyX: -.22,
	windowX: 1.28,
	windowW: 1.42
};
var HALL = {
	minX: -1.45,
	maxX: -.35,
	minZ: 2.1,
	maxZ: 4.05
};
var BALCONY = {
	minX: -1.55,
	maxX: 1.6,
	minZ: -5.55,
	maxZ: -3.2
};
var SPAWN = {
	x: -.9,
	y: 0,
	z: 3.25
};
var PLAYER = {
	radius: .26,
	eye: 1.62,
	sitEye: 1.14,
	bedEye: .9,
	walk: 2.85,
	sprint: 4.55,
	accel: 14,
	jump: 4.4,
	gravity: 16,
	mouse: .0022
};
var SPOTS = {
	bed: {
		x: 1.28,
		z: -1.35,
		r: .95
	},
	desk: {
		x: -1,
		z: -1,
		r: .65
	},
	balconyChair: {
		x: .15,
		z: -4.95,
		r: .95
	},
	entrance: {
		x: -.9,
		z: 2.1,
		r: 1.05
	},
	balconyDoor: {
		x: -.22,
		z: -3.15,
		r: 1.05
	},
	lamp: {
		x: -1.35,
		z: -2.45,
		r: .9
	}
};
var SIT = {
	bed: {
		x: 1.28,
		y: .82,
		z: -1.52,
		yaw: .35,
		pitch: -.06
	},
	desk: {
		x: -1,
		y: 1.12,
		z: -1,
		yaw: Math.PI / 2,
		pitch: .22
	},
	balconyChair: {
		x: .12,
		y: 1.22,
		z: -5.05,
		yaw: .02,
		pitch: -.1
	}
};
var MatsContext = (0, import_react.createContext)(null);
var MatsProvider = MatsContext.Provider;
function useMats() {
	const m = (0, import_react.useContext)(MatsContext);
	if (!m) throw new Error("MatsProvider missing");
	return m;
}
function DoorPanel({ width, height, clothes = false }) {
	const m = useMats();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				width / 2,
				height / 2,
				0
			],
			castShadow: true,
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				width,
				height,
				.05
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				width - .08,
				height / 2,
				.03
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.028,
				10,
				8
			] })
		}),
		clothes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				width * .45,
				height * .72,
				.04
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.12,
						-.18,
						0
					],
					material: m.black,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.16,
						.55,
						.04
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.08,
						-.12,
						.02
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.18,
						.48,
						.04
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#2a6a8a",
						roughness: .85
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.22,
						-.22,
						.01
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.14,
						.4,
						.03
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#3d4a38",
						roughness: .85
					})]
				})
			]
		})
	] });
}
function Doors() {
	const m = useMats();
	const entrance = (0, import_react.useRef)(null);
	const balcony = (0, import_react.useRef)(null);
	const half = ROOM.doorW / 2;
	const h = 2.35;
	useFrame((_, delta) => {
		const k = 1 - Math.exp(-8 * Math.min(delta, .1));
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.entranceX - half - .05,
				h / 2,
				ROOM.maxZ
			],
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				h,
				.12
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.entranceX + half + .05,
				h / 2,
				ROOM.maxZ
			],
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				h,
				.12
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.entranceX,
				2.39,
				ROOM.maxZ
			],
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				ROOM.doorW + .16,
				.08,
				.12
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: entrance,
			position: [
				DOORS.entranceX - half,
				0,
				ROOM.maxZ
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorPanel, {
				width: ROOM.doorW - .04,
				height: h,
				clothes: true
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.balconyX - half - .05,
				h / 2,
				ROOM.minZ
			],
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				h,
				.12
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.balconyX + half + .05,
				h / 2,
				ROOM.minZ
			],
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				h,
				.12
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.balconyX,
				2.39,
				ROOM.minZ
			],
			material: m.door,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				ROOM.doorW + .16,
				.08,
				.12
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: balcony,
			position: [
				DOORS.balconyX - half,
				0,
				ROOM.minZ
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorPanel, {
				width: ROOM.doorW - .04,
				height: h
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.balconyX + .55,
				1.55,
				ROOM.minZ + .08
			],
			rotation: [
				0,
				0,
				.4
			],
			material: m.darkWood,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.012,
				.012,
				.18,
				6
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				DOORS.balconyX + .62,
				1.62,
				ROOM.minZ + .08
			],
			rotation: [
				0,
				0,
				-.5
			],
			material: m.darkWood,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.012,
				.012,
				.14,
				6
			] })
		})
	] });
}
function Palm({ position }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.6,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.07,
				.11,
				3.2,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#6b5340",
				roughness: .85
			})]
		}), [
			0,
			1,
			2,
			3,
			4
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				Math.sin(i * Math.PI * 2 / 5) * .45,
				3.15,
				Math.cos(i * Math.PI * 2 / 5) * .45
			],
			rotation: [
				.6,
				i * Math.PI * 2 / 5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.32,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2f5a28",
				roughness: .8
			})]
		}, i))]
	});
}
function Building({ position, size }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: size }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e6e2da",
				roughness: .85
			})]
		}), [-.35, .35].map((ox) => [.3, -.35].map((oy) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				ox,
				oy,
				size[2] / 2 + .01
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.28, .38] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c5d0d8",
				roughness: .3
			})]
		}, `${ox}${oy}`)))]
	});
}
function Exterior() {
	const m = useMats();
	const zRail = BALCONY.minZ + .08;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			material: m.sky,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				48,
				24,
				16
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				5.2,
				-18
			],
			material: m.city,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [42, 16] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.02,
				-14
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [40, 28] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#7a9a4a",
				roughness: .95
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.01,
				-16
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [12, 8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c4b07a",
				roughness: .9
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, {
			position: [
				-6.2,
				2.2,
				-11
			],
			size: [
				2.4,
				4.4,
				2.2
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, {
			position: [
				6.4,
				2.4,
				-11.5
			],
			size: [
				2.2,
				4.8,
				2
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palm, { position: [
			-3.4,
			0,
			-9.5
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palm, { position: [
			.2,
			0,
			-12
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palm, { position: [
			3.6,
			0,
			-10
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.4,
				4.2,
				-14
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.06,
				.08,
				8.4,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8a8a88",
				metalness: .4,
				roughness: .5
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.4,
				8.3,
				-14
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.1,
				.12,
				.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6a6a68" })]
		}),
		[
			-2.2,
			-.7,
			.8,
			2.2
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.55,
				-8.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.55,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3d6a32",
				roughness: .85
			})]
		}, x)),
		[
			-1.4,
			-.7,
			0,
			.7,
			1.4
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				x,
				.55,
				zRail
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.04,
				1.1,
				.04
			] })
		}, x)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				1.08,
				zRail
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				3.1,
				.045,
				.045
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				.55,
				zRail
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				3.1,
				.035,
				.035
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				BALCONY.minX + .04,
				.55,
				(BALCONY.minZ + BALCONY.maxZ) / 2
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.04,
				1.1,
				BALCONY.maxZ - BALCONY.minZ
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				BALCONY.maxX - .04,
				.55,
				(BALCONY.minZ + BALCONY.maxZ) / 2
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.04,
				1.1,
				BALCONY.maxZ - BALCONY.minZ
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				.08,
				zRail + .12
			],
			material: m.concrete,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				3.15,
				.16,
				.28
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.85,
				.22,
				zRail + .1
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.04,
				.04,
				.18,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3a5a9a",
				roughness: .5
			})]
		})
	] });
}
function canvas(w, h) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const g = c.getContext("2d");
	if (!g) throw new Error("2d");
	return {
		c,
		g
	};
}
function tex(c, repeat = 1) {
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	t.wrapS = t.wrapT = RepeatWrapping;
	t.repeat.set(repeat, repeat);
	t.anisotropy = 8;
	t.needsUpdate = true;
	return t;
}
function noiseFill(color, speckle) {
	const { c, g } = canvas(256, 256);
	g.fillStyle = color;
	g.fillRect(0, 0, 256, 256);
	g.fillStyle = speckle;
	for (let i = 0; i < 1400; i++) {
		g.globalAlpha = .04 + Math.random() * .08;
		g.fillRect(Math.random() * 256, Math.random() * 256, 1.2, 1.2);
	}
	g.globalAlpha = 1;
	return tex(c, 2);
}
function tiles() {
	const { c, g } = canvas(512, 512);
	g.fillStyle = "#d8d2c6";
	g.fillRect(0, 0, 512, 512);
	g.strokeStyle = "#c4bdb0";
	g.lineWidth = 3;
	for (let i = 0; i <= 512; i += 128) {
		g.beginPath();
		g.moveTo(i, 0);
		g.lineTo(i, 512);
		g.moveTo(0, i);
		g.lineTo(512, i);
		g.stroke();
	}
	g.fillStyle = "#efeae0";
	for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
		g.globalAlpha = .25;
		g.fillRect(x * 128 + 6, y * 128 + 6, 116, 116);
	}
	g.globalAlpha = 1;
	return tex(c, 6);
}
function felt() {
	const { c, g } = canvas(256, 256);
	g.fillStyle = "#8d939a";
	g.fillRect(0, 0, 256, 256);
	for (let i = 0; i < 4e3; i++) {
		g.fillStyle = i % 3 === 0 ? "#9aa0a6" : "#7c8288";
		g.globalAlpha = .15;
		g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
	}
	g.globalAlpha = 1;
	return tex(c, 2);
}
function curtain() {
	const { c, g } = canvas(256, 512);
	const grd = g.createLinearGradient(0, 0, 0, 512);
	grd.addColorStop(0, "#3d6a78");
	grd.addColorStop(.45, "#2f5c6a");
	grd.addColorStop(1, "#1c3340");
	g.fillStyle = grd;
	g.fillRect(0, 0, 256, 512);
	g.globalAlpha = .22;
	g.fillStyle = "#d5e6ea";
	for (let i = 0; i < 18; i++) {
		const x = 20 + i % 6 * 38;
		const y = 30 + Math.floor(i / 6) * 90;
		g.beginPath();
		g.ellipse(x, y, 16, 28, 0, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = 1;
	return tex(c, 1);
}
function sheet() {
	const { c, g } = canvas(256, 256);
	g.fillStyle = "#9eb8c8";
	g.fillRect(0, 0, 256, 256);
	g.strokeStyle = "#5d7a8a";
	g.lineWidth = 2;
	for (let y = 8; y < 256; y += 22) for (let x = 8; x < 256; x += 22) {
		g.strokeRect(x, y, 14, 14);
		g.beginPath();
		g.moveTo(x + 7, y);
		g.lineTo(x + 7, y + 14);
		g.moveTo(x, y + 7);
		g.lineTo(x + 14, y + 7);
		g.stroke();
	}
	return tex(c, 2);
}
function folkRug() {
	const { c, g } = canvas(256, 512);
	g.fillStyle = "#1f4a38";
	g.fillRect(0, 0, 256, 512);
	g.fillStyle = "#e8e0c8";
	const tree = (x, y, s) => {
		g.beginPath();
		g.moveTo(x, y);
		g.lineTo(x - 18 * s, y + 40 * s);
		g.lineTo(x + 18 * s, y + 40 * s);
		g.closePath();
		g.fill();
		g.fillRect(x - 3 * s, y + 40 * s, 6 * s, 14 * s);
	};
	tree(70, 40, 1.1);
	tree(186, 70, .9);
	tree(80, 160, 1);
	tree(190, 200, 1.15);
	tree(70, 300, .95);
	tree(180, 340, 1.05);
	g.beginPath();
	g.ellipse(128, 455, 22, 12, 0, 0, Math.PI * 2);
	g.fill();
	g.fillRect(120, 455, 16, 28);
	g.fillRect(8, 8, 240, 6);
	g.fillRect(8, 498, 240, 6);
	return tex(c, 1);
}
function field() {
	const { c, g } = canvas(1024, 512);
	const sky = g.createLinearGradient(0, 0, 0, 280);
	sky.addColorStop(0, "#7ec4ef");
	sky.addColorStop(1, "#cfe8f6");
	g.fillStyle = sky;
	g.fillRect(0, 0, 1024, 280);
	g.fillStyle = "#d8c49a";
	g.fillRect(0, 280, 1024, 80);
	g.fillStyle = "#7a9a4a";
	g.fillRect(0, 330, 1024, 182);
	g.fillStyle = "#6b8c3e";
	g.fillRect(180, 300, 660, 90);
	g.strokeStyle = "#cfc8b8";
	g.lineWidth = 2;
	g.strokeRect(200, 310, 620, 70);
	g.fillStyle = "#e8e4dc";
	g.fillRect(40, 160, 160, 200);
	g.fillRect(820, 150, 150, 210);
	g.fillStyle = "#d4cfc6";
	g.fillRect(55, 175, 40, 50);
	g.fillRect(110, 175, 40, 50);
	g.fillRect(55, 240, 40, 50);
	g.fillRect(845, 170, 36, 46);
	g.fillRect(890, 170, 36, 46);
	g.fillStyle = "#2f4a28";
	for (let i = 0; i < 9; i++) {
		const x = 90 + i * 100;
		g.beginPath();
		g.arc(x, 355, 28 + i % 3 * 8, 0, Math.PI * 2);
		g.fill();
	}
	g.fillStyle = "#6a6a68";
	g.fillRect(508, 120, 6, 200);
	g.fillRect(492, 118, 38, 8);
	return tex(c, 1);
}
function sky() {
	const { c, g } = canvas(8, 256);
	const grd = g.createLinearGradient(0, 0, 0, 256);
	grd.addColorStop(0, "#5eb0e0");
	grd.addColorStop(.45, "#a8d6f0");
	grd.addColorStop(1, "#e7e2d4");
	g.fillStyle = grd;
	g.fillRect(0, 0, 8, 256);
	const t = tex(c, 1);
	t.wrapS = t.wrapT = ClampToEdgeWrapping;
	t.repeat.set(1, 1);
	return t;
}
function whiteboard() {
	const { c, g } = canvas(256, 320);
	g.fillStyle = "#eef3f6";
	g.fillRect(0, 0, 256, 320);
	g.strokeStyle = "#3a6a8a";
	g.lineWidth = 2;
	g.strokeRect(8, 8, 240, 304);
	g.fillStyle = "#2c4a5c";
	g.font = "16px ui-sans-serif, sans-serif";
	g.fillText("notes", 24, 40);
	g.strokeStyle = "#6a8aa0";
	g.beginPath();
	g.moveTo(24, 70);
	g.lineTo(200, 78);
	g.moveTo(24, 100);
	g.lineTo(180, 92);
	g.moveTo(24, 130);
	g.lineTo(210, 140);
	g.stroke();
	return tex(c, 1);
}
function createMaterials() {
	const tileMap = tiles();
	const plaster = noiseFill("#efe8dc", "#c8bba8");
	const hallPlaster = noiseFill("#efe8dc", "#c8bba8");
	const linenMap = noiseFill("#e6ddd0", "#8a7c6c");
	const sheetMap = sheet();
	const rugMap = folkRug();
	const fieldMap = field();
	const artMap = whiteboard();
	const skyMap = sky();
	const feltMap = felt();
	const curtainMap = curtain();
	const { c: sc, g: sg } = canvas(512, 320);
	const screenTex = tex(sc, 1);
	screenTex.wrapS = screenTex.wrapT = ClampToEdgeWrapping;
	screenTex.repeat.set(1, 1);
	const wall = new MeshStandardMaterial({
		map: plaster,
		roughness: .92,
		color: "#f3eee6"
	});
	const wallHall = new MeshStandardMaterial({
		map: hallPlaster,
		roughness: .9,
		color: "#f3eee6"
	});
	const floor = new MeshStandardMaterial({
		map: tileMap,
		roughness: .28,
		metalness: .08
	});
	const floorHall = new MeshStandardMaterial({
		map: tileMap,
		roughness: .3
	});
	const ceil = new MeshStandardMaterial({
		color: "#f6f1e8",
		roughness: .95
	});
	const darkWood = new MeshStandardMaterial({
		color: "#5a3a32",
		roughness: .7
	});
	const lightWood = new MeshStandardMaterial({
		color: "#c4a078",
		roughness: .65
	});
	const linen = new MeshStandardMaterial({
		map: linenMap,
		roughness: .9
	});
	const duvet = new MeshStandardMaterial({
		map: sheetMap,
		roughness: .88
	});
	const pillow = new MeshStandardMaterial({
		color: "#c45a48",
		roughness: .85
	});
	const metal = new MeshStandardMaterial({
		color: "#c5c8cc",
		roughness: .35,
		metalness: .65
	});
	const black = new MeshStandardMaterial({
		color: "#1a1c20",
		roughness: .4,
		metalness: .3
	});
	const glass = new MeshStandardMaterial({
		color: "#c5d8e6",
		transparent: true,
		opacity: .28,
		roughness: .08,
		metalness: .12,
		depthWrite: false
	});
	const plant = new MeshStandardMaterial({
		color: "#3d6a40",
		roughness: .7
	});
	const pot = new MeshStandardMaterial({
		color: "#d2b48c",
		roughness: .8
	});
	const rugMat = new MeshStandardMaterial({
		map: rugMap,
		roughness: .95
	});
	const cityMat = new MeshBasicMaterial({ map: fieldMap });
	const art = new MeshStandardMaterial({
		map: artMap,
		roughness: .8
	});
	const skyMat = new MeshBasicMaterial({
		map: skyMap,
		side: 1,
		depthWrite: false
	});
	const concrete = new MeshStandardMaterial({
		color: "#c8c2b8",
		roughness: .9
	});
	const lampShade = new MeshStandardMaterial({
		color: "#f4e2a8",
		emissive: "#f0d078",
		emissiveIntensity: .55,
		roughness: .6
	});
	const screen = new MeshBasicMaterial({ map: screenTex });
	const feltMat = new MeshStandardMaterial({
		map: feltMap,
		roughness: .95,
		color: "#9aa0a6"
	});
	const curtainMat = new MeshStandardMaterial({
		map: curtainMap,
		roughness: .9,
		transparent: true,
		opacity: .92,
		side: 2
	});
	const desk = new MeshStandardMaterial({
		color: "#b7bcc2",
		roughness: .55
	});
	const door = new MeshStandardMaterial({
		color: "#4a302c",
		roughness: .72
	});
	const maps = [
		tileMap,
		plaster,
		hallPlaster,
		linenMap,
		sheetMap,
		rugMap,
		fieldMap,
		artMap,
		skyMap,
		feltMap,
		curtainMap,
		screenTex
	];
	const mats = [
		wall,
		wallHall,
		floor,
		floorHall,
		ceil,
		darkWood,
		lightWood,
		linen,
		duvet,
		pillow,
		metal,
		black,
		glass,
		plant,
		pot,
		rugMat,
		cityMat,
		art,
		skyMat,
		concrete,
		lampShade,
		screen,
		feltMat,
		curtainMat,
		desk,
		door
	];
	return {
		wall,
		wallHall,
		floor,
		floorHall,
		ceil,
		darkWood,
		lightWood,
		linen,
		duvet,
		pillow,
		metal,
		black,
		glass,
		plant,
		pot,
		rug: rugMat,
		city: cityMat,
		art,
		sky: skyMat,
		concrete,
		lampShade,
		screen,
		felt: feltMat,
		curtain: curtainMat,
		desk,
		door,
		screenTex,
		screenCanvas: sc,
		screenCtx: sg,
		dispose() {
			for (const m of maps) m.dispose();
			for (const m of mats) m.dispose();
		}
	};
}
var CODE = [
	"notes.md",
	"",
	"practice, then the field.",
	"keys on the left, laptop right.",
	"blue curtains, green rug.",
	"",
	"sit. work. look out."
];
function paintLaptop(ctx, texMap, t, working) {
	const w = 512;
	const h = 320;
	ctx.fillStyle = "#1a2330";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#243044";
	ctx.fillRect(0, 0, 44, h);
	ctx.fillStyle = "#e7eef4";
	ctx.font = "600 22px ui-sans-serif, sans-serif";
	ctx.fillText("Haven", 64, 42);
	ctx.font = "16px ui-monospace, monospace";
	const typed = working ? Math.min(CODE.length, 2 + Math.floor(t * 1.4 % (CODE.length + 2))) : CODE.length;
	for (let i = 0; i < typed && i < CODE.length; i++) {
		ctx.fillStyle = i === 0 ? "#e7eef4" : "#9ec4b0";
		ctx.fillText(CODE[i] ?? "", 64, 84 + i * 28);
	}
	if (working && Math.sin(t * 6) > 0) {
		ctx.fillStyle = "#e7eef4";
		ctx.fillRect(64, 84 + Math.min(typed, CODE.length - 1) * 28 + 4, 10, 16);
	}
	ctx.fillStyle = "#2a3544";
	ctx.fillRect(0, 292, w, 28);
	ctx.fillStyle = "#8aa0b0";
	ctx.font = "13px ui-sans-serif, sans-serif";
	ctx.fillText(working ? "editing · notes.md" : "idle", 16, 310);
	texMap.needsUpdate = true;
}
function useMaterials() {
	const mats = (0, import_react.useMemo)(() => createMaterials(), []);
	(0, import_react.useEffect)(() => () => mats.dispose(), [mats]);
	return mats;
}
function Ivy({ origin }) {
	const pts = (0, import_react.useMemo)(() => {
		const a = [];
		for (let i = 0; i < 28; i++) a.push([
			i % 7 * .16 - .48,
			.15 + Math.floor(i / 7) * .28 + i % 3 * .04,
			i % 2 * .02
		]);
		return a;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: origin,
		rotation: [
			0,
			Math.PI * .5,
			0
		],
		children: pts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: p,
			rotation: [
				.4,
				i * .3,
				.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.045,
				6,
				5
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: i % 3 === 0 ? "#4a7a3c" : "#2f5a32",
				roughness: .8
			})]
		}, i))
	});
}
function Piano() {
	const keys = (0, import_react.useMemo)(() => Array.from({ length: 24 }, (_, i) => i), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.04,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.78,
				.08,
				.22
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a1a1c",
				roughness: .45
			})]
		}),
		keys.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.35 + i * .03,
				.085,
				.02
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.026,
				.012,
				.16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f4f1ea",
				roughness: .4
			})]
		}, i)),
		[
			1,
			2,
			4,
			5,
			6,
			8,
			9,
			11,
			12,
			13,
			15,
			16,
			18,
			19,
			20,
			22
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.335 + i * .03,
				.095,
				-.02
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.016,
				.014,
				.1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#111113",
				roughness: .35
			})]
		}, `b${i}`))
	] });
}
function Laptop() {
	const m = useMats();
	useFrame((state) => {
		const t = state.clock.elapsedTime;
		if (Math.floor(t * 12) % 2 === 0) return;
		paintLaptop(m.screenCtx, m.screenTex, t, useGame.getState().pose === "desk");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			castShadow: true,
			material: m.black,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.32,
				.014,
				.22
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				.12,
				-.1
			],
			rotation: [
				-.2,
				0,
				0
			],
			castShadow: true,
			material: m.black,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.32,
				.2,
				.012
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				.12,
				-.093
			],
			rotation: [
				-.2,
				0,
				0
			],
			material: m.screen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.28, .16] })
		})
	] });
}
function OfficeChair({ position }) {
	const m = useMats();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		rotation: [
			0,
			Math.PI * -.5,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.5,
					0
				],
				castShadow: true,
				material: m.black,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.46,
					.08,
					.46
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.88,
					-.18
				],
				castShadow: true,
				material: m.black,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.46,
					.7,
					.08
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.28,
					0
				],
				material: m.metal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.04,
					.04,
					.36,
					8
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.1,
					0
				],
				material: m.black,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.22,
					.22,
					.04,
					10
				] })
			})
		]
	});
}
function Furniture() {
	const m = useMats();
	const lampOn = useGame((s) => s.lampOn);
	const atDesk = useGame((s) => s.pose === "desk");
	useFrame(() => {
		m.lampShade.emissiveIntensity = useGame.getState().lampOn ? .7 : .04;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-1.82,
				0,
				-1
			],
			rotation: [
				0,
				Math.PI * .5,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						.75,
						0
					],
					castShadow: true,
					receiveShadow: true,
					material: m.desk,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.28,
						.05,
						.62
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.42,
						.36,
						0
					],
					castShadow: true,
					material: m.desk,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.42,
						.72,
						.6
					] })
				}),
				[
					.18,
					.36,
					.54
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.22,
						y,
						.31
					],
					material: m.metal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.12,
						.018,
						.02
					] })
				}, y)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						.5,
						.36,
						-.26
					],
					material: m.desk,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.05,
						.72,
						.05
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						.5,
						.36,
						.26
					],
					material: m.desk,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.05,
						.72,
						.05
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					position: [
						-.28,
						.8,
						.02
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Piano, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					position: [
						.38,
						.79,
						.06
					],
					rotation: [
						0,
						.08,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.02,
						.86,
						.08
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.035,
						.04,
						.2,
						12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#c5c8cc",
						metalness: .7,
						roughness: .3
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.28,
						.79,
						.18
					],
					rotation: [
						0,
						.3,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.28,
						.03,
						.18
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#c8c4bc",
						roughness: .9
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.48,
						.84,
						-.12
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.16,
						.12,
						.12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#d8c8a8",
						roughness: .8
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.58,
						.82,
						.2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.035,
						.04,
						.12,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#7aaf4a",
						roughness: .6
					})]
				})
			]
		}),
		atDesk && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				-.95,
				1.05,
				-2.45
			],
			intensity: 1.8,
			distance: 3.2,
			decay: 2,
			color: "#e3e6e9"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeChair, { position: [
			-1,
			0,
			-1
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				-2.2,
				1.55,
				-1
			],
			rotation: [
				0,
				Math.PI * .5,
				0
			],
			material: m.felt,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.45, 1.35] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				-2.2,
				2.28,
				-.65
			],
			rotation: [
				0,
				Math.PI * .5,
				0
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.79,
				.04,
				.22
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				-2.2,
				2.28,
				-1.4
			],
			rotation: [
				0,
				Math.PI * .5,
				0
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.7,
				.04,
				.22
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ivy, { origin: [
			-2.1,
			1,
			-1
		] }),
		lampOn && [
			[-1.5, 1.98],
			[-1.5, 2.05],
			[-1.28, 1.85],
			[-1.08, 2.1],
			[-.88, 1.92]
		].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				x,
				y,
				-3.06
			],
			material: m.lampShade,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.025,
				8,
				8
			] })
		}, i)),
		lampOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				-2,
				1.5,
				-1
			],
			intensity: 4.2,
			distance: 5.5,
			decay: 2,
			color: "#f3e0a8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-2,
				1.2,
				-.7
			],
			rotation: [
				0,
				Math.PI * .5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				.08,
				.02
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f4f1ea" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-2,
				1.2,
				-.8
			],
			rotation: [
				0,
				Math.PI * .5,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				.08,
				.02
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#f4f1ea" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-2.02,
				.18,
				-0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.16,
				.14,
				.36,
				14
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e0c8b0",
				roughness: .7
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				-1.15,
				.012,
				-1.85
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.32, 16] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c4b08a",
				roughness: .95
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				1.28,
				0,
				-1.72
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.32,
						0
					],
					castShadow: true,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.92,
						.12,
						1.92
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#e8e4dc",
						roughness: .7
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						.42,
						0
					],
					castShadow: true,
					material: m.duvet,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.88,
						.1,
						1.86
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.4,
						.38,
						0
					],
					material: m.linen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.06,
						.42,
						1.92
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						.4,
						.38,
						0
					],
					material: m.linen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.06,
						.42,
						1.92
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						.38,
						.93
					],
					material: m.linen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.92,
						.42,
						.06
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.12,
						.58,
						-.72
					],
					rotation: [
						.2,
						.3,
						0
					],
					material: m.pillow,
					castShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.38,
						.14,
						.28
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.2,
						.56,
						-.68
					],
					rotation: [
						.15,
						-.2,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.36,
						.12,
						.26
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#d4a07a",
						roughness: .85
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.18,
						.5,
						.15
					],
					rotation: [
						.1,
						.4,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.5,
						.06,
						.7
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#6b3a32",
						roughness: .9
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.42,
						.55,
						.55
					],
					rotation: [
						.2,
						0,
						.15
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.22,
						.08,
						.7
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#2a3038",
						roughness: .9
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				.52,
				.014,
				-1.55
			],
			receiveShadow: true,
			material: m.rug,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.78, 1.55] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				2.22,
				0,
				.55
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						0,
						1.08,
						0
					],
					castShadow: true,
					receiveShadow: true,
					material: m.desk,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.52,
						2.16,
						1.55
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.27,
						1.1,
						-.02
					],
					material: m.metal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.02,
						.08,
						.02
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					position: [
						-.27,
						1.1,
						.12
					],
					material: m.metal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.02,
						.08,
						.02
					] })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				2.38,
				1.35,
				-.55
			],
			rotation: [
				0,
				-Math.PI / 2,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.55, 1.15] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#b8c8d4",
				metalness: .6,
				roughness: .15
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				2.36,
				1.35,
				-.55
			],
			rotation: [
				0,
				-Math.PI / 2,
				0
			],
			material: m.linen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.6,
				1.22,
				.03
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				-0,
				1.5,
				2
			],
			rotation: [
				0,
				Math.PI,
				0
			],
			material: m.art,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.7, .95] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				1.55,
				1.7,
				-3.12
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.08, 10] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3a3a38",
				roughness: .6
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				2,
				1.55,
				1.7
			],
			rotation: [
				0,
				-Math.PI / 2,
				.35
			],
			material: m.darkWood,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.012,
				.012,
				.22,
				6
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				2,
				1.62,
				1.78
			],
			rotation: [
				0,
				-Math.PI / 2,
				-.5
			],
			material: m.darkWood,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.012,
				.012,
				.16,
				6
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				1.85,
				0,
				1.85
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.14,
					0
				],
				material: m.pot,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.08,
					.28,
					10
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					.42,
					0
				],
				material: m.plant,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.2,
					10,
					8
				] })
			})]
		})
	] });
}
function box(minX, maxX, minZ, maxZ) {
	return {
		minX,
		maxX,
		minZ,
		maxZ
	};
}
function worldColliders(open) {
	const w = ROOM.wall;
	const half = ROOM.doorW / 2;
	const e0 = DOORS.entranceX - half;
	const e1 = DOORS.entranceX + half;
	const b0 = DOORS.balconyX - half;
	const b1 = DOORS.balconyX + half;
	const walls = [
		box(ROOM.minX - w, ROOM.minX, ROOM.minZ, ROOM.maxZ),
		box(ROOM.maxX, ROOM.maxX + w, ROOM.minZ, ROOM.maxZ),
		box(ROOM.minX - w, e0, ROOM.maxZ, ROOM.maxZ + w),
		box(e1, ROOM.maxX + w, ROOM.maxZ, ROOM.maxZ + w),
		box(ROOM.minX - w, b0, ROOM.minZ - w, ROOM.minZ),
		box(b1, ROOM.maxX + w, ROOM.minZ - w, ROOM.minZ),
		box(HALL.minX - w, HALL.minX, HALL.minZ, HALL.maxZ),
		box(HALL.maxX, HALL.maxX + w, HALL.minZ, HALL.maxZ),
		box(HALL.minX - w, HALL.maxX + w, HALL.maxZ, HALL.maxZ + w),
		box(BALCONY.minX - w, BALCONY.minX, BALCONY.minZ, BALCONY.maxZ),
		box(BALCONY.maxX, BALCONY.maxX + w, BALCONY.minZ, BALCONY.maxZ),
		box(BALCONY.minX - w, BALCONY.maxX + w, BALCONY.minZ - w, BALCONY.minZ),
		box(-2.13, -1.5, -1.64, -.36),
		box(.78, 1.78, -2.7, -.72),
		box(1.9, 2.5, -.25, 1.35),
		box(-2.2, -1.85, -2.25, -1.85)
	];
	if (!open.entranceOpen) walls.push(box(e0 + .04, e1 - .04, ROOM.maxZ - .08, ROOM.maxZ + .08));
	if (!open.balconyOpen) walls.push(box(b0 + .04, b1 - .04, ROOM.minZ - .08, ROOM.minZ + .08));
	return walls;
}
function resolveCircle(x, z, boxes, radius = PLAYER.radius) {
	for (const b of boxes) {
		const cx = Math.max(b.minX, Math.min(x, b.maxX));
		const cz = Math.max(b.minZ, Math.min(z, b.maxZ));
		let dx = x - cx;
		let dz = z - cz;
		const d2 = dx * dx + dz * dz;
		if (d2 === 0) {
			const left = x - b.minX;
			const right = b.maxX - x;
			const down = z - b.minZ;
			const up = b.maxZ - z;
			const m = Math.min(left, right, down, up);
			if (m === left) x = b.minX - radius;
			else if (m === right) x = b.maxX + radius;
			else if (m === down) z = b.minZ - radius;
			else z = b.maxZ + radius;
			continue;
		}
		if (d2 < radius * radius) {
			const d = Math.sqrt(d2);
			const k = (radius - d) / d;
			x += dx * k;
			z += dz * k;
		}
	}
	return {
		x,
		z
	};
}
var PITCH_LIM = Math.PI / 2 - .08;
var tmp = new Vector3();
function dist2(ax, az, bx, bz) {
	const dx = ax - bx;
	const dz = az - bz;
	return dx * dx + dz * dz;
}
function nearestSpot(x, z) {
	let best = null;
	let bestD = Infinity;
	for (const id of Object.keys(SPOTS)) {
		const s = SPOTS[id];
		const d = dist2(x, z, s.x, s.z);
		if (d <= s.r * s.r && d < bestD) {
			best = id;
			bestD = d;
		}
	}
	return best;
}
function placeOf(x, z) {
	if (z > 2.12) return "hallway";
	if (z < -3.2) return "balcony";
	return "loft";
}
function promptFor(id, open, pose) {
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
function Player() {
	const { camera, gl } = useThree();
	const yaw = (0, import_react.useRef)(0);
	const pitch = (0, import_react.useRef)(0);
	const x = (0, import_react.useRef)(SPAWN.x);
	const y = (0, import_react.useRef)(SPAWN.y);
	const z = (0, import_react.useRef)(SPAWN.z);
	const vy = (0, import_react.useRef)(0);
	const grounded = (0, import_react.useRef)(true);
	const vx = (0, import_react.useRef)(0);
	const vz = (0, import_react.useRef)(0);
	const bob = (0, import_react.useRef)(0);
	const dist = (0, import_react.useRef)(0);
	const lastStep = (0, import_react.useRef)(0);
	const typeAcc = (0, import_react.useRef)(0);
	const camYaw = (0, import_react.useRef)(0);
	const camPitch = (0, import_react.useRef)(0);
	const lastPose = (0, import_react.useRef)("stand");
	const savedYaw = (0, import_react.useRef)(0);
	const savedPitch = (0, import_react.useRef)(0);
	const fromTitle = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		input.bind();
		useGame.getState().setLockEl(gl.domElement);
		const coarse = window.matchMedia("(pointer: coarse)").matches;
		useGame.getState().setCoarse(coarse);
		const probe = {
			getYaw: () => yaw.current,
			getSpeed: () => Math.hypot(vx.current, vz.current),
			getPos: () => ({
				x: x.current,
				y: y.current,
				z: z.current
			}),
			getPose: () => useGame.getState().pose,
			setKeys: (codes) => input.setKeys(codes),
			setYaw: (v) => {
				yaw.current = v;
			},
			startGame: () => useGame.getState().enter()
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
		const dt = Math.min(delta, .1);
		const g = useGame.getState();
		sfx.tickAmbient(dt);
		if (g.phase === "title") {
			const t = state.clock.elapsedTime;
			camera.position.set(Math.sin(t * .15) * 3.4, 1.45 + Math.sin(t * .22) * .1, 1.6 + Math.cos(t * .15) * 1.6);
			camera.lookAt(-.2, 1, -1.2);
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
		if (pose === "stand") {
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
			const resolved = resolveCircle(x.current + vx.current * dt, z.current + vz.current * dt, worldColliders({
				entranceOpen: useGame.getState().entranceOpen,
				balconyOpen: useGame.getState().balconyOpen
			}));
			x.current = resolved.x;
			z.current = resolved.z;
			const spd = Math.hypot(vx.current, vz.current);
			if (spd > .4 && grounded.current) {
				dist.current += spd * dt;
				bob.current = Math.sin(dist.current * 9.5) * .028 * Math.min(1, spd / PLAYER.walk);
				if (dist.current - lastStep.current > 1.35) {
					lastStep.current = dist.current;
					sfx.foot(Math.floor(dist.current));
				}
			} else bob.current *= Math.exp(-8 * dt);
		} else {
			vx.current = 0;
			vz.current = 0;
			bob.current *= Math.exp(-8 * dt);
			if (pose === "desk") {
				typeAcc.current += dt;
				if (typeAcc.current > .22) {
					typeAcc.current = 0;
					sfx.type();
				}
			}
		}
		const nextPrompt = promptFor(nearestSpot(x.current, z.current), useGame.getState(), pose);
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
function Wall({ position, size }) {
	const m = useMats();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		position,
		castShadow: true,
		receiveShadow: true,
		material: m.wall,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: size })
	});
}
function CeilingFan() {
	const m = useMats();
	const blades = (0, import_react.useRef)(null);
	useFrame((_, delta) => {
		if (blades.current) blades.current.rotation.y += Math.min(delta, .1) * 3.2;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			.15,
			ROOM.height - .08,
			-.35
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: m.metal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.08,
					.08,
					.06,
					12
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					0,
					-.12,
					0
				],
				material: m.metal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.02,
					.02,
					.22,
					8
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
				ref: blades,
				position: [
					0,
					-.24,
					0
				],
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					rotation: [
						0,
						i * Math.PI * 2 / 3,
						0
					],
					position: [
						.28,
						0,
						0
					],
					material: m.darkWood,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.56,
						.02,
						.12
					] })
				}, i))
			})
		]
	});
}
function Room() {
	const m = useMats();
	const h = ROOM.height;
	const t = ROOM.wall;
	const hy = h / 2;
	const half = ROOM.doorW / 2;
	const roomDepth = ROOM.maxZ - ROOM.minZ;
	const roomWidth = ROOM.maxX - ROOM.minX;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				0,
				(ROOM.minZ + ROOM.maxZ) / 2
			],
			receiveShadow: true,
			material: m.floor,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [roomWidth + .3, roomDepth + .3] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				(HALL.minX + HALL.maxX) / 2,
				.002,
				(HALL.minZ + HALL.maxZ) / 2
			],
			receiveShadow: true,
			material: m.floorHall,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [hallWidth + .15, hallDepth + .15] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				0,
				(BALCONY.minZ + BALCONY.maxZ) / 2
			],
			receiveShadow: true,
			material: m.concrete,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [BALCONY.maxX - BALCONY.minX + .3, BALCONY.maxZ - BALCONY.minZ + .2] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				0,
				h,
				(ROOM.minZ + ROOM.maxZ) / 2
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			material: m.ceil,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [roomWidth + .3, roomDepth + .3] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				(HALL.minX + HALL.maxX) / 2,
				h,
				(HALL.minZ + HALL.maxZ) / 2
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			material: m.ceil,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [hallWidth + .15, hallDepth + .15] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				ROOM.minX - t / 2,
				hy,
				(ROOM.minZ + ROOM.maxZ) / 2
			],
			size: [
				t,
				h,
				roomDepth + t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				ROOM.maxX + t / 2,
				hy,
				(ROOM.minZ + ROOM.maxZ) / 2
			],
			size: [
				t,
				h,
				roomDepth + t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				ROOM.minX + southLeftW / 2,
				hy,
				ROOM.maxZ + t / 2
			],
			size: [
				southLeftW,
				h,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				e + half + southRightW / 2,
				hy,
				ROOM.maxZ + t / 2
			],
			size: [
				southRightW,
				h,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				e,
				h - .22,
				ROOM.maxZ + t / 2
			],
			size: [
				ROOM.doorW + .08,
				.44,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				ROOM.minX + northLeftW / 2,
				hy,
				ROOM.minZ - t / 2
			],
			size: [
				northLeftW,
				h,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				b,
				h - .22,
				ROOM.minZ - t / 2
			],
			size: [
				ROOM.doorW + .08,
				.44,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				b + half + betweenDoorWin / 2,
				hy,
				ROOM.minZ - t / 2
			],
			size: [
				Math.max(.08, betweenDoorWin),
				h,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				wx,
				h - .28,
				ROOM.minZ - t / 2
			],
			size: [
				ww + .08,
				.56,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				wx,
				.18,
				ROOM.minZ - t / 2
			],
			size: [
				ww + .08,
				.36,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				wx + ww / 2 + northRightW / 2,
				hy,
				ROOM.minZ - t / 2
			],
			size: [
				northRightW,
				h,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				HALL.minX - t / 2,
				hy,
				(HALL.minZ + HALL.maxZ) / 2
			],
			size: [
				t,
				h,
				hallDepth
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				HALL.maxX + t / 2,
				hy,
				(HALL.minZ + HALL.maxZ) / 2
			],
			size: [
				t,
				h,
				hallDepth
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				(HALL.minX + HALL.maxX) / 2,
				hy,
				HALL.maxZ + t / 2
			],
			size: [
				hallWidth + t * 2,
				h,
				t
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				ROOM.minX + .03,
				.05,
				(ROOM.minZ + ROOM.maxZ) / 2
			],
			material: m.linen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.04,
				.1,
				roomDepth - .2
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				ROOM.maxX - .03,
				.05,
				(ROOM.minZ + ROOM.maxZ) / 2
			],
			material: m.linen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.04,
				.1,
				roomDepth - .2
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				wx,
				1.35,
				ROOM.minZ - .02
			],
			material: m.glass,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [ww - .08, 1.85] })
		}),
		[
			-.45,
			0,
			.45
		].map((ox) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				wx + ox,
				1.35,
				ROOM.minZ + .01
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.018,
				1.85,
				.018
			] })
		}, ox)),
		[
			.7,
			1.35,
			2
		].map((oy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				wx,
				oy,
				ROOM.minZ + .01
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				ww - .1,
				.016,
				.016
			] })
		}, oy)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				wx - .34,
				1.38,
				ROOM.minZ + .08
			],
			material: m.curtain,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.62, 2.05] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				wx + .34,
				1.38,
				ROOM.minZ + .08
			],
			material: m.curtain,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.62, 2.05] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			position: [
				wx,
				2.38,
				ROOM.minZ + .1
			],
			rotation: [
				0,
				0,
				Math.PI / 2
			],
			material: m.metal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.015,
				.015,
				1.5,
				8
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeilingFan, {})
	] });
}
function Dust() {
	const positions = (0, import_react.useMemo)(() => {
		const n = 80;
		const arr = /* @__PURE__ */ new Float32Array(240);
		for (let i = 0; i < n; i++) {
			arr[i * 3] = (Math.random() - .5) * 8;
			arr[i * 3 + 1] = .4 + Math.random() * 2.2;
			arr[i * 3 + 2] = (Math.random() - .5) * 9;
		}
		return arr;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("points", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferGeometry", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferAttribute", {
		attach: "attributes-position",
		args: [positions, 3]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
		color: "#e8dcc8",
		size: .018,
		transparent: true,
		opacity: .28,
		depthWrite: false
	})] });
}
function SceneFog() {
	const { scene } = useThree();
	(0, import_react.useEffect)(() => {
		scene.fog = new Fog("#c5d8e6", 18, 48);
		scene.background = new Color("#9ecce8");
		return () => {
			scene.fog = null;
		};
	}, [scene]);
	return null;
}
function World() {
	const mats = useMaterials();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MatsProvider, {
		value: mats,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneFog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
				"#d7eef8",
				"#c8b898",
				.85
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
				intensity: .45,
				color: "#f2ebe0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					4,
					10,
					-8
				],
				intensity: 1.35,
				color: "#fff4d8",
				castShadow: true,
				"shadow-mapSize-width": 1024,
				"shadow-mapSize-height": 1024,
				"shadow-camera-near": 1,
				"shadow-camera-far": 28,
				"shadow-camera-left": -8,
				"shadow-camera-right": 8,
				"shadow-camera-top": 8,
				"shadow-camera-bottom": -8
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				position: [
					.2,
					2.5,
					-.3
				],
				intensity: 1.4,
				distance: 8,
				decay: 2,
				color: "#fff6e8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doors, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Furniture, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Exterior, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dust, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})
		]
	});
}
var GLBoundary = class extends import_react.Component {
	state = { err: false };
	static getDerivedStateFromError() {
		return { err: true };
	}
	render() {
		if (this.state.err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebGLError, {});
		return this.props.children;
	}
};
function Scene() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		shadows: true,
		dpr: [1, 1.5],
		camera: {
			fov: 72,
			near: .08,
			far: 70,
			position: [
				-.9,
				1.62,
				3.25
			]
		},
		gl: {
			antialias: true,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl }) => {
			gl.setClearColor("#9ecce8");
			gl.shadowMap.enabled = true;
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})
		})
	});
}
function HavenGame() {
	const [client, setClient] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setClient(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GLBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg touch-none",
		children: [
			client ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {}),
			client ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchControls, {}) : null
		]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HavenGame, {});
}
//#endregion
export { Home as component };
