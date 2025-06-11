import { ConfigProvider } from "antd";
import { ReactNode } from "react";
import { ColorTheme, darker } from "./Colors";

const defaultColorTheme: ColorTheme = {
    name: "dark",
    backgroundPrimary: "#181818",
    backgroundSecondary: "#1F1F1F",
    border: "#2B2B2B",
    widgetBackground: "#404040",
};

interface ThemeProviderProps {
    colorTheme?: ColorTheme;
    primaryColor: string;
    children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ colorTheme = defaultColorTheme, primaryColor, children }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    lineWidthFocus: 0,
                    colorBgContainer: colorTheme.backgroundPrimary,
                    colorText: primaryColor,
                    colorPrimary: primaryColor,
                    colorBorder: primaryColor,
                    colorIcon: primaryColor,
                },
                components: {
                    Tabs: {
                        // TODO: doc the alpha numbers
                        colorText: colorTheme.backgroundPrimary,
                        colorBorderSecondary: colorTheme.backgroundPrimary + "33",
                        itemHoverColor: colorTheme.backgroundPrimary + "88",
                    },
                    Modal: {
                        contentBg: colorTheme.backgroundPrimary,
                        headerBg: colorTheme.backgroundPrimary,
                    },
                    Select: {
                        colorTextPlaceholder: primaryColor,
                    },
                    Menu: {
                        itemHoverColor: primaryColor,
                        itemColor: primaryColor,
                    },
                    Tree: {
                        // TODO: doc the alpha numbers
                        nodeHoverBg: primaryColor + "33",
                        nodeSelectedBg: primaryColor + "66",
                    },
                    Button: {
                        primaryColor: colorTheme.backgroundPrimary,
                    },
                },
            }}
        >
            <style>
                {`
                    .ant-dropdown-menu {
                        max-height: 200px;
                        overflow-x: hidden;
                        overflow-y: auto;
                        border-radius: 8px;
                        flex-direction: column;
    
                        &::-webkit-scrollbar {
                            width: 12px;
                        }
    
                        &::-webkit-scrollbar-thumb {
                            background-color: ${primaryColor};
                            border-radius: 8px;
                        }
    
                        &::-webkit-scrollbar-track {
                            background-color: ${darker(colorTheme.widgetBackground, 30)};
                            border-top-right-radius: 8px;
                            border-bottom-right-radius: 8px;
                        }
                    }

                    .ant-table-body {
                        &::-webkit-scrollbar {
                            width: 12px;
                        }

                        &::-webkit-scrollbar {
                            width: 12px;
                        }
    
                        &::-webkit-scrollbar-thumb {
                            background-color: ${primaryColor};
                            border-radius: 8px;
                        }
    
                        &::-webkit-scrollbar-track {
                            background-color: ${darker(colorTheme.widgetBackground, 30)};
                        }
                    }

                    * {
                        scrollbar-width: thick;
                        scrollbar-color: #F5D409 #1F1F1F;
                    }

                    *::-webkit-scrollbar {
                        width: 10px;
                    }

                    *::-webkit-scrollbar-thumb {
                        background-color: #F5D409;
                        border-radius: 5px;
                    }

                    *::-webkit-scrollbar-track {
                        background-color: #1F1F1F;
                    }

                    .ant-select-dropdown {
                        background-color: #292929 !important;
                        color: #F5D409 !important;
                        border: 1px solid #F5D409BB !important;
                        font-family: 'Bold-Font', sans-serif;

                        .ant-select-item {
                            color: #F5D409 !important;
                            font-weight: bold;

                            &:hover {
                            background-color: #3A3A27 !important;
                            }
                        }

                        .ant-select-item-option-selected {
                            background-color: #1F1F1F !important;
                        }
                    }

                `}
            </style>
            {children}
        </ConfigProvider>
    );
};

export default ThemeProvider;
