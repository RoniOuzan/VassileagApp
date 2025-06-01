import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import { useLigue } from "../../context/LigueContext";
import AddLigue from "./AddLigue";
import LigueComponent from "./LigueComponent";
import "./Ligues.scss";

interface Props {
}

const Ligues: React.FC<Props> = ({ }) => {
    const { setLigue, ligues } = useLigue();

    const [createLigue, setCreateLigue] = useState<boolean>(false);

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