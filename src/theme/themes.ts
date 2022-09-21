import { appleTheme } from "./options/apple"
import { candyTheme } from "./options/candy"
import { darkTheme } from "./options/dark"
import { lightTheme } from "./options/light"
import { oceanTheme } from "./options/ocean"
import { orangeTheme } from "./options/orange"
import { purpleTheme } from "./options/purple"
import { soilTheme } from "./options/soil"
import { sunTheme } from "./options/sun"
import { tealTheme } from "./options/teal"

export enum ThemeOption {
    Apple,
    Candy,
    Dark,
    Light,
    Ocean,
    Orange,
    Purple,
    Soil,
    Sun,
    Teal,
}

export const themes = {
    [ThemeOption.Apple]: appleTheme,
    [ThemeOption.Candy]: candyTheme,
    [ThemeOption.Dark]: darkTheme,
    [ThemeOption.Light]: lightTheme,
    [ThemeOption.Ocean]: oceanTheme,
    [ThemeOption.Orange]: orangeTheme,
    [ThemeOption.Purple]: purpleTheme,
    [ThemeOption.Soil]: soilTheme,
    [ThemeOption.Sun]: sunTheme,
    [ThemeOption.Teal]: tealTheme,
}
