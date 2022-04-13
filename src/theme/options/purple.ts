// theme.ts
import { DefaultTheme } from "styled-components"

export const purpleTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#4A148C",
            contrastText: "#F3E5F5",
        },
        secondary: {
            main: "#5E35B1",
            contrastText: "#F3E5F5",
        },
        editor: {
            background: "#7E57C2",
            paper: "#f9fbff",
            selected: "#8E24AA",
        },
        common: {
            warning: "#ff0000",
            rule: "#F3E5F555",
        },
    },
}
