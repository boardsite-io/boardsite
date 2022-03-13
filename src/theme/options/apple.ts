// theme.ts
import { DefaultTheme } from "styled-components"

export const appleTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#C5E1A5",
            contrastText: "#212121",
        },
        secondary: {
            main: "#2E7D32",
            contrastText: "#E8F5E9",
        },
        editor: {
            background: "#E8F5E9",
            paper: "#f9fbff",
            selected: "#66BB6A",
        },
        common: {
            warning: "#ff0000",
            rule: "#1B5E2044",
        },
    },
}
