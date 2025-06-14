import {
    AreaChartOutlined,
    ArrowLeftOutlined,
    BarChartOutlined,
    ScheduleOutlined,
    TeamOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./App.scss";
import ThemeProvider from "./components/color_scheme/ThemeProvider.tsx";
import Games from "./components/games/Games";
import Leaderboard from "./components/leaderboard/Leaderboard.tsx";
import Leagues from "./components/leagues/Leagues.tsx";
import NoConnection from "./components/other/no_connection/NoConnection.tsx";
import Players from "./components/players/Players.tsx";
import Predictions from "./components/predictions/Predictions.tsx";
import Statistics from "./components/statistics/Statistics";
import { useAnimationOrigin } from "./context/AnimationOriginContext.tsx";
import { useLeague } from "./context/LeagueContext.tsx";
import { apiClient } from "./network/apiClient.ts";

export const headerHeight = 64;

const MotionHeader = motion.create(Header);

const tabOrder = ["games", "players", "statistics", "predictions", "leaderboard"];

const App = () => {
    const { league, setLeague } = useLeague();
    const { origin } = useAnimationOrigin();
    
    const [selectedKey, setSelectedKey] = useState("games");
    const [prevTab, setPrevTab] = useState("games");
    const [isConnected, setIsConnected] = useState(false);

    const slideUp = tabOrder.indexOf(selectedKey) > tabOrder.indexOf(prevTab);

    const getEntryAnimationVariants = (slideUp: boolean) => ({
        initial: { y: slideUp ? 1500 : -1500, opacity: 1 },
        animate: { y: 0, opacity: 1 },
    });

    const getExitAnimationVariants = (slideUp: boolean) => ({
        initial: { y: 0, opacity: 1 },
        animate: { y: slideUp ? 900 : -900, opacity: 1 },
    });

    const setKey = (key: string) => {
        setSelectedKey((prev) => {
            if (key !== prev) {
                setPrevTab(prev);
            }

            return key;
        })
    }

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await apiClient("ping");
                setIsConnected(!!response); // Convert to boolean
            } catch {
                setIsConnected(false);
            }
        };
        checkConnection();
    }, []);

    const renderContent = (key: string) => {
        switch (key) {
            case "games":
                return <Games />;
            case "players":
                return <Players />;
            case "statistics":
                return <Statistics />;
            case "predictions":
                return <Predictions />;
            case "leaderboard":
                return <Leaderboard />;
            default:
                return (
                    <div style={{ padding: "16px", color: "#F5D409" }}>
                        Select a menu item
                    </div>
                );
        }
    };

    return (
        <ThemeProvider primaryColor={"#F5D409"}>
            <div className="app">
                <div className="app__header" style={{ height: headerHeight + "px" }}>
                    <AnimatePresence mode="wait">
                        {league != null ? (
                            <MotionHeader
                                key="header-with-league"
                                className="app__header"
                                style={{ height: headerHeight }}
                                initial={{ y: -50, rotate: -10, opacity: 0 }}
                                animate={{ y: 0, rotate: 0, opacity: 1 }}
                                exit={{ y: -50, rotate: -10, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: -5 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ x: -20, rotate: -90, opacity: 0 }}
                                        animate={{ x: 0, rotate: 0, opacity: 1 }}
                                        exit={{ x: -10, rotate: -90, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        <Button
                                            type="text"
                                            size="large"
                                            icon={<ArrowLeftOutlined />}
                                            onClick={() => setLeague(null)}
                                            style={{ color: "#F5D409" }}
                                        />
                                    </motion.div>

                                    <img
                                        src="/logo_nobg.png"
                                        alt="Logo"
                                        style={{ height: 40, userSelect: "none" }}
                                        draggable={false}
                                    />
                                    
                                    <span style={{ color: "#F5D409", fontWeight: "bold", fontSize: 18 }}>
                                        Football Managing App - {league.name}
                                    </span>
                                </div>
                            </MotionHeader>
                        ) : (
                            <MotionHeader
                                key="header-no-league"
                                className="app__header"
                                style={{ height: headerHeight }}
                                initial={{ x: -100, rotate: -10, opacity: 0 }}
                                animate={{ x: 0, rotate: 0, opacity: 1 }}
                                exit={{ x: -100, rotate: -10, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            >
                                <img
                                    src="/logo_nobg.png"
                                    alt="Logo"
                                    style={{ height: 40, userSelect: "none" }}
                                    draggable={false}
                                />
                                
                                <span style={{ color: "#F5D409", fontWeight: "bold", fontSize: 18 }}>
                                    Football Managing App
                                </span>
                            </MotionHeader>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ width: "100%", height: "calc(100% - " + headerHeight + "px)" }}>
                    {!isConnected ? (
                        <NoConnection />
                    ) : league == null ? (
                        <motion.div
                            key="leagues"
                            initial={{ x: -2000, opacity: 0.5 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -2000, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                                height: "100%",
                                width: "100%",
                                transformOrigin: origin
                                    ? `${origin.x}px ${origin.y}px`
                                    : "50% 50%",
                            }}
                        >
                            <Leagues />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="main-content"
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="app__content"
                            style={{
                                transformOrigin: origin
                                    ? `${origin.x}px ${origin.y}px`
                                    : "50% 50%",
                            }}
                        >
                            <div className="app__sider">
                                <Menu
                                    className="app__sider__tabs"
                                    defaultSelectedKeys={["games"]}
                                    onClick={({ key }) => setKey(key)}
                                    items={[
                                        { key: "games", icon: <ScheduleOutlined />, label: "Games" },
                                        { key: "players", icon: <TeamOutlined />, label: "Players" },
                                        { key: "statistics", icon: <BarChartOutlined />, label: "Statistics" },
                                        { key: "predictions", icon: <AreaChartOutlined />, label: "Predictions" },
                                        { key: "leaderboard", icon: <TrophyOutlined />, label: "Leaderboard" },
                                    ]}
                                />
                            </div>
                            <div style={{ height: "100%", width: "calc(100% - 220px)", position: "relative", backgroundColor: "#1F1F1F", overflow: "hidden" }}>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={prevTab} // important for AnimatePresence to detect change
                                        variants={getExitAnimationVariants(!slideUp)}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        style={{ height: "100%", width: "100%", position: "absolute" }}
                                    >
                                        {renderContent(prevTab)}
                                    </motion.div>
                                </AnimatePresence>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={selectedKey} // important for AnimatePresence to detect change
                                        variants={getEntryAnimationVariants(slideUp)}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        style={{ height: "100%", width: "100%", }}
                                    >
                                        {renderContent(selectedKey)}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
