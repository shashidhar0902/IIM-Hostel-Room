import { create } from "zustand";

export type GamePhase = "title" | "playing" | "paused";
export type Pose = "stand" | "bed" | "desk" | "balconyChair";
export type Place = "hallway" | "loft" | "balcony";

type GameState = {
  phase: GamePhase;
  pose: Pose;
  place: Place;
  prompt: string | null;
  entranceOpen: boolean;
  balconyOpen: boolean;
  lampOn: boolean;
  roomLightOn: boolean;
  muted: boolean;
  coarse: boolean;
  lockEl: HTMLElement | null;
  setLockEl: (el: HTMLElement | null) => void;
  setCoarse: (v: boolean) => void;
  setPrompt: (v: string | null) => void;
  setPlace: (v: Place) => void;
  enter: () => void;
  pause: () => void;
  resume: () => void;
  sit: (pose: Exclude<Pose, "stand">) => void;
  stand: () => void;
  toggleEntrance: () => void;
  toggleBalcony: () => void;
  toggleLamp: () => void;
  toggleRoomLight: () => void;
  toggleMute: () => void;
};

export const useGame = create<GameState>((set, get) => ({
  phase: "title",
  pose: "stand",
  place: "hallway",
  prompt: null,
  entranceOpen: false,
  balconyOpen: false,
  lampOn: true,
  roomLightOn: true,
  muted: false,
  coarse: false,
  lockEl: null,
  setLockEl: (el) => set({ lockEl: el }),
  setCoarse: (v) => set({ coarse: v }),
  setPrompt: (v) => set({ prompt: v }),
  setPlace: (v) => set({ place: v }),
  enter: () => set({ phase: "playing", pose: "stand" }),
  pause: () => {
    if (get().phase === "playing") set({ phase: "paused" });
  },
  resume: () => {
    if (get().phase === "paused") set({ phase: "playing" });
  },
  sit: (pose) => set({ pose, prompt: "E or movement to stand" }),
  stand: () => set({ pose: "stand" }),
  toggleEntrance: () => set({ entranceOpen: !get().entranceOpen }),
  toggleBalcony: () => set({ balconyOpen: !get().balconyOpen }),
  toggleLamp: () => set({ lampOn: !get().lampOn }),
  toggleRoomLight: () => set({ roomLightOn: !get().roomLightOn }),
  toggleMute: () => set({ muted: !get().muted }),
}));
