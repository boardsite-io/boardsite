// theme.ts
import { DefaultTheme } from "styled-components"

export const orangeTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#EF6C00",
            contrastText: "#FFF3E0",
        },
        secondary: {
            main: "#DD2C00",
            contrastText: "#FFF3E0",
        },
        editor: {
            background: "#FFE0B2",
            paper: "#f9fbff",
            selected: "#FF8F00",
        },
        common: {
            warning: "#ff0000",
            rule: "#1B5E2044",
        },
    },
}
