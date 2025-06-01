import { createContext, useContext, useState } from "react";
import { useSocket } from "./SocketContext";
import { Game } from "../components/games/Games";
import { Player } from "../components/players/Players";

export const defaultLigue: Ligue = {
    name: "Ligue",
    players: [],
    games: [],
}

export type Ligue = {
    name: string;
    players: Player[];
    games: Game[];
}

type LigueContextType = {
  ligue: Ligue | null;
  setLigue: (ligue: Ligue | null) => void;
  ligues: Ligue[];
  setLigues: (ligues: Ligue[]) => void;
  updateLigues: (ligues: Ligue[]) => void;
  updateGame: (game: Game) => void;
  updatePlayer: (game: Player) => void;
};

const LigueContext = createContext<LigueContextType | undefined>(undefined);

export const LigueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useSocket();
  
  const [ligue, setLigue] = useState<Ligue | null>(null);
  const [ligueList, setLigues] = useState<Ligue[]>([]);

  const updateLigues = (ligues: Ligue[]) => {
    setLigues(ligues);

    if (ligue != null) {
      setLigue(ligues.find(l => l.name == ligue.name) || ligue);
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "update_ligues",
          ligues: ligues,
        })
      );
    }
  }

  const updateLiguesContent = (ligues: Ligue[] = ligueList, game?: Game, player?: Player) => {
    if (!ligue) return; // No selected ligue

    const updatedLigues = ligues.map((l) => {
      if (l.name !== ligue.name) return l; // Don't change other ligues

      // Deep copy selected ligue
      const updatedLigue: Ligue = {
        ...l,
        games: [...l.games],
        players: [...l.players],
      };

      // Update game if provided
      if (game) {
        const gameIndex = updatedLigue.games.findIndex(g => g.id === game.id);
        if (gameIndex !== -1) {
          updatedLigue.games[gameIndex] = game;
        } else {
          updatedLigue.games.push(game); // Add if not found
        }
      }

      // Update player if provided
      if (player) {
        const playerIndex = updatedLigue.players.findIndex(p => p.name.toLowerCase() === player.name.toLowerCase());
        if (playerIndex !== -1) {
          if (Object.values(player.ratings).every((val) => val === -1)) {
            updatedLigue.players.splice(playerIndex, 1); // Remove if not found
          } else {
            updatedLigue.players[playerIndex] = player;
          }
        } else {
          updatedLigue.players.push(player); // Add if not found
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
        updatePlayer: (player) => updateLiguesContent(undefined, undefined, player),
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
