import { darkTheme } from "./dark"
import { lightTheme } from "./light"

export enum Theme {
    Light,
    Dark,
}

export const themes = {
    [Theme.Light]: lightTheme,
    [Theme.Dark]: darkTheme,
}
