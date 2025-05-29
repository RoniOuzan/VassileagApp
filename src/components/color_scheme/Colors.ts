export type ColorTheme = {
  name: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  border: string;
  widgetBackground: string;
};

export const Colors: Record<string, ColorTheme> = {
  dark: {
    name: "dark",
    backgroundPrimary: "#181818",
    backgroundSecondary: "#1F1F1F",
    border: "#2B2B2B",
    widgetBackground: "#404040",
  },
  light: {
    name: "light",
    backgroundPrimary: "#FFFFFF",
    backgroundSecondary: "#F9F9F9",
    border: "#EEEEEE",
    widgetBackground: "#E5E5E5",
  },
};

export const darker = (color: string, percent: number) : string => {
  color = color.replace(/^#/, '');

  const red = parseInt(color.substring(0, 2), 16);
  const green = parseInt(color.substring(2, 4), 16);
  const blue = parseInt(color.substring(4, 6), 16);

  const darkenFactor = 1 - percent / 100.0;
  const newRed = Math.max(0, Math.floor(red * darkenFactor));
  const newGreen = Math.max(0, Math.floor(green * darkenFactor));
  const newBlue = Math.max(0, Math.floor(blue * darkenFactor));

  return `#${newRed.toString(16).padStart(2, '0')}${newGreen.toString(16).padStart(2, '0')}${newBlue.toString(16).padStart(2, '0')}`;
}