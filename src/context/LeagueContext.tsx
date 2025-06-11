import { createContext, useContext, useEffect, useState } from "react";
import { Game } from "../components/games/Games";
import { Player } from "../components/players/Players";
import { apiClient } from "../network/apiClient";

export const defaultLeague: League = {
  name: "League",
  players: [],
  games: [],
};

export type League = {
  name: string;
  players: Player[];
  games: Game[];
};

type LeagueContextType = {
  league: League | null;
  setLeague: (league: League | null) => void;
  leagues: League[];
  setLeagues: (leagues: League[]) => void;
  updateLeagues: (leagues: League[]) => void;
  updateGame: (game: Game) => void;
  updatePlayer: (player: Player) => void;
};

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [league, setLeague] = useState<League | null>(null);
  const [leagueList, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await apiClient("get_leagues", {});
        if (response?.leagues) {
          setLeagues(response.leagues);
        }
      } catch (error) {
        console.error("Failed to fetch leagues", error);
      }
    };

    fetchLeagues();
  }, []);

  const updateLeagues = async (leagues: League[]) => {
    setLeagues(leagues);

    if (league != null) {
      setLeague(leagues.find((l) => l.name === league.name) || league);
    }

    try {
      await apiClient("update_leagues", { leagues });
    } catch (error) {
      console.error("Failed to update leagues", error);
    }
  };

  const updateLeaguesContent = (
    leagues: League[] = leagueList,
    game?: Game,
    player?: Player
  ) => {
    if (!league) return;

    const updatedLeagues = leagues.map((l) => {
      if (l.name !== league.name) return l;

      const updatedLeague: League = {
        ...l,
        games: [...l.games],
        players: [...l.players],
      };

      if (game) {
        const index = updatedLeague.games.findIndex((g) => g.id === game.id);
        if (index !== -1) {
          updatedLeague.games[index] = game;
        } else {
          updatedLeague.games.push(game);
        }
      }

      if (player) {
        const index = updatedLeague.players.findIndex(
          (p) => p.name.toLowerCase() === player.name.toLowerCase()
        );
        if (index !== -1) {
          if (Object.values(player.ratings).every((val) => val === -1)) {
            updatedLeague.players.splice(index, 1);
          } else {
            updatedLeague.players[index] = player;
          }
        } else {
          updatedLeague.players.push(player);
        }
      }

      return updatedLeague;
    });

    updateLeagues(updatedLeagues);
  };

  return (
    <LeagueContext.Provider
      value={{
        league,
        setLeague,
        leagues: leagueList,
        setLeagues,
        updateLeagues,
        updateGame: (game) => updateLeaguesContent(undefined, game),
        updatePlayer: (player) =>
          updateLeaguesContent(undefined, undefined, player),
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) throw new Error("useLeague must be used inside a LeagueProvider");
  return context;
};
