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

export enum Theme {
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
    [Theme.Apple]: appleTheme,
    [Theme.Candy]: candyTheme,
    [Theme.Dark]: darkTheme,
    [Theme.Light]: lightTheme,
    [Theme.Ocean]: oceanTheme,
    [Theme.Orange]: orangeTheme,
    [Theme.Purple]: purpleTheme,
    [Theme.Soil]: soilTheme,
    [Theme.Sun]: sunTheme,
    [Theme.Teal]: tealTheme,
}
