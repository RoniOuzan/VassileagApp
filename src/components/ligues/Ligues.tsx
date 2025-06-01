import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useEffect, useState } from "react";
import { useLigue } from "../../context/LigueContext";
import { useSocket } from "../../context/SocketContext";
import AddLigue from "./AddLigue";
import LigueComponent from "./LigueComponent";
import "./Ligues.scss";

interface Props {
}

const Ligues: React.FC<Props> = ({ }) => {
    const socket = useSocket();
    const { setLigue, ligues, setLigues } = useLigue();

    const [createLigue, setCreateLigue] = useState<boolean>(false);

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

    return (
        <div className="ligues">
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
                setShow={setCreateLigue} 
            />
        </div>
    );
}

export default Ligues;