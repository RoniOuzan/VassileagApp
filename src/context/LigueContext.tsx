import { createContext, useContext, useState } from "react";
import { Ligue } from "../components/ligues/Ligues";

type LigueContextType = {
  ligue: Ligue | null;
  setLigue: (ligue: Ligue | null) => void;
};

const LigueContext = createContext<LigueContextType | undefined>(undefined);

export const LigueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ligue, setLigue] = useState<Ligue | null>(null);

  return (
    <LigueContext.Provider value={{ ligue, setLigue }}>
      {children}
    </LigueContext.Provider>
  );
};

export const useLigue = () => {
  const context = useContext(LigueContext);
  if (!context) throw new Error("useLigue must be used inside a LigueProvider");
  return context;
};
