export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  getPos: () => { x: number; y: number; z: number };
  getPose: () => string;
  setKeys: (codes: string[]) => void;
  setYaw: (yaw: number) => void;
  startGame: () => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}
