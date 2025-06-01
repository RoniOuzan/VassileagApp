import { createContext, useContext, useEffect, useState } from "react";
import { Game } from "../components/games/Games";
import { Player } from "../components/players/Players";
import { apiClient } from "../network/apiClient";

export const defaultLigue: Ligue = {
  name: "Ligue",
  players: [],
  games: [],
};

export type Ligue = {
  name: string;
  players: Player[];
  games: Game[];
};

type LigueContextType = {
  ligue: Ligue | null;
  setLigue: (ligue: Ligue | null) => void;
  ligues: Ligue[];
  setLigues: (ligues: Ligue[]) => void;
  updateLigues: (ligues: Ligue[]) => void;
  updateGame: (game: Game) => void;
  updatePlayer: (player: Player) => void;
};

const LigueContext = createContext<LigueContextType | undefined>(undefined);

export const LigueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ligue, setLigue] = useState<Ligue | null>(null);
  const [ligueList, setLigues] = useState<Ligue[]>([]);

  useEffect(() => {
    const fetchLigues = async () => {
      try {
        const response = await apiClient("get_ligues", {});
        if (response?.ligues) {
          setLigues(response.ligues);
        }
      } catch (error) {
        console.error("Failed to fetch ligues", error);
      }
    };

    fetchLigues();
  }, []);

  const updateLigues = async (ligues: Ligue[]) => {
    setLigues(ligues);

    if (ligue != null) {
      setLigue(ligues.find((l) => l.name === ligue.name) || ligue);
    }

    try {
      await apiClient("update_ligues", { ligues });
    } catch (error) {
      console.error("Failed to update ligues", error);
    }
  };

  const updateLiguesContent = (
    ligues: Ligue[] = ligueList,
    game?: Game,
    player?: Player
  ) => {
    if (!ligue) return;

    const updatedLigues = ligues.map((l) => {
      if (l.name !== ligue.name) return l;

      const updatedLigue: Ligue = {
        ...l,
        games: [...l.games],
        players: [...l.players],
      };

      if (game) {
        const index = updatedLigue.games.findIndex((g) => g.id === game.id);
        if (index !== -1) {
          updatedLigue.games[index] = game;
        } else {
          updatedLigue.games.push(game);
        }
      }

      if (player) {
        const index = updatedLigue.players.findIndex(
          (p) => p.name.toLowerCase() === player.name.toLowerCase()
        );
        if (index !== -1) {
          if (Object.values(player.ratings).every((val) => val === -1)) {
            updatedLigue.players.splice(index, 1);
          } else {
            updatedLigue.players[index] = player;
          }
        } else {
          updatedLigue.players.push(player);
        }
      }

      return updatedLigue;
    });

    updateLigues(updatedLigues);
  };

  return (
    <LigueContext.Provider
      value={{
        ligue,
        setLigue,
        ligues: ligueList,
        setLigues,
        updateLigues,
        updateGame: (game) => updateLiguesContent(undefined, game),
        updatePlayer: (player) =>
          updateLiguesContent(undefined, undefined, player),
      }}
    >
      {children}
    </LigueContext.Provider>
  );
};

export const useLigue = () => {
  const context = useContext(LigueContext);
  if (!context) throw new Error("useLigue must be used inside a LigueProvider");
  return context;
};
