import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { Game } from "../games/Games";
import AddLigue from "./AddLigue";
import LigueComponent from "./LigueComponent";
import "./Ligues.scss";
import { useLigue } from "../../context/LigueContext";
import { Player } from "../../context/PlayerListContext";
import { headerHeight } from "../../App";

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

interface Props {
}

const Ligues: React.FC<Props> = ({ }) => {
    const socket = useSocket();
    const { ligue, setLigue } = useLigue();

    const show = ligue == null;

    const [createLigue, setCreateLigue] = useState<boolean>(false);
    const [ligues, setLigues] = useState<Ligue[]>([]);

    useEffect(() => {
        if (!socket) return;
    
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "ligues_list" && data.ligues) {
                setLigues(data.ligues);
            }
        };
    
        socket.addEventListener("message", handleMessage);
    
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "get_ligues" }));
        } else {
            socket.addEventListener(
                "open",
                () => {
                    socket.send(JSON.stringify({ type: "get_ligues" }));
                },
                { once: true }
            );
        }
    
        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);

    const updateLigues = (ligues: Ligue[]) => {
        setLigues(ligues);
    
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                type: "update_ligues",
                ligues: ligues,
                })
            );
        }
    };

    return (
        <div className="ligues" style={{ left: show ? "0px" : "-100%", height: `calc(100vh)`, top: `${headerHeight}px` }}>
            {ligues.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: "64px",
                    }}
                >
                    <div style={{ fontSize: "64px" }}>
                        No ligues have been created yet.
                    </div>
                    <div style={{ fontSize: "48px", color: "#888" }}>Come back later</div>
                </div>
            ) : (
                ligues.map((ligue, index) => (
                    <LigueComponent key={index} ligue={ligue} onClick={() => {
                        setLigue(ligue);
                    }} />
                ))
            )}

            <FloatButton
                className="ligues__button"
                icon={<PlusOutlined />}
                onClick={() => setCreateLigue(true)}
            />

            <AddLigue 
                show={createLigue} 
                ligueList={ligues}
                setShow={setCreateLigue} 
                updateLigues={updateLigues} 
            />
        </div>
    );
}

export default Ligues;