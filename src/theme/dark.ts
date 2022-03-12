// theme.ts
import { DefaultTheme } from "styled-components"

export const darkTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#37474F",
            contrastText: "#E0E0E0",
        },
        secondary: {
            main: "#00796b",
            contrastText: "#ffffff",
        },
        editor: {
            background: "#bcaaa4",
            paper: "#f9fbff",
            selected: "#00838F",
        },
        common: {
            warning: "#ff0000",
            rule: "#00000022",
        },
    },
}
