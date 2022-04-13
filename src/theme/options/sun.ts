// theme.ts
import { DefaultTheme } from "styled-components"

export const sunTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#FDD835",
            contrastText: "#212121",
        },
        secondary: {
            main: "#FFEE58",
            contrastText: "#212121",
        },
        editor: {
            background: "#FFF59D",
            paper: "#f9fbff",
            selected: "#FFF176",
        },
        common: {
            warning: "#ff0000",
            rule: "#42424255",
        },
    },
}
