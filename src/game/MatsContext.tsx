import { createContext, useContext } from "react";
import type { Mats } from "./textures";

const MatsContext = createContext<Mats | null>(null);

export const MatsProvider = MatsContext.Provider;

export function useMats(): Mats {
  const m = useContext(MatsContext);
  if (!m) throw new Error("MatsProvider missing");
  return m;
}
