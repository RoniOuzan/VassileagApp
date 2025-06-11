import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useState } from "react";
import AddLeague from "./AddLeague";
import LeagueComponent from "./LeagueComponent";
import "./Leagues.scss";
import { useLeague } from "../../context/LeagueContext";

const Leagues: React.FC = () => {
    const { setLeague, leagues } = useLeague();

    const [createLeague, setCreateLeague] = useState<boolean>(false);

    return (
        <div className="leagues">
            {leagues.length === 0 ? (
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
                        No leagues have been created yet.
                    </div>
                    <div style={{ fontSize: "48px", color: "#888" }}>Come back later</div>
                </div>
            ) : (
                leagues.map((league, index) => (
                    <LeagueComponent key={index} league={league} onClick={() => {
                        setLeague(league);
                    }} />
                ))
            )}

            <FloatButton
                className="leagues__button"
                icon={<PlusOutlined />}
                onClick={() => setCreateLeague(true)}
            />

            <AddLeague 
                show={createLeague} 
                setShow={setCreateLeague} 
            />
        </div>
    );
}

export default Leagues;