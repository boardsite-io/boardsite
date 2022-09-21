// theme.ts
import { DefaultTheme } from "styled-components"
import { baseTheme } from "theme/baseTheme"

export const tealTheme: DefaultTheme = {
    ...baseTheme,
    palette: {
        primary: {
            main: "#00695C",
            contrastText: "#E0F2F1",
        },
        secondary: {
            main: "#004D40",
            contrastText: "#E0F2F1",
        },
        editor: {
            background: "#009688",
            paper: "#f9fbff",
            selected: "#00796B",
        },
        common: {
            warning: "#ff0000",
            rule: "#E0F2F155",
        },
    },
}
