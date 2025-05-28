/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import AddGame from "./AddGame";
import GameComponent from "./GameComponent";
import "./Games.scss";
import { Player } from "../players/Players";

export type Game = {
    date: string;
    team1: Team;
    team2: Team;
};

export type Team = {
    goals: number;
    players: Player[];
};

type MongoGame = Game & { _id?: string };

const Games: React.FC = () => {
    const socket = useSocket();
    
    const [games, setGames] = useState<Game[]>([]);

    const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
    const [newGame, setNewGame] = useState<Game>({
        date: "",
        team1: { goals: 0, players: [{ name: "", statistics: { goals: 0, assists: 0 } }] },
        team2: { goals: 0, players: [{ name: "", statistics: { goals: 0, assists: 0 } }] },
    });

    useEffect(() => {
        if (!socket) return;
    
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "games_list") {
                const cleanedGames: Game[] = data.games.map(({ _id, ...rest }: MongoGame) => rest);
                
                setGames(cleanedGames);
            }
        };
    
        socket.addEventListener("message", handleMessage);
    
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_games" }));
        } else {
            socket.addEventListener(
                "open",
                () => socket.send(JSON.stringify({ type: "get_games" })),
                { once: true }
            );
        }
    
        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);
    

    const updateGames = (games: Game[]) => {
        setGames(games);
    
        if (socket && socket.readyState === WebSocket.OPEN) {
            const cleaned = games.map(({ _id, ...rest }: MongoGame) => rest);
    
            socket.send(
                JSON.stringify({
                    type: "update_games",
                    games: cleaned,
                })
            );
        }
    };

    return (
        <div className="games">
            {games.length == 0 ?
                <>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "64px"}}>
                        <div style={{ fontSize: "64px" }}>No game has happened yet.</div>
                        <div style={{ fontSize: "48px", color: "#888" }}>Come back later</div>
                    </div>
                </>
            :
                games.map((game, index) => (
                    <GameComponent key={index} game={game} />
                ))}
                <FloatButton className="games__button" icon={<PlusOutlined />} onClick={() => setIsCreateGameOpen(true)} />

                <AddGame
                    show={isCreateGameOpen}
                    setIsCreateGameOpen={setIsCreateGameOpen}
                    games={games}
                    newGame={newGame}
                    setNewGame={setNewGame}
                    updateGames={updateGames}
                    playersList={["Player 1", "Player 2", "Player 3", "Player 4"]}
                />
        </div>
    );
};

export default Games;
