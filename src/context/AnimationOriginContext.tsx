import { createContext, useContext, useState } from "react";

const AnimationOriginContext = createContext<{
  origin: { x: number; y: number } | null;
  setAnimationOrigin: (pos: { x: number; y: number }) => void;
}>({
  origin: null,
  setAnimationOrigin: () => {},
});

export const AnimationOriginProvider = ({ children }: { children: React.ReactNode }) => {
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  return (
    <AnimationOriginContext.Provider value={{ origin, setAnimationOrigin: setOrigin }}>
      {children}
    </AnimationOriginContext.Provider>
  );
};

export const useAnimationOrigin = () => useContext(AnimationOriginContext);
