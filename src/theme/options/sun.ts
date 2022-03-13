// theme.ts
import { DefaultTheme } from "styled-components"

export const sunTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#FFF176",
            contrastText: "#212121",
        },
        secondary: {
            main: "#FBC02D",
            contrastText: "#212121",
        },
        editor: {
            background: "#FFF9C4",
            paper: "#f9fbff",
            selected: "#FBC02D",
        },
        common: {
            warning: "#ff0000",
            rule: "#42424255",
        },
    },
}
