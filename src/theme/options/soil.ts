// theme.ts
import { DefaultTheme } from "styled-components"
import { baseTheme } from "theme/baseTheme"

export const soilTheme: DefaultTheme = {
    ...baseTheme,
    palette: {
        primary: {
            main: "#8D6E63",
            contrastText: "#EFEBE9",
        },
        secondary: {
            main: "#6D4C41",
            contrastText: "#EFEBE9",
        },
        editor: {
            background: "#BCAAA4",
            paper: "#f9fbff",
            selected: "#4E342E",
        },
        common: {
            warning: "#ff0000",
            rule: "#EFEBE944",
        },
    },
}
