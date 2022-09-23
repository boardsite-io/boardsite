// theme.ts
import { DefaultTheme } from "styled-components"
import { baseTheme } from "theme/baseTheme"

export const lightTheme: DefaultTheme = {
    ...baseTheme,
    palette: {
        primary: {
            main: "#f5f5f5",
            contrastText: "#000000",
        },
        secondary: {
            main: "#3F51B5",
            contrastText: "#ffffff",
        },
        editor: {
            background: "#bcaaa4",
            paper: "#f9fbff",
            selected: "#d9d7f1",
        },
        common: {
            warning: "#ff0000",
            rule: "#00000022",
        },
    },
}
