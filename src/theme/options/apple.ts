// theme.ts
import { DefaultTheme } from "styled-components"

export const appleTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#2E7D32",
            contrastText: "#EFEBE9",
        },
        secondary: {
            main: "#43A047",
            contrastText: "#EFEBE9",
        },
        editor: {
            background: "#81C784",
            paper: "#f9fbff",
            selected: "#5D4037",
        },
        common: {
            warning: "#ff0000",
            rule: "#1B5E2044",
        },
    },
}
