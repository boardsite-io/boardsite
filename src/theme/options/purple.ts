// theme.ts
import { DefaultTheme } from "styled-components"

export const purpleTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#AB47BC",
            contrastText: "#F3E5F5",
        },
        secondary: {
            main: "#7B1FA2",
            contrastText: "#F3E5F5",
        },
        editor: {
            background: "#4A148C",
            paper: "#f9fbff",
            selected: "#7B1FA2",
        },
        common: {
            warning: "#ff0000",
            rule: "#F3E5F555",
        },
    },
}
