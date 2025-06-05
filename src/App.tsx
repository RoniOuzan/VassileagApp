import {
  ArrowLeftOutlined,
  BarChartOutlined,
  ScheduleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import "./App.scss";
import ThemeProvider from "./components/color_scheme/ThemeProvider.tsx";
import Games from "./components/games/Games";
import Ligues from "./components/ligues/Ligues.tsx";
import NoConnection from "./components/other/no_connection/NoConnection.tsx";
import Players from "./components/players/Players.tsx";
import Statistics from "./components/statistics/Statistics";
import { useLigue } from "./context/LigueContext.tsx";
import { apiClient } from "./network/apiClient.ts";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimationOrigin } from "./context/AnimationOriginContext.tsx";

export const headerHeight = 64;

const MotionHeader = motion(Header);

const tabOrder = ["games", "players", "statistics"];

const App = () => {
  const { ligue, setLigue } = useLigue();
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
    animate: { y: slideUp ? 1500 : -1500, opacity: 1 },
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
      <Layout className="app">
        <Header className="app__header" style={{ height: headerHeight, zIndex: "1" }}>
          <AnimatePresence mode="wait">
            {ligue != null && (
              <MotionHeader
                key="header-with-ligue"
                className="app__header"
                style={{ height: headerHeight }}
                initial={{ y: -50, rotate: -10, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -50, rotate: -10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
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
                    onClick={() => setLigue(null)}
                    style={{ color: "#F5D409" }}
                  />
                </motion.div>
                Football Managing App - {ligue?.name}
              </MotionHeader>
            )}

            {ligue == null && (
              <MotionHeader
                key="header-no-ligue"
                className="app__header"
                style={{ height: headerHeight }}
                initial={{ x: -50, rotate: -10, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                exit={{ x: -50, rotate: -10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <p>Football Managing App</p>
              </MotionHeader>
            )}
          </AnimatePresence>
        </Header>

        {!isConnected ? (
          <NoConnection />
        ) : ligue == null ? (
          <motion.div
            key="ligues"
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
            <Ligues />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              height: "100%",
              width: "100%",
              transformOrigin: origin
                ? `${origin.x}px ${origin.y}px`
                : "50% 50%",
            }}
          >
            <Layout>
              <Sider className="app__sider" trigger={null}>
                <Menu
                  className="app__sider__tabs"
                  defaultSelectedKeys={["games"]}
                  onClick={({ key }) => setKey(key)}
                  items={[
                    { key: "games", icon: <ScheduleOutlined />, label: "Games" },
                    { key: "players", icon: <TeamOutlined />, label: "Players" },
                    { key: "statistics", icon: <BarChartOutlined />, label: "Statistics" },
                  ]}
                />
              </Sider>
              <div style={{ height: "100%", width: "100%", position: "relative", backgroundColor: "#1F1F1F", zIndex: "0" }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={prevTab} // important for AnimatePresence to detect change
                    variants={getExitAnimationVariants(!slideUp)}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 1, ease: "easeOut" }}
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
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: "100%", width: "100%", }}
                  >
                    {renderContent(selectedKey)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Layout>
          </motion.div>
        )}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
